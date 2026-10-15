import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INITIAL_SUBJECTS, INITIAL_CLASSES } from '@/data/staticCatalog';
import { NotesClientView } from '@/components/educational/NotesClientView';

export function generateStaticParams() {
  return INITIAL_SUBJECTS.map((s) => ({
    classSlug: s.classSlug,
    subjectSlug: s.slug,
  }));
}

interface PageProps {
  params: {
    classSlug: string;
    subjectSlug: string;
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === params.classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === params.classSlug && s.slug === params.subjectSlug
  );
  if (!currentClass || !currentSubject) return {};

  return {
    title: `${currentClass.title} ${currentSubject.title} Notes (PDF) | RayTech`,
    description: `Download official solved notes in high-definition PDF format for ${currentClass.title} ${currentSubject.title} with complete chapter coverage.`,
    alternates: {
      canonical: `https://raytechinstitute.firebaseapp.com/classes/${params.classSlug}/${params.subjectSlug}/notes/`,
    },
    openGraph: {
      title: `${currentClass.title} ${currentSubject.title} Notes (PDF) | RayTech`,
      description: `Download official solved notes in high-definition PDF format for ${currentClass.title} ${currentSubject.title} with complete chapter coverage.`,
      url: `https://raytechinstitute.firebaseapp.com/classes/${params.classSlug}/${params.subjectSlug}/notes/`,
      type: 'website',
    },
  };
}

export default function SubjectNotesServerPage({ params }: PageProps) {
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === params.classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === params.classSlug && s.slug === params.subjectSlug
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
        item: 'https://raytechinstitute.firebaseapp.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: currentClass.title,
        item: `https://raytechinstitute.firebaseapp.com/classes/${params.classSlug}/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${currentSubject.title} Notes`,
        item: `https://raytechinstitute.firebaseapp.com/classes/${params.classSlug}/${params.subjectSlug}/notes/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NotesClientView classSlug={params.classSlug} subjectSlug={params.subjectSlug} />
    </>
  );
}
