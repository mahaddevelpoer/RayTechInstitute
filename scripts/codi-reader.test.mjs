import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { loadTypescript } from './load-typescript.mjs';
const line = await loadTypescript('src/lib/learning/codi-line.ts');
const tutor = await loadTypescript('src/lib/learning/codi-tutor.ts');

test('Codi direct inline reading, consent, stale responses, Stop, Hindi and cleanup', async () => {
  const dom = new JSDOM('<article id="lesson"><div class="codi-slot" data-codi-slot data-codi-ignore></div><p id="first">A variable stores a value.</p><p id="second">A new line.</p><pre id="code"><code>&lt;h1 class="my_title"&gt;Hello&lt;/h1&gt;</code></pre><a href="#">Link</a></article><aside id="compiler"></aside><div id="root"></div>',{url:'https://test.invalid/'});
  const names = ['window','document','Element','Node','NodeFilter','IS_REACT_ACT_ENVIRONMENT'];
  const previous = Object.fromEntries(names.map(k => [k, globalThis[k]]));
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, Element: dom.window.Element, Node: dom.window.Node, NodeFilter: dom.window.NodeFilter, IS_REACT_ACT_ENVIRONMENT: true });
  const spoken=[];
  dom.window.matchMedia = () => ({ matches: true }); dom.window.speechSynthesis = { cancel() {}, speak(u) { spoken.push(u); u.onstart?.(); } };
  const reads = [], players = [], urls = new Set();
  const cloud = {
    codiCloudReading: (text, language, signal) => new Promise((resolve,reject) => reads.push({text,language,signal,resolve,reject})),
    codiCloudExplain: async () => {},
  };
  class Audio {
    constructor() { players.push(this); this.block = true; }
    async play() { if (this.block) throw new Error('tap required'); this.onplay?.(); }
    pause() { this.paused = true; }
  }
  const require = createRequire(import.meta.url); const module = { exports: {} };
  const js = ts.transpileModule(await fs.readFile('src/components/learning/CodiReader.tsx','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  vm.runInNewContext(js, { module, exports: module.exports, Audio, Blob, AbortController, SpeechSynthesisUtterance: class {constructor(text){this.text=text;}}, crypto: { randomUUID }, ResizeObserver: class { observe(){} disconnect(){} }, URL: { createObjectURL() {const u='blob:'+randomUUID();urls.add(u);return u;}, revokeObjectURL(u){urls.delete(u);} }, window, document, Element, Node, NodeFilter,
    require: id => id==='next/dynamic' ? ()=>()=>React.createElement('span',null,'Robot') : id==='@/lib/learning/codi-line' ? line : id==='@/lib/learning/codi-tutor' ? tutor : id==='@/lib/learning/codi-cloud' ? cloud : require(id),
  });
  const root = createRoot(document.getElementById('root'));
  const button = text => [...document.querySelectorAll('button')].find(e => e.textContent.includes(text));
  const click = async e => act(async()=>e.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));
  const status = ()=>document.querySelector('[role="status"]')?.textContent;
  const props = { content:{current:document.getElementById('lesson')}, compiler:{current:document.getElementById('compiler')}, fullText:'A variable stores a value. '.repeat(40)+'Final paragraph.' };
  props.content.current.getBoundingClientRect=()=>({left:200,right:800,top:80,bottom:800,width:600,height:720});
  props.compiler.current.getBoundingClientRect=()=>({left:800,right:1200,top:80,bottom:800,width:400,height:720});
  const pointer=async(element,type,x,y,id=1)=>act(async()=>{const e=new dom.window.Event(type,{bubbles:true,cancelable:true});Object.defineProperties(e,{clientX:{value:x},clientY:{value:y},pointerId:{value:id},button:{value:0},isPrimary:{value:true},pointerType:{value:'touch'}});element.dispatchEvent(e);});
  try {
    await act(async()=>root.render(React.createElement(module.exports.CodiReader, props)));
    assert.equal(document.querySelector('[aria-label="Codi settings"][role="dialog"]'), null, 'settings hidden initially');
    assert.equal(document.querySelector('.codi-reader').parentElement, document.body, 'same-page body portal escapes editor clipping');
    await click(document.querySelector('.codi-settings-toggle'));
    assert.ok(document.querySelector('[aria-label="Codi settings"][role="dialog"]'));
    assert.equal(document.querySelector('#lesson .codi-reader'), null, 'no inline reserved space');
    await act(async()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
    assert.equal(document.querySelector('.codi-settings'),null);assert.equal(document.activeElement,document.querySelector('.codi-settings-toggle'));
    const robot=document.querySelector('.codi-robot-button'),carrier=document.querySelector('.codi-carrier');
    carrier.getBoundingClientRect=()=>{const m=carrier.style.transform.match(/translate3d\(([-.\d]+)px,([-.\d]+)px/);return {left:Number(m?.[1]||0),top:Number(m?.[2]||0),width:104,height:152};};
    const initial=carrier.style.transform;
    await pointer(robot,'pointerdown',700,150);await pointer(robot,'pointermove',350,300);await pointer(robot,'pointerup',350,300);await click(robot);
    assert.equal(reads.length,0,'drag never triggers whole-lesson reading');assert.equal(carrier.dataset.dock,'free');assert.notEqual(carrier.style.transform,initial);
    const dragged=carrier.style.transform;
    await click(document.getElementById('first')); assert.equal(reads.length,0); assert.match(status(),/Allow Gemini/);
    assert.equal(carrier.style.transform,dragged,'reading does not reset a user placement');
    await pointer(document.body,'pointerdown',10,10);assert.equal(document.querySelector('.codi-settings'),null,'outside click closes settings');
    await click(document.querySelector('.codi-settings-toggle'));
    await click(document.querySelector('input[type=checkbox]'));
    assert.equal(reads.length,1,'allowing consent automatically resumes the originally clicked line');
    assert.equal(reads[0].text,'A variable stores a value.');
    await click(document.getElementById('second')); assert.ok(reads[0].signal.aborted); assert.equal(reads.length,2);
    await act(async()=>reads[0].resolve(new Blob(['old']))); assert.equal(players.length,0,'stale response ignored');
    await act(async()=>reads[1].resolve(new Blob(['new']))); assert.ok(button('Play audio'));
    players[0].block=false; await click(button('Play audio')); assert.match(status(),/Reading the lesson/);
    await click(button('Stop')); assert.ok(players[0].paused); assert.equal(urls.size,0);
    const select=[...document.querySelectorAll('select')][1];
    await act(async()=>{select.value='hi';select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
    await click(document.getElementById('first')); assert.equal(reads.at(-1).language,'hi');
    await click(button('Stop')); assert.ok(reads.at(-1).signal.aborted);
    await click(document.querySelector('[aria-label="Codi: read the entire lesson"]'));
    await act(async()=>reads.at(-1).resolve(new Blob(['part'])));
    players.at(-1).block=false; await click(button('Play audio'));
    const before=reads.length; await act(async()=>players.at(-1).onended()); assert.equal(reads.length,before+1,'whole lesson advances to next chunk');
    const animations=[];dom.window.matchMedia=()=>({matches:false});carrier.animate=(frames,options)=>{const animation={cancel(){},frames,options};animations.push(animation);return animation;};
    await act(async()=>root.render(React.createElement(module.exports.CodiReader,{...props,runSignal:1})));
    assert.equal(document.querySelector('.codi-carrier').dataset.dock,'compiler');
    assert.ok(animations.length>0,'Run still triggers the flight after dragging');assert.equal(carrier.dataset.flying,'true');
    await act(async()=>animations.at(-1).onfinish());assert.equal(carrier.dataset.flying,'false');
    await act(async()=>robot.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true,cancelable:true})));
    assert.equal(carrier.dataset.dock,'free','keyboard repositioning needs no drag buttons');
    await pointer(robot,'pointerdown',50,50,2);await pointer(robot,'pointermove',-5000,-5000,2);await pointer(robot,'pointercancel',-5000,-5000,2);
    assert.match(carrier.style.transform,/translate3d\(0px,0px,0\)/,'cancelled touch drag stays in viewport');
    assert.equal(carrier.hasAttribute('data-dragging'),false);
    await click(document.getElementById('code'));assert.equal(reads.at(-1).text,'<h1 class="my_title">Hello</h1>','visible HTML and underscores are not stripped');
    const beforeRemount=reads.length;
    await act(async()=>root.render(React.createElement(module.exports.CodiReader,{...props,key:'new-lesson'})));
    assert.ok(reads.at(-1).signal.aborted);assert.equal(reads.length,beforeRemount,'restoring consent does not start speech by itself');
    await click(document.getElementById('first'));assert.equal(reads.length,beforeRemount+1,'consent survives a lesson remount in the same tab');
    await act(async()=>reads.at(-1).reject(new Error('Gemini free quota reached')));
    assert.equal(spoken.at(-1).text,'A variable stores a value.');assert.match(status(),/Gemini is unavailable.*Reading with device voice/);
    const quotaRequests=reads.length;await click(document.getElementById('code'));
    assert.equal(reads.length,quotaRequests,'brief circuit breaker avoids repeatedly hitting an exhausted provider');assert.equal(spoken.at(-1).text,'<h1 class="my_title">Hello</h1>');
    await click(document.querySelector('.codi-settings-toggle'));if(!document.querySelector('.codi-settings'))await click(document.querySelector('.codi-settings-toggle'));
    const fallback=[...document.querySelectorAll('label')].find(e=>e.textContent.includes('Use device voice')).querySelector('input');await click(fallback);
    await click(document.getElementById('first'));await act(async()=>reads.at(-1).reject(new Error('Gemini free quota reached')));
    assert.equal(spoken.length,2,'disabled fallback never substitutes the selected engine');assert.match(status(),/Speech is unavailable/);
    await act(async()=>root.unmount()); assert.ok(reads.at(-1).signal.aborted); assert.equal(urls.size,0);
    assert.equal(document.querySelector('.codi-reader'),null);
  } finally { if(document.getElementById('root')?.childNodes.length) await act(async()=>root.unmount()); Object.assign(globalThis,previous);dom.window.close(); }
});
