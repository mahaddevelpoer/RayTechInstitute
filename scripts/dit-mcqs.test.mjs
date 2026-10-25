import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
const bank=JSON.parse(await fs.readFile('content/imports/dit-computer-networks-chapter-1.json','utf8'));
const keys=['CABBCCBABC','DDDBDCBDBC','ABBBCBDDAB','CBB CDBDBCC'.replaceAll(' ',''),'BDDDBCACCA','ABADDC DABC'.replaceAll(' ',''),'DCDABBACAC','AAAACBDD AA'.replaceAll(' ','')];
const require=createRequire(import.meta.url);
function component(file,mocks={}){const module={exports:{}};const code=ts.transpileModule(file,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;vm.runInNewContext(code,{module,exports:module.exports,require:id=>id in mocks?mocks[id]:require(id)});return module.exports;}
const {BilingualText}=component(await fs.readFile('src/components/educational/BilingualText.tsx','utf8'));

test('all 80 bilingual source questions preserve the independently checked answer key',()=>{
 assert.equal(bank.questions.length,80);assert.equal(bank.chapterNumber,1);assert.equal(bank.chapterTitle,'Basic Terminologies');
 assert.equal(bank.classSlug,'dit-intermediate');assert.equal(bank.subjectSlug,'dit-computer-science');
 assert.equal(new Set(bank.questions.map(q=>q.id)).size,80);assert.equal(new Set(bank.questions.map(q=>q.question)).size,80);
 assert.match(bank.sourceSha256,/^[a-f0-9]{64}$/);assert.equal(new Set(bank.questions.map(q=>q.topic)).size,8);
 bank.questions.forEach((q,index)=>{assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.correctIndex,keys[Math.floor(index/10)].charCodeAt(index%10)-65,`source answer ${index+1}`);for(const text of [q.question,...q.options,q.explanation]){assert.match(text,/\n/);assert.match(text,/[\u0600-\u06ff]/);assert.match(text,/[A-Za-z]/);}});
});
test('bilingual text isolates directions and escapes user-controlled markup',()=>{
 const html=renderToStaticMarkup(React.createElement(BilingualText,{text:'English question\nاردو سوال'}));assert.match(html,/lang="en" dir="ltr"/);assert.match(html,/lang="ur" dir="rtl"/);
 const unsafe=renderToStaticMarkup(React.createElement(BilingualText,{text:'<script>alert(1)</script>'}));assert.ok(!unsafe.includes('<script>'));
});
test('the full chapter quiz keeps answers hidden, allows Previous and scores shuffled bilingual options correctly',async()=>{
 const dom=new JSDOM('<div id="root"></div>',{url:'https://site.test/classes/dit-intermediate/dit-computer-science/mcqs/'});
 const old=Object.fromEntries(['window','document','IS_REACT_ACT_ENVIRONMENT'].map(k=>[k,globalThis[k]]));Object.assign(globalThis,{window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true});
 const rows=bank.questions.map(q=>({...q,classSlug:bank.classSlug,subjectSlug:bank.subjectSlug,chapterNumber:1}));const original=JSON.stringify(rows);
 const {MCQClientView}=component(await fs.readFile('src/components/educational/MCQClientView.tsx','utf8'),{
  'next/link':{default:({children,...p})=>React.createElement('a',p,children)},'./BilingualText':{BilingualText},
  '@/data/educationalStore':{EducationalStore:{getMCQs:(c,s)=>{assert.equal(c,bank.classSlug);assert.equal(s,bank.subjectSlug);return rows;}},INITIAL_CLASSES:[{slug:bank.classSlug,title:'D.I.T'}],INITIAL_SUBJECTS:[{classSlug:bank.classSlug,slug:bank.subjectSlug,title:'Computer Science'}],INITIAL_CHAPTERS:[{id:'chapter-1',classSlug:bank.classSlug,subjectSlug:bank.subjectSlug,chapterNumber:1,title:bank.chapterTitle,isActive:true}]}
 });
 const root=createRoot(document.getElementById('root'));const click=async node=>act(async()=>node.click());
 const button=label=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===label);
 const question=()=>document.querySelector('h2 .bilingual-line[lang="en"]')?.textContent;
 const chooseCorrect=async()=>{const q=rows.find(q=>q.question.split('\n')[0]===question());assert.ok(q);const target=[...document.querySelectorAll('button[aria-pressed]')].find(b=>b.querySelector('[lang="en"]')?.textContent===q.options[q.correctIndex].split('\n')[0]);await click(target);};
 try{
  await act(async()=>root.render(React.createElement(MCQClientView,{classSlug:bank.classSlug,subjectSlug:bank.subjectSlug})));
  await click([...document.querySelectorAll('button')].find(b=>b.textContent.includes('Chapter 1: Basic Terminologies')));
  assert.equal(document.querySelectorAll('button[aria-pressed]').length,4);assert.equal(document.querySelectorAll('h2 .bilingual-line[lang="ur"][dir="rtl"]').length,1);
  assert.ok(!document.body.textContent.includes('Correct answer:'));
  const first=question();await chooseCorrect();await click(button('Next'));await chooseCorrect();await click(button('Previous'));assert.equal(question(),first);assert.equal(document.querySelectorAll('button[aria-pressed="true"]').length,1);await click(button('Next'));
  for(let i=1;i<80;i++){assert.ok(!document.body.textContent.includes('Correct answer:'));await chooseCorrect();await click(button(i===79?'View Result':'Next'));}
  assert.match(document.body.textContent,/Your score:\s*80\s*\/\s*80/);assert.ok(document.body.textContent.includes('Correct answer:'));assert.equal(JSON.stringify(rows),original);
 }finally{await act(async()=>root.unmount());Object.assign(globalThis,old);dom.window.close();}
});
