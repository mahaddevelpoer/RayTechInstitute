import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { JSDOM } from 'jsdom';
import { loadTypescript } from './load-typescript.mjs';
const codiSentences=await loadTypescript('src/lib/learning/codi-sentences.ts');
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
  throw new Error(`Unexpected dependency ${name}`);
} });

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
