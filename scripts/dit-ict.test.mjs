import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadTypescript} from './load-typescript.mjs';
const require=createRequire(import.meta.url);
const pack=JSON.parse(await fs.readFile('content/dit/ict-chapter-1.generated.json','utf8'));
const source=JSON.parse(await fs.readFile('content/dit/ict-chapter-1.json','utf8'));
const syllabus=JSON.parse(await fs.readFile('content/dit/semester-one.json','utf8'));
async function bundled(entry){
 const compiled=await build({entryPoints:[entry],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',logLevel:'silent',external:['react','react-dom','react/jsx-runtime'],plugins:[{name:'test-link',setup(b){b.onResolve({filter:/^next\/link$/},()=>({path:'link',namespace:'test'}));b.onLoad({filter:/.*/,namespace:'test'},()=>({loader:'jsx',contents:'import React from "react"; export default function Link({prefetch,children,...props}) { return <a {...props}>{children}</a>; }'}));}}]});
 const module={exports:{}};vm.runInNewContext(compiled.outputFiles[0].text,{module,exports:module.exports,require,console,URL});return module.exports;
}
const catalog=await bundled('src/data/staticCatalog.ts');
const {STATIC_OVERRIDES:before}=await bundled('src/data/staticOverrides.ts');
const additions=await bundled('src/data/ditSemesterOne.ts');
const completion=await bundled('src/data/ditCompletion.ts');
const class11=await bundled('src/data/class11Computer2027.ts');
test('release tooling reads the same JSON-backed catalog as the website',async()=>{
 const loaded=await loadTypescript('src/data/staticCatalog.ts');
 assert.equal(loaded.INITIAL_MCQS.filter(q=>q.subjectSlug==='dit-ict'&&q.chapterNumber===1).length,60);
 assert.equal(loaded.INITIAL_NOTES.find(n=>n.id==='dit-ict-chapter-1-introduction-to-computers').content,pack.content);
 assert.equal(JSON.stringify(loaded.INITIAL_CHAPTERS),JSON.stringify(catalog.INITIAL_CHAPTERS));
});
test('all six syllabus sections have ten unique questions with four options and balanced keys',()=>{
 assert.deepEqual(source.topics.map(t=>t.code),['1.1','1.2','1.3','1.4','1.5','1.6']);
 assert.equal(pack.questions.length,60);assert.equal(new Set(pack.questions.map(q=>q.question)).size,60);
 assert.equal(new Set(pack.questions.map(q=>q.id)).size,60);
 const counts=[0,0,0,0];
 pack.questions.forEach((q,i)=>{assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.correctIndex>=0&&q.correctIndex<4);counts[q.correctIndex]++;const raw=source.topics[Math.floor(i/10)].questions[i%10];assert.equal(q.question,raw[0]);assert.equal(q.options[q.correctIndex],raw[1]);assert.equal(q.explanation,raw[5]);assert.equal(q.subjectSlug,'dit-ict');});
 assert.deepEqual(counts,[15,15,15,15]);
});
test('new resources preserve every existing chapter, note and public MCQ',()=>{
 for(const [key,list] of [['chapters',catalog.INITIAL_CHAPTERS],['notes',catalog.INITIAL_NOTES],['mcqs',catalog.INITIAL_MCQS]]){
  for(const old of before[key]||[]){
   if(key==='mcqs'&&['mcq-1791959684546-sn62b','mcq-1791959685116-xidgz','mcq-1791959685379-8st80','mcq-1791959685663-b8b3q','mcq-1791959685796-p9mf4'].includes(old.id))continue;
   if(key==='mcqs'&&class11.CLASS11_EXCLUDED_MCQS.has(old.id)){assert.ok(!list.some(r=>r.id===old.id));continue;}
   const expected=key==='notes'?class11.completeClass11Note(completion.completeDitNote(old)):key==='mcqs'?class11.completeClass11Mcq(old):class11.completeClass11Chapter(old);
   assert.equal(JSON.stringify(list.find(r=>r.id===old.id)),JSON.stringify(expected));
  }
  assert.equal(new Set(list.map(r=>r.id)).size,list.length);
 }
 assert.equal(catalog.INITIAL_MCQS.filter(q=>q.subjectSlug==='dit-ict'&&q.chapterNumber===1).length,60);
 assert.throws(()=>additions.addReviewedResources([{id:'same'}],[{id:'same'}]),/collision/);
});
test('course information changes only the target class and legacy subject descriptions',()=>{
 const fixture={id:'old',slug:'dit-intermediate',numericGrade:11,title:'D.I.T',description:'old',isActive:true};
 const actual=additions.ditClassInformation(fixture);assert.equal(actual.id,'old');assert.equal(actual.slug,fixture.slug);assert.match(actual.title,/2-Year/);assert.equal(actual.semesterNumber,1);assert.match(actual.description,/75 theory and 25 practical/);
 const other={...fixture,slug:'11th-class'};assert.equal(additions.ditClassInformation(other),other);
 for(const c of before.classes||[])if(c.slug!=='dit-intermediate')assert.equal(JSON.stringify(catalog.INITIAL_CLASSES.find(x=>x.id===c.id)),JSON.stringify(c));
});
test('roadmap separates theory and practical modules without inventing completed resources',()=>{
 assert.deepEqual(syllabus.subjects.map(s=>s.modules.length),[7,5,8,6,9]);assert.equal(syllabus.subjects.reduce((n,s)=>n+s.modules.length,0),35);
 assert.equal(syllabus.subjects[2].modules[7],'Practical Portion');
 assert.equal(catalog.INITIAL_SUBJECTS.filter(s=>['dit-python','dit-operating-systems'].includes(s.slug)).length,2);
});
test('PDF and web guide use the same checked source and practice answers remain separate',async()=>{
 const sourceBytes=await fs.readFile('content/dit/ict-chapter-1.json');assert.equal(createHash('sha256').update(sourceBytes.toString('utf8').replace(/\r\n/g,'\n')).digest('hex'),pack.sourceSha256);
 const pdf=await fs.readFile('public/documents/dit/ict/ict-chapter-1-introduction-to-computers.pdf');assert.equal(pdf.subarray(0,5).toString(),'%PDF-');assert.equal(pdf.length,pack.pdfBytes);assert.equal(createHash('sha256').update(pdf).digest('hex'),pack.pdfSha256);
 const testSection=pack.content.split('## Chapter practice test')[1].split('## Practice test answer key')[0];
 assert.equal((testSection.match(/^### Q\d+\./gm)||[]).length,20);assert.ok(!testSection.includes('Correct answer:'));assert.ok(!/\*\*[A-D]\)/.test(testSection));
 assert.match(pack.content,/not verified past-paper questions/);assert.match(pack.content,/## Solved long questions/);assert.match(pack.content,/## Practical activities/);
 assert.ok(!catalog.INITIAL_NOTES.some(n=>n.id===additions.DIT_ICT_NOTE.id&&n.subjectSlug==='dit-computer-science'));
});
test('semester overview renders all five subjects and links only available chapter resources',async()=>{
 const {DitSemesterOverview}=await bundled('src/components/educational/DitSemesterOverview.tsx');
 const html=renderToStaticMarkup(React.createElement(DitSemesterOverview));
 assert.equal((html.match(/<summary/g)||[]).length,5);
 assert.match(html,/500 marks/);assert.match(html,/75 theory and 25 practical/);
 assert.match(html,/Introduction to ICT/);assert.match(html,/Operating Systems/);assert.match(html,/Introduction to Programming/);
 assert.match(html,/\/classes\/dit-intermediate\/dit-python\/notes\//);
 const snapshot=await bundled('src/data/academicResourceSnapshot.ts');
 const {buildDitStudySubjects}=await bundled('src/utils/dit-study.ts');
 const subjects=buildDitStudySubjects({chapters:snapshot.INITIAL_CHAPTERS,notes:snapshot.INITIAL_NOTES,mcqs:snapshot.INITIAL_MCQS,papers:snapshot.INITIAL_PAST_PAPERS});
 assert.ok(html.includes(`${subjects.reduce((n,s)=>n+s.available,0)} of 35 syllabus modules`));
 assert.match(html,/6 syllabus modules; 6 with material/);assert.match(html,/9 syllabus modules; 9 with material/);
 assert.match(html,/\/dit-ict\/notes\/dit-ict-chapter-1-introduction-to-computers\//);
 assert.match(html,/7 syllabus modules; 7 with material/);
 if(subjects[1].available===5&&subjects[2].available===8){
  assert.match(html,/5 syllabus modules; 5 with material/);assert.match(html,/8 syllabus modules; 8 with material/);
 }
});
