import type { LearningTopic } from './learning-types.ts';

const isObject = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object' && !Array.isArray(v);
const string = (v: unknown, max = 10000): v is string => typeof v === 'string' && v.length <= max;
const strings = (v: unknown, maxCount = 100): v is string[] => Array.isArray(v) && v.length <= maxCount && v.every(s => string(s, 2000));
const id = (v: unknown): v is string => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(v);

/** Normalize untrusted admin/AI JSON into a known shape before validation or SQL. */
export function parseLearningTopic(value: unknown): LearningTopic {
  const v = value;
  if (!isObject(v) || !id(v.id) || !id(v.languageId) || !string(v.slug, 120) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.slug)
    || !string(v.title, 160) || !v.title.trim() || !string(v.summary, 2000) || !string(v.content, 100000)
    || !string(v.starterCode, 20000) || !Number.isSafeInteger(v.order) || v.order < 1
    || !Number.isSafeInteger(v.version) || v.version < 1 || !['draft', 'published', 'archived'].includes(v.state)
    || !strings(v.objectives) || !strings(v.prerequisiteIds) || !v.prerequisiteIds.every(id) || !strings(v.videoIds, 20)
    || !v.videoIds.every((s: string) => /^[a-zA-Z0-9_-]{11}$/.test(s))
    || !Number.isSafeInteger(v.questionsPerAttempt) || v.questionsPerAttempt < 1 || v.questionsPerAttempt > 100
    || !Array.isArray(v.questions) || v.questions.length > 1000) throw new Error('Invalid topic fields. Check the title, slug, position and content limits.');
  const questions = v.questions.map((q: unknown) => {
    if (!isObject(q) || !id(q.id) || !string(q.question) || !string(q.explanation) || !string(q.correctOptionId, 100)
      || !Array.isArray(q.options) || q.options.length < 2 || q.options.length > 8
      || q.options.some((o: unknown) => !isObject(o) || !id(o.id) || !string(o.text, 4000))) throw new Error('Invalid question or answer options.');
    return { id: q.id, question: q.question, explanation: q.explanation, correctOptionId: q.correctOptionId, options: q.options.map((o: { id: string; text: string }) => ({ id: o.id, text: o.text })) };
  });
  let assignment: LearningTopic['assignment'] = null;
  if (v.assignment !== null) {
    const a = v.assignment;
    if (!isObject(a) || !string(a.instructions, 20000) || !strings(a.hints, 20) || !strings(a.requiredConcepts)
      || !strings(a.allowedConcepts) || !strings(a.prohibitedConcepts) || !string(a.starterCode, 20000)
      || !Array.isArray(a.rubric) || a.rubric.length > 20
      || a.rubric.some((r: unknown) => !isObject(r) || !id(r.id) || !string(r.description, 4000) || !Number.isSafeInteger(r.points) || r.points < 1 || r.points > 100)) throw new Error('Invalid assignment instructions or marking rubric.');
    assignment = { instructions: a.instructions, hints: [...a.hints], requiredConcepts: [...a.requiredConcepts], allowedConcepts: [...a.allowedConcepts], prohibitedConcepts: [...a.prohibitedConcepts], starterCode: a.starterCode, rubric: a.rubric.map((r: { id: string; description: string; points: number }) => ({ id: r.id, description: r.description, points: r.points })) };
  }
  return { id: v.id, languageId: v.languageId, slug: v.slug, title: v.title, summary: v.summary, order: v.order, version: v.version, objectives: [...v.objectives], prerequisiteIds: [...v.prerequisiteIds], content: v.content, starterCode: v.starterCode, videoIds: [...v.videoIds], questions, questionsPerAttempt: v.questionsPerAttempt, assignment, state: v.state };
}

export function topicFromRow(r: Record<string, any>): LearningTopic {
  return parseLearningTopic({ id: r.id, languageId: r.language_id, slug: r.slug, title: r.title, summary: r.summary, order: r.position, version: r.version, objectives: r.objectives, prerequisiteIds: r.prerequisite_ids, content: r.content, starterCode: r.starter_code, videoIds: r.video_ids, questions: r.questions, questionsPerAttempt: r.questions_per_attempt, assignment: r.assignment, state: r.state });
}

export function topicToRow(topic: LearningTopic) {
  const t = parseLearningTopic(topic);
  return { id: t.id, language_id: t.languageId, slug: t.slug, title: t.title, summary: t.summary, position: t.order, version: t.version, objectives: t.objectives, prerequisite_ids: t.prerequisiteIds, content: t.content, starter_code: t.starterCode, video_ids: t.videoIds, questions: t.questions, questions_per_attempt: t.questionsPerAttempt, assignment: t.assignment, state: t.state };
}
