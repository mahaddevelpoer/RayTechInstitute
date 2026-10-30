import { staticExportParams } from "@/utils/staticExport";
import { siteUrl } from "@/lib/site";
import { DEFAULT_SOCIAL_IMAGE } from '@/data/social';
import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { INITIAL_SUBJECTS, INITIAL_CLASSES, INITIAL_NOTES } from "@/data/staticCatalog";
import { NotesClientView } from "@/components/educational/NotesClientView";
import { serializeJsonLd, buildResourceSeoTitle, buildDocumentDescription } from "@/utils/seo";

export function generateStaticParams() {
  return staticExportParams(
    INITIAL_SUBJECTS.map((s) => ({
      classSlug: s.classSlug,
      subjectSlug: s.slug,
    })),
    ["classSlug", "subjectSlug"],
  );
}

interface PageProps {
  params: Promise<{
    classSlug: string;
    subjectSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { classSlug, subjectSlug } = await params;
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug,
  );
  if (!currentClass || !currentSubject) return {};
  const hasResources = INITIAL_NOTES.some(item=>item.classSlug===classSlug&&item.subjectSlug===subjectSlug);
  const className = currentClass.title.replace(/\s*\([^)]*\)/, "");
  const description = buildDocumentDescription('Browse available chapter notes and PDF revision resources. Check the document details and use its preview before downloading.', `${className} ${currentSubject.title} notes`);

  return {
    title: buildResourceSeoTitle(className, currentSubject.title, "Notes PDF"),
    description,
    robots: { index: hasResources, follow: true },
    alternates: {
      canonical: siteUrl(`/classes/${classSlug}/${subjectSlug}/notes/`),
    },
    openGraph: {
      images: [DEFAULT_SOCIAL_IMAGE],
      title: buildResourceSeoTitle(className, currentSubject.title, "Notes PDF"),
      description,
      url: siteUrl(`/classes/${classSlug}/${subjectSlug}/notes/`),
      type: "website",
    },
  };
}

export default async function SubjectNotesServerPage({ params }: PageProps) {
  const { classSlug, subjectSlug } = await params;
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug,
  );

  if (!currentClass || !currentSubject) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: currentClass.title,
        item: siteUrl(`/classes/${classSlug}/`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${currentSubject.title} Notes`,
        item: siteUrl(`/classes/${classSlug}/${subjectSlug}/notes/`),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <NotesClientView key={`${classSlug}/${subjectSlug}`} classSlug={classSlug} subjectSlug={subjectSlug} />
      <Footer />
    </div>
  );
}
