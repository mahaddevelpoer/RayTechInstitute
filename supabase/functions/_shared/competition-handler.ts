import {CompetitionError,createCompetitionService,pakistanWeek,type CompetitionRepository} from './competition-service.ts';
interface Dependencies{
 repo:CompetitionRepository;origins:string[];siteKey:string;turnstileSecret:string;ipSalt:string;
 verifyIdentity:(authorization:string|null)=>Promise<{uid:string}>;
 verifyAdminIdentity?:(authorization:string|null)=>Promise<{uid:string}>;
 verifyFreshIdentity?:(authorization:string|null)=>Promise<{uid:string}>;
 verifyAdmin:(authorization:string|null)=>Promise<boolean>;
 trustedIp:(request:Request)=>string|null;proxyRequired?:boolean;proxySecret?:string;
 fetcher?:typeof fetch;localPreview?:boolean;now?:()=>number;
}
async function body(request:Request){
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new CompetitionError(415,'Send a JSON request.');
 const reader=request.body?.getReader();if(!reader)throw new CompetitionError(400,'Missing request.');let size=0,text='';const decoder=new TextDecoder('utf-8',{fatal:true});const timer=setTimeout(()=>void reader.cancel(),8000);
 try{while(true){const item=await reader.read();if(item.done)break;size+=item.value.length;if(size>1000000){await reader.cancel();throw new CompetitionError(413,'This request is too large. Import a smaller question bank.');}text+=decoder.decode(item.value,{stream:true});}text+=decoder.decode();const data=JSON.parse(text);if(!data||Array.isArray(data)||typeof data!=='object')throw 0;return data;}catch(error){if(error instanceof CompetitionError)throw error;throw new CompetitionError(400,'The request could not be read.');}finally{clearTimeout(timer);reader.releaseLock();}
}
export async function competitionIpHash(ip:string,salt:string,now:number){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(salt),{name:'HMAC',hash:'SHA-256'},false,['sign']);const bytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(pakistanWeek(now).startsAt+'|'+ip));return Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,'0')).join('');}
export function createCompetitionHandler(deps:Dependencies){
 const now=deps.now||Date.now;const service=createCompetitionService(deps.repo,{now});const cache=new Map<string,{until:number;data:unknown}>();
 return async(request:Request)=>{
  const origin=request.headers.get('origin');const headers:Record<string,string>={'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin','Access-Control-Allow-Headers':'authorization,content-type,apikey,x-client-info','Access-Control-Allow-Methods':'GET,POST,OPTIONS'};
  if(origin&&deps.origins.includes(origin))headers['Access-Control-Allow-Origin']=origin;
  const respond=(status:number,data:unknown,publicCache=false)=>new Response(JSON.stringify(data),{status,headers:{...headers,...(publicCache?{'Cache-Control':'public,max-age=30,s-maxage=30'}:{})}});
  if(origin&&!deps.origins.includes(origin))return respond(403,{error:'This origin is not allowed.'});if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  try{
   const url=new URL(request.url);
   if(url.pathname.endsWith('/maintenance')){
    if(request.method!=='POST'||!deps.proxySecret||request.headers.get('x-competition-proxy')!==deps.proxySecret||request.headers.get('x-competition-job')!==deps.proxySecret)throw new CompetitionError(403,'This operation is not available.');
    return respond(200,{success:true,data:await deps.repo.call('cleanup',null)});
   }
   if(request.method==='GET'){
    const action=url.searchParams.get('action')||'overview';if(!['overview','result'].includes(action))throw new CompetitionError(400,'Unknown public competition request.');
    const id=url.searchParams.get(action==='result'?'resultId':'roundId')||'';if(id&&!/^[a-zA-Z0-9-]{1,100}$/.test(id))throw new CompetitionError(400,'Invalid competition reference.');
    const key=action+':'+id;let entry=cache.get(key);
    if(!entry||entry.until<=now()){
     const data=action==='overview'?{...await service.overview(id||undefined),turnstileSiteKey:deps.siteKey,localPreview:deps.localPreview===true}:await service.result(id);
     entry={until:now()+30000,data};if(cache.size>100)cache.clear();cache.set(key,entry);
    }return respond(200,{success:true,data:entry.data},true);
   }
   if(request.method!=='POST')throw new CompetitionError(405,'Use GET or POST.');
   if(deps.proxyRequired&&(!deps.proxySecret||request.headers.get('x-competition-proxy')!==deps.proxySecret))throw new CompetitionError(503,'The competition security connection is not configured yet. Your attempt has not been used.');
   const authorization=request.headers.get('authorization');const adminPath=url.pathname.endsWith('/admin');const identity=await(adminPath&&deps.verifyAdminIdentity?deps.verifyAdminIdentity:deps.verifyIdentity)(authorization);
   if(!await deps.repo.call('rate',null,{subject:'account:'+identity.uid,limit:120}))throw new CompetitionError(429,'Please slow down and resume your existing attempt.');
   const ip=deps.trustedIp(request);
   if(ip&&deps.ipSalt){const hash=await competitionIpHash(ip,deps.ipSalt,now());if(!await deps.repo.call('rate',null,{subject:'ip:'+hash,limit:1500}))throw new CompetitionError(429,'This network is busy. Please try again shortly.');}
   const input=await body(request);if(Object.keys(input).some(key=>!['action','payload'].includes(key))||typeof input.action!=='string'||!input.payload||Array.isArray(input.payload)||typeof input.payload!=='object')throw new CompetitionError(400,'Provide an action and payload only.');
   const {action,payload}=input;const allowed:Record<string,string[]>={me:[],state:[],start:['roundId','displayName','photoUrl','turnstileToken','consent'],answer:['attemptId','questionId','option'],event:['type'],review:['attemptId'],admin_rounds:[],admin_attempts:['roundId'],set_review:['attemptId','held','reason'],save_round:['config','bank','enabled']};
   if(!Object.prototype.hasOwnProperty.call(allowed,action)||Object.keys(payload).some(key=>!allowed[action].includes(key)))throw new CompetitionError(400,'Unsupported competition action or fields.');
   if(adminPath&&!['admin_rounds','admin_attempts','set_review','save_round'].includes(action))throw new CompetitionError(403,'This path is only for administration.');
   let data;
   if(['admin_rounds','admin_attempts','set_review','save_round'].includes(action)){
    if(!await deps.verifyAdmin(authorization))throw new CompetitionError(403,'An authorised administrator is required.');
    data=action==='admin_rounds'?await service.adminRounds():action==='admin_attempts'?await service.adminAttempts(String(payload.roundId||'')):action==='set_review'?await service.setReview(identity.uid,payload):await service.saveRound(payload);
   }else if(action==='start'){
    if(payload.consent!==true||typeof payload.roundId!=='string'||payload.roundId.length>80)throw new CompetitionError(400,'Accept the competition rules before starting.');
    if(!deps.localPreview){
     if(!deps.turnstileSecret||!deps.siteKey||!deps.ipSalt)throw new CompetitionError(503,'Competition protection is not ready. Your weekly attempt has not been used.');
     if(!deps.verifyFreshIdentity)throw new CompetitionError(503,'Competition sign-in verification is not configured. Your attempt was not used.');
     const fresh=await deps.verifyFreshIdentity(authorization);if(fresh.uid!==identity.uid)throw new CompetitionError(401,'Sign in again before starting the competition.');
     if(typeof payload.turnstileToken!=='string'||payload.turnstileToken.length<10||payload.turnstileToken.length>2048)throw new CompetitionError(400,'Complete the security check before starting.');
     const response=await(deps.fetcher||fetch)('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:deps.turnstileSecret,response:payload.turnstileToken,...(ip?{remoteip:ip}:{})}),signal:AbortSignal.timeout(8000)});
     if(!response.ok)throw new CompetitionError(503,'The security check is unavailable. Your attempt was not used.');const verification=await response.json();
     const host=origin?new URL(origin).hostname:null;if(!verification.success||verification.action!=='competition-start'||host&&verification.hostname!==host)throw new CompetitionError(400,'The security check expired. Please try it again.');
    }
    data=await service.start(identity.uid,payload);
   }else if(action==='me')data=await service.me(identity.uid);
   else if(action==='state')data=await service.state(identity.uid);
   else if(action==='event')data=await service.event(identity.uid,payload.type);
   else if(action==='review'){if(typeof payload.attemptId!=='string'||!/^[a-f0-9-]{36}$/.test(payload.attemptId))throw new CompetitionError(400,'Provide a valid attempt reference.');data=await service.review(identity.uid,payload.attemptId);}
   else{
    if(typeof payload.attemptId!=='string'||typeof payload.questionId!=='string'||payload.questionId.length>100||payload.option!==null&&(!Number.isInteger(payload.option)||payload.option<0||payload.option>3))throw new CompetitionError(400,'Choose one of the four answers.');
    data=await service.answer(identity.uid,payload);
   }
   return respond(200,{success:true,data});
  }catch(error){if(error instanceof CompetitionError)return respond(error.status,{error:error.message});return respond(503,{error:'Competition could not be reached. Your confirmed answers are safe; resume before trying again.'});}
 };
}
