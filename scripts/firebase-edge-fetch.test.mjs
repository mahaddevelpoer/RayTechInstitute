import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { loadTypescript } from './load-typescript.mjs';
const { firebaseEdgeFetch } = await loadTypescript('src/lib/firebase-edge-fetch.ts');
const project = 'https://example.supabase.co';

test('real Supabase SDK sends refreshed Firebase tokens across new Functions clients', async () => {
  let token = 'firebase-first'; const calls = [];
  const client = createClient(project, 'synthetic-public-anon-key', { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: firebaseEdgeFetch(project, async () => token, async (url, init) => {
    calls.push({ url: String(url), headers: new Headers(init.headers), body: init.body });
    return Response.json({ success: true });
  }) } });
  assert.notEqual(client.functions, client.functions, 'SDK returns a new Functions client');
  assert.equal((await client.functions.invoke('secure-dispatch', { body: { action: 'verify_admin' } })).error, null);
  token = 'firebase-refreshed';
  await client.functions.invoke('secure-dispatch', { headers: { Authorization: 'Bearer stale-public-key' }, body: { action: 'learning_catalog' } });
  token = null;
  await client.functions.invoke('secure-dispatch', { body: { action: 'subscribe_notifications' } });
  assert.equal(calls[0].headers.get('authorization'), 'Bearer firebase-first');
  assert.equal(calls[1].headers.get('authorization'), 'Bearer firebase-refreshed');
  assert.equal(calls[2].headers.get('authorization'), 'Bearer synthetic-public-anon-key');
  assert.equal(calls[0].headers.get('apikey'), 'synthetic-public-anon-key');
  assert.equal(JSON.parse(calls[1].body).action, 'learning_catalog');
});

test('Firebase transport never authenticates REST, storage or foreign hosts', async () => {
  let tokenReads = 0; const seen = [];
  const transport = firebaseEdgeFetch(project, async () => { tokenReads++; return 'private-synthetic-token'; }, async (url, init) => { seen.push(new Headers(init?.headers).get('authorization')); return Response.json({}); });
  for (const url of [`${project}/rest/v1/classes`, `${project}/storage/v1/object`, 'https://foreign.invalid/functions/v1/secure-dispatch', `${project}/functions/v10/other`]) {
    await transport(url, { headers: { Authorization: 'Bearer public-key' } });
  }
  assert.equal(tokenReads, 0); assert.deepEqual(seen, Array(4).fill('Bearer public-key'));
});

test('Firebase transport preserves Request headers, abort signal and never mutates caller headers', async () => {
  const controller = new AbortController(); const headers = new Headers({ 'X-Caller': 'preserved', Authorization: 'Bearer original' });
  const request = new Request(`${project}/functions/v1/student-review`, { method: 'POST', headers, body: '{}' });
  const transport = firebaseEdgeFetch(project, async () => 'fresh-token', async (input, init) => {
    assert.equal(input, request); assert.equal(init.signal, controller.signal);
    assert.equal(init.headers.get('x-caller'), 'preserved'); assert.equal(init.headers.get('authorization'), 'Bearer fresh-token');
    return Response.json({});
  });
  await transport(request, { signal: controller.signal });
  assert.equal(request.headers.get('authorization'), 'Bearer original');
  assert.equal(headers.get('authorization'), 'Bearer original');
});
