import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import type { ChapterItem, MCQItem } from '@/types/educational';
import { groupChapterBooks } from '@/utils/chapter-books';
import type { ReactNode } from 'react';

export function BookChapterPicker({ chapters, questions, selectedChapter, topics, onSelect }: {
  chapters: ChapterItem[];
  questions: MCQItem[];
  selectedChapter: number | 'all';
  topics: ReactNode;
  onSelect: (chapter: number) => void;
}) {
  return <nav className="mcq-books" aria-label="Books, chapters and topics">
    <div className="mcq-books-intro"><h2>Choose a book</h2><p>Open a chapter, then choose a topic to practise its questions.</p></div>
    {groupChapterBooks(chapters).map(book => <details key={book.id} className="mcq-book" open>
      <summary><BookOpen aria-hidden="true" size={23} /><span><strong>{book.title}</strong><small>{book.chapters.length} {book.chapters.length === 1 ? 'chapter' : 'chapters'}</small></span><ChevronDown className="mcq-book-chevron" size={20} aria-hidden="true" /></summary>
      <div className="mcq-book-chapters">{book.chapters.map(({ chapter, number, title }) => {
        const count = questions.filter(question => question.chapterNumber === chapter.chapterNumber).length;
        const selected = selectedChapter === chapter.chapterNumber;
        return <section key={chapter.id} className="mcq-book-chapter" aria-label={`${book.title}: ${title}`}>
          <button type="button" className="mcq-book-chapter-button" data-chapter-number={chapter.chapterNumber} aria-expanded={selected && !!topics} onClick={() => onSelect(chapter.chapterNumber)} disabled={!count}>
            <span className="mcq-book-chapter-number">{number}</span><span><strong>Chapter {number}: {title}</strong><small>{new Set(questions.filter(question => question.chapterNumber === chapter.chapterNumber).map(question => question.topic?.trim() || '')).size} topics · {count} MCQs</small></span><ChevronRight size={19} aria-hidden="true" />
          </button>
          {selected && topics}
        </section>;
      })}</div>
    </details>)}
  </nav>;
}
