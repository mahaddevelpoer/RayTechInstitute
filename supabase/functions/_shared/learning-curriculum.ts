import type { LearningTopic } from './learning-types.ts';

export const SUPPORTED_RUNTIMES = ['html', 'css', 'javascript', 'php', 'python'] as const;

export function normalizedTopicKey(value: string): string {
  return value.normalize('NFKC').trim().toLowerCase().replace(new RegExp('[^\\p{L}\\p{N}]+', 'gu'), ' ').trim();
}

/** Deterministic duplicate checks supplement, not replace, AI curriculum review. */
export function findTopicConflict(existing: readonly LearningTopic[], candidate: Pick<LearningTopic, 'id' | 'languageId' | 'title' | 'slug' | 'objectives'>): string | null {
  const peers = existing.filter(t => t.languageId === candidate.languageId && t.id !== candidate.id);
  const title = normalizedTopicKey(candidate.title);
  const slug = normalizedTopicKey(candidate.slug);
  for (const topic of peers) {
    if (topic.state === 'archived') {
      if (normalizedTopicKey(topic.slug) === slug) return `This URL belongs to an archived topic: ${topic.title}. Restore or delete that topic, or use a different slug.`;
      continue;
    }
    if (normalizedTopicKey(topic.title) === title || normalizedTopicKey(topic.slug) === slug) return `This topic already exists: ${topic.title}`;
    const objectives = candidate.objectives.map(normalizedTopicKey).filter(Boolean);
    const previous = new Set(topic.objectives.map(normalizedTopicKey));
    if (objectives.length && objectives.every(o => previous.has(o))) return `These learning objectives are already covered by ${topic.title}.`;
  }
  return null;
}

export function validateTopicPublication(topic: LearningTopic, allTopics: readonly LearningTopic[]): string[] {
  const errors: string[] = [];
  if (!topic.title.trim() || !topic.content.trim() || !topic.summary.trim()) errors.push('Title, summary and lesson content are required.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.slug)) errors.push('Use a lowercase, hyphen-separated topic slug.');
  if (!Number.isSafeInteger(topic.order) || topic.order < 1 || !Number.isSafeInteger(topic.version) || topic.version < 1) errors.push('Order and version must be positive integers.');
  if (!topic.objectives.length || topic.objectives.some(o => !o.trim())) errors.push('Add clear learning objectives.');
  const conflict = findTopicConflict(allTopics, topic);
  if (conflict) errors.push(conflict);
  if (new Set(topic.prerequisiteIds).size !== topic.prerequisiteIds.length) errors.push('Prerequisites must be unique.');
  for (const id of topic.prerequisiteIds) {
    const prerequisite = allTopics.find(t => t.id === id);
    if (!prerequisite || prerequisite.languageId !== topic.languageId || prerequisite.order >= topic.order || prerequisite.state !== 'published') errors.push('Prerequisites must be earlier published topics in this language.');
  }
  if (allTopics.some(t => t.id !== topic.id && t.languageId === topic.languageId && t.state !== 'archived' && t.order === topic.order)) errors.push('Another topic already uses this position.');
  errors.push(...validateTopicAssessment(topic));
  if (topic.videoIds.some(id => !/^[a-zA-Z0-9_-]{11}$/.test(id))) errors.push('Video attachments must use valid YouTube video IDs.');
  return Array.from(new Set(errors));
}

/** Preserve operators, case and literal whitespace: code options are not topic slugs. */
export function normalizedAnswerKey(value: string): string {
  return value.normalize('NFC').replace(/\r\n?/g, '\n').trim();
}

export function validateTopicAssessment(topic: LearningTopic): string[] {
  const errors: string[] = [];
  if (!topic.questions.length || !Number.isSafeInteger(topic.questionsPerAttempt) || topic.questionsPerAttempt < 1 || topic.questionsPerAttempt > topic.questions.length) errors.push('Test size must be between one and the question-bank size.');
  if (new Set(topic.questions.map(q => q.id)).size !== topic.questions.length) errors.push('Question IDs must be unique.');
  if (new Set(topic.questions.map(q => normalizedAnswerKey(q.question))).size !== topic.questions.length) errors.push('Question prompts must be distinct.');
  for (const q of topic.questions) {
    if (!q.id.trim() || !q.question.trim() || !q.explanation.trim() || q.options.length < 2 || new Set(q.options.map(o => o.id)).size !== q.options.length || new Set(q.options.map(o => normalizedAnswerKey(o.text))).size !== q.options.length || q.options.some(o => !o.id.trim() || !o.text.trim()) || !q.options.some(o => o.id === q.correctOptionId)) errors.push(`Question ${q.id} needs distinct options, a valid answer and an explanation.`);
  }
  const a = topic.assignment;
  if (!a || !a.instructions.trim() || !a.rubric.length) errors.push('Add an assignment and marking rubric before publishing.');
  else {
    if (a.rubric.some(r => !r.id.trim() || !r.description.trim() || !Number.isSafeInteger(r.points) || r.points < 1) || a.rubric.reduce((sum, r) => sum + r.points, 0) !== 100 || new Set(a.rubric.map(r => r.id)).size !== a.rubric.length) errors.push('Rubric criteria must have unique IDs and positive points totaling 100.');
    const allowed = new Set(a.allowedConcepts.map(normalizedTopicKey));
    const prohibited = new Set(a.prohibitedConcepts.map(normalizedTopicKey));
    if (!a.requiredConcepts.length || a.requiredConcepts.some(c => !allowed.has(normalizedTopicKey(c)))) errors.push('Every required concept must be explicitly allowed.');
    if (a.allowedConcepts.some(c => prohibited.has(normalizedTopicKey(c)))) errors.push('A concept cannot be both allowed and prohibited.');
  }
  return Array.from(new Set(errors));
}
