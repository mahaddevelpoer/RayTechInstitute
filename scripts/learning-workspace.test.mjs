import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';

test('independent panel toggles retain compiler state and examples reopen the compiler',async()=>{
 const dom=new JSDOM('<div id="root"></div>',{url:'https://site.test'});
 const keys=['window','document','IS_REACT_ACT_ENVIRONMENT'];const old=keys.map(k=>[k,globalThis[k]]);
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true});
 const require=createRequire(import.meta.url);let mounts=0,unmounts=0;
 const state={code:{}};const dispatch=()=>{};
 function Practice(){const [value,setValue]=React.useState('original');React.useEffect(()=>{mounts++;return()=>{unmounts++;};},[]);return React.createElement('input',{'aria-label':'Test editor',value,onInput:e=>setValue(e.target.value)});}
 const stub=()=>null;
 const mocks={
  'next/link':{__esModule:true,default:({children,...props})=>React.createElement('a',props,children)},
  '@/components/Header':{Header:stub},
  '@/components/MarkdownRenderer':{MarkdownRenderer:({onTryCode})=>React.createElement('button',{onClick:()=>onTryCode('example')},'Try example')},
  '@/components/AdReservation':{AdReservation:stub},
  './InteractiveLesson':{InteractiveLesson:stub},'./CodiReader':{CodiReader:stub},'./CodiSentences':{CodiSentences:({text})=>text},
  './BrowserPractice':{BrowserPractice:Practice},'./TopicQuiz':{TopicQuiz:stub},'./TopicAssignment':{TopicAssignment:stub},'./TopicProgressPanel':{TopicProgressPanel:stub},'./LessonVideo':{LessonVideo:stub},
  './LearningSession':{useLearningSession:()=>({state,dispatch})},'@/lib/learning/quiz':{topicProgressKey:()=> 'key'},
 };
 const code=ts.transpileModule(await fs.readFile('src/components/learning/LearningWorkspace.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,require:id=>mocks[id]||require(id),requestAnimationFrame:fn=>fn(),process:{env:{NEXT_PUBLIC_CODI_ENABLED:'false'}},window:dom.window});
 const root=createRoot(document.getElementById('root'));
 const click=async text=>{const b=[...document.querySelector('.learning-desktop-controls').querySelectorAll('button')].find(b=>b.textContent===text);assert.ok(b,text);await act(async()=>b.click());};
 try{
  await act(async()=>root.render(React.createElement(module.exports.LearningWorkspace,{language:{slug:'python',title:'Python',runtime:'python'},topic:{id:'t',version:1,title:'Names',summary:'Learn names.',content:'Text',objectives:[],videoIds:[],starterCode:'original',slug:'names'},topics:[{id:'t',slug:'names',title:'Names',order:1}]})));
  const editor=document.querySelector('input');await act(async()=>{editor.value='keep this code';editor.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
  await click('Hide topics');assert.equal(document.querySelector('main').dataset.topicsOpen,'false');
  await click('Hide compiler');assert.equal(document.querySelector('main').dataset.practiceOpen,'false');
  assert.equal(document.querySelector('[aria-controls="learning-practice-panel"]').getAttribute('aria-expanded'),'false');
  await click('Show topics');assert.equal(document.querySelector('main').dataset.topicsOpen,'true');
  await click('Show compiler');assert.equal(document.querySelector('input'),editor);assert.equal(editor.value,'keep this code');assert.equal(mounts,1);assert.equal(unmounts,0);
  await click('Hide compiler');await act(async()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Try example').click());
  assert.equal(document.querySelector('main').dataset.practiceOpen,'true');assert.equal(document.querySelector('main').dataset.mobilePanel,'practice');assert.equal(mounts,1);
 }finally{await act(async()=>root.unmount());dom.window.close();for(const[k,v]of old)if(v===undefined)delete globalThis[k];else globalThis[k]=v;}
});
