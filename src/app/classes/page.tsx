import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ClassesClientView } from '@/components/educational/ClassesClientView';

export const metadata: Metadata = {
  title: '11th & 12th Class Study Resources, Notes & Past Papers | RayTech',
  description: 'Access complete intermediate study resources for 11th and 12th class, including chapter notes in PDF, interactive MCQs tests, and board past papers.',
  alternates: {
    canonical: 'https://raytechinstitute.firebaseapp.com/classes/',
  },
  openGraph: {
    title: '11th & 12th Class Study Resources, Notes & Past Papers | RayTech',
    description: 'Access complete intermediate study resources for 11th and 12th class, including chapter notes in PDF, interactive MCQs tests, and board past papers.',
    url: 'https://raytechinstitute.firebaseapp.com/classes/',
    type: 'website',
  },
};

export default function ClassesIndexPage() {
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
        name: 'Academic Classes',
        item: 'https://raytechinstitute.firebaseapp.com/classes/',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {/* SEO Breadcrumbs Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ClassesClientView />
      </main>

      <Footer />
    </div>
  );
}
