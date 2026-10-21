import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
const directory = 'public/codi';
await fs.mkdir(`${directory}/audio`,{recursive:true});
try { await fs.access(`${directory}/audio/index.json`); } catch { await fs.writeFile(`${directory}/audio/index.json`,JSON.stringify({schema:1,ready:[]})); }
// Cloud voice is the default. Do not bundle/download the retired neural runtime
// during every dev, test and build. Kept opt-in for reproducible source archives.
if (process.env.CODI_PREPARE_LOCAL_VOICE !== 'true') { console.log('[codi] Cloud voice enabled; local speech-model preparation skipped.'); process.exit(0); }
async function packageRoot(name) {
  let current = path.dirname(fileURLToPath(import.meta.resolve(name)));
  while (current !== path.dirname(current)) {
    const info = await fs.readFile(path.join(current, 'package.json'), 'utf8').then(JSON.parse).catch(() => null);
    if (info?.name === name) return current;
    current = path.dirname(current);
  }
  throw new Error(`Package root unavailable: ${name}`);
}
await fs.mkdir(`${directory}/runtime`, { recursive: true });
const ort = await packageRoot('onnxruntime-web');
for (const file of await fs.readdir(path.join(ort, 'dist'))) if (/^ort-wasm.*\.(?:wasm|mjs)$/.test(file)) await fs.copyFile(path.join(ort, 'dist', file), `${directory}/runtime/${file}`);
await build({ entryPoints: ['scripts/runtimes/codi-worker.mjs'], outfile: `${directory}/worker.js`, bundle: true, minify: true, charset: 'utf8', platform: 'browser', format: 'esm', target: 'es2022', legalComments: 'eof', external: ['onnxruntime-node', 'node:module'], banner: { js: '// Codi speech worker: GPL-3.0-or-later. Source and notices: /codi/source/README.txt' }, define: { 'process.env.NODE_ENV': '"production"' } });
await fs.mkdir(`${directory}/source`, { recursive: true });
for (const name of ['codi-worker.mjs', 'codi-models.mjs']) await fs.copyFile(`scripts/runtimes/${name}`, `${directory}/source/${name}`);
for (const name of ['build.mjs', 'package.json', 'package-lock.json', 'README.txt']) await fs.copyFile(`scripts/codi-source/${name}`, `${directory}/source/${name}`);
for (const [name, file, target] of [['three', 'LICENSE', 'three-LICENSE.txt'], ['ephone', 'COPYING', 'source/COPYING.txt'], ['@huggingface/transformers', 'LICENSE', 'source/TRANSFORMERS-LICENSE.txt']]) await fs.copyFile(path.join(await packageRoot(name), file), `${directory}/${target}`);
const ortLicense = `${directory}/source/ONNX-LICENSE.txt`;
if (!await fs.access(ortLicense).then(() => true, () => false)) {
  const response = await fetch('https://raw.githubusercontent.com/microsoft/onnxruntime/8d85527a0/LICENSE', { signal: AbortSignal.timeout(30000) });
  const licence = await response.text();
  if (!response.ok || !licence.includes('MIT License')) throw new Error('Required ONNX licence is unavailable.');
  await fs.writeFile(ortLicense, licence);
}
const archive = `${directory}/source/ephone-source.tar.gz`;
if (!await fs.access(archive).then(() => true, () => false)) {
  const response = await fetch('https://codeload.github.com/sjmik/ephone-js/tar.gz/4f6d246c1d3acf67a4d814e20da02fa3967bc92d', { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error('Required pronunciation source archive is unavailable.');
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 10000 || bytes.length > 100000000 || bytes[0] !== 31 || bytes[1] !== 139) throw new Error('Invalid pronunciation source archive.');
  await fs.writeFile(archive, bytes);
}
console.log('[codi] Prepared speech worker, source notices and interpreter assets. The procedural robot needs no model download.');
