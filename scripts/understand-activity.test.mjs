import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { understandActivities, understandMdx } from '../content/courses/understand.mjs';
import { parseReviewedMdx } from './reviewed-mdx.mjs';

const require = createRequire(import.meta.url);
const source = await fs.readFile('src/components/learning/UnderstandActivity.tsx', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
const module = { exports: {} };
vm.runInNewContext(compiled, { module, exports: module.exports, require(name) {
  if (name === 'react' || name === 'react/jsx-runtime') return require(name);
  if (name === 'lucide-react') return Object.fromEntries(['Info', 'Check', 'RotateCcw', 'ArrowRight'].map(name => [name, () => null]));
  if (name === './PythonVariableLab') return { PythonVariableLab: () => null };
  if (name === './CodiSentences') return { CodiSentences: ({text})=>text, CodiCodeLines: ({code})=>code };
  throw new Error(name);
} });

test('all five language activities round-trip literal MDX and require multiple checks per part', () => {
  for (const language of ['python', 'html', 'css', 'javascript', 'php']) {
    const [block] = parseReviewedMdx(understandMdx(language));
    assert.deepEqual(block, { type: 'Understand', ...understandActivities[language] });
    assert.equal(block.stages.length, 3);
    assert.ok(block.stages.every(stage => stage.slots.length >= 2));
  }
});

test('guided data rejects bad stage structures, answers and executable attributes', () => {
  const data = structuredClone(understandActivities.python);
  const mdx = stages => `<Understand title="Python" stages='${JSON.stringify(stages)}' />`;
  assert.throws(() => parseReviewedMdx(mdx([])));
  data.stages[0].slots[0].answer = 99; assert.throws(() => parseReviewedMdx(mdx(data.stages)));
  data.stages[0].slots[0].answer = 0; data.stages[0].execute = 'bad'; assert.throws(() => parseReviewedMdx(mdx(data.stages)));
  assert.throws(() => parseReviewedMdx('<Understand title="x" stages={window.localStorage} />'));
  assert.throws(() => parseReviewedMdx(understandMdx('python').replace('python-bindings', 'arbitrary-code')));
});

test('Understand gates all parts, preserves earned progress across collapse, and restarts cleanly', async () => {
  const dom = new JSDOM('<div id="root"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(document.getElementById('root'));
  const click = async element => act(async () => element.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })));
  const button = text => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === text);
  const choose = async (index, value) => act(async () => { const select = document.querySelectorAll('select')[index]; select.value = String(value); select.dispatchEvent(new dom.window.Event('change', { bubbles: true })); });
  const data = understandActivities.python;
  try {
    await act(async () => root.render(React.createElement(module.exports.UnderstandActivity, data)));
    assert.equal(document.querySelector('select'), null);
    await click(button('Understand'));
    assert.equal(button('Understand').getAttribute('aria-expanded'), 'true');
    assert.equal(document.activeElement, document.querySelector('h4'));
    assert.equal(button('Next part').disabled, true); assert.equal(button('Check this part').disabled, true);
    assert.equal(document.querySelectorAll('.understand-progress button')[1].disabled, true);
    await choose(0, 0); await choose(1, 0); await click(button('Check this part'));
    assert.match(document.querySelector('[role="status"]').textContent, /Not yet/);
    assert.equal(button('Next part').disabled, true);
    await click(button('Show hint')); assert.match(document.querySelector('[id$="-hint"]').textContent, /Quotation/);
    for (let part = 0; part < data.stages.length; part++) {
      for (const [index, slot] of data.stages[part].slots.entries()) await choose(index, slot.answer);
      await click(button('Check this part'));
      assert.match(document.querySelector('[role="status"]').textContent, /All checks correct/);
      if (part < data.stages.length - 1) { assert.equal(button('Next part').disabled, false); await click(button('Next part')); }
    }
    assert.match(document.body.textContent, /Activity complete: every part is correct/);
    await click(button('Understand')); await click(button('Understand'));
    assert.match(document.body.textContent, /Activity complete/);
    await click(button('Previous part')); assert.match(document.querySelector('h4').textContent, /Part 2/);
    await click(button('Restart activity'));
    assert.match(document.querySelector('h4').textContent, /Part 1/);
    assert.equal(document.querySelector('[role="status"]'), null); assert.equal(button('Next part').disabled, true);
  } finally { await act(async () => root.unmount()); dom.window.close(); globalThis.window = previous.window; globalThis.document = previous.document; globalThis.IS_REACT_ACT_ENVIRONMENT = previous.act; }
});
