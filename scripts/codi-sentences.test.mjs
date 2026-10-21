import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import { JSDOM } from 'jsdom';
import { loadTypescript } from './load-typescript.mjs';
const {codiSentences,codiSentencePlugin,codiAudioKeyMaterial}=await loadTypescript('src/lib/learning/codi-sentences.ts');
const {codiLineAt}=await loadTypescript('src/lib/learning/codi-line.ts');
test('sentence IDs follow punctuation, not visual wraps, domains or decimal points',()=>{
 assert.deepEqual(codiSentences('Use 3.14 as a value. Visit example.com for a guide. Next sentence!'),['Use 3.14 as a value.','Visit example.com for a guide.','Next sentence!']);
 assert.deepEqual(codiSentences('Use e.g. a variable. Try i.e. an example. Dr. Khan teaches here.'),['Use e.g. a variable.','Try i.e. an example.','Dr. Khan teaches here.']);
 assert.equal(codiAudioKeyMaterial(' A value.\n','ur'),codiAudioKeyMaterial('A value.','ur'));assert.notEqual(codiAudioKeyMaterial('A value.','en'),codiAudioKeyMaterial('A value.','ur'));
});
test('sentence click returns the whole unit and still ignores navigation links and ordinary buttons',()=>{
 const dom=new JSDOM('<article><p><button data-codi-text="A complete sentence that wraps across a small screen.">A complete <strong>sentence</strong> that wraps across a small screen.</button><a href="/courses/">Link</a><button>Try this example</button></p></article>');const prior={Element:globalThis.Element,document:globalThis.document};globalThis.Element=dom.window.Element;globalThis.document=dom.window.document;
 try{const root=document.querySelector('article');assert.equal(codiLineAt(root,root.querySelector('strong'),12),'A complete sentence that wraps across a small screen.');assert.equal(codiLineAt(root,root.querySelector('a'),12),null);assert.equal(codiLineAt(root,root.querySelectorAll('button')[1],12),null);}finally{Object.assign(globalThis,prior);dom.window.close();}
});
test('Markdown sentence buttons preserve emphasis and keep links outside buttons',()=>{
 const html=renderToStaticMarkup(React.createElement(ReactMarkdown,{rehypePlugins:[codiSentencePlugin]},'One **important** sentence. Another sentence.\n\nRead the [guide](/courses/) for more.\n\n- A list item. Next point.'));
 const dom=new JSDOM(html),doc=dom.window.document;
 assert.equal(doc.querySelector('p button').getAttribute('data-codi-text'),'One important sentence.');assert.equal(doc.querySelector('p button strong').textContent,'important');assert.equal(doc.querySelector('button a'),null);assert.equal(doc.querySelector('a').getAttribute('href'),'/courses/');
 assert.deepEqual([...doc.querySelectorAll('li button')].map(b=>b.textContent),['A list item.','Next point.']);assert.equal(doc.querySelector('button button'),null);dom.window.close();
 const codeHtml=renderToStaticMarkup(React.createElement(ReactMarkdown,{rehypePlugins:[codiSentencePlugin]},'Use `print("Hi. There")` safely. Next sentence.'));const codeDom=new JSDOM(codeHtml);assert.equal(codeDom.window.document.querySelectorAll('button').length,2);assert.equal(codeDom.window.document.querySelector('button').textContent,'Use print("Hi. There") safely.');codeDom.window.close();
});
