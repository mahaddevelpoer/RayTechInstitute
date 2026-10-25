import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {ditTopicImportSql} from './stage-dit-topic-import.mjs';
const bank=JSON.parse(await fs.readFile('content/imports/dit-computer-networks-chapter-1.json','utf8'));
test('staged topic import is atomic, rerunnable and keeps the source questions and chapter intact',async()=>{
 const sql=await ditTopicImportSql();
 const db=new PGlite();
 try {
  const schema=await fs.readFile('supabase/migrations/20261016_hardening_rls_and_schema.sql','utf8');
  for(const table of ['notes','mcqs']){
   const statement=schema.match(new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table} \\([\\s\\S]*?\\n\\);`))?.[0];assert.ok(statement);await db.exec(statement);
  }
  await db.exec('CREATE TABLE public.chapters(class_slug TEXT,subject_slug TEXT,chapter_number INT,title TEXT,is_active BOOLEAN);');
  await db.query('INSERT INTO public.chapters VALUES($1,$2,1,$3,true)',[bank.classSlug,bank.subjectSlug,bank.chapterTitle]);
  for(const q of bank.questions)await db.query('INSERT INTO public.mcqs(id,class_slug,subject_slug,chapter_number,question,options,correct_index,explanation) VALUES($1,$2,$3,1,$4,$5::jsonb,$6,$7)',[q.id,bank.classSlug,bank.subjectSlug,q.question,JSON.stringify(q.options),q.correctIndex,q.explanation]);
  await db.exec(sql);await db.exec(sql);
  const groups=(await db.query('SELECT topic,count(*)::int AS n FROM public.mcqs GROUP BY topic')).rows;
  assert.equal(groups.length,8);assert.ok(groups.every(g=>g.n===10));
  assert.equal((await db.query('SELECT count(*)::int AS n FROM public.notes')).rows[0].n,1);
  const note=(await db.query('SELECT * FROM public.notes')).rows[0];assert.equal(note.chapter_number,1);assert.equal(note.chapter_title,bank.chapterTitle);assert.equal(note.class_slug,bank.classSlug);assert.equal(note.subject_slug,bank.subjectSlug);
  await db.query('UPDATE public.mcqs SET question=$1 WHERE id=$2',['Changed by admin',bank.questions[0].id]);
  await assert.rejects(db.exec(sql),/source bank changed/i);await db.exec('ROLLBACK;');
  assert.equal((await db.query('SELECT question FROM public.mcqs WHERE id=$1',[bank.questions[0].id])).rows[0].question,'Changed by admin');
 } finally {await db.close();}
});
