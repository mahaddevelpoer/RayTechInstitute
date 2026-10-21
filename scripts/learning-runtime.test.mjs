import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const html = await fs.readFile('public/learning-javascript-frame.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
async function executeWorker(source) {
  const output = [];
  await new Promise((resolve, reject) => {
    const deadline = setTimeout(() => reject(new Error('Worker did not finish within the test deadline')), 3000);
    try {
      vm.runInNewContext(source, {
        postMessage(message) { output.push(message); if (message.type === 'done') { clearTimeout(deadline); resolve(); } },
        console: {}, setTimeout, clearTimeout, setInterval, clearInterval, addEventListener() {},
      }, { timeout: 1000 });
    } catch (error) { clearTimeout(deadline); reject(error); }
  });
  return output;
}
function runtime(hostScript = script) {
  let listener, blob, worker;
  const messages = [];
  const parent = { postMessage: message => messages.push(message) };
  class Worker { constructor() { worker = this; this.stopped = false; } terminate() { this.stopped = true; } postMessage(data) { this.data = data; } }
  vm.runInNewContext(hostScript, { parent, Worker, Blob, setTimeout: (...args) => { const timer = setTimeout(...args); timer.unref(); return timer; }, clearTimeout, URL: { createObjectURL: value => { blob = value; return 'blob:test'; }, revokeObjectURL() {} }, addEventListener: (_, fn) => { listener = fn; } });
  return { send: data => listener({ source: parent, data }), sendForeign: data => listener({ source: {}, data }), messages, getBlob: () => blob, getWorker: () => worker };
}
test('JavaScript host rejects foreign messages and oversized submissions', () => {
  const r = runtime();
  r.sendForeign({ type: 'run', code: 'console.log(1)' }); assert.equal(r.getWorker(), undefined);
  r.send({ type: 'run', code: 'x'.repeat(20001) }); assert.equal(r.getWorker(), undefined);
});
test('student JavaScript is compiled in a worker script, not inserted into the host document', async () => {
  const r = runtime(); r.send({ type: 'run', code: 'console.log("hello")', runId: 'attempt1' });
  const source = await r.getBlob().text();
  const output = await executeWorker(source);
  assert.equal(output[0].text, 'hello'); assert.equal(output[1].type, 'done');
});

test('async JavaScript waits for awaited timers, nested callbacks and cleared intervals', async () => {
  const r = runtime(); r.send({ type: 'run', runId: 'async', code: `
    console.log('start');
    await new Promise(resolve => setTimeout(resolve, 5));
    console.log('awaited');
    setTimeout(() => { console.log('timer'); Promise.resolve().then(() => console.log('microtask')); }, 5);
    let count = 0;
    const interval = setInterval(() => { console.log('interval'); if (++count === 2) clearInterval(interval); }, 4);
  ` });
  const output = await executeWorker(await r.getBlob().text());
  assert.equal(output.filter(item => item.type === 'done').length, 1);
  assert.equal(output.at(-1).type, 'done');
  for (const text of ['start', 'awaited', 'timer', 'microtask', 'interval']) assert.ok(output.some(item => item.text === text));
});

test('a throwing async callback reports an error instead of a successful completion', async () => {
  const r = runtime(); r.send({ type: 'run', runId: 'failure', code: `setTimeout(() => { throw new Error('practice failure'); }, 1);` });
  const output = await executeWorker(await r.getBlob().text());
  assert.equal(output.filter(item => item.type === 'done').length, 1);
  assert.match(output.at(-1).text, /practice failure/);
});
test('worker output is capped and a stop request terminates execution', () => {
  const r = runtime(); r.send({ type: 'run', code: 'console.log(1)', runId: 'attempt1' });
  const worker = r.getWorker(); worker.onmessage({ data: { type: 'output', text: 'x'.repeat(30000) } });
  assert.equal(r.messages[0].text.length, 20000); assert.equal(worker.stopped, true);
  r.send({ type: 'run', code: '', runId: 'attempt2' }); const next = r.getWorker(); r.send({ type: 'stop' }); assert.equal(next.stopped, true);
});

test('JavaScript host preserves bounded error details from completed workers', () => {
  const r = runtime(); r.send({ type: 'run', code: '', runId: 'failure' });
  r.getWorker().onmessage({ data: { type: 'done', text: 'Example failed: ' + 'x'.repeat(5000) } });
  assert.equal(r.messages[0].text.length, 4000);
  assert.match(r.messages[0].text, /Example failed/);
});
test('the sandbox declares no-network policy and no same-origin permission', async () => {
  assert.match(html, /connect-src 'none'/); assert.match(html, /default-src 'none'/);
  const component = await fs.readFile('src/components/learning/BrowserPractice.tsx', 'utf8');
  assert.match(component, /sandbox="allow-scripts"/); assert.ok(!component.includes('allow-same-origin'));
});

test('WASM host bounds input, ignores foreign/stale messages and terminates on output cap', async () => {
  const wasm = await fs.readFile('public/learning-wasm-frame.html', 'utf8');
  const r = runtime(wasm.match(/<script>([\s\S]*?)<\/script>/)[1]);
  const request = { type: 'run', language: 'python', runId: 'wasm1', code: 'print(1)', stdin: '', workerSource: 'self.onmessage = () => {};', assets: {} };
  r.sendForeign(request); assert.equal(r.getWorker(), undefined);
  r.send({ ...request, stdin: 'x'.repeat(10001) }); assert.equal(r.getWorker(), undefined);
  r.send(request); const old = r.getWorker();
  old.onmessage({ data: { type: 'ready' } });
  assert.equal(r.messages[0].type, 'executing');
  r.send({ ...request, runId: 'wasm2' }); assert.equal(old.stopped, true);
  old.onmessage({ data: { type: 'done', text: 'stale' } }); assert.equal(r.messages.length, 1);
  const current = r.getWorker();
  current.onmessage({ data: { type: 'output', text: 'x'.repeat(21000) } });
  assert.equal(r.messages[1].text.length, 20000);
  assert.equal(r.messages.at(-1).type, 'done'); assert.equal(current.stopped, true);
  assert.match(wasm, /connect-src 'none'/);
});
