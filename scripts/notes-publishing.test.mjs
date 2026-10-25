import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import { JSDOM } from 'jsdom';
import { createClient } from '@supabase/supabase-js';
import { loadTypescript } from './load-typescript.mjs';

const { adminFunctionError } = await loadTypescript('src/lib/admin-function-error.ts');
const { normalizeDocumentInput } = await loadTypescript('src/utils/documents.ts');
const { adminOperation } = await loadTypescript('src/utils/admin-operation.ts');
const { adminStudyContext } = await loadTypescript('src/utils/admin-study-context.ts');
const seo = await loadTypescript('src/utils/seo.ts');
const pdf = 'https://cssaspirants.pk/wp-content/uploads/2026/07/computer-science-2026.pdf';
const require = createRequire(import.meta.url);

test('real SDK non-2xx responses retain safe validation errors and session guidance', async () => {
  let status = 400;
  const client = createClient('https://fixture.supabase.co', 'synthetic-public-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async () => Response.json({ success: false, error: 'Document and source links must be valid HTTPS URLs.' }, { status }) },
  });
  const failure = await client.functions.invoke('secure-dispatch', { body: { action: 'mutate_content' } });
  assert.match(failure.error.message, /non-2xx/);
  assert.equal((await adminFunctionError(failure.error, failure.data, 'Safe fallback')).message, 'Document and source links must be valid HTTPS URLs.');
  assert.equal((await failure.error.context.json()).success, false, 'decoder does not consume the original response');
  status = 401;
  const expired = await client.functions.invoke('secure-dispatch');
  assert.match((await adminFunctionError(expired.error, expired.data, 'Safe fallback')).message, /session has expired/);
});

test('error decoder never returns SQL, provider keys, HTML or generic SDK diagnostics', async () => {
  for (const error of ['SQLSTATE private_table', 'sk-or-secret', '<html>private diagnostic</html>', 'x'.repeat(501)]) {
    assert.equal((await adminFunctionError({ context: Response.json({ error }, { status: 400 }) }, null, 'Safe fallback')).message, 'Safe fallback');
  }
  assert.equal((await adminFunctionError(new Error('Edge Function returned a non-2xx status code'), null, 'Safe fallback')).message, 'Safe fallback');
});

test('the reported PDF is unchanged; unsafe editor links fail before saving', () => {
  assert.equal(normalizeDocumentInput(pdf, 'PDF download URL'), pdf);
  assert.equal(normalizeDocumentInput(' //drive.google.com/file/d/abc/view ', 'PDF preview URL'), 'https://drive.google.com/file/d/abc/view');
  assert.equal(normalizeDocumentInput('/classes/', 'Action button URL', true), '/classes/');
  for (const url of ['http://board.test/a.pdf', 'javascript:alert(1)', 'https://user:password@board.test/a.pdf', '<iframe src="https://board.test/a.pdf"></iframe>'])
    assert.throws(() => normalizeDocumentInput(url, 'PDF preview URL'), /PDF preview URL must be a valid HTTPS link/);
});

