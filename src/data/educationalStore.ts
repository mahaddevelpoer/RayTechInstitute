'use client';

import {
  ClassItem,
  SubjectItem,
  NoteItem,
  MCQItem,
  PastPaperItem,
  GazetteItem,
  BlogPostItem,
  VideoInteractiveMCQ,
} from '@/types/educational';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_NOTES,
  INITIAL_MCQS,
  INITIAL_PAST_PAPERS,
  INITIAL_GAZETTES,
  INITIAL_BLOGS,
  INITIAL_VIDEO_MCQS,
} from './staticCatalog';
import { supabase } from '@/lib/supabase';

export {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_NOTES,
  INITIAL_MCQS,
  INITIAL_PAST_PAPERS,
  INITIAL_GAZETTES,
  INITIAL_BLOGS,
  INITIAL_VIDEO_MCQS,
};

const STORAGE_KEYS = {
  CLASSES: 'raytech_edu_classes',
  SUBJECTS: 'raytech_edu_subjects',
  NOTES: 'raytech_edu_notes',
  MCQS: 'raytech_edu_mcqs',
  PAST_PAPERS: 'raytech_edu_past_papers',
  GAZETTES: 'raytech_edu_gazettes',
  BLOGS: 'raytech_edu_blogs',
  VIDEO_MCQS: 'raytech_edu_video_mcqs',
};

