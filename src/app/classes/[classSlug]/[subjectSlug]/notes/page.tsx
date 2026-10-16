import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INITIAL_SUBJECTS, INITIAL_CLASSES } from '@/data/staticCatalog';
import { NotesClientView } from '@/components/educational/NotesClientView';
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
    title: `${className} ${currentSubject.title} Notes PDF | RayTech`,
    description: `Download official solved notes in high-definition PDF format for ${currentClass.title} ${currentSubject.title} with complete chapter coverage.`,
    alternates: {
      canonical: `https://raytechinstitute.web.app/classes/${classSlug}/${subjectSlug}/notes/`,
    },
    openGraph: {
      title: `${className} ${currentSubject.title} Notes PDF | RayTech`,
      description: `Download official solved notes in high-definition PDF format for ${currentClass.title} ${currentSubject.title} with complete chapter coverage.`,
      url: `https://raytechinstitute.web.app/classes/${classSlug}/${subjectSlug}/notes/`,
      type: 'website',
    },
  };
}

export default async function SubjectNotesServerPage({ params }: PageProps) {
  const { classSlug, subjectSlug } = await params;
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug
  );

  if (!currentClass || !currentSubject) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://raytechinstitute.web.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: currentClass.title,
        item: `https://raytechinstitute.web.app/classes/${classSlug}/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${currentSubject.title} Notes`,
        item: `https://raytechinstitute.web.app/classes/${classSlug}/${subjectSlug}/notes/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <NotesClientView classSlug={classSlug} subjectSlug={subjectSlug} />
    </>
  );
}
