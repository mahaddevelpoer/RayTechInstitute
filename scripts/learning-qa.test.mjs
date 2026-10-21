import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { createLearningQAHandler, verifyQAServiceCredential } = await loadTypescript('supabase/functions/_shared/learning-qa-handler.ts');
test('temporary QA rejects public, wrong-key, browser and expired requests before any probe', async () => {
  let calls = 0; const run = async () => { calls++; return { safe: true }; };
  const handler = createLearningQAHandler('private-test-credential', Date.now() + 60000, run);
  for (const headers of [{}, { Authorization: 'Bearer wrong' }, { Authorization: 'Bearer private-test-credential', Origin: 'https://example.com' }]) assert.notEqual((await handler(new Request('https://qa.invalid', { method: 'POST', headers }))).status, 200);
  assert.equal((await createLearningQAHandler('private-test-credential', 0, run)(new Request('https://qa.invalid', { method: 'POST' }))).status, 410);
  assert.equal(calls, 0);
  const response = await handler(new Request('https://qa.invalid', { method: 'POST', headers: { Authorization: 'Bearer private-test-credential' } }));
  assert.equal(response.status, 200); assert.equal(calls, 1); assert.equal(response.headers.get('cache-control'), 'no-store');
});
test('temporary QA never exposes probe exceptions', async () => {
  const handler = createLearningQAHandler('private-test-credential', Date.now() + 60000, async () => { throw new Error('secret provider text'); });
  const response = await handler(new Request('https://qa.invalid', { method: 'POST', headers: { Authorization: 'Bearer private-test-credential' } }));
  assert.equal(response.status, 503); assert.ok(!(await response.text()).includes('secret provider text'));
});
test('alternate legacy service keys require fixed-project Data API verification, never decoded claims alone', async () => {
  const token = claims => `header.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.signature`;
  const claims = { ref: 'btxrkhwyugzliswznkpx', role: 'service_role', exp: Math.ceil(Date.now() / 1000) + 600 };
  let calls = 0;
  const fetcher = async (url, options) => { calls++; assert.match(url, /^https:\/\/btxrkhwyugzliswznkpx\.supabase\.co\/rest\/v1\/learning_languages\?/); assert.equal(options.headers.apikey, token(claims)); return new Response('[]'); };
  for (const value of ['wrong', token({ ...claims, role: 'anon' }), token({ ...claims, role: 'authenticated' }), token({ ...claims, ref: 'other' }), token({ ...claims, exp: 1 })]) assert.equal(await verifyQAServiceCredential(value, fetcher), false);
  assert.equal(calls, 0);
  assert.equal(await verifyQAServiceCredential(token(claims), async () => new Response('{}', { status: 401 })), false);
  assert.equal(await verifyQAServiceCredential(token(claims), fetcher), true); assert.equal(calls, 1);
});
