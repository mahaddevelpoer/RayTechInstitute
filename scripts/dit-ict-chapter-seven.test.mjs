import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadTypescript} from './load-typescript.mjs';
const read=async path=>JSON.parse(await fs.readFile(path,'utf8'));
const source=await read('content/dit/ict-chapter-7.json');
const pack=await read('content/dit/ict-chapter-7.generated.json');
const catalog=await loadTypescript('src/data/staticCatalog.ts');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

test('Internet and web pack covers nine sections with 108 explained questions',()=>{
 assert.deepEqual(source.topics.map(t=>t.code),Array.from({length:9},(_,i)=>`7.${i+1}`));assert.equal(source.sourcePages,'9');
 assert.deepEqual(source.topics.map(t=>t.questions.length),Array(9).fill(12));assert.equal(pack.questions.length,108);
 assert.equal(new Set(pack.questions.map(q=>q.question)).size,108);
 const positions=[0,0,0,0];let offset=0;
 for(const topic of source.topics){
  assert.ok(topic.notes.split(/\s+/).length>=250,topic.code);assert.equal(topic.examples.length,3);assert.equal(topic.mistakes.length,3);assert.equal(topic.revision.length,6);
  for(const raw of topic.questions){
   const q=pack.questions[offset++];assert.equal(q.question,raw[0]);assert.equal(q.options[q.correctIndex],raw[1]);assert.equal(q.explanation,raw[5]);
   assert.equal(new Set(q.options).size,4);assert.equal(q.topic,`${topic.code} ${topic.title}`);assert.equal(q.chapterNumber,7);assert.equal(q.subjectSlug,'dit-ict');positions[q.correctIndex]++;
  }
 }assert.deepEqual(positions,[27,27,27,27]);
 assert.equal(source.short.length,12);assert.equal(source.long.length,6);assert.equal(source.practical.length,5);
 const answerFor=text=>{const q=pack.questions.find(q=>q.question===text);assert.ok(q,text);return q.options[q.correctIndex];};
 assert.match(answerFor('Does a Wi-Fi connection alone prove external Internet access?'),/^No/);
 assert.match(answerFor('Does HTTPS alone prove an unfamiliar shop is trustworthy?'),/^No/);
 assert.match(answerFor('Does private browsing provide universal anonymity?'),/^No/);
 assert.match(answerFor('What is SFTP?'),/distinct SSH-based/);
 assert.match(answerFor('In the stated example, what is 1,000 plus 150 delivery minus a 100 discount?'),/^1,050$/);
});

test('seven ICT banks total 488 and preserve earlier notes and exact PDF bytes',async()=>{
 const all=catalog.INITIAL_MCQS.filter(q=>q.subjectSlug==='dit-ict');assert.equal(all.length,488);assert.equal(new Set(all.map(q=>q.id)).size,488);
 assert.deepEqual(all.filter(q=>q.chapterNumber===7),pack.questions);
 const slugs=['introduction-to-computers','system-unit-components','input-output-devices','digital-storage','system-software','application-software'];
 for(const n of [1,2,3,4,5,6]){
  const prior=await read(`content/dit/ict-chapter-${n}.generated.json`);assert.deepEqual(all.filter(q=>q.chapterNumber===n),prior.questions);
  assert.equal(catalog.INITIAL_NOTES.find(note=>note.subjectSlug==='dit-ict'&&note.chapterNumber===n).content,prior.content);
  assert.equal(hash(await fs.readFile(`public/documents/dit/ict/ict-chapter-${n}-${slugs[n-1]}.pdf`)),prior.pdfSha256);
 }
 const note=catalog.INITIAL_NOTES.find(n=>n.id==='dit-ict-chapter-7-the-internet-and-world-wide-web');assert.equal(note.content,pack.content);
 assert.match(note.pdfUrl,/ict-chapter-7-the-internet-and-world-wide-web\.pdf$/);
 assert.deepEqual(catalog.INITIAL_CHAPTERS.filter(c=>c.subjectSlug==='dit-ict').map(c=>c.chapterNumber),[1,2,3,4,5,6,7]);
});

test('practice samples every section and PDF matches source with appropriate boundaries',async()=>{
 assert.equal(hash((await fs.readFile('content/dit/ict-chapter-7.json','utf8')).replace(/\r\n/g,'\n')),pack.sourceSha256);
 const pdf=await fs.readFile('public/documents/dit/ict/ict-chapter-7-the-internet-and-world-wide-web.pdf');assert.equal(pdf.subarray(0,5).toString(),'%PDF-');assert.equal(pdf.length,pack.pdfBytes);assert.equal(hash(pdf),pack.pdfSha256);
 const practice=pack.content.split('## Chapter practice test')[1].split('## Practice test answer key')[0];
 assert.equal((practice.match(/^### Q\d+\./gm)||[]).length,20);assert.ok(!practice.includes('Correct answer:'));assert.ok(!/\*\*[A-D]\)/.test(practice));
 for(const topic of source.topics)assert.ok(topic.questions.some(q=>practice.includes(q[0])),topic.code);
 for(const phrase of ['not verified past-paper questions','internet-web-request-flow.svg','not a legal determination','not presented as Pakistani legal entitlements','not diagnose a condition','Review Chapter 6'])assert.ok(pack.content.includes(phrase),phrase);
});
