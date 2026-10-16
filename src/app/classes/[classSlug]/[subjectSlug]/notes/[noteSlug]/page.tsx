import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PdfDetailClientView } from '@/components/educational/PdfDetailClientView';
import { INITIAL_CLASSES, INITIAL_SUBJECTS, INITIAL_NOTES } from '@/data/staticCatalog';

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function generateStaticParams() {
  return INITIAL_NOTES.map((note) => ({ classSlug: note.classSlug, subjectSlug: note.subjectSlug, noteSlug: slug(note.id) }));
}

export function generateMetadata({ params }: { params: { classSlug: string; subjectSlug: string; noteSlug: string } }): Metadata {
  const note = INITIAL_NOTES.find((item) => item.classSlug === params.classSlug && item.subjectSlug === params.subjectSlug && slug(item.id) === params.noteSlug);
  const currentSubject = INITIAL_SUBJECTS.find((item) => item.classSlug === params.classSlug && item.slug === params.subjectSlug);
  if (!note || !currentSubject) return {};
  const title = `${currentSubject.title} Chapter ${note.chapterNumber} Notes PDF | RayTech`;
  const description = note.description || `Chapter ${note.chapterNumber} ${currentSubject.title} notes in PDF format for intermediate students.`;
  return {
    title,
    description,
    alternates: { canonical: `https://raytechinstitute.web.app/classes/${params.classSlug}/${params.subjectSlug}/notes/${params.noteSlug}/` },
    openGraph: { title, description, url: `https://raytechinstitute.web.app/classes/${params.classSlug}/${params.subjectSlug}/notes/${params.noteSlug}/`, type: 'article' },
  };
}

export default function NoteDetailPage({ params }: { params: { classSlug: string; subjectSlug: string; noteSlug: string } }) {
  const note = INITIAL_NOTES.find((item) => item.classSlug === params.classSlug && item.subjectSlug === params.subjectSlug && slug(item.id) === params.noteSlug);
  const currentClass = INITIAL_CLASSES.find((item) => item.slug === params.classSlug);
  const currentSubject = INITIAL_SUBJECTS.find((item) => item.classSlug === params.classSlug && item.slug === params.subjectSlug);
  if (!note || !currentClass || !currentSubject) notFound();
  return <div className="flex min-h-screen flex-col bg-white text-slate-800"><Header /><PdfDetailClientView backHref={`/classes/${params.classSlug}/${params.subjectSlug}/notes`} backLabel="Back to notes" eyebrow={`Chapter ${note!.chapterNumber} · ${note!.chapterTitle}`} title={note!.title} description={note!.description} content={note!.content} pdfUrl={note!.previewPdfUrl || note!.pdfUrl} metadata={[currentClass!.title, currentSubject!.title, `Chapter ${note!.chapterNumber}`, note!.fileSize || 'PDF resource']} /><Footer /></div>;
}
