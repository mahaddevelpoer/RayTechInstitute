import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const envText = await fs.readFile(path.join(root, '.env.local'), 'utf8').catch(() => '');
const env = Object.fromEntries(
  envText.split(/\r?\n/).filter((line) => line && !line.startsWith('#')).map((line) => {
    const index = line.indexOf('=');
    return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')];
  })
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const output = path.join(root, 'src', 'data', 'staticOverrides.ts');
const sitemapOutput = path.join(root, 'public', 'sitemap.xml');
const siteUrl = 'https://raytechinstitute.web.app';
const fallbackBlogImage = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80';
const seedSource = await fs.readFile(path.join(root, 'src', 'data', 'educationalData.ts'), 'utf8').catch(() => '');

const slug = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const escapeXml = (value) => String(value).replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char]));

function readSeedRouteItems(exportName) {
  const section = seedSource.match(new RegExp(`export const ${exportName}[\\s\\S]*?= \\[([\\s\\S]*?)\\n\\];`))?.[1] || '';
  const items = [];
  const itemPattern = /\{\s*id:\s*'([^']+)'[\s\S]*?classSlug:\s*'([^']+)'[\s\S]*?subjectSlug:\s*'([^']+)'/g;
  for (const match of section.matchAll(itemPattern)) {
    items.push({ id: match[1], classSlug: match[2], subjectSlug: match[3] });
  }
  return items;
}

