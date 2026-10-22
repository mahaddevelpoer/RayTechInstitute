import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
async function renderContact(state) {
  const module = { exports: {} };
  const source = await fs.readFile('src/components/ContactSection.tsx', 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, require: id =>
    id === '@formspree/react' ? { useForm: () => [state, () => {}] } : require(id) });
  return renderToStaticMarkup(React.createElement(module.exports.ContactSection));
}

test('contact success and error states render English without sending any request', async () => {
  const success = await renderContact({ succeeded: true });
  assert.match(success, /Thank you! Your message has been sent\./);
  assert.match(success, /We have received your question or request/);
  assert.doesNotMatch(success, /<form\b/);
  const error = await renderContact({ succeeded: false, submitting: false, errors: { getFormErrors: () => ['fixture error'] } });
  assert.match(error, /Your message could not be sent\. Please check the form and try again\./);
  assert.match(error, /Send Message/);
  const busy = await renderContact({ succeeded: false, submitting: true });
  assert.match(busy, /Sending Message/);
  assert.match(busy, /disabled=""/);
});

test('public and admin interface source contains no known Roman Urdu instruction phrases', async () => {
  const phrases = /\b(?:shukriya|aapka|aapki|aapko|karein|karain|krain|yahan|yahaan|dobara|pehla|honge|chuki|chuka|nahi|nahin)\b/i;
  async function scan(folder) {
    for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) await scan(file);
      else if (/\.(?:tsx?|json)$/.test(entry.name))
        assert.doesNotMatch(await fs.readFile(file, 'utf8'), phrases, file);
    }
  }
  await scan('src/app');
  await scan('src/components');
  const chapters = await fs.readFile('src/app/admin/classes/page.tsx', 'utf8');
  assert.match(chapters, /Set each chapter's number and name here/);
  assert.match(chapters, /No chapters have been added yet/);
  const lectures = await fs.readFile('src/components/LectureArchive.tsx', 'utf8');
  assert.match(lectures, /No lectures match your search/);
});
