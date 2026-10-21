import { staticExportParams } from "@/utils/staticExport";
import { siteUrl } from "@/lib/site";
import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { INITIAL_SUBJECTS, INITIAL_CLASSES } from "@/data/staticCatalog";
import { NotesClientView } from "@/components/educational/NotesClientView";
import { serializeJsonLd, buildSeoTitle } from "@/utils/seo";

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
  const className = currentClass.title.replace(/\s*\([^)]*\)/, "");

  return {
    title: buildSeoTitle(`${className} ${currentSubject.title} Notes PDF`),
    description: `Download official solved notes in high-definition PDF format for ${currentClass.title} ${currentSubject.title} with complete chapter coverage.`,
    alternates: {
      canonical: siteUrl(`/classes/${classSlug}/${subjectSlug}/notes/`),
    },
    openGraph: {
      title: buildSeoTitle(`${className} ${currentSubject.title} Notes PDF`),
      description: `Download official solved notes in high-definition PDF format for ${currentClass.title} ${currentSubject.title} with complete chapter coverage.`,
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
      <NotesClientView classSlug={classSlug} subjectSlug={subjectSlug} />
      <Footer />
    </div>
  );
}
