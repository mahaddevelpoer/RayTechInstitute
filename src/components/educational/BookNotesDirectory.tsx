import { BookOpen, ChevronDown, FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ChapterItem, NoteItem } from '@/types/educational';
import { groupChapterBooks } from '@/utils/chapter-books';

// Chapter notes and MCQ revision PDFs share the same chapter identity and links.
export function BookNotesDirectory({ chapters, notes, renderNote }: {
  chapters: ChapterItem[];
  notes: NoteItem[];
  renderNote: (note: NoteItem) => ReactNode;
}) {
  return <div className="mcq-books notes-book-directory" aria-label="Notes by book and chapter">
    {groupChapterBooks(chapters).map(book => {
      const count = notes.filter(note => book.chapters.some(item => item.chapter.chapterNumber === note.chapterNumber)).length;
      return <details className="mcq-book" key={book.id} open>
        <summary><BookOpen size={23} aria-hidden="true" /><span><strong>{book.title}</strong><small>{count} {count === 1 ? 'document' : 'documents'} available</small></span><ChevronDown className="mcq-book-chevron" size={20} aria-hidden="true" /></summary>
        <div className="mcq-book-chapters">{book.chapters.map(({ chapter, number, title }) => {
          const resources = notes.filter(note => note.chapterNumber === chapter.chapterNumber);
          return <details className="notes-book-chapter" key={chapter.id} open>
            <summary><FileText size={18} aria-hidden="true" /><span><strong>Chapter {number}: {title}</strong><small>{resources.length} {resources.length === 1 ? 'document' : 'documents'}</small></span><ChevronDown size={18} aria-hidden="true" /></summary>
            <div className="notes-book-documents">{resources.length ? resources.map(renderNote) : <p className="notes-book-empty">Chapter notes and MCQ revision notes will appear here when published.</p>}</div>
          </details>;
        })}</div>
      </details>;
    })}
  </div>;
}
