import fs from 'node:fs/promises';
import { createCodiAudio } from './runtimes/codi-models.mjs';
import { loadTypescript } from './load-typescript.mjs';
const { codiWav } = await loadTypescript('src/lib/learning/codi-line.ts');
await fs.mkdir('artifacts/codi', { recursive: true });
try { for (const language of ['en', 'hi']) {
  const result = await createCodiAudio('A variable is a name that refers to a value.', language, message => console.log(`[${language}] ${message}`), 'cpu');
  const peak = result.samples.reduce((value, sample) => Math.max(value, Math.abs(sample)), 0);
  if (peak < .001 || result.samples.length < result.rate / 4) throw new Error('Generated audio was silent or truncated.');
  await fs.writeFile(`artifacts/codi/${language}-variable.wav`, codiWav(result.samples, result.rate));
  await fs.writeFile(`artifacts/codi/${language}-variable.txt`, result.text);
  console.log(JSON.stringify({ language, seconds: result.samples.length / result.rate, nonSilent: true, translated: language === 'hi' ? /[\u0900-\u097f]/.test(result.text) : undefined }));
} } catch (error) { console.error(`[codi-audio] ${String(error?.message || 'Inference failed').slice(0, 500)}`); process.exitCode = 1; }
