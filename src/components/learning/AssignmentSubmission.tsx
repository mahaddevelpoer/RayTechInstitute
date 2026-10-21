'use client';
import { useRef, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { topicProgressKey } from '@/lib/learning/quiz';
import { requestAssignmentReview } from '@/lib/learning/student';
import type { LearningTopic } from '@/types/learning';
import { useLearningSession } from './LearningSession';

export function AssignmentSubmission({ topic }: { topic: LearningTopic }) {
  const { state, user, authReady, dispatch, saveProgress } = useLearningSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const key = topicProgressKey(topic.id, topic.version);
  const review = busy ? undefined : state.feedback[key]?.review;
  const reviewedCode = state.feedback[key]?.code;
  const code = state.code[`${key}:assignment`] ?? topic.assignment?.starterCode ?? '';
  const attempt = state.qualified[key];
  async function login() {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError('');
    try { await signInWithPopup(auth, new GoogleAuthProvider()); }
    catch { setError('Sign-in could not finish. Allow the sign-in window and try again.'); }
    finally { inFlight.current = false; setBusy(false); }
  }
  async function submit() {
    if (inFlight.current || !attempt || !user) return;
    inFlight.current = true; setBusy(true); setError('');
    const uid = user.uid;
    const submittedCode = code;
    try {
      const result = await requestAssignmentReview(topic, submittedCode, attempt);
      if (auth.currentUser?.uid === uid) {
        const action = { type: 'feedback' as const, key, feedback: { code: submittedCode, review: result } };
        dispatch(action); void saveProgress(topic, action);
      }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Feedback is unavailable. Your code is still in the editor.'); }
    finally { inFlight.current = false; setBusy(false); }
  }
  return <section className="space-y-4 border-t border-[var(--border)] pt-6" aria-label="Assignment feedback">
    <h2 className="text-lg font-semibold">Get feedback on your solution</h2>
    <p className="text-sm text-[var(--text-sub)]">Submitting sends your code, the lesson and assignment instructions to our AI reviewer through OpenRouter. It checks your use of the topic concepts against the marking rubric. It does not run your code. Avoid including personal information or secrets.</p>
    {!authReady ? <p role="status">Checking sign-in...</p> : user && !user.isAnonymous ? <>
      <p className="text-sm">Signed in{user.displayName ? ` as ${user.displayName}` : ''}.</p>
      <div className="flex flex-wrap gap-3"><button className="learn-button" disabled={busy || !code.trim() || code.length > 20000} onClick={submit}>{busy ? 'Reviewing your solution...' : 'Submit for feedback'}</button><button className="learn-button" disabled={busy} onClick={async () => { try { await signOut(auth); } catch { setError('Could not sign out. Please try again.'); } }}>Sign out</button></div>
      <p className="text-xs text-[var(--text-muted)]">Free feedback has a daily limit. You can keep practicing when the reviewer is unavailable.</p>
    </> : <><p className="text-sm">Sign in to submit for AI feedback. Lessons, practice and topic tests are open to everyone.</p><button className="learn-button" disabled={busy} onClick={login}>{busy ? 'Opening sign-in...' : 'Continue with Google'}</button></>}
    {error && <p role="alert" className="text-sm">{error}</p>}
    {review && user && <section className="space-y-4" aria-label="Your feedback"><h3 className="text-lg font-semibold">{review.verdict === 'pass' ? 'Assignment passed' : 'Revise your solution'}: {review.score}/100</h3>{reviewedCode !== code && <p role="status" className="text-sm">You have edited your code since this review. This feedback applies to the submitted version.</p>}<p>{review.summary}</p><ul className="space-y-3">{review.criteria.map(criterion => <li key={criterion.id}><strong>{topic.assignment?.rubric.find(item => item.id === criterion.id)?.description}: {criterion.pointsAwarded} points</strong><p className="mt-1 text-sm">{criterion.feedback}</p></li>)}</ul>{!!review.conceptViolations.length && <div><h4 className="font-semibold">Concepts to revisit</h4><ul className="list-disc pl-5">{review.conceptViolations.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}<div><h4 className="font-semibold">Next steps</h4><ul className="list-disc pl-5">{review.nextSteps.map((item, i) => <li key={i}>{item}</li>)}</ul></div><p className="text-xs text-[var(--text-muted)]">AI feedback may be mistaken. Use the lesson and rubric to check its suggestions.</p></section>}
  </section>;
}
