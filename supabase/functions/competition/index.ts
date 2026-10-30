import {createCompetitionHandler} from '../_shared/competition-handler.ts';
import {createCompetitionTokenVerifier} from '../_shared/competition-auth.ts';
import {verifyStudent,StudentRequestError} from '../_shared/student-auth.ts';
import {CompetitionError,competitionDatabaseError} from '../_shared/competition-service.ts';
const databaseUrl=Deno.env.get('SUPABASE_URL')||'',serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
const proxySecret=Deno.env.get('COMPETITION_PROXY_SECRET')||'';
const verifyIdentity=createCompetitionTokenVerifier('raytechinstitute');
Deno.serve(createCompetitionHandler({
 origins:(Deno.env.get('ALLOWED_ORIGINS')||'https://raytechinstitute.com,https://raytechinstitute.web.app').split(',').map(s=>s.trim()),
 siteKey:Deno.env.get('TURNSTILE_SITE_KEY')||'',turnstileSecret:Deno.env.get('TURNSTILE_SECRET_KEY')||'',ipSalt:Deno.env.get('COMPETITION_IP_SALT')||'',
 proxyRequired:true,proxySecret,verifyIdentity,verifyAdminIdentity:createCompetitionTokenVerifier('raytechinstitute',fetch,Date.now,false),
 async verifyFreshIdentity(authorization){try{return await verifyStudent(authorization,{projectId:'raytechinstitute',webApiKey:Deno.env.get('FIREBASE_WEB_API_KEY')||''});}catch(error){throw new CompetitionError(error instanceof StudentRequestError?error.status:503,'Sign in again before starting the competition. Your weekly attempt was not used.');}},
 trustedIp:request=>proxySecret&&request.headers.get('x-competition-proxy')===proxySecret?request.headers.get('x-competition-client-ip'):null,
 async verifyAdmin(authorization){
  if(!authorization)return false;try{const r=await fetch(databaseUrl+'/functions/v1/secure-dispatch',{method:'POST',headers:{Authorization:authorization,apikey:Deno.env.get('SUPABASE_ANON_KEY')||'','Content-Type':'application/json'},body:JSON.stringify({action:'verify_admin',payload:{}}),signal:AbortSignal.timeout(8000)});const data=await r.json();return r.ok&&data.success===true&&typeof data.email==='string';}catch{return false;}
 },
 repo:{async call(action,uid,payload={}){
  if(!databaseUrl||!serviceKey)throw new Error('Competition persistence unavailable');
  const r=await fetch(databaseUrl+'/rest/v1/rpc/competition_gateway',{method:'POST',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json'},body:JSON.stringify({p_action:action,p_uid:uid,p_payload:payload}),signal:AbortSignal.timeout(8000)});
  if(!r.ok){let error;try{error=await r.json();}catch{}throw competitionDatabaseError(error);}return r.json();
 }},
}));
