import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadTypescript} from './load-typescript.mjs';
const read=async path=>JSON.parse(await fs.readFile(path,'utf8'));
const source=await read('content/dit/ict-chapter-3.json');
const pack=await read('content/dit/ict-chapter-3.generated.json');
const catalog=await loadTypescript('src/data/staticCatalog.ts');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

test('Chapter 3 covers all eight PBTE sections with 80 distinct explained questions',()=>{
 assert.deepEqual(source.topics.map(t=>t.code),Array.from({length:8},(_,i)=>`3.${i+1}`));
 assert.equal(pack.questions.length,80);assert.equal(new Set(pack.questions.map(q=>q.question)).size,80);
 const positions=[0,0,0,0];
 source.topics.forEach((topic,index)=>{
  assert.equal(topic.questions.length,10);assert.ok(topic.notes.split(/\s+/).length>=180);
  assert.equal(topic.examples.length,3);assert.ok(topic.mistakes.length>=3);assert.equal(topic.revision.length,6);
  topic.questions.forEach((raw,i)=>{
   const q=pack.questions[index*10+i];assert.equal(q.question,raw[0]);assert.equal(q.options[q.correctIndex],raw[1]);assert.equal(q.explanation,raw[5]);
   assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.topic,`${topic.code} ${topic.title}`);
   assert.equal(q.chapterNumber,3);assert.equal(q.subjectSlug,'dit-ict');assert.match(q.id,/^dit-ict-ch3-q\d+$/);positions[q.correctIndex]++;
  });
 });assert.deepEqual(positions,[20,20,20,20]);
 assert.equal(source.short.length,12);assert.equal(source.long.length,6);assert.equal(source.practical.length,5);
 for(const term of ['Keyboard','Joystick','Trackball','Touchpad','Stylus','Game Controllers','Digital Camera','Voice Input','Scanners','Biometric','Terminals','CRT','LCD','LED','Inkjet','Laser','Multifunction','Thermal','Plotters','Headphones','Projectors','Whiteboards']){
  assert.ok(pack.content.toLowerCase().includes(term.toLowerCase()),`Missing syllabus concept: ${term}`);
 }
});

test('all three chapters remain isolated and the two published packs remain intact',async()=>{
 const all=catalog.INITIAL_MCQS.filter(q=>q.subjectSlug==='dit-ict'&&q.chapterNumber<=3);assert.equal(all.length,200);assert.equal(new Set(all.map(q=>q.id)).size,200);
 assert.deepEqual(all.filter(q=>q.chapterNumber===3),pack.questions);
 for(const n of [1,2]){
  const prior=await read(`content/dit/ict-chapter-${n}.generated.json`);
  assert.deepEqual(all.filter(q=>q.chapterNumber===n),prior.questions);
  assert.equal(catalog.INITIAL_NOTES.find(note=>note.subjectSlug==='dit-ict'&&note.chapterNumber===n).content,prior.content);
  const slug=n===1?'introduction-to-computers':'system-unit-components';
  assert.equal(hash(await fs.readFile(`public/documents/dit/ict/ict-chapter-${n}-${slug}.pdf`)),prior.pdfSha256);
 }
 const note=catalog.INITIAL_NOTES.find(n=>n.id==='dit-ict-chapter-3-input-output-devices');assert.equal(note.content,pack.content);assert.equal(note.chapterNumber,3);
 assert.match(note.pdfUrl,/ict-chapter-3-input-output-devices\.pdf$/);
 assert.deepEqual(catalog.INITIAL_CHAPTERS.filter(c=>c.subjectSlug==='dit-ict'&&c.chapterNumber<=3).map(c=>c.chapterNumber),[1,2,3]);
});

test('reviewed web/PDF sources match and the practice test samples all eight sections',async()=>{
 assert.equal(hash((await fs.readFile('content/dit/ict-chapter-3.json','utf8')).replace(/\r\n/g,'\n')),pack.sourceSha256);
 const pdf=await fs.readFile('public/documents/dit/ict/ict-chapter-3-input-output-devices.pdf');assert.equal(pdf.subarray(0,5).toString(),'%PDF-');assert.equal(pdf.length,pack.pdfBytes);assert.equal(hash(pdf),pack.pdfSha256);
 const practice=pack.content.split('## Chapter practice test')[1].split('## Practice test answer key')[0];
 assert.equal((practice.match(/^### Q\d+\./gm)||[]).length,20);assert.ok(!practice.includes('Correct answer:'));assert.ok(!/\*\*[A-D]\)/.test(practice));
 for(const topic of source.topics)assert.ok(topic.questions.some(q=>practice.includes(q[0])),`Practice omits ${topic.code}`);
 assert.match(pack.content,/not verified past-paper questions/);assert.match(pack.content,/input-output-device-flow\.svg/);
 for(const phrase of ['LED backlights','OCR','thermal transfer','false','saving','headset'])assert.ok(pack.content.toLowerCase().includes(phrase.toLowerCase()));
 assert.ok(!pack.content.includes('Legacy CMOS settings RAM |'));
});
