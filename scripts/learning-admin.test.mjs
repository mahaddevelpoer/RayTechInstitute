import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
import { lessonFixture } from './lesson-quality-fixture.mjs';
const { handleLearningAdmin } = await loadTypescript('supabase/functions/_shared/learning-admin.ts');
const { parseLearningTopic, topicToRow, topicFromRow } = await loadTypescript('supabase/functions/_shared/learning-records.ts');
const { createLearningRepository } = await loadTypescript('supabase/functions/_shared/learning-repository.ts');
const topic = { id: 'variables', languageId: 'python', slug: 'variables', title: 'Variables', summary: 'Assign values.', order: 1, version: 1, objectives: ['Assign variables'], prerequisiteIds: [], content: 'Use variables to refer to values.', starterCode: '', videoIds: [], state: 'published', questionsPerAttempt: 1, questions: [{ id: 'q1', question: 'Choose a variable', options: [{ id: 'a', text: 'name' }, { id: 'b', text: '1' }], correctOptionId: 'a', explanation: 'Names refer to values.' }], assignment: { instructions: 'Create two variables.', hints: [], allowedConcepts: ['variables'], requiredConcepts: ['variables'], prohibitedConcepts: ['lists'], starterCode: '', rubric: [{ id: 'concept', description: 'Use variables', points: 100 }] } };
function setup(initial = [topic]) {
  const rows = initial.map(t => ({ ...topicToRow(t), pending_draft: null, updated_at: '2026-10-18T10:00:00Z' }));
  const calls = { writes: [], deletes: [], rebuilds: 0 };
  const repo = { list: async table => table === 'learning_topics' ? rows : table === 'learning_languages' ? [{ id: 'python', state: 'published' }] : [], write: async (...args) => { calls.writes.push(args); }, remove: async (...args) => { calls.deletes.push(args); }, rebuild: async () => { calls.rebuilds++; } };
  const payload = { topic: { ...topic, content: lessonFixture() }, expectedUpdatedAt: rows[0]?.updated_at };
  return { rows, repo, calls, payload };
}
test('editing a live lesson saves a separate draft without replacing or rebuilding published content', async () => {
  const { repo, calls, payload } = setup();
  const result = await handleLearningAdmin('learning_save_draft', payload, repo);
  const record = calls.writes[0][0];
  assert.equal(record.pending_draft.content, payload.topic.content);
  assert.equal(record.content, undefined); assert.equal(record.state, undefined);
  assert.equal(calls.rebuilds, 0); assert.equal(result.rebuild, 'not-needed');
});

test('discarding a pending revision preserves the published lesson and needs no rebuild', async () => {
  const { repo, rows, calls, payload } = setup();
  rows[0].pending_draft = { ...topic, content: 'Unpublished edits' };
  const result = await handleLearningAdmin('learning_discard_draft', { id: topic.id, expectedUpdatedAt: payload.expectedUpdatedAt }, repo);
  assert.equal(calls.writes[0][0].pending_draft, null);
  assert.equal(calls.writes[0][0].content, undefined); assert.equal(calls.writes[0][0].state, undefined);
  assert.equal(calls.deletes.length, 0); assert.equal(calls.rebuilds, 0); assert.equal(result.rebuild, 'not-needed');
  await assert.rejects(handleLearningAdmin('learning_discard_draft', { id: topic.id, expectedUpdatedAt: 'stale' }, repo), /changed/);
});

test('last standalone draft can be deleted while nonexistent pending revisions fail safely', async () => {
  const { repo, calls, payload } = setup([{ ...topic, state: 'draft' }]);
  await handleLearningAdmin('learning_delete', { id: topic.id, expectedUpdatedAt: payload.expectedUpdatedAt }, repo);
  assert.equal(calls.deletes.length, 1); assert.equal(calls.rebuilds, 0);
  await assert.rejects(handleLearningAdmin('learning_discard_draft', { id: topic.id, expectedUpdatedAt: payload.expectedUpdatedAt }, repo), /no saved pending draft/);
});

