import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import config from '../next.config.mjs';
import {staticDocumentRedirects,matchDocumentRedirect} from './static-document-redirects.mjs';
const require=createRequire(import.meta.url);
const compiled=await build({entryPoints:['src/components/StaticLink.tsx'],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],logLevel:'silent'});
const module={exports:{}};vm.runInNewContext(compiled.outputFiles[0].text,{module,exports:module.exports,require,URLSearchParams});
const Link=module.exports.default;
test('the production compiler resolves next/link to native static-document links',()=>{
 const actual=config.webpack({resolve:{alias:{existing:'kept'}}});assert.equal(actual.resolve.alias.existing,'kept');assert.ok(actual.resolve.alias['next/link$'].replaceAll('\\','/').endsWith('/src/components/StaticLink.tsx'));
});
test('native links preserve query/hash, browser controls, accessibility and ordinary click handlers',()=>{
 const click=()=>{};
 const element=Link.render({href:'/classes/11th-class/computer-science/notes/?chapter=5#guide',prefetch:false,className:'chapter-link',onClick:click,target:'_blank',rel:'noopener','aria-label':'Open chapter 5',children:'Read notes'},null);
 assert.equal(element.type,'a');assert.equal(element.props.onClick,click);assert.ok(!('prefetch' in element.props));assert.ok(!('onNavigate' in element.props));
 const doc=new JSDOM(renderToStaticMarkup(element)).window.document,a=doc.querySelector('a');
 assert.equal(a.getAttribute('href'),'/classes/11th-class/computer-science/notes/?chapter=5#guide');assert.equal(a.target,'_blank');assert.equal(a.getAttribute('aria-label'),'Open chapter 5');
 const object=renderToStaticMarkup(React.createElement(Link,{href:{pathname:'/classes/',query:{q:'computer science',chapter:5},hash:'topics'},children:'Search'}));
 const href=new JSDOM(object).window.document.querySelector('a').getAttribute('href');assert.equal(new URL(href,'https://site.test').searchParams.get('q'),'computer science');assert.ok(href.endsWith('#topics'));
});
test('payload recovery covers exactly exported documents and preserves chapter/search parameters',()=>{
 const existing='/old/ /new/ 301\n';
 const text=staticDocumentRedirects(['index.txt','classes/11th-class/computer-science/notes/index.txt','classes/11th-class/computer-science/notes/index.html','robots.txt','licenses/PYTHON.txt'],existing);
 assert.ok(text.startsWith(existing));assert.equal(staticDocumentRedirects(['index.txt','classes/11th-class/computer-science/notes/index.txt'],text),text);
 assert.deepEqual(matchDocumentRedirect('/classes/11th-class/computer-science/notes/index.txt','?chapter=5&q=a%20b',text),{location:'/classes/11th-class/computer-science/notes/?chapter=5&q=a%20b',status:302});
 assert.deepEqual(matchDocumentRedirect('/index.txt','?source=old',text),{location:'/?source=old',status:302});
 for(const path of ['/missing/index.txt','/robots.txt','/licenses/PYTHON.txt','/documents/class11/computer-2027/chapter-5.pdf'])assert.equal(matchDocumentRedirect(path,'',text),undefined);
 assert.throws(()=>staticDocumentRedirects(['../index.txt']),/Invalid/);assert.throws(()=>staticDocumentRedirects(['index.txt'],'/index.txt https://other.test/ 301'),/Conflicting/);
});
test('framework-only link props never leak into the exported anchor',async()=>{
 const html=renderToStaticMarkup(React.createElement(Link,{href:'/notes/',prefetch:true,replace:true,scroll:false,shallow:true,passHref:true,locale:false,legacyBehavior:false,onNavigate:()=>{},children:'Notes'}));
 assert.equal(html,'<a href="/notes/">Notes</a>');
 const source=await fs.readFile('src/components/StaticLink.tsx','utf8');assert.ok(!/preventDefault|setTimeout|useRouter|router\.push/.test(source));
});
