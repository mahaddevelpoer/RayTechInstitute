import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const source = await fs.readFile('supabase/functions/_shared/student-auth.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { verifyStudent, readStudentSubmission } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const now = 1800000000000;
const claims = { sub: 'learner', aud: 'raytechinstitute', iss: 'https://securetoken.google.com/raytechinstitute', exp: now / 1000 + 3600, iat: now / 1000 - 10, auth_time: now / 1000 - 10, firebase: { sign_in_provider: 'password' } };
const config = { projectId: 'raytechinstitute', webApiKey: 'public-test-config' };
const token = c => `Bearer header.${Buffer.from(JSON.stringify(c)).toString('base64url')}.signature`;
const lookup = async () => Response.json({ users: [{ localId: 'learner', validSince: String(now / 1000 - 100) }] });

test('student identity is accepted only after Google verifies the token', async () => {
  let calls = 0;
  const user = await verifyStudent(token(claims), config, async (url, options) => {
    calls++;
    assert.equal(new URL(url).host, 'identitytoolkit.googleapis.com');
    assert.ok(JSON.parse(options.body).idToken);
    return lookup();
  }, now);
  assert.equal(calls, 1);
  assert.deepEqual(user, { uid: 'learner' });
  await assert.rejects(verifyStudent(token(claims), config, async () => new Response('', { status: 400 }), now), e => e.status === 401);
});
test('guest, foreign-project, expired, anonymous and mismatched accounts are rejected', async () => {
  for (const auth of [null, 'Bearer garbage', token({ ...claims, aud: 'other' }), token({ ...claims, exp: 1 }), token({ ...claims, firebase: { sign_in_provider: 'anonymous' } })]) {
    await assert.rejects(verifyStudent(auth, config, async () => { throw new Error('must not call Google'); }, now), e => e.status === 401);
  }
  for (const user of [{ localId: 'other' }, { localId: 'learner', disabled: true }, { localId: 'learner', validSince: String(now / 1000) }]) {
    await assert.rejects(verifyStudent(token(claims), config, async () => Response.json({ users: [user] }), now), e => e.status === 401);
  }
});
test('authentication outage returns a retryable error, not a fabricated identity', async () => {
  await assert.rejects(verifyStudent(token(claims), config, async () => new Response('', { status: 503 }), now), e => e.status === 503);
});
const submission = { topicId: 'variables', version: 1, code: 'x = 1', answers: { q1: 'a' } };
const request = value => new Request('https://example.test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) });
test('submission accepts only bounded code and quiz answers, never client marks or prompts', async () => {
  assert.deepEqual(await readStudentSubmission(request(submission)), submission);
  for (const value of [{ ...submission, score: 100 }, { ...submission, model: 'paid-model' }, { ...submission, rubric: {} }, { ...submission, code: 'x'.repeat(20001) }, { ...submission, answers: [] }, null]) {
    await assert.rejects(readStudentSubmission(request(value)), e => e.status === 400);
  }
  await assert.rejects(readStudentSubmission(request({ ...submission, code: 'x'.repeat(90001) })), e => e.status === 413);
});

test('a stalled upload is canceled instead of retaining a worker indefinitely', async () => {
  let canceled = false;
  const body = new ReadableStream({ cancel() { canceled = true; } });
  const req = new Request('https://example.test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, duplex: 'half' });
  await assert.rejects(readStudentSubmission(req, 10), e => e.status === 408);
  assert.equal(canceled, true);
});
