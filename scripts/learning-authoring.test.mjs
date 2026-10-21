import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
import { lessonFixture } from './lesson-quality-fixture.mjs';
const { generateNextLearningTopic } = await loadTypescript('supabase/functions/_shared/learning-authoring.ts');
const { topicToRow } = await loadTypescript('supabase/functions/_shared/learning-records.ts');
const draft = { slug: 'variables', title: 'Variables', summary: 'Use named values.', objectives: ['Assign variables'], prerequisiteIds: [], content: lessonFixture(), starterCode: 'x = 1', questions: [{ id: 'q1', question: 'Which is a name?', options: [{ id: 'a', text: 'name' }, { id: 'b', text: '3' }], correctOptionId: 'a', explanation: 'A name refers to a value.' }], assignment: { instructions: 'Create two variables.', hints: [], requiredConcepts: ['variables'], allowedConcepts: ['variables'], prohibitedConcepts: [], starterCode: '', rubric: [{ id: 'concept', description: 'Use variables', points: 100 }] } };
const payload = { languageId: 'python', questionCount: 1, testSize: 1 };
function setup(existing = []) {
  const writes = [];
  return { writes, repo: { list: async table => table === 'learning_languages' ? [{ id: 'python', title: 'Python', runtime: 'python' }] : existing, write: async record => { writes.push(record); } } };
}
test('AI draft gets server-controlled identity/state/order and is never auto-published', async () => {
  const { writes, repo } = setup();
  const result = await generateNextLearningTopic(payload, repo, async (system, prompt) => {
    assert.match(system, /English/); assert.match(prompt, /existingTopics/);
    return JSON.stringify({ ...draft, state: 'published', id: 'untrusted', videoIds: ['untrusted'] });
  });
  assert.equal(result.success, true); assert.equal(writes.length, 1);
  assert.equal(writes[0].state, 'draft'); assert.notEqual(writes[0].id, 'untrusted');
  assert.deepEqual(writes[0].video_ids, []); assert.equal(writes[0].position, 1);
});
test('existing topics guide generation and duplicated topic objectives are rejected', async () => {
  const existing = topicToRow({ ...draft, id: 'old', languageId: 'python', order: 1, version: 1, state: 'draft', videoIds: [], questionsPerAttempt: 1 });
  const { repo, writes } = setup([existing]);
  await assert.rejects(generateNextLearningTopic(payload, repo, async (_, prompt) => { assert.match(prompt, /"id":"old"/); return JSON.stringify(draft); }), /already exists/);
  assert.equal(writes.length, 0);
});
test('short, incomplete, incorrect-count and invalid-rubric generations never save', async () => {
  for (const output of ['bad json', JSON.stringify({ ...draft, content: 'Too short.' }), JSON.stringify({ ...draft, questions: [] }), JSON.stringify({ ...draft, assignment: { ...draft.assignment, rubric: [{ id: 'x', description: 'Invalid total', points: 40 }] } })]) {
    const { repo, writes } = setup();
    await assert.rejects(generateNextLearningTopic(payload, repo, async () => output));
    assert.equal(writes.length, 0);
  }
});
test('invalid bank/test sizes fail before calling the admin model', async () => {
  const { repo } = setup();
  for (const input of [{ ...payload, questionCount: 0 }, { ...payload, questionCount: 51 }, { ...payload, testSize: 2 }]) {
    await assert.rejects(generateNextLearningTopic(input, repo, async () => { assert.fail('must not call AI'); }));
  }
});

test('undersized and oversized banks are repaired once without replacing the lesson or assignment', async () => {
  for (const count of [0, 1, 3]) {
    const { repo, writes } = setup(); let calls = 0;
    const questions = [1, 2].map(n => ({ ...draft.questions[0], id: `q${n}`, question: `Question ${n}: which is a name?` }));
    await generateNextLearningTopic({ ...payload, questionCount: 2, testSize: 2 }, repo, async (_, prompt) => {
      calls++;
      if (calls === 1) return JSON.stringify({ ...draft, questions: Array.from({ length: count }, (_, n) => ({ ...draft.questions[0], id: `q${n + 1}` })) });
      assert.match(prompt, /Repair ONLY the question bank/);
      assert.match(prompt, /exactly 2 distinct questions/);
      assert.match(prompt, /Lesson reference data/);
      return JSON.stringify({ questions, title: 'Do not replace', content: 'Do not replace', state: 'published' });
    });
    assert.equal(calls, 2); assert.equal(writes.length, 1);
    assert.deepEqual(writes[0].questions, questions);
    assert.equal(writes[0].content, draft.content);
    assert.deepEqual(writes[0].assignment, draft.assignment);
    assert.equal(writes[0].title, draft.title); assert.equal(writes[0].state, 'draft');
  }
});

