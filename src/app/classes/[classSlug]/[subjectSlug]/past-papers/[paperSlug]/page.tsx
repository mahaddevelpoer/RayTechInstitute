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
  INITIAL_PAST_PAPERS,
} from "@/data/staticCatalog";
import { buildSeoTitle } from "@/utils/seo";

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function generateStaticParams() {
  return staticExportParams(
    INITIAL_PAST_PAPERS.map((paper) => ({
      classSlug: paper.classSlug,
      subjectSlug: paper.subjectSlug,
      paperSlug: slug(paper.id),
    })),
    ["classSlug", "subjectSlug", "paperSlug"],
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    classSlug: string;
    subjectSlug: string;
    paperSlug: string;
  }>;
}): Promise<Metadata> {
  const { classSlug, subjectSlug, paperSlug } = await params;
  const paper = INITIAL_PAST_PAPERS.find(
    (item) =>
      item.classSlug === classSlug &&
      item.subjectSlug === subjectSlug &&
      slug(item.id) === paperSlug,
  );
  const currentSubject = INITIAL_SUBJECTS.find(
    (item) => item.classSlug === classSlug && item.slug === subjectSlug,
  );
  if (!paper || !currentSubject) return {};
  const title = buildSeoTitle(
    `${currentSubject.title} ${paper.year} Past Paper PDF`,
  );
  const description =
    paper.description ||
    `View the ${paper.board} ${paper.year} ${currentSubject.title} past paper PDF for intermediate exam practice, revision, and board-style preparation.`;
  return {
    title,
    description,
    alternates: {
      canonical: siteUrl(
        `/classes/${classSlug}/${subjectSlug}/past-papers/${paperSlug}/`,
      ),
    },
    openGraph: {
      title,
      description,
      url: siteUrl(
        `/classes/${classSlug}/${subjectSlug}/past-papers/${paperSlug}/`,
      ),
      type: "article",
    },
  };
}

export default async function PastPaperDetailPage({
  params,
}: {
  params: Promise<{
    classSlug: string;
    subjectSlug: string;
    paperSlug: string;
  }>;
}) {
  const { classSlug, subjectSlug, paperSlug } = await params;
  const paper = INITIAL_PAST_PAPERS.find(
    (item) =>
      item.classSlug === classSlug &&
      item.subjectSlug === subjectSlug &&
      slug(item.id) === paperSlug,
  );
  const currentClass = INITIAL_CLASSES.find((item) => item.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (item) => item.classSlug === classSlug && item.slug === subjectSlug,
  );
  if (!paper || !currentClass || !currentSubject) notFound();
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800">
      <Header />
      <PdfDetailClientView
        backHref={`/classes/${classSlug}/${subjectSlug}/past-papers`}
        backLabel="Back to past papers"
        eyebrow={`${paper!.board} · ${paper!.year}`}
        title={`${currentSubject!.title} ${paper!.session} Past Paper`}
        description={
          paper!.description ||
          `Official ${currentSubject!.title} past paper for ${currentClass!.title}, including the board pattern and questions students should practise.`
        }
        content={paper!.content}
        pdfUrl={paper!.pdfUrl}
        metadata={[
          currentClass!.title,
          currentSubject!.title,
          paper!.board,
          `${paper!.year}`,
          paper!.session,
        ]}
      />
      <Footer />
    </div>
  );
}
