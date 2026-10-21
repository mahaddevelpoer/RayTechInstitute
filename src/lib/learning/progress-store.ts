'use client';
import { app, auth } from '@/lib/firebase';
import { topicProgressKey } from './quiz';
import { decodeCheckpoint } from './progress';
import type { LearningTopic } from '@/types/learning';

function assertOwner(uid: string) {
  if (!auth.currentUser || auth.currentUser.uid !== uid || auth.currentUser.isAnonymous) throw new Error('Sign in to save your learning progress.');
}
export async function loadCheckpoint(uid: string, topic: LearningTopic) {
  assertOwner(uid);
  const { getFirestore, doc, getDoc } = await import('firebase/firestore/lite');
  assertOwner(uid);
  const ref = doc(getFirestore(app), 'students', uid, 'learningProgress', topicProgressKey(topic.id, topic.version));
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return { revision: 0, checkpoint: null };
  const data = snapshot.data();
  if (!Number.isSafeInteger(data.revision) || data.revision < 1 || data.topicId !== topic.id || data.version !== topic.version) throw new Error('Saved progress could not be read safely.');
  return { revision: data.revision as number, checkpoint: decodeCheckpoint(data.payload, topic) };
}
export async function writeCheckpoint(uid: string, topic: LearningTopic, payload: string, expectedRevision: number) {
  assertOwner(uid); decodeCheckpoint(payload, topic);
  const { getFirestore, doc, runTransaction, serverTimestamp } = await import('firebase/firestore/lite');
  assertOwner(uid);
  const ref = doc(getFirestore(app), 'students', uid, 'learningProgress', topicProgressKey(topic.id, topic.version));
  await runTransaction(getFirestore(app), async transaction => {
    assertOwner(uid);
    const current = await transaction.get(ref);
    const revision = current.exists() ? current.data().revision : 0;
    if (revision !== expectedRevision) throw new Error('Progress changed on another device. Reload saved progress before saving again.');
    transaction.set(ref, { topicId: topic.id, version: topic.version, revision: expectedRevision + 1, payload, updatedAt: serverTimestamp() });
  });
  return expectedRevision + 1;
}
