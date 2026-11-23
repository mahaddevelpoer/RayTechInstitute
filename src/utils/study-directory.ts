import type { ClassItem, SubjectItem, ChapterItem, NoteItem, MCQItem, PastPaperItem } from '../types/educational';
import { chapterDisplayLabel } from './chapter-books';

export type StudyResource = 'all' | 'notes' | 'mcqs' | 'papers';
export interface StudyChapter {
  number: number; title: string; label: string; notes: number; mcqs: number; topics: string[];
}
export interface StudySubject {
  id: string; classSlug: string; classTitle: string; grade: number; program: string;
  slug: string; title: string; description: string; notes: number; mcqs: number; papers: number;
  chapters: StudyChapter[];
}
export interface StudyCatalog {
  classes: ClassItem[]; subjects: SubjectItem[]; chapters: ChapterItem[];
  notes: NoteItem[]; mcqs: MCQItem[]; papers: PastPaperItem[];
}
/** Public navigation contains labels and counts, never question text or answers. */
export function buildStudyDirectory(catalog: StudyCatalog): StudySubject[] {
  const classes = new Map(catalog.classes.filter(c => c.isActive).map(c => [c.slug, c]));
  const seen = new Set<string>();
  return catalog.subjects.flatMap(subject => {
    const grade = classes.get(subject.classSlug), key = `${subject.classSlug}/${subject.slug}`;
    if (!grade || seen.has(key)) return [];
    seen.add(key);
    const match = (r: {classSlug: string; subjectSlug: string}) => r.classSlug === subject.classSlug && r.subjectSlug === subject.slug;
    const notes = catalog.notes.filter(match), mcqs = catalog.mcqs.filter(match), papers = catalog.papers.filter(match);
    const named = catalog.chapters.filter(c => match(c) && c.isActive !== false);
    const numbers = Array.from(new Set([...notes, ...mcqs].map(r => r.chapterNumber))).sort((a,b) => a-b);
    const chapters = numbers.map(number => {
      const documents = notes.filter(n => n.chapterNumber === number), questions = mcqs.filter(q => q.chapterNumber === number);
      const chapter = named.find(c => c.chapterNumber === number);
      const title = chapter?.title || documents[0]?.chapterTitle || `Chapter ${number}`;
      return {number, title, label: chapterDisplayLabel(chapter || {classSlug: subject.classSlug,subjectSlug: subject.slug,chapterNumber:number,title}), notes:documents.length, mcqs:questions.length,
        topics:Array.from(new Set(questions.map(q => q.topic?.trim()).filter((t): t is string => !!t)))};
    });
    return [{id:key, classSlug:grade.slug, classTitle:grade.title, grade:grade.numericGrade, program:grade.programTitle || '', slug:subject.slug,
      title:subject.title, description:subject.description, notes:notes.length, mcqs:mcqs.length, papers:papers.length, chapters}];
  }).sort((a,b) => a.grade-b.grade || a.classTitle.localeCompare(b.classTitle) || a.title.localeCompare(b.title));
}
export const hasStudyResources = (subject: StudySubject, resource: StudyResource = 'all') => resource === 'all' ? subject.notes+subject.mcqs+subject.papers > 0 : subject[resource] > 0;
function normalize(text: string) {return text.normalize('NFKC').replace(/\bD\.?I\.?T\.?\b/gi,'DIT').toLowerCase().replace(/[.\-_/]/g, ' ').replace(/\s+/g, ' ').trim();}
export function matchesStudySearch(subject: StudySubject, query: string) {
  const words = (text: string) => normalize(text).match(new RegExp('[\\p{L}\\p{N}]+','gu')) || [];
  const terms = words(query.slice(0,180));
  const text = normalize([subject.classTitle, subject.program,subject.grade, subject.title,
    ...subject.chapters.flatMap(c => [c.title,c.label,...c.topics])].join(' '));
  const indexed = words(text);
  return terms.every(term => indexed.some(word => word.startsWith(term)));
}
export function matchingStudyChapters(subject: StudySubject, query: string) {
  return subject.chapters.filter(chapter => matchesStudySearch({...subject,chapters:[chapter]},query));
}
