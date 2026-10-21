import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import postcss from 'postcss';
import { loadTypescript } from './load-typescript.mjs';
const { nextHeaderScroll } = await loadTypescript('src/lib/header-scroll.ts');

test('header hides going down, reveals going up and ignores tiny scroll noise', () => {
  let state = { anchor: 0, hidden: false };
  state = nextHeaderScroll(state, 200); assert.equal(state.hidden, true);
  assert.equal(nextHeaderScroll(state, 190), state);
  state = nextHeaderScroll(state, 170); assert.equal(state.hidden, false);
  assert.equal(nextHeaderScroll(state, 300, true).hidden, false);
  assert.equal(nextHeaderScroll({ anchor: 100, hidden: true }, 0).hidden, false);
  assert.equal(nextHeaderScroll(state, NaN), state);
});

function luminance(hex) { const values = hex.slice(1).match(/../g).map(pair => parseInt(pair, 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4); return .2126 * values[0] + .7152 * values[1] + .0722 * values[2]; }
function contrast(a, b) { const pair = [luminance(a), luminance(b)].sort((x, y) => y - x); return (pair[0] + .05) / (pair[1] + .05); }
test('light/dark body, muted text, links and solid button tokens meet AA text contrast', async () => {
  const css = postcss.parse(await fs.readFile('src/app/globals.css', 'utf8'));
  const tokens = selector => { const data = {}; css.walkRules(rule => { if (rule.selector === selector) rule.walkDecls(/^--/, declaration => { data[declaration.prop] = declaration.value; }); }); return data; };
  for (const selector of [':root', 'html.dark']) {
    const theme = tokens(selector);
    for (const surface of ['--bg-main', '--bg-card', '--bg-soft']) for (const text of ['--text-main', '--text-sub', '--text-muted']) assert.ok(contrast(theme[text], theme[surface]) >= 4.5, `${selector} ${text} on ${surface}`);
    for (const colour of ['--primary', '--primary-hover', '--accent', '--accent-hover']) assert.ok(contrast('#ffffff', theme[colour]) >= 4.5, `${selector} solid ${colour}`);
    assert.ok(contrast(theme['--link'], theme['--primary-light']) >= 4.5);
    assert.ok(contrast(theme['--selection-text'], theme['--selection-bg']) >= 4.5, `${selector} selected lesson text`);
    for (const surface of ['--bg-main', '--bg-card', '--bg-soft']) assert.ok(contrast(theme['--focus-ring'], theme[surface]) >= 3, `${selector} visible keyboard focus`);
  }
  assert.match(await fs.readFile('tailwind.config.ts', 'utf8'), /darkMode:\s*'class'/);
});

test('empty ad reservations do not disguise links or load ad/tracking scripts', async () => {
  const source = await fs.readFile('src/components/AdReservation.tsx', 'utf8');
  assert.match(source, /aria-hidden="true"/);
  assert.doesNotMatch(source, /<a\b|<script\b|<iframe\b|dangerouslySetInnerHTML/);
});

test('YouTube client uses authenticated Edge selection without a bundled private API key', async () => {
  const hook = await fs.readFile('src/hooks/useYouTubeSync.ts', 'utf8');
  assert.match(hook, /learningAdminRequest\('learning_videos'/);
  assert.match(hook, /pathname.startsWith\('\/admin\/'\)/);
  assert.doesNotMatch(hook + await fs.readFile('src/utils/youtubeSync.ts', 'utf8'), /process\.env\.NEXT_PUBLIC_YOUTUBE_API_KEY/);
});
