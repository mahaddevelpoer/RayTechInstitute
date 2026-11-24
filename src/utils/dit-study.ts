import syllabus from '../../content/dit/semester-one.json';
import type { ChapterItem, MCQItem, NoteItem, PastPaperItem } from '@/types/educational';
import { chapterPlacement } from './chapter-books';
import { documentLinks } from './documents';

export const DIT_CLASS = 'dit-intermediate';
export interface DitStudyCatalog {
  chapters: ChapterItem[];
  notes: NoteItem[];
  mcqs: MCQItem[];
  papers: PastPaperItem[];
}

/** Match the displayed book position, preserving stored chapter IDs and URLs. */
export function buildDitStudySubjects(catalog: DitStudyCatalog) {
  return syllabus.subjects.map(subject => {
    const book = 'book' in subject ? subject.book : undefined;
    const id = book === 'MS Office' ? 'ms-office' : book ? 'computer-networks' : subject.slug;
    const chapters = catalog.chapters.filter(chapter => chapter.classSlug === DIT_CLASS &&
      chapter.subjectSlug === subject.slug && chapter.isActive !== false &&
      (!book || chapterPlacement(chapter)?.bookTitle === book));
    const modules = subject.modules.map((title, index) => {
      const chapter = chapters.find(item => (book ? chapterPlacement(item)?.number : item.chapterNumber) === index + 1);
      const matches = (item: { classSlug: string; subjectSlug: string; chapterNumber: number }) => !!chapter &&
        item.classSlug === DIT_CLASS && item.subjectSlug === subject.slug && item.chapterNumber === chapter.chapterNumber;
      const notes = catalog.notes.filter(matches).map(note => ({
        id: note.id, title: note.title,
        href: `/classes/${DIT_CLASS}/${subject.slug}/notes/${note.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}/`,
        pdf: documentLinks(note.pdfUrl, note.previewPdfUrl).href,
        hosted: documentLinks(note.pdfUrl).hosted,
      }));
      const mcqs = catalog.mcqs.filter(matches);
      return { title, number: index + 1, chapter, notes, mcqs,
        practiceHref: mcqs.length && chapter ? `/classes/${DIT_CLASS}/${subject.slug}/mcqs/?chapter=${chapter.chapterNumber}` : '',
        available: notes.length > 0 || mcqs.length > 0,
      };
    });
    return { id, title: subject.title, slug: subject.slug, modules,
      available: modules.filter(module => module.available).length,
      mcqCount: modules.reduce((total, module) => total + module.mcqs.length, 0),
      noteCount: modules.reduce((total, module) => total + module.notes.length, 0),
      // Past-paper records are subject-level: never invent a book-specific association.
      papers: book ? [] : catalog.papers.filter(paper => paper.classSlug === DIT_CLASS && paper.subjectSlug === subject.slug),
    };
  });
}
