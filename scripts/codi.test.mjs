import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { loadTypescript } from './load-typescript.mjs';
const { codiLineAt, codiWav } = await loadTypescript('src/lib/learning/codi-line.ts');
test('Codi produces bounded valid PCM audio and rejects corrupt samples', () => {
  const wav = codiWav(new Float32Array([0, 1, -1, .5]), 24000); const view = new DataView(wav.buffer);
  assert.equal(new TextDecoder().decode(wav.slice(0, 4)), 'RIFF'); assert.equal(wav.length, 52);
  assert.equal(view.getUint32(24, true), 24000); assert.equal(view.getInt16(46, true), 32767); assert.equal(view.getInt16(48, true), -32768);
  assert.throws(() => codiWav(new Float32Array([NaN]), 24000)); assert.throws(() => codiWav(new Float32Array(), 24000));
});
test('Codi selects lesson text but does not hijack links, controls or code-editor input', () => {
  const dom = new JSDOM('<article><p>Hello <strong>student</strong>.</p><p><a href="/">Link</a></p><button>Do something</button><textarea>private code</textarea></article>');
  const previous = { Element: globalThis.Element, document: globalThis.document, NodeFilter: globalThis.NodeFilter };
  Object.assign(globalThis, { Element: dom.window.Element, document: dom.window.document, NodeFilter: dom.window.NodeFilter });
  try {
    const root = document.querySelector('article'); assert.equal(codiLineAt(root, root.querySelector('strong')), 'Hello student.');
    for (const selector of ['a', 'button', 'textarea']) assert.equal(codiLineAt(root, root.querySelector(selector)), null);
    assert.equal(codiLineAt(root, document.body), null);
  } finally { Object.assign(globalThis, previous); dom.window.close(); }
});
test('Codi uses procedural 3D robot geometry, not the superseded fox asset', async () => {
  const source = await fs.readFile('src/components/learning/CodiRobot.tsx', 'utf8');
  assert.match(source, /THREE.WebGLRenderer/); assert.match(source, /RoundedBoxGeometry/); assert.match(source, /codiRobotPose/);
  const reader = await fs.readFile('src/components/learning/CodiReader.tsx', 'utf8');
  assert.match(reader, /import\('\.\/CodiRobot'\)/); assert.doesNotMatch(reader, /CodiFox|fox.glb/);
});

test('a wrapped paragraph returns the clicked visual line instead of reading the whole paragraph', () => {
  const dom = new JSDOM('<article><h1>Heading</h1><p>First line second line</p><p aria-hidden="true">Hidden</p></article>');
  const previous = { Element: globalThis.Element, document: globalThis.document, NodeFilter: globalThis.NodeFilter };
  Object.assign(globalThis, { Element: dom.window.Element, document: dom.window.document, NodeFilter: dom.window.NodeFilter });
  const createRange = document.createRange.bind(document);
  document.createRange = () => { const range = createRange(); range.getClientRects = () => [{ top: range.startOffset < 11 ? 10 : 35, bottom: range.startOffset < 11 ? 30 : 55, height: 20 }]; return range; };
  try {
    const root = document.querySelector('article'); const paragraph = root.querySelector('p');
    assert.equal(codiLineAt(root, paragraph, 12), 'First line');
    assert.equal(codiLineAt(root, paragraph, 42), 'second line');
    assert.equal(codiLineAt(root, root.querySelector('h1')), 'Heading');
    assert.equal(codiLineAt(root, root.querySelector('[aria-hidden]')), null);
  } finally { Object.assign(globalThis, previous); dom.window.close(); }
});
test('Codi is confined to lesson mode and model networking is scoped to its worker policy', async () => {
  const workspace = await fs.readFile('src/components/learning/LearningWorkspace.tsx', 'utf8');
  assert.match(workspace, /mode === 'lesson' && process.env.NEXT_PUBLIC_CODI_ENABLED !== 'false' && <CodiReader/);
  const config = JSON.parse(await fs.readFile('firebase.json', 'utf8'));
  const worker = config.hosting.headers.find(rule => rule.source === '/codi/worker.js').headers.find(header => header.key === 'Content-Security-Policy').value;
  assert.match(worker, /https:\/\/huggingface.co/); assert.doesNotMatch(worker, /(?:^|\s)'unsafe-eval'|https:\/\/\*(?:\s|;|$)/);
});
