import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadTypescript} from './load-typescript.mjs';
const read=async path=>JSON.parse(await fs.readFile(path,'utf8'));
const source=await read('content/dit/ict-chapter-4.json');
const pack=await read('content/dit/ict-chapter-4.generated.json');
const catalog=await loadTypescript('src/data/staticCatalog.ts');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

test('Digital Storage covers all five PBTE sections with twelve checked questions each',()=>{
 assert.deepEqual(source.topics.map(t=>t.code),['4.1','4.2','4.3','4.4','4.5']);assert.equal(source.sourcePages,'8');
 assert.equal(pack.questions.length,60);assert.equal(new Set(pack.questions.map(q=>q.question)).size,60);
 const positions=[0,0,0,0];
 source.topics.forEach((topic,index)=>{
  assert.equal(topic.questions.length,12);assert.ok(topic.notes.split(/\s+/).length>=250);
  assert.equal(topic.examples.length,3);assert.ok(topic.mistakes.length>=3);assert.equal(topic.revision.length,6);
  topic.questions.forEach((raw,i)=>{
   const q=pack.questions[index*12+i];assert.equal(q.question,raw[0]);assert.equal(q.options[q.correctIndex],raw[1]);assert.equal(q.explanation,raw[5]);
   assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.topic,`${topic.code} ${topic.title}`);
   assert.equal(q.chapterNumber,4);assert.equal(q.subjectSlug,'dit-ict');assert.match(q.id,/^dit-ict-ch4-q\d+$/);positions[q.correctIndex]++;
  });
 });assert.deepEqual(positions,[15,15,15,15]);
 assert.equal(source.short.length,12);assert.equal(source.long.length,6);assert.equal(source.practical.length,5);
 for(const term of ['RAID 0','RAID 1','RAID 5','NAS','SSD','Memory Cards','USB Flash','ExpressCard','CD-ROM','DVD','Blu-ray','Magnetic Tape','Cloud','GiB','restore']){
  assert.ok(pack.content.toLowerCase().includes(term.toLowerCase()),`Missing syllabus concept: ${term}`);
 }
 const answerFor=question=>{const q=pack.questions.find(item=>item.question===question);assert.ok(q,question);return q.options[q.correctIndex];};
 assert.equal(answerFor('Before overhead, what is the usable capacity of two equal 1 TB drives in a simple RAID 1 mirror?'),'About 1 TB');
 assert.equal(answerFor('What is the minimum drive count for an ordinary RAID 5 array?'),'Three');
 assert.equal(answerFor('Which equality correctly uses a binary capacity prefix?'),`1 GiB equals ${new Intl.NumberFormat('en-US').format(2**30)} bytes`);
});

test('four ICT chapters keep isolated banks and preserve all three earlier public guides',async()=>{
 const all=catalog.INITIAL_MCQS.filter(q=>q.subjectSlug==='dit-ict'&&q.chapterNumber<=4);assert.equal(all.length,260);assert.equal(new Set(all.map(q=>q.id)).size,260);
 assert.deepEqual(all.filter(q=>q.chapterNumber===4),pack.questions);
 const slugs=['introduction-to-computers','system-unit-components','input-output-devices'];
 for(const n of [1,2,3]){
  const prior=await read(`content/dit/ict-chapter-${n}.generated.json`);
  assert.deepEqual(all.filter(q=>q.chapterNumber===n),prior.questions);
  assert.equal(catalog.INITIAL_NOTES.find(note=>note.subjectSlug==='dit-ict'&&note.chapterNumber===n).content,prior.content);
  assert.equal(hash(await fs.readFile(`public/documents/dit/ict/ict-chapter-${n}-${slugs[n-1]}.pdf`)),prior.pdfSha256);
 }
 const note=catalog.INITIAL_NOTES.find(n=>n.id==='dit-ict-chapter-4-digital-storage');assert.equal(note.content,pack.content);assert.equal(note.chapterNumber,4);
 assert.match(note.pdfUrl,/ict-chapter-4-digital-storage\.pdf$/);
 assert.deepEqual(catalog.INITIAL_CHAPTERS.filter(c=>c.subjectSlug==='dit-ict'&&c.chapterNumber<=4).map(c=>c.chapterNumber),[1,2,3,4]);
});

test('web/PDF match reviewed source and practice covers every section without revealing answers',async()=>{
 assert.equal(hash((await fs.readFile('content/dit/ict-chapter-4.json','utf8')).replace(/\r\n/g,'\n')),pack.sourceSha256);
 const pdf=await fs.readFile('public/documents/dit/ict/ict-chapter-4-digital-storage.pdf');assert.equal(pdf.subarray(0,5).toString(),'%PDF-');assert.equal(pdf.length,pack.pdfBytes);assert.equal(hash(pdf),pack.pdfSha256);
 const practice=pack.content.split('## Chapter practice test')[1].split('## Practice test answer key')[0];
 assert.equal((practice.match(/^### Q\d+\./gm)||[]).length,20);assert.ok(!practice.includes('Correct answer:'));assert.ok(!/\*\*[A-D]\)/.test(practice));
 for(const topic of source.topics)assert.equal(topic.questions.filter(q=>practice.includes(q[0])).length,4,`Practice sample for ${topic.code}`);
 assert.match(pack.content,/not verified past-paper questions/);assert.match(pack.content,/storage-recovery-copies\.svg/);
 assert.match(pack.content,/RAID is not a backup/);assert.match(pack.content,/deletion.*propagated|deletion.*propagate/);
 assert.match(pack.content,/ExpressCard is not a synonym for flash memory/);assert.match(pack.content,/without relying on compression/);
 assert.ok(!pack.content.includes('3.8 Other Output Devices MCQs'));
});
