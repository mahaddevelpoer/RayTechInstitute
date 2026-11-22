import type { ChapterItem, ClassItem, MCQItem, NoteItem, SubjectItem } from '@/types/educational';
import pack from '../../content/dit/ict-chapter-1.generated.json';
import pack2 from '../../content/dit/ict-chapter-2.generated.json';
import pack3 from '../../content/dit/ict-chapter-3.generated.json';
import pack4 from '../../content/dit/ict-chapter-4.generated.json';
import pack5 from '../../content/dit/ict-chapter-5.generated.json';
import pack6 from '../../content/dit/ict-chapter-6.generated.json';
import pack7 from '../../content/dit/ict-chapter-7.generated.json';

export const DIT_CLASS_SLUG = 'dit-intermediate';
export const DIT_ICT_SUBJECT: SubjectItem = {
  id: 'subject-dit-ict', classSlug: DIT_CLASS_SLUG, slug: 'dit-ict',
  title: 'Introduction to ICT', iconName: 'Monitor',
  description: 'PBTE two-year D.I.T first-semester ICT: computer basics, hardware, storage, software, Internet, security and responsible use. Chapter notes, MCQs and practical revision.',
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
export const DIT_ICT_CHAPTER_THREE: ChapterItem = {
  id: 'chapter-dit-ict-3', classSlug: DIT_CLASS_SLUG, subjectSlug: 'dit-ict', chapterNumber: 3,
  title: 'Input & Output Devices', isActive: true,
  description: 'Syllabus sections 3.1 to 3.8: input, keyboards, pointing, touch, capture devices, displays, printers and other output. Notes and 80 explained MCQs.',
};
export const DIT_ICT_NOTE_THREE: NoteItem = {
  id: 'dit-ict-chapter-3-input-output-devices', classSlug: DIT_CLASS_SLUG,
  subjectSlug: 'dit-ict', chapterNumber: 3, chapterTitle: pack3.title,
  title: 'Input & Output Devices: ICT Chapter 3 Study Guide',
  description: 'Revise all eight PBTE ICT Chapter 3 sections with 80 explained MCQs, easy notes, solved questions, device comparisons and practical activities.',
  pdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-3-input-output-devices.pdf',
  previewPdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-3-input-output-devices.pdf',
  fileSize: `${Math.ceil(pack3.pdfBytes / 1024)} KB`, downloadCount: 0, lastUpdated: '2026-11-22',
  content: pack3.content,
};
export const DIT_ICT_CHAPTER_FOUR: ChapterItem = {
  id: 'chapter-dit-ict-4', classSlug: DIT_CLASS_SLUG, subjectSlug: 'dit-ict', chapterNumber: 4,
  title: 'Digital Storage', isActive: true,
  description: 'Syllabus sections 4.1 to 4.5: HDDs, RAID/NAS, flash, optical discs, tape and cloud storage. Notes, 60 explained MCQs and recovery practice.',
};
export const DIT_ICT_NOTE_FOUR: NoteItem = {
  id: 'dit-ict-chapter-4-digital-storage', classSlug: DIT_CLASS_SLUG,
  subjectSlug: 'dit-ict', chapterNumber: 4, chapterTitle: pack4.title,
  title: 'Digital Storage: ICT Chapter 4 Study Guide',
  description: 'Revise all five PBTE ICT Chapter 4 sections with 60 explained MCQs, solved questions, storage comparisons, backup and restore activities.',
  pdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-4-digital-storage.pdf',
  previewPdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-4-digital-storage.pdf',
  fileSize: `${Math.ceil(pack4.pdfBytes / 1024)} KB`, downloadCount: 0, lastUpdated: '2026-11-22',
  content: pack4.content,
};
export const DIT_ICT_CHAPTER_FIVE: ChapterItem = {
  id: 'chapter-dit-ict-5', classSlug: DIT_CLASS_SLUG, subjectSlug: 'dit-ict', chapterNumber: 5,
  title: 'System Software', isActive: true,
  description: 'Syllabus sections 5.1 to 5.5: operating systems, OS functions and types, utilities and PC maintenance. Notes, 60 explained MCQs and practical revision.',
};
export const DIT_ICT_NOTE_FIVE: NoteItem = {
  id: 'dit-ict-chapter-5-system-software', classSlug: DIT_CLASS_SLUG,
  subjectSlug: 'dit-ict', chapterNumber: 5, chapterTitle: pack5.title,
  title: 'System Software: ICT Chapter 5 Study Guide',
  description: 'Revise PBTE ICT Chapter 5 with 60 explained MCQs, OS functions, Windows/Linux roles, utilities, solved questions and PC maintenance practice.',
  pdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-5-system-software.pdf',
  previewPdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-5-system-software.pdf',
  fileSize: `${Math.ceil(pack5.pdfBytes / 1024)} KB`, downloadCount: 0, lastUpdated: '2026-11-22',
  content: pack5.content,
};
export const DIT_ICT_CHAPTER_SIX: ChapterItem = {
  id: 'chapter-dit-ict-6', classSlug: DIT_CLASS_SLUG, subjectSlug: 'dit-ict', chapterNumber: 6,
  title: 'Application Software', isActive: true,
  description: 'Syllabus sections 6.1 to 6.5: application roles, workflow, business/multimedia tools, web apps and typing assistance. Notes and 60 explained MCQs.',
};
export const DIT_ICT_NOTE_SIX: NoteItem = {
  id: 'dit-ict-chapter-6-application-software', classSlug: DIT_CLASS_SLUG,
  subjectSlug: 'dit-ict', chapterNumber: 6, chapterTitle: pack6.title,
  title: 'Application Software: ICT Chapter 6 Study Guide',
  description: 'Study PBTE ICT Chapter 6 with 60 explained MCQs, business and multimedia tools, web apps, typing calculations, solved questions and practical tasks.',
  pdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-6-application-software.pdf',
  previewPdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-6-application-software.pdf',
  fileSize: `${Math.ceil(pack6.pdfBytes / 1024)} KB`, downloadCount: 0, lastUpdated: '2026-11-22',
  content: pack6.content,
};
export const DIT_ICT_CHAPTER_SEVEN: ChapterItem = {
  id: 'chapter-dit-ict-7', classSlug: DIT_CLASS_SLUG, subjectSlug: 'dit-ict', chapterNumber: 7,
  title: 'The Internet and the World Wide Web', isActive: true,
  description: 'Syllabus sections 7.1 to 7.9: Internet, web, e-commerce, services, security, privacy, ethics, cybercrime and health. Notes and 108 explained MCQs.',
};
export const DIT_ICT_NOTE_SEVEN: NoteItem = {
  id: 'dit-ict-chapter-7-the-internet-and-world-wide-web', classSlug: DIT_CLASS_SLUG,
  subjectSlug: 'dit-ict', chapterNumber: 7, chapterTitle: pack7.title,
  title: 'Internet and World Wide Web: ICT Chapter 7 Study Guide',
  description: 'Study all nine PBTE ICT Chapter 7 sections with 108 explained MCQs, Internet and web notes, responsible computing, solved questions and practical tasks.',
  pdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-7-the-internet-and-world-wide-web.pdf',
  previewPdfUrl: 'https://raytechinstitute.com/documents/dit/ict/ict-chapter-7-the-internet-and-world-wide-web.pdf',
  fileSize: `${Math.ceil(pack7.pdfBytes / 1024)} KB`, downloadCount: 0, lastUpdated: '2026-11-22',
  content: pack7.content,
};
export const DIT_ICT_CHAPTERS: ChapterItem[] = [DIT_ICT_CHAPTER, DIT_ICT_CHAPTER_TWO, DIT_ICT_CHAPTER_THREE, DIT_ICT_CHAPTER_FOUR, DIT_ICT_CHAPTER_FIVE, DIT_ICT_CHAPTER_SIX, DIT_ICT_CHAPTER_SEVEN];
export const DIT_ICT_NOTES: NoteItem[] = [DIT_ICT_NOTE, DIT_ICT_NOTE_TWO, DIT_ICT_NOTE_THREE, DIT_ICT_NOTE_FOUR, DIT_ICT_NOTE_FIVE, DIT_ICT_NOTE_SIX, DIT_ICT_NOTE_SEVEN];
export const DIT_ICT_ALL_MCQS: MCQItem[] = [...DIT_ICT_MCQS, ...[pack2, pack3, pack4, pack5, pack6, pack7].flatMap(chapter => chapter.questions.map(q => ({ ...q, options: q.options as MCQItem['options'] })))];

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
