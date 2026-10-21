import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
const require = createRequire(import.meta.url);
const destination = path.resolve('public/learning-runtimes');
await fs.mkdir(destination, { recursive: true });
const pythonRoot = path.dirname(require.resolve('pyodide/package.json'));
const phpRoot = path.dirname(require.resolve('@php-wasm/web-8-3/package.json'));
const domRoot = path.dirname(require.resolve('@ampproject/worker-dom/package.json'));
await fs.copyFile(path.join(domRoot, 'dist/worker/worker.js'), path.join(destination, 'dom-worker.js'));
await fs.copyFile(path.join(domRoot, 'LICENSE'), path.join(destination, 'WORKER-DOM-LICENSE.txt'));
await build({ entryPoints: ['scripts/runtimes/dom-frame.js'], outfile: path.join(destination, 'dom-frame.js'), bundle: true, platform: 'browser', format: 'iife', target: 'es2022', legalComments: 'eof' });
const pythonFiles = ['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
for (const file of pythonFiles) await fs.copyFile(path.join(pythonRoot, file), path.join(destination, file));
await fs.copyFile('scripts/runtimes/python-worker.js', path.join(destination, 'python-worker.js'));
const loaderPath = path.join(phpRoot, 'asyncify/php_8_3.js');
const loaderSource = await fs.readFile(loaderPath, 'utf8');
const wasmRelative = loaderSource.match(/new URL\('([^']+\.wasm)'/)[1];
const wasmPath = path.resolve(path.dirname(loaderPath), wasmRelative);
await fs.copyFile(wasmPath, path.join(destination, 'php.wasm'));
await build({
  entryPoints: ['scripts/runtimes/php-worker.js'], outfile: path.join(destination, 'php-worker.js'),
  bundle: true, platform: 'browser', format: 'iife', target: 'es2022', legalComments: 'eof',
  external: ['worker_threads', 'events'], define: { process: 'undefined' },
  plugins: [{ name: 'in-memory-php-loader', setup(builder) {
    builder.onResolve({ filter: /^raytech:php-loader$/ }, () => ({ path: loaderPath, namespace: 'php-loader' }));
    builder.onLoad({ filter: /.*/, namespace: 'php-loader' }, () => ({
      contents: loaderSource.replace(/const dependencyFilename = new URL\([\s\S]+?\.href;/, "const dependencyFilename = 'memory:php.wasm';"),
      loader: 'js', resolveDir: path.dirname(loaderPath),
    }));
  } }],
});
// Preserve redistributable notices beside the generated third-party artifacts.
await fs.copyFile(path.join(phpRoot, 'LICENSE'), path.join(destination, 'PHP-WASM-LICENSE.txt'));
await fs.writeFile(path.join(destination, 'NOTICE.txt'), 'Runtime versions: Pyodide 0.25.1 (MPL-2.0 and bundled Python licenses); WordPress PHP.wasm 3.1.58, PHP 8.3 (GPL-2.0-or-later, PHP license and bundled component licenses).\nSources: https://github.com/pyodide/pyodide/tree/0.25.1 and https://github.com/WordPress/wordpress-playground\nRuntime assets are built from pinned npm packages. No student code is sent to a remote compiler.\n');
await fs.appendFile(path.join(destination, 'NOTICE.txt'), 'DOM runtime: AMP WorkerDOM 0.36.0 (Apache-2.0). Source: https://github.com/ampproject/worker-dom. License: WORKER-DOM-LICENSE.txt.\n');
const files = [...pythonFiles, 'python-worker.js', 'php-worker.js', 'php.wasm', 'dom-frame.js', 'dom-worker.js'];
for (const file of files) {
  const { size } = await fs.stat(path.join(destination, file));
  if (size < 100) throw new Error(`Runtime asset is missing or truncated: ${file}`);
}
console.log('[learning-runtimes] Prepared pinned Python, PHP and JavaScript DOM browser assets.');
