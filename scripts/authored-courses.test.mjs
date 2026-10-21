import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { authoredFoundationTopics } from '../content/courses/catalog.mjs';
import { loadTypescript } from './load-typescript.mjs';
const { validateTopicPublication } = await loadTypescript('supabase/functions/_shared/learning-curriculum.ts');
const { lessonQualityIssues } = await loadTypescript('supabase/functions/_shared/lesson-quality.ts');
const topics = await authoredFoundationTopics();

test('all five authored foundation lessons have structured content and complete assessments', () => {
  assert.deepEqual(topics.map(t => t.languageId), ['html', 'css', 'javascript', 'php', 'python']);
  for (const topic of topics) {
    assert.deepEqual(validateTopicPublication(topic, topics), []);
    assert.deepEqual(lessonQualityIssues(topic.content), []);
    assert.equal(topic.state, 'draft'); assert.equal(topic.questions.length, 8);
    assert.equal(topic.questionsPerAttempt, 4);
  }
});

test('authored JavaScript examples produce their stated exact output', () => {
  const topic = topics.find(t => t.languageId === 'javascript');
  const blocks = [...topic.content.matchAll(/```javascript\n([\s\S]*?)\n```/g)].map(m => m[1]);
  const expected = ['Ready to practise\nRead, predict, run, compare', '15\n123\n36', '300'];
  assert.equal(blocks.length, 3);
  blocks.forEach((code, index) => {
    const output = []; vm.runInNewContext(code, { console: { log: (...args) => output.push(args.join(' ')) } }, { timeout: 1000 });
    assert.equal(output.join('\n'), expected[index]);
  });
});

test('authored HTML/CSS examples use the actual sample structure without executable scripts', () => {
  const html = topics.find(t => t.languageId === 'html');
  for (const match of html.content.matchAll(/```html\n([\s\S]*?)\n```/g)) {
    const dom = new JSDOM(match[1]);
    try { assert.equal(dom.window.document.querySelectorAll('h1').length, 1); assert.equal(dom.window.document.querySelectorAll('script').length, 0); }
    finally { dom.window.close(); }
  }
  const css = topics.find(t => t.languageId === 'css');
  for (const match of css.content.matchAll(/```css\n([\s\S]*?)\n```/g)) {
    const dom = new JSDOM(`<style>${match[1]}</style><main><h1>Practice heading</h1><p>Sample paragraph</p><button>Sample button</button></main>`);
    try { assert.ok(dom.window.document.styleSheets[0].cssRules.length); }
    finally { dom.window.close(); }
  }
});
