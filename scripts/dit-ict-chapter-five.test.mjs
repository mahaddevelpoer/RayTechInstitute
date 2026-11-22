import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadTypescript} from './load-typescript.mjs';
const read=async path=>JSON.parse(await fs.readFile(path,'utf8'));
const source=await read('content/dit/ict-chapter-5.json');
const pack=await read('content/dit/ict-chapter-5.generated.json');
const catalog=await loadTypescript('src/data/staticCatalog.ts');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

test('System Software covers five syllabus sections with twelve explained questions each',()=>{
 assert.deepEqual(source.topics.map(t=>t.code),['5.1','5.2','5.3','5.4','5.5']);assert.equal(source.sourcePages,'8');
 assert.equal(pack.questions.length,60);assert.equal(new Set(pack.questions.map(q=>q.question)).size,60);
 const positions=[0,0,0,0];
 source.topics.forEach((topic,index)=>{
  assert.equal(topic.questions.length,12);assert.ok(topic.notes.split(/\s+/).length>=250);
  assert.equal(topic.examples.length,3);assert.ok(topic.mistakes.length>=3);assert.equal(topic.revision.length,6);
  topic.questions.forEach((raw,i)=>{
   const q=pack.questions[index*12+i];assert.equal(q.question,raw[0]);assert.equal(q.options[q.correctIndex],raw[1]);assert.equal(q.explanation,raw[5]);
   assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.topic,`${topic.code} ${topic.title}`);
   assert.equal(q.chapterNumber,5);assert.equal(q.subjectSlug,'dit-ict');assert.match(q.id,/^dit-ict-ch5-q\d+$/);positions[q.correctIndex]++;
  });
 });assert.deepEqual(positions,[15,15,15,15]);
 assert.equal(source.short.length,12);assert.equal(source.long.length,6);assert.equal(source.practical.length,5);
 const functions=source.topics[1].notes.toLowerCase();
 for(const term of ['startup','shutdown','user interface','programs','scheduler','memory management','device','internet','file management','performance monitoring','updating','network control','security administration'])assert.ok(functions.includes(term),`Missing OS function: ${term}`);
 const utilities=source.topics[3].notes.toLowerCase();
 for(const term of ['file manager','search utility','uninstaller','image viewer','media player','disk cleanup','defragmentation','trim','backup','restore','screen saver','firewall','antivirus','spyware','adware','compression','disc-burning'])assert.ok(utilities.includes(term),`Missing utility: ${term}`);
 assert.match(pack.content,/paging file does not become equally fast physical RAM/);assert.match(pack.content,/Linux systems are not limited to a CLI/);
 assert.match(pack.content,/screen saver.*not automatically a security lock/);assert.match(pack.content,/supported versions/);
});

test('five independent ICT banks preserve all four earlier guides and total 320 questions',async()=>{
 const all=catalog.INITIAL_MCQS.filter(q=>q.subjectSlug==='dit-ict');assert.equal(all.length,320);assert.equal(new Set(all.map(q=>q.id)).size,320);
 assert.deepEqual(all.filter(q=>q.chapterNumber===5),pack.questions);
 const slugs=['introduction-to-computers','system-unit-components','input-output-devices','digital-storage'];
 for(const n of [1,2,3,4]){
  const prior=await read(`content/dit/ict-chapter-${n}.generated.json`);
  assert.deepEqual(all.filter(q=>q.chapterNumber===n),prior.questions);
  assert.equal(catalog.INITIAL_NOTES.find(note=>note.subjectSlug==='dit-ict'&&note.chapterNumber===n).content,prior.content);
  assert.equal(hash(await fs.readFile(`public/documents/dit/ict/ict-chapter-${n}-${slugs[n-1]}.pdf`)),prior.pdfSha256);
 }
 const note=catalog.INITIAL_NOTES.find(n=>n.id==='dit-ict-chapter-5-system-software');assert.equal(note.content,pack.content);assert.equal(note.chapterNumber,5);
 assert.match(note.pdfUrl,/ict-chapter-5-system-software\.pdf$/);
 assert.deepEqual(catalog.INITIAL_CHAPTERS.filter(c=>c.subjectSlug==='dit-ict').map(c=>c.chapterNumber),[1,2,3,4,5]);
});

test('reviewed sources match web/PDF and a separate practice test covers all five sections',async()=>{
 assert.equal(hash((await fs.readFile('content/dit/ict-chapter-5.json','utf8')).replace(/\r\n/g,'\n')),pack.sourceSha256);
 const pdf=await fs.readFile('public/documents/dit/ict/ict-chapter-5-system-software.pdf');assert.equal(pdf.subarray(0,5).toString(),'%PDF-');assert.equal(pdf.length,pack.pdfBytes);assert.equal(hash(pdf),pack.pdfSha256);
 const practice=pack.content.split('## Chapter practice test')[1].split('## Practice test answer key')[0];
 assert.equal((practice.match(/^### Q\d+\./gm)||[]).length,20);assert.ok(!practice.includes('Correct answer:'));assert.ok(!/\*\*[A-D]\)/.test(practice));
 for(const topic of source.topics)assert.equal(topic.questions.filter(q=>practice.includes(q[0])).length,4,`Practice sample for ${topic.code}`);
 assert.match(pack.content,/not verified past-paper questions/);assert.match(pack.content,/system-software-layers\.svg/);
 assert.match(pack.content,/TRIM or retrim/);assert.match(pack.content,/restore.*separate location|Restore a sample separately/i);
 assert.ok(!pack.content.includes('4.5 Cloud Storage and Recoverable Copies MCQs'));
});
