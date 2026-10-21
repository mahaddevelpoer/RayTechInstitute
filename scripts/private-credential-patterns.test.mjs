import test from 'node:test';
import assert from 'node:assert/strict';
import { hasPrivateCredential } from './private-credential-patterns.mjs';

test('export gate rejects unknown private providers and legacy service-role JWTs', () => {
  for (const prefix of ['sk-or-v1-', 'sk-proj-', 'oc_sk_', 'sb_secret_', 'github_pat_', 'ghp_']) assert.equal(hasPrivateCredential(prefix + 'a'.repeat(40)), true);
  const jwt = role => `${Buffer.from('{"alg":"HS256"}').toString('base64url')}.${Buffer.from(JSON.stringify({ role, iss: 'supabase' })).toString('base64url')}.${'a'.repeat(40)}`;
  assert.equal(hasPrivateCredential(jwt('service_role')), true);
  assert.equal(hasPrivateCredential(jwt('anon')), false);
  assert.equal(hasPrivateCredential('Firebase public project configuration'), false);
  assert.equal(hasPrivateCredential('eyJinvalid.payload99.signature99'), false);
});
