import {CompetitionError} from './competition-service.ts';
const decode=(part:string)=>{try{return Uint8Array.from(atob(part.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(part.length/4)*4,'=')),c=>c.charCodeAt(0));}catch{throw new CompetitionError(401,'Sign in with Google before entering the weekly competition.');}};
export function createCompetitionTokenVerifier(projectId:string,fetcher:typeof fetch=fetch,now=Date.now){
 let keys:JsonWebKey[]=[];let expires=0;let refreshed=0;let pending:Promise<void>|null=null;
 async function refresh(){if(pending)return pending;pending=(async()=>{const r=await fetcher('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com',{signal:AbortSignal.timeout(8000)});if(!r.ok)throw new CompetitionError(503,'Google sign-in verification is temporarily unavailable.');const data=await r.json();if(!Array.isArray(data.keys)||data.keys.length>20)throw new CompetitionError(503,'Google sign-in verification is temporarily unavailable.');keys=data.keys;refreshed=now();expires=now()+Math.min(3600,Number(r.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1]||300))*1000;})().finally(()=>pending=null);return pending;}
 return async(authorization:string|null)=>{
  const deny=()=>new CompetitionError(401,'Sign in with Google before entering the weekly competition.');
  if(!projectId||!authorization?.startsWith('Bearer ')||authorization.length>12000)throw deny();const parts=authorization.slice(7).trim().split('.');if(parts.length!==3)throw deny();
  let header,claims;try{header=JSON.parse(new TextDecoder().decode(decode(parts[0])));claims=JSON.parse(new TextDecoder().decode(decode(parts[1])));}catch{throw deny();}
  const time=Math.floor(now()/1000);
  if(header.alg!=='RS256'||typeof header.kid!=='string'||!/^[a-zA-Z0-9_-]{1,150}$/.test(header.kid)||claims.aud!==projectId||claims.iss!==`https://securetoken.google.com/${projectId}`||typeof claims.sub!=='string'||!claims.sub||claims.sub.length>128||!Number.isSafeInteger(claims.exp)||claims.exp<=time||!Number.isSafeInteger(claims.iat)||claims.iat>time||!Number.isSafeInteger(claims.auth_time)||claims.auth_time>time||claims.firebase?.sign_in_provider!=='google.com')throw deny();
  if(now()>=expires)await refresh();let jwk=keys.find(key=>(key as JsonWebKey&{kid?:string}).kid===header.kid);
  if(!jwk&&now()-refreshed>60000){await refresh();jwk=keys.find(key=>(key as JsonWebKey&{kid?:string}).kid===header.kid);}if(!jwk)throw deny();
  try{const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1])))throw deny();}catch{throw deny();}
  return{uid:claims.sub as string};
 };
}
