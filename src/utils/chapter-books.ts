import type { ChapterItem } from '@/types/educational';

type ChapterIdentity = Pick<ChapterItem, 'classSlug' | 'subjectSlug' | 'chapterNumber' | 'title'> & { id?: string };

// Display positions are separate from the stored chapter numbers used by MCQs and URLs.
const ditChapters = [
  { id: 'chapter-dit-intermediate-dit-computer-science-1', titles: ['basic terminologies'], bookId: 'computer-networking', bookTitle: 'Computer Networking', number: 1, title: 'Basic Terminologies' },
  { id: 'chapter-dit-computer-science-ms-office', titles: ['ms office', 'microsoft office', 'introduction to ms office'], bookId: 'ms-office', bookTitle: 'MS Office', number: 1, title: 'Introduction to MS Office' },
  { id: 'chapter-dit-computer-science-ms-word-2016', titles: ['microsoft word 2016'], bookId: 'ms-office', bookTitle: 'MS Office', number: 2, title: 'Microsoft Word 2016' },
];

export function usesChapterBooks(classSlug: string, subjectSlug: string) {
  return classSlug === 'dit-intermediate' && subjectSlug === 'dit-computer-science';
}

export function chapterPlacement(chapter: ChapterIdentity) {
  if (!usesChapterBooks(chapter.classSlug, chapter.subjectSlug)) return null;
  const entry = ditChapters.find(item => item.id === chapter.id || item.titles.includes(chapter.title.trim().toLowerCase()));
  return entry
    ? { bookId: entry.bookId, bookTitle: entry.bookTitle, number: entry.number, title: entry.title }
    : { bookId: 'additional-chapters', bookTitle: 'Additional chapters', number: chapter.chapterNumber, title: chapter.title };
}

export function chapterDisplayLabel(chapter: ChapterIdentity) {
  const placement = chapterPlacement(chapter);
  return placement ? `${placement.bookTitle} / Chapter ${placement.number}: ${placement.title}` : `Chapter ${chapter.chapterNumber}: ${chapter.title}`;
}

export function groupChapterBooks(chapters: ChapterItem[]) {
  const books = new Map<string, { id: string; title: string; chapters: { chapter: ChapterItem; number: number; title: string }[] }>();
  for (const chapter of chapters) {
    const placement = chapterPlacement(chapter);
    if (!placement || chapter.isActive === false) continue;
    if (!books.has(placement.bookId)) books.set(placement.bookId, { id: placement.bookId, title: placement.bookTitle, chapters: [] });
    books.get(placement.bookId)!.chapters.push({ chapter, number: placement.number, title: placement.title });
  }
  const order = ['computer-networking', 'ms-office', 'additional-chapters'];
  return Array.from(books.values()).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)).map(book => ({ ...book, chapters: book.chapters.sort((a, b) => a.number - b.number) }));
}
