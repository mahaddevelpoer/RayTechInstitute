// Visual-only sequential check. Never enables or downloads speech models.
import fs from 'node:fs/promises';
import os from 'node:os';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
if (os.freemem() < 1600 * 1024 * 1024) throw new Error('Visual check skipped: keep memory free for the user.');
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = []; const speechRequests = [];
  page.on('pageerror', error => { errors.push(error.message); console.error(`[codi-preview-error] ${error.message}`); });
  page.on('request', request => { if (/huggingface|\/codi\/worker\.js/.test(request.url())) speechRequests.push(request.url()); });
  await page.goto('http://127.0.0.1:4178/');
  try { await page.locator('.codi-robot canvas').waitFor({ timeout: 6000 }); }
  catch { console.error((await page.locator('body').innerText()).slice(0, 600)); await page.screenshot({ path: 'artifacts/codi/robot-preview/load-error.png' }); throw new Error(`Robot preview did not render: ${errors.join('; ') || 'see load-error.png'}`); }
  await fs.mkdir('artifacts/codi/robot-preview', { recursive: true });
  await page.screenshot({ path: 'artifacts/codi/robot-preview/lesson-robot.png' });
  assert.equal(await page.locator('.codi-carrier').getAttribute('data-dock'), 'lesson');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.codi-carrier')?.getAttribute('data-flying') === 'true');
  await page.waitForFunction(() => document.querySelector('.codi-carrier')?.getAttribute('data-dock') === 'compiler' && document.querySelector('.codi-carrier')?.getAttribute('data-flying') === 'false');
  await page.screenshot({ path: 'artifacts/codi/robot-preview/compiler-robot.png' });
  await page.getByRole('button', { name: 'Codi: read the entire lesson', exact: true }).click();
  await page.getByRole('checkbox', { name: /Allow Gemini voice/ }).waitFor();
  assert.equal(await page.locator('.codi-slot').count(), 0, 'floating tutor reserves no white space');
  await page.getByRole('button', { name: 'Close Codi settings', exact: true }).click();
  assert.equal(await page.getByRole('dialog', { name: 'Codi settings' }).count(), 0, 'settings close completely');
  assert.equal(speechRequests.length, 0, 'opening the robot must not start model downloads');
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ robotRendered: true, runTriggeredFlight: true, compilerLanding: true, speechDownloads: 0, pageErrors: errors }));
} finally { await browser.close(); }
