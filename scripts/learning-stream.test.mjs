import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { consumeLearningSse, readLearningGenerationResult, learningGenerationResponse } = await loadTypescript('supabase/functions/_shared/learning-stream.ts');
const { generateLearningDots, LEARNING_DOTS_MODEL } = await loadTypescript('supabase/functions/_shared/learning-dots.ts');
const encoder = new TextEncoder();
const event = value => `data: ${typeof value === 'string' ? value : JSON.stringify(value)}\n\n`;
const delta = text => ({ choices: [{ delta: { content: text }, finish_reason: null }] });
const stop = { choices: [{ delta: {}, finish_reason: 'stop' }] };
const response = text => new Response(new ReadableStream({ start(c) { const bytes = encoder.encode(text); for (let i = 0; i < bytes.length; i += 7) c.enqueue(bytes.slice(i, i + 7)); c.close(); } }));

test('SSE parser handles chunk boundaries, Unicode, comments and CRLF', async () => {
  const seen = [];
  await consumeLearningSse(response(': heartbeat\r\n\r\ndata: پہلا\r\ndata: second\r\n\r\n' + event('[DONE]')), data => { seen.push(data); });
  assert.deepEqual(seen, ['پہلا\nsecond', '[DONE]']);
});

test('Dots provider streams the exact free model without an application timer', async () => {
  const seen = []; const signal = new AbortController().signal;
  const result = await generateLearningDots('test-only', 'Teacher', 'Write JSON', 'topic', value => seen.push(value), signal, async (url, init) => {
    assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions'); assert.equal(init.signal, signal);
    const body = JSON.parse(init.body); assert.equal(body.model, LEARNING_DOTS_MODEL); assert.equal(body.stream, true);
    assert.equal(body.response_format.type, 'json_schema'); assert.equal(body.response_format.json_schema.strict, true);
    assert.ok(body.response_format.json_schema.schema.properties.assignment.properties.rubric.items.required.includes('points'));
    assert.equal(body.tools, undefined); assert.equal(body.models, undefined);
    return response(': processing\n\n' + event(delta('{"ok":')) + event(delta('true}')) + event(stop) + event({ choices: [] }) + event('[DONE]'));
  });
  assert.equal(result, '{"ok":true}');
  assert.equal(seen.filter(item => item.type === 'delta').map(item => item.text).join(''), result);
});

test('partial, truncated, errored and tool-call streams are never accepted as complete', async () => {
  const variants = [
    event(delta('{}')),
    event(delta('{}')) + event({ choices: [{ delta: {}, finish_reason: 'length' }] }) + event('[DONE]'),
    event({ error: { message: 'private upstream diagnostic' } }),
    event({ choices: [{ delta: { tool_calls: [{}] } }] }),
    event(delta('{}')) + event(stop),
  ];
  for (const body of variants) await assert.rejects(generateLearningDots('test-only', 'Teacher', 'JSON', 'topic', () => {}, undefined, async () => response(body)), error => !error.message.includes('private upstream'));
});

test('provider limits are sanitized and explicit cancellation stops before fetching', async () => {
  await assert.rejects(generateLearningDots('test-only', '', '', 'topic', () => {}, undefined, async () => new Response('private detail', { status: 429 })), /rate limit/);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(generateLearningDots('test-only', '', '', 'topic', () => {}, controller.signal, async () => assert.fail('must not fetch')));
});

test('UI stream consumer requires a final explicit save confirmation', async () => {
  const seen = [];
  const result = await readLearningGenerationResult(response(event({ type: 'delta', stage: 'topic', text: 'partial' }) + event({ type: 'result', result: { success: true, topicId: 'test' } })), e => seen.push(e));
  assert.equal(result.topicId, 'test'); assert.equal(seen[0].text, 'partial');
  await assert.rejects(readLearningGenerationResult(response(event({ type: 'delta', stage: 'topic', text: '{}' }))), /without a save confirmation/);
  await assert.rejects(readLearningGenerationResult(response(event({ type: 'error', error: 'Invalid assessment' }))), /Invalid assessment/);
  await assert.rejects(readLearningGenerationResult(response(event({ type: 'result', result: { success: false } }))), /did not confirm/);
});

test('server streams progress then result, or a visible error without false success', async () => {
  const progress = [];
  const result = await readLearningGenerationResult(learningGenerationResponse({}, async emit => {
    emit({ type: 'delta', stage: 'topic', text: '{' }); return { success: true, topicId: 'saved' };
  }), e => progress.push(e));
  assert.equal(result.topicId, 'saved'); assert.ok(progress.some(e => e.type === 'delta'));
  await assert.rejects(readLearningGenerationResult(learningGenerationResponse({}, async () => { throw new Error('Validation failed'); })), /Validation failed/);
});

test('disconnecting the response cancels provider work', async () => {
  let cancelled = false;
  const output = learningGenerationResponse({}, async (_, signal) => {
    await new Promise(resolve => signal.addEventListener('abort', () => { cancelled = true; resolve(); }, { once: true }));
    return {};
  });
  const reader = output.body.getReader(); await reader.read(); await reader.cancel();
  assert.equal(cancelled, true);
});
