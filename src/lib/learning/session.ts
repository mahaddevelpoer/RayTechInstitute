import type { TopicQuestion } from '@/types/learning';
import { recordQuestionExposure, scoreQuiz } from './quiz';
import type { TopicCheckpoint, SavedReview } from './progress';

export interface QuizAttempt { questions: TopicQuestion[]; answers: Record<string, string>; position: number; result: ReturnType<typeof scoreQuiz> | null }
export interface LearningSessionState { attempts: Record<string, QuizAttempt>; qualified: Record<string, QuizAttempt>; seen: Record<string, Record<string, number>>; code: Record<string, string>; studied: Record<string, boolean>; feedback: Record<string, SavedReview> }
export type LearningSessionAction =
  | { type: 'start'; key: string; questions: TopicQuestion[] }
  | { type: 'answer'; key: string; optionId: string }
  | { type: 'move'; key: string; direction: -1 | 1 }
  | { type: 'submit'; key: string }
  | { type: 'code'; key: string; code: string }
  | { type: 'restore'; key: string; checkpoint: TopicCheckpoint; replace?: boolean }
  | { type: 'studied'; key: string }
  | { type: 'feedback'; key: string; feedback: SavedReview }
  | { type: 'clear' };
export const emptyLearningSession: LearningSessionState = { attempts: {}, qualified: {}, seen: {}, code: {}, studied: {}, feedback: {} };
export function learningSessionReducer(state: LearningSessionState, action: LearningSessionAction): LearningSessionState {
  if (action.type === 'clear') return emptyLearningSession;
  if (action.type === 'studied') return { ...state, studied: { ...state.studied, [action.key]: true } };
  if (action.type === 'feedback') return { ...state, feedback: { ...state.feedback, [action.key]: action.feedback } };
  if (action.type === 'restore') {
    if (action.replace) {
      state = { ...state, attempts: { ...state.attempts }, qualified: { ...state.qualified }, seen: { ...state.seen }, code: { ...state.code }, studied: { ...state.studied }, feedback: { ...state.feedback } };
      delete state.attempts[action.key]; delete state.qualified[action.key]; delete state.seen[action.key]; delete state.studied[action.key]; delete state.feedback[action.key];
      delete state.code[`${action.key}:practice`]; delete state.code[`${action.key}:assignment`];
    }
    const saved = action.checkpoint;
    const history = { ...saved.seen };
    for (const [id, count] of Object.entries(state.seen[action.key] || {})) history[id] = Math.max(history[id] || 0, count);
    const drafts = { ...state.code };
    if (saved.practiceCode !== null) drafts[`${action.key}:practice`] = drafts[`${action.key}:practice`] ?? saved.practiceCode;
    if (saved.assignmentCode !== null) drafts[`${action.key}:assignment`] = drafts[`${action.key}:assignment`] ?? saved.assignmentCode;
    return { ...state, code: drafts, seen: { ...state.seen, [action.key]: history },
      attempts: saved.attempt && !state.attempts[action.key] ? { ...state.attempts, [action.key]: saved.attempt } : state.attempts,
      qualified: saved.qualified && !state.qualified[action.key] ? { ...state.qualified, [action.key]: saved.qualified } : state.qualified,
      studied: { ...state.studied, [action.key]: !!state.studied[action.key] || saved.studied },
      feedback: saved.feedback && !state.feedback[action.key] ? { ...state.feedback, [action.key]: saved.feedback } : state.feedback,
    };
  }
  if (action.type === 'code') return { ...state, code: { ...state.code, [action.key]: action.code } };
  if (action.type === 'start') {
    if (!action.questions.length || new Set(action.questions.map(q => q.id)).size !== action.questions.length) return state;
    return { ...state, seen: { ...state.seen, [action.key]: recordQuestionExposure(state.seen[action.key] || {}, action.questions) }, attempts: { ...state.attempts, [action.key]: { questions: action.questions, answers: {}, position: 0, result: null } } };
  }
  const previous = state.attempts[action.key];
  if (!previous || previous.result) return state;
  let attempt = previous;
  if (action.type === 'answer') {
    const question = previous.questions[previous.position];
    if (!question.options.some(o => o.id === action.optionId)) return state;
    attempt = { ...previous, answers: { ...previous.answers, [question.id]: action.optionId } };
  }
  if (action.type === 'move') attempt = { ...previous, position: Math.max(0, Math.min(previous.questions.length - 1, previous.position + action.direction)) };
  if (action.type === 'submit') attempt = { ...previous, result: scoreQuiz(previous.questions, previous.answers) };
  return { ...state, qualified: attempt.result?.assignmentUnlocked ? { ...state.qualified, [action.key]: attempt } : state.qualified, attempts: { ...state.attempts, [action.key]: attempt } };
}
