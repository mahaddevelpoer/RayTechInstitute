import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { learningPageFixture } from './learning-page-fixture.mjs';

// Deliberately no database, hosting, gh or Supabase CLI calls. Build only a copy.
const source = path.resolve('.');
// Next/Webpack's Windows entry resolution cannot span drives through a junction.
const tempRoot = process.platform === 'win32' && path.parse(os.tmpdir()).root.toLowerCase() !== path.parse(source).root.toLowerCase() ? path.dirname(source) : os.tmpdir();
const directory = await fs.mkdtemp(path.join(tempRoot, 'raytech-learning-pages-'));
console.log(`[learning-pages] Isolated QA checkout: ${directory}`);
for (const item of ['src', 'public', 'scripts', 'supabase/functions/_shared', 'package.json', 'package-lock.json', 'tsconfig.json', 'next-env.d.ts', 'next.config.mjs', 'tailwind.config.ts', 'postcss.config.mjs']) {
  await fs.cp(path.join(source, item), path.join(directory, item), { recursive: true });
}
await fs.symlink(path.join(source, 'node_modules'), path.join(directory, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
const fixture = learningPageFixture();
assert.ok(fixture.topics.some(topic => topic.summary.length < 120));
assert.ok(fixture.topics.some(topic => topic.summary.length > 155));
const catalogPath = path.join(source, 'src/data/learningCatalog.ts');
const originalCatalog = await fs.readFile(catalogPath, 'utf8');
// A temp checkout can have unrelated ancestor lockfiles. Trace only this copy.
const configPath = path.join(directory, 'next.config.mjs');
const config = await fs.readFile(configPath, 'utf8');
await fs.writeFile(configPath, config.replace('export default nextConfig;', `export default { ...nextConfig, outputFileTracingRoot: ${JSON.stringify(directory)} };`));
async function writeCatalog(snapshot) {
  await fs.writeFile(path.join(directory, 'src/data/learningCatalog.ts'), `import type { LearningLanguage, LearningCourse, LearningTopic } from '@/types/learning';\nexport const LEARNING_LANGUAGES: LearningLanguage[] = ${JSON.stringify(snapshot.languages)};\nexport const LEARNING_COURSES: LearningCourse[] = ${JSON.stringify(snapshot.courses)};\nexport const LEARNING_TOPICS: LearningTopic[] = ${JSON.stringify(snapshot.topics)};\n`);
}
await writeCatalog(fixture);
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => /^(PATH|SystemRoot|WINDIR|APPDATA|LOCALAPPDATA|TEMP|TMP|USERPROFILE|HOME|COMSPEC|NUMBER_OF_PROCESSORS|PROCESSOR_ARCHITECTURE)$/i.test(key)));
Object.assign(env, { NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_SITE_URL: 'https://learning-fixture.invalid', NEXT_PUBLIC_SUPABASE_URL: 'https://fixture-only.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'fixture-public-key-not-a-credential' });
async function command(args) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: directory, env, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Local QA command failed (${code}). The isolated checkout was retained for inspection.`)));
  });
}
await command([path.join(source, 'node_modules/next/dist/bin/next'), 'build']);
await command(['scripts/finalize-export.mjs']);
await command(['scripts/audit-seo.mjs']);
const out = path.join(directory, 'out');
const sitemap = await fs.readFile(path.join(out, 'sitemap.xml'), 'utf8');
let checked = 0;
const lessonMetadata = [];
async function readPage(route) {
  const html = await fs.readFile(path.join(out, route, 'index.html'), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: exactly one page heading`);
  assert.ok(html.includes(`href="https://learning-fixture.invalid/${route}/"`), `${route}: correct canonical`);
  assert.ok(!html.includes('PRIVATE_DRAFT_MUST_NOT_EXPORT') && !html.includes('PRIVATE_TOPIC_MUST_NOT_EXPORT'));
  if (/^learn\/[^/]+\/[^/]+$/.test(route)) {
    const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/)?.[1];
    assert.ok(description && description.length >= 120 && description.length <= 155, `${route}: bounded description despite short/long summary`);
    lessonMetadata.push({ route, descriptionLength: description.length });
  }
  checked++;
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}
for (const course of fixture.courses) {
  const route = `courses/${course.slug}`; const html = await readPage(route);
  assert.ok(sitemap.includes(`https://learning-fixture.invalid/${route}/`));
  for (const id of course.languageIds) assert.ok(html.includes(`href="/learn/${id}/"`));
}
for (const language of fixture.languages) {
  const list = await readPage(`learn/${language.slug}`);
  for (const topic of fixture.topics.filter(item => item.languageId === language.id)) {
    const route = `learn/${language.slug}/${topic.slug}`;
    assert.ok(list.includes(`href="/${route}/"`));
    const lesson = await readPage(route);
    assert.ok(lesson.includes(`LOCAL_QA_LESSON_${language.id}_${topic.order}`));
    assert.ok(lesson.includes('aria-label="Lesson content"') && lesson.includes('aria-label="Practice code"'));
    assert.ok(sitemap.includes(`https://learning-fixture.invalid/${route}/`));
    const quiz = await readPage(`${route}/quiz`);
    assert.ok(quiz.includes('Start test') && quiz.includes('80%'));
    assert.ok(!quiz.includes('Read the example first'), 'Answers must not appear in the visible, unstarted quiz');
    const assignment = await readPage(`${route}/assignment`);
    assert.ok(assignment.includes('Complete the topic test first'));
    assert.ok(!sitemap.includes(`https://learning-fixture.invalid/${route}/assignment/`), 'Locked assignment is noindex');
    assert.ok(assignment.includes('noindex'));
  }
}
// Rebuild in the same QA directory to detect stale files surviving edits/deletes.
const removed = fixture.topics.find(topic => topic.id === 'python-topic-2');
assert.ok(removed);
const updated = {
  ...fixture,
  topics: fixture.topics.filter(topic => topic.id !== removed.id).map(topic => topic.id === 'javascript-topic-1' ? { ...topic, title: 'JavaScript Edited Example', version: topic.version + 1, content: '## Revised worked example\n\nLOCAL_QA_EDITED_CONTENT' } : topic),
};
await writeCatalog(updated);
console.log('[learning-pages] Rebuilding the same QA directory after one edit and one deletion.');
await command([path.join(source, 'node_modules/next/dist/bin/next'), 'build']);
await command(['scripts/finalize-export.mjs']);
await command(['scripts/audit-seo.mjs']);
const updatedSitemap = await fs.readFile(path.join(out, 'sitemap.xml'), 'utf8');
for (const suffix of ['', '/quiz', '/assignment']) {
  const route = `learn/python/${removed.slug}${suffix}`;
  await assert.rejects(fs.access(path.join(out, route, 'index.html')), { code: 'ENOENT' });
  assert.ok(!updatedSitemap.includes(`https://learning-fixture.invalid/${route}/`));
}
assert.ok(!(await readPage('learn/python')).includes(`/learn/python/${removed.slug}/`));
const edited = await readPage('learn/javascript/practice-1');
assert.ok(edited.includes('LOCAL_QA_EDITED_CONTENT') && edited.includes('JavaScript Edited Example'));
assert.ok(!edited.includes('LOCAL_QA_LESSON_javascript_1'));
assert.ok((await readPage('learn/javascript')).includes('JavaScript Edited Example'));
assert.equal(await fs.readFile(catalogPath, 'utf8'), originalCatalog, 'The real catalog must remain untouched');
const report = { schema: 1, fixtureOnly: true, checkedAt: new Date().toISOString(), checkedPages: checked, languages: fixture.languages.length, initialTopics: fixture.topics.length, updatedTopics: updated.topics.length, editDeleteRebuild: true, shortAndLongSummaries: true, lessonMetadata, databaseWrites: 0, deployments: 0, limitations: ['Static HTML/build verification only; browser interaction, layout, API mutations and runtime isolation remain unverified.'] };
await fs.writeFile(path.join(directory, 'learning-page-report.json'), JSON.stringify(report, null, 2));
await fs.writeFile(path.join(out, 'FIXTURE_ONLY.txt'), 'Synthetic local QA export. Do not publish.\n');
console.log(`[learning-pages] Passed ${checked} populated pages across all five runtimes. No database writes or deployments. Report: ${path.join(directory, 'learning-page-report.json')}`);
