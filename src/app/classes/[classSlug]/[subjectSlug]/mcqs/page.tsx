import { withSocialMetadata } from '@/utils/social-metadata';
import { staticExportParams } from "@/utils/staticExport";
import { siteUrl } from "@/lib/site";
import { DEFAULT_SOCIAL_IMAGE } from '@/data/social';
import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  INITIAL_SUBJECTS,
  INITIAL_CLASSES,
  INITIAL_MCQS,
} from "@/data/staticCatalog";
import { MCQClientView } from "@/components/educational/MCQClientView";
import { serializeJsonLd, buildResourceSeoTitle, buildDocumentDescription } from "@/utils/seo";
import { studyResourceKeywords } from '@/utils/study-resource-seo';

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
  if (!currentClass || !currentSubject) return withSocialMetadata({});
  const hasResources = INITIAL_MCQS.some(item=>item.classSlug===classSlug&&item.subjectSlug===subjectSlug);
  const className = currentClass.title.replace(/\s*\([^)]*\)/, "");
  const topics = Array.from(new Set(INITIAL_MCQS.filter(item => item.classSlug === classSlug && item.subjectSlug === subjectSlug).map(item => item.topic?.trim()).filter((topic): topic is string => !!topic)));
  const description = buildDocumentDescription('Practise by chapter and topic, answer one question at a time, then review your score and explanations.', `${className} ${currentSubject.title} MCQs`);
  const title = buildResourceSeoTitle(className, currentSubject.title, 'MCQs & Answers');

  return withSocialMetadata({
    title,
    description,
    keywords: studyResourceKeywords(className, currentSubject.title, topics),
    robots: { index: hasResources, follow: true },
    twitter: { card: 'summary_large_image', title, description, images: [DEFAULT_SOCIAL_IMAGE.url] },
    alternates: {
      canonical: siteUrl(`/classes/${classSlug}/${subjectSlug}/mcqs/`),
    },
    openGraph: {
      images: [DEFAULT_SOCIAL_IMAGE],
      title,
      description,
      url: siteUrl(`/classes/${classSlug}/${subjectSlug}/mcqs/`),
      type: "website",
    },
  });
}

export default async function SubjectMCQsServerPage({ params }: PageProps) {
  const { classSlug, subjectSlug } = await params;
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug,
  );

  if (!currentClass || !currentSubject) {
    notFound();
  }

  const subjectMCQs = INITIAL_MCQS.filter(
    (m) => m.classSlug === classSlug && m.subjectSlug === subjectSlug,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: `${currentClass.title} ${currentSubject.title} MCQs Practice Examination`,
    description: `Practise ${currentClass.title} ${currentSubject.title} MCQs by chapter and topic. Review answers and explanations after completing the test.`,
    url: siteUrl(`/classes/${classSlug}/${subjectSlug}/mcqs/`),
    inLanguage: subjectMCQs.some(item => /[\u0600-\u06ff]/.test(item.question)) ? ['en', 'ur'] : ['en'],
    isAccessibleForFree: true,
    educationalLevel: currentClass.title,
    hasPart: subjectMCQs.map((m) => ({
      "@type": "Question",
      name: m.question,
      ...(m.topic ? { about: { '@type': 'Thing', name: m.topic } } : {}),
      suggestedAnswer: m.options.map((opt, i) => ({
        "@type": "Answer",
        text: opt,
        position: i + 1,
      })),
      acceptedAnswer: {
        "@type": "Answer",
        text: m.options[m.correctIndex],
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <MCQClientView key={`${classSlug}/${subjectSlug}`} classSlug={classSlug} subjectSlug={subjectSlug} />
      <Footer />
    </div>
  );
}
