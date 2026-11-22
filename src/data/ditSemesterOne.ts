import type { ChapterItem, ClassItem, MCQItem, NoteItem, SubjectItem } from '@/types/educational';
import pack from '../../content/dit/ict-chapter-1.generated.json';
import pack2 from '../../content/dit/ict-chapter-2.generated.json';

export const DIT_CLASS_SLUG = 'dit-intermediate';
export const DIT_ICT_SUBJECT: SubjectItem = {
  id: 'subject-dit-ict', classSlug: DIT_CLASS_SLUG, slug: 'dit-ict',
  title: 'Introduction to ICT', iconName: 'Monitor',
  description: 'PBTE two-year D.I.T first-semester ICT. Study computer fundamentals and system unit components with chapter notes, topic MCQs and practical revision.',
};
export const DIT_ICT_CHAPTER: ChapterItem = {
  id: 'chapter-dit-ict-1', classSlug: DIT_CLASS_SLUG, subjectSlug: 'dit-ict', chapterNumber: 1,
  title: 'Introduction to Computers', isActive: true,
  description: 'Syllabus sections 1.1 to 1.6: English study notes, 60 explained MCQs, solved questions and a chapter practice test.',
};
export const DIT_ICT_MCQS: MCQItem[] = pack.questions.map(q => ({ ...q, options: q.options as MCQItem['options'] }));
export const DIT_ICT_NOTE: NoteItem = {
  id: 'dit-ict-chapter-1-introduction-to-computers', classSlug: DIT_CLASS_SLUG,
  subjectSlug: 'dit-ict', chapterNumber: 1, chapterTitle: pack.title,
  title: 'Introduction to Computers: ICT Chapter 1 Study Guide',
  description: 'Study all six PBTE ICT Chapter 1 topics with 60 explained MCQs, solved questions, practical activities and a separate practice test.',
  pdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-1-introduction-to-computers.pdf',
  previewPdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-1-introduction-to-computers.pdf',
  fileSize: `${Math.ceil(pack.pdfBytes / 1024)} KB`, downloadCount: 0, lastUpdated: '2026-11-22',
  content: pack.content,
};
export const DIT_ICT_CHAPTER_TWO: ChapterItem = {
  id: 'chapter-dit-ict-2', classSlug: DIT_CLASS_SLUG, subjectSlug: 'dit-ict', chapterNumber: 2,
  title: 'System Unit Components', isActive: true,
  description: 'Syllabus sections 2.1 to 2.6: motherboard, processor, memory, expansion, ports and power supply. Notes, 60 explained MCQs and a practice test.',
};
export const DIT_ICT_NOTE_TWO: NoteItem = {
  id: 'dit-ict-chapter-2-system-unit-components', classSlug: DIT_CLASS_SLUG,
  subjectSlug: 'dit-ict', chapterNumber: 2, chapterTitle: pack2.title,
  title: 'System Unit Components: ICT Chapter 2 Study Guide',
  description: 'Revise PBTE ICT Chapter 2 with six topic guides, 60 explained MCQs, solved questions, a component diagram and practical activities.',
  pdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-2-system-unit-components.pdf',
  previewPdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-2-system-unit-components.pdf',
  fileSize: `${Math.ceil(pack2.pdfBytes / 1024)} KB`, downloadCount: 0, lastUpdated: '2026-11-22',
  content: pack2.content,
};
export const DIT_ICT_CHAPTERS: ChapterItem[] = [DIT_ICT_CHAPTER, DIT_ICT_CHAPTER_TWO];
export const DIT_ICT_NOTES: NoteItem[] = [DIT_ICT_NOTE, DIT_ICT_NOTE_TWO];
export const DIT_ICT_ALL_MCQS: MCQItem[] = [...DIT_ICT_MCQS, ...pack2.questions.map(q => ({ ...q, options: q.options as MCQItem['options'] }))];

/** Reviewed source content is merged after each fresh database export. No existing resource IDs change. */
export function ditClassInformation(item: ClassItem): ClassItem {
  if (item.slug !== DIT_CLASS_SLUG) return item;
  return { ...item, title: 'D.I.T (2-Year)', programTitle: 'D.I.T (2-Year)', semesterNumber: 1,
    description: 'PBTE post-matric Diploma in Information Technology, two-year programme. First semester: ICT, MS Office, Computer Networks, Operating Systems and Python Programming. Each subject carries 75 theory and 25 practical marks.' };
}
export function ditSubjectInformation(item: SubjectItem): SubjectItem {
  if (item.classSlug !== DIT_CLASS_SLUG || item.slug !== 'dit-computer-science') return item;
  return { ...item, description: 'Existing first-semester MS Office and Computer Networks resources. Choose the matching book and chapter below. Introduction to ICT has its own subject page; Operating Systems and Python modules are shown in the semester syllabus overview.' };
}
export function addReviewedResources<T extends { id: string }>(existing: T[], additions: T[]): T[] {
  const ids = new Set(existing.map(item => item.id));
  for (const item of additions) {
    if (ids.has(item.id)) throw new Error(`Reviewed DIT resource ID collision: ${item.id}`);
    ids.add(item.id);
  }
  return [...existing, ...additions];
}
