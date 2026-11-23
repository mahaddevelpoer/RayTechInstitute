import type { BlogPostItem } from '@/types/educational';
import { needsSourceReview } from './editorial';

const broadTags = new Set(['education', 'news', 'students', 'student guide', 'pakistan', '2026', 'study guide', 'educational guide', 'latest updates']);
const topicTags = (tags: string[]) => new Set(tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag && !broadTags.has(tag)));
const broadWords = new Set(['guide', 'reading', 'study', 'student', 'students', 'news', 'report', 'reports', 'reporting', 'official', 'source', 'sources', 'checks', 'check', 'explained', 'education', 'educational', 'context', 'information', '2026', '2027', 'pakistan']);
const words = (text: string) => new Set((text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter(word => word.length > 2 && !broadWords.has(word)));

export function relatedArticles(post: BlogPostItem, articles: BlogPostItem[]) {
  if (needsSourceReview(post.content)) return [];
  const tags = topicTags(post.tags);
  const subject = words(post.title + ' ' + (post.excerpt || ''));
  const seen = new Set<string>();
  return articles.flatMap(candidate => {
    if (candidate.id === post.id || candidate.slug === post.slug || seen.has(candidate.slug) || candidate.category !== post.category || needsSourceReview(candidate.content)) return [];
    seen.add(candidate.slug);
    const shared = [...topicTags(candidate.tags)].filter(tag => tags.has(tag));
    const candidateSubject = words(candidate.title + ' ' + (candidate.excerpt || ''));
    const hasSharedSubject = [...words(shared.join(' '))].some(word => subject.has(word) && candidateSubject.has(word));
    return shared.length >= 2 && hasSharedSubject ? [{ title: candidate.title, slug: candidate.slug, overlap: shared.length }] : [];
  }).sort((a, b) => b.overlap - a.overlap || a.slug.localeCompare(b.slug)).slice(0, 3).map(({ title, slug }) => ({ title, slug }));
}
