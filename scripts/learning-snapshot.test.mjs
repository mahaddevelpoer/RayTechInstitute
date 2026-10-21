import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLearningSnapshot } from './learning-snapshot.mjs';

const language = { id: 'python', slug: 'python', title: 'Python', runtime: 'python', state: 'published' };
const topic = { id: 'variables', language_id: 'python', slug: 'variables', title: 'Variables', summary: 'Assign values.', position: 1, version: 1, objectives: ['Assign variables'], prerequisite_ids: [], content: 'Published content.', starter_code: '', video_ids: [], state: 'published', questions_per_attempt: 1, questions: [{ id: 'q1', question: 'Choose', options: [{ id: 'a', text: 'First' }, { id: 'b', text: 'Second' }], correctOptionId: 'a', explanation: 'First is correct.' }], assignment: { instructions: 'Create variables.', hints: [], allowedConcepts: ['variables'], requiredConcepts: ['variables'], prohibitedConcepts: [], starterCode: '', rubric: [{ id: 'concept', description: 'Use variables', points: 100 }] }, pending_draft: { content: 'Private unfinished draft' } };
test('static snapshot excludes drafts and pending revisions without losing published lesson', () => {
  const result = buildLearningSnapshot({ languages: [language], courses: [], topics: [topic, { ...topic, id: 'draft', state: 'draft' }] });
  assert.equal(result.topics.length, 1);
  assert.equal(result.topics[0].content, 'Published content.');
  assert.ok(!JSON.stringify(result).includes('Private unfinished draft'));
});
test('deleting the last topic produces an empty snapshot, never fallback content', () => {
  assert.deepEqual(buildLearningSnapshot({ languages: [], courses: [], topics: [] }), { languages: [], courses: [], topics: [] });
});
test('unpublished parent hides lessons and broken published courses block deployment', () => {
  const result = buildLearningSnapshot({ languages: [{ ...language, state: 'draft' }], courses: [], topics: [topic] });
  assert.equal(result.topics.length, 0);
  assert.throws(() => buildLearningSnapshot({ languages: [], topics: [], courses: [{ id: 'web', slug: 'web', title: 'Web', state: 'published', language_ids: ['javascript'] }] }));
});
test('malformed published lessons and missing tables fail instead of writing a partial export', () => {
  assert.throws(() => buildLearningSnapshot({ languages: [language], courses: [], topics: [{ ...topic, assignment: null }] }));
  assert.throws(() => buildLearningSnapshot({ languages: [] }));
});

test('duplicate registry URLs and repeated course tracks fail before writing the snapshot', () => {
  const course = { id: 'python-course', slug: 'python-course', title: 'Python Course', state: 'published', language_ids: ['python'] };
  assert.throws(() => buildLearningSnapshot({ languages: [language, { ...language, id: 'other' }], courses: [], topics: [] }), /Duplicate public registry URLs/);
  assert.throws(() => buildLearningSnapshot({ languages: [language], courses: [course, { ...course, id: 'other-course' }], topics: [] }), /Duplicate public registry URLs/);
  assert.throws(() => buildLearningSnapshot({ languages: [language], courses: [{ ...course, language_ids: ['python', 'python'] }], topics: [] }), /invalid/);
});

test('malformed registry fields cannot be coerced into public slugs or renderable text', () => {
  for (const change of [{ id: '' }, { title: ' ' }, { slug: null }, { slug: undefined }, { description: {} }]) {
    assert.throws(() => buildLearningSnapshot({ languages: [{ ...language, ...change }], courses: [], topics: [] }), /Invalid published language/);
  }
  const course = { id: 'python-course', slug: 'python-course', title: 'Python Course', state: 'published', language_ids: ['python'] };
  for (const change of [{ id: '' }, { title: ' ' }, { slug: null }, { slug: undefined }, { description: {} }]) {
    assert.throws(() => buildLearningSnapshot({ languages: [language], courses: [{ ...course, ...change }], topics: [] }), /invalid identity/);
  }
});

test('the same lesson slug remains valid in different language URL namespaces', () => {
  const result = buildLearningSnapshot({ languages: [language, { ...language, id: 'javascript', slug: 'javascript', title: 'JavaScript', runtime: 'javascript' }], courses: [], topics: [topic, { ...topic, id: 'js-variables', language_id: 'javascript' }] });
  assert.equal(result.topics.length, 2);
  assert.equal(result.topics[0].slug, result.topics[1].slug);
});