test('incorrect, malformed and invalid repaired banks never save or retry indefinitely', async () => {
  for (const repair of ['not json', 'null', JSON.stringify({ questions: [] }), JSON.stringify({ questions: [{ ...draft.questions[0], correctOptionId: 'missing' }] })]) {
    const { repo, writes } = setup(); let calls = 0;
    await assert.rejects(generateNextLearningTopic(payload, repo, async () => {
      calls++;
      return calls === 1 ? JSON.stringify({ ...draft, questions: [] }) : repair;
    }));
    assert.equal(calls, 2); assert.equal(writes.length, 0);
  }
});

test('bank repair uses the expanded lesson when both prose and question count are incomplete', async () => {
  const { repo, writes } = setup(); let calls = 0;
  await generateNextLearningTopic(payload, repo, async (_, prompt) => {
    calls++;
    if (calls === 1) return JSON.stringify({ ...draft, content: 'Short.', questions: [] });
    if (calls === 2) return JSON.stringify({ content: lessonFixture(2500) });
    assert.match(prompt, /Repair ONLY the question bank/);
    assert.ok(prompt.includes(lessonFixture(2500).slice(0, 100)) || prompt.includes(JSON.stringify(lessonFixture(2500)).slice(1, 100)));
    return JSON.stringify({ questions: draft.questions });
  });
  assert.equal(calls, 3); assert.equal(writes.length, 1);
});

test('structurally incomplete AI response is repaired without changing assessment or topic identity', async () => {
  const { repo, writes } = setup(); let calls = 0;
  const result = await generateNextLearningTopic(payload, repo, async (_, prompt) => {
    calls++;
    if (calls === 1) { assert.match(prompt, /no editorial minimum or maximum/); assert.match(prompt, /fenced hint block/); return JSON.stringify({ ...draft, content: 'Missing structure.' }); }
    assert.match(prompt, /Revise ONLY/); return JSON.stringify({ content: lessonFixture(2500), title: 'Ignore this', questions: [] });
  });
  assert.equal(calls, 2); assert.equal(writes.length, 1); assert.equal(writes[0].title, draft.title);
  assert.deepEqual(writes[0].questions, draft.questions); assert.ok(result.wordCount > 2500);
});

test('failed structural repair is bounded while long valid lessons need no rewrite', async () => {
  const failed = setup(); let attempts = 0;
  await assert.rejects(generateNextLearningTopic(payload, failed.repo, async () => { attempts++; return JSON.stringify(attempts === 1 ? { ...draft, content: 'Short.' } : { content: 'Still short.' }); }), /after one revision/);
  assert.equal(attempts, 2); assert.equal(failed.writes.length, 0);
  const long = setup(); let steps = 0;
  await generateNextLearningTopic(payload, long.repo, async () => { steps++; return JSON.stringify(steps === 1 ? { ...draft, content: lessonFixture(4100) } : { content: lessonFixture(3000) }); });
  assert.equal(steps, 1); assert.equal(long.writes.length, 1);
});

test('JavaScript drafts receive the actual DOM-mode setup and browser API limits', async () => {
  const { repo } = setup();
  const original = repo.list;
  repo.list = async table => table === 'learning_languages' ? [{ id: 'python', title: 'JavaScript', runtime: 'javascript' }] : original(table);
  await generateNextLearningTopic(payload, repo, async (_, prompt) => {
    assert.match(prompt, /Interactive DOM preview/); assert.match(prompt, /document.body.innerHTML/);
    assert.match(prompt, /not every native browser API/); assert.match(prompt, /browser storage/);
    return JSON.stringify(draft);
  });
});

test('AI generation knows reserved archived URLs and cannot save one by mistake', async () => {
  const existing = topicToRow({ ...draft, id: 'archived', languageId: 'python', order: 1, version: 1, state: 'archived', videoIds: [], questionsPerAttempt: 1 });
  const { repo, writes } = setup([existing]);
  await assert.rejects(generateNextLearningTopic(payload, repo, async (_, prompt) => {
    assert.match(prompt, /"reservedSlugs":\["variables"\]/);
    return JSON.stringify(draft);
  }), /archived topic/);
  assert.equal(writes.length, 0);
});