test('notes save failures are visible outside the AI modal and preserve the complete form', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://site.test/admin/notes/' });
  const keys = ['window', 'document', 'Event', 'CustomEvent', 'IS_REACT_ACT_ENVIRONMENT'];
  const old = Object.fromEntries(keys.map(key => [key, globalThis[key]]));
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, Event: dom.window.Event, CustomEvent: dom.window.CustomEvent, IS_REACT_ACT_ENVIRONMENT: true });
  const writes = [];
  const store = { syncFromSupabase: async () => {}, getClasses: () => [{ id: '11', slug: '11th-class', title: 'Class 11', numericGrade: 11, isActive: true }], getSubjects: () => [{ id: 'cs', classSlug: '11th-class', slug: 'computer-science', title: 'Computer Science' }], getNotes: () => [], saveNote: async item => { writes.push(item); throw await adminFunctionError({ context: Response.json({ error: 'Document and source links must be valid HTTPS URLs.' }, { status: 400 }) }, null, 'Safe fallback'); } };
  const module = { exports: {} };
  const code = ts.transpileModule(await fs.readFile('src/app/admin/notes/page.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, Error, window: dom.window, setTimeout: () => 0, require: id => id === '@/utils/admin-study-context' ? {adminStudyContext} : id === '@/data/educationalStore' ? { EducationalStore: store } : id === '@/utils/admin-operation' ? { adminOperation } : id === '@/lib/supabase' ? {} : id === '@/lib/admin-function-error' ? { adminFunctionError } : id === '@/utils/documents' ? { normalizeDocumentInput } : require(id) });
  const root = createRoot(document.getElementById('root'));
  try {
    await act(async () => root.render(React.createElement(module.exports.default)));
    const chapter = document.querySelector('input[placeholder="e.g. Information Networks"]');
    const title = document.querySelector('input[placeholder="e.g. Complete Solved Chapter 1 Notes"]');
    const download = document.querySelector('input[type="url"]');
    for (const [node, value] of [[chapter, 'Computer Science'], [title, 'Computer Science Notes'], [download, pdf]])
      await act(async () => Simulate.change(node, { target: { value } }));
    await act(async () => document.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(writes.length, 1);
    assert.equal(writes[0].pdfUrl, pdf);
    assert.match(document.querySelector('[role="alert"]').textContent, /valid HTTPS URLs/);
    assert.match(document.querySelector('[role="alert"]').textContent, /form has not been cleared/);
    assert.equal(title.value, 'Computer Science Notes');
    assert.equal(chapter.value, 'Computer Science');
    assert.equal(download.value, pdf);
    assert.doesNotMatch(document.body.textContent, /non-2xx/);
    await act(async () => Simulate.change(download, { target: { value: 'http://board.test/a.pdf' } }));
    await act(async () => document.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(writes.length, 1, 'invalid links never reach the save request');
    assert.match(document.querySelector('[role="alert"]').textContent, /PDF download URL must be a valid HTTPS link/);
  } finally { await act(async () => root.unmount()); Object.assign(globalThis, old); dom.window.close(); }
});

test('note cache updates only after the server confirms the save', async () => {
  const code = await fs.readFile('src/data/educationalStore.ts', 'utf8');
  const save = code.slice(code.indexOf('async saveNote('), code.indexOf('async deleteNote('));
  assert.ok(save.indexOf('await mutateContent') < save.indexOf('saveToStorage'));
});

test('the real note detail metadata cannot block publishing for a 183-character or blank description', async () => {
  const note = { id: 'saved-note', classSlug: '11th-class', subjectSlug: 'computer-science', chapterNumber: 1, chapterTitle: 'Introduction', description: 'X'.repeat(183) };
  const resourceSeo = await loadTypescript('src/utils/study-resource-seo.ts');
  const module = { exports: {} };
  const source = await fs.readFile('src/app/classes/[classSlug]/[subjectSlug]/notes/[noteSlug]/page.tsx', 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, require: id => id === '@/utils/seo' ? seo : id === '@/utils/study-resource-seo' ? resourceSeo : id === '@/data/staticCatalog' ? { INITIAL_NOTES: [note], INITIAL_CLASSES: [{slug:note.classSlug,title:'Class 11'}], INITIAL_SUBJECTS: [{ classSlug: note.classSlug, slug: note.subjectSlug, title: 'Computer Science' }] } : id === '@/lib/site' ? { siteUrl: value => `https://site.test${value}` } : id.startsWith('@/') ? {} : require(id) });
  for (const summary of ['', 'A', 'X'.repeat(183), 'Detailed study guidance. '.repeat(100)]) {
    note.description = summary;
    const metadata = await module.exports.generateMetadata({ params: Promise.resolve({ classSlug: note.classSlug, subjectSlug: note.subjectSlug, noteSlug: note.id }) });
    assert.ok(metadata.description.length >= 120 && metadata.description.length <= 155);
    assert.equal(metadata.openGraph.description, metadata.description);
    assert.match(metadata.title,/Class 11/);
    assert.ok(metadata.keywords.includes('Introduction'));
    assert.equal(metadata.alternates.canonical,`https://site.test/classes/${note.classSlug}/${note.subjectSlug}/notes/${note.id}/`);
    assert.equal(note.description, summary, 'saved description is not truncated');
  }
});
