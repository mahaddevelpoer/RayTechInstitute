import fs from 'node:fs/promises';
import { authoredCourseTopics } from '../content/courses/all-topics.mjs';
import { loadTypescript } from './load-typescript.mjs';
import { reviewedLessonCatalog } from './reviewed-mdx.mjs';
const { LEARNING_TOPICS } = await loadTypescript('src/data/learningCatalog.ts');
const reviewed = reviewedLessonCatalog(await authoredCourseTopics(), LEARNING_TOPICS);
await fs.writeFile('src/data/reviewedLessons.json', JSON.stringify(reviewed));
console.log(`[reviewed-mdx] Prepared ${Object.keys(reviewed).length} published, source-matched interactive lessons. No code evaluation.`);
