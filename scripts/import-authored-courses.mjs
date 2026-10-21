import { authoredFoundationTopics } from '../content/courses/catalog.mjs';
import { loadTypescript } from './load-typescript.mjs';
import { learningProject, readLearningServiceKey } from './learning-cli-access.mjs';
import { fetchCatalogRows } from './catalog-fetch.mjs';
const { parseLearningTopic, topicToRow, topicFromRow } = await loadTypescript('supabase/functions/_shared/learning-records.ts');
const { validateTopicPublication, findTopicConflict } = await loadTypescript('supabase/functions/_shared/learning-curriculum.ts');
const { lessonQualityIssues, lessonWordCount } = await loadTypescript('supabase/functions/_shared/lesson-quality.ts');
const topics = (await authoredFoundationTopics()).map(parseLearningTopic);
for (const topic of topics) {
  const issues = [...validateTopicPublication(topic, topics), ...lessonQualityIssues(topic.content)];
  if (issues.length) throw new Error(`${topic.id}: ${issues.join(' ')}`);
}
console.log(JSON.stringify({ validated: topics.length, totalQuestions: topics.reduce((n, t) => n + t.questions.length, 0), lessons: topics.map(t => ({ language: t.languageId, title: t.title, words: lessonWordCount(t.content) })) }));
if (!process.argv.includes('--save-drafts')) { console.log('Dry run only. Use --save-drafts to insert new private drafts.'); process.exit(0); }
const key = readLearningServiceKey(); const base = `https://${learningProject}.supabase.co`;
const existing = (await fetchCatalogRows(base, key, 'learning_topics')).map(topicFromRow);
const languages = await fetchCatalogRows(base, key, 'learning_languages');
// Preflight the complete batch before writing; never overwrite an existing lesson.
for (const topic of topics) {
  if (!languages.some(l => l.id === topic.languageId)) throw new Error(`Missing language ${topic.languageId}`);
  if (existing.some(t => t.id === topic.id || (t.languageId === topic.languageId && (t.slug === topic.slug || (t.state !== 'archived' && t.order === topic.order))))) throw new Error(`Existing content conflicts with ${topic.id}. No batch records were written. Review manually; do not overwrite.`);
  const conflict = findTopicConflict(existing, topic); if (conflict) throw new Error(conflict);
}
const result = await fetch(`${base}/rest/v1/learning_topics`, {
  method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
  body: JSON.stringify(topics.map(topic => ({ ...topicToRow(topic), pending_draft: null, updated_at: new Date().toISOString() }))),
});
if (!result.ok) throw new Error('Draft batch insert failed. Reload the catalog before retrying. No overwrite or publication was requested.');
const saved = await result.json(); if (!Array.isArray(saved) || saved.length !== topics.length) throw new Error('Unexpected save confirmation. Reload before retrying.');
console.log(JSON.stringify({ savedDrafts: saved.length, published: 0, overwritten: 0 }));
