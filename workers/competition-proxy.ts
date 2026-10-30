// Prepared only. Deploy separately after approval; never embed these secrets in NEXT_PUBLIC variables.
import {createCompetitionTokenVerifier} from '../supabase/functions/_shared/competition-auth';
const verifyGoogle=createCompetitionTokenVerifier('raytechinstitute');
interface Environment {COMPETITION_UPSTREAM:string;COMPETITION_PROXY_SECRET:string;ALLOWED_ORIGINS:string;COMPETITION_NOTIFICATION_JOB_SECRET?:string;}
interface WorkerContext {waitUntil(promise:Promise<unknown>):void;}
export default {scheduled(_event:unknown,env:Environment,context:WorkerContext){
 if(!env.COMPETITION_PROXY_SECRET)return;const url=new URL(env.COMPETITION_UPSTREAM);if(url.protocol!=='https:'||!url.hostname.endsWith('.supabase.co')||url.pathname!=='/functions/v1/competition')return;
 context.waitUntil((async()=>{const r=await fetch(url.href+'/maintenance',{method:'POST',headers:{'x-competition-proxy':env.COMPETITION_PROXY_SECRET,'x-competition-job':env.COMPETITION_PROXY_SECRET}});if(!r.ok)throw new Error('Competition maintenance failed');if(env.COMPETITION_NOTIFICATION_JOB_SECRET){const mail=await fetch(url.origin+'/functions/v1/competition-notifications/dispatch',{method:'POST',headers:{'x-notification-job':env.COMPETITION_NOTIFICATION_JOB_SECRET}});if(!mail.ok)throw new Error('Competition winner notification dispatch failed');}})());
},async fetch(request:Request,env:Environment,context:WorkerContext):Promise<Response>{
 const origin=request.headers.get('origin')||'';const allowed=(env.ALLOWED_ORIGINS||'https://raytechinstitute.com').split(',').map(s=>s.trim());
 const cors={'Access-Control-Allow-Origin':allowed.includes(origin)?origin:allowed[0],'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'authorization,content-type','Vary':'Origin'};
 const fail=(status:number,message:string)=>Response.json({success:false,error:message},{status,headers:{...cors,'Cache-Control':'no-store'}});
 if(origin&&!allowed.includes(origin))return fail(403,'This origin is not allowed.');if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(!['GET','POST'].includes(request.method))return fail(405,'Use GET or POST.');
 let upstream:URL;try{upstream=new URL(env.COMPETITION_UPSTREAM);if(upstream.protocol!=='https:'||!upstream.hostname.endsWith('.supabase.co')||upstream.pathname!=='/functions/v1/competition'||upstream.username||upstream.password)throw 0;}catch{return fail(503,'Competition protection has not been configured.');}
 if(!env.COMPETITION_PROXY_SECRET)return fail(503,'Competition protection has not been configured.');
 if(request.method==='POST'&&(!request.headers.get('authorization')?.startsWith('Bearer ')||(request.headers.get('authorization')?.length||0)>12000))return fail(401,'Sign in with Google before entering the competition.');
 if(request.method==='POST'){
  if(!origin)return fail(403,'Open the competition on RayTech Institute before submitting.');
  try{await verifyGoogle(request.headers.get('authorization'));}catch{return fail(401,'Your Google session could not be verified. Sign in again.');}
 }
 const incoming=new URL(request.url);upstream.search=incoming.search;
 const isPublic=request.method==='GET'&&!request.headers.has('authorization')&&['overview','result'].includes(incoming.searchParams.get('action')||'overview');
 const cache=(caches as CacheStorage&{default:Cache}).default;
 const cacheUrl=new URL(request.url);cacheUrl.searchParams.set('_origin',origin||allowed[0]);const cacheKey=new Request(cacheUrl.href,{method:'GET'});
 if(isPublic){const saved=await cache.match(cacheKey);if(saved)return saved;}
 const headers=new Headers({'Content-Type':'application/json','x-competition-proxy':env.COMPETITION_PROXY_SECRET,'x-competition-client-ip':request.headers.get('cf-connecting-ip')||''});
 if(origin)headers.set('Origin',origin);const authorization=request.headers.get('authorization');if(authorization)headers.set('Authorization',authorization);
 try{
  const response=await fetch(upstream,{method:request.method,headers,...(request.method==='POST'?{body:request.body}:{}),redirect:'manual'});
  if(response.status>=300&&response.status<400)return fail(502,'Unexpected competition upstream redirect.');
  const outgoing=new Response(response.body,{status:response.status,headers:{...cors,'Content-Type':'application/json','X-Content-Type-Options':'nosniff','Cache-Control':isPublic&&response.ok?'public,max-age=30,s-maxage=30':'no-store'}});
  if(isPublic&&outgoing.ok)context.waitUntil(cache.put(cacheKey,outgoing.clone()));return outgoing;
 }catch{return fail(503,'The competition connection is temporarily unavailable.');}
}};
