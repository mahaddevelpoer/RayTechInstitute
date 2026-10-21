import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { parseReviewedMdx, reviewedLessonCatalog } from './reviewed-mdx.mjs';
import { authoredFoundationTopics } from '../content/courses/catalog.mjs';
const topics = await authoredFoundationTopics();

test('all five actual reviewed MDX lessons provide predictions, traces and practice blocks', () => {
  for (const topic of topics) {
    const blocks = parseReviewedMdx(topic.content);
    assert.deepEqual(blocks.filter(b => b.type !== 'markdown').map(b => b.type), ['PredictOutput', 'CodeTrace', 'TryExample', 'Understand']);
    assert.ok(blocks.some(b => b.type === 'markdown' && b.content.includes('Expected')));
    assert.ok(blocks.find(b => b.type === 'CodeTrace').steps.length >= 3);
  }
});

test('reviewed parser rejects executable MDX and unsupported/nested JSX without executing it', () => {
  for (const content of [
    'import hidden from "secret"\n\n## Lesson', '{globalThis.compromised = true}', '<script />',
    '<TryExample {...props} />', '<TryExample title="x" code="x" task="x" onClick="bad" />',
    '> <TryExample title="x" code="x" task="x" />', 'inline <TryExample title="x" code="x" task="x" />',
    '<TryExample title="x" code="x" task="x">Nested</TryExample>',
  ]) assert.throws(() => parseReviewedMdx(content));
  assert.equal(globalThis.compromised, undefined);
});

test('invalid answer indices and duplicate choices fail at build time', () => {
  for (const [options, answer] of [['["same","same"]', '0'], ['["a","b"]', '9'], ['["a","b"]', ' ']]) {
    assert.throws(() => parseReviewedMdx(`<PredictOutput title="Test" code="print(1)" options='${options}' answer="${answer}" explanation="Reason" />`));
  }
});

test('private drafts, modified database text and unknown topics never enter the reviewed bundle', () => {
  assert.deepEqual(reviewedLessonCatalog(topics, topics), {});
  const published = topics.map(t => ({ ...t, state: 'published' }));
  assert.equal(Object.keys(reviewedLessonCatalog(topics, published)).length, 5);
  assert.deepEqual(reviewedLessonCatalog(topics, published.map(t => ({ ...t, content: `${t.content}\nUnreviewed change` }))), {});
  assert.deepEqual(reviewedLessonCatalog(topics, published.map(t => ({ ...t, id: `foreign-${t.id}` }))), {});
});

test('interactive prediction, trace boundaries and explicit practice loading work through React', async () => {
  const source = await fs.readFile('src/components/learning/InteractiveLesson.tsx', 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const require = createRequire(import.meta.url); const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require(name) {
    if (name === 'react' || name === 'react/jsx-runtime') return require(name);
    if (name.endsWith('/MarkdownRenderer')) return { MarkdownRenderer: ({ content }) => React.createElement('div', {}, content) };
    if (name === './UnderstandActivity') return { UnderstandActivity: () => null };
    throw new Error(`Unexpected dependency ${name}`);
  } });
  const dom = new JSDOM('<div id="root"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(document.getElementById('root')); const loaded = [];
  const click = async element => act(async () => element.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })));
  const button = label => [...document.querySelectorAll('button')].find(b => b.textContent === label);
  try {
    await act(async () => root.render(React.createElement(module.exports.InteractiveLesson, { blocks: parseReviewedMdx(topics[2].content), language: 'javascript', onTryCode: code => loaded.push(code) })));
    assert.equal(button('Check prediction').disabled, true); assert.equal(document.querySelector('[role="status"]'), null);
    await click(document.querySelectorAll('input[type="radio"]')[1]); await click(button('Check prediction'));
    assert.match(document.querySelector('[role="status"]').textContent, /Not quite/);
    await click(document.querySelectorAll('input[type="radio"]')[0]); await click(button('Check prediction'));
    assert.match(document.querySelector('[role="status"]').textContent, /Correct prediction/);
    await click(button('Try again')); assert.equal(document.querySelector('[role="status"]'), null);
    assert.equal(button('Previous step').disabled, true); await click(button('Next step'));
    assert.match(document.querySelector('[aria-current="step"]').textContent, /quantity/);
    await click(button('Restart trace')); assert.equal(button('Previous step').disabled, true);
    assert.deepEqual(loaded, []); await click(button('Open in Practice')); assert.equal(loaded.length, 1); assert.match(loaded[0], /console.log/);
    assert.equal(document.querySelector('script,iframe'), null);
  } finally { await act(async () => root.unmount()); dom.window.close(); globalThis.window = previous.window; globalThis.document = previous.document; globalThis.IS_REACT_ACT_ENVIRONMENT = previous.act; }
});
