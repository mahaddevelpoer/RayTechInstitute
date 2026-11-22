import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadTypescript} from './load-typescript.mjs';
const read=async path=>JSON.parse(await fs.readFile(path,'utf8'));
const source=await read('content/dit/ict-chapter-6.json');
const pack=await read('content/dit/ict-chapter-6.generated.json');
const catalog=await loadTypescript('src/data/staticCatalog.ts');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

test('Application Software covers five syllabus sections with checked variable-sized banks',()=>{
 assert.deepEqual(source.topics.map(t=>t.code),['6.1','6.2','6.3','6.4','6.5']);assert.equal(source.sourcePages,'8');
 assert.deepEqual(source.topics.map(t=>t.questions.length),[10,10,15,15,10]);
 assert.equal(pack.questions.length,60);assert.equal(new Set(pack.questions.map(q=>q.question)).size,60);
 const positions=[0,0,0,0];let offset=0;
 source.topics.forEach(topic=>{
  assert.ok(topic.notes.split(/\s+/).length>=250);assert.equal(topic.examples.length,3);assert.ok(topic.mistakes.length>=3);assert.equal(topic.revision.length,6);
  topic.questions.forEach(raw=>{
   const q=pack.questions[offset++];assert.equal(q.question,raw[0]);assert.equal(q.options[q.correctIndex],raw[1]);assert.equal(q.explanation,raw[5]);
   assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.topic,`${topic.code} ${topic.title}`);
   assert.equal(q.chapterNumber,6);assert.equal(q.subjectSlug,'dit-ict');assert.match(q.id,/^dit-ict-ch6-q\d+$/);positions[q.correctIndex]++;
  });
 });assert.deepEqual(positions,[15,15,15,15]);
 assert.equal(source.short.length,12);assert.equal(source.long.length,6);assert.equal(source.practical.length,5);
 const business=source.topics[2].notes.toLowerCase();
 for(const term of ['word processing','spreadsheet','database','presentation','project management','personal information manager','smartphone','accounting','computer-aided design','desktop publishing','paint','image-editing','video-editing','audio-editing','multimedia authoring','web page authoring'])assert.ok(business.includes(term),`Missing category: ${term}`);
 const answerFor=question=>{const q=pack.questions.find(item=>item.question===question);assert.ok(q,question);return q.options[q.correctIndex];};
 assert.equal(answerFor('Under that convention, what is the gross speed for 250 characters in one minute?'),`${250/5/1} WPM`);
 assert.equal(answerFor('Using matched characters divided by entered characters, what is 245 out of 250 as a percentage?'),`${245/250*100} percent`);
 assert.match(pack.content,/no universal net-WPM formula/);assert.match(pack.content,/Not every web application works offline/);
});

test('six independent ICT banks preserve all five earlier guides and total 380 questions',async()=>{
 const all=catalog.INITIAL_MCQS.filter(q=>q.subjectSlug==='dit-ict');assert.equal(all.length,380);assert.equal(new Set(all.map(q=>q.id)).size,380);
 assert.deepEqual(all.filter(q=>q.chapterNumber===6),pack.questions);
 const slugs=['introduction-to-computers','system-unit-components','input-output-devices','digital-storage','system-software'];
 for(const n of [1,2,3,4,5]){
  const prior=await read(`content/dit/ict-chapter-${n}.generated.json`);
  assert.deepEqual(all.filter(q=>q.chapterNumber===n),prior.questions);
  assert.equal(catalog.INITIAL_NOTES.find(note=>note.subjectSlug==='dit-ict'&&note.chapterNumber===n).content,prior.content);
  assert.equal(hash(await fs.readFile(`public/documents/dit/ict/ict-chapter-${n}-${slugs[n-1]}.pdf`)),prior.pdfSha256);
 }
 const note=catalog.INITIAL_NOTES.find(n=>n.id==='dit-ict-chapter-6-application-software');assert.equal(note.content,pack.content);assert.equal(note.chapterNumber,6);
 assert.match(note.pdfUrl,/ict-chapter-6-application-software\.pdf$/);
 assert.deepEqual(catalog.INITIAL_CHAPTERS.filter(c=>c.subjectSlug==='dit-ict').map(c=>c.chapterNumber),[1,2,3,4,5,6]);
});

test('web/PDF match reviewed sources and a separate practice test samples every section',async()=>{
 assert.equal(hash((await fs.readFile('content/dit/ict-chapter-6.json','utf8')).replace(/\r\n/g,'\n')),pack.sourceSha256);
 const pdf=await fs.readFile('public/documents/dit/ict/ict-chapter-6-application-software.pdf');assert.equal(pdf.subarray(0,5).toString(),'%PDF-');assert.equal(pdf.length,pack.pdfBytes);assert.equal(hash(pdf),pack.pdfSha256);
 const practice=pack.content.split('## Chapter practice test')[1].split('## Practice test answer key')[0];
 assert.equal((practice.match(/^### Q\d+\./gm)||[]).length,20);assert.ok(!practice.includes('Correct answer:'));assert.ok(!/\*\*[A-D]\)/.test(practice));
 for(const topic of source.topics)assert.equal(topic.questions.filter(q=>practice.includes(q[0])).length,4,`Practice sample for ${topic.code}`);
 assert.match(pack.content,/not verified past-paper questions/);assert.match(pack.content,/application-workflow\.svg/);
 assert.match(pack.content,/Keep an appropriate editable source/);assert.match(pack.content,/Closing a tab does not necessarily sign out/);
 assert.ok(!pack.content.includes('5.5 Personal Computer Maintenance MCQs'));
});
