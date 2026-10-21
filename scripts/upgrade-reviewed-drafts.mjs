import assert from 'node:assert/strict';
import { authoredFoundationTopics } from '../content/courses/catalog.mjs';
import { loadTypescript } from './load-typescript.mjs';
import { fetchCatalogRows } from './catalog-fetch.mjs';
import { learningProject, readLearningServiceKey } from './learning-cli-access.mjs';
import { parseReviewedMdx } from './reviewed-mdx.mjs';
const { topicFromRow, topicToRow } = await loadTypescript('supabase/functions/_shared/learning-records.ts');
const { validateTopicPublication } = await loadTypescript('supabase/functions/_shared/learning-curriculum.ts');
const { lessonQualityIssues } = await loadTypescript('supabase/functions/_shared/lesson-quality.ts');
const topics = await authoredFoundationTopics(); const legacy = await authoredFoundationTopics({ interactive: false });
const previousMdx = await authoredFoundationTopics({ guided: false });
const previousGuided = await authoredFoundationTopics({ experiment: false });
for (const topic of topics) { assert.deepEqual([...validateTopicPublication(topic, topics), ...lessonQualityIssues(topic.content)], []); assert.equal(parseReviewedMdx(topic.content).filter(b => b.type !== 'markdown').length, 4); }
if (!process.argv.includes('--apply')) { console.log('Five reviewed MDX lessons validated. Dry run; no database writes.'); process.exit(0); }
const key = readLearningServiceKey(); const base = `https://${learningProject}.supabase.co`;
const rows = await fetchCatalogRows(base, key, 'learning_topics'); const changes = [];
for (const topic of topics) {
  const row = rows.find(r => r.id === topic.id);
  if (!row || row.state !== 'draft' || row.pending_draft) throw new Error(`Cannot safely upgrade ${topic.id}; preserve existing content and review manually.`);
  const current = topicToRow(topicFromRow(row));
  if (JSON.stringify(current) === JSON.stringify(topicToRow(topic))) continue;
  assert.ok([legacy, previousMdx, previousGuided].some(batch => JSON.stringify(current) === JSON.stringify(topicToRow(batch.find(t => t.id === topic.id)))), `${topic.id} changed since the reviewed import. No upgrade writes started.`);
  changes.push({ topic, row });
}
let saved = 0;
for (const { topic, row } of changes) {
  const filter = new URLSearchParams({ id: `eq.${topic.id}`, updated_at: `eq.${row.updated_at}`, state: 'eq.draft' });
  const result = await fetch(`${base}/rest/v1/learning_topics?${filter}`, { method: 'PATCH', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify({ ...topicToRow(topic), updated_at: new Date().toISOString() }) });
  if (!result.ok || (await result.json()).length !== 1) throw new Error(`Upgrade stopped after ${saved} drafts. A record changed or storage failed; reload before retrying.`);
  saved++;
}
console.log(JSON.stringify({ upgradedPrivateDrafts: saved, untouchedAlreadyCurrent: topics.length - changes.length, published: 0 }));
