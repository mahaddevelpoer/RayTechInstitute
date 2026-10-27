export const NEW_TOPIC_DURATION_MS = 24 * 60 * 60 * 1000;

type DatedQuestion = { createdAt?: string; topic?: string; chapterNumber: number };

export function topicFirstAdded(questions: readonly Pick<DatedQuestion, 'createdAt'>[]): number | null {
  if (!questions.length) return null;
  const times = questions.map(question => question.createdAt ? Date.parse(question.createdAt) : NaN);
  // An undated legacy question means this topic cannot safely be called new.
  return times.every(Number.isFinite) ? Math.min(...times) : null;
}

export function isRecentTopic(questions: readonly Pick<DatedQuestion, 'createdAt'>[], now: number): boolean {
  const first = topicFirstAdded(questions);
  return first !== null && Number.isFinite(now) && first <= now && now < first + NEW_TOPIC_DURATION_MS;
}

export function nextTopicExpiry(questions: readonly DatedQuestion[], now: number): number | null {
  const groups = new Map<string, DatedQuestion[]>();
  for (const question of questions) {
    const key = JSON.stringify([question.chapterNumber, question.topic?.trim() || '']);
    const group = groups.get(key);
    if (group) group.push(question);
    else groups.set(key, [question]);
  }
  const expiries = Array.from(groups.values()).map(group => {
    const first = topicFirstAdded(group);
    return first !== null && first <= now ? first + NEW_TOPIC_DURATION_MS : NaN;
  }).filter(time => time > now);
  return expiries.length ? Math.min(...expiries) : null;
}
