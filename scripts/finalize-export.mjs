import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { loadTypescript } from './load-typescript.mjs';

const root = path.resolve("out");
// A disabled reader does not ship its large assets. Remove only the generated
// export copy, never source assets or the source package.
if (process.env.NEXT_PUBLIC_CODI_ENABLED === 'false') {
  const generatedCodi = path.resolve(root, 'codi');
  if (path.dirname(generatedCodi) !== root) throw new Error('Invalid generated asset target.');
  await fs.rm(generatedCodi, { recursive: true, force: true });
}
if (process.env.CODI_PREPARE_LOCAL_VOICE !== 'true') {
  // Remove only obsolete generated export copies. Keep source/local assets.
  for (const name of ['runtime', 'source', 'worker.js', 'fox.glb', 'fox-poster.jpg', 'FOX-CREDITS.txt', 'phonemizer-LICENSE.txt']) {
    const generated = path.resolve(root, 'codi', name);
    if (path.dirname(generated) !== path.resolve(root, 'codi')) throw new Error('Invalid generated Codi target.');
    await fs.rm(generated, { recursive: true, force: true });
  }
}
const urls = [];
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (
      path
        .relative(root, file)
        .split(path.sep)
        .some((part) => part.startsWith("__empty_catalog__"))
    ) {
      // Delete only generated build-placeholder files under the validated export root.
      await fs.unlink(file);
    } else if (entry.name === "index.html") {
      const html = await fs.readFile(file, "utf8");
      const route = path.relative(root, file).replaceAll(path.sep, "/");
      if (
        /^(admin\/|blogs\/post\/)/.test(route) ||
        /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html)
      )
        continue;
      const canonical = html.match(
        /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/,
      )?.[1];
      if (!canonical) throw new Error(`Missing canonical: ${route}`);
      urls.push(canonical);
    }
  }
}
await walk(root);
const escape = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const unique = [...new Set(urls)].sort();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join("\n")}\n</urlset>\n`;
const origin = new URL(unique[0]).origin;
await fs.writeFile(path.join(root, "sitemap.xml"), sitemap);
const catalog = await loadTypescript('src/data/learningCatalog.ts');
await fs.writeFile(path.join(root, 'deployment.json'), JSON.stringify({
  schema: 1, builtAt: new Date().toISOString(), revision: process.env.GITHUB_SHA || null,
  siteOrigin: origin, indexablePages: unique.length,
  sitemapSha256: createHash('sha256').update(sitemap).digest('hex'),
  learning: { courses: catalog.LEARNING_COURSES.length, languages: catalog.LEARNING_LANGUAGES.length, topics: catalog.LEARNING_TOPICS.length },
  workflowUrl: process.env.GITHUB_RUN_ID && process.env.GITHUB_REPOSITORY ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
}, null, 2));
await fs.writeFile(
  path.join(root, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /blogs/post/\nSitemap: ${origin}/sitemap.xml\n`,
);
console.log(
  `[export] Sitemap includes exactly ${unique.length} indexable exported pages. No fabricated modification dates.`,
);
