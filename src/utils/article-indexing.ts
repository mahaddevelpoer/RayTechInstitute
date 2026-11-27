import legacy from '../../content/editorial-policy/legacy-noindex.json';
import type { BlogPostItem } from '../types/educational';
import { needsSourceReview } from './editorial';

export const EDUCATION_CATEGORIES = ['date-sheets', 'admissions', 'career-guides', 'education'] as const;
const ids = new Set(legacy.articles.map(article => article.id));
const slugs = new Set(legacy.articles.map(article => article.slug));
export const isLegacyArticle = (post: Pick<BlogPostItem, 'id' | 'slug'>) => ids.has(post.id) || slugs.has(post.slug);
export const isEducationCategory = (category: string) => EDUCATION_CATEGORIES.some(value => value === category);
export function hasEducationReview(post: Pick<BlogPostItem, 'category' | 'seo'>): boolean {
  if (!isEducationCategory(post.category)) return false;
  if (!['pakistan-education', 'global-education'].includes(post.seo?.educationScope || '')) return false;
  return (post.seo?.sources || '').split(/\s+/).some(value => {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
  });
}
export const articleCanIndex = (post: BlogPostItem) => !isLegacyArticle(post) && hasEducationReview(post) && !needsSourceReview(post.content);
