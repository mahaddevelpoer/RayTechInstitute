'use client';
import Link from 'next/link';
import type { LearningTopic } from '@/types/learning';
import { topicProgressKey } from '@/lib/learning/quiz';
import { useLearningSession } from './LearningSession';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { AssignmentSubmission } from './AssignmentSubmission';
export function TopicAssignment({ topic, languageSlug }: { topic: LearningTopic; languageSlug: string }) {
  const { state, user, progress } = useLearningSession();
  const status = progress[topicProgressKey(topic.id, topic.version)];
  if (user && !user.isAnonymous && (!status || status.phase === 'loading')) return <p role="status">Restoring your assignment progress...</p>;
  const passed = state.qualified[topicProgressKey(topic.id, topic.version)]?.result?.assignmentUnlocked;
  if (!passed) return <section className="space-y-4"><h2 className="text-xl font-semibold">Complete the topic test first</h2><p>Score at least 80% to unlock this assignment. Guest results are kept only in this learning session and reset when the page is reloaded.</p><Link className="learn-button" href={`/learn/${languageSlug}/${topic.slug}/quiz/`}>Take the topic test</Link></section>;
  if (!topic.assignment) return <p>The assignment is not available yet.</p>;
  const assignment = topic.assignment;
  return <section className="space-y-6">
    <MarkdownRenderer content={assignment.instructions} />
    <section><h2 className="mb-3 text-lg font-semibold">Use these concepts</h2><ul className="list-disc space-y-1 pl-5">{assignment.requiredConcepts.map(c => <li key={c}>{c}</li>)}</ul><p className="mt-3 text-sm">Allowed: {assignment.allowedConcepts.join(', ')}.</p>{!!assignment.prohibitedConcepts.length && <p className="mt-2 text-sm">Do not use: {assignment.prohibitedConcepts.join(', ')}.</p>}</section>
    {!!assignment.hints.length && <details className="rounded-md border border-[var(--border)] p-4"><summary className="min-h-12 cursor-pointer font-semibold">Need a hint?</summary><ul className="list-disc space-y-3 pl-5">{assignment.hints.map(hint => <li key={hint}>{hint}</li>)}</ul></details>}
    <section><h2 className="mb-3 text-lg font-semibold">How your work is assessed</h2><ul className="space-y-3">{assignment.rubric.map(r => <li key={r.id} className="flex justify-between gap-4 text-sm"><span>{r.description}</span><strong className="shrink-0">{r.points} points</strong></li>)}</ul></section>
    <AssignmentSubmission topic={topic} />
  </section>;
}
