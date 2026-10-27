import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { officeMcqImportSql } from './stage-office-mcq-import.mjs';
import { loadTypescript } from './load-typescript.mjs';
const bank=JSON.parse(await fs.readFile('content/imports/dit-ms-office-chapter-1.json','utf8'));
const networking=JSON.parse(await fs.readFile('content/imports/dit-computer-networks-chapter-1.json','utf8'));
const {isRecentTopic,topicFirstAdded,nextTopicExpiry,NEW_TOPIC_DURATION_MS}=await loadTypescript('src/utils/topic-freshness.ts');

test('Office import preserves sixty bilingual questions and the independent answer key in a separate chapter with six source topics',()=>{
  const key='CBCDBDBBACBDBCAADABDBDCBBBBAABABDADCCCAABDACDCBBBDCABBCBCCAC';
  assert.equal(bank.questions.length,60);assert.equal(bank.classSlug,networking.classSlug);assert.equal(bank.subjectSlug,networking.subjectSlug);assert.equal(bank.chapterNumber,2);
  assert.equal(bank.chapterTitle,'MS Office');assert.equal(bank.sourceChapterNumber,1);
  assert.deepEqual([...new Set(bank.questions.map(q=>q.topic))],bank.sourceSections);
  for(const section of bank.sourceSections)assert.equal(bank.questions.filter(q=>q.topic===section).length,10);
  assert.equal(new Set(bank.questions.map(q=>q.sourceSection)).size,6);
  const ids=[...networking.questions,...bank.questions].map(q=>q.id);assert.equal(new Set(ids).size,140);
  bank.questions.forEach((q,index)=>{
    assert.equal(q.correctIndex,key.charCodeAt(index)-65);assert.equal(q.sourceNumber,index+1);
    assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
    for(const text of [q.question,...q.options,q.explanation]){assert.match(text,/[A-Za-z]/);assert.match(text,/[\u0600-\u06ff]/);assert.match(text,/\n/);}
  });
});

test('golden topics expire at exactly 24 hours, use first creation, and never refresh on a rebuild or added question',()=>{
  const first=Date.parse('2026-10-27T09:00:00Z');
  const old={chapterNumber:1,topic:'Office',createdAt:new Date(first).toISOString()};
  assert.equal(isRecentTopic([old],first),true);
  assert.equal(isRecentTopic([old],first+NEW_TOPIC_DURATION_MS-1),true);
  assert.equal(isRecentTopic([old],first+NEW_TOPIC_DURATION_MS),false);
  assert.equal(isRecentTopic([old],first-1),false);
  assert.equal(isRecentTopic([old],NaN),false);
  assert.equal(isRecentTopic([{createdAt:'invalid'}],first),false);
  assert.equal(isRecentTopic([{createdAt:undefined},old],first),false);
  const later={...old,createdAt:new Date(first+NEW_TOPIC_DURATION_MS*2).toISOString()};
  assert.equal(topicFirstAdded([old,later]),first);
  assert.equal(isRecentTopic([old,later],first+NEW_TOPIC_DURATION_MS*2),false);
  assert.equal(nextTopicExpiry([old],first),first+NEW_TOPIC_DURATION_MS);
  assert.equal(nextTopicExpiry([old],first+NEW_TOPIC_DURATION_MS),null);
  assert.equal(nextTopicExpiry([old,{...old,topic:'Different topic',createdAt:new Date(first+1000).toISOString()}],first+1500),first+NEW_TOPIC_DURATION_MS);
});

