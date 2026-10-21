import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

const migration = await fs.readFile('supabase/migrations/20261021_learning_platform.sql', 'utf8');
const draftsMigration = await fs.readFile('supabase/migrations/20261022_learning_drafts.sql', 'utf8');

test('learning migration, private access and atomic quota behavior', async t => {
  const db = new PGlite();
  try {
    await db.exec('CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;');
    await db.exec(migration);
    await db.exec(migration);
    await db.exec(draftsMigration);
    await db.exec(draftsMigration);
    await t.test('rerunning migration keeps five unpublished language tracks and two courses', async () => {
      assert.equal((await db.query('SELECT count(*)::int AS n FROM learning_languages')).rows[0].n, 5);
      assert.equal((await db.query('SELECT count(*)::int AS n FROM learning_courses')).rows[0].n, 2);
      assert.equal((await db.query("SELECT count(*)::int AS n FROM learning_languages WHERE state = 'published'")).rows[0].n, 0);
    });
    await t.test('anonymous and authenticated database roles cannot read drafts or reserve quota', async () => {
      for (const role of ['anon', 'authenticated']) {
        await db.exec(`SET ROLE ${role}`);
        await assert.rejects(db.query('SELECT * FROM public.learning_topics'), /permission denied/);
        await assert.rejects(db.query("SELECT public.reserve_learning_review('learner')"), /permission denied/);
        await assert.rejects(db.query("INSERT INTO public.learning_languages(id,slug,title,runtime) VALUES ('bad','bad','Bad','python')"), /permission denied/);
        await db.exec('RESET ROLE');
      }
    });
    await t.test('three submissions per learner; denied request does not consume global quota', async () => {
      await db.exec('SET ROLE service_role');
      for (let i = 0; i < 3; i++) assert.equal((await db.query("SELECT public.reserve_learning_review('learner') AS allowed")).rows[0].allowed, true);
      assert.equal((await db.query("SELECT public.reserve_learning_review('learner') AS allowed")).rows[0].allowed, false);
      assert.equal((await db.query("SELECT used FROM public.learning_review_quota WHERE bucket LIKE 'global:day:%'")).rows[0].used, 3);
      await db.exec('RESET ROLE');
    });
    await t.test('ten requests per global minute across distinct users', async () => {
      await db.exec('TRUNCATE public.learning_review_quota');
      for (let i = 0; i < 10; i++) assert.equal((await db.query('SELECT public.reserve_learning_review($1) AS allowed', [`u${i}`])).rows[0].allowed, true);
      assert.equal((await db.query("SELECT public.reserve_learning_review('extra') AS allowed")).rows[0].allowed, false);
    });
    await t.test('global daily budget survives minute counter expiry', async () => {
      await db.exec('TRUNCATE public.learning_review_quota');
      for (let i = 0; i < 40; i++) {
        await db.exec("DELETE FROM public.learning_review_quota WHERE bucket LIKE 'global:minute:%'");
        assert.equal((await db.query('SELECT public.reserve_learning_review($1) AS allowed', [`daily${i}`])).rows[0].allowed, true);
      }
      await db.exec("DELETE FROM public.learning_review_quota WHERE bucket LIKE 'global:minute:%'");
      assert.equal((await db.query("SELECT public.reserve_learning_review('daily-extra') AS allowed")).rows[0].allowed, false);
    });
    await t.test('invalid identity and incomplete publication are rejected', async () => {
      await assert.rejects(db.query("SELECT public.reserve_learning_review('')"), /Invalid learner identity/);
      await assert.rejects(db.query("INSERT INTO public.learning_topics(id,language_id,slug,title,position,state) VALUES ('v','python','variables','Variables',1,'published')"), /check constraint/);
      await db.exec("INSERT INTO public.learning_topics(id,language_id,slug,title,position) VALUES ('v','python','variables','Variables',1)");
      await db.query('UPDATE public.learning_topics SET pending_draft = $1 WHERE id = $2', [JSON.stringify({ content: 'Private revision' }), 'v']);
      assert.equal((await db.query("SELECT content, pending_draft FROM public.learning_topics WHERE id = 'v'")).rows[0].content, '');
      await assert.rejects(db.query("UPDATE public.learning_topics SET pending_draft = '[]'::jsonb WHERE id = 'v'"), /check constraint/);
      await assert.rejects(db.query("DELETE FROM public.learning_languages WHERE id = 'python'"), /foreign key/);
    });
  } finally { await db.close(); }
});
