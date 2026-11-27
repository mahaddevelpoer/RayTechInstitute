import {articleCanIndex, isLegacyArticle} from './article-indexing';
import type {BlogPostItem} from '../types/educational';

export const discoverableArticles = (posts: BlogPostItem[]) => posts.filter(articleCanIndex);
const siteHosts = new Set(['raytechinstitute.com','www.raytechinstitute.com','raytechinstitute.web.app','raytechinstitute.pages.dev','raytechinstitute.firebaseapp.com']);
/** Public navigation only: archive pages and records remain available at their URLs. */
export function isArchivedArticleHref(href: string | undefined): boolean {
  if (!href || href.startsWith('#')) return false;
  try {
    const url = new URL(href, 'https://raytechinstitute.com/');
    if (!siteHosts.has(url.hostname)) return false;
    const path = url.pathname.replace(/\/(?:index\.html|index\.txt)$/i, '/').replace(/\/+$/, '');
    const slug = path === '/blogs/post' ? url.searchParams.get('slug') : path.match(/^\/blogs\/([^/]+)$/)?.[1];
    return !!slug && isLegacyArticle({id:'',slug:decodeURIComponent(slug)});
  } catch { return false; }
}
