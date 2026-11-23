import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import vm from 'node:vm';
import { loadTypescript } from './load-typescript.mjs';
const { DispatchRequestError, readDispatchRequest, MAX_DISPATCH_BODY_BYTES } = await loadTypescript('supabase/functions/_shared/dispatch-request.ts');
const request = (body, headers = {}) => new Request('https://local.test', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body, ...(body instanceof ReadableStream ? { duplex: 'half' } : {}) });

test('valid admin operations and webhook envelopes retain their JSON fields', async () => {
  for (const body of [{ action: 'verify_admin', payload: {} }, { action: 'mutate_content', payload: { record: { content: 'A'.repeat(250000) } } }, { table: 'blogs', type: 'INSERT', record: { id: 'article' } }]) {
    assert.deepEqual(await readDispatchRequest(request(JSON.stringify(body), { 'content-type': 'Application/JSON; charset=utf-8' })), body);
  }
});

test('unsupported method, non-JSON media and non-object JSON are rejected', async () => {
  await assert.rejects(readDispatchRequest(new Request('https://local.test')), { status: 405 });
  for (const media of ['text/plain', 'application/json-extra']) await assert.rejects(readDispatchRequest(request('{}', { 'content-type': media })), { status: 415 });
  for (const text of ['null', '[]', 'true', '42', 'not-json']) await assert.rejects(readDispatchRequest(request(text)), { status: 400 });
});

test('declared and streamed body limits reject oversized bytes without trusting Content-Length', async () => {
  await assert.rejects(readDispatchRequest(request('{}', { 'content-length': String(MAX_DISPATCH_BODY_BYTES + 1) })), { status: 413 });
  let canceled = false;
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(MAX_DISPATCH_BODY_BYTES + 1)); }, cancel() { canceled = true; } });
  await assert.rejects(readDispatchRequest(request(stream, { 'content-length': '2' })), { status: 413 });
  assert.equal(canceled, true);
  await assert.rejects(readDispatchRequest(request(JSON.stringify({ value: 'é'.repeat(MAX_DISPATCH_BODY_BYTES / 2) }))), { status: 413 });
});

test('stalled upload is canceled and invalid UTF-8 is rejected', async () => {
  let canceled = false;
  const stream = new ReadableStream({ cancel() { canceled = true; } });
  await assert.rejects(readDispatchRequest(request(stream), 10), { status: 408 });
  assert.equal(canceled, true);
  await assert.rejects(readDispatchRequest(request(new Uint8Array([0xff, 0xfe]))), { status: 400 });
});

test('actual secure-dispatch handler preserves preflight and rejects invalid requests before authentication', async () => {
  const source = await fs.readFile('supabase/functions/secure-dispatch/index.ts', 'utf8');
  const parsed = ts.createSourceFile('entry.ts', source, ts.ScriptTarget.Latest, true);
  const serve = parsed.statements.find(node => ts.isExpressionStatement(node) && ts.isCallExpression(node.expression) && node.expression.expression.getText(parsed) === 'serve');
  assert.ok(serve);
  const compiled = ts.transpileModule('exports.handler = ' + serve.expression.arguments[0].getText(parsed), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  let authCalls = 0;
  vm.runInNewContext(compiled, { exports, Request, Response, DispatchRequestError, readDispatchRequest, getCorsHeaders: () => ({ 'Access-Control-Allow-Methods': 'POST, OPTIONS' }), Deno: { env: { get: () => '' } }, verifyFirebaseAdmin: async () => { authCalls++; return { ok: false, status: 401, error: 'Unauthorized.' }; } });
  const preflight = await exports.handler(new Request('https://local.test', { method: 'OPTIONS' }));
  assert.equal(preflight.status, 200);
  assert.equal(preflight.headers.get('Access-Control-Allow-Methods'), 'POST, OPTIONS');
  const get = await exports.handler(new Request('https://local.test'));
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('Allow'), 'POST, OPTIONS');
  assert.equal((await exports.handler(request('{}', { 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await exports.handler(request('null'))).status, 400);
  assert.equal(authCalls, 0);
  assert.equal((await exports.handler(request('{"action":"verify_admin","payload":{}}'))).status, 401);
  assert.equal(authCalls, 1);
});
