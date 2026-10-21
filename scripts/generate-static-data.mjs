import fs from "node:fs/promises";
import path from "node:path";
import { fetchCatalogRows } from "./catalog-fetch.mjs";

const root = process.cwd();
const envText = await fs
  .readFile(path.join(root, ".env.local"), "utf8")
  .catch(() => "");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [
        line.slice(0, index),
        line
          .slice(index + 1)
          .trim()
          .replace(/^['"]|['"]$/g, ""),
      ];
    }),
);

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const output = path.join(root, "src", "data", "staticOverrides.ts");
const fallbackBlogImage = "/android-chrome-512x512.png";

if (!supabaseUrl || !anonKey) {
  throw new Error(
    "[static-data] Supabase configuration missing. Refusing a stale production build.",
  );
}

const map = {
  classes: (c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    numericGrade: c.numeric_grade,
    description: c.description,
    isActive: c.is_active,
  }),
  subjects: (s) => ({
    id: s.id,
    classSlug: s.class_slug,
    slug: s.slug,
    title: s.title,
    iconName: s.icon_name,
    description: s.description,
  }),
  chapters: (c) => ({
    id: c.id,
    classSlug: c.class_slug,
    subjectSlug: c.subject_slug,
    chapterNumber: c.chapter_number,
    title: c.title,
    description: c.description || undefined,
    isActive: c.is_active !== false,
  }),
  notes: (n) => ({
    id: n.id,
    classSlug: n.class_slug,
    subjectSlug: n.subject_slug,
    chapterNumber: n.chapter_number,
    chapterTitle: n.chapter_title,
    title: n.title,
    description: n.description,
    pdfUrl: n.pdf_url,
    fileSize: n.file_size,
    downloadCount: n.download_count || 0,
    lastUpdated: n.last_updated,
    content: n.content || undefined,
    previewPdfUrl: n.preview_pdf_url || undefined,
    actionButtonText: n.action_button_text || undefined,
    actionButtonUrl: n.action_button_url || undefined,
  }),
  mcqs: (m) => ({
    id: m.id,
    classSlug: m.class_slug,
    subjectSlug: m.subject_slug,
    chapterNumber: m.chapter_number,
    question: m.question,
    codeSnippet: m.code_snippet || undefined,
    options: m.options,
    correctIndex: m.correct_index,
    explanation: m.explanation,
  }),
  pastPapers: (p) => ({
    id: p.id,
    classSlug: p.class_slug,
    subjectSlug: p.subject_slug,
    board: p.board,
    year: p.year,
    session: p.session,
    pdfUrl: p.pdf_url,
    description: p.description || undefined,
    content: p.content || undefined,
  }),
  gazettes: (g) => ({
    id: g.id,
    title: g.title,
    board: g.board,
    classSlug: g.class_slug,
    year: g.year,
    session: g.session,
    pdfUrl: g.pdf_url,
    directResultUrl: g.direct_result_url,
    releaseDate: g.release_date,
    totalCandidates: g.total_candidates,
    passingPercentage: g.passing_percentage,
    actionButtonText: g.action_button_text || undefined,
    actionButtonUrl: g.action_button_url || undefined,
    content: g.content || undefined,
  }),
  blogs: (b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    category: b.category,
    excerpt: b.excerpt,
    content: b.content,
    featuredImage: b.featured_image || fallbackBlogImage,
    author: b.author,
    datePublished: b.date_published,
    readTime: b.read_time,
    tags: Array.isArray(b.tags) ? b.tags : [],
    actionButtonText: b.action_button_text || undefined,
    actionButtonUrl: b.action_button_url || undefined,
  }),
  videoMcqs: (v) => ({
    id: v.id,
    videoId: v.video_id,
    videoTitle: v.video_title,
    timestampSeconds: Number(v.timestamp_seconds) || 0,
    timestampFormatted: v.timestamp_formatted || "00:00",
    topic: v.topic,
    question: v.question,
    codeSnippet: v.code_snippet || undefined,
    options: v.options,
    correctIndex: Number(v.correct_index) || 0,
    explanation: v.explanation,
  }),
};

const overrides = {};
await Promise.all(
  Object.entries(map).map(async ([table, transform]) => {
    const name =
      table === "pastPapers"
        ? "past_papers"
        : table === "videoMcqs"
          ? "video_mcqs"
          : table;
    const rows = await fetchCatalogRows(supabaseUrl, anonKey, name);
    overrides[table] = rows.map(transform);
  }),
);

const source = `import { BlogPostItem, ChapterItem, ClassItem, GazetteItem, MCQItem, NoteItem, PastPaperItem, SubjectItem, VideoInteractiveMCQ } from '@/types/educational';\n\nexport const STATIC_OVERRIDES = ${JSON.stringify(overrides, null, 2)} as {\n  classes?: ClassItem[]; subjects?: SubjectItem[]; chapters?: ChapterItem[]; notes?: NoteItem[]; mcqs?: MCQItem[]; pastPapers?: PastPaperItem[]; gazettes?: GazetteItem[]; blogs?: BlogPostItem[]; videoMcqs?: VideoInteractiveMCQ[];\n};\n`;
await fs.writeFile(output, source, "utf8");

console.log(
  `[static-data] Generated ${Object.keys(overrides).length} catalog sections.`,
);
console.log(
  "[static-data] All publication tables fetched successfully; empty tables preserved.",
);
