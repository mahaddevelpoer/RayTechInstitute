import test from 'node:test';
import assert from 'node:assert/strict';
import { authoredCourseTopics } from '../content/courses/all-topics.mjs';
import { authoredPythonTopics } from '../content/courses/python/topics.mjs';
import { pythonCoreUnits } from '../content/courses/python/core-units.mjs';
import { parseReviewedMdx } from './reviewed-mdx.mjs';
import { loadTypescript } from './load-typescript.mjs';
const { parseLearningTopic } = await loadTypescript('supabase/functions/_shared/learning-records.ts');
const { validateTopicPublication } = await loadTypescript('supabase/functions/_shared/learning-curriculum.ts');
const { lessonQualityIssues } = await loadTypescript('supabase/functions/_shared/lesson-quality.ts');
const topics = await authoredCourseTopics();

test('Python has twenty distinct real authored units, not roadmap placeholders', () => {
  const python = topics.filter(topic => topic.languageId === 'python').sort((a, b) => a.order - b.order);
  assert.equal(python.length, 20); assert.deepEqual(python.map(t => t.order), Array.from({ length: 20 }, (_, index) => index + 1));
  for (const topic of topics) {
    assert.equal(parseLearningTopic(topic).id, topic.id);
    assert.deepEqual(validateTopicPublication(topic, topics), [], topic.title);
    assert.deepEqual(lessonQualityIssues(topic.content), [], topic.title);
    assert.ok(parseReviewedMdx(topic.content).some(block => block.type === 'Understand'));
  }
  assert.equal(new Set(python.map(t => t.slug)).size, 20);
  assert.equal(pythonCoreUnits.length, 19);
  assert.ok(pythonCoreUnits.every(unit => unit.explanation.split(/\s+/).length >= 120));
});

test('every additional Python unit has three examples, independent practice and complete assessments', () => {
  for (const topic of authoredPythonTopics()) {
    assert.equal((topic.content.match(/^```python$/gm) || []).length, 3);
    assert.equal(topic.questions.length, 4); assert.equal(topic.questionsPerAttempt, 3);
    const guided = parseReviewedMdx(topic.content).find(block => block.type === 'Understand');
    assert.equal(guided.stages.length, 3); assert.ok(guided.stages.every(stage => stage.slots.length === 2));
    assert.ok(topic.assignment.instructions.length > 100);
  }
});
