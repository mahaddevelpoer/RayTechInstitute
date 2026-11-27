import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {loadTypescript} from './load-typescript.mjs';
import {cloudflareHeaders} from './prepare-cloudflare-export.mjs';
const {mountPreferredSource,isPreferredSourcePage,PREFERRED_SOURCE_SCRIPT}=await loadTypescript('src/utils/preferred-source.ts');
const fixture=(path,robots='index, follow',extra='')=>new JSDOM(`<head>${robots===null?'':`<meta name="robots" content="${robots}">`}${extra}</head><body><main><h1>Educational resource</h1><p>Study content.</p></main></body>`,{url:'https://raytechinstitute.com'+path});
test('only indexable academic routes and article detail routes can mount the official widget',()=>{
 for(const path of ['/classes/','/classes/11th-class/computer-science/notes/test/','/courses/python/','/learn/python/values/','/smart-syllabus/11/computer-science/','/results-gazettes/','/past-papers/','/mcqs/','/quizzes/','/blogs/new-reviewed-education/']){
  const dom=fixture(path);assert.equal(mountPreferredSource(dom.window.document,path),true,path);const d=dom.window.document;
  assert.equal(d.querySelector('h1').nextElementSibling.getAttribute('google-add-preferred-source-btn'),'');assert.equal(d.querySelector('[google-add-preferred-source-btn]').getAttribute('data-lang'),'en');
  assert.equal(d.head.querySelector('script').src,PREFERRED_SOURCE_SCRIPT);assert.equal(d.head.querySelector('script').async,true);assert.equal(d.querySelector('[google-add-preferred-source-btn]').childElementCount,0,'No fake button or custom artwork');dom.window.close();
 }
});
test('homepage aliases, noindex/none, private/unrelated routes and missing metadata never render or load Google',()=>{
 for(const [path,robots,extra] of [['/','index, follow'],['/index.html','index, follow'],['/blogs/noor-ahmad-explained-learning-guide/','noindex, follow'],['/classes/','NOINDEX, FOLLOW'],['/classes/','none'],['/classes/',null],['/classes/','index','<meta name="googlebot" content="noindex">'],['/about/','index'],['/admin/login/','index'],['/privacy-policy/','index'],['/blogs/','index'],['/blogs/post/','index'],['/competition/','index']]){
  const dom=fixture(path,robots,extra);assert.equal(isPreferredSourcePage(dom.window.document,path),false,path);assert.equal(mountPreferredSource(dom.window.document,path),false);assert.equal(dom.window.document.querySelectorAll('script,[google-add-preferred-source-btn]').length,0);dom.window.close();
 }
});
test('repeated setup and existing containers cannot duplicate the widget or loader',()=>{
 const dom=fixture('/classes/');const d=dom.window.document;for(let n=0;n<5;n++)mountPreferredSource(d,'/classes/');assert.equal(d.querySelectorAll('[google-add-preferred-source-btn]').length,1);assert.equal(d.querySelectorAll('script').length,1);
 const clone=d.querySelector('[google-add-preferred-source-btn]').cloneNode();d.body.appendChild(clone);mountPreferredSource(d,'/classes/');assert.equal(d.querySelectorAll('[google-add-preferred-source-btn]').length,1);
 d.querySelector('meta').content='noindex, follow';mountPreferredSource(d,'/classes/');assert.equal(d.querySelectorAll('[google-add-preferred-source-btn]').length,0);dom.window.close();
});
test('existing SDK rescans a replacement page using its documented API and keeps one loader',()=>{
 const dom=fixture('/classes/');const d=dom.window.document;mountPreferredSource(d,'/classes/');let scanned=0;dom.window.PREFERRED_SOURCE={push:callback=>callback({init:()=>{scanned++;d.querySelector('[google-add-preferred-source-btn]').setAttribute('data-initialized','true');}})};
 d.querySelector('main').innerHTML='<h1>Next lesson</h1><p>Retained content</p>';mountPreferredSource(d,'/learn/python/next/');mountPreferredSource(d,'/learn/python/next/');assert.equal(scanned,1);assert.equal(d.querySelectorAll('script').length,1);assert.equal(d.querySelector('h1').nextElementSibling.hasAttribute('google-add-preferred-source-btn'),true);dom.window.close();
});
test('an eligible route without a main title does not load a misplaced widget',()=>{
 const dom=fixture('/classes/');dom.window.document.querySelector('h1').remove();assert.equal(mountPreferredSource(dom.window.document,'/classes/'),false);assert.equal(dom.window.document.querySelectorAll('script').length,0);dom.window.close();
});
test('deployment CSP allows the exact Google origin while preserving compiler sandbox isolation',async()=>{
 const config=JSON.parse(await fs.readFile('firebase.json','utf8'));const global=config.hosting.headers.filter(rule=>rule.source==='**').flatMap(rule=>rule.headers).find(h=>h.key==='Content-Security-Policy').value;
 for(const directive of ['script-src','connect-src','frame-src'])assert.ok(global.split(';').find(s=>s.trim().startsWith(directive+' ')).includes('https://news.google.com'));
 assert.ok(cloudflareHeaders(config).includes('https://news.google.com'));
 for(const rule of config.hosting.headers.filter(rule=>/learning-(?:dom|wasm)-frame/.test(rule.source)&&rule.headers.some(h=>h.key==='Content-Security-Policy')))assert.ok(!rule.headers.find(h=>h.key==='Content-Security-Policy').value.includes('news.google.com'));
});
