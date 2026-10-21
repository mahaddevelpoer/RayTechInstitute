import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { Worker as NodeWorker } from 'node:worker_threads';
import { JSDOM } from 'jsdom';
import { createDOMPolicy, seedDOM } from './runtimes/dom-policy.mjs';

const hostSource = await fs.readFile('public/learning-runtimes/dom-frame.js', 'utf8');
const workerSource = await fs.readFile('public/learning-runtimes/dom-worker.js', 'utf8');
const html = await fs.readFile('public/learning-dom-frame.html', 'utf8');
async function until(check) {
  const deadline = Date.now() + 15000;
  while (!check()) { if (Date.now() > deadline) throw new Error('DOM test condition timed out'); await new Promise(resolve => setTimeout(resolve, 10)); }
}
function setup() {
  // A DOM/worker integration harness, not a native browser or CSP enforcement test.
  const dom = new JSDOM('<!doctype html><div id="practice-root"></div>', { runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom; const messages = []; const workers = []; const blobs = new Map(); const deadlines = new Map();
  window.Blob = Blob;
  window.URL.createObjectURL = blob => { const id = `blob:fixture-${blobs.size}`; blobs.set(id, blob); return id; };
  window.URL.revokeObjectURL = url => blobs.delete(url);
  const schedule = window.setTimeout.bind(window), cancel = window.clearTimeout.bind(window);
  window.setTimeout = (fn, delay, ...args) => {
    const id = schedule(fn, delay, ...args);
    if (delay === 10000 || delay === 600000) deadlines.set(id, { fn, delay });
    return id;
  };
  window.clearTimeout = id => { deadlines.delete(id); cancel(id); };
  window.postMessage = data => messages.push(data);
  window.Worker = class {
    constructor(url) {
      this.listeners = new Map(); this.queue = []; this.stopped = false; workers.push(this);
      blobs.get(url).text().then(source => {
        if (this.stopped) return;
        this.thread = new NodeWorker(`
          const { parentPort } = require('node:worker_threads');
          const vm = require('node:vm');
          const listeners = new Map();
          const scope = {
            console, setTimeout, clearTimeout, setInterval, clearInterval, performance,
            postMessage: data => parentPort.postMessage(data),
            addEventListener(type, fn) { const group = listeners.get(type) || new Set(); group.add(fn); listeners.set(type, group); },
            removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
          };
          scope.self = scope;
          parentPort.on('message', data => { for (const fn of listeners.get('message') || []) fn({ data }); });
          vm.runInNewContext(${JSON.stringify(source)}, scope, { timeout: 20000, codeGeneration: { strings: false, wasm: false } });
        `, { eval: true });
        this.thread.on('message', data => {
          if (this.stopped) return;
          let blocked = false;
          const event = { data, preventDefault() {}, stopImmediatePropagation() { blocked = true; } };
          for (const listener of this.listeners.get('message') || []) { listener(event); if (blocked) break; }
          if (!blocked) this.onmessage?.(event);
        });
        this.thread.on('error', error => {
          if (this.stopped) return;
          const event = { message: error.message, preventDefault() {} };
          for (const listener of this.listeners.get('error') || []) listener(event);
          this.onerror?.(event);
        });
        for (const data of this.queue) this.thread.postMessage(data); this.queue = [];
      });
    }
    addEventListener(type, fn) { const group = this.listeners.get(type) || new Set(); group.add(fn); this.listeners.set(type, group); }
    postMessage(data) { if (!this.stopped) { if (this.thread) this.thread.postMessage(data); else this.queue.push(data); } }
    terminate() { this.stopped = true; void this.thread?.terminate(); }
  };
  vm.runInContext(hostSource, dom.getInternalVMContext());
  const send = (data, foreign = false) => window.dispatchEvent(new window.MessageEvent('message', { data, source: foreign ? {} : window }));
  return {
    window, messages, workers, deadlines, blobs, get root() { return window.document.querySelector('body > div'); }, send,
    run(code, seed = '<p id="demo">Start</p><button id="button">Next</button>', id = 'attempt1') { send({ type: 'run', code, html: seed, workerSource, runId: id }); },
    async close() { send({ type: 'stop' }); for (const worker of workers) await worker.thread?.terminate(); dom.window.close(); },
  };
}

test('DOM rendering policy removes executable/navigation elements and unsafe properties', () => {
  const dom = new JSDOM('<div id="root"></div>'); const root = dom.window.document.getElementById('root'); const policy = createDOMPolicy();
  seedDOM(root, '<script>bad()</script><iframe src="https://example.com"></iframe><a href="https://example.com" onclick="bad()">Link</a><input type="checkbox"><form action="https://example.com"><button type="submit">Go</button></form>', policy);
  assert.equal(root.querySelector('script,iframe'), null); assert.equal(root.querySelector('a').attributes.length, 0);
  assert.equal(root.querySelector('input').type, 'checkbox'); assert.equal(root.querySelector('form').hasAttribute('action'), false);
  for (const name of ['innerHTML', 'outerHTML', 'src', 'srcdoc', 'href', 'onclick', '__proto__']) assert.equal(policy.setProperty(root, name, 'unsafe'), false);
  assert.equal(policy.setProperty(root.querySelector('input'), 'checked', 'false'), true); assert.equal(root.querySelector('input').checked, false);
  assert.throws(() => seedDOM(root, '<span></span>'.repeat(501), createDOMPolicy()), /500 nodes/); dom.window.close();
});

test('real WorkerDOM renders selector mutations and forwards button events to the worker', async () => {
  const app = setup();
  try {
    app.run(`document.querySelector('#demo').textContent = 'Ready'; document.querySelector('#button').addEventListener('click', () => { document.querySelector('#demo').textContent = 'Clicked'; console.log('button event'); });`);
    await until(() => app.root.querySelector('#demo')?.textContent === 'Ready');
    app.root.querySelector('#button').dispatchEvent(new app.window.MouseEvent('click', { bubbles: true }));
    await until(() => app.root.querySelector('#demo')?.textContent === 'Clicked');
    await until(() => app.messages.some(message => message.type === 'output' && message.text === 'button event'));
    assert.ok(app.messages.some(message => message.type === 'interactive'));
  } finally { await app.close(); }
});

test('DOM examples can create a custom page, style nodes and react to input without eval', async () => {
  const app = setup();
  try {
    app.run(`document.body.innerHTML = '<input id="name"><p id="result">Waiting</p>'; const result = document.getElementById('result'); result.style.color = 'navy'; document.getElementById('name').addEventListener('input', event => { result.textContent = event.target.value; });`);
    await until(() => app.root.querySelector('#name'));
    const input = app.root.querySelector('#name'); input.value = 'Ada'; input.dispatchEvent(new app.window.Event('input', { bubbles: true }));
    await until(() => app.root.querySelector('#result')?.textContent === 'Ada');
    assert.equal(app.root.querySelector('#result').style.color, 'navy');
  } finally { await app.close(); }
});

test('worker-created script elements and event attributes never enter the rendered DOM', async () => {
  const app = setup();
  try {
    app.run(`const script = document.createElement('script'); script.textContent = 'while(true){}'; document.body.appendChild(script); document.getElementById('button').setAttribute('onclick', 'while(true){}'); console.log('safe end');`);
    await until(() => app.messages.some(message => message.type === 'output' && message.text === 'safe end'));
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(app.root.querySelector('script'), null); assert.equal(app.root.querySelector('#button').hasAttribute('onclick'), false);
  } finally { await app.close(); }
});

test('DOM host rejects foreign/oversized requests and its watchdog terminates a busy worker', async () => {
  const app = setup();
  try {
    const request = { type: 'run', code: 'console.log(1)', html: '', workerSource, runId: 'foreign' };
    app.send(request, true); app.send({ ...request, code: 'x'.repeat(20001) }); assert.equal(app.workers.length, 0);
    app.run('while (true) {}'); await until(() => app.workers.length > 0);
    const deadline = [...app.deadlines.values()].find(value => value.delay === 10000); assert.ok(deadline); deadline.fn();
    assert.ok(app.workers.every(worker => worker.stopped)); assert.equal(app.blobs.size, 0);
    assert.match(app.messages.at(-1).text, /10 seconds/);
  } finally { await app.close(); }
});

test('DOM preview declares strict no-network and no inline/eval host script policies', async () => {
  const scriptPolicy = html.match(/script-src ([^;]+);/)[1];
  assert.equal(scriptPolicy, "'self'");
  assert.match(html, /connect-src 'none'/); assert.match(html, /form-action 'none'/);
  const source = await fs.readFile('scripts/runtimes/dom-frame.js', 'utf8');
  assert.match(source, /executorsAllowed: \[0, 1, 2, 3, 4, 5\]/);
});

test('DOM syntax and asynchronous errors are shown instead of silently succeeding', async () => {
  for (const code of ['const = broken;', 'await Promise.reject(new Error("DOM example failed"));']) {
    const app = setup();
    try {
      app.run(code); await until(() => app.messages.some(message => message.type === 'done'));
      assert.ok(app.messages.at(-1).text.length > 0); assert.ok(app.workers.every(worker => worker.stopped));
    } finally { await app.close(); }
  }
});

test('Stop releases the worker and listener closures, and a new run owns a fresh DOM', async () => {
  const app = setup();
  try {
    app.run(`document.getElementById('button').onclick = () => console.log('old event'); console.log('first ready');`);
    await until(() => app.messages.some(message => message.text === 'first ready'));
    const firstRoot = app.root; app.send({ type: 'stop' });
    assert.notEqual(app.root, firstRoot); assert.equal(app.blobs.size, 0);
    const before = app.messages.length; app.root.querySelector('#button').click();
    await new Promise(resolve => setTimeout(resolve, 80)); assert.equal(app.messages.length, before);
    app.run(`document.getElementById('demo').textContent = 'Second run';`, undefined, 'attempt2');
    await until(() => app.root.querySelector('#demo')?.textContent === 'Second run');
    assert.equal(app.workers[0].stopped, true);
  } finally { await app.close(); }
});

test('DOM output is bounded and terminates its emitting worker', async () => {
  const app = setup();
  try {
    app.run(`console.log('x'.repeat(30000));`);
    await until(() => app.messages.some(message => message.type === 'done'));
    assert.equal(app.messages.filter(message => message.type === 'output').reduce((sum, message) => sum + message.text.length, 0), 20000);
    assert.equal(app.messages.at(-1).text, 'Output limit reached.');
    assert.ok(app.workers.every(worker => worker.stopped));
  } finally { await app.close(); }
});

test('a removed preview root is restored for the next run', async () => {
  const app = setup();
  try {
    app.run(`console.log('ready');`);
    await until(() => app.messages.some(message => message.text === 'ready'));
    app.root.remove(); app.send({ type: 'stop' }); assert.ok(app.root);
    app.run(`document.getElementById('demo').textContent = 'Restored';`, undefined, 'restored');
    await until(() => app.root.querySelector('#demo')?.textContent === 'Restored');
  } finally { await app.close(); }
});
