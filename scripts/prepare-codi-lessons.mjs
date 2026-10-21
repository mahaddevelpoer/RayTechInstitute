import fs from 'node:fs/promises';
import path from 'node:path';
import { loadTypescript } from './load-typescript.mjs';
const { LEARNING_LANGUAGES, LEARNING_TOPICS } = await loadTypescript('src/data/learningCatalog.ts');
const root = path.resolve('public/codi/lessons'); await fs.mkdir(root, { recursive: true });
const kept = new Set();
for (const language of LEARNING_LANGUAGES) {
  if (!/^[a-z0-9-]+$/.test(language.slug)) throw new Error('Invalid language slug');
  const file = `${language.slug}.json`; kept.add(file);
  const lessons = LEARNING_TOPICS.filter(topic => topic.languageId === language.id && topic.state === 'published').sort((a, b) => a.order - b.order).map(({ id, title, slug, order, content }) => ({ id, title, slug, order, content }));
  await fs.writeFile(path.join(root, file), JSON.stringify(lessons));
}
for (const file of await fs.readdir(root)) if (/^[a-z0-9-]+\.json$/.test(file) && !kept.has(file)) await fs.unlink(path.join(root, file));
console.log(`[codi-lessons] Prepared ${kept.size} static explanation indexes. No assessments or private drafts included.`);
