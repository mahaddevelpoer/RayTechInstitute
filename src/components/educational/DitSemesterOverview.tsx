import Link from 'next/link';
import syllabus from '../../../content/dit/semester-one.json';
import banks from '../../../content/dit/study-banks.generated.json';
import books from '../../../content/dit/completion/study-books.generated.json';
import practicalDownload from '../../../content/dit/completion/practical-download.generated.json';
import { INITIAL_CHAPTERS, INITIAL_MCQS, INITIAL_NOTES, INITIAL_PAST_PAPERS } from '@/data/academicResourceSnapshot';
import { buildDitStudySubjects } from '@/utils/dit-study';

export function DitSemesterOverview() {
  const subjects = buildDitStudySubjects({ chapters: INITIAL_CHAPTERS, notes: INITIAL_NOTES, mcqs: INITIAL_MCQS, papers: INITIAL_PAST_PAPERS });
  const available = subjects.reduce((total, subject) => total + subject.available, 0);
  const total = subjects.reduce((count, subject) => count + subject.modules.length, 0);
  const shortNames: Record<string, string> = { 'dit-ict': 'ICT', 'ms-office': 'MS Office', 'computer-networks': 'Computer Networks', 'dit-operating-systems': 'Operating Systems', 'dit-python': 'Python Programming' };
  const linkStyle = 'inline-flex min-h-12 items-center rounded-md border border-slate-300 px-3 py-2 text-base font-semibold text-navy-700 underline underline-offset-2';
  return <section aria-labelledby="dit-semester-syllabus" className="my-8">
    <h2 id="dit-semester-syllabus" className="text-2xl font-bold text-navy-900">First semester syllabus and available material</h2>
    <p className="mt-3 text-base leading-7 text-slate-700">Choose a subject to read chapter notes, practise MCQs or download PDFs for offline revision.</p>
    <nav aria-label="Jump to a DIT subject" className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">{subjects.map(subject => <a key={subject.id} className={linkStyle} aria-label={`Jump to ${subject.title}`} href={`#dit-subject-${subject.id}`}>{shortNames[subject.id]}</a>)}</nav>
    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-base leading-7 text-slate-700">
      <p><strong>{available} of {total} syllabus modules have study material.</strong> Read the mapped topics, check your answers and complete the practical work in the stated lab environment. Study books are original revision guides, not official PBTE textbooks.</p>
    </div>
    <div className="mt-5 space-y-5">{subjects.map(subject => {
      const bank = banks.find(item => item.id === subject.id);
      const book = books.find(item => item.id === subject.id);
      return <details id={`dit-subject-${subject.id}`} key={subject.id} className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-4" open={subject.available > 0}>
        <summary className="min-h-12 cursor-pointer text-lg font-semibold text-navy-900">{subject.title} <span className="text-base font-normal text-slate-600">({subject.modules.length} syllabus modules; {subject.available} with material)</span></summary>
        <p className="mt-2 text-base leading-7 text-slate-700">{subject.noteCount} chapter guides and {subject.mcqCount} practice MCQs available.</p>
        {book && <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-base font-bold text-navy-900">Subject study book</h3>
          <p className="mt-2 text-base leading-7 text-slate-700">All {book.chapters} syllabus modules, with topic notes, solved answers and practical instructions. {book.pages} pages, {Math.ceil(book.bytes / 1024)} KB. Use the PDF contents and bookmarks to find a chapter.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a className={linkStyle} href={book.url} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${subject.title} study book PDF`}>Preview study book</a>
            <a className={linkStyle} href={book.url} download aria-label={`Download ${subject.title} study book PDF`}>Download study book</a>
            {subject.slug === 'dit-python' && <a className={linkStyle} href={practicalDownload.url} download>Download 29 Python practical solutions</a>}
          </div>
        </div>}
        {bank && <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-base font-bold text-navy-900">Printable MCQ bank with answer explanations</h3>
          <p className="mt-2 text-base leading-7 text-slate-700">{bank.questions} questions across {bank.chapters} chapters; {bank.pages} pages, {Math.ceil(bank.bytes / 1024)} KB. Answers follow each chapter so you can attempt the questions first. Snapshot: 24 November 2026.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a className={linkStyle} href={bank.url} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${subject.title} MCQ bank PDF`}>Preview MCQ bank</a>
            <a className={linkStyle} href={bank.url} download aria-label={`Download ${subject.title} MCQ bank PDF`}>Download MCQ bank</a>
          </div>
        </div>}
        <ol className="mt-4 space-y-3" aria-label={`${subject.title} syllabus modules`}>{subject.modules.map(module => <li key={module.number} className="rounded-md border border-slate-200 p-4">
          <h3 className="text-base font-semibold leading-7 text-navy-900">{module.number}. {module.title}</h3>
          {module.available ? <>
            <p className="mt-1 text-base leading-7 text-slate-600">{module.notes.length} {module.notes.length === 1 ? 'guide' : 'guides'}; {module.mcqs.length} practice MCQs.</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {module.notes.map(note => <Link prefetch={false} data-dit-note key={note.id} className={linkStyle} href={note.href} aria-label={`Read ${module.title} ${note.id === 'dit-ict-practical-workbook' ? 'practical workbook' : 'notes'}`}>{note.id === 'dit-ict-practical-workbook' ? 'Read practical workbook' : 'Read notes'}</Link>)}
              {module.practiceHref && <Link prefetch={false} className={linkStyle} href={module.practiceHref} aria-label={`Practise ${module.title} MCQs`}>Practise MCQs</Link>}
              {module.notes.filter(note => note.pdf).map(note => <a key={note.id} className={linkStyle} href={note.hosted ? new URL(note.pdf).pathname : note.pdf} {...(note.hosted ? {download:true} : {target:'_blank',rel:'noopener noreferrer'})} aria-label={`${note.hosted ? 'Download' : 'Open'} ${module.title} ${note.id === 'dit-ict-practical-workbook' ? 'practical workbook ' : ''}PDF`}>{note.id === 'dit-ict-practical-workbook' ? 'Download practical workbook' : note.hosted ? 'Download PDF' : 'Open PDF'}</a>)}
            </div>
          </> : <p className="mt-2 text-base leading-7 text-slate-600">Study material not yet published for this module.</p>}
        </li>)}</ol>
        {subject.papers.length > 0 && <Link prefetch={false} className={`${linkStyle} mt-4`} href={`/classes/dit-intermediate/${subject.slug}/past-papers/`}>Open published past papers</Link>}
      </details>;
    })}</div>
    <aside className="mt-5 rounded-lg border border-slate-200 p-4 text-base leading-7 text-slate-700" aria-labelledby="dit-download-help">
      <h2 id="dit-download-help" className="text-xl font-bold text-navy-900">How to use your DIT study resources</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-6">
        <li>Choose a subject and find the chapter by its book chapter number.</li>
        <li>Select Read notes for the online guide or Practise MCQs for the interactive chapter test.</li>
        <li>Select Download PDF to save a chapter, or Download MCQ bank for a printable subject question bank. Older Google Drive documents open in Drive; use its download control if the owner permits it.</li>
      </ol>
      <p className="mt-3">Use the ICT practical workbook, Office lab tasks, Networking Module 8, Operating Systems lab modules and Python solutions alongside the theory. Physical/configuration tasks need the instructor-authorised lab. Turtle/Tk and Excel-file programs require the stated desktop environment. Verified board past papers are a separate resource.</p>
      <p className="mt-3">Five technical subjects carry 500 marks in total: 75 theory and 25 practical marks per subject. Library Activities is listed separately without examination marks.</p>
      <p className="mt-3"><a href={syllabus.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy-700 underline">Read the official PBTE two-year D.I.T syllabus</a>. This course outline defines the topics; it is not a complete textbook. These resources are revision material, not verified board past papers.</p>
    </aside>
  </section>;
}
