import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {PGlite} from '@electric-sql/pglite';
const payload=JSON.parse(fs.readFileSync('content/imports/dit-nov11/payload.json'));
test('new DIT import is atomic, idempotent, preserves existing IDs and rejects edited answers',async()=>{
 const db=new PGlite();
 try{
  for(const table of ['chapters','mcqs','notes']){
   const columns=Object.entries(payload[table][0]).map(([k,v])=>'"'+k+'" '+(k==='id'?'TEXT PRIMARY KEY':typeof v==='number'?'INT':typeof v==='boolean'?'BOOLEAN':Array.isArray(v)?'JSONB':'TEXT'));
   await db.exec(`CREATE TABLE public.${table}(${columns.join(',')});`);
  }
  for(const update of payload.updates){
   const row={id:update.id,...update.before};const keys=Object.keys(row);await db.query(`INSERT INTO public.${update.table}(${keys.join(',')}) VALUES(${keys.map((_,i)=>'$'+(i+1)).join(',')})`,Object.values(row));
  }
  await db.exec("UPDATE chapters SET class_slug='dit-intermediate',subject_slug='dit-computer-science',chapter_number=5,book_title='MS Office',title='Microsoft PowerPoint' WHERE id='chapter-dit-computer-science-powerpoint'; INSERT INTO mcqs(id,question) VALUES('existing-question','Keep original');");
  const sql=fs.readFileSync('content/imports/dit-nov11/import.sql','utf8');
  await db.exec(sql);await db.exec(sql);
  assert.equal((await db.query('SELECT count(*)::int n FROM chapters')).rows[0].n,8);
  assert.equal((await db.query('SELECT count(*)::int n FROM mcqs')).rows[0].n,761);
  assert.equal((await db.query('SELECT count(*)::int n FROM notes')).rows[0].n,8);
  assert.equal((await db.query("SELECT display_chapter_number n FROM chapters WHERE id='chapter-dit-computer-science-powerpoint'")).rows[0].n,4);
  assert.equal((await db.query("SELECT question FROM mcqs WHERE id='existing-question'")).rows[0].question,'Keep original');
  assert.equal((await db.query("SELECT count(DISTINCT (chapter_number,topic))::int n FROM mcqs WHERE id<>'existing-question'")).rows[0].n,76);
  await db.query('UPDATE mcqs SET correct_index=($1+1)%4 WHERE id=$2',[payload.mcqs[0].correct_index,payload.mcqs[0].id]);
  await assert.rejects(db.exec(sql),/refusing overwrite/);await db.exec('ROLLBACK');
  assert.notEqual((await db.query('SELECT correct_index FROM mcqs WHERE id=$1',[payload.mcqs[0].id])).rows[0].correct_index,payload.mcqs[0].correct_index);
 }finally{await db.close();}
});
