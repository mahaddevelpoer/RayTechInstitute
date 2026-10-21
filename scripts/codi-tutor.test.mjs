import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { codiSpeechChunks, codiNarration, findCodiExplanation, codiDockPoint, codiRobotPose, clampCodiPosition, codiSettingsPosition } = await loadTypescript('src/lib/learning/codi-tutor.ts');
test('clicked visible code is not mistaken for Markdown or HTML markup',()=>{
  assert.deepEqual(codiSpeechChunks('<div class="my_card">','text'),['<div class="my_card">']);
  assert.deepEqual(codiSpeechChunks('total_score = first_value * 2','text'),['total_score = first_value * 2']);
  assert.match(codiNarration('Use `my_name` here.\n```html\n<h1>Hello</h1>\n```'),/my_name/);
  assert.match(codiNarration('```html\n<h1>Hello</h1>\n```'),/<h1>Hello<\/h1>/);
});
test('whole-lesson narration retains the final paragraph and has bounded speech requests', () => {
  const lesson = '# Variables\n\n' + 'A variable names a value. '.repeat(200) + '\n\nThe final paragraph is included.';
  const chunks = codiSpeechChunks(lesson);
  assert.ok(chunks.length > 10); assert.ok(chunks.every(chunk => chunk.length <= 420));
  assert.equal(chunks.join(' '), codiNarration(lesson).split(/\s+/).join(' '));
  assert.match(chunks.at(-1), /final paragraph is included/);
  assert.deepEqual(codiSpeechChunks(''), []); assert.deepEqual(codiSpeechChunks('x'.repeat(200001)), []);
});
const lessons = [
  { id: 'variables', slug: 'variables', title: 'Variables', order: 1, content: '# Variables\nA variable gives a name to a value. Assigning a new value changes what that name refers to. Use meaningful names for values in your program.' },
  { id: 'numbers', slug: 'numbers', title: 'Numbers', order: 2, content: '# Numbers\nNumbers can be added and multiplied. An integer represents a whole number. Decimal values can represent measurements and calculations.' },
  { id: 'loops', slug: 'loops', title: 'Loops', order: 3, content: '# Loops\nLoops repeat a block of instructions. A loop can visit every value in a sequence. Choose a loop when the same operation must run repeatedly.' },
];
test('explanations are grounded in current, earlier or upcoming published lesson content', () => {
  assert.equal(findCodiExplanation('integer whole number', lessons, 'numbers').relation, 'current');
  const earlier = findCodiExplanation('variable meaningful names', lessons, 'numbers'); assert.equal(earlier.relation, 'previous'); assert.equal(earlier.slug, 'variables'); assert.ok(lessons[0].content.includes(earlier.text.split('\n').at(-1)));
  assert.equal(findCodiExplanation('loops repeat instructions', lessons, 'numbers').relation, 'upcoming');
  assert.equal(findCodiExplanation('unrelated astronomy galaxies', lessons, 'numbers'), null);
});
test('robot blinks while idle, speaks with eyes open, and honours reduced motion', () => {
  assert.equal(codiRobotPose(4, false, false, false).eyeScale, .09);
  assert.equal(codiRobotPose(4, true, false, false).eyeScale, 1);
  assert.ok(codiRobotPose(2, true, false, false).mouth.some(value => value > 1));
  assert.equal(codiRobotPose(2, false, true, false).arm, .85);
  const reduced = codiRobotPose(4, true, true, true); assert.equal(reduced.eyeScale, 1); assert.equal(reduced.bodyY, 0); assert.equal(reduced.lean, 0); assert.deepEqual(reduced.mouth, [1, 1, 1]);
});
test('docking stays inside a small viewport instead of overflowing the compiler pane', () => {
  const point = codiDockPoint({ left: 500, right: 1500, top: 0, bottom: 1000, width: 1000, height: 1000 }, { width: 390, height: 844 });
  assert.ok(point.x >= 8 && point.x + 72 <= 390); assert.ok(point.y >= 0 && point.y + 98 <= 844);
  assert.equal(point.y, 4, 'robot docks at the top, not over lesson prose');
});
test('floating robot and settings stay reachable at every viewport edge', () => {
  for (const viewport of [{width:320,height:568},{width:390,height:844},{width:768,height:600},{width:1366,height:900},{width:360,height:240}]) {
    const robotWidth=viewport.width<=767?72:104;
    for (const point of [{x:-500,y:-500},{x:9999,y:9999},{x:100,y:100},{x:NaN,y:Infinity}]) {
      const clamped=clampCodiPosition(point,viewport);
      assert.ok(clamped.x>=0&&clamped.x+robotWidth<=viewport.width);
      assert.ok(clamped.y>=0&&clamped.y+robotWidth+48<=viewport.height);
      const panel=codiSettingsPosition(clamped,viewport);
      assert.ok(panel.left>=8&&panel.left+panel.width<=viewport.width-8);
      assert.ok(panel.top>=8&&panel.top+panel.maxHeight<=viewport.height-8);
    }
  }
});
