import Link from 'next/link';
import syllabus from '../../../content/dit/semester-one.json';
import { INITIAL_CHAPTERS, INITIAL_MCQS, INITIAL_NOTES } from '@/data/staticCatalog';
import { chapterPlacement } from '@/utils/chapter-books';

export function DitSemesterOverview() {
  return <section aria-labelledby="dit-semester-syllabus" className="my-8">
    <h2 id="dit-semester-syllabus" className="text-2xl font-bold text-navy-900">First semester syllabus and available material</h2>
    <p className="mt-3 text-base leading-7 text-slate-700">Five technical subjects, 500 marks in total. Each subject has 75 theory and 25 practical marks. Library Activities is listed separately without examination marks.</p>
    <p className="mt-2 text-base leading-7"><a href={syllabus.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy-700 underline">Read the official PBTE two-year D.I.T syllabus</a></p>
    <div className="mt-5 space-y-4">{syllabus.subjects.map(subject => {
      const book = 'book' in subject ? subject.book : undefined;
      const chapters = INITIAL_CHAPTERS.filter(c => c.classSlug === 'dit-intermediate' && c.subjectSlug === subject.slug && c.isActive && (!book || chapterPlacement(c)?.bookTitle === book));
      const available = chapters.filter(c => [...INITIAL_NOTES, ...INITIAL_MCQS].some(r => r.classSlug === c.classSlug && r.subjectSlug === c.subjectSlug && r.chapterNumber === c.chapterNumber));
      return <details key={subject.title} className="rounded-lg border border-slate-200 bg-white p-4" open={subject.slug === 'dit-ict'}>
        <summary className="min-h-12 cursor-pointer text-base font-semibold text-navy-900">{subject.title} <span className="font-normal text-slate-600">({subject.modules.length} syllabus modules; {available.length} with material)</span></summary>
        <ol className="my-4 list-decimal space-y-2 pl-6 text-base leading-7 text-slate-700">{subject.modules.map((title,i) => {
          const chapter = available.find(c => (book ? chapterPlacement(c)?.number : c.chapterNumber) === i+1);
          const resource = chapter && INITIAL_NOTES.some(n => n.classSlug === chapter.classSlug && n.subjectSlug === chapter.subjectSlug && n.chapterNumber === chapter.chapterNumber) ? 'notes' : 'mcqs';
          return <li key={title}>{chapter ? <Link prefetch={false} href={`/classes/dit-intermediate/${subject.slug}/${resource}/?chapter=${chapter.chapterNumber}`} className="text-navy-700 underline">{title}</Link> : <>{title} <span className="text-slate-500">(material not yet published)</span></>}</li>;
        })}</ol>
        {available.length > 0 && <Link prefetch={false} className="inline-flex min-h-12 items-center font-semibold text-navy-700 underline" href={`/classes/dit-intermediate/${subject.slug}/`}>Open available study resources</Link>}
      </details>;
    })}</div>
    <p className="mt-4 text-base leading-7 text-slate-600">Module counts include the practical portion: Computer Networks Module 8, and Operating Systems Modules 4 to 6. A listed resource does not certify full syllabus coverage. Study notes and practical tasks together.</p>
  </section>;
}
