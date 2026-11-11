import type { BlogPostItem } from '@/types/educational';

/** Stored in ordinary article tags so the existing authenticated publisher handles CRUD. */
export function syllabusIdentity(post: Pick<BlogPostItem, 'tags'>) {
  if (!post.tags.includes('smart-syllabus')) return null;
  const grade = Number(post.tags.find(t => /^syllabus-grade-\d+$/.test(t))?.replace('syllabus-grade-', ''));
  const subject = post.tags.find(t => /^syllabus-subject-[a-z]+(?:-[a-z]+)*$/.test(t))?.replace('syllabus-subject-', '');
  const year = Number(post.tags.find(t => /^syllabus-exam-20\d{2}$/.test(t))?.replace('syllabus-exam-', ''));
  return Number.isInteger(grade) && grade > 0 && grade < 25 && subject && year ? { grade, subject, year } : null;
}

export function syllabusTags(grade: number, subject: string, year: number, other: string[] = []) {
  return Array.from(new Set(['smart-syllabus', `syllabus-grade-${grade}`, `syllabus-subject-${subject}`, `syllabus-exam-${year}`, ...other.filter(t => t !== 'smart-syllabus' && !t.startsWith('syllabus-'))]));
}

export function secureDocumentUrl(value: string) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && !u.hash; } catch { return false; }
}

export function publishedSyllabusPosts(posts: BlogPostItem[]) {
  return posts.flatMap(post => {
    const identity = syllabusIdentity(post);
    return identity && post.actionButtonUrl && secureDocumentUrl(post.actionButtonUrl)
      ? [{ ...identity, post }] : [];
  });
}

export function syllabusPath(item: { grade: number; subject: string }) {
  return `/smart-syllabus/grade-${item.grade}/${item.subject}/`;
}