test('staged import is atomic and rerunnable, preserves timestamps and all existing chapter content',async()=>{
  const db=new PGlite();const sql=await officeMcqImportSql();
  try{
    await db.exec(`CREATE TABLE public.chapters(id TEXT PRIMARY KEY,class_slug TEXT,subject_slug TEXT,chapter_number INT,title TEXT,description TEXT,is_active BOOLEAN);
      INSERT INTO public.chapters VALUES('networking','dit-intermediate','dit-computer-science',1,'Basic Terminologies','Existing chapter',true);
      CREATE TABLE public.mcqs(id TEXT PRIMARY KEY,class_slug TEXT,subject_slug TEXT,chapter_number INT,topic TEXT,question TEXT,options JSONB,correct_index INT,explanation TEXT,created_at TIMESTAMPTZ DEFAULT NOW());
      INSERT INTO public.mcqs VALUES('existing-network','dit-intermediate','dit-computer-science',1,'Existing networking topic','Existing question','["A","B","C","D"]',0,'Existing explanation','2026-10-01T00:00:00Z');`);
    await db.exec(sql);
    const first=(await db.query('SELECT created_at FROM public.mcqs WHERE id=$1',[bank.questions[0].id])).rows[0].created_at;
    await db.exec(sql);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM public.mcqs')).rows[0].n,61);
    const chapters=(await db.query('SELECT chapter_number,title FROM public.chapters ORDER BY chapter_number')).rows;
    assert.deepEqual(chapters,[{chapter_number:1,title:'Basic Terminologies'},{chapter_number:2,title:'MS Office'}]);
    const groups=(await db.query('SELECT topic,count(*)::int AS n FROM public.mcqs WHERE chapter_number=2 GROUP BY topic')).rows;
    assert.equal(groups.length,6);assert.ok(groups.every(group=>group.n===10));
    assert.equal((await db.query('SELECT created_at FROM public.mcqs WHERE id=$1',[bank.questions[0].id])).rows[0].created_at.getTime(),first.getTime());
    assert.equal((await db.query("SELECT question FROM public.mcqs WHERE id='existing-network'")).rows[0].question,'Existing question');
    await db.query('UPDATE public.mcqs SET question=$1 WHERE id=$2',['Admin edited this question',bank.questions[0].id]);
    await assert.rejects(db.exec(sql),/No content was overwritten/);await db.exec('ROLLBACK');
    assert.equal((await db.query('SELECT question FROM public.mcqs WHERE id=$1',[bank.questions[0].id])).rows[0].question,'Admin edited this question');
    await db.exec('DELETE FROM public.chapters');
    await assert.rejects(db.exec(sql),/Chapter 1 must be present/);await db.exec('ROLLBACK');
  }finally{await db.close();}
});

test('import refuses an occupied chapter number without renaming chapters or inserting questions',async()=>{
  const db=new PGlite();
  try{
    await db.exec(`CREATE TABLE public.chapters(id TEXT PRIMARY KEY,class_slug TEXT,subject_slug TEXT,chapter_number INT,title TEXT,description TEXT,is_active BOOLEAN);
      INSERT INTO public.chapters VALUES('networking','dit-intermediate','dit-computer-science',1,'Basic Terminologies','',true),('other','dit-intermediate','dit-computer-science',2,'Admin chapter','',true);
      CREATE TABLE public.mcqs(id TEXT PRIMARY KEY,class_slug TEXT,subject_slug TEXT,chapter_number INT,topic TEXT,question TEXT,options JSONB,correct_index INT,explanation TEXT,created_at TIMESTAMPTZ DEFAULT NOW());`);
    await assert.rejects(db.exec(await officeMcqImportSql()),/chapter identity or number is already in use/);await db.exec('ROLLBACK');
    assert.equal((await db.query('SELECT count(*)::int AS n FROM public.mcqs')).rows[0].n,0);
    assert.equal((await db.query("SELECT title FROM public.chapters WHERE id='other'")).rows[0].title,'Admin chapter');
  }finally{await db.close();}
});

test('golden text meets AA contrast in light and dark mode; timestamps come from the database',async()=>{
  const light=['#78350f','#fffbeb'],dark=['#fde68a','#302513'];
  const luminance=hex=>{const x=hex.slice(1).match(/../g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return .2126*x[0]+.7152*x[1]+.0722*x[2];};
  for(const pair of [light,dark]){const [a,b]=pair.map(luminance).sort((a,b)=>b-a);assert.ok((a+.05)/(b+.05)>=4.5);}
  const css=await fs.readFile('src/app/catalog.css','utf8');for(const color of [...light,...dark])assert.ok(css.includes(color));
  assert.match(await fs.readFile('scripts/generate-static-data.mjs','utf8'),/createdAt: m.created_at \|\| undefined/);
  const store=await fs.readFile('src/data/educationalStore.ts','utf8');assert.match(store,/createdAt: m.created_at \|\| undefined/);
  assert.doesNotMatch(store.slice(store.indexOf('async saveMCQ('),store.indexOf('async deleteMCQ(')),/created_at:/);
});
