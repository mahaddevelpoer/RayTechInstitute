import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

// Real WASM engines under a worker-like VM. This verifies interpreter/adapter
// behavior, not browser sandbox/CSP enforcement, which remains a browser gate.
async function execute(language, code, stdin = '') {
  const root = 'public/learning-runtimes/';
  const names = language === 'python' ? ['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'] : ['php.wasm'];
  const assets = Object.fromEntries(await Promise.all(names.map(async name => {
    const bytes = await fs.readFile(root + name);
    return [name, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)];
  })));
  const blobs = new Map();
  class ScriptBlob extends Blob { constructor(parts, options) { super(parts, options); this.source = parts.map(p => typeof p === 'string' ? p : new TextDecoder().decode(p)).join(''); } }
  class RuntimeURL extends URL {
    constructor(...args) { try { super(...args); } catch (error) { throw new Error(`Invalid runtime URL ${args.join(' | ')}: ${error.stack.split('\n').slice(1, 5).join(' ')}`); } }
    static createObjectURL(blob) { const id = `blob:test-${blobs.size}`; blobs.set(id, blob.source); return id; }
    static revokeObjectURL(id) { blobs.delete(id); }
  }
  const messages = [];
  const channels = [];
  class RuntimeMessageChannel extends MessageChannel { constructor() { super(); channels.push(this); } }
  class WorkerGlobalScope { static [Symbol.hasInstance](value) { return typeof value?.postMessage === 'function'; } }
  const sandbox = Object.assign(new WorkerGlobalScope(), {
    console, Blob: ScriptBlob, URL: RuntimeURL, Response, Request, Headers, TextEncoder, TextDecoder,
    ReadableStream, WritableStream, TransformStream, AbortController, AbortSignal,
    structuredClone, setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask,
    crypto: webcrypto, performance, WorkerGlobalScope,
    EventTarget, Event, CustomEvent, MessageChannel: RuntimeMessageChannel, File,
    location: new URL('blob:https://example.test/isolated-worker'), navigator: { userAgent: 'Wasm integration test' },
    addEventListener() {}, removeEventListener() {},
    postMessage(message) { messages.push(message); },
  });
  sandbox.self = sandbox;
  const context = vm.createContext(sandbox, { codeGeneration: { strings: false, wasm: true } });
  sandbox.importScripts = (...urls) => urls.forEach(url => {
    assert.ok(blobs.has(url), 'Only prepared in-memory scripts may load');
    vm.runInContext(blobs.get(url), context, { timeout: 10000 });
  });
  vm.runInContext(await fs.readFile(root + `${language}-worker.js`, 'utf8'), context);
  try { await sandbox.onmessage({ data: { code, stdin, assets } }); }
  finally { for (const channel of channels) { channel.port1.close(); channel.port2.close(); } }
  return { messages, output: messages.filter(item => item.type === 'output').map(item => item.text).join('') };
}

test('real Python WASM executes input, variables and loops through the isolated adapter', { timeout: 60000 }, async () => {
  const result = await execute('python', 'name = input()\nfor n in range(3):\n    print(name, n)', 'RayTech');
  assert.match(result.output, /RayTech 0\nRayTech 1\nRayTech 2/, JSON.stringify(result.messages));
  assert.equal(result.messages.at(-1).type, 'done');
  assert.equal(result.messages.at(-1).text, undefined);
  assert.ok(result.messages.some(item => item.type === 'ready'));
});

test('real PHP WASM executes loops and a request body without a server', { timeout: 60000 }, async () => {
  const result = await execute('php', '<?php $name = file_get_contents("php://input"); for ($n = 0; $n < 3; $n++) { echo "$name $n\\n"; }', 'RayTech');
  assert.match(result.output, /RayTech 0\nRayTech 1\nRayTech 2/, JSON.stringify(result.messages));
  assert.equal(result.messages.at(-1).type, 'done');
  assert.equal(result.messages.at(-1).text, '');
});

test('authored Python and PHP worked examples match their exact documented outputs', { timeout: 120000 }, async () => {
  const { authoredFoundationTopics } = await import('../content/courses/catalog.mjs');
  const topics = await authoredFoundationTopics();
  const expected = {
    python: ['Learning Python\nPredict before you run', '15\n105\n50', '360'],
    php: ['Welcome to PHP\nRun one example at a time.', '12\n32', 'Total: 360'],
  };
  for (const language of ['python', 'php']) {
    const blocks = [...topics.find(t => t.languageId === language).content.matchAll(new RegExp('```' + language + '\\n([\\s\\S]*?)\\n```', 'g'))].map(m => m[1]);
    assert.equal(blocks.length, 3);
    for (let i = 0; i < blocks.length; i++) {
      const result = await execute(language, blocks[i]);
      assert.equal(result.output.trim(), expected[language][i]);
      assert.equal(result.messages.at(-1).type, 'done');
    }
  }
});

test('all 57 additional Python core examples match exact output in the real browser WASM adapter', { timeout: 120000 }, async () => {
  const { pythonCoreUnits } = await import('../content/courses/python/core-units.mjs');
  const cases = pythonCoreUnits.flatMap(unit => unit.examples);
  assert.equal(cases.length, 57);
  const program = cases.map((item, index) => `print("__RAYTECH_EXAMPLE_${index}__")\nexec(${JSON.stringify(item.code)}, {})`).join('\n');
  const result = await execute('python', program);
  const expected = cases.map((item, index) => `__RAYTECH_EXAMPLE_${index}__\n${item.output}`).join('\n');
  assert.equal(result.output.trim(), expected);
  assert.equal(result.messages.at(-1).type, 'done');
  assert.equal(result.messages.at(-1).text, undefined);
});
