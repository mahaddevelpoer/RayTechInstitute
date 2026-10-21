import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { createCodiCloudHandler, mintCodiToken, generateCodiSpeech, codiProviderError } = await loadTypescript('supabase/functions/_shared/codi-cloud.ts');
const guestId = '12345678-1234-4123-8123-123456789abc';
const origin = 'https://raytechinstitute.web.app';
const read = { action: 'read', language: 'en', text: 'A variable names a value.', consent: true, guestId };
const voice = { candidates: [{ finishReason: 'STOP', content: { parts: [{ inlineData: { mimeType: 'audio/L16;codec=pcm;rate=24000', data: Buffer.from([0,0,1,0]).toString('base64') } }] } }] };
function setup(override = {}) {
  const calls = { quota: 0, ai: 0, payload: null };
  const deps = { key: 'test-private', enabled: true, origins: [origin], reserve: async uid => { assert.equal(uid, `guest:${guestId}`); calls.quota++; return true; }, fetcher: async (url, init) => {
    assert.ok(!String(url).includes('identitytoolkit'), 'guest voice never depends on Firebase sign-in');
    calls.ai++; calls.payload = JSON.parse(init.body);
    return Response.json(String(url).endsWith('auth_tokens') ? { name: 'auth_tokens/test-session' } : voice);
  }, ...override };
  const handler = createCodiCloudHandler(deps);
  return { calls, send: (body = read, headers = {}, method = 'POST') => handler(new Request('https://edge.test/codi-voice', { method, headers: { Origin: origin, 'Content-Type': 'application/json', ...headers }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) })) };
}
test('guest voice requires consent and a session, and rejects attacker origins before quota', async () => {
  for (const [body, headers, status] of [[{...read,guestId:''}, {}, 400], [read, { Origin: 'https://evil.test' }, 403], [{ ...read, consent: false }, {}, 400], [{ ...read, text: 'x'.repeat(421) }, {}, 400], [{ ...read, model: 'paid-model' }, {}, 400]]) {
    const s = setup(); assert.equal((await s.send(body, headers)).status, status); assert.equal(s.calls.ai, 0); assert.equal(s.calls.quota, 0);
  }
  const s = setup(); assert.equal((await s.send(undefined, {}, 'OPTIONS')).status, 204); assert.equal((await s.send(undefined, {}, 'GET')).status, 405);
});
test('guest receives audio without signing in, private keys or a paid fallback', async () => {
  const s = setup(); const response = await s.send(); assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
  const body = await response.json(); assert.equal(body.rate, 24000); assert.equal(body.model, 'gemini-2.5-flash-preview-tts');
  assert.doesNotMatch(JSON.stringify(body), /test-private|test-student/); assert.equal(s.calls.ai, 1); assert.equal(s.calls.quota, 1);
});
test('disabled service and exhausted quota fail closed without a provider request', async () => {
  for (const [override, status] of [[{ enabled: false }, 503], [{ key: '' }, 503], [{ reserve: async () => false }, 429], [{ reserve: async () => { throw new Error('private db diagnostics'); } }, 503]]) {
    const s = setup(override); const r = await s.send(); assert.equal(r.status, status); assert.equal(s.calls.ai, 0); assert.doesNotMatch(await r.text(), /private db diagnostics/);
  }
});
test('Live token is single-use, short-lived, source-bound and model locked', async () => {
  const s = setup(); const r = await s.send({ action: 'live', language: 'ur', text: 'variable', context: 'A variable names a value.', consent: true, guestId }); assert.equal(r.status, 200);
  const p = s.calls.payload; assert.equal(p.uses, 1); assert.ok(Date.parse(p.expireTime) - Date.now() <= 300000); assert.ok(Date.parse(p.newSessionExpireTime) - Date.now() <= 60000);
  assert.match(p.bidiGenerateContentSetup.model, /gemini-2.5-flash-native-audio/); assert.match(p.fieldMask, /systemInstruction.*tools/);
  assert.match(p.bidiGenerateContentSetup.systemInstruction.parts[0].text, /A variable names a value/); assert.doesNotMatch(JSON.stringify(p), /test-student/);
});
test('provider error bodies and incomplete speech never leak or become success', async () => {
  await assert.rejects(mintCodiToken('secret', 'en', 'source', async () => new Response('private failure', { status: 429 })), /rate-limit/);
  await assert.rejects(generateCodiSpeech('secret', 'en', 'read', async () => Response.json({ candidates: [{ finishReason: 'MAX_TOKENS' }] })), /complete playable/);
  await assert.rejects(mintCodiToken('secret', 'en', 'source', async () => Response.json({ name: 'not-a-token' })), /invalid session/);
});

test('provider failures distinguish daily, minute, access and unavailable-model errors without raw bodies',async()=>{
 for(const [status,id,expected] of [[429,'GenerateRequestsPerDayPerProjectPerModel-FreeTier',/daily/],[429,'GenerateRequestsPerMinutePerProjectPerModel-FreeTier',/per-minute/],[403,'',/access was denied/],[404,'',/model is unavailable/],[503,'',/temporarily unavailable/]]){
  const error=await codiProviderError(Response.json({error:{message:'private credential must never leak',details:[{violations:[{quotaId:id}]}]}},{status}),'speech');assert.match(error.message,expected);assert.doesNotMatch(error.message,/private credential/);
 }
});

