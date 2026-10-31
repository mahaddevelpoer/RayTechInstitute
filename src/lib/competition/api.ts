import type {CompetitionAttemptView,CompetitionOverview,CompetitionStanding} from '../../../supabase/functions/_shared/competition-types';
export type {CompetitionAttemptView,CompetitionOverview,CompetitionStanding};
declare global { interface Window { __COMPETITION_PREVIEW__?:{token:string}; } }
const endpoint=()=>typeof window!=='undefined'&&window.__COMPETITION_PREVIEW__?'/api/competition':process.env.NEXT_PUBLIC_COMPETITION_ENDPOINT||'https://raytech-competition.raytech-institute-archive.workers.dev';
async function request(url:RequestInfo|URL,options:RequestInit){try{return await fetch(url,options);}catch{throw new Error('The connection was interrupted. Your confirmed answers are safe. Reconnect and resume your attempt.');}}
async function read(response:Response){let data;try{data=await response.json();}catch{throw new Error('The competition is temporarily unavailable. Please try again.');}if(!response.ok||data.success!==true)throw new Error(typeof data.error==='string'?data.error:'The competition request could not be completed.');return data.data;}
export async function competitionGet(action='overview',reference?:string,signal?:AbortSignal,offset=0){const url=new URL(endpoint(),location.origin);url.searchParams.set('action',action);if(offset>0)url.searchParams.set('offset',String(offset));if(reference)url.searchParams.set(action==='result'?'resultId':'roundId',reference);return read(await request(url,{credentials:'omit',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(15000)]):AbortSignal.timeout(15000)}));}
export async function competitionPost(action:string,payload:Record<string,unknown>={},demo=false){
 let token=demo?window.__COMPETITION_PREVIEW__?.token:null;
 if(!token){const {auth}=await import('@/lib/firebase');token=await auth.currentUser?.getIdToken();}
 if(!token)throw new Error('Sign in with Google before entering the weekly competition.');
 const url=new URL(endpoint(),location.origin);if(!window.__COMPETITION_PREVIEW__&&['admin_rounds','admin_attempts','set_review','save_round'].includes(action))url.pathname=url.pathname.replace(/\/$/,'')+'/admin';
 return read(await request(url,{method:'POST',credentials:'omit',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({action,payload}),signal:AbortSignal.timeout(15000)}));
}
