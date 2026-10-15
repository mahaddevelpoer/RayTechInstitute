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

  if (/noindex/i.test(robots)) continue;

  if (!title) failures.push(`${relative}: missing title`);
  if (!description) failures.push(`${relative}: missing meta description`);
  if (!canonical) failures.push(`${relative}: missing canonical`);
  if (h1Count !== 1) failures.push(`${relative}: expected 1 h1, found ${h1Count}`);
  if (jsonLdCount === 0) warnings.push(`${relative}: no JSON-LD block detected`);
  if (title.length < 30 || title.length > 65) warnings.push(`${relative}: title length ${title.length}`);
  if (description.length < 100 || description.length > 165) warnings.push(`${relative}: description length ${description.length}`);
}

console.log(`[seo] audited ${htmlFiles.length} public HTML pages`);
if (warnings.length) console.log(`[seo] warnings (${warnings.length})\n${warnings.join('\n')}`);
if (failures.length) {
  console.error(`[seo] failures (${failures.length})\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('[seo] required title, description, canonical and single-h1 checks passed');
