import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { encodeCheckpoint, decodeCheckpoint } = await loadTypescript('src/lib/learning/progress.ts');
const { learningSessionReducer: reduce, emptyLearningSession } = await loadTypescript('src/lib/learning/session.ts');
const { topicProgressKey } = await loadTypescript('src/lib/learning/quiz.ts');
const topic = {
  id: 'variables', version: 1, state: 'published', questionsPerAttempt: 5,
  questions: Array.from({ length: 10 }, (_, i) => ({ id: `q${i}`, question: `Private-copy-free question ${i}`, options: [{ id: 'a', text: 'Yes' }, { id: 'b', text: 'No' }], correctOptionId: 'a', explanation: 'Canonical explanation' })),
  assignment: { instructions: 'Create variables.', rubric: [{ id: 'variables', description: 'Use variables', points: 100 }] },
};
const key = topicProgressKey(topic.id, topic.version);
function passed() {
  let state = reduce(emptyLearningSession, { type: 'start', key, questions: topic.questions.slice(0, 5) });
  for (let i = 0; i < 4; i++) { state = reduce(state, { type: 'answer', key, optionId: 'a' }); state = reduce(state, { type: 'move', key, direction: 1 }); }
  state = reduce(state, { type: 'submit', key });
  return reduce(state, { type: 'code', key: `${key}:assignment`, code: 'value = 2' });
}
test('checkpoint restores canonical questions, option order and exact score without storing lesson copies', () => {
  const payload = encodeCheckpoint(topic, passed());
  assert.ok(!payload.includes('correctOptionId')); assert.ok(!payload.includes('Canonical explanation')); assert.ok(!payload.includes('Private-copy-free'));
  const result = decodeCheckpoint(payload, topic);
  assert.equal(result.qualified.result.percentage, 80);
  assert.equal(result.attempt.questions[0].question, topic.questions[0].question);
  assert.equal(result.assignmentCode, 'value = 2');
  const restored = reduce(emptyLearningSession, { type: 'restore', key, checkpoint: result });
  assert.equal(restored.qualified[key].result.assignmentUnlocked, true);
  assert.equal(restored.code[`${key}:assignment`], 'value = 2');
});
test('saved result flags cannot turn a failing quiz into a qualification', () => {
  const value = JSON.parse(encodeCheckpoint(topic, passed()));
  value.qualified.answers = { q0: 'a' }; value.qualified.result = { percentage: 100, assignmentUnlocked: true };
  assert.throws(() => decodeCheckpoint(JSON.stringify(value), topic));
  value.qualified = null; value.attempt.answers = { q0: 'a' }; value.attempt.result = { percentage: 100 };
  assert.equal(decodeCheckpoint(JSON.stringify(value), topic).attempt.result.percentage, 20);
});
test('malformed, stale and foreign checkpoints are rejected', () => {
  const valid = JSON.parse(encodeCheckpoint(topic, passed()));
  for (const change of [
    { version: 2 }, { topicId: 'other' }, { schema: 2 }, { studied: 'yes' },
    { seen: { foreign: 1 } }, { seen: { q0: -1 } }, { seen: { q0: 1000001 } },
    { practiceCode: 'x'.repeat(20001) }, { assignmentCode: {} },
    { attempt: { ...valid.attempt, ids: ['q0', 'q0', 'q2', 'q3', 'q4'] } },
    { attempt: { ...valid.attempt, answers: { unknown: 'a' } } },
    { attempt: { ...valid.attempt, options: Array(5).fill(['a', 'a']) } },
    { attempt: { ...valid.attempt, position: 5 } },
  ]) assert.throws(() => decodeCheckpoint(JSON.stringify({ ...valid, ...change }), topic));
  assert.throws(() => decodeCheckpoint('x'.repeat(200001), topic));
});
test('restore preserves work typed while loading; explicit reload replaces only the selected topic', () => {
  const checkpoint = decodeCheckpoint(encodeCheckpoint(topic, passed()), topic);
  let local = reduce(emptyLearningSession, { type: 'code', key: `${key}:assignment`, code: 'new local work' });
  local = reduce(local, { type: 'code', key: 'other@1:practice', code: 'keep other topic' });
  const merged = reduce(local, { type: 'restore', key, checkpoint });
  assert.equal(merged.code[`${key}:assignment`], 'new local work');
  const replaced = reduce(local, { type: 'restore', key, checkpoint, replace: true });
  assert.equal(replaced.code[`${key}:assignment`], 'value = 2');
  assert.equal(replaced.code['other@1:practice'], 'keep other topic');
  assert.deepEqual(reduce(replaced, { type: 'clear' }), emptyLearningSession);
});
test('seen history merges without resetting exposure and studied state survives restoration', () => {
  const checkpoint = decodeCheckpoint(encodeCheckpoint(topic, passed()), topic);
  checkpoint.seen = { q0: 5, q1: 1 }; checkpoint.studied = true;
  const local = { ...emptyLearningSession, seen: { [key]: { q0: 2, q1: 3 } } };
  const result = reduce(local, { type: 'restore', key, checkpoint });
  assert.deepEqual(result.seen[key], { q0: 5, q1: 3 }); assert.equal(result.studied[key], true);
});

test('assignment feedback round-trips only with a qualifying attempt and a consistent rubric', () => {
  const review = { verdict: 'pass', score: 90, summary: 'Good variables.', criteria: [{ id: 'variables', pointsAwarded: 90, feedback: 'Used the required variables.' }], conceptViolations: [], nextSteps: ['Use descriptive names.'] };
  const state = reduce(passed(), { type: 'feedback', key, feedback: { code: 'value = 2', review } });
  const payload = encodeCheckpoint(topic, state);
  assert.deepEqual(decodeCheckpoint(payload, topic).feedback, { code: 'value = 2', review });
  const invalid = JSON.parse(payload); invalid.feedback.review.score = 100;
  assert.throws(() => decodeCheckpoint(JSON.stringify(invalid), topic));
  invalid.feedback.review.score = 90; invalid.qualified = null;
  assert.throws(() => decodeCheckpoint(JSON.stringify(invalid), topic));
});

test('an unfinished test resumes its selected answers and question position without revealing results', () => {
  let state = reduce(emptyLearningSession, { type: 'start', key, questions: topic.questions.slice(0, 5) });
  state = reduce(state, { type: 'answer', key, optionId: 'b' }); state = reduce(state, { type: 'move', key, direction: 1 });
  const checkpoint = decodeCheckpoint(encodeCheckpoint(topic, state), topic);
  assert.equal(checkpoint.attempt.position, 1); assert.equal(checkpoint.attempt.answers.q0, 'b');
  assert.equal(checkpoint.attempt.result, null); assert.equal(checkpoint.qualified, null);
});
