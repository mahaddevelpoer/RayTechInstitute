import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import sharp from 'sharp';
import {wordMcqImportSql} from './stage-word-mcq-import.mjs';
const word=JSON.parse(await fs.readFile('content/imports/dit-ms-word-2016-chapter-2.json','utf8'));
const office=JSON.parse(await fs.readFile('content/imports/dit-ms-office-chapter-1.json','utf8'));
const networking=JSON.parse(await fs.readFile('content/imports/dit-computer-networks-chapter-1.json','utf8'));

test('Word source preserves 100 independently checked answers in ten topics, separate from both existing chapters',()=>{
 const answers='DBACBDAADDBDBCCCBCBAAAAABDDABBABADBCBDCACDBBCCDDACCBAAACCDCDBCAAACCCBBBCBCDDBCDBDDDBAADDADBDCDBACAAC';
 assert.equal(word.chapterNumber,3);assert.equal(word.chapterTitle,'Microsoft Word 2016');assert.equal(word.sourceChapterNumber,2);
 assert.equal(word.classSlug,office.classSlug);assert.equal(word.subjectSlug,office.subjectSlug);
 assert.equal(word.questions.length,100);assert.equal(new Set([...networking.questions,...office.questions,...word.questions].map(q=>q.id)).size,240);
 assert.deepEqual(Array.from(new Set(word.questions.map(q=>q.topic))),word.sourceSections);assert.equal(word.sourceSections.length,10);
 for(const topic of word.sourceSections)assert.equal(word.questions.filter(q=>q.topic===topic).length,10);
 word.questions.forEach((q,index)=>{assert.equal(q.correctIndex,answers.charCodeAt(index)-65);assert.equal(new Set(q.options).size,4);for(const value of [q.question,...q.options,q.explanation]){assert.match(value,/[A-Za-z]/);assert.match(value,/[\u0600-\u06ff]/);}});
});

test('Word chapter transaction preserves 140 existing questions, is rerunnable and refuses collisions or overwrites',async()=>{
 const db=new PGlite();const sql=await wordMcqImportSql();
 try{
  await db.exec(`CREATE TABLE public.chapters(id TEXT PRIMARY KEY,class_slug TEXT,subject_slug TEXT,chapter_number INT,title TEXT,description TEXT,is_active BOOLEAN);
   INSERT INTO public.chapters VALUES('networking','dit-intermediate','dit-computer-science',1,'Basic Terminologies','',true),('chapter-dit-computer-science-ms-office','dit-intermediate','dit-computer-science',2,'MS Office','',true);
   CREATE TABLE public.mcqs(id TEXT PRIMARY KEY,class_slug TEXT,subject_slug TEXT,chapter_number INT,topic TEXT,question TEXT,options JSONB,correct_index INT,explanation TEXT,created_at TIMESTAMPTZ DEFAULT NOW());`);
  const old=[...networking.questions.map(q=>({...q,chapter_number:1})),...office.questions.map(q=>({...q,chapter_number:2}))].map(q=>({id:q.id,class_slug:word.classSlug,subject_slug:word.subjectSlug,chapter_number:q.chapter_number,topic:q.topic,question:q.question,options:q.options,correct_index:q.correctIndex,explanation:q.explanation}));
  await db.query('INSERT INTO public.mcqs(id,class_slug,subject_slug,chapter_number,topic,question,options,correct_index,explanation) SELECT id,class_slug,subject_slug,chapter_number,topic,question,options,correct_index,explanation FROM jsonb_to_recordset($1::jsonb) AS s(id TEXT,class_slug TEXT,subject_slug TEXT,chapter_number INT,topic TEXT,question TEXT,options JSONB,correct_index INT,explanation TEXT)',[JSON.stringify(old)]);
  const before=(await db.query('SELECT * FROM public.mcqs ORDER BY id')).rows;
  await db.exec(sql);const first=(await db.query('SELECT created_at FROM public.mcqs WHERE id=$1',[word.questions[0].id])).rows[0].created_at;await db.exec(sql);
  assert.equal((await db.query('SELECT count(*)::int AS n FROM public.mcqs')).rows[0].n,240);
  assert.deepEqual((await db.query('SELECT * FROM public.mcqs WHERE chapter_number IN(1,2) ORDER BY id')).rows,before);
  assert.equal((await db.query('SELECT created_at FROM public.mcqs WHERE id=$1',[word.questions[0].id])).rows[0].created_at.getTime(),first.getTime());
  const groups=(await db.query('SELECT topic,count(*)::int AS n FROM public.mcqs WHERE chapter_number=3 GROUP BY topic')).rows;assert.equal(groups.length,10);assert.ok(groups.every(group=>group.n===10));
  await db.query('UPDATE public.mcqs SET question=$1 WHERE id=$2',['Administrator edit',word.questions[0].id]);await assert.rejects(db.exec(sql),/No content was overwritten/);await db.exec('ROLLBACK');
  await db.exec("DELETE FROM public.mcqs WHERE chapter_number=3;DELETE FROM public.chapters WHERE chapter_number=3;INSERT INTO public.chapters VALUES('occupied','dit-intermediate','dit-computer-science',3,'Other chapter','',true)");
  await assert.rejects(db.exec(sql),/chapter identity or number is already in use/);await db.exec('ROLLBACK');assert.equal((await db.query('SELECT count(*)::int AS n FROM public.mcqs')).rows[0].n,140);
 }finally{await db.close();}
});

