'use client';
import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { topicProgressKey } from '@/lib/learning/quiz';
import type { LearningTopic } from '@/types/learning';
import { useLearningSession } from './LearningSession';

export function TopicProgressPanel({ topic }: { topic: LearningTopic }) {
  const { user, authReady, state, dispatch, progress, loadProgress, saveProgress } = useLearningSession();
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const key = topicProgressKey(topic.id, topic.version);
  const status = progress[key];
  const busy = status?.phase === 'loading' || status?.phase === 'saving';
  useEffect(() => { if (user && !user.isAnonymous) void loadProgress(topic); }, [user, topic, loadProgress]);
  async function login() {
    setSigningIn(true); setAuthError('');
    try { await signInWithPopup(auth, new GoogleAuthProvider()); }
    catch { setAuthError('Sign-in could not finish. Allow the sign-in window and try again.'); }
    finally { setSigningIn(false); }
  }
  function studied() { const action = { type: 'studied' as const, key }; dispatch(action); void saveProgress(topic, action); }
  return <section className="mb-6 space-y-3 rounded-md border border-[var(--border)] p-4 text-sm" aria-label="Learning progress">
    <div className="flex flex-wrap items-center justify-between gap-3"><strong>{state.studied[key] ? 'Lesson marked as studied' : 'Your learning progress'}</strong><button className="learn-button" disabled={busy || !!state.studied[key]} onClick={studied}>Mark lesson studied</button></div>
    {!authReady ? <p role="status">Checking your account...</p> : !user || user.isAnonymous ? <>
      <p>Study freely as a guest. Your answers and code stay in this session and clear when you reload. Sign in if you want to save them across visits.</p>
      <button className="learn-button" disabled={signingIn} onClick={login}>{signingIn ? 'Opening sign-in...' : 'Sign in to save progress'}</button>
    </> : <>
      <p>Use Save work before leaving to keep your current answers and editor drafts. Completed quizzes and assignment feedback save automatically.</p>
      <div className="flex flex-wrap gap-2"><button className="learn-button" disabled={busy} onClick={() => void saveProgress(topic)}>Save work</button><button className="learn-button" disabled={busy} onClick={() => { if (window.confirm('Replace this topic’s current work with the checkpoint saved to your account? Unsaved changes will be lost.')) void loadProgress(topic, true); }}>Reload saved progress</button><button className="learn-button" disabled={busy} onClick={async () => { try { await signOut(auth); } catch { setAuthError('Could not sign out. Please try again.'); } }}>Sign out</button></div>
      <p role="status" className="text-xs">{status?.phase === 'loading' ? 'Restoring your saved progress...' : status?.phase === 'saving' ? 'Saving your checkpoint...' : status?.message || 'Ready to save a checkpoint.'}</p>
      {status?.phase === 'error' && <button className="learn-button" onClick={() => void loadProgress(topic, false, true)}>Retry restoring progress</button>}
    </>}
    {authError && <p role="alert">{authError}</p>}
  </section>;
}
