import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { loadTypescript } from './load-typescript.mjs';
const { createLearningAiSettings } = await loadTypescript('supabase/functions/_shared/learning-ai-settings.ts');

test('AI setting defaults off privately and migration preserves an existing choice', async () => {
  const db = new PGlite();
  try {
    await db.exec('CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;');
    const migration = await fs.readFile('supabase/migrations/20261023_learning_ai_settings.sql', 'utf8');
    await db.exec(migration); assert.equal((await db.query('SELECT enabled FROM learning_ai_settings')).rows[0].enabled, false);
    await db.exec('UPDATE learning_ai_settings SET enabled = true'); await db.exec(migration);
    assert.equal((await db.query('SELECT enabled FROM learning_ai_settings')).rows[0].enabled, true);
    for (const role of ['anon', 'authenticated']) {
      await db.exec(`SET ROLE ${role}`);
      await assert.rejects(db.query('SELECT * FROM learning_ai_settings'), /permission denied/);
      await assert.rejects(db.query('UPDATE learning_ai_settings SET enabled = false'), /permission denied/);
      await db.exec('RESET ROLE');
    }
    await db.exec('SET ROLE service_role');
    assert.equal((await db.query('UPDATE learning_ai_settings SET enabled = false RETURNING enabled')).rows[0].enabled, false);
  } finally { await db.close(); }
});

test('AI disable is fail-closed and stale toggles cannot overwrite another admin', async () => {
  const version = '2026-10-20T01:00:00.000Z'; let enabled = false; let requests = 0;
  const settings = createLearningAiSettings('https://project.test', 'test-key', async (url, init) => {
    requests++;
    if (init.method === 'PATCH') {
      assert.equal(new URL(url).searchParams.get('updated_at'), `eq.${version}`);
      const body = JSON.parse(init.body); assert.equal(typeof body.enabled, 'boolean');
      enabled = body.enabled;
    }
    return Response.json([{ enabled, updated_at: version }]);
  });
  await assert.rejects(settings.requireEnabled(), /switched off/);
  await settings.set(true, version); await settings.requireEnabled();
  await settings.set(false, version); await assert.rejects(settings.requireEnabled(), /switched off/);
  const before = requests;
  await assert.rejects(settings.set('true', version), /valid AI setting/); assert.equal(requests, before);
  await assert.rejects(createLearningAiSettings('https://project.test', 'test-key', async () => Response.json([])).set(true, version), /changed or are unavailable/);
  await assert.rejects(createLearningAiSettings('https://project.test', 'test-key', async () => new Response('', { status: 500 })).requireEnabled(), /Generation stays disabled/);
});
