import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { adminOperation } = await loadTypescript('src/utils/admin-operation.ts');
test('failed saves retain form data and rejected handlers surface a safe error before retry', async () => {
  const oldWindow = globalThis.window; const oldEvent = globalThis.CustomEvent;
  const events = []; globalThis.window = { dispatchEvent(event) { events.push(event); } };
  globalThis.CustomEvent = class extends Event { constructor(type, options) { super(type); this.detail = options.detail; } };
  try {
    let form = 'unsaved'; let attempts = 0;
    const save = adminOperation('test-save', async () => { attempts++; if (attempts === 1) throw new Error('Save failed'); form = ''; });
    await save(); assert.equal(form, 'unsaved'); assert.equal(events.find(e => e.type === 'raytech-admin-error').detail, 'Save failed');
    await save(); assert.equal(form, ''); assert.equal(attempts, 2);
  } finally { globalThis.window = oldWindow; globalThis.CustomEvent = oldEvent; }
});
test('duplicate submits cannot perform a second mutation or trigger native form navigation', async () => {
  let resolve; const wait = new Promise(done => { resolve = done; }); let writes = 0; let prevented = 0;
  const save = adminOperation('double-save', async () => { writes++; await wait; });
  const first = save({ preventDefault() { prevented++; } });
  await save({ preventDefault() { prevented++; } });
  assert.equal(writes, 1); assert.equal(prevented, 2); resolve(); await first;
});