const SYNC_TIMESTAMP_KEY = 'raytech_edu_last_sync_time_v2';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Minutes Cache TTL for public visitors

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  // Public pages are build-time snapshots. Only admin screens may read the
  // browser cache populated from Supabase during an editing session.
  if (!window.location.pathname.startsWith('/admin')) return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export const EducationalStore = {
  /**
   * Immediately invalidates the 15-minute cache.
   * Call this after every admin save/delete so the next public load fetches fresh data.
   */
  invalidateCache(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(SYNC_TIMESTAMP_KEY);
    } catch {}
  },

  // Sync from Supabase Cloud with Smart TTL Cache (Prevents hammering Free Tier)
  async syncFromSupabase(force: boolean = false) {
    if (typeof window === 'undefined') return;

    // 1. Check TTL: If not forced and synced within last 15 minutes, skip queries (100% Static CDN Cache hit)
    if (!force) {
      try {
        const lastSync = Number(localStorage.getItem(SYNC_TIMESTAMP_KEY) || '0');
        const isFresh = Date.now() - lastSync < CACHE_TTL_MS;
        const hasData = localStorage.getItem(STORAGE_KEYS.BLOGS) !== null;
        if (isFresh && hasData) {
          return; // Zero Supabase requests!
        }
      } catch {}
    }

    try {
      const [
        { data: classesData },
        { data: subjectsData },
        { data: notesData },
        { data: mcqsData },
        { data: pastPapersData },
        { data: gazettesData },
        { data: blogsData },
        { data: videoMcqsData },
      ] = await Promise.all([
        supabase.from('classes').select('*'),
        supabase.from('subjects').select('*'),
        supabase.from('notes').select('*'),
        supabase.from('mcqs').select('*'),
        supabase.from('past_papers').select('*'),
        supabase.from('gazettes').select('*'),
        supabase.from('blogs').select('*'),
        supabase.from('video_mcqs').select('*'),
      ]);

      if (classesData && classesData.length > 0) {
        const mappedClasses = classesData.map((c: any) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          numericGrade: c.numeric_grade,
          description: c.description,
          isActive: c.is_active,
        }));
        saveToStorage(STORAGE_KEYS.CLASSES, mappedClasses);
      }

      if (subjectsData && subjectsData.length > 0) {
        const mappedSubjects = subjectsData.map((s: any) => ({
          id: s.id,
          classSlug: s.class_slug,
          slug: s.slug,
          title: s.title,
          iconName: s.icon_name,
          description: s.description,
        }));
        saveToStorage(STORAGE_KEYS.SUBJECTS, mappedSubjects);
      }

      if (notesData && notesData.length > 0) {
        const mappedNotes = notesData.map((n: any) => ({
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
          previewPdfUrl: n.preview_pdf_url || n.previewPdfUrl || undefined,
          actionButtonText: n.action_button_text || n.actionButtonText || undefined,
          actionButtonUrl: n.action_button_url || n.actionButtonUrl || undefined,
        }));
        saveToStorage(STORAGE_KEYS.NOTES, mappedNotes);
      }

      if (mcqsData && mcqsData.length > 0) {
        const mappedMCQs = mcqsData.map((m: any) => ({
          id: m.id,
          classSlug: m.class_slug,
          subjectSlug: m.subject_slug,
          chapterNumber: m.chapter_number,
          question: m.question,
          codeSnippet: m.code_snippet,
          options: m.options,
          correctIndex: m.correct_index,
          explanation: m.explanation,
        }));
        saveToStorage(STORAGE_KEYS.MCQS, mappedMCQs);
      }

      if (pastPapersData && pastPapersData.length > 0) {
        const mappedPastPapers = pastPapersData.map((p: any) => ({
          id: p.id,
          classSlug: p.class_slug,
          subjectSlug: p.subject_slug,
          board: p.board,
          year: p.year,
          session: p.session,
          pdfUrl: p.pdf_url,
        }));
        saveToStorage(STORAGE_KEYS.PAST_PAPERS, mappedPastPapers);
      }

      if (gazettesData && gazettesData.length > 0) {
        const mappedGazettes = gazettesData.map((g: any) => ({
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
          actionButtonText: g.action_button_text || g.actionButtonText || undefined,
          actionButtonUrl: g.action_button_url || g.actionButtonUrl || undefined,
          content: g.content || undefined,
        }));
        saveToStorage(STORAGE_KEYS.GAZETTES, mappedGazettes);
      }

      if (blogsData && blogsData.length > 0) {
        const mappedBlogs = blogsData.map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          category: b.category,
          excerpt: b.excerpt,
          content: b.content,
          featuredImage: b.featured_image,
          author: b.author,
          datePublished: b.date_published,
          readTime: b.read_time,
          tags: Array.isArray(b.tags) ? b.tags : [],
          actionButtonText: b.action_button_text || b.actionButtonText || undefined,
          actionButtonUrl: b.action_button_url || b.actionButtonUrl || undefined,
        }));
        saveToStorage(STORAGE_KEYS.BLOGS, mappedBlogs);
      }

      if (videoMcqsData && videoMcqsData.length > 0) {
        const mappedVideoMcqs = videoMcqsData.map((v: any) => ({
          id: v.id,
          videoId: v.video_id,
          videoTitle: v.video_title,
          timestampSeconds: Number(v.timestamp_seconds) || 0,
          timestampFormatted: v.timestamp_formatted || '00:00',
          topic: v.topic,
          question: v.question,
          codeSnippet: v.code_snippet,
          options: v.options,
          correctIndex: Number(v.correct_index) || 0,
          explanation: v.explanation,
        }));
        saveToStorage(STORAGE_KEYS.VIDEO_MCQS, mappedVideoMcqs);
      }

      // Mark successful sync timestamp
      try {
        localStorage.setItem(SYNC_TIMESTAMP_KEY, Date.now().toString());
      } catch {}
    } catch {
      // Fallback silently to local cache and static seeds
    }
  },

  // 1. Classes
  getClasses(): ClassItem[] {
    return getFromStorage(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  },
  async saveClass(item: ClassItem): Promise<void> {
    const list = this.getClasses();
    const idx = list.findIndex((c) => c.slug === item.slug);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    saveToStorage(STORAGE_KEYS.CLASSES, list);

    const { error } = await supabase.from('classes').upsert({
      id: item.id,
      slug: item.slug,
      title: item.title,
      numeric_grade: item.numericGrade,
      description: item.description,
      is_active: item.isActive,
    });
    if (error) throw new Error(`Failed to save class: ${error.message}`);
    this.invalidateCache();
  },

  async deleteClass(slug: string): Promise<void> {
    const list = this.getClasses().filter((c) => c.slug !== slug);
    saveToStorage(STORAGE_KEYS.CLASSES, list);
    const { error } = await supabase.from('classes').delete().eq('slug', slug);
    if (error) throw new Error(`Failed to delete class: ${error.message}`);
    this.invalidateCache();
  },

  // 2. Subjects
  getSubjects(classSlug?: string): SubjectItem[] {
    const list = getFromStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    if (classSlug) return list.filter((s) => s.classSlug === classSlug);
    return list;
  },
  async saveSubject(item: SubjectItem): Promise<void> {
    const list = this.getSubjects();
    const idx = list.findIndex((s) => s.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    saveToStorage(STORAGE_KEYS.SUBJECTS, list);

    const { error } = await supabase.from('subjects').upsert({
      id: item.id,
      class_slug: item.classSlug,
      slug: item.slug,
      title: item.title,
      icon_name: item.iconName,
      description: item.description,
    });
    if (error) throw new Error(`Failed to save subject: ${error.message}`);
    this.invalidateCache();
  },
  async deleteSubject(id: string): Promise<void> {
    const list = this.getSubjects().filter((s) => s.id !== id);
    saveToStorage(STORAGE_KEYS.SUBJECTS, list);
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete subject: ${error.message}`);
    this.invalidateCache();
  },

  // 3. Notes
  getNotes(classSlug?: string, subjectSlug?: string): NoteItem[] {
    let list = getFromStorage(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    if (classSlug) list = list.filter((n) => n.classSlug === classSlug);
    if (subjectSlug) list = list.filter((n) => n.subjectSlug === subjectSlug);
    return list;
  },
  async saveNote(item: NoteItem): Promise<void> {
    const list = this.getNotes();
    const idx = list.findIndex((n) => n.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    saveToStorage(STORAGE_KEYS.NOTES, list);

    const { error } = await supabase.from('notes').upsert({
      id: item.id,
      class_slug: item.classSlug,
      subject_slug: item.subjectSlug,
      chapter_number: item.chapterNumber,
      chapter_title: item.chapterTitle,
      title: item.title,
      description: item.description,
      pdf_url: item.pdfUrl,
      file_size: item.fileSize,
      download_count: item.downloadCount,
      last_updated: item.lastUpdated,
      content: item.content || null,
      preview_pdf_url: item.previewPdfUrl || null,
      action_button_text: item.actionButtonText || null,
      action_button_url: item.actionButtonUrl || null,
    });
    if (error) throw new Error(`Failed to save note: ${error.message}`);
    this.invalidateCache();
  },
  async deleteNote(id: string): Promise<void> {
    const list = this.getNotes().filter((n) => n.id !== id);
    saveToStorage(STORAGE_KEYS.NOTES, list);
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete note: ${error.message}`);
    this.invalidateCache();
  },

  // 4. MCQs
  getMCQs(classSlug?: string, subjectSlug?: string, chapterNumber?: number): MCQItem[] {
    let list = getFromStorage(STORAGE_KEYS.MCQS, INITIAL_MCQS);
    if (classSlug) list = list.filter((m) => m.classSlug === classSlug);
    if (subjectSlug) list = list.filter((m) => m.subjectSlug === subjectSlug);
    if (chapterNumber !== undefined) list = list.filter((m) => m.chapterNumber === chapterNumber);
    return list;
  },
  async saveMCQ(item: MCQItem): Promise<void> {
    const list = this.getMCQs();
    const idx = list.findIndex((m) => m.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    saveToStorage(STORAGE_KEYS.MCQS, list);

    const { error } = await supabase.from('mcqs').upsert({
      id: item.id,
      class_slug: item.classSlug,
      subject_slug: item.subjectSlug,
      chapter_number: item.chapterNumber,
      question: item.question,
      code_snippet: item.codeSnippet,
      options: item.options,
      correct_index: item.correctIndex,
      explanation: item.explanation,
    });
    if (error) throw new Error(`Failed to save MCQ: ${error.message}`);
    this.invalidateCache();
  },
  async deleteMCQ(id: string): Promise<void> {
    const list = this.getMCQs().filter((m) => m.id !== id);
    saveToStorage(STORAGE_KEYS.MCQS, list);
    const { error } = await supabase.from('mcqs').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete MCQ: ${error.message}`);
    this.invalidateCache();
  },

  // 5. Past Papers
  getPastPapers(classSlug?: string, subjectSlug?: string): PastPaperItem[] {
    let list = getFromStorage(STORAGE_KEYS.PAST_PAPERS, INITIAL_PAST_PAPERS);
    if (classSlug) list = list.filter((p) => p.classSlug === classSlug);
    if (subjectSlug) list = list.filter((p) => p.subjectSlug === subjectSlug);
    return list;
  },
  async savePastPaper(item: PastPaperItem): Promise<void> {
    const list = this.getPastPapers();
    const idx = list.findIndex((p) => p.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    saveToStorage(STORAGE_KEYS.PAST_PAPERS, list);

    const { error } = await supabase.from('past_papers').upsert({
      id: item.id,
      class_slug: item.classSlug,
      subject_slug: item.subjectSlug,
      board: item.board,
      year: item.year,
      session: item.session,
      pdf_url: item.pdfUrl,
    });
    if (error) throw new Error(`Failed to save past paper: ${error.message}`);
    this.invalidateCache();
  },
  async deletePastPaper(id: string): Promise<void> {
    const list = this.getPastPapers().filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.PAST_PAPERS, list);
    const { error } = await supabase.from('past_papers').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete past paper: ${error.message}`);
    this.invalidateCache();
  },

  // 6. Result Gazettes
  getGazettes(classSlug?: string, board?: string): GazetteItem[] {
    let list = getFromStorage(STORAGE_KEYS.GAZETTES, INITIAL_GAZETTES);
    if (classSlug) list = list.filter((g) => g.classSlug === classSlug);
    if (board) list = list.filter((g) => g.board.toLowerCase().includes(board.toLowerCase()));
    return list;
  },
  async saveGazette(item: GazetteItem): Promise<void> {
    const list = this.getGazettes();
    const idx = list.findIndex((g) => g.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    saveToStorage(STORAGE_KEYS.GAZETTES, list);

    const { error } = await supabase.from('gazettes').upsert({
      id: item.id,
      title: item.title,
      board: item.board,
      class_slug: item.classSlug,
      year: item.year,
      session: item.session,
      pdf_url: item.pdfUrl,
      direct_result_url: item.directResultUrl,
      release_date: item.releaseDate,
      total_candidates: item.totalCandidates,
      passing_percentage: item.passingPercentage,
      action_button_text: item.actionButtonText || null,
      action_button_url: item.actionButtonUrl || null,
      content: item.content || null,
    });
    if (error) throw new Error(`Failed to save gazette: ${error.message}`);
    this.invalidateCache();
  },
  async deleteGazette(id: string): Promise<void> {
    const list = this.getGazettes().filter((g) => g.id !== id);
    saveToStorage(STORAGE_KEYS.GAZETTES, list);
    const { error } = await supabase.from('gazettes').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete gazette: ${error.message}`);
    this.invalidateCache();
  },

  // 7. Blogs
  getBlogs(category?: string): BlogPostItem[] {
    let list = getFromStorage(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
    if (category && category !== 'all') list = list.filter((b) => b.category === category);
    return list;
  },
  async saveBlog(item: BlogPostItem): Promise<void> {
    const list = this.getBlogs();
    const idx = list.findIndex((b) => b.id === item.id || b.slug === item.slug);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    saveToStorage(STORAGE_KEYS.BLOGS, list);

    const { error } = await supabase.from('blogs').upsert({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
      excerpt: item.excerpt,
      content: item.content,
      featured_image: item.featuredImage,
      author: item.author,
      date_published: item.datePublished,
      read_time: item.readTime,
      tags: item.tags,
      action_button_text: item.actionButtonText || null,
      action_button_url: item.actionButtonUrl || null,
    });
    if (error) throw new Error(`Failed to save blog: ${error.message}`);
    this.invalidateCache();
  },
  async deleteBlog(id: string): Promise<void> {
    const list = this.getBlogs().filter((b) => b.id !== id && b.slug !== id);
    saveToStorage(STORAGE_KEYS.BLOGS, list);
    const { error } = await supabase.from('blogs').delete().or(`id.eq.${id},slug.eq.${id}`);
    if (error) throw new Error(`Failed to delete blog: ${error.message}`);
    this.invalidateCache();
  },

  // 8. Video Interactive MCQs (Timeline checkpoints)
  getVideoMCQs(videoId?: string): VideoInteractiveMCQ[] {
    let list = getFromStorage(STORAGE_KEYS.VIDEO_MCQS, INITIAL_VIDEO_MCQS);
    if (videoId) list = list.filter((m) => m.videoId === videoId);
    return [...list].sort((a, b) => a.timestampSeconds - b.timestampSeconds);
  },
  async saveVideoMCQ(item: VideoInteractiveMCQ): Promise<void> {
    const list = this.getVideoMCQs();
    const idx = list.findIndex((m) => m.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    saveToStorage(STORAGE_KEYS.VIDEO_MCQS, list);

    const { error } = await supabase.from('video_mcqs').upsert({
      id: item.id,
      video_id: item.videoId,
      video_title: item.videoTitle,
      timestamp_seconds: item.timestampSeconds,
      timestamp_formatted: item.timestampFormatted,
      topic: item.topic,
      question: item.question,
      code_snippet: item.codeSnippet,
      options: item.options,
      correct_index: item.correctIndex,
      explanation: item.explanation,
    });
    if (error) throw new Error(`Failed to save video MCQ: ${error.message}`);
    this.invalidateCache();
  },
  async deleteVideoMCQ(id: string): Promise<void> {
    const list = this.getVideoMCQs().filter((m) => m.id !== id);
    saveToStorage(STORAGE_KEYS.VIDEO_MCQS, list);
    const { error } = await supabase.from('video_mcqs').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete video MCQ: ${error.message}`);
    this.invalidateCache();
  },
};