test('unstructured lessons remain editable drafts but cannot be published', async () => {
  const { repo, calls, payload } = setup();
  const short = { ...payload, topic: { ...payload.topic, content: 'Incomplete draft.' } };
  await handleLearningAdmin('learning_save_draft', short, repo);
  assert.equal(calls.writes.length, 1);
  await assert.rejects(handleLearningAdmin('learning_publish', short, repo), /Markdown section headings/);
  assert.equal(calls.writes.length, 1); assert.equal(calls.rebuilds, 0);
});
test('publishing increments version, clears draft and requests rebuild', async () => {
  const { repo, calls, payload } = setup();
  const result = await handleLearningAdmin('learning_publish', payload, repo);
  assert.equal(calls.writes[0][0].version, 2); assert.equal(calls.writes[0][0].pending_draft, null);
  assert.equal(calls.writes[0][0].state, 'published'); assert.equal(result.rebuild, 'queued');
  assert.equal(calls.rebuilds, 1);
});
test('stale saves, URL changes and invalid publication fail before writing', async () => {
  for (const change of [{ expectedUpdatedAt: 'old' }, { topic: { ...topic, slug: 'renamed' } }, { topic: { ...topic, assignment: null } }]) {
    const { repo, calls, payload } = setup();
    await assert.rejects(handleLearningAdmin('learning_publish', { ...payload, ...change }, repo));
    assert.equal(calls.writes.length, 0); assert.equal(calls.rebuilds, 0);
  }
});
test('deletion requests rebuild for a published lesson but blocks prerequisite dependencies', async () => {
  const { repo, calls, payload } = setup();
  await handleLearningAdmin('learning_delete', { id: topic.id, expectedUpdatedAt: payload.expectedUpdatedAt }, repo);
  assert.equal(calls.deletes.length, 1); assert.equal(calls.rebuilds, 1);
  const next = { ...topic, id: 'next', slug: 'next', title: 'Next topic', order: 2, prerequisiteIds: [topic.id] };
  const dependent = setup([topic, next]);
  await assert.rejects(handleLearningAdmin('learning_delete', { id: topic.id, expectedUpdatedAt: dependent.payload.expectedUpdatedAt }, dependent.repo), /requires this lesson/);
  assert.equal(dependent.calls.deletes.length, 0);
});
test('rebuild failure reports saved but unpublished, rather than pretending deployment succeeded', async () => {
  const { repo, payload } = setup();
  repo.rebuild = async () => { throw new Error('private token'); };
  const result = await handleLearningAdmin('learning_publish', payload, repo);
  assert.equal(result.success, true); assert.equal(result.rebuild, 'failed');
  assert.ok(!JSON.stringify(result).includes('private token'));
});
test('record parser rejects malformed nested data and drops unknown privileged fields', () => {
  assert.deepEqual(parseLearningTopic({ ...topic, admin: true }), topic);
  assert.deepEqual(topicFromRow(topicToRow(topic)), topic);
  for (const bad of [null, {}, { ...topic, questions: [null] }, { ...topic, assignment: {} }, { ...topic, content: 'x'.repeat(100001) }]) assert.throws(() => parseLearningTopic(bad));
});
test('repository uses an atomic optimistic update filter and rejects lost updates', async () => {
  let url, method;
  const repo = createLearningRepository('https://database.test', 'private-key', async () => {}, async (u, options) => { url = u; method = options.method; return Response.json([]); });
  await assert.rejects(repo.write({ id: 'variables', content: 'new' }, '2026-10-18T10:00:00Z'), /changed in another session/);
  assert.equal(method, 'PATCH');
  assert.equal(new URL(url).searchParams.get('updated_at'), 'eq.2026-10-18T10:00:00Z');
  await assert.rejects(repo.remove('variables', 'old'), /changed in another session/);
  assert.equal(method, 'DELETE');
});

test('course publishing requires published languages and cannot unpublish an in-use language', async () => {
  let writes = 0;
  const language = { id: 'python', state: 'draft', updated_at: 'stamp' };
  const course = { id: 'python-course', state: 'draft', language_ids: ['python'], updated_at: 'stamp' };
  const repo = { list: async table => table === 'learning_languages' ? [language] : table === 'learning_courses' ? [course] : [], updateRegistry: async () => { writes++; }, rebuild: async () => {} };
  await assert.rejects(handleLearningAdmin('learning_registry_state', { table: 'learning_courses', id: course.id, state: 'published', expectedUpdatedAt: 'stamp' }, repo), /Publish every language/);
  assert.equal(writes, 0);
  language.state = 'published';
  const result = await handleLearningAdmin('learning_registry_state', { table: 'learning_courses', id: course.id, state: 'published', expectedUpdatedAt: 'stamp' }, repo);
  assert.equal(result.rebuild, 'queued'); assert.equal(writes, 1);
  course.state = 'published';
  await assert.rejects(handleLearningAdmin('learning_registry_state', { table: 'learning_languages', id: language.id, state: 'draft', expectedUpdatedAt: 'stamp' }, repo), /Unpublish courses/);
});
test('registry rejects stale edits and never accepts arbitrary table names', async () => {
  const { repo } = setup();
  await assert.rejects(handleLearningAdmin('learning_registry_state', { table: 'learning_review_quota', id: 'x', state: 'published' }, repo), /Invalid registry/);
  await assert.rejects(handleLearningAdmin('learning_registry_state', { table: 'learning_languages', id: 'python', state: 'published', expectedUpdatedAt: 'stale' }, repo), /Registry changed/);
});

test('video ownership is verified before a lesson with attachments is published', async () => {
  const { repo, calls, payload } = setup();
  let verified = false;
  repo.validateVideos = async ids => { verified = true; assert.deepEqual(ids, ['abcdefghijk']); throw new Error('Foreign channel'); };
  await assert.rejects(handleLearningAdmin('learning_publish', { ...payload, topic: { ...payload.topic, videoIds: ['abcdefghijk'] } }, repo), /Foreign channel/);
  assert.equal(verified, true); assert.equal(calls.writes.length, 0);
});