test('short structured lessons save without a length-only repair', async () => {
 const { repo, writes } = setup(); let calls = 0;
 await generateNextLearningTopic(payload, repo, async () => { calls++; return JSON.stringify({ ...draft, content: lessonFixture(1000) }); });
 assert.equal(calls, 1); assert.equal(writes.length, 1);
});

test('code options keep operators, case and spaces inside literals distinct', async () => {
  const { repo, writes } = setup(); let calls = 0;
  const questions = [
    { ...draft.questions[0], id: 'q1', question: 'What does x = 1 do?', options: [{ id: 'a', text: 'x = 1' }, { id: 'b', text: 'x == 1' }, { id: 'c', text: 'True' }, { id: 'd', text: 'true' }] },
    { ...draft.questions[0], id: 'q2', question: 'What does x == 1 do?', options: [{ id: 'a', text: '"a  b"' }, { id: 'b', text: '"a b"' }] },
  ];
  await generateNextLearningTopic({ ...payload, questionCount: 2 }, repo, async () => { calls++; return JSON.stringify({ ...draft, questions }); });
  assert.equal(calls, 1); assert.deepEqual(writes[0].questions, questions);
});

test('required non-prohibited concepts are explicitly allowed without another AI request', async () => {
  const { repo, writes } = setup(); let calls = 0;
  await generateNextLearningTopic(payload, repo, async () => {
    calls++; return JSON.stringify({ ...draft, assignment: { ...draft.assignment, allowedConcepts: ['print'], prohibitedConcepts: ['lists'] } });
  });
  assert.equal(calls, 1);
  assert.deepEqual(writes[0].assignment.allowedConcepts, ['print', 'variables']);
  assert.deepEqual(writes[0].assignment.prohibitedConcepts, ['lists']);
});

test('genuinely duplicated options, wrong answer IDs and blank explanations trigger one assessment repair', async () => {
  for (const invalid of [
    { ...draft.questions[0], options: [{ id: 'a', text: 'same' }, { id: 'b', text: ' same ' }] },
    { ...draft.questions[0], correctOptionId: 'missing' },
    { ...draft.questions[0], explanation: ' ' },
  ]) {
    const { repo, writes } = setup(); let calls = 0;
    await generateNextLearningTopic(payload, repo, async (_, prompt) => {
      calls++;
      if (calls === 1) return JSON.stringify({ ...draft, questions: [invalid] });
      assert.match(prompt, /validation errors/); assert.match(prompt, /Question q1 needs/);
      return JSON.stringify({ questions: draft.questions, content: 'Do not replace', title: 'Do not replace', assignment: null });
    });
    assert.equal(calls, 2); assert.equal(writes.length, 1);
    assert.equal(writes[0].content, draft.content); assert.equal(writes[0].title, draft.title);
    assert.deepEqual(writes[0].assignment, draft.assignment);
  }
});

test('a prohibited required concept is not silently allowed and assignment repair is revalidated', async () => {
  for (const fixesConflict of [true, false]) {
    const { repo, writes } = setup(); let calls = 0;
    const assignment = { ...draft.assignment, allowedConcepts: [], prohibitedConcepts: ['variables'] };
    const action = generateNextLearningTopic(payload, repo, async (_, prompt) => {
      calls++;
      if (calls === 1) return JSON.stringify({ ...draft, assignment });
      assert.match(prompt, /Every required concept/);
      return JSON.stringify({ questions: draft.questions, assignment: fixesConflict ? draft.assignment : assignment });
    });
    if (fixesConflict) { await action; assert.deepEqual(writes[0].assignment, draft.assignment); }
    else { await assert.rejects(action, /Every required concept/); assert.equal(writes.length, 0); }
    assert.equal(calls, 2);
  }
});

test('invalid rubric is repaired together with assessment without regenerating teaching prose', async () => {
  const { repo, writes } = setup(); let calls = 0;
  await generateNextLearningTopic(payload, repo, async () => {
    calls++;
    if (calls === 1) return JSON.stringify({ ...draft, assignment: { ...draft.assignment, rubric: [{ id: 'x', description: 'Use variables', points: 30 }] } });
    return JSON.stringify({ questions: draft.questions, assignment: draft.assignment });
  });
  assert.equal(calls, 2); assert.equal(writes[0].content, draft.content);
  assert.equal(writes[0].assignment.rubric.reduce((sum, item) => sum + item.points, 0), 100);
});
