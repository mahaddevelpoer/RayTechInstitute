import test from 'node:test';
import assert from 'node:assert/strict';
import { moduleUrl } from './load-typescript.mjs';
let run = 0;
async function setup() {
  const api = await import((await moduleUrl('src/lib/learning/youtube-player.ts')) + '#' + ++run);
  const scripts = [];
  globalThis.window = {};
  globalThis.document = {
    createElement() { return { remove() { this.removed = true; } }; },
    head: { appendChild(script) { scripts.push(script); } },
  };
  return { api, scripts, ready() { window.YT = { Player: class {} }; window.onYouTubeIframeAPIReady(); } };
}
test('concurrent video players share one loader and retain earlier ready callbacks', async () => {
  const { api, scripts, ready } = await setup();
  let earlierCalls = 0;
  const previous = () => { earlierCalls++; throw new Error('Another integration failed'); };
  window.onYouTubeIframeAPIReady = previous;
  const first = api.loadLessonYouTubeAPI(); const second = api.loadLessonYouTubeAPI();
  assert.equal(first, second); assert.equal(scripts.length, 1);
  ready(); assert.equal(await first, window.YT); assert.equal(await second, window.YT);
  assert.equal(earlierCalls, 1); assert.equal(window.onYouTubeIframeAPIReady, previous);
  assert.equal(await api.loadLessonYouTubeAPI(), window.YT); assert.equal(scripts.length, 1);
});
test('blocked scripts fail cleanly and a later attempt can retry', async () => {
  const { api, scripts, ready } = await setup();
  const first = api.loadLessonYouTubeAPI(); scripts[0].onerror();
  await assert.rejects(first, /could not load/); assert.equal(scripts[0].removed, true);
  const second = api.loadLessonYouTubeAPI(); assert.equal(scripts.length, 2);
  ready(); await second;
});
test('a missing API callback reaches a bounded timeout without leaving the global callback attached', async () => {
  const { api, scripts } = await setup();
  const schedule = globalThis.setTimeout; const cancel = globalThis.clearTimeout;
  let expire;
  let promise;
  try {
    globalThis.setTimeout = (callback, delay) => { assert.equal(delay, 15000); expire = callback; return 123; };
    globalThis.clearTimeout = () => {};
    promise = api.loadLessonYouTubeAPI(); expire();
  } finally { globalThis.setTimeout = schedule; globalThis.clearTimeout = cancel; }
  await assert.rejects(promise, /timed out/);
  assert.equal(scripts[0].removed, true); assert.equal(window.onYouTubeIframeAPIReady, undefined);
});
test('lesson embeds validate the video ID and preserve origin, native controls and privacy-enhanced host', async () => {
  const { api } = await setup();
  const url = new URL(api.lessonVideoURL('abcdefghijk', 'https://site.example'));
  assert.equal(url.origin, 'https://www.youtube-nocookie.com');
  assert.equal(url.searchParams.get('origin'), 'https://site.example');
  assert.equal(url.searchParams.get('controls'), '1'); assert.equal(url.searchParams.get('autoplay'), '0');
  assert.throws(() => api.lessonVideoURL('bad?id=unsafe', 'https://site.example'));
});
test('seek positions are bounded and longer lesson timestamps remain readable', async () => {
  const { api } = await setup();
  assert.equal(api.boundedVideoTime(-20, 120), 0); assert.equal(api.boundedVideoTime(400, 120), 120);
  assert.equal(api.boundedVideoTime(NaN, 120), 0); assert.equal(api.boundedVideoTime(40, NaN), 0);
  assert.equal(api.videoTime(3661), '1:01:01'); assert.equal(api.videoTime(NaN), '0:00');
});
