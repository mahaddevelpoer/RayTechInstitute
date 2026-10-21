import { randomUUID } from 'node:crypto';
const base='https://btxrkhwyugzliswznkpx.supabase.co/functions/v1/codi-voice';
const origin='https://raytechinstitute.web.app';
const guestId=randomUUID();
const checks=[];
const invoke=body=>fetch(base,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(55000)});
try {
  const pre=await fetch(base,{method:'OPTIONS',headers:{Origin:origin},signal:AbortSignal.timeout(10000)});
  checks.push({check:'production CORS',passed:pre.status===204&&pre.headers.get('access-control-allow-origin')===origin});
  const malformed=await invoke({action:'read',text:'Test',language:'en',consent:true});checks.push({check:'missing session rejected',passed:malformed.status===400});
  const forbidden=await fetch(base,{method:'POST',headers:{Origin:'https://attacker.invalid','Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(10000)});checks.push({check:'foreign origin denied',passed:forbidden.status===403});
  const read=await invoke({action:'read',text:'A variable gives a name to a value.',language:'en',consent:true,guestId});const audio=await read.json();
  checks.push({check:'guest reading without sign-in',passed:read.ok&&audio.rate===24000&&typeof audio.audio==='string',status:read.status,bytes:audio.audio?Buffer.from(audio.audio,'base64').length:0,...(!read.ok?{error:audio.error}:{})});
  const live=await invoke({action:'live',text:'variable',context:'A variable gives a name to a value. score = 3 assigns the integer 3 to score.',language:'en',consent:true,guestId});const session=await live.json();
  checks.push({check:'guest restricted Live token without sign-in',passed:live.ok&&session.token?.startsWith('auth_tokens/')&&session.endpoint?.startsWith('wss://generativelanguage.googleapis.com/'),status:live.status,...(!live.ok?{error:session.error}:{})});
} catch { checks.push({check:'end-to-end request',passed:false,reason:'Service unavailable; private diagnostics suppressed.'}); }
console.log(JSON.stringify({checks},null,2));if(checks.some(c=>!c.passed))process.exitCode=1;
