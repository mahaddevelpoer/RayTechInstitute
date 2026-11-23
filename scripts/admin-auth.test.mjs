import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import vm from 'node:vm';

// Execute the actual entry-point verifier, isolated from Deno serve and providers.
const source = await fs.readFile('supabase/functions/secure-dispatch/index.ts', 'utf8');
const parsed = ts.createSourceFile('entry.ts', source, ts.ScriptTarget.Latest, true);
const verifier = parsed.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'verifyFirebaseAdmin');
assert.ok(verifier);
const compiled = ts.transpileModule(verifier.getText(parsed) + '\nexports.verify = verifyFirebaseAdmin;', { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const now = Math.floor(Date.now() / 1000);
const token = (claims = {}) => ['header', Buffer.from(JSON.stringify({ sub: 'admin-123', aud: 'raytechinstitute', iss: 'https://securetoken.google.com/raytechinstitute', exp: now + 3600, iat: now, auth_time: now - 20, firebase: { sign_in_provider: 'password' }, ...claims })).toString('base64url'), 'signature'].join('.');
const user = { localId: 'admin-123', email: 'staff@example.test', emailVerified: true, validSince: String(now - 60) };
async function verify({ configured = true, authorization = 'Bearer ' + token(), allowlist = 'staff@example.test', fetcher = async () => Response.json({ users: [user] }) } = {}) {
  const exports = {};
  vm.runInNewContext(compiled, { exports, Deno: { env: { get: name => name === 'FIREBASE_WEB_API_KEY' ? configured ? 'public-test-key' : '' : name === 'ADMIN_EMAILS' ? allowlist : undefined } }, fetch: fetcher, AbortSignal, atob });
  return exports.verify(new Request('https://local.test', { headers: { Authorization: authorization } }));
}
test('admin verifier accepts only a verified allowlisted Google identity', async () => {
  assert.equal((await verify()).ok, true);
  for (const account of [{ ...user, email: 'other@example.test' }, { ...user, emailVerified: false }, { ...user, disabled: true }]) {
    const result = await verify({ fetcher: async () => Response.json({ users: [account] }) });
    assert.equal(result.ok, false); assert.equal(result.status, 403);
  }
});

test('revoked administrator sessions and mismatched identities are rejected after lookup', async () => {
  for (const account of [{ ...user, validSince: String(now - 10) }, { ...user, localId: 'another-admin' }, { ...user, validSince: 'invalid' }]) {
    assert.equal((await verify({ fetcher: async () => Response.json({ users: [account] }) })).status, 401);
  }
  assert.equal((await verify({ fetcher: async () => Response.json({ users: [{ ...user, validSince: String(now - 20) }] }) })).ok, true);
});

test('malformed, oversized, foreign-project, expired and anonymous tokens never reach lookup', async () => {
  let lookups = 0;
  const fetcher = async () => { lookups++; return Response.json({ users: [user] }); };
  for (const authorization of ['Bearer malformed', 'Bearer ' + 'x'.repeat(12001), ...[
    { aud: 'foreign-project' }, { iss: 'https://securetoken.google.com/foreign-project' },
    { exp: now - 1 }, { iat: now + 60 }, { auth_time: now + 60 },
    { auth_time: undefined }, { sub: 'x'.repeat(129) }, { firebase: { sign_in_provider: 'anonymous' } },
  ].map(claims => 'Bearer ' + token(claims))]) {
    assert.equal((await verify({ authorization, fetcher })).status, 401);
  }
  assert.equal(lookups, 0);
});
test('missing credentials and invalid sessions remain unauthorized', async () => {
  assert.equal((await verify({ authorization: '' })).status, 401);
  assert.equal((await verify({ fetcher: async () => new Response('', { status: 400 }) })).status, 401);
});
test('admin service outages and missing configuration are retryable, not account denials', async () => {
  assert.equal((await verify({ configured: false })).status, 503);
  assert.equal((await verify({ allowlist: '' })).status, 503);
  for (const status of [429, 500, 503]) assert.equal((await verify({ fetcher: async () => new Response('', { status }) })).status, 503);
  assert.equal((await verify({ fetcher: async () => { throw new Error('upstream private diagnostic'); } })).status, 503);
});
