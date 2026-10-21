import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { loadTypescript } from './load-typescript.mjs';
const { variableLabFrames } = await loadTypescript('src/lib/learning/variable-lab.ts');

test('bounded variable experiment preserves previous total until explicit recalculation', () => {
  for (const days of [1, 5, 10]) for (const minutes of [5, 30, 60]) for (const changed of [1, 6, 10]) {
    const without = variableLabFrames(days, minutes, changed, false);
    assert.equal(without.length, 5); assert.equal(without[3].state.days, changed);
    assert.equal(without[3].state.total, days * minutes);
    assert.deepEqual(without.at(-1).output, [String(days * minutes)]);
    const withRecalculation = variableLabFrames(days, minutes, changed, true);
    assert.equal(withRecalculation.length, 7);
    assert.deepEqual(withRecalculation.at(-1).output, [String(days * minutes), String(changed * minutes)]);
    assert.equal(withRecalculation[2].state.total, days * minutes, 'earlier snapshots must not mutate');
  }
  for (const values of [[0, 30, 6], [5, 61, 6], [5, 30, Infinity], [1.5, 30, 6]]) assert.throws(() => variableLabFrames(...values, false));
});

test('variable experiment can step, play/pause, reset and compare recalculation through React', async () => {
  const require = createRequire(import.meta.url); const module = { exports: {} };
  const source = await fs.readFile('src/components/learning/PythonVariableLab.tsx', 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const timers = new Map(); let timerId = 0;
  vm.runInNewContext(code, { module, exports: module.exports, setTimeout: callback => { timers.set(++timerId, callback); return timerId; }, clearTimeout: id => timers.delete(id), require(name) {
    if (name === 'react' || name === 'react/jsx-runtime') return require(name);
    if (name === 'lucide-react') return Object.fromEntries(['Play', 'Pause', 'SkipForward', 'RotateCcw', 'ArrowRight'].map(name => [name, () => null]));
    if (name.endsWith('variable-lab')) return { variableLabFrames };
    throw new Error(name);
  } });
  const dom = new JSDOM('<div id="root"></div>');
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(document.getElementById('root'));
  const button = text => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === text);
  const click = async element => act(async () => element.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })));
  try {
    await act(async () => root.render(React.createElement(module.exports.PythonVariableLab)));
    assert.match(document.querySelector('[role="status"]').textContent, /Ready/);
    await click(button('Step one line')); assert.match(document.querySelector('output').textContent, /5/);
    await click(button('Play experiment')); assert.equal(timers.size, 1);
    await click(button('Pause experiment')); assert.equal(timers.size, 0);
    for (let index = 1; index < 5; index++) await click(button('Step one line'));
    assert.equal(button('Step one line').disabled, true);
    assert.match(document.querySelector('.variable-lab-output').textContent, /150/);
    await click(document.querySelector('input[type="checkbox"]'));
    assert.match(document.querySelector('[role="status"]').textContent, /Ready/);
    await click(button('Play experiment'));
    for (let index = 0; index < 7; index++) await act(async () => { const [id, callback] = timers.entries().next().value; timers.delete(id); callback(); });
    assert.equal(timers.size, 0); assert.ok(button('Replay experiment'));
    assert.match(document.querySelector('.variable-lab-output').textContent, /150\n180/);
    await click(button('Reset experiment')); assert.equal(button('Step one line').disabled, false);
    assert.equal(document.querySelector('script,iframe'), null);
  } finally { await act(async () => root.unmount()); dom.window.close(); globalThis.window = previous.window; globalThis.document = previous.document; globalThis.IS_REACT_ACT_ENVIRONMENT = previous.act; }
  assert.equal(timers.size, 0);
});
