'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import type { LearningTopic } from '@/types/learning';
import { createQuizAttempt, topicProgressKey } from '@/lib/learning/quiz';
import { useLearningSession } from './LearningSession';
import type { LearningSessionAction } from '@/lib/learning/session';

export function TopicQuiz({ topic, languageSlug }: { topic: LearningTopic; languageSlug: string }) {
  const { state, dispatch: dispatchSession, saveProgress, progress, user } = useLearningSession();
  function dispatch(action: LearningSessionAction) { dispatchSession(action); if (action.type === 'submit') void saveProgress(topic, action); }
  const key = topicProgressKey(topic.id, topic.version);
  const attempt = state.attempts[key];
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  if (user && !user.isAnonymous && (!progress[key] || progress[key].phase === 'loading')) return <p role="status">Restoring your topic test...</p>;
  function begin() {
    try { const questions = createQuizAttempt(topic.questions, topic.questionsPerAttempt, state.seen[key] || {}); dispatch({ type: 'start', key, questions }); setError(''); }
    catch { setError('This question bank is not ready. Please return to the lesson.'); }
  }
  if (!attempt) return <section className="space-y-5"><h2 className="text-xl font-semibold">Check your understanding</h2><p>This test contains {topic.questionsPerAttempt} questions. You can move backwards and change answers until you submit. Answers and explanations appear at the end.</p><p className="text-sm text-[var(--text-sub)]">Score at least 80% to unlock the assignment. New attempts prioritize questions you have not seen in this session.</p>{error && <p role="alert">{error}</p>}<button className="learn-button" onClick={begin}>Start test</button></section>;
  if (attempt.result) return <section className="space-y-6"><div role="status"><h2 className="text-2xl font-semibold">Your score: {attempt.result.percentage}%</h2><p className="mt-2">{attempt.result.correct} correct out of {attempt.result.total}. {attempt.result.assignmentUnlocked ? 'Assignment unlocked.' : 'The assignment is not unlocked yet. Review the explanations, then try again.'}</p></div><div className="flex flex-wrap gap-3"><button className="learn-button" onClick={begin}>Try a new test</button>{attempt.result.assignmentUnlocked && <Link className="learn-button" href={`/learn/${languageSlug}/${topic.slug}/assignment/`}>Open assignment</Link>}<Link className="learn-button" href={`/learn/${languageSlug}/${topic.slug}/`}>Review lesson</Link></div><h3 className="text-lg font-semibold">Answers and explanations</h3>{attempt.questions.map((q, index) => <section key={q.id} className="border-t border-[var(--border)] pt-4"><h4 className="font-semibold">{index + 1}. {q.question}</h4><p className="mt-2 text-sm">Your answer: {q.options.find(o => o.id === attempt.answers[q.id])?.text || 'Not answered'}</p><p className="mt-1 text-sm">Correct answer: {q.options.find(o => o.id === q.correctOptionId)?.text}</p><p className="mt-3 text-sm text-[var(--text-sub)]">{q.explanation}</p></section>)}</section>;
  const question = attempt.questions[attempt.position];
  function move(direction: -1 | 1) { dispatch({ type: 'move', key, direction }); requestAnimationFrame(() => heading.current?.focus()); }
  return <section className="space-y-6"><p className="text-sm text-[var(--text-muted)]">Question {attempt.position + 1} of {attempt.questions.length}. {Object.keys(attempt.answers).length} answered.</p><h2 ref={heading} tabIndex={-1} className="whitespace-pre-wrap text-xl font-semibold">{question.question}</h2><fieldset className="space-y-3"><legend className="sr-only">Choose one answer</legend>{question.options.map(option => <label key={option.id} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-md border border-[var(--border)] p-4 hover:bg-[var(--bg-soft)]"><input className="mt-1" type="radio" name={`answer-${question.id}`} checked={attempt.answers[question.id] === option.id} onChange={() => dispatch({ type: 'answer', key, optionId: option.id })} /><span className="whitespace-pre-wrap break-words text-sm">{option.text}</span></label>)}</fieldset><div className="flex flex-wrap gap-3"><button className="learn-button" disabled={attempt.position === 0} onClick={() => move(-1)}>Previous</button>{attempt.position < attempt.questions.length - 1 ? <button className="learn-button" onClick={() => move(1)}>Next question</button> : <button className="learn-button" onClick={() => { const unanswered = attempt.questions.length - Object.keys(attempt.answers).length; if (!unanswered || window.confirm(`${unanswered} question(s) unanswered. Submit anyway?`)) dispatch({ type: 'submit', key }); }}>Submit test</button>}</div><p className="text-xs text-[var(--text-muted)]">Your selections remain editable until you submit. No answers are revealed during the test.</p></section>;
}
