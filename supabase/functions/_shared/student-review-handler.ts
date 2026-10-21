import type { LearningTopic } from './learning-types.ts';
import { buildAssignmentReviewMessages, parseAssignmentReview, REVIEW_MODEL } from './assignment-review.ts';
import { scoreQuiz } from './learning-quiz.ts';
import { readStudentSubmission, StudentRequestError, verifyStudent } from './student-auth.ts';

export interface ReviewDependencies {
  origins: string[];
  firebase: { projectId: string; webApiKey: string };
  openRouterKey: string;
  fetcher?: typeof fetch;
  getPublishedTopic: (id: string) => Promise<LearningTopic | null>;
  reserveQuota: (uid: string) => Promise<boolean>;
}

async function readProviderJson(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Missing provider response');
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 128000) { await reader.cancel(); throw new Error('Oversized provider response'); }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally { reader.releaseLock(); }
}

export function createStudentReviewHandler(deps: ReviewDependencies) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get('origin');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    if (origin && deps.origins.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
    const respond = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
    if (origin && !deps.origins.includes(origin)) return respond(403, { error: 'This origin is not allowed.' });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return respond(405, { error: 'Use POST to submit an assignment.' });
    try {
      const fetcher = deps.fetcher || fetch;
      const student = await verifyStudent(request.headers.get('authorization'), deps.firebase, fetcher);
      const submission = await readStudentSubmission(request);
      const topic = await deps.getPublishedTopic(submission.topicId);
      if (!topic || topic.state !== 'published' || !topic.assignment) throw new StudentRequestError(404, 'This assignment is not available.');
      if (topic.version !== submission.version) throw new StudentRequestError(409, 'This lesson has changed. Reload it and complete its current quiz.');
      // Practice questions are public static content, not a proctored exam.
      // Recompute marks rather than trusting a client-provided passing score.
      const ids = Object.keys(submission.answers);
      if (ids.length !== topic.questionsPerAttempt || ids.some(id => !topic.questions.some(q => q.id === id))) throw new StudentRequestError(400, 'Submit the complete topic quiz before requesting feedback.');
      const questions = topic.questions.filter(q => Object.prototype.hasOwnProperty.call(submission.answers, q.id));
      if (!scoreQuiz(questions, submission.answers).assignmentUnlocked) throw new StudentRequestError(403, 'Score at least 80% on the topic quiz to unlock this assignment.');
      if (!deps.openRouterKey) throw new StudentRequestError(503, 'Assignment feedback is not configured yet. Your code has not been sent.');
      const messages = buildAssignmentReviewMessages(topic, submission.code);
      if (!await deps.reserveQuota(student.uid)) throw new StudentRequestError(429, 'The free feedback limit has been reached. Keep practicing and try again later.');
      let provider: Response;
      try {
        provider = await fetcher('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST', signal: AbortSignal.timeout(45000),
          headers: { Authorization: `Bearer ${deps.openRouterKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: REVIEW_MODEL, messages, temperature: 0.2, max_tokens: 3000, stream: false }),
        });
      } catch { throw new StudentRequestError(503, 'Feedback timed out or is unavailable. Your code is still in the editor.'); }
      if (!provider.ok) throw new StudentRequestError(provider.status === 429 ? 429 : 503, 'The free reviewer is temporarily unavailable. No paid fallback was used.');
      let review;
      try {
        const result = await readProviderJson(provider);
        const choice = result?.choices?.[0];
        if (choice?.finish_reason !== 'stop' || typeof choice?.message?.content !== 'string' || choice.message.tool_calls?.length) throw new Error('Incomplete review');
        review = parseAssignmentReview(choice.message.content, topic);
      } catch { throw new StudentRequestError(502, 'The reviewer returned incomplete or inconsistent feedback. No passing result was recorded.'); }
      return respond(200, { success: true, topicId: topic.id, version: topic.version, review });
    } catch (error) {
      if (error instanceof StudentRequestError) return respond(error.status, { error: error.message });
      // Never return provider bodies, tokens, database diagnostics or stacks.
      return respond(503, { error: 'Assignment feedback is temporarily unavailable. Please try again later.' });
    }
  };
}
