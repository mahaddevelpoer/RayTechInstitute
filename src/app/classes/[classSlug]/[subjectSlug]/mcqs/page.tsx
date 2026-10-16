import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INITIAL_SUBJECTS, INITIAL_CLASSES, INITIAL_MCQS } from '@/data/staticCatalog';
import { MCQClientView } from '@/components/educational/MCQClientView';
import { serializeJsonLd } from '@/utils/seo';

export function generateStaticParams() {
  return INITIAL_SUBJECTS.map((s) => ({
    classSlug: s.classSlug,
    subjectSlug: s.slug,
  }));
}

interface PageProps {
  params: Promise<{
    classSlug: string;
    subjectSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { classSlug, subjectSlug } = await params;
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug
  );
  if (!currentClass || !currentSubject) return {};
  const className = currentClass.title.replace(/\s*\([^)]*\)/, '');

  return {
    title: `${className} ${currentSubject.title} MCQs Test | RayTech`,
    description: `Practice intermediate MCQs test for ${currentClass.title} ${currentSubject.title} with instant answer checking and score calculation.`,
    alternates: {
      canonical: `https://raytechinstitute.web.app/classes/${classSlug}/${subjectSlug}/mcqs/`,
    },
    openGraph: {
      title: `${className} ${currentSubject.title} MCQs Test | RayTech`,
      description: `Practice intermediate MCQs test for ${currentClass.title} ${currentSubject.title} with instant answer checking and score calculation.`,
      url: `https://raytechinstitute.web.app/classes/${classSlug}/${subjectSlug}/mcqs/`,
      type: 'website',
    },
  };
}

export default async function SubjectMCQsServerPage({ params }: PageProps) {
  const { classSlug, subjectSlug } = await params;
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug
  );

  if (!currentClass || !currentSubject) {
    notFound();
  }

  const subjectMCQs = INITIAL_MCQS.filter(
    (m) => m.classSlug === classSlug && m.subjectSlug === subjectSlug
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `${currentClass.title} ${currentSubject.title} MCQs Practice Examination`,
    description: `Interactive multiple choice questions for ${currentClass.title} ${currentSubject.title} with real-time verification.`,
    educationalLevel: currentClass.title,
    hasPart: subjectMCQs.map((m) => ({
      '@type': 'Question',
      name: m.question,
      suggestedAnswer: m.options.map((opt, i) => ({
        '@type': 'Answer',
        text: opt,
        position: i + 1,
      })),
      acceptedAnswer: {
        '@type': 'Answer',
        text: m.options[m.correctIndex],
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <MCQClientView classSlug={classSlug} subjectSlug={subjectSlug} />
    </>
  );
}
