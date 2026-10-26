import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.env.SEO_EXPORT_DIR || "out");
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name === "index.html") htmlFiles.push(fullPath);
  }
}

if (!fs.existsSync(root)) {
  console.error("[seo] out/ is missing. Run npm run build first.");
  process.exit(1);
}

walk(root);
const failures = [];
const warnings = [];
const canonicalHosts = new Map();
const titles = new Map();
const descriptions = new Map();
const expectedCanonicalHost = new URL(
  fs
    .readFileSync(path.join(root, "index.html"), "utf8")
    .match(/rel="canonical" href="([^"]+)"/)?.[1] ||
    "https://raytechinstitute.web.app",
).host;
const exportedCanonicals = new Set();
let auditedPages = 0;

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function resolveInternalTarget(href) {
  const withoutFragment = href.split("#")[0].split("?")[0];
  if (
    !withoutFragment ||
    !withoutFragment.startsWith("/") ||
    withoutFragment.startsWith("//")
  )
    return null;
  if (
    withoutFragment.startsWith("/_next/") ||
    withoutFragment.startsWith("/assets/")
  )
    return null;
  return decodeURIComponent(withoutFragment).replace(/\/+$/, "") || "/";
}

function exportedPathExists(route) {
  if (route === "/") return fs.existsSync(path.join(root, "index.html"));
  const relative = route.replace(/^\//, "");
  if (path.extname(relative)) return fs.existsSync(path.join(root, relative));
  return fs.existsSync(path.join(root, relative, "index.html"));
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relative =
    `/${path.relative(root, file).replaceAll(path.sep, "/")}`.replace(
      /\/index\.html$/,
      "/",
    );
  if (relative.startsWith("/admin/")) {
    if (!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) failures.push(`${relative}: private admin HTML must include noindex`);
    continue;
  }
  if (relative === "/blogs/post/") continue;
  auditedPages++;
  const title = decodeHtml(
    html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() || "",
  );
  const description = decodeHtml(
    html
      .match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1]
      ?.trim() || "",
  );
  const canonical =
    html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] || "";
  const robots =
    html.match(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i)?.[1] || "";
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const jsonLdCount = (html.match(/application\/ld\+json/gi) || []).length;
  const headings = [...html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
    .map((match) =>
      match[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean);
  const duplicateHeadings = [
    ...new Set(
      headings.filter((heading, index) => headings.indexOf(heading) !== index),
    ),
  ];

  for (const match of html.matchAll(/\bhref="([^"]+)"/gi)) {
    const target = resolveInternalTarget(decodeHtml(match[1]));
    if (target && !exportedPathExists(target)) {
      failures.push(`${relative}: broken internal link ${target}`);
    }
  }

  if (/noindex/i.test(robots)) continue;
  for (const [map, value] of [[titles, title], [descriptions, description]]) map.set(value, [...(map.get(value) || []), relative]);
  if ((html.match(/<link[^>]+rel="canonical"/gi) || []).length !== 1) failures.push(`${relative}: expected exactly one canonical tag`);
  if (!/<meta[^>]+property="og:image"[^>]+content="https:\/\//i.test(html)) failures.push(`${relative}: missing HTTPS Open Graph image`);
  for (const image of html.matchAll(new RegExp('<' + 'img\\b[^>]*>', 'gi'))) {
    if (!/\balt\s*=/i.test(image[0])) failures.push(`${relative}: image is missing alt text`);
    if (!/\bwidth\s*=/i.test(image[0]) || !/\bheight\s*=/i.test(image[0])) failures.push(`${relative}: image needs dimensions to reserve layout space`);
  }
  for (const block of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(block[1]); } catch { failures.push(`${relative}: invalid JSON-LD`); }
  }
  exportedCanonicals.add(canonical);
  for (const tag of ["header", "footer"]) {
    const count = (html.match(new RegExp("<" + tag + "(?=[\\s>])", "g")) || [])
      .length;
    if (count !== 1)
      failures.push(`${relative}: expected one ${tag}, found ${count}`);
  }

  if (!title) failures.push(`${relative}: missing title`);
  if (!description) failures.push(`${relative}: missing meta description`);
  if (!canonical) failures.push(`${relative}: missing canonical`);
  if (h1Count !== 1)
    failures.push(`${relative}: expected 1 h1, found ${h1Count}`);
  if (jsonLdCount === 0)
    warnings.push(`${relative}: no JSON-LD block detected`);
  if (duplicateHeadings.length)
    warnings.push(
      `${relative}: duplicate heading text (${duplicateHeadings.slice(0, 3).join(" | ")})`,
    );
  if (title.length < 50 || title.length > 60)
    failures.push(`${relative}: title length ${title.length}; expected 50-60`);
  if (description.length < 120 || description.length > 155)
    failures.push(
      `${relative}: description length ${description.length}; expected 120-155`,
    );
  try {
    const host = new URL(canonical).host;
    canonicalHosts.set(host, (canonicalHosts.get(host) || 0) + 1);
    if (host !== expectedCanonicalHost)
      failures.push(
        `${relative}: canonical host must be ${expectedCanonicalHost}, found ${host}`,
      );
  } catch {
    failures.push(`${relative}: invalid canonical URL`);
  }
}

console.log(`[seo] audited ${auditedPages} public content HTML pages (${htmlFiles.length} exported HTML files total)`);
for (const [kind, map] of [['title', titles], ['description', descriptions]]) {
  for (const [value, routes] of map) if (value && routes.length > 1) failures.push(`[site] duplicate ${kind}: ${routes.join(', ')}`);
}
if (canonicalHosts.size > 1)
  warnings.push(
    `[site] canonical URLs use multiple hosts: ${[...canonicalHosts.keys()].join(", ")}`,
  );
const sitemapPath = path.join(root, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  failures.push("public/sitemap.xml: missing sitemap file");
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(
    (match) => match[1],
  );
  if (!sitemapUrls.length) failures.push("out/sitemap.xml: no URLs found");
  for (const canonical of exportedCanonicals)
    if (!sitemapUrls.includes(canonical))
      failures.push(`Missing sitemap page: ${canonical}`);
  for (const url of sitemapUrls) {
    try {
      if (!exportedCanonicals.has(url))
        failures.push(`Sitemap contains nonexistent page: ${url}`);
      if (new URL(url).host !== expectedCanonicalHost)
        failures.push(`public/sitemap.xml: non-canonical host in ${url}`);
    } catch {
      failures.push(`public/sitemap.xml: invalid URL ${url}`);
    }
  }
}
if (warnings.length)
  console.log(`[seo] warnings (${warnings.length})\n${warnings.join("\n")}`);
if (failures.length) {
  console.error(`[seo] failures (${failures.length})\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(
  "[seo] required title, description, canonical and single-h1 checks passed",
);
