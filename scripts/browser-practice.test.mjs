import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { renderToString } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const source = await fs.readFile('src/components/learning/BrowserPractice.tsx', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
const module = { exports: {} };
vm.runInNewContext(compiled, {
  exports: module.exports, module,
  require(name) {
    if (name === 'react' || name === 'react/jsx-runtime') return require(name);
    if (name === 'next/dynamic') return () => () => React.createElement('div', null, 'Editor fixture');
    if (name === 'lucide-react') return { Play: () => null, Square: () => null, RotateCcw: () => null };
    if (name.endsWith('runtime-assets')) return { loadRuntimeAssets: async () => ({}), loadDOMWorker: async () => '' };
    throw new Error(`Unexpected dependency: ${name}`);
  },
  get window() { return globalThis.window; },
  crypto: globalThis.crypto, setTimeout, clearTimeout,
});
const { BrowserPractice } = module.exports;

test('HTML and CSS previews retain a readable independent light surface in dark theme', () => {
  for (const language of ['html', 'css']) {
    const dom = new JSDOM(renderToString(React.createElement(BrowserPractice, { language, starterCode: '' })));
    const frame = dom.window.document.querySelector('iframe');
    assert.equal(frame.style.backgroundColor, 'rgb(255, 255, 255)');
    assert.equal(frame.style.colorScheme, 'light');
    assert.equal(frame.classList.contains('bg-white'), false);
    assert.equal(frame.getAttribute('sandbox'), '');
    dom.window.close();
  }
});

test('execution frames mount after hydration so cached direct loads cannot miss readiness', async () => {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'https://local.test' });
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const previousAct = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  try {
    for (const language of ['javascript', 'python', 'php']) {
      const element = React.createElement(BrowserPractice, { language, starterCode: '' });
      const html = renderToString(element);
      assert.doesNotMatch(html, /<iframe/, `${language}: no early-loading execution iframe in static HTML`);
      const container = document.getElementById('root');
      const root = createRoot(container);
      const stopped = [];
      try {
        await act(async () => root.render(element));
        const frame = container.querySelector('iframe');
        assert.ok(frame, `${language}: iframe mounted after effects`);
        frame.contentWindow.postMessage = message => stopped.push(message.type);
        assert.equal(frame.getAttribute('sandbox'), 'allow-scripts');
        const run = [...container.querySelectorAll('button')].find(button => button.textContent === 'Run');
        assert.equal(run.disabled, true, 'Run waits for actual frame load');
        await act(async () => frame.dispatchEvent(new dom.window.Event('load')));
        assert.equal(run.disabled, false, `${language}: load enables Run`);
      } finally { await act(async () => root.unmount()); }
      assert.ok(stopped.includes('stop'), `${language}: unmount stops the actual mounted frame`);
    }
  } finally {
    dom.window.close();
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousAct;
  }
});
