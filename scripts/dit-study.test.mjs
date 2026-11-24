import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {questionFingerprint} from './dit-bank-integrity.mjs';
const require=createRequire(import.meta.url);
const result=await build({stdin:{contents:`export * from './src/data/academicResourceSnapshot'; export * from './src/utils/dit-study'; export * from './src/components/educational/DitSemesterOverview';`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react-dom','react/jsx-runtime'],plugins:[{name:'link',setup(b){b.onResolve({filter:/^next\/link$/},()=>({path:'link',namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},()=>({loader:'jsx',contents:'import React from "react"; export default function Link({prefetch,children,...props}) {return <a {...props}>{children}</a>}'}));}}]});
const module={exports:{}};vm.runInNewContext(result.outputFiles[0].text,{module,exports:module.exports,require,console,URL});
const c=module.exports;
const input={chapters:c.INITIAL_CHAPTERS,notes:c.INITIAL_NOTES,mcqs:c.INITIAL_MCQS,papers:c.INITIAL_PAST_PAPERS};
const subjects=c.buildDitStudySubjects(input);
const banks=JSON.parse(await fs.readFile('content/dit/study-banks.generated.json','utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

test('DIT book positions resolve to the correct stored resources without crossing books',()=>{
 assert.deepEqual(Array.from(subjects,s=>s.available),[7,5,8,6,9]);
 assert.deepEqual(Array.from(subjects,s=>s.mcqCount),[488,490,740,132,188]);
 const office=subjects.find(s=>s.id==='ms-office');
 const word=office.modules[1];
 assert.equal(word.chapter.chapterNumber,3);
 assert.match(word.practiceHref,/chapter=3$/);
 assert.match(word.notes[0].href,/note-1793115340417/);
 assert.equal(office.modules[2].chapter.chapterNumber,11);
 const networking=subjects.find(s=>s.id==='computer-networks');
 assert.equal(networking.modules[5].chapter.chapterNumber,9);
 assert.equal(networking.modules[7].available,true);assert.equal(networking.modules[7].chapter.chapterNumber,13);
 assert.equal(subjects.filter(s=>s.available===0).some(s=>s.modules.some(m=>m.practiceHref||m.notes.length)),false);
});

test('inactive chapters, cross-class questions and unsafe document URLs cannot create study links',()=>{
 const chapter={id:'test',classSlug:'dit-intermediate',subjectSlug:'dit-ict',chapterNumber:1,title:'Computers',isActive:false};
 const note={id:'bad',classSlug:chapter.classSlug,subjectSlug:chapter.subjectSlug,chapterNumber:1,title:'Notes',pdfUrl:'javascript:alert(1)'};
 const inactive=c.buildDitStudySubjects({chapters:[chapter],notes:[note],mcqs:[],papers:[]});
 assert.equal(inactive[0].available,0);
 const active=c.buildDitStudySubjects({chapters:[{...chapter,isActive:true}],notes:[note],mcqs:[{...note,classSlug:'another-class'}],papers:[]});
 assert.equal(active[0].modules[0].notes[0].pdf,'');
 assert.equal(active[0].mcqCount,0);
});

test('download banks match every current published question and PDF bytes',async()=>{
 for(const bank of banks){
  const subject=subjects.find(s=>s.id===bank.id);
  const questions=subject.modules.flatMap(m=>m.mcqs);
  assert.equal(bank.questions,questions.length);
  assert.equal(bank.questionSha256,questionFingerprint(questions),'Catalog changed: rebuild and review the MCQ bank');
  const bytes=await fs.readFile('public'+bank.url);
  assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
  assert.equal(bank.sha256,hash(bytes));assert.equal(bank.bytes,bytes.length);
  assert.ok(bank.pages>0);
 }
 assert.equal(banks.reduce((n,b)=>n+b.questions,0),2038);
});

test('bank fingerprints detect answer changes but ignore unprinted metadata and property order',()=>{
 const original={id:'q',classSlug:'dit-intermediate',subjectSlug:'dit-ict',chapterNumber:1,question:'Which value?',options:['A','B','C','D'],correctIndex:1,explanation:'B is correct.'};
 const reordered=Object.fromEntries(Object.entries({...original,createdAt:'another-date'}).reverse());
 assert.equal(questionFingerprint([original]),questionFingerprint([reordered]));
 assert.notEqual(questionFingerprint([original]),questionFingerprint([{...original,correctIndex:0}]));
 assert.notEqual(questionFingerprint([original]),questionFingerprint([{...original,options:['B','A','C','D']}]));
});

test('hub exposes the full available chapter journey and all PDF downloads in server HTML',async()=>{
 const doc=new JSDOM(renderToStaticMarkup(React.createElement(c.DitSemesterOverview))).window.document;
 assert.equal(doc.querySelectorAll('details').length,5);
 assert.equal(doc.querySelectorAll('details[open]').length,5);
 assert.equal(doc.querySelectorAll('a[download][href*="mcq-banks"]').length,5);
 assert.equal(doc.querySelectorAll('a[download][href*="/books/"]').length,5);
 assert.equal(doc.querySelectorAll('a[data-dit-note]').length,36);
 assert.equal(doc.querySelectorAll('a[aria-label^="Practise "]').length,35);
 assert.match(doc.body.textContent,/35 of 35 syllabus modules/);
 for(const a of doc.querySelectorAll('nav a'))assert.ok(doc.querySelector(a.getAttribute('href')));
 for(const a of doc.querySelectorAll('a[href^="/documents/"]'))await fs.access('public'+a.getAttribute('href'));
 assert.equal(doc.querySelectorAll('a[data-dit-note][href*="dit-python/"]').length,9);
 assert.equal(doc.querySelectorAll('a[data-dit-note][href*="dit-operating-systems/"]').length,6);
 assert.equal(doc.querySelectorAll('script[type="application/ld+json"]').length,0);
});
