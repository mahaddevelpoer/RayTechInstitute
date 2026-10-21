import { consumeLearningSse, type LearningStreamEvent } from './learning-stream.ts';
import type { LearningResponseKind } from './learning-authoring.ts';

export const LEARNING_DOTS_MODEL = 'dots-studio/dots-3-note-preview:free';

export function dotsResponseSchema(kind: LearningResponseKind) {
  const text = { type: 'string' }; const texts = { type: 'array', items: text };
  const object = (properties: Record<string, unknown>) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
  const questions = { type: 'array', items: object({ id: text, question: text, options: { type: 'array', items: object({ id: text, text }) }, correctOptionId: text, explanation: text }) };
  const assignment = object({ instructions: text, hints: texts, requiredConcepts: texts, allowedConcepts: texts, prohibitedConcepts: texts,
    rubric: { type: 'array', items: object({ id: text, description: text, points: { type: 'integer', minimum: 1, maximum: 100 } }) }, starterCode: text });
  if (kind === 'content') return object({ content: text });
  if (kind === 'questions') return object({ questions, assignment });
  return object({ slug: text, title: text, summary: text, objectives: texts, prerequisiteIds: texts, content: text, starterCode: text, questions, assignment });
}

export async function generateLearningDots(key: string, system: string, prompt: string, kind: LearningResponseKind = 'topic', emit: (event: LearningStreamEvent) => void = () => {}, signal?: AbortSignal, fetcher: typeof fetch = fetch): Promise<string> {
  if (!key) throw new Error('OpenRouter course generation is not configured.');
  signal?.throwIfAborted();
  emit({ type: 'stage', stage: kind, model: LEARNING_DOTS_MODEL });
  let response: Response;
  try {
    response = await fetcher('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST', signal, headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: LEARNING_DOTS_MODEL, stream: true, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
        temperature: 0.3, max_tokens: 24576, reasoning: { enabled: false }, response_format: { type: 'json_schema', json_schema: { name: `learning_${kind}`, strict: true, schema: dotsResponseSchema(kind) } }, provider: { require_parameters: true } }),
    });
  } catch { throw new Error('The OpenRouter connection ended. Reload the catalog before retrying.'); }
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(response.status === 429 ? 'The free model rate limit was reached. Please retry later.' : 'The requested Dots free model is unavailable. No other or paid model was used.');
  }
  let content = ''; let finish: string | null = null; let done = false;
  await consumeLearningSse(response, data => {
    signal?.throwIfAborted();
    if (data === '[DONE]') { done = true; return false; }
    let chunk;
    try { chunk = JSON.parse(data); } catch { throw new Error('OpenRouter sent an invalid stream event. Nothing was saved.'); }
    if (chunk.error) throw new Error('The model reported a generation error. Nothing was saved.');
    const choice = chunk.choices?.[0];
    if (choice?.delta?.tool_calls?.length) throw new Error('Unexpected tool response. Nothing was saved.');
    if (typeof choice?.finish_reason === 'string') finish = choice.finish_reason;
    const text = choice?.delta?.content;
    if (typeof text === 'string' && text) {
      content += text;
      if (content.length > 180000) throw new Error('The generated response exceeded its safety limit. Nothing was saved.');
      emit({ type: 'delta', stage: kind, text });
    }
  });
  if (!done || finish !== 'stop' || !content.trim()) throw new Error('The model stream ended before a complete response. Nothing was saved.');
  return content;
}
