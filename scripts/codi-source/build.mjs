// SPDX-License-Identifier: GPL-3.0-or-later
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const require = createRequire(import.meta.url);
await fs.mkdir('dist/runtime', { recursive: true });
const runtime = path.dirname(require.resolve('onnxruntime-web'));
for (const file of await fs.readdir(runtime)) if (/^ort-wasm.*\.(?:wasm|mjs)$/.test(file)) await fs.copyFile(path.join(runtime, file), `dist/runtime/${file}`);
await build({ entryPoints: ['codi-worker.mjs'], outfile: 'dist/worker.js', bundle: true, minify: true, charset: 'utf8', platform: 'browser', format: 'esm', target: 'es2022', legalComments: 'eof', external: ['onnxruntime-node', 'node:module'], banner: { js: '// Codi speech worker: GPL-3.0-or-later. Source and notices: /codi/source/README.txt' }, define: { 'process.env.NODE_ENV': '"production"' } });
