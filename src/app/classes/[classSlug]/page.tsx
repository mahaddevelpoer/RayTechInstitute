import { withSocialMetadata } from '@/utils/social-metadata';
import { staticExportParams } from "@/utils/staticExport";
import { siteUrl } from "@/lib/site";
import { DEFAULT_SOCIAL_IMAGE } from '@/data/social';
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
  if (!currentClass) return withSocialMetadata({});
  const className = currentClass.programTitle && currentClass.semesterNumber
    ? `${currentClass.programTitle.replace(/\s*\([^)]*\)/g,'').replace(/D\.?I\.?T\.?/i,'DIT')} Semester ${currentClass.semesterNumber}`
    : currentClass.title.replace(/\s*\([^)]*\)/, "");
  const description = `Find ${className} notes, chapter MCQs and study PDFs. Choose a subject, check available resources and practise each topic at your own pace.`;

  return withSocialMetadata({
    robots: {index: INITIAL_SUBJECTS.some(subject=>subject.classSlug===classSlug), follow:true},
    title: buildSeoTitle(`${className} Notes and Subject MCQs`),
    description,
    alternates: {
      canonical: siteUrl(`/classes/${classSlug}/`),
    },
    openGraph: {
      images: [DEFAULT_SOCIAL_IMAGE],
    title: buildSeoTitle(`${className} Notes and Subject MCQs`),
      description,
      url: siteUrl(`/classes/${classSlug}/`),
      type: "website",
    },
  });
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
