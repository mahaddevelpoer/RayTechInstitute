'use client';
import { supabase } from '@/lib/supabase';
import type { LearningTopic, BrowserRuntime, PublicationState } from '@/types/learning';
import { readLearningGenerationResult, type LearningStreamEvent } from '../../../supabase/functions/_shared/learning-stream';

export interface TopicEntry { topic: LearningTopic; draft: LearningTopic | null; updatedAt: string }
export interface RegistryEntry { id: string; slug: string; title: string; description: string; state: PublicationState; updated_at: string; runtime?: BrowserRuntime; language_ids?: string[] }
export interface LearningAdminCatalog { topics: TopicEntry[]; languages: RegistryEntry[]; courses: RegistryEntry[] }
export interface LearningAiSetting { enabled: boolean; updatedAt: string }

export async function learningAdminRequest(action: string, payload: Record<string, unknown> = {}) {
  if (action === 'learning_generate_next') return learningGenerateStream(payload);
  const { data, error } = await supabase.functions.invoke('secure-dispatch', { body: { action, payload }, signal: AbortSignal.timeout(30000) });
  if (error) {
    let message = 'The learning service could not be reached. Your unsaved changes are still here.';
    const response = (error as { context?: Response }).context;
    if (response && typeof response.json === 'function') {
      try { const body = await response.json(); if (typeof body?.error === 'string') message = body.error; } catch { /* Keep the safe transport message. */ }
    }
    throw new Error(message);
  }
  if (!data?.success) throw new Error(data?.error || 'The learning service did not confirm this operation.');
  if (data.rebuild) window.dispatchEvent(new CustomEvent('raytech-publish-status', { detail: { status: data.rebuild === 'failed' ? 'error' : data.rebuild, message: data.message } }));
  return data;
}

export async function learningGenerateStream(payload: Record<string, unknown>, onEvent?: (event: LearningStreamEvent) => void, signal?: AbortSignal) {
  // Use the same Firebase-authenticated SDK transport, with no application timer.
  const { data, error } = await supabase.functions.invoke('secure-dispatch', { body: { action: 'learning_generate_next', payload }, signal });
  if (error || !(data instanceof Response)) {
    if (typeof data?.error === 'string') throw new Error(data.error);
    const context = (error as { context?: Response } | null)?.context;
    if (context) {
      let message: unknown;
      try { message = (await context.json())?.error; } catch { /* Keep the safe transport error. */ }
      if (typeof message === 'string') throw new Error(message);
    }
    throw new Error('Course generation could not connect. Reload the catalog before retrying.');
  }
  return readLearningGenerationResult(data, onEvent);
}

export function newLearningTopic(languageId: string, order: number): LearningTopic {
  return { id: crypto.randomUUID(), languageId, slug: '', title: '', summary: '', order, version: 1, objectives: [], prerequisiteIds: [], content: '', starterCode: '', videoIds: [], questions: [], questionsPerAttempt: 10, state: 'draft', assignment: { instructions: '', hints: [], requiredConcepts: [], allowedConcepts: [], prohibitedConcepts: [], starterCode: '', rubric: [{ id: crypto.randomUUID(), description: '', points: 100 }] } };
}
