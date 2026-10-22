import { staticExportParams } from "@/utils/staticExport";
import { siteUrl } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubjectDirectory } from "@/components/educational/AcademicDirectory";
import { INITIAL_CLASSES, INITIAL_SUBJECTS } from "@/data/staticCatalog";
import { buildSeoTitle } from "@/utils/seo";

export function generateStaticParams() {
  return staticExportParams(
    INITIAL_CLASSES.map((c) => ({
      classSlug: c.slug,
    })),
    ["classSlug"],
  );
}

interface PageProps {
  params: Promise<{
    classSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { classSlug } = await params;
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  if (!currentClass) return {};
  const className = currentClass.title.replace(/\s*\([^)]*\)/, "");

  return {
    title: buildSeoTitle(`${className} Study Resources & Notes`),
    description: `Complete study package for ${currentClass.title}. Download solved notes in PDF, attempt interactive MCQs tests, and review board past papers.`,
    alternates: {
      canonical: siteUrl(`/classes/${classSlug}/`),
    },
    openGraph: {
      title: buildSeoTitle(`${className} Study Resources & Notes`),
      description: `Complete study package for ${currentClass.title}. Download solved notes in PDF, attempt interactive MCQs tests, and review board past papers.`,
      url: siteUrl(`/classes/${classSlug}/`),
      type: "website",
    },
  };
}

export default async function ClassDetailsPage({ params }: PageProps) {
  const { classSlug } = await params;
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  if (!currentClass) {
    notFound();
  }

  const subjects = INITIAL_SUBJECTS.filter((s) => s.classSlug === classSlug);

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
    ],
  };

  return <SubjectDirectory grade={currentClass} subjects={subjects} jsonLd={jsonLd}/>;
}
