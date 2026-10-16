import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('out');
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name === 'index.html') htmlFiles.push(fullPath);
  }
}

if (!fs.existsSync(root)) {
  console.error('[seo] out/ is missing. Run npm run build first.');
  process.exit(1);
}

walk(root);
const failures = [];
const warnings = [];
const canonicalHosts = new Map();
const expectedCanonicalHost = 'raytechinstitute.web.app';

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = `/${path.relative(root, file).replaceAll(path.sep, '/')}`.replace(/\/index\.html$/, '/');
  if (relative.startsWith('/admin/')) continue;
  if (relative === '/blogs/post/') continue;
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() || '';
  const description = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1]?.trim() || '';
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] || '';
  const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i)?.[1] || '';
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const jsonLdCount = (html.match(/application\/ld\+json/gi) || []).length;
  const headings = [...html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
    .map((match) => match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase())
    .filter(Boolean);
  const duplicateHeadings = [...new Set(headings.filter((heading, index) => headings.indexOf(heading) !== index))];

  if (/noindex/i.test(robots)) continue;

  if (!title) failures.push(`${relative}: missing title`);
  if (!description) failures.push(`${relative}: missing meta description`);
  if (!canonical) failures.push(`${relative}: missing canonical`);
  if (h1Count !== 1) failures.push(`${relative}: expected 1 h1, found ${h1Count}`);
  if (jsonLdCount === 0) warnings.push(`${relative}: no JSON-LD block detected`);
  if (duplicateHeadings.length) warnings.push(`${relative}: duplicate heading text (${duplicateHeadings.slice(0, 3).join(' | ')})`);
  if (title.length < 30 || title.length > 65) warnings.push(`${relative}: title length ${title.length}`);
  if (description.length < 100 || description.length > 165) warnings.push(`${relative}: description length ${description.length}`);
  try {
    const host = new URL(canonical).host;
    canonicalHosts.set(host, (canonicalHosts.get(host) || 0) + 1);
    if (host !== expectedCanonicalHost) failures.push(`${relative}: canonical host must be ${expectedCanonicalHost}, found ${host}`);
  } catch {
    failures.push(`${relative}: invalid canonical URL`);
  }
}

console.log(`[seo] audited ${htmlFiles.length} public HTML pages`);
if (canonicalHosts.size > 1) warnings.push(`[site] canonical URLs use multiple hosts: ${[...canonicalHosts.keys()].join(', ')}`);
const sitemapPath = path.resolve('public', 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  failures.push('public/sitemap.xml: missing sitemap file');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1]);
  if (!sitemapUrls.length) failures.push('public/sitemap.xml: no URLs found');
  for (const url of sitemapUrls) {
    try {
      if (new URL(url).host !== expectedCanonicalHost) failures.push(`public/sitemap.xml: non-canonical host in ${url}`);
    } catch {
      failures.push(`public/sitemap.xml: invalid URL ${url}`);
    }
  }
}
if (warnings.length) console.log(`[seo] warnings (${warnings.length})\n${warnings.join('\n')}`);
if (failures.length) {
  console.error(`[seo] failures (${failures.length})\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('[seo] required title, description, canonical and single-h1 checks passed');
