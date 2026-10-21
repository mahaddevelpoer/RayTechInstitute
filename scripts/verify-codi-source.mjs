import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { hasPrivateCredential } from './private-credential-patterns.mjs';
const source = path.resolve('public/codi/source');
const root = await fs.mkdtemp(path.resolve('artifacts/codi/source-rebuild-'));
const expected = ['build.mjs', 'codi-models.mjs', 'codi-worker.mjs', 'package.json', 'package-lock.json', 'README.txt', 'COPYING.txt', 'TRANSFORMERS-LICENSE.txt', 'ONNX-LICENSE.txt', 'ephone-source.tar.gz'];
for (const file of expected) {
  const bytes = await fs.readFile(path.join(source, file));
  if (!bytes.length || hasPrivateCredential(bytes.toString('utf8'))) throw new Error('Source-package integrity failed; details suppressed.');
  await fs.copyFile(path.join(source, file), path.join(root, file));
}
const npmEntry = process.platform === 'win32' ? 'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js' : process.env.npm_execpath;
if (!npmEntry) throw new Error('npm CLI entry is required for source rebuild.');
for (const args of [['ci', '--ignore-scripts', '--no-audit', '--no-fund'], ['run', 'build']]) {
  const result = spawnSync(process.execPath, [npmEntry, ...args], { cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 2000000 });
  if (result.status !== 0) throw new Error(`Source rebuild failed at npm ${args[0]}; diagnostic values suppressed.`);
}
const original = await fs.readFile('public/codi/worker.js'); const rebuilt = await fs.readFile(path.join(root, 'dist/worker.js'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const byteIdentical = hash(original) === hash(rebuilt);
if (!byteIdentical) throw new Error('Rebuilt speech worker is not byte-identical to the prepared worker.');
console.log(JSON.stringify({ sourceFilesChecked: expected.length, privateCredentialMatches: 0, byteIdentical, sha256: hash(rebuilt), isolatedBuildDirectory: root }));
