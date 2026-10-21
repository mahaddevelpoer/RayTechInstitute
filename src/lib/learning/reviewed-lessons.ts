import { createHash } from 'node:crypto';
import reviewed from '@/data/reviewedLessons.json';
import type { LessonBlock } from '@/types/lesson-blocks';

/** Build/server only: data must exactly match its locally reviewed MDX source. */
export function reviewedLessonBlocks(topic: { id: string; content: string }): LessonBlock[] | undefined {
  const entry = (reviewed as Record<string, { hash: string; blocks: LessonBlock[] }>)[topic.id];
  return entry && entry.hash === createHash('sha256').update(topic.content).digest('hex') ? entry.blocks : undefined;
}