test('TTS 429 uses source-locked Native Audio recitation and returns actual PCM rather than a device substitution',async()=>{
 const calls=[];let socket;
 const fetcher=async(url,init)=>{calls.push({url:String(url),body:JSON.parse(init.body)});return String(url).endsWith('auth_tokens')?Response.json({name:'auth_tokens/recitation-test'}):Response.json({error:{message:'Daily limit reached'}},{status:429});};
 const connect=url=>{socket={url,sent:[],send(raw){this.sent.push(JSON.parse(raw));},close(){this.closed=true;}};return socket;};
 const pending=generateCodiSpeech('private-fixture','en','A variable stores a value.',fetcher,connect);
 const tick=()=>new Promise(r=>setImmediate(r));await tick();socket.onopen();socket.onmessage({data:JSON.stringify({setupComplete:{}})});await tick();
 assert.equal(calls.length,2);assert.match(calls[1].body.bidiGenerateContentSetup.systemInstruction.parts[0].text,/Recite ONLY.*A variable stores a value\./s);
 assert.doesNotMatch(calls[1].body.bidiGenerateContentSetup.systemInstruction.parts[0].text,/Explain the learner/);assert.equal(calls[1].body.uses,1);
  assert.equal(calls[1].body.bidiGenerateContentSetup.generationConfig.thinkingConfig.thinkingBudget,0);assert.match(calls[1].body.fieldMask,/generationConfig.thinkingConfig/);
 assert.match(socket.sent[1].clientContent.turns[0].parts[0].text,/Read the complete quoted passage/);
 socket.onmessage({data:JSON.stringify({serverContent:{modelTurn:{parts:[{inlineData:{mimeType:'audio/pcm;rate=24000',data:'AAABAA=='}}]},outputTranscription:{text:'A variable stores a value.'},turnComplete:true}})});
 const result=await pending;assert.equal(result.audio,'AAABAA==');assert.equal(result.model,'gemini-2.5-flash-native-audio-preview-12-2025');assert.equal(result.transcript,'A variable stores a value.');assert.ok(socket.closed);assert.doesNotMatch(JSON.stringify(result),/private-fixture|auth_tokens/);
});

test('Native Audio fallback rejects empty, interrupted and malformed readings',async()=>{
 for(const content of [{turnComplete:true},{interrupted:true},{modelTurn:{parts:[{inlineData:{mimeType:'audio/not-pcm',data:'AAABAA=='}}]},turnComplete:true}]){
  let socket;const pending=generateCodiSpeech('fixture','en','A variable.',async url=>String(url).endsWith('auth_tokens')?Response.json({name:'auth_tokens/test'}):new Response('',{status:429}),()=>socket={send(){},close(){this.closed=true;}});
  const rejected=assert.rejects(pending,/no playable|incomplete or invalid/);await new Promise(r=>setImmediate(r));socket.onmessage({data:JSON.stringify({serverContent:content})});await rejected;assert.ok(socket.closed);
 }
});

test('warm Edge skips repeated TTS failures during the provider retry interval',async()=>{
 const urls=[];let socket;
 const fetcher=async url=>{urls.push(String(url));return String(url).endsWith('auth_tokens')?Response.json({name:'auth_tokens/backoff-test'}):Response.json({error:{details:[{retryDelay:'60s'}]}},{status:429});};
 const connect=()=>socket={send(){},close(){}};
 for(let i=0;i<2;i++){
  const pending=generateCodiSpeech('cooldown-fixture','en','A variable.',fetcher,connect);await new Promise(r=>setImmediate(r));socket.onmessage({data:JSON.stringify({serverContent:{modelTurn:{parts:[{inlineData:{mimeType:'audio/pcm;rate=24000',data:'AAABAA=='}}]},turnComplete:true}})});await pending;
 }
 assert.equal(urls.filter(u=>u.includes('preview-tts:')).length,1);assert.equal(urls.filter(u=>u.endsWith('auth_tokens')).length,2);
});
test('Urdu is conversational and generated in one Native Audio pass, without translation or TTS round trips', async () => {
  const urls = []; let prompt, socket;
  const result = generateCodiSpeech('urdu-fixture', 'ur', 'A variable names a value.', async (url, init) => {
    urls.push(String(url));prompt=JSON.parse(init.body).bidiGenerateContentSetup.systemInstruction.parts[0].text;return Response.json({name:'auth_tokens/urdu-test'});
  },()=>socket={send(){},close(){this.closed=true;}});
  await new Promise(r=>setImmediate(r));assert.equal(urls.length,1);assert.match(urls[0],/auth_tokens$/);
  assert.match(prompt,/natural conversational Pakistani Urdu/);assert.match(prompt,/Keep programming terms/);assert.match(prompt,/Translate and speak the complete quoted passage/);assert.doesNotMatch(prompt,/Devanagari|gemini-2.5-flash:generateContent/);
  socket.onmessage({data:JSON.stringify({serverContent:{modelTurn:{parts:[{inlineData:{mimeType:'audio/pcm;rate=24000',data:'AAABAA=='}}]},turnComplete:true}})});
  assert.equal((await result).rate,24000);
  assert.equal((await setup().send({...read,language:'hi'})).status,400,'retired Hindi requests are rejected');
});
