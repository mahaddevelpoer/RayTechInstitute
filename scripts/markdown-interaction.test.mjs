import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { JSDOM } from 'jsdom';
import { loadTypescript } from './load-typescript.mjs';
const codiSentences=await loadTypescript('src/lib/learning/codi-sentences.ts');
const teaching=await loadTypescript('src/lib/learning/lesson-teaching.ts');
const require = createRequire(import.meta.url);
const source = await fs.readFile('src/components/MarkdownRenderer.tsx', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
const module = { exports: {} };
vm.runInNewContext(code, { module, exports: module.exports, require(name) {
  if (name === 'react' || name === 'react/jsx-runtime') return require(name);
  if (name === 'react-markdown') return { __esModule: true, default: ReactMarkdown };
  if (name === 'remark-gfm') return { __esModule: true, default: remarkGfm };
  if (name.endsWith('/editorial')) return { articleSections: () => [] };
  if (name.endsWith('/security')) return { sanitizeUrl: value => value || '' };
  if (name.endsWith('/codi-sentences')) return codiSentences;
  if (name.endsWith('/lesson-teaching')) return teaching;
  throw new Error(`Unexpected dependency ${name}`);
} });

test('lessons gain meaningful teaching blocks without rewriting text, audio identities or blog presentation',()=>{
 const content='## Bind a name\nA **variable** refers to a value. Change it deliberately.\n\n## Worked example\n```python\nx = 3\nprint(x)\n```\n\n## Common mistake\nDo not confuse assignment with comparison.\n\n## Your turn\nChange the value.\n\n## Review\nExplain what changed.\n\n> A name is not the value itself.';
 const render=props=>new JSDOM(renderToStaticMarkup(React.createElement(module.exports.MarkdownRenderer,{content,narration:true,...props})));
 const plain=render({}),lesson=render({teaching:true,practiceLanguage:'python',onTryCode:()=>{}});
 const doc=lesson.window.document;
 assert.deepEqual([...doc.querySelectorAll('[data-teaching-kind]')].map(e=>e.dataset.teachingKind),['concept','example','caution','practice','review']);
 const ids=dom=>[...dom.window.document.querySelectorAll('[data-codi-text]')].map(e=>e.dataset.codiText);
 assert.deepEqual(ids(lesson),ids(plain),'saved speech keys stay exactly the same');
 assert.equal(plain.window.document.querySelector('.lesson-teaching-section'),null,'articles do not acquire learning blocks');
 assert.match(doc.querySelector('.lesson-example-label').textContent,/PYTHON example/);
 assert.equal(doc.querySelector('.lesson-note-label').textContent,'Keep in mind');
 assert.equal(doc.querySelectorAll('h1').length,0);assert.equal(doc.querySelector('pre code').textContent,'x = 3\nprint(x)');
 plain.window.close();lesson.window.close();
});

test('Markdown reveals safe hints and loads matching examples only after an explicit click', async () => {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'https://local.test' });
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(document.getElementById('root')); const copied = [];
  const content = '## Practice\n```python\nprint(42)\n```\n```javascript\nconsole.log(42)\n```\n```hint\n<img src=x onerror=alert(1) alt="blocked" width="1" height="1"> Read the example.\n```\n```solution\nUse the named variable.\n```\n<script>alert(1)</script>';
  try {
    await act(async () => root.render(React.createElement(module.exports.MarkdownRenderer, { content, practiceLanguage: 'python', onTryCode: code => copied.push(code) })));
    const buttons = [...document.querySelectorAll('button')];
    assert.equal(buttons.length, 1); assert.equal(buttons[0].textContent, 'Try this example'); assert.deepEqual(copied, []);
    assert.equal(document.querySelectorAll('details').length, 2); assert.equal(document.querySelectorAll('script,img,iframe').length, 0);
    assert.match(document.body.textContent, /onerror=alert\(1\)/);
    await act(async () => buttons[0].dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })));
    assert.deepEqual(copied, ['print(42)']);
    await act(async () => root.render(React.createElement(module.exports.MarkdownRenderer, { content })));
    assert.equal(document.querySelectorAll('button').length, 0, 'ordinary articles/admin previews do not run lesson code');
  } finally { await act(async () => root.unmount()); dom.window.close(); globalThis.window = previous.window; globalThis.document = previous.document; globalThis.IS_REACT_ACT_ENVIRONMENT = previous.act; }
});
