import { upgrade } from '@ampproject/worker-dom/dist/amp-production/main.mjs';
import { createDOMPolicy, seedDOM, domAuthorSource } from './dom-policy.mjs';

let root = document.getElementById('practice-root');
const NativeWorker = window.Worker;
let session;
function stop() {
  const current = session; session = null;
  if (!current) return;
  clearTimeout(current.deadline); clearTimeout(current.expiry);
  for (const worker of current.workers) worker.terminate();
  for (const url of current.urls) URL.revokeObjectURL(url);
  // Retain the last picture, not the old worker's event-listener closures.
  const snapshot = root.cloneNode(true);
  if (root.parentNode) root.replaceWith(snapshot);
  else document.body.appendChild(snapshot);
  root = snapshot;
  protectRoot();
}
function send(current, type, text = '') {
  if (session === current) parent.postMessage({ type, text, runId: current.id }, '*');
}
function finish(current, text) { send(current, 'done', text); if (session === current) stop(); }
function watchdog(current) {
  clearTimeout(current.deadline);
  current.deadline = setTimeout(() => finish(current, 'Stopped after 10 seconds without a responsive JavaScript worker.'), 10000);
}
// The library constructs this worker. Bound packets before its mutation decoder.
window.Worker = class extends NativeWorker {
  constructor(url, options) {
    super(url, options);
    const current = session;
    current.workers.push(this); current.urls.push(url);
    this.addEventListener('message', event => {
      if (session !== current) { event.stopImmediatePropagation(); return; }
      const data = event.data;
      if (!data || typeof data !== 'object' || Object.keys(data).length > 32 || Object.values(data).some(value => (value instanceof ArrayBuffer && value.byteLength > 128000) || (Array.isArray(value) && (value.length > 4000 || value.some(item => typeof item === 'string' && item.length > 30000))))) {
        event.stopImmediatePropagation(); finish(current, 'Preview update limit reached. Simplify your example.'); return;
      }
      if (data.raytech === 'heartbeat') { watchdog(current); send(current, 'heartbeat'); }
      else if (data.raytech === 'interactive') send(current, 'interactive');
      else if (data.raytech === 'failure') finish(current, String(data.text).slice(0, 4000));
      else if (data.raytech === 'output') {
        const text = String(data.text).slice(0, Math.max(0, 20000 - current.output));
        current.output += text.length; if (text) send(current, 'output', text);
        if (current.output >= 20000) finish(current, 'Output limit reached.');
      }
    });
    this.addEventListener('error', event => { event.preventDefault(); finish(current, event.message || 'JavaScript could not start.'); });
  }
};
// Preview controls must not navigate, submit, open a new window or leave the frame.
function protectRoot() {
  root.addEventListener('submit', event => event.preventDefault(), true);
  root.addEventListener('click', event => { if (event.target.closest?.('a')) event.preventDefault(); }, true);
}
protectRoot();
window.addEventListener('error', event => { if (session) { event.preventDefault(); finish(session, 'The DOM preview encountered an invalid update. Try a smaller example.'); } });
window.addEventListener('pagehide', stop);
window.addEventListener('message', async event => {
  if (event.source !== parent) return;
  const message = event.data;
  if (message?.type === 'stop') { stop(); return; }
  if (message?.type !== 'run' || typeof message.runId !== 'string' || typeof message.code !== 'string' || message.code.length > 20000 || typeof message.html !== 'string' || message.html.length > 20000 || typeof message.workerSource !== 'string' || message.workerSource.length > 1000000) return;
  stop();
  const current = { id: message.runId, workers: [], urls: [], output: 0, updates: 0 };
  session = current; watchdog(current);
  current.expiry = setTimeout(() => finish(current, 'Preview session ended after 10 minutes. Run your code again to continue.'), 600000);
  try {
    const sanitizer = createDOMPolicy();
    seedDOM(root, message.html, sanitizer);
    send(current, 'executing');
    const connection = await upgrade(root, Promise.resolve([message.workerSource, domAuthorSource(message.code)]), {
      authorURL: 'raytech-learning-example.js', domURL: 'memory:worker-dom', sanitizer,
      // Basic DOM, text, properties, events and geometry only. No storage,
      // arbitrary object/function calls, canvas proxies or scrolling the parent.
      executorsAllowed: [0, 1, 2, 3, 4, 5],
      mutationPump(flush) {
        if (session !== current) return;
        if (++current.updates > 10000) { finish(current, 'Preview update limit reached.'); return; }
        requestAnimationFrame(() => { if (session === current) { try { flush(); } catch { finish(current, 'The DOM preview could not apply this update.'); } } });
      },
    });
    if (session !== current) connection?.terminate();
    else if (!connection) finish(current, 'The DOM preview could not start.');
  } catch { finish(current, 'The DOM preview could not start. Check your HTML and JavaScript.'); }
});
