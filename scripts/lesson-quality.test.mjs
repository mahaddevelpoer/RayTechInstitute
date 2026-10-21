import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
import { lessonFixture } from './lesson-quality-fixture.mjs';
const { lessonWordCount, lessonQualityIssues } = await loadTypescript('supabase/functions/_shared/lesson-quality.ts');
test('lesson word count excludes code, inline code, URLs and Markdown syntax', () => {
  assert.equal(lessonWordCount('## Learn variables\nA [useful guide](https://example.test/path) and `print(1)`.\n```python\n' + 'code '.repeat(3000) + '\n````\nDone.'), 7);
  assert.equal(lessonWordCount('Read this.\n~~~python\n' + 'hidden '.repeat(3000)), 2);
});
test('quality has no editorial word-count bounds but still requires examples and results', () => {
  assert.deepEqual(lessonQualityIssues(lessonFixture()), []);
  assert.deepEqual(lessonQualityIssues(lessonFixture(1000)), []);
  assert.deepEqual(lessonQualityIssues(lessonFixture(4100)), []);
  assert.match(lessonQualityIssues(lessonFixture().replaceAll('```python', '```text')).join(' '), /three language-tagged/);
  assert.match(lessonQualityIssues(lessonFixture().replaceAll('Expected output', 'Value')).join(' '), /expected output/);
});
