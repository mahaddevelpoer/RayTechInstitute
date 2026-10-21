import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
const require = createRequire(import.meta.url);
const source = await fs.readFile('src/app/admin/login/page.tsx', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;

async function mount(run) {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'https://local.test/admin/login/' });
  const previous = { window: globalThis.window, document: globalThis.document, act: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  let verified = false; let checks = 0; let sent = 0; let marker = null;
  const pushes = [];
  const user = { uid: 'synthetic-staff', emailVerified: false, async reload() { this.emailVerified = verified; }, async getIdToken() { return 'synthetic-token'; } };
  const auth = { currentUser: user, onAuthStateChanged(callback) { void callback(this.currentUser); return () => {}; } };
  const router = { push(path) { pushes.push(path); } };
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, window: dom.window, setInterval, clearInterval, require(name) {
    if (name === 'react' || name === 'react/jsx-runtime') return require(name);
    if (name === 'next/navigation') return { useRouter: () => router };
    if (name === 'next/link') return ({ href, children }) => React.createElement('a', { href }, children);
    if (name === 'lucide-react') return new Proxy({}, { get: (_, key) => key === '__esModule' ? false : () => null });
    if (name === 'firebase/auth') return { signInWithEmailAndPassword: async () => ({ user }), sendEmailVerification: async supplied => { assert.equal(supplied, user); sent++; }, signOut: async () => { auth.currentUser = null; } };
    if (name.endsWith('/firebase')) return { auth };
    if (name.endsWith('/supabase')) return { verifyAdminAccess: async () => { checks++; return { ok: true }; } };
    if (name.endsWith('/security')) return { getRateLimitStatus: () => ({ isLocked: false, remainingSec: 0 }), recordFailedAttempt: () => ({ isLocked: false }), resetRateLimit() {}, setAdminSession(value) { marker = value; } };
    throw new Error(`Unexpected dependency: ${name}`);
  } });
  const root = createRoot(document.getElementById('root'));
  try {
    await act(async () => root.render(React.createElement(module.exports.default)));
    await run({ dom, user, pushes, setVerified(value) { verified = value; }, checks: () => checks, sent: () => sent, marker: () => marker, async click(text) {
      const button = [...document.querySelectorAll('button')].find(item => item.textContent === text); assert.ok(button, text);
      await act(async () => button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })));
    } });
  } finally {
    await act(async () => root.unmount()); dom.window.close();
    globalThis.window = previous.window; globalThis.document = previous.document; globalThis.IS_REACT_ACT_ENVIRONMENT = previous.act;
  }
}

test('unverified admin sign-in does not grant access or send verification mail automatically', async () => {
  await mount(async app => {
    assert.match(document.body.textContent, /Verification alone does not grant administrator permissions/);
    assert.equal(app.checks(), 0); assert.equal(app.sent(), 0); assert.equal(app.marker(), null); assert.deepEqual(app.pushes, []);
    await app.click('Send verification email'); assert.equal(app.sent(), 1);
    assert.match(document.body.textContent, /Verification email sent/);
    await app.click('Check verification'); assert.equal(app.checks(), 0); assert.deepEqual(app.pushes, []);
  });
});
test('email verification still requires server approval and stores only a UID marker', async () => {
  await mount(async app => {
    app.setVerified(true); await app.click('Check verification');
    assert.equal(app.checks(), 1); assert.equal(app.marker(), app.user.uid); assert.deepEqual(app.pushes, ['/admin']);
  });
});
