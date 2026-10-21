import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { authoredCourseTopics } from '../content/courses/all-topics.mjs';
import { loadTypescript } from './load-typescript.mjs';
import { fetchCatalogRows } from './catalog-fetch.mjs';
import { buildLearningSnapshot } from './learning-snapshot.mjs';
import { learningProject, readLearningServiceKey } from './learning-cli-access.mjs';
import { parseReviewedMdx } from './reviewed-mdx.mjs';
const { topicFromRow, topicToRow } = await loadTypescript('supabase/functions/_shared/learning-records.ts');
const key = readLearningServiceKey(); const base = `https://${learningProject}.supabase.co`;
const [languages, courses, topics] = await Promise.all(['learning_languages', 'learning_courses', 'learning_topics'].map(table => fetchCatalogRows(base, key, table)));
const authored = await authoredCourseTopics(); const selected = [];
for (const topic of authored) {
  const row = topics.find(item => item.id === topic.id);
  assert.ok(row && ['draft', 'published'].includes(row.state) && !row.pending_draft, 'Reviewed lesson missing, archived or edited. Preserve it and stop.');
  assert.deepEqual(topicToRow({ ...topicFromRow(row), state: 'draft' }), topicToRow(topic), `Source mismatch for ${topic.id}. Nothing published.`);
  parseReviewedMdx(topic.content);
  selected.push({ table: 'learning_topics', row });
}
for (const id of ['html', 'css', 'javascript', 'php', 'python']) {
  const row = languages.find(item => item.id === id);
  assert.ok(row && row.slug === id && row.runtime === id && ['draft', 'published'].includes(row.state), 'Unexpected language registry. Stop without overwriting.');
  selected.push({ table: 'learning_languages', row });
}
for (const id of ['web-development', 'python']) {
  const row = courses.find(item => item.id === id);
  const expected = id === 'python' ? ['python'] : ['html', 'css', 'javascript', 'php'];
  assert.ok(row && row.slug === id && ['draft', 'published'].includes(row.state)); assert.deepEqual(row.language_ids, expected);
  selected.push({ table: 'learning_courses', row });
}
const proposed = rows => rows.map(row => selected.some(item => item.row === row) ? { ...row, state: 'published' } : row);
const snapshot = buildLearningSnapshot({ languages: proposed(languages), courses: proposed(courses), topics: proposed(topics) });
console.log(JSON.stringify({ reviewedLessons: authored.length, proposedPublicLessons: snapshot.topics.length, privateReadsOnly: !process.argv.includes('--publish') }));
if (!process.argv.includes('--publish')) process.exit(0);
const backup = await fs.mkdtemp(path.join(path.dirname(process.cwd()), 'raytech-publication-backup-'));
await fs.writeFile(path.join(backup, 'reviewed-records-before-publication.json'), JSON.stringify(selected, null, 2));
console.log(`Recoverable publication-state backup: ${backup}`);
let changed = 0;
for (const { table, row } of selected) {
  if (row.state === 'published') continue;
  const filter = new URLSearchParams({ id: `eq.${row.id}`, state: 'eq.draft', updated_at: `eq.${row.updated_at}` });
  const response = await fetch(`${base}/rest/v1/${table}?${filter}`, { method: 'PATCH', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify({ state: 'published', updated_at: new Date().toISOString() }) });
  if (!response.ok || (await response.json()).length !== 1) throw new Error(`Publication stopped after ${changed} state changes. A record changed or storage failed. Use the saved backup for review; do not overwrite user changes.`);
  changed++;
}
console.log(JSON.stringify({ reviewedPublicationStateChanges: changed, publishedLessons: authored.length, overwrittenBodies: 0, hostingDeployed: false }));
