import { staticExportParams } from "@/utils/staticExport";
import { siteUrl } from "@/lib/site";
import { DEFAULT_SOCIAL_IMAGE } from '@/data/social';
import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { INITIAL_SUBJECTS, INITIAL_CLASSES } from "@/data/staticCatalog";
import { PastPapersClientView } from "@/components/educational/PastPapersClientView";
import { serializeJsonLd, buildSeoTitle, buildDocumentDescription } from "@/utils/seo";

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
  const description = buildDocumentDescription('Browse published past-paper PDFs and check the board, year and examination session. Open the resource details before revising.', `${className} ${currentSubject.title} past papers`);

  return {
    title: buildSeoTitle(`${className} ${currentSubject.title} Past Papers`),
    description,
    alternates: {
      canonical: siteUrl(`/classes/${classSlug}/${subjectSlug}/past-papers/`),
    },
    openGraph: {
      images: [DEFAULT_SOCIAL_IMAGE],
      title: buildSeoTitle(`${className} ${currentSubject.title} Past Papers`),
      description,
      url: siteUrl(`/classes/${classSlug}/${subjectSlug}/past-papers/`),
      type: "website",
    },
  };
}

export default async function SubjectPastPapersServerPage({
  params,
}: PageProps) {
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
        name: `${currentSubject.title} Past Papers`,
        item: siteUrl(`/classes/${classSlug}/${subjectSlug}/past-papers/`),
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
      <PastPapersClientView key={`${classSlug}/${subjectSlug}`} classSlug={classSlug} subjectSlug={subjectSlug} />
      <Footer />
    </div>
  );
}
