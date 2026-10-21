import type { TopicQuestion } from './learning-types.ts';

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1) throw new Error('Random source must return a number between zero and one.');
    const j = Math.floor(value * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Select least-seen questions first, randomizing ties and answer positions.
 * Seen history belongs to a learner and topic version, not to the global bank.
 */
export function createQuizAttempt(bank: readonly TopicQuestion[], count: number, seenCounts: Readonly<Record<string, number>> = {}, random = Math.random): TopicQuestion[] {
  if (!Number.isSafeInteger(count) || count < 1 || count > bank.length) throw new Error('Questions per attempt must fit the published question bank.');
  if (new Set(bank.map(q => q.id)).size !== bank.length) throw new Error('Question IDs must be unique.');
  for (const q of bank) {
    if (q.options.length < 2 || new Set(q.options.map(o => o.id)).size !== q.options.length || !q.options.some(o => o.id === q.correctOptionId)) throw new Error('Question options or correct answer are invalid.');
  }
  const seen = (id: string) => Number.isSafeInteger(seenCounts[id]) && seenCounts[id] >= 0 ? seenCounts[id] : 0;
  return shuffle(bank, random)
    .sort((a, b) => seen(a.id) - seen(b.id))
    .slice(0, count)
    .map(q => ({ ...q, options: shuffle(q.options, random) }));
}

export function recordQuestionExposure(previous: Readonly<Record<string, number>>, questions: readonly Pick<TopicQuestion, 'id'>[]): Record<string, number> {
  const next: Record<string, number> = Object.assign(Object.create(null), previous);
  for (const q of questions) next[q.id] = (Number.isSafeInteger(next[q.id]) && next[q.id] >= 0 ? next[q.id] : 0) + 1;
  return next;
}

/** Never use rounded display percentages for access decisions. */
export function scoreQuiz(questions: readonly TopicQuestion[], answers: Readonly<Record<string, string>>) {
  if (!questions.length) throw new Error('An empty quiz cannot be submitted.');
  if (new Set(questions.map(q => q.id)).size !== questions.length) throw new Error('Question IDs must be unique.');
  const correct = questions.filter(q => answers[q.id] === q.correctOptionId).length;
  const answered = questions.filter(q => q.options.some(o => o.id === answers[q.id])).length;
  return { correct, answered, total: questions.length, percentage: Math.floor(correct * 100 / questions.length), assignmentUnlocked: correct * 100 >= questions.length * 80 };
}

export const topicProgressKey = (topicId: string, version: number) => `${encodeURIComponent(topicId)}@${version}`;
