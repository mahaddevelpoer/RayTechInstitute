import type { LearningTopic, AssignmentReview } from '@/types/learning';
import type { LearningSessionState, QuizAttempt } from './session';
import { scoreQuiz, topicProgressKey } from './quiz';
import { parseAssignmentReview } from './review';

export interface SavedReview { code: string; review: AssignmentReview }
export interface TopicCheckpoint {
  topicId: string; version: number; studied: boolean;
  attempt: QuizAttempt | null; qualified: QuizAttempt | null;
  seen: Record<string, number>; practiceCode: string | null; assignmentCode: string | null;
  feedback: SavedReview | null;
}
function object(value: unknown): Record<string, any> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Saved progress is invalid.');
  return value as Record<string, any>;
}
function code(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== 'string' || value.length > 20000) throw new Error('Saved code must be at most 20,000 characters.');
  return value;
}
function packAttempt(attempt: QuizAttempt | null) {
  if (!attempt) return null;
  return { ids: attempt.questions.map(q => q.id), options: attempt.questions.map(q => q.options.map(o => o.id)), answers: attempt.answers, position: attempt.position, submitted: !!attempt.result };
}
function readAttempt(value: unknown, topic: LearningTopic): QuizAttempt | null {
  if (value === null) return null;
  const saved = object(value);
  if (!Array.isArray(saved.ids) || saved.ids.length !== topic.questionsPerAttempt || new Set(saved.ids).size !== saved.ids.length
    || !Array.isArray(saved.options) || saved.options.length !== saved.ids.length
    || !Number.isSafeInteger(saved.position) || saved.position < 0 || saved.position >= saved.ids.length || typeof saved.submitted !== 'boolean') throw new Error('Saved test is invalid.');
  const answers = object(saved.answers);
  if (Object.keys(answers).some(id => !saved.ids.includes(id))) throw new Error('Saved test answers are invalid.');
  const questions = saved.ids.map((id: unknown, index: number) => {
    const question = topic.questions.find(q => q.id === id);
    const options = saved.options[index];
    if (!question || !Array.isArray(options) || options.length !== question.options.length || new Set(options).size !== options.length
      || options.some(option => !question.options.some(o => o.id === option))) throw new Error('Saved test no longer matches this lesson.');
    if (Object.prototype.hasOwnProperty.call(answers, question.id) && !question.options.some(o => o.id === answers[question.id])) throw new Error('Saved test answer is invalid.');
    return { ...question, options: options.map(id => question.options.find(o => o.id === id)!) };
  });
  return { questions, answers: { ...answers }, position: saved.position, result: saved.submitted ? scoreQuiz(questions, answers) : null };
}

export function decodeCheckpoint(payload: string, topic: LearningTopic): TopicCheckpoint {
  if (typeof payload !== 'string' || payload.length > 200000) throw new Error('Saved progress is too large.');
  const value = object(JSON.parse(payload));
  if (value.schema !== 1 || value.topicId !== topic.id || value.version !== topic.version || typeof value.studied !== 'boolean') throw new Error('Saved progress does not match this lesson version.');
  const attempt = readAttempt(value.attempt, topic);
  const qualified = readAttempt(value.qualified, topic);
  if (qualified && !qualified.result?.assignmentUnlocked) throw new Error('Saved assignment qualification is invalid.');
  const seen = object(value.seen);
  if (Object.keys(seen).length > topic.questions.length || Object.entries(seen).some(([id, count]) => !topic.questions.some(q => q.id === id) || !Number.isSafeInteger(count) || count < 0 || count > 1000000)) throw new Error('Saved question history is invalid.');
  let feedback: SavedReview | null = null;
  if (value.feedback !== null) {
    const saved = object(value.feedback); const submittedCode = code(saved.code);
    if (!qualified || submittedCode === null) throw new Error('Saved assignment feedback is invalid.');
    feedback = { code: submittedCode, review: parseAssignmentReview(JSON.stringify(saved.review), topic) };
  }
  return { topicId: topic.id, version: topic.version, studied: value.studied, attempt, qualified, seen: { ...seen }, practiceCode: code(value.practiceCode), assignmentCode: code(value.assignmentCode), feedback };
}
export function encodeCheckpoint(topic: LearningTopic, state: LearningSessionState): string {
  const key = topicProgressKey(topic.id, topic.version);
  const payload = JSON.stringify({ schema: 1, topicId: topic.id, version: topic.version,
    studied: !!state.studied[key], attempt: packAttempt(state.attempts[key] || null), qualified: packAttempt(state.qualified[key] || null), seen: state.seen[key] || {},
    practiceCode: state.code[`${key}:practice`] ?? null, assignmentCode: state.code[`${key}:assignment`] ?? null, feedback: state.feedback[key] || null,
  });
  decodeCheckpoint(payload, topic);
  return payload;
}
