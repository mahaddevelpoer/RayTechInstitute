import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { authoredCourseTopics } from '../content/courses/all-topics.mjs';
const source = path.resolve('.');
const tempRoot = process.platform === 'win32' && path.parse(os.tmpdir()).root.toLowerCase() !== path.parse(source).root.toLowerCase() ? path.dirname(source) : os.tmpdir();
const directory = await fs.mkdtemp(path.join(tempRoot, 'raytech-authored-preview-'));
console.log(`Isolated authored-content preview: ${directory}`);
for (const item of ['src', 'public', 'scripts', 'content', 'supabase/functions/_shared', 'package.json', 'package-lock.json', 'tsconfig.json', 'next-env.d.ts', 'next.config.mjs', 'tailwind.config.ts', 'postcss.config.mjs', 'firebase.json']) await fs.cp(path.join(source, item), path.join(directory, item), { recursive: true });
await fs.symlink(path.join(source, 'node_modules'), path.join(directory, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
const configPath = path.join(directory, 'next.config.mjs'); const config = await fs.readFile(configPath, 'utf8');
await fs.writeFile(configPath, config.replace('export default nextConfig;', `export default { ...nextConfig, outputFileTracingRoot: ${JSON.stringify(directory)} };`));
const topics = (await authoredCourseTopics()).map(t => ({ ...t, state: 'published' }));
const languages = ['html', 'css', 'javascript', 'php', 'python'].map(id => ({ id, slug: id, title: { html: 'HTML', css: 'CSS', javascript: 'JavaScript', php: 'PHP', python: 'Python' }[id], runtime: id, state: 'published', description: 'Preview the original foundation lesson. The complete core-language curriculum is still being written.' }));
const courses = [{ id: 'web-development', slug: 'web-development', title: 'Web Development', description: 'Foundation lesson preview for four separate core-language tracks. Not a completed curriculum.', languageIds: ['html', 'css', 'javascript', 'php'], state: 'published' }, { id: 'python', slug: 'python', title: 'Python Programming', description: 'Original Python foundation lesson preview. The complete course remains in progress.', languageIds: ['python'], state: 'published' }];
await fs.writeFile(path.join(directory, 'src/data/learningCatalog.ts'), `import type { LearningLanguage, LearningCourse, LearningTopic } from '@/types/learning';\nexport const LEARNING_LANGUAGES: LearningLanguage[] = ${JSON.stringify(languages)};\nexport const LEARNING_COURSES: LearningCourse[] = ${JSON.stringify(courses)};\nexport const LEARNING_TOPICS: LearningTopic[] = ${JSON.stringify(topics)};\n`);
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => /^(PATH|SystemRoot|WINDIR|APPDATA|LOCALAPPDATA|TEMP|TMP|USERPROFILE|HOME|COMSPEC|NUMBER_OF_PROCESSORS|PROCESSOR_ARCHITECTURE)$/i.test(key)));
Object.assign(env, { NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_SITE_URL: 'https://authored-preview.invalid', NEXT_PUBLIC_SUPABASE_URL: 'https://preview-only.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'preview-public-config-not-a-credential' });
for (const args of [['scripts/generate-reviewed-lessons.mjs'], [path.join(source, 'node_modules/next/dist/bin/next'), 'build'], ['scripts/finalize-export.mjs'], ['scripts/audit-seo.mjs'], ['scripts/assert-export-secrets.mjs']]) await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, args, { cwd: directory, env, stdio: 'inherit' }); child.once('error', reject); child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Preview build failed (${code}).`)));
});
const sitemap = await fs.readFile(path.join(directory, 'out/sitemap.xml'), 'utf8'); let checked = 0;
for (const topic of topics) for (const suffix of ['', '/quiz', '/assignment']) {
  const route = `learn/${topic.languageId}/${topic.slug}${suffix}`;
  const html = await fs.readFile(path.join(directory, 'out', route, 'index.html'), 'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length, 1); assert.ok(html.includes(topic.title));
  if (!suffix) { assert.ok(sitemap.includes(`/${route}/`)); assert.ok(html.includes('Expected output') || html.includes('Expected result')); assert.ok(html.includes('Check prediction') && html.includes('Next step') && html.includes('Open in Practice')); assert.ok(html.includes('Understand') && html.includes('AI suggested activity')); }
  checked++;
}
await fs.writeFile(path.join(directory, 'out/PREVIEW_ONLY.txt'), 'Reviewed authored units: 20 Python core lessons and four other-language foundations. Not a finished five-language curriculum or a production deployment. No database records were published.');
console.log(JSON.stringify({ directory, staticPagesChecked: checked, liveDatabaseWrites: 0, published: false }));
