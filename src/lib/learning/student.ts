'use client';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { parseAssignmentReview } from './review';
import type { LearningTopic } from '@/types/learning';
import type { QuizAttempt } from './session';

export async function requestAssignmentReview(topic: LearningTopic, code: string, attempt: QuizAttempt) {
  if (!auth.currentUser || auth.currentUser.isAnonymous) throw new Error('Sign in before submitting your assignment.');
  if (!code.trim() || code.length > 20000) throw new Error('Enter a solution between 1 and 20,000 characters.');
  if (!attempt.result?.assignmentUnlocked) throw new Error('Score at least 80% on the topic test first.');
  const token = await auth.currentUser.getIdToken();
  // Include every attempted question, including unanswered questions scored as incorrect.
  const answers = Object.fromEntries(attempt.questions.map(question => [question.id, attempt.answers[question.id] || '']));
  const { data, error } = await supabase.functions.invoke('student-review', {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(60000),
    body: { topicId: topic.id, version: topic.version, code, answers },
  });
  if (error) {
    let message = 'Feedback could not be reached. Your code is still in the editor. Please try again later.';
    const response = (error as { context?: Response }).context;
    if (response && typeof response.json === 'function') {
      try { const body = await response.json(); if (typeof body.error === 'string') message = body.error.slice(0, 400); } catch { /* Keep the transport message. */ }
    }
    throw new Error(message);
  }
  if (!data?.success || data.topicId !== topic.id || data.version !== topic.version) throw new Error('The service did not return feedback for this lesson.');
  return parseAssignmentReview(JSON.stringify(data.review), topic);
}
