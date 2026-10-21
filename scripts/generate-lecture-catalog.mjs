import fs from 'node:fs/promises';
import ts from 'typescript';

const envText = await fs.readFile('.env.local', 'utf8').catch(() => '');
const localKey = envText.match(/^NEXT_PUBLIC_YOUTUBE_API_KEY\s*=\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '');
const key = process.env.YOUTUBE_API_KEY || localKey;
const output = 'src/data/lectureSnapshot.ts';

// Reuse the existing mapper at build time; no API credential enters the snapshot.
const asModule = code => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText).toString('base64');
const catalogModule = asModule(await fs.readFile('src/data/lectures.ts', 'utf8'));
const { lecturesData } = await import(catalogModule);
let lectures = lecturesData;
if (key && key !== 'PASTE_YOUTUBE_API_KEY_HERE') {
  const syncSource = (await fs.readFile('src/utils/youtubeSync.ts', 'utf8')).replaceAll("'@/data/lectures'", JSON.stringify(catalogModule));
  const { syncYouTubeFeedInBackground } = await import(asModule(syncSource));
  const result = await syncYouTubeFeedInBackground(key);
  if (result.isLive && result.lectures.length) lectures = result.lectures;
  else if (await fs.access(output).then(() => true, () => false)) {
    console.warn('[lectures] YouTube refresh unavailable; retaining the last published snapshot.');
    process.exit(0);
  }
} else if (await fs.access(output).then(() => true, () => false)) {
  console.log('[lectures] No build API key configured; retaining the committed snapshot.');
  process.exit(0);
}
const snapshot = JSON.stringify(lectures, null, 2).replace(/\u2014/g, '-');
await fs.writeFile(output, `import type { Lecture } from '@/types';\nexport const lectureSnapshot: Lecture[] = ${snapshot};\n`);
console.log(`[lectures] Static snapshot contains ${lectures.length} lectures.`);