test('logo and icons have real alpha, square delivery sizes, embedded ICO frames and modest header payload',async()=>{
 const source=await sharp('content/branding/raytech-logo-source.png').metadata();assert.equal(source.width,1254);assert.equal(source.height,1254);assert.equal(source.hasAlpha,true);
 const header=await sharp('public/assets/raytech-logo.webp').metadata();assert.equal(header.width,192);assert.equal(header.height,192);assert.equal(header.hasAlpha,true);assert.ok((await fs.stat('public/assets/raytech-logo.webp')).size<25000);
 for(const [name,size] of [['favicon-16x16.png',16],['favicon-32x32.png',32],['favicon-96x96.png',96],['apple-touch-icon.png',180],['android-chrome-192x192.png',192],['android-chrome-512x512.png',512]]){
  const {data,info}=await sharp('public/'+name).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,size);assert.equal(info.height,size);assert.equal(data[3],0);assert.equal(data[(size*size-1)*4+3],0);
 }
 const ico=await fs.readFile('public/favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);assert.ok(ico.length<20000);
 for(let i=0;i<3;i++){const index=6+i*16;assert.equal(ico[index],ico[index+1]);const start=ico.readUInt32LE(index+12);assert.equal(ico.subarray(start,start+8).toString('hex'),'89504e470d0a1a0a');}
});

test('favicon discovery uses stable crawlable local files and header containment preserves the full logo',async()=>{
 const layout=await fs.readFile('src/app/layout.tsx','utf8');assert.match(layout,/favicon-96x96\.png/);assert.match(layout,/manifest: "\/site.webmanifest"/);assert.doesNotMatch(layout,/<link\s+rel="icon"/);
 const robots=await fs.readFile('public/robots.txt','utf8');assert.match(robots,/Allow: \//);assert.doesNotMatch(robots,/Disallow:\s*\/(?:favicon|assets)/i);
 const component=await fs.readFile('src/components/Header.tsx','utf8');assert.match(component,/alt="RayTech Institute logo"/);assert.match(component,/object-contain/);
 assert.match(await fs.readFile('src/data/channel.ts','utf8'),/profileImage: "\/assets\/raytech-logo.webp"/);
 const manifest=JSON.parse(await fs.readFile('public/site.webmanifest','utf8'));for(const icon of manifest.icons)assert.ok((await fs.stat('public'+icon.src)).size>0);
});