function buildSitemap(overrides) {
  const urls = [
    ['/', 'daily', '1.0'], ['/classes/', 'weekly', '0.9'], ['/results-gazettes/', 'daily', '0.9'],
    ['/blogs/', 'daily', '0.8'], ['/privacy-policy/', 'monthly', '0.3'], ['/terms-and-conditions/', 'monthly', '0.3'],
    // Bundled seed routes remain indexable even when a protected Supabase
    // table is temporarily unavailable during a build.
    ['/classes/11th-class/', 'weekly', '0.8'], ['/classes/12th-class/', 'weekly', '0.8'],
    ['/classes/11th-class/computer-science/', 'weekly', '0.8'], ['/classes/11th-class/physics/', 'weekly', '0.8'],
    ['/classes/11th-class/mathematics/', 'weekly', '0.8'], ['/classes/12th-class/computer-science/', 'weekly', '0.8'],
    ['/classes/12th-class/physics/', 'weekly', '0.8'], ['/classes/12th-class/chemistry/', 'weekly', '0.8'],
    ['/classes/11th-class/computer-science/notes/', 'weekly', '0.8'], ['/classes/11th-class/computer-science/mcqs/', 'weekly', '0.8'],
    ['/classes/11th-class/computer-science/past-papers/', 'weekly', '0.8'], ['/classes/12th-class/computer-science/notes/', 'weekly', '0.8'],
    ['/classes/12th-class/computer-science/mcqs/', 'weekly', '0.8'], ['/classes/12th-class/computer-science/past-papers/', 'weekly', '0.8'],
  ];
  for (const item of overrides.classes || []) urls.push([`/classes/${item.slug}/`, 'weekly', '0.8']);
  for (const item of overrides.subjects || []) urls.push([`/classes/${item.classSlug}/${item.slug}/`, 'weekly', '0.8']);
  for (const item of overrides.notes || []) {
    urls.push([`/classes/${item.classSlug}/${item.subjectSlug}/notes/`, 'weekly', '0.8']);
    urls.push([`/classes/${item.classSlug}/${item.subjectSlug}/notes/${slug(item.id)}/`, 'weekly', '0.7']);
  }
  for (const item of readSeedRouteItems('INITIAL_NOTES')) {
    urls.push([`/classes/${item.classSlug}/${item.subjectSlug}/notes/`, 'weekly', '0.8']);
    urls.push([`/classes/${item.classSlug}/${item.subjectSlug}/notes/${slug(item.id)}/`, 'weekly', '0.7']);
  }
  for (const item of overrides.pastPapers || []) {
    urls.push([`/classes/${item.classSlug}/${item.subjectSlug}/past-papers/`, 'weekly', '0.8']);
    urls.push([`/classes/${item.classSlug}/${item.subjectSlug}/past-papers/${slug(item.id)}/`, 'weekly', '0.7']);
  }
  for (const item of readSeedRouteItems('INITIAL_PAST_PAPERS')) {
    urls.push([`/classes/${item.classSlug}/${item.subjectSlug}/past-papers/`, 'weekly', '0.8']);
    urls.push([`/classes/${item.classSlug}/${item.subjectSlug}/past-papers/${slug(item.id)}/`, 'weekly', '0.7']);
  }
  for (const item of overrides.gazettes || []) urls.push([`/results-gazettes/${slug(item.id)}/`, 'weekly', '0.7']);
  for (const item of overrides.blogs || []) urls.push([`/blogs/${item.slug}/`, 'weekly', '0.7']);
  const uniqueUrls = [...new Map(urls.map((entry) => [entry[0], entry])).values()];
  const lastmod = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrls.map(([route, changefreq, priority]) => `  <url>\n    <loc>${escapeXml(siteUrl + route)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
}

if (!supabaseUrl || !anonKey) {
  console.warn('[static-data] Supabase environment not available; keeping existing snapshot.');
  process.exit(0);
}

const map = {
  classes: (c) => ({ id: c.id, slug: c.slug, title: c.title, numericGrade: c.numeric_grade, description: c.description, isActive: c.is_active }),
  subjects: (s) => ({ id: s.id, classSlug: s.class_slug, slug: s.slug, title: s.title, iconName: s.icon_name, description: s.description }),
  chapters: (c) => ({ id: c.id, classSlug: c.class_slug, subjectSlug: c.subject_slug, chapterNumber: c.chapter_number, title: c.title, description: c.description || undefined, isActive: c.is_active !== false }),
  notes: (n) => ({ id: n.id, classSlug: n.class_slug, subjectSlug: n.subject_slug, chapterNumber: n.chapter_number, chapterTitle: n.chapter_title, title: n.title, description: n.description, pdfUrl: n.pdf_url, fileSize: n.file_size, downloadCount: n.download_count || 0, lastUpdated: n.last_updated, content: n.content || undefined, previewPdfUrl: n.preview_pdf_url || undefined, actionButtonText: n.action_button_text || undefined, actionButtonUrl: n.action_button_url || undefined }),
  mcqs: (m) => ({ id: m.id, classSlug: m.class_slug, subjectSlug: m.subject_slug, chapterNumber: m.chapter_number, question: m.question, codeSnippet: m.code_snippet || undefined, options: m.options, correctIndex: m.correct_index, explanation: m.explanation }),
  pastPapers: (p) => ({ id: p.id, classSlug: p.class_slug, subjectSlug: p.subject_slug, board: p.board, year: p.year, session: p.session, pdfUrl: p.pdf_url, description: p.description || undefined, content: p.content || undefined }),
  gazettes: (g) => ({ id: g.id, title: g.title, board: g.board, classSlug: g.class_slug, year: g.year, session: g.session, pdfUrl: g.pdf_url, directResultUrl: g.direct_result_url, releaseDate: g.release_date, totalCandidates: g.total_candidates, passingPercentage: g.passing_percentage, actionButtonText: g.action_button_text || undefined, actionButtonUrl: g.action_button_url || undefined, content: g.content || undefined }),
  blogs: (b) => ({ id: b.id, title: b.title, slug: b.slug, category: b.category, excerpt: b.excerpt, content: b.content, featuredImage: b.featured_image || fallbackBlogImage, author: b.author, datePublished: b.date_published, readTime: b.read_time, tags: Array.isArray(b.tags) ? b.tags : [], actionButtonText: b.action_button_text || undefined, actionButtonUrl: b.action_button_url || undefined }),
  videoMcqs: (v) => ({ id: v.id, videoId: v.video_id, videoTitle: v.video_title, timestampSeconds: Number(v.timestamp_seconds) || 0, timestampFormatted: v.timestamp_formatted || '00:00', topic: v.topic, question: v.question, codeSnippet: v.code_snippet || undefined, options: v.options, correctIndex: Number(v.correct_index) || 0, explanation: v.explanation }),
};

const overrides = {};
for (const [table, transform] of Object.entries(map)) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table === 'pastPapers' ? 'past_papers' : table === 'videoMcqs' ? 'video_mcqs' : table}?select=*`, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
  if (!response.ok) {
    console.warn(`[static-data] ${table} unavailable (${response.status}); using bundled seed data.`);
    continue;
  }
  const rows = await response.json();
  if (Array.isArray(rows) && rows.length > 0) overrides[table] = rows.map(transform);
}

const source = `import { BlogPostItem, ChapterItem, ClassItem, GazetteItem, MCQItem, NoteItem, PastPaperItem, SubjectItem, VideoInteractiveMCQ } from '@/types/educational';\n\nexport const STATIC_OVERRIDES = ${JSON.stringify(overrides, null, 2)} as {\n  classes?: ClassItem[]; subjects?: SubjectItem[]; chapters?: ChapterItem[]; notes?: NoteItem[]; mcqs?: MCQItem[]; pastPapers?: PastPaperItem[]; gazettes?: GazetteItem[]; blogs?: BlogPostItem[]; videoMcqs?: VideoInteractiveMCQ[];\n};\n`;
await fs.writeFile(output, source, 'utf8');
await fs.writeFile(sitemapOutput, buildSitemap(overrides), 'utf8');
console.log(`[static-data] Generated ${Object.keys(overrides).length} catalog sections.`);
console.log('[static-data] Generated sitemap with dynamic detail URLs.');
