import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await fs.readFile('src/components/compiler/PythonCompiler.tsx', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText;

// Component logic harness, not a browser/React DOM integration test.
function mount() {
  const slots = []; const effects = []; const listeners = new Map(); const timers = new Map();
  const sent = []; const downloads = []; let cursor = 0; let nextTimer = 0; let nextId = 0; let tree;
  const frameWindow = { postMessage(message) { sent.push(message); } };
  const react = {
    createElement(type, props, ...children) { return { type, props: props || {}, children }; },
    Fragment: Symbol('fragment'),
    useState(initial) { const index = cursor++; if (!(index in slots)) slots[index] = initial; return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }]; },
    useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
    useCallback(callback, deps) { const index = cursor++; const prior = slots[index]; if (!prior || deps.some((value, i) => !Object.is(value, prior.deps[i]))) slots[index] = { deps, callback }; return slots[index].callback; },
    useEffect(callback, deps) {
      const index = cursor++; const prior = slots[index];
      if (!prior || deps.some((value, i) => !Object.is(value, prior.deps[i]))) effects.push(() => { prior?.cleanup?.(); slots[index] = { deps, cleanup: callback() }; });
    },
  };
  const window = {
    innerWidth: 1200, innerHeight: 900,
    addEventListener(type, callback) { const group = listeners.get(type) ?? new Set(); group.add(callback); listeners.set(type, group); },
    removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
  };
  const module = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: module.exports, module,
    require(name) {
      if (name === 'react') return react;
      if (name === 'lucide-react') return new Proxy({}, { get: (_, key) => key });
      if (name.endsWith('useTheme')) return { useTheme: () => ({ theme: 'light' }) };
      if (name.endsWith('runtime-assets')) return { loadRuntimeAssets: () => new Promise((resolve, reject) => downloads.push({ resolve, reject })) };
      throw new Error(`Unexpected dependency: ${name}`);
    },
    window, document: { body: { style: {} } }, crypto: { randomUUID: () => `run-${++nextId}` },
    setTimeout(callback, delay) { const id = ++nextTimer; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
  });
  function nodes(node = tree) { if (!node || typeof node !== 'object') return []; return [node, ...node.children.flat(Infinity).flatMap(child => nodes(child))]; }
  function find(predicate) { const node = nodes().find(predicate); assert.ok(node, 'Expected UI control'); return node; }
  function render() {
    cursor = 0; tree = module.exports.PythonCompiler({ initialCode: 'print(1)' });
    find(node => node.type === 'iframe').props.ref.current = { contentWindow: frameWindow };
    while (effects.length) effects.shift()();
  }
  render();
  const sandbox = find(node => node.type === 'iframe'); sandbox.props.onLoad();
  find(node => node.props['aria-label'] === 'Open Python Compiler').props.onClick(); render();
  return {
    sent, downloads, timers, render, find,
    run: () => find(node => node.props.title === 'Run Code (Ctrl + Enter)').props.onClick(),
    emit(data, foreign = false) { for (const callback of listeners.get('message') ?? []) callback({ source: foreign ? {} : frameWindow, data }); },
    output: () => find(node => node.type === 'pre').children.join(''),
    unmount() { for (const slot of slots) slot?.cleanup?.(); },
  };
}

test('legacy compiler uses an opaque sandbox and does not persist guest code', () => {
  const app = mount();
  assert.equal(app.find(node => node.type === 'iframe').props.sandbox, 'allow-scripts');
  assert.equal(app.find(node => node.type === 'iframe').props.src, '/learning-wasm-frame.html');
  assert.doesNotMatch(source, /localStorage|new Worker/);
  app.unmount();
});

test('Stop cancels a pending interpreter download and a later run can retry', async () => {
  const app = mount(); const first = app.run(); app.render();
  await app.run(); assert.equal(app.downloads.length, 1);
  app.find(node => node.children.includes('Stop execution')).props.onClick();
  app.downloads[0].resolve({ workerSource: 'old', assets: {} }); await first;
  assert.equal(app.sent.filter(message => message.type === 'run').length, 0);
  app.render(); const retry = app.run(); app.downloads[1].resolve({ workerSource: 'new', assets: {} }); await retry;
  assert.equal(app.sent.at(-1).workerSource, 'new');
  app.unmount(); assert.equal(app.timers.size, 0);
});

test('legacy compiler checks message identity, caps output and switches to the execution deadline', async () => {
  const app = mount(); const task = app.run(); app.downloads[0].resolve({ workerSource: 'worker', assets: {} }); await task;
  const runId = app.sent.at(-1).runId;
  app.emit({ type: 'done', runId, text: 'foreign' }, true);
  app.emit({ type: 'done', runId: 'stale', text: 'stale' }); app.render();
  assert.equal(app.output(), 'Preparing Python...');
  app.emit({ type: 'executing', runId }); assert.deepEqual([...app.timers.values()].map(timer => timer.delay), [10000]);
  app.emit({ type: 'output', runId, text: 'x'.repeat(25000) });
  app.emit({ type: 'done', runId, text: '' }); app.render();
  assert.equal(app.output().length, 20000); assert.equal(app.timers.size, 0);
  app.emit({ type: 'output', runId, text: 'late' }); app.render(); assert.equal(app.output().length, 20000);
  app.unmount();
});

test('minimizing terminates active execution and rejected downloads permit retry', async () => {
  const app = mount(); const task = app.run(); app.downloads[0].reject(new Error('offline')); await task; app.render();
  assert.match(app.output(), /could not download/);
  const retry = app.run(); app.downloads[1].resolve({ workerSource: 'worker', assets: {} }); await retry; app.render();
  app.find(node => node.props['aria-label'] === 'Minimize Python compiler').props.onClick(); app.render();
  assert.equal(app.sent.at(-1).type, 'stop'); assert.equal(app.timers.size, 0);
  app.unmount();
});
