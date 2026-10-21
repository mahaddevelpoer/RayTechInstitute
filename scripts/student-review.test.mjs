import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { createStudentReviewHandler } = await loadTypescript('supabase/functions/_shared/student-review-handler.ts');
const now = Math.floor(Date.now() / 1000);
const claims = { sub: 'learner-private-id', aud: 'raytechinstitute', iss: 'https://securetoken.google.com/raytechinstitute', exp: now + 3600, iat: now - 60, auth_time: now - 60, firebase: { sign_in_provider: 'password' } };
const authorization = `Bearer header.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.signature`;
const topic = {
  id: 'variables', languageId: 'python', slug: 'variables', title: 'Variables', summary: 'Assign values.', order: 1, version: 1, objectives: ['Use variables'], prerequisiteIds: [], content: 'Use variables to refer to values.', starterCode: '', videoIds: [], state: 'published', questionsPerAttempt: 5,
  questions: Array.from({ length: 5 }, (_, i) => ({ id: `q${i}`, question: 'Choose', options: [{ id: 'a', text: 'Yes' }, { id: 'b', text: 'No' }], correctOptionId: 'a', explanation: 'Explanation' })),
  assignment: { instructions: 'Create two variables.', hints: [], allowedConcepts: ['variables'], requiredConcepts: ['variables'], prohibitedConcepts: ['lists'], starterCode: '', rubric: [{ id: 'variables', description: 'Use two variables', points: 100 }] },
};
const review = { verdict: 'pass', score: 90, summary: 'You used two variables.', criteria: [{ id: 'variables', pointsAwarded: 90, feedback: 'Good use of variables.' }], conceptViolations: [], nextSteps: ['Use descriptive names.'] };
const submission = { topicId: 'variables', version: 1, code: 'a = 1\nb = 2', answers: Object.fromEntries(topic.questions.map(q => [q.id, 'a'])) };
function setup(overrides = {}) {
  const calls = { ai: 0, quota: 0, topic: 0, payload: null };
  const deps = {
    origins: ['https://raytechinstitute.web.app'], firebase: { projectId: 'raytechinstitute', webApiKey: 'public-config' }, openRouterKey: 'test-secret',
    getPublishedTopic: async () => { calls.topic++; return structuredClone(topic); },
    reserveQuota: async uid => { calls.quota++; assert.equal(uid, 'learner-private-id'); return true; },
    fetcher: async (url, options) => {
      if (url.startsWith('https://identitytoolkit.googleapis.com/')) return Response.json({ users: [{ localId: 'learner-private-id' }] });
      assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions');
      calls.ai++; calls.payload = JSON.parse(options.body);
      return Response.json({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(review) } }] });
    }, ...overrides,
  };
  const handler = createStudentReviewHandler(deps);
  const send = (body = submission, headers = {}, method = 'POST') => handler(new Request('https://edge.test/student-review', { method, headers: { Origin: deps.origins[0], Authorization: authorization, 'Content-Type': 'application/json', ...headers }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) }));
  return { calls, send, deps };
}
test('signed-in passing attempt sends trusted context without identity, tools or paid fallback', async () => {
  const { calls, send } = setup();
  const response = await send();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(calls.quota, 1); assert.equal(calls.ai, 1);
  assert.equal(calls.payload.model, 'nvidia/nemotron-3.5-super-vl:free');
  assert.equal(calls.payload.tools, undefined); assert.equal(calls.payload.models, undefined);
  assert.ok(!JSON.stringify(calls.payload).includes('learner-private-id'));
  const context = JSON.parse(calls.payload.messages[1].content);
  assert.equal(context.lesson.content, topic.content);
  assert.deepEqual(context.assignment, topic.assignment);
  assert.deepEqual((await response.json()).review, review);
});
test('guest and disallowed origins never access database or AI', async () => {
  for (const headers of [{ Authorization: '' }, { Origin: 'https://attacker.test' }]) {
    const { calls, send } = setup();
    assert.ok([401, 403].includes((await send(submission, headers)).status));
    assert.equal(calls.topic, 0); assert.equal(calls.ai, 0); assert.equal(calls.quota, 0);
  }
});

test('an unanswered question counts as incorrect while exact 80 percent still unlocks feedback', async () => {
  const { calls, send } = setup();
  const response = await send({ ...submission, answers: { ...submission.answers, q4: '' } });
  assert.equal(response.status, 200);
  assert.equal(calls.ai, 1);
  const failed = setup();
  assert.equal((await failed.send({ ...submission, answers: { ...submission.answers, q3: '', q4: '' } })).status, 403);
  assert.equal(failed.calls.ai, 0);
});
test('preflight succeeds and GET is rejected without authentication or provider calls', async () => {
  const { calls, send } = setup();
  assert.equal((await send(null, {}, 'OPTIONS')).status, 204);
  assert.equal((await send(null, {}, 'GET')).status, 405);
  assert.equal(calls.ai, 0);
});
test('failed scores and fabricated questions cannot reserve quota', async () => {
  for (const answers of [{ ...submission.answers, q0: 'b', q1: 'b' }, { q0: 'a' }, { ...submission.answers, fake: 'a' }]) {
    const { calls, send } = setup();
    assert.ok([400, 403].includes((await send({ ...submission, answers })).status));
    assert.equal(calls.quota, 0); assert.equal(calls.ai, 0);
  }
});
test('draft, missing and stale lessons fail before quota reservation', async () => {
  for (const [value, status] of [[null, 404], [{ ...topic, state: 'draft' }, 404], [{ ...topic, version: 2 }, 409]]) {
    const { calls, send } = setup({ getPublishedTopic: async () => value });
    assert.equal((await send()).status, status); assert.equal(calls.ai, 0); assert.equal(calls.quota, 0);
  }
});
test('missing provider configuration or exhausted quota never calls AI', async () => {
  for (const [overrides, status] of [[{ openRouterKey: '' }, 503], [{ reserveQuota: async () => false }, 429]]) {
    const { calls, send } = setup(overrides);
    assert.equal((await send()).status, status); assert.equal(calls.ai, 0);
  }
});
test('provider failures and inconsistent marks do not return a pass or leak private errors', async () => {
  for (const [provider, status] of [
    [new Response('private-provider-diagnostic', { status: 429 }), 429],
    [new Response('private-provider-diagnostic', { status: 500 }), 503],
    [new Response('x'.repeat(128001)), 502],
    [Response.json({ choices: [{ finish_reason: 'length', message: { content: JSON.stringify(review) } }] }), 502],
    [Response.json({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify({ ...review, score: 100 }) } }] }), 502],
  ]) {
    const { send } = setup({ fetcher: async url => url.startsWith('https://identitytoolkit.googleapis.com/') ? Response.json({ users: [{ localId: 'learner-private-id' }] }) : provider });
    const response = await send(); assert.equal(response.status, status);
    const result = await response.json(); assert.equal(result.review, undefined);
    assert.ok(!JSON.stringify(result).includes('private-provider-diagnostic'));
  }
});
