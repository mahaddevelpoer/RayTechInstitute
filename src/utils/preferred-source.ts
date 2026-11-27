export const PREFERRED_SOURCE_SCRIPT = 'https://news.google.com/swg/js/v1/publisher.js';
const selector = '[google-add-preferred-source-btn]';
type PreferredSourceApi = {init: (options?: {lang?: string}) => void};
type PreferredSourceWindow = Window & {PREFERRED_SOURCE?: {push: (callback: (api: PreferredSourceApi) => void) => unknown}};

export function isPreferredSourcePage(document: Document, pathname: string): boolean {
  const path = pathname.replace(/\/index\.html$/i, '/');
  if (path === '/' || !/^\/(?:classes|courses|learn|notes|mcqs|past-papers|practice|quizzes|smart-syllabus|results-gazettes)(?:\/|$)|^\/blogs\/[^/]+\/?$/.test(path)) return false;
  if (/^\/blogs\/post\/?$/.test(path)) return false;
  const robots = Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name]')).filter(meta => /^(robots|googlebot)$/i.test(meta.name));
  if (!robots.some(meta => /^robots$/i.test(meta.name))) return false;
  return !robots.some(meta => /noindex|\bnone\b/i.test(meta.content));
}

/** Mount Google's unstyled declarative container; Google owns its UI and behavior. */
export function mountPreferredSource(document: Document, pathname: string): boolean {
  if (!isPreferredSourcePage(document, pathname)) {
    document.querySelectorAll(selector).forEach(element => element.remove());
    return false;
  }
  const heading = document.querySelector('main h1') || document.querySelector('h1');
  if (!heading) return false;
  const existing = Array.from(document.querySelectorAll<HTMLElement>(selector));
  const container = existing.shift() || document.createElement('div');
  existing.forEach(element => element.remove());
  container.setAttribute('google-add-preferred-source-btn', '');
  container.setAttribute('data-lang', 'en');
  if (heading.nextElementSibling !== container) heading.after(container);
  const script = Array.from(document.scripts).find(element => element.src === PREFERRED_SOURCE_SCRIPT);
  if (!script) {
    const loader = document.createElement('script');
    loader.async = true;
    loader.src = PREFERRED_SOURCE_SCRIPT;
    document.head.appendChild(loader);
  } else if (!container.hasAttribute('data-initialized')) {
    // Google's documented callback API rescans new containers on framework navigation.
    (document.defaultView as PreferredSourceWindow | null)?.PREFERRED_SOURCE?.push(api => api.init({lang:'en'}));
  }
  return true;
}
