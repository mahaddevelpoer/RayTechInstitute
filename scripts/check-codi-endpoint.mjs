import { randomBytes } from 'node:crypto';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd(),false,{info(){},error(){}});
const base='https://btxrkhwyugzliswznkpx.supabase.co/functions/v1/codi-voice';
const origin='http://127.0.0.1:4178';
const key=process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBKyaUYaCQcdyG1Pwt3P8BUmoES3O0lIDQ';
let token;const checks=[];
const invoke=body=>fetch(base,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(55000)});
try {
  const pre=await fetch(base,{method:'OPTIONS',headers:{Origin:origin},signal:AbortSignal.timeout(10000)});
  checks.push({check:'preview CORS',passed:pre.status===204&&pre.headers.get('access-control-allow-origin')===origin});
  const denied=await invoke({action:'read',text:'Test',language:'en',consent:true});checks.push({check:'guest denied',passed:denied.status===401});
  const forbidden=await fetch(base,{method:'POST',headers:{Origin:'https://attacker.invalid','Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(10000)});checks.push({check:'foreign origin denied',passed:forbidden.status===403});
  // Synthetic, disposable student only. Never requests email or admin privilege.
  const signup=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:`codi-qa-${randomBytes(8).toString('hex')}@example.com`,password:randomBytes(24).toString('base64url'),returnSecureToken:true}),signal:AbortSignal.timeout(15000)});
  const user=await signup.json();token=user.idToken;if(!signup.ok||!token)throw new Error('Disposable student sign-in was unavailable.');
  const read=await invoke({action:'read',text:'A variable gives a name to a value.',language:'en',consent:true});const audio=await read.json();
  checks.push({check:'verified Firebase student reading',passed:read.ok&&audio.rate===24000&&typeof audio.audio==='string',status:read.status,bytes:audio.audio?Buffer.from(audio.audio,'base64').length:0,...(!read.ok?{error:audio.error}:{})});
  const live=await invoke({action:'live',text:'variable',context:'A variable gives a name to a value. score = 3 assigns the integer 3 to score.',language:'en',consent:true});const session=await live.json();
  checks.push({check:'verified Firebase student restricted Live token',passed:live.ok&&session.token?.startsWith('auth_tokens/')&&session.endpoint?.startsWith('wss://generativelanguage.googleapis.com/'),status:live.status,...(!live.ok?{error:session.error}:{})});
} catch { checks.push({check:'end-to-end request',passed:false,reason:'Service unavailable; private diagnostics suppressed.'}); }
finally {
  if(token){try{const removed=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:token}),signal:AbortSignal.timeout(15000)});checks.push({check:'disposable student removed',passed:removed.ok});}catch{checks.push({check:'disposable student removed',passed:false});}}
}
console.log(JSON.stringify({checks},null,2));if(checks.some(c=>!c.passed))process.exitCode=1;
