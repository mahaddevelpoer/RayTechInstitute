import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {networkTopologyImportSql} from './stage-network-topology-import.mjs';
import {loadTypescript} from './load-typescript.mjs';
const bank=JSON.parse(await fs.readFile('content/imports/dit-network-topology-chapter-2.json','utf8'));
test('topology import preserves old material, reruns without duplicates and rejects modified questions',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`CREATE TABLE chapters(id TEXT PRIMARY KEY,class_slug TEXT,subject_slug TEXT,chapter_number INT,title TEXT,description TEXT,is_active BOOLEAN,book_title TEXT,display_chapter_number INT);
CREATE TABLE mcqs(id TEXT PRIMARY KEY,class_slug TEXT,subject_slug TEXT,chapter_number INT,topic TEXT,question TEXT,options JSONB,correct_index INT,explanation TEXT,created_at TIMESTAMPTZ);
INSERT INTO chapters(id,class_slug,subject_slug,chapter_number,title,is_active) VALUES('old-network','dit-intermediate','dit-computer-science',1,'Basic Terminologies',true),('old-office','dit-intermediate','dit-computer-science',2,'MS Office',true),('old-word','dit-intermediate','dit-computer-science',3,'Microsoft Word 2016',true);
INSERT INTO mcqs(id,question,chapter_number) VALUES('old-question','Preserve this question',2);`);
  const sql=await networkTopologyImportSql();await db.exec(sql);await db.exec(sql);
  assert.equal((await db.query('SELECT count(*)::int n FROM mcqs')).rows[0].n,101);
  assert.equal((await db.query('SELECT count(*)::int n FROM chapters')).rows[0].n,4);
  const groups=(await db.query('SELECT topic,count(*)::int n FROM mcqs WHERE chapter_number=4 GROUP BY topic')).rows;
  assert.equal(groups.length,10);assert.ok(groups.every(g=>g.n===10));
  assert.equal((await db.query("SELECT question FROM mcqs WHERE id='old-question'")).rows[0].question,'Preserve this question');
  const {chapterPlacement}=await loadTypescript('src/utils/chapter-books.ts');
  assert.deepEqual(chapterPlacement({id:bank.chapterId,classSlug:bank.classSlug,subjectSlug:bank.subjectSlug,chapterNumber:4,title:bank.chapterTitle,bookTitle:bank.bookTitle,displayChapterNumber:2}),{bookId:'computer-networking',bookTitle:'Computer Networking',number:2,title:'Network Topology'});
  await db.query('UPDATE mcqs SET explanation=$1 WHERE id=$2',['Edited by admin',bank.questions[0].id]);
  await assert.rejects(db.exec(sql),/differs/);await db.exec('ROLLBACK');
  assert.equal((await db.query('SELECT explanation FROM mcqs WHERE id=$1',[bank.questions[0].id])).rows[0].explanation,'Edited by admin');
 }finally{await db.close();}
});
