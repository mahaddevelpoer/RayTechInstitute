import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { collectLearningHealth } = await loadTypescript('supabase/functions/_shared/learning-health.ts');
const { parseManualReviews, MANUAL_REVIEW_ITEMS } = await loadTypescript('src/lib/learning/health.ts');
const { studentReviewKey } = await loadTypescript('supabase/functions/_shared/student-review-config.ts');
const config = { databaseUrl: 'https://demo.supabase.co', serviceKey: 'private-database-secret', geminiKey: 'private-gemini-secret', openRouterKey: 'private-router-secret', youtubeKey: 'private-video-secret', githubToken: 'private-github-secret', repository: 'owner/site', origin: 'https://site.example' };
function fetcher(calls) {
  return async (url, options = {}) => {
    calls.push({ url, method: options.method || 'GET' });
    if (url.includes('/rest/v1/')) return Response.json([{ id: 'one' }]);
    if (url.includes('generativelanguage')) return Response.json({ models: [{ name: 'models/gemini-2.5-flash-lite', supportedGenerationMethods: ['generateContent'] }] });
    if (url.includes('openrouter')) return Response.json({ data: { label: 'private key label', limit_remaining: 0 } });
    if (url.includes('/channels?')) return Response.json({ items: [{ contentDetails: { relatedPlaylists: { uploads: 'uploads-id' } } }] });
    if (url.includes('/playlistItems?')) return Response.json({ items: [] });
    if (url.includes('api.github.com/repos/owner/site')) return Response.json({ full_name: 'owner/site', private: true });
    if (url.endsWith('/functions/v1/student-review')) return new Response(null, { status: 204, headers: { 'access-control-allow-origin': config.origin } });
    throw new Error('Unexpected health URL');
  };
}
test('health probes only reads/preflight and never treats access checks as completed user flows', async () => {
  const calls = []; const report = await collectLearningHealth(config, fetcher(calls));
  assert.equal(report.success, true);
  assert.equal(report.checks.filter(item => item.id.startsWith('table:')).length, 12);
  assert.ok(report.checks.every(item => Number.isFinite(Date.parse(item.checkedAt)) && item.durationMs >= 0));
  for (const id of ['assessment', 'progress', 'publishing']) assert.equal(report.checks.find(item => item.id === id).status, 'not-tested');
  assert.ok(calls.every(call => ['GET', 'OPTIONS'].includes(call.method)));
  assert.ok(calls.every(call => !call.url.includes(':generateContent') && !call.url.includes('/dispatches') && !call.url.includes('/rpc/')));
  const text = JSON.stringify(report);
  for (const value of Object.values(config).filter(value => value.startsWith('private-'))) assert.ok(!text.includes(value));
  assert.ok(!text.includes('private key label'));
});
test('missing health configuration sends no provider or database requests', async () => {
  const report = await collectLearningHealth(Object.fromEntries(Object.keys(config).map(key => [key, ''])), async () => { throw new Error('No request should be made'); });
  assert.ok(report.checks.filter(item => !['admin-auth', 'assessment', 'progress', 'publishing'].includes(item.id)).every(item => item.status === 'attention'));
});
test('provider failures and unexpected bodies are safe errors without leaked diagnostics', async () => {
  const report = await collectLearningHealth(config, async () => new Response('private-service-diagnostic', { status: 403 }));
  assert.ok(report.checks.filter(item => !['admin-auth', 'assessment', 'progress', 'publishing'].includes(item.id)).every(item => item.status === 'error'));
  assert.ok(!JSON.stringify(report).includes('private-service-diagnostic'));
  const oversized = await collectLearningHealth(config, async () => new Response('x'.repeat(256001)));
  assert.equal(oversized.checks.find(item => item.id === 'openrouter').status, 'error');
});
test('endpoint preflight requires the requested origin, not merely a successful status', async () => {
  const delegate = fetcher([]);
  const report = await collectLearningHealth(config, (url, options) => url.endsWith('/student-review') ? Promise.resolve(new Response(null, { status: 204, headers: { 'access-control-allow-origin': 'https://another.example' } })) : delegate(url, options));
  assert.equal(report.checks.find(item => item.id === 'student-endpoint').status, 'error');
});
test('manual reviews accept only known checklist IDs and valid dates', () => {
  const time = '2026-10-18T12:00:00.000Z';
  assert.deepEqual(parseManualReviews(JSON.stringify({ layout: time, fake: time, quiz: true, budget: 'nonsense' })), { layout: time });
  assert.deepEqual(parseManualReviews('x'.repeat(10001)), {});
  assert.deepEqual(parseManualReviews('not JSON'), {});
  assert.equal(new Set(MANUAL_REVIEW_ITEMS.map(item => item.id)).size, MANUAL_REVIEW_ITEMS.length);
});

test('student reviewer uses the configured vault alias and rejects unrelated provider keys', () => {
  const key = 'sk-or-v1-' + 'a'.repeat(64);
  assert.equal(studentReviewKey(name => name === 'Assignment-ai-api' ? key : undefined), key);
  assert.equal(studentReviewKey(name => name === 'OPENROUTER_API_KEY' ? key : 'oc_sk_unrelated'), key);
  assert.equal(studentReviewKey(() => 'oc_sk_unrelated'), '');
  assert.equal(studentReviewKey(name => name === 'OPENROUTER_API_KEY' ? 'wrong-provider' : key), '');
});
