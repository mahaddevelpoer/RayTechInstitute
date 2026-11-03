import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('academic migration preserves legacy links, reruns safely and rejects duplicate or partial placements', async () => {
  const db = new PGlite();
  try {
    await db.exec("CREATE TABLE public.classes (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL); INSERT INTO public.classes VALUES ('legacy','9th-class'),('dit','dit-intermediate');");
    await db.exec("CREATE TABLE public.subjects (id TEXT PRIMARY KEY, class_slug TEXT REFERENCES public.classes(slug)); INSERT INTO public.subjects VALUES ('dit-computer-science','dit-intermediate');");
    const sql = await fs.readFile('supabase/migrations/20261103160000_academic_program_semesters.sql', 'utf8');
    await db.exec(sql);
    await db.exec(sql);
    assert.deepEqual((await db.query("SELECT slug,program_title,semester_number FROM public.classes WHERE id='legacy'")).rows[0], { slug: '9th-class', program_title: null, semester_number: null });
    assert.deepEqual((await db.query("SELECT slug,program_title,semester_number FROM public.classes WHERE id='dit'")).rows[0], { slug: 'dit-intermediate', program_title: 'DIT', semester_number: 1 });
    assert.equal((await db.query("SELECT class_slug FROM public.subjects WHERE id='dit-computer-science'")).rows[0].class_slug, 'dit-intermediate');
    await db.exec("INSERT INTO public.classes VALUES ('sem2','dit-sem2','DIT',2)");
    await assert.rejects(db.exec("INSERT INTO public.classes VALUES ('duplicate','duplicate',' dit ',1)"), /unique/i);
    await assert.rejects(db.exec("INSERT INTO public.classes VALUES ('partial','partial','BS',NULL)"), /check/i);
    await assert.rejects(db.exec("INSERT INTO public.classes VALUES ('bad','bad',NULL,1)"), /check/i);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM public.classes')).rows[0].n, 3);
  } finally { await db.close(); }
});
