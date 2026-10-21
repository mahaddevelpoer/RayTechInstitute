'use client';
import { createContext, useContext, useEffect, useReducer, useRef, useState, useCallback, type Dispatch, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { emptyLearningSession, learningSessionReducer, type LearningSessionState, type LearningSessionAction } from '@/lib/learning/session';
import { loadCheckpoint, writeCheckpoint } from '@/lib/learning/progress-store';
import { encodeCheckpoint, decodeCheckpoint } from '@/lib/learning/progress';
import type { TopicCheckpoint } from '@/lib/learning/progress';
import { topicProgressKey } from '@/lib/learning/quiz';
import type { LearningTopic } from '@/types/learning';
export interface ProgressStatus { phase: 'loading' | 'ready' | 'saving' | 'saved' | 'error'; message?: string }
const Context = createContext<{
  state: LearningSessionState; dispatch: Dispatch<LearningSessionAction>; user: User | null; authReady: boolean;
  progress: Record<string, ProgressStatus>;
  loadProgress: (topic: LearningTopic, replace?: boolean, force?: boolean) => Promise<void>;
  saveProgress: (topic: LearningTopic, action?: LearningSessionAction) => Promise<void>;
} | null>(null);
export function LearningSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learningSessionReducer, emptyLearningSession);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const previousUid = useRef<string | null>(null);
  const identityEpoch = useRef(0);
  const stateRef = useRef(state); stateRef.current = state;
  const revisions = useRef(new Map<string, number>());
  const checkpoints = useRef(new Map<string, TopicCheckpoint>());
  const reads = useRef(new Map<string, Promise<void>>());
  const writes = useRef(new Map<string, Promise<void>>());
  const [progress, setProgress] = useState<Record<string, ProgressStatus>>({});
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, current => {
    if (previousUid.current !== (current?.uid || null)) {
      identityEpoch.current++;
      revisions.current.clear(); checkpoints.current.clear(); reads.current.clear(); writes.current.clear(); setProgress({});
    }
    if (previousUid.current && previousUid.current !== current?.uid) dispatch({ type: 'clear' });
    previousUid.current = current?.uid || null;
    setUser(current); setAuthReady(true);
    });
    return () => { identityEpoch.current++; unsubscribe(); };
  }, []);
  const loadProgress = useCallback(async (topic: LearningTopic, replace = false, force = false) => {
    if (!user || user.isAnonymous) return;
    const key = topicProgressKey(topic.id, topic.version);
    if (revisions.current.has(key) && !replace && !force) return;
    if (reads.current.has(key)) return reads.current.get(key);
    const epoch = identityEpoch.current;
    const valid = () => identityEpoch.current === epoch && auth.currentUser?.uid === user.uid;
    while (writes.current.has(key)) await writes.current.get(key);
    if (!valid()) return;
    revisions.current.delete(key);
    setProgress(previous => ({ ...previous, [key]: { phase: 'loading' } }));
    const promise = (async () => {
      try {
        const result = await loadCheckpoint(user.uid, topic);
        if (!valid()) return;
        revisions.current.set(key, result.revision);
        const checkpoint = result.checkpoint || decodeCheckpoint(encodeCheckpoint(topic, emptyLearningSession), topic);
        checkpoints.current.set(key, checkpoint);
        dispatch({ type: 'restore', key, checkpoint, replace });
        setProgress(previous => ({ ...previous, [key]: { phase: 'ready' } }));
      } catch {
        if (valid()) setProgress(previous => ({ ...previous, [key]: { phase: 'error', message: 'Saved progress could not be restored. Your current work is still available in this session. Try again when your connection is ready.' } }));
      } finally { if (valid()) reads.current.delete(key); }
    })();
    reads.current.set(key, promise); await promise;
  }, [user]);
  const saveProgress = useCallback(async (topic: LearningTopic, action?: LearningSessionAction) => {
    if (!user || user.isAnonymous) return;
    const key = topicProgressKey(topic.id, topic.version);
    const epoch = identityEpoch.current;
    const valid = () => identityEpoch.current === epoch && auth.currentUser?.uid === user.uid;
    const captured = action ? learningSessionReducer(stateRef.current, action) : stateRef.current;
    if (reads.current.has(key)) await reads.current.get(key);
    while (writes.current.has(key)) await writes.current.get(key);
    if (!valid()) return;
    if (!revisions.current.has(key)) {
      setProgress(previous => ({ ...previous, [key]: { phase: 'error', message: 'Restore saved progress before saving. Your current work is still in this session.' } })); return;
    }
    setProgress(previous => ({ ...previous, [key]: { phase: 'saving' } }));
    const promise = (async () => {
      try {
        const loaded = checkpoints.current.get(key);
        const snapshot = loaded ? learningSessionReducer(captured, { type: 'restore', key, checkpoint: loaded }) : captured;
        const payload = encodeCheckpoint(topic, snapshot);
        const revision = await writeCheckpoint(user.uid, topic, payload, revisions.current.get(key)!);
        if (!valid()) return;
        revisions.current.set(key, revision);
        checkpoints.current.set(key, decodeCheckpoint(payload, topic));
        setProgress(previous => ({ ...previous, [key]: { phase: 'saved', message: 'Last checkpoint saved to your account.' } }));
      } catch (error) {
        if (valid()) setProgress(previous => ({ ...previous, [key]: { phase: 'error', message: error instanceof Error && error.message.startsWith('Progress changed on another device') ? error.message : 'Progress could not be saved. Your current work is still in this session. Try again before leaving.' } }));
      } finally { if (valid()) writes.current.delete(key); }
    })();
    writes.current.set(key, promise); await promise;
  }, [user]);
  return <Context.Provider value={{ state, dispatch, user, authReady, progress, loadProgress, saveProgress }}>{children}</Context.Provider>;
}
export function useLearningSession() { const value = useContext(Context); if (!value) throw new Error('LearningSessionProvider is required.'); return value; }
