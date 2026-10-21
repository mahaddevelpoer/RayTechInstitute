import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { checkAdminAccess } = await loadTypescript('src/lib/admin-access.ts');

test('administrator access requires explicit server confirmation', async () => {
  assert.deepEqual(await checkAdminAccess(async () => ({ data: { success: true, email: 'staff@example.test' }, error: null })), { ok: true, email: 'staff@example.test' });
  for (const result of [{ data: { success: false }, error: null }, { data: null, error: { context: { status: 401 } } }, { data: null, error: { context: { status: 403 } } }]) {
    assert.deepEqual(await checkAdminAccess(async () => result), { ok: false, reason: 'unauthorized' });
  }
});
test('transport, CORS and server outages never masquerade as an administrator denial', async () => {
  for (const result of [{ data: null, error: { message: 'Failed to fetch' } }, { data: null, error: { context: { status: 503 } } }, { data: {}, error: null }]) {
    assert.deepEqual(await checkAdminAccess(async () => result), { ok: false, reason: 'unavailable' });
  }
  assert.deepEqual(await checkAdminAccess(async () => { throw new Error('offline'); }), { ok: false, reason: 'unavailable' });
});
