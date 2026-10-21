import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { createCodiCloudHandler, mintCodiToken, generateCodiSpeech } = await loadTypescript('supabase/functions/_shared/codi-cloud.ts');
const seconds = Math.floor(Date.now() / 1000);
const claims = { sub: 'test-student', aud: 'raytechinstitute', iss: 'https://securetoken.google.com/raytechinstitute', exp: seconds + 3600, iat: seconds - 60, auth_time: seconds - 60, firebase: { sign_in_provider: 'password' } };
const authorization = `Bearer header.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.signature`;
const origin = 'https://raytechinstitute.web.app';
const read = { action: 'read', language: 'en', text: 'A variable names a value.', consent: true };
const voice = { candidates: [{ finishReason: 'STOP', content: { parts: [{ inlineData: { mimeType: 'audio/L16;codec=pcm;rate=24000', data: Buffer.from([0,0,1,0]).toString('base64') } }] } }] };
function setup(override = {}) {
  const calls = { quota: 0, ai: 0, payload: null };
  const deps = { key: 'test-private', enabled: true, origins: [origin], firebase: { projectId: 'raytechinstitute', webApiKey: 'public-config' }, reserve: async () => { calls.quota++; return true; }, fetcher: async (url, init) => {
    if (String(url).startsWith('https://identitytoolkit.')) return Response.json({ users: [{ localId: claims.sub }] });
    calls.ai++; calls.payload = JSON.parse(init.body);
    return Response.json(String(url).endsWith('auth_tokens') ? { name: 'auth_tokens/test-session' } : voice);
  }, ...override };
  const handler = createCodiCloudHandler(deps);
  return { calls, send: (body = read, headers = {}, method = 'POST') => handler(new Request('https://edge.test/codi-voice', { method, headers: { Origin: origin, Authorization: authorization, 'Content-Type': 'application/json', ...headers }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) })) };
}
test('voice authenticates, requires consent and rejects attacker origins before consuming quota', async () => {
  for (const [body, headers, status] of [[read, { Authorization: '' }, 401], [read, { Origin: 'https://evil.test' }, 403], [{ ...read, consent: false }, {}, 400], [{ ...read, text: 'x'.repeat(421) }, {}, 400], [{ ...read, model: 'paid-model' }, {}, 400]]) {
    const s = setup(); assert.equal((await s.send(body, headers)).status, status); assert.equal(s.calls.ai, 0); assert.equal(s.calls.quota, 0);
  }
  const s = setup(); assert.equal((await s.send(undefined, {}, 'OPTIONS')).status, 204); assert.equal((await s.send(undefined, {}, 'GET')).status, 405);
});
test('verified reader receives only audio, with no keys, identity or paid fallback', async () => {
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
  const s = setup(); const r = await s.send({ action: 'live', language: 'hi', text: 'variable', context: 'A variable names a value.', consent: true }); assert.equal(r.status, 200);
  const p = s.calls.payload; assert.equal(p.uses, 1); assert.ok(Date.parse(p.expireTime) - Date.now() <= 300000); assert.ok(Date.parse(p.newSessionExpireTime) - Date.now() <= 60000);
  assert.match(p.bidiGenerateContentSetup.model, /gemini-2.5-flash-native-audio/); assert.match(p.fieldMask, /systemInstruction.*tools/);
  assert.match(p.bidiGenerateContentSetup.systemInstruction.parts[0].text, /A variable names a value/); assert.doesNotMatch(JSON.stringify(p), /test-student/);
});
test('provider error bodies and incomplete speech never leak or become success', async () => {
  await assert.rejects(mintCodiToken('secret', 'en', 'source', async () => new Response('private failure', { status: 429 })), /quota/);
  await assert.rejects(generateCodiSpeech('secret', 'en', 'read', async () => Response.json({ candidates: [{ finishReason: 'MAX_TOKENS' }] })), /complete playable/);
  await assert.rejects(mintCodiToken('secret', 'en', 'source', async () => Response.json({ name: 'not-a-token' })), /invalid session/);
});
test('Hindi is translated as text before the speech model recites it', async () => {
  const urls = []; let prompt;
  const result = await generateCodiSpeech('secret', 'hi', 'A variable names a value.', async (url, init) => {
    urls.push(String(url)); if (urls.length === 1) return Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'एक वेरिएबल किसी मान को नाम देता है।' }] } }] });
    prompt = JSON.parse(init.body).contents[0].parts[0].text; return Response.json(voice);
  });
  assert.match(urls[0], /gemini-2.5-flash:generateContent/); assert.match(urls[1], /preview-tts/); assert.match(prompt, /एक वेरिएबल/); assert.equal(result.rate, 24000);
});
