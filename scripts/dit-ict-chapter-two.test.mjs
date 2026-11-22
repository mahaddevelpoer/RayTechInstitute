import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadTypescript} from './load-typescript.mjs';
const read=async path=>JSON.parse(await fs.readFile(path,'utf8'));
const source=await read('content/dit/ict-chapter-2.json');
const pack=await read('content/dit/ict-chapter-2.generated.json');
const first=await read('content/dit/ict-chapter-1.generated.json');
const catalog=await loadTypescript('src/data/staticCatalog.ts');
test('Chapter 2 covers the six official syllabus sections with checked distinct options',()=>{
 assert.deepEqual(source.topics.map(t=>t.code),['2.1','2.2','2.3','2.4','2.5','2.6']);
 assert.equal(pack.questions.length,60);assert.equal(new Set(pack.questions.map(q=>q.question)).size,60);
 const counts=[0,0,0,0];
 pack.questions.forEach((q,i)=>{
  const original=source.topics[Math.floor(i/10)].questions[i%10];
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
  assert.equal(q.question,original[0]);assert.equal(q.options[q.correctIndex],original[1]);assert.equal(q.explanation,original[5]);
  assert.equal(q.chapterNumber,2);assert.equal(q.subjectSlug,'dit-ict');assert.match(q.id,/^dit-ict-ch2-q\d+$/);counts[q.correctIndex]++;
 });assert.deepEqual(counts,[15,15,15,15]);
 assert.equal(source.short.length,12);assert.equal(source.long.length,6);assert.equal(source.practical.length,5);
});
test('both ICT chapters have isolated questions and preserve the published Chapter 1 pack',()=>{
 const questions=catalog.INITIAL_MCQS.filter(q=>q.subjectSlug==='dit-ict');assert.equal(questions.length,120);
 assert.deepEqual(questions.filter(q=>q.chapterNumber===1),first.questions);
 assert.deepEqual(questions.filter(q=>q.chapterNumber===2),pack.questions);
 assert.equal(new Set(questions.map(q=>q.id)).size,120);
 assert.equal(catalog.INITIAL_NOTES.find(n=>n.id==='dit-ict-chapter-1-introduction-to-computers').content,first.content);
 assert.equal(catalog.INITIAL_NOTES.find(n=>n.id==='dit-ict-chapter-2-system-unit-components').chapterNumber,2);
});
test('Chapter 2 web and PDF use the current reviewed source and keep practice answers separate',async()=>{
 const bytes=await fs.readFile('content/dit/ict-chapter-2.json');assert.equal(createHash('sha256').update(bytes).digest('hex'),pack.sourceSha256);
 const pdf=await fs.readFile('public/documents/dit/ict/ict-chapter-2-system-unit-components.pdf');assert.equal(pdf.subarray(0,5).toString(),'%PDF-');assert.equal(pdf.length,pack.pdfBytes);assert.equal(createHash('sha256').update(pdf).digest('hex'),pack.pdfSha256);
 const section=pack.content.split('## Chapter practice test')[1].split('## Practice test answer key')[0];
 assert.equal((section.match(/^### Q\d+\./gm)||[]).length,20);assert.ok(!section.includes('Correct answer:'));assert.ok(!/\*\*[A-D]\)/.test(section));
 assert.match(pack.content,/not verified past-paper questions/);assert.match(pack.content,/system-unit-connections\.svg/);
 assert.match(pack.content,/never open a PSU|Do not open a PSU/i);assert.match(pack.content,/not the same as a complete instruction/);
 assert.ok(!pack.content.includes('History and Evolution of Computers MCQs'));
});
