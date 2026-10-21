import assert from 'node:assert/strict';
import { authoredCourseTopics } from '../content/courses/all-topics.mjs';
import { authoredPythonTopics } from '../content/courses/python/topics.mjs';
import { loadTypescript } from './load-typescript.mjs';
import { fetchCatalogRows } from './catalog-fetch.mjs';
import { learningProject, readLearningServiceKey } from './learning-cli-access.mjs';
import { parseReviewedMdx } from './reviewed-mdx.mjs';
const { topicFromRow, topicToRow, parseLearningTopic } = await loadTypescript('supabase/functions/_shared/learning-records.ts');
const { validateTopicPublication, findTopicConflict } = await loadTypescript('supabase/functions/_shared/learning-curriculum.ts');
const { lessonQualityIssues, lessonWordCount } = await loadTypescript('supabase/functions/_shared/lesson-quality.ts');
const topics = authoredPythonTopics().map(parseLearningTopic); const all = await authoredCourseTopics();
for (const topic of topics) { assert.deepEqual([...validateTopicPublication(topic, all), ...lessonQualityIssues(topic.content)], [], topic.title); parseReviewedMdx(topic.content); }
console.log(JSON.stringify({ validatedAdditionalUnits: topics.length, pythonTotal: all.filter(t => t.languageId === 'python').length, workedExamples: topics.length * 3, words: topics.map(t => ({ slug: t.slug, words: lessonWordCount(t.content) })) }));
if (!process.argv.includes('--save-drafts')) { console.log('Dry run. No database writes.'); process.exit(0); }
const key = readLearningServiceKey(); const base = `https://${learningProject}.supabase.co`;
const rows = await fetchCatalogRows(base, key, 'learning_topics'); const existing = rows.map(topicFromRow);
const languages = await fetchCatalogRows(base, key, 'learning_languages'); assert.ok(languages.some(l => l.id === 'python'));
const pending = [];
for (const topic of topics) {
  const current = rows.find(row => row.id === topic.id);
  if (current) {
    assert.equal(current.state, 'draft', 'Do not overwrite published or archived records.');
    assert.ok(!current.pending_draft, 'Preserve pending user edits.');
    assert.deepEqual(topicToRow(topicFromRow(current)), topicToRow(topic), 'Preserve changed user content.');
    continue;
  }
  assert.ok(!existing.some(t => t.languageId === 'python' && (t.slug === topic.slug || t.state !== 'archived' && t.order === topic.order)), `Existing slug/order conflicts with ${topic.title}`);
  const conflict = findTopicConflict(existing, topic); assert.equal(conflict, null);
  pending.push(topic);
}
if (pending.length) {
  const result = await fetch(`${base}/rest/v1/learning_topics`, { method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify(pending.map(topic => ({ ...topicToRow(topic), pending_draft: null, updated_at: new Date().toISOString() }))) });
  if (!result.ok) throw new Error('Draft batch insertion failed; inspect saved state before retrying. No overwrite or publication was requested.');
  assert.equal((await result.json()).length, pending.length);
}
console.log(JSON.stringify({ savedPrivateDrafts: pending.length, alreadyMatching: topics.length - pending.length, published: 0 }));
