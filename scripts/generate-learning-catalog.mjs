import fs from 'node:fs/promises';
import { fetchCatalogRows } from './catalog-fetch.mjs';
import { buildLearningSnapshot } from './learning-snapshot.mjs';
import nextEnv from '@next/env';
import { learningProject, readLearningServiceKey } from './learning-cli-access.mjs';
nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });

// Server/build-only credential. Never use NEXT_PUBLIC for this key.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
let key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key && !process.env.CI && !process.env.GITHUB_ACTIONS) {
  if (url !== `https://${learningProject}.supabase.co`) throw new Error('Local CLI export must target the scoped learning project.');
  key = readLearningServiceKey();
}
if (!url || !key) throw new Error('Learning export requires server-side database configuration. Refusing a stale export.');
const [languages, courses, topics] = await Promise.all(['learning_languages', 'learning_courses', 'learning_topics'].map(table => fetchCatalogRows(url, key, table)));
const snapshot = buildLearningSnapshot({ languages, courses, topics });
const contents = `import type { LearningLanguage, LearningCourse, LearningTopic } from '@/types/learning';\nexport const LEARNING_LANGUAGES: LearningLanguage[] = ${JSON.stringify(snapshot.languages, null, 2)};\nexport const LEARNING_COURSES: LearningCourse[] = ${JSON.stringify(snapshot.courses, null, 2)};\nexport const LEARNING_TOPICS: LearningTopic[] = ${JSON.stringify(snapshot.topics, null, 2)};\n`;
// Write only after every table and publication invariant was checked.
await fs.writeFile('src/data/learningCatalog.ts', contents.replace(/\u2014/g, '-'));
console.log(`[learning] Exported ${snapshot.courses.length} courses, ${snapshot.languages.length} languages and ${snapshot.topics.length} published lessons.`);
await import('./generate-reviewed-lessons.mjs');
await import('./prepare-codi-lessons.mjs');
await import('./prepare-learning-directory.mjs');
await import('./prepare-codi-audio.mjs');
if(process.env.GITHUB_ACTIONS==='true') await import('./sync-codi-audio.mjs');
