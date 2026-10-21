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
async function verify({ configured = true, authorization = 'Bearer synthetic-token', allowlist = 'staff@example.test', fetcher = async () => Response.json({ users: [{ email: 'staff@example.test', emailVerified: true }] }) } = {}) {
  const exports = {};
  vm.runInNewContext(compiled, { exports, Deno: { env: { get: name => name === 'FIREBASE_WEB_API_KEY' ? configured ? 'public-test-key' : '' : allowlist } }, fetch: fetcher, AbortSignal });
  return exports.verify(new Request('https://local.test', { headers: { Authorization: authorization } }));
}
test('admin verifier accepts only a verified allowlisted Google identity', async () => {
  assert.equal((await verify()).ok, true);
  for (const user of [{ email: 'other@example.test', emailVerified: true }, { email: 'staff@example.test', emailVerified: false }, { email: 'staff@example.test', emailVerified: true, disabled: true }]) {
    const result = await verify({ fetcher: async () => Response.json({ users: [user] }) });
    assert.equal(result.ok, false); assert.equal(result.status, 403);
  }
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
