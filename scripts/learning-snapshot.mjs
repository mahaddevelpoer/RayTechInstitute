import { loadTypescript } from './load-typescript.mjs';
const { topicFromRow } = await loadTypescript('supabase/functions/_shared/learning-records.ts');
const { validateTopicPublication, SUPPORTED_RUNTIMES } = await loadTypescript('supabase/functions/_shared/learning-curriculum.ts');

export function buildLearningSnapshot(rows) {
  if (!rows || !['languages', 'courses', 'topics'].every(key => Array.isArray(rows[key]))) throw new Error('Incomplete learning catalog.');
  const languages = rows.languages.filter(l => l.state === 'published').map(l => {
    if (!SUPPORTED_RUNTIMES.includes(l.runtime) || typeof l.id !== 'string' || !l.id.trim() || typeof l.title !== 'string' || !l.title.trim() || typeof l.slug !== 'string' || (l.description !== undefined && typeof l.description !== 'string') || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(l.slug)) throw new Error('Invalid published language.');
    return { id: l.id, slug: l.slug, title: l.title, description: l.description || '', runtime: l.runtime, state: 'published' };
  });
  const languageIds = new Set(languages.map(l => l.id));
  const topics = rows.topics.filter(t => t.state === 'published' && languageIds.has(t.language_id)).map(topicFromRow);
  for (const topic of topics) {
    const errors = validateTopicPublication(topic, topics);
    if (errors.length) throw new Error(`Cannot publish lesson ${topic.id}: ${errors.join(' ')}`);
  }
  const courses = rows.courses.filter(c => c.state === 'published').map(c => {
    if (typeof c.id !== 'string' || !c.id.trim() || !Array.isArray(c.language_ids) || !c.language_ids.length || new Set(c.language_ids).size !== c.language_ids.length || c.language_ids.some(id => !languageIds.has(id)) || typeof c.title !== 'string' || !c.title.trim() || typeof c.slug !== 'string' || (c.description !== undefined && typeof c.description !== 'string') || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug)) throw new Error('A published course has invalid identity, content or language tracks.');
    return { id: c.id, slug: c.slug, title: c.title, description: c.description || '', languageIds: [...c.language_ids], state: 'published' };
  });
  for (const items of [languages, courses, topics]) {
    if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('Duplicate catalog IDs.');
  }
  for (const items of [languages, courses]) {
    if (new Set(items.map(item => item.slug)).size !== items.length) throw new Error('Duplicate public registry URLs.');
  }
  return { languages, courses, topics: topics.sort((a, b) => a.languageId.localeCompare(b.languageId) || a.order - b.order) };
}
