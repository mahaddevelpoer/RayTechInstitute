import { staticExportParams } from "@/utils/staticExport";
import { siteUrl } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubjectResources } from "@/components/educational/AcademicDirectory";
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_NOTES,
  INITIAL_MCQS,
  INITIAL_PAST_PAPERS,
} from "@/data/staticCatalog";
import { buildSeoTitle } from "@/utils/seo";

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
    title: buildSeoTitle(`${className} ${currentSubject.title} Study Material`),
    description: `Official chapter notes in PDF, interactive MCQs tests, and board past papers for ${currentClass.title} ${currentSubject.title} for exam revision.`,
    alternates: {
      canonical: siteUrl(`/classes/${classSlug}/${subjectSlug}/`),
    },
    openGraph: {
      title: buildSeoTitle(
        `${className} ${currentSubject.title} Study Material`,
      ),
      description: `Official chapter notes in PDF, interactive MCQs tests, and board past papers for ${currentClass.title} ${currentSubject.title} for exam revision.`,
      url: siteUrl(`/classes/${classSlug}/${subjectSlug}/`),
      type: "website",
    },
  };
}

export default async function SubjectHubPage({ params }: PageProps) {
  const { classSlug, subjectSlug } = await params;
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug,
  );

  if (!currentClass || !currentSubject) {
    notFound();
  }

  const subjectNotes = INITIAL_NOTES.filter(
    (n) => n.classSlug === classSlug && n.subjectSlug === subjectSlug,
  );
  const subjectMCQs = INITIAL_MCQS.filter(
    (m) => m.classSlug === classSlug && m.subjectSlug === subjectSlug,
  );
  const subjectPastPapers = INITIAL_PAST_PAPERS.filter(
    (p) => p.classSlug === classSlug && p.subjectSlug === subjectSlug,
  );

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
        name: "Classes",
        item: siteUrl("/classes/"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: currentClass.title,
        item: siteUrl(`/classes/${classSlug}/`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: currentSubject.title,
        item: siteUrl(`/classes/${classSlug}/${subjectSlug}/`),
      },
    ],
  };

  return <SubjectResources grade={currentClass} subject={currentSubject} counts={{notes:subjectNotes.length,mcqs:subjectMCQs.length,papers:subjectPastPapers.length}} jsonLd={jsonLd}/>;
}
