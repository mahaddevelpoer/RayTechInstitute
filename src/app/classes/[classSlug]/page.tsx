import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { INITIAL_CLASSES, INITIAL_SUBJECTS } from '@/data/staticCatalog';
import { BookOpen, FileText, HelpCircle, FileCode, ArrowRight, ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return INITIAL_CLASSES.map((c) => ({
    classSlug: c.slug,
  }));
}

interface PageProps {
  params: {
    classSlug: string;
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === params.classSlug);
  if (!currentClass) return {};

  return {
    title: `${currentClass.title} Study Resources & Notes | RayTech`,
    description: `Complete study package for ${currentClass.title}. Download solved notes in PDF, attempt interactive MCQs tests, and review board past papers.`,
    alternates: {
      canonical: `https://raytechinstitute.firebaseapp.com/classes/${params.classSlug}/`,
    },
    openGraph: {
      title: `${currentClass.title} Study Resources & Notes | RayTech`,
      description: `Complete study package for ${currentClass.title}. Download solved notes in PDF, attempt interactive MCQs tests, and review board past papers.`,
      url: `https://raytechinstitute.firebaseapp.com/classes/${params.classSlug}/`,
      type: 'website',
    },
  };
}

export default function ClassDetailsPage({ params }: PageProps) {
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === params.classSlug);
  if (!currentClass) {
    notFound();
  }

  const subjects = INITIAL_SUBJECTS.filter((s) => s.classSlug === params.classSlug);

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
        name: 'Classes',
        item: 'https://raytechinstitute.firebaseapp.com/classes/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: currentClass.title,
        item: `https://raytechinstitute.firebaseapp.com/classes/${params.classSlug}/`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/classes">Classes</Link>
          <span>/</span>
          <span className="text-slate-700">{currentClass.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="badge-primary">Grade {currentClass.numericGrade} Syllabus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            {currentClass.title} Study Resources
          </h1>
          <p className="text-slate-600 text-sm">
            {currentClass.description}
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              className="edu-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded bg-navy-50 text-navy-600 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>

                <h2 className="text-base font-bold text-navy-900 mb-2">
                  {subj.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
                  {subj.description}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <Link
                  href={`/classes/${currentClass.slug}/${subj.slug}/notes`}
                  className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-navy-600" />
                    <span>Chapter Notes (PDF)</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>

                <Link
                  href={`/classes/${currentClass.slug}/${subj.slug}/mcqs`}
                  className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Interactive MCQs Test</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>

                <Link
                  href={`/classes/${currentClass.slug}/${subj.slug}/past-papers`}
                  className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-orange-600" />
                    <span>Board Past Papers</span>
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
