import {createCompetitionTokenVerifier} from '../_shared/competition-auth.ts';
import {verifyStudent} from '../_shared/student-auth.ts';
import {winnerEmail} from '../_shared/winner-email.ts';
const verify=createCompetitionTokenVerifier('raytechinstitute');
async function rpc(action:string,uid:string|null,payload:Record<string,unknown>={}){const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';const response=await fetch(Deno.env.get('SUPABASE_URL')+'/rest/v1/rpc/competition_notifications',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({p_action:action,p_uid:uid,p_payload:payload}),signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error('Storage unavailable');return response.json();}
Deno.serve(async request=>{
 const origin=request.headers.get('origin')||'';const allowed=(Deno.env.get('ALLOWED_ORIGINS')||'https://raytechinstitute.com,https://raytechinstitute.web.app').split(',');const headers={'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':allowed.includes(origin)?origin:allowed[0],'Access-Control-Allow-Headers':'authorization,content-type,apikey','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin'};
 const reply=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers});
 if(origin&&!allowed.includes(origin))return reply(403,{error:'Origin not allowed'});if(request.method==='OPTIONS')return new Response(null,{status:204,headers});if(request.method!=='POST')return reply(405,{error:'Use POST'});
 try{
 if(new URL(request.url).pathname.endsWith('/dispatch')){const secret=Deno.env.get('COMPETITION_NOTIFICATION_JOB_SECRET');if(!secret||request.headers.get('x-notification-job')!==secret)return reply(403,{error:'Not authorised'});
 const key=Deno.env.get('RESEND_API_KEY')||Deno.env.get('resend_email'),from=Deno.env.get('COMPETITION_EMAIL_FROM')||'RayTech Institute <notifications@raytechinstitute.com>';if(!key||!from)return reply(503,{error:'Email sender not configured'});
 const pending=await rpc('pending',null);let sent=0;for(const winner of pending){const content=winnerEmail(winner);const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json','Idempotency-Key':'competition-winner-'+winner.id},body:JSON.stringify({from,to:[winner.email],...content}),signal:AbortSignal.timeout(10000)});if(!r.ok)break;await rpc('sent',null,{id:winner.id});sent++;}return reply(200,{success:true,sent});}
 const raw=await request.text();if(raw.length>5000)return reply(413,{error:'Request too large'});const input=JSON.parse(raw);
 if(input.action==='unsubscribe'){if(!/^[a-f0-9]{64}$/.test(input.token||''))return reply(400,{error:'Invalid notification link'});await rpc('unsubscribe',null,{token:input.token});return reply(200,{success:true});}
 const auth=request.headers.get('authorization');const identity=await verify(auth);await verifyStudent(auth,{projectId:'raytechinstitute',webApiKey:Deno.env.get('FIREBASE_WEB_API_KEY')||''});
 if(input.action==='preferences')return reply(200,{success:true,data:await rpc('preferences',identity.uid)});
 if(input.action!=='save'||typeof input.enabled!=='boolean')return reply(400,{error:'Invalid request'});
 const part=auth!.slice(7).split('.')[1].replace(/-/g,'+').replace(/_/g,'/');const claims=JSON.parse(atob(part.padEnd(Math.ceil(part.length/4)*4,'=')));if(claims.email_verified!==true||typeof claims.email!=='string'||!claims.email.includes('@'))return reply(400,{error:'A verified Google email is required'});
 const token=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(n=>n.toString(16).padStart(2,'0')).join('');await rpc('save',identity.uid,{email:claims.email,enabled:input.enabled,token});return reply(200,{success:true});
 }catch{return reply(503,{error:'Notification preferences could not be updated. Please retry.'});}
});
