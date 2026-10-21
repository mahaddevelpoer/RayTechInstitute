import { parseLearningTopic, topicFromRow, topicToRow } from './learning-records.ts';
import { findTopicConflict, validateTopicPublication } from './learning-curriculum.ts';
import { lessonQualityIssues } from './lesson-quality.ts';

export interface LearningRepository {
  list: (table: 'learning_topics' | 'learning_languages' | 'learning_courses') => Promise<Record<string, any>[]>;
  write: (record: Record<string, unknown>, expectedUpdatedAt: string | null) => Promise<void>;
  remove: (id: string, expectedUpdatedAt: string) => Promise<void>;
  updateRegistry: (table: 'learning_languages' | 'learning_courses', id: string, record: Record<string, unknown>, expectedUpdatedAt: string) => Promise<void>;
  validateVideos: (ids: string[]) => Promise<void>;
  rebuild: () => Promise<unknown>;
}

/** Call only after verified admin authorization. Never reuse student endpoints. */
export async function handleLearningAdmin(action: string, payload: Record<string, any>, repo: LearningRepository) {
  const [rows, languages, courses] = await Promise.all([repo.list('learning_topics'), repo.list('learning_languages'), repo.list('learning_courses')]);
  if (action === 'learning_catalog') return { success: true, topics: rows.map(r => ({ topic: topicFromRow(r), draft: r.pending_draft ? parseLearningTopic(r.pending_draft) : null, updatedAt: r.updated_at })), languages, courses };
  if (action === 'learning_registry_state') {
    if (!['learning_languages', 'learning_courses'].includes(payload.table) || !['draft', 'published'].includes(payload.state)) throw new Error('Invalid registry change.');
    const entries = payload.table === 'learning_languages' ? languages : courses;
    const entry = entries.find(e => e.id === payload.id);
    if (!entry || entry.updated_at !== payload.expectedUpdatedAt) throw new Error('Registry changed. Reload before saving.');
    if (payload.table === 'learning_courses' && payload.state === 'published' && (!entry.language_ids?.length || entry.language_ids.some((id: string) => !languages.some(l => l.id === id && l.state === 'published')))) throw new Error('Publish every language in this course first.');
    if (payload.table === 'learning_languages' && payload.state === 'draft' && courses.some(c => c.state === 'published' && c.language_ids?.includes(entry.id))) throw new Error('Unpublish courses using this language first.');
    await repo.updateRegistry(payload.table, entry.id, { state: payload.state, updated_at: new Date().toISOString() }, entry.updated_at);
    try { await repo.rebuild(); return { success: true, rebuild: 'queued', message: 'Visibility saved. Static rebuild requested.' }; }
    catch { return { success: true, rebuild: 'failed', message: 'Visibility saved, but the rebuild request failed. Retry the rebuild.' }; }
  }
  if (!['learning_save_draft', 'learning_publish', 'learning_delete', 'learning_discard_draft'].includes(action)) throw new Error('Unknown learning action.');
  const requestedId = ['learning_delete', 'learning_discard_draft'].includes(action) ? payload.id : payload.topic?.id;
  const previous = rows.find(r => r.id === requestedId);
  if (previous && payload.expectedUpdatedAt !== previous.updated_at) throw new Error('This topic changed in another session. Reload before saving.');
  if (!previous && payload.expectedUpdatedAt) throw new Error('This topic no longer exists. Reload the catalog.');
  const topics = rows.map(topicFromRow);
  if (action === 'learning_discard_draft') {
    if (!previous || previous.state !== 'published' || !previous.pending_draft) throw new Error('There is no saved pending draft to discard.');
    await repo.write({ id: previous.id, pending_draft: null, updated_at: new Date().toISOString() }, previous.updated_at);
    return { success: true, rebuild: 'not-needed', message: 'Pending draft discarded. The published lesson and its URL are unchanged.' };
  }
  let publicChange = false;
  if (action === 'learning_delete') {
    if (!previous) throw new Error('Topic not found.');
    if (topics.some(t => t.id !== previous.id && t.prerequisiteIds.includes(previous.id)) || rows.some(r => r.id !== previous.id && r.pending_draft?.prerequisiteIds?.includes(previous.id))) throw new Error('Another topic requires this lesson. Update its prerequisites first.');
    await repo.remove(previous.id, previous.updated_at);
    publicChange = previous.state === 'published';
  } else {
    const candidate = parseLearningTopic(payload.topic);
    if (previous && (candidate.languageId !== previous.language_id || candidate.slug !== previous.slug)) throw new Error('Keep the existing language and URL slug to preserve lesson links.');
    const language = languages.find(l => l.id === candidate.languageId);
    if (!language) throw new Error('Select an existing language.');
    const conflict = findTopicConflict(topics, candidate);
    if (conflict) throw new Error(conflict);
    candidate.version = previous ? previous.version + 1 : 1;
    candidate.state = action === 'learning_publish' ? 'published' : 'draft';
    if (action === 'learning_publish') {
      if (language.state !== 'published') throw new Error('Publish the language before publishing its lessons.');
      const errors = [...validateTopicPublication(candidate, topics), ...lessonQualityIssues(candidate.content)];
      if (topics.some(t => t.id !== candidate.id && t.state === 'published' && t.prerequisiteIds.includes(candidate.id) && t.order <= candidate.order)) errors.push('Keep this prerequisite before the published topics that depend on it.');
      if (errors.length) throw new Error(errors.join(' '));
      if (candidate.videoIds.length) await repo.validateVideos(candidate.videoIds);
      publicChange = true;
    }
    const record = action === 'learning_save_draft' && previous?.state === 'published'
      ? { id: previous.id, pending_draft: candidate, updated_at: new Date().toISOString() }
      : { ...topicToRow(candidate), pending_draft: null, updated_at: new Date().toISOString() };
    await repo.write(record, previous?.updated_at || null);
  }
  if (!publicChange) return { success: true, rebuild: 'not-needed', message: action === 'learning_delete' ? 'Draft deleted. Published content is unchanged.' : 'Draft saved. Published content is unchanged.' };
  try {
    await repo.rebuild();
    return { success: true, rebuild: 'queued', message: 'Saved. Static rebuild requested; the public website updates after deployment.' };
  } catch {
    return { success: true, rebuild: 'failed', message: 'Saved, but the rebuild request failed. Retry publishing before assuming the public website changed.' };
  }
}
