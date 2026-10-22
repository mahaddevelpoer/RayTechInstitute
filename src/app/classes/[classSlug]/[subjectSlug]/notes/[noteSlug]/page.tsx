import { staticExportParams } from "@/utils/staticExport";
import { siteUrl } from "@/lib/site";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PdfDetailClientView } from "@/components/educational/PdfDetailClientView";
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_NOTES,
} from "@/data/staticCatalog";
import { buildSeoTitle, buildDocumentDescription } from "@/utils/seo";

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function generateStaticParams() {
  return staticExportParams(
    INITIAL_NOTES.map((note) => ({
      classSlug: note.classSlug,
      subjectSlug: note.subjectSlug,
      noteSlug: slug(note.id),
    })),
    ["classSlug", "subjectSlug", "noteSlug"],
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ classSlug: string; subjectSlug: string; noteSlug: string }>;
}): Promise<Metadata> {
  const { classSlug, subjectSlug, noteSlug } = await params;
  const note = INITIAL_NOTES.find(
    (item) =>
      item.classSlug === classSlug &&
      item.subjectSlug === subjectSlug &&
      slug(item.id) === noteSlug,
  );
  const currentSubject = INITIAL_SUBJECTS.find(
    (item) => item.classSlug === classSlug && item.slug === subjectSlug,
  );
  if (!note || !currentSubject) return {};
  const title = buildSeoTitle(
    `${currentSubject.title} Chapter ${note.chapterNumber} Notes PDF`,
  );
  const description = buildDocumentDescription(note.description || '', `Chapter ${note.chapterNumber} ${currentSubject.title} notes PDF`);
  return {
    title,
    description,
    alternates: {
      canonical: siteUrl(
        `/classes/${classSlug}/${subjectSlug}/notes/${noteSlug}/`,
      ),
    },
    openGraph: {
      title,
      description,
      url: siteUrl(`/classes/${classSlug}/${subjectSlug}/notes/${noteSlug}/`),
      type: "article",
    },
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ classSlug: string; subjectSlug: string; noteSlug: string }>;
}) {
  const { classSlug, subjectSlug, noteSlug } = await params;
  const note = INITIAL_NOTES.find(
    (item) =>
      item.classSlug === classSlug &&
      item.subjectSlug === subjectSlug &&
      slug(item.id) === noteSlug,
  );
  const currentClass = INITIAL_CLASSES.find((item) => item.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (item) => item.classSlug === classSlug && item.slug === subjectSlug,
  );
  if (!note || !currentClass || !currentSubject) notFound();
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800">
      <Header />
      <PdfDetailClientView
        backHref={`/classes/${classSlug}/${subjectSlug}/notes`}
        backLabel="Back to notes"
        eyebrow={`Chapter ${note!.chapterNumber} · ${note!.chapterTitle}`}
        title={note!.title}
        description={note!.description}
        content={note!.content}
        pdfUrl={note!.pdfUrl}
        previewPdfUrl={note!.previewPdfUrl}
        metadata={[
          currentClass!.title,
          currentSubject!.title,
          `Chapter ${note!.chapterNumber}`,
          note!.fileSize || "PDF resource",
        ]}
      />
      <Footer />
    </div>
  );
}
