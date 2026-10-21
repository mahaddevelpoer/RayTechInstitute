import { staticExportParams } from "@/utils/staticExport";
import { siteUrl } from "@/lib/site";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_NOTES,
  INITIAL_MCQS,
  INITIAL_PAST_PAPERS,
} from "@/data/staticCatalog";
import {
  FileText,
  HelpCircle,
  FileCode,
  ArrowRight,
} from "lucide-react";
import { serializeJsonLd, buildSeoTitle } from "@/utils/seo";

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

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main id="main-content" tabIndex={-1} className="page-main flex-1">
        {/* Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />

        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/classes">Classes</Link>
          <span>/</span>
          <Link href={`/classes/${currentClass.slug}`}>
            {currentClass.title}
          </Link>
          <span>/</span>
          <span className="text-slate-700">{currentSubject.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="badge-primary">{currentClass.title}</span>
            <span className="badge-accent">Course Unit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            {currentSubject.title}
          </h1>
          <p className="text-slate-600 text-sm">{currentSubject.description}</p>
        </div>

        {/* 3 Main Study Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Notes */}
          <Link
            href={`/classes/${currentClass.slug}/${currentSubject.slug}/notes`}
            className="edu-card p-6 flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded bg-navy-50 text-navy-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-navy-900 mb-1 group-hover:text-navy-600 transition-colors">
                Chapter Notes (PDF)
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Solved short questions, long answers, and chapter-wise study
                notes for board exams.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-navy-600">
              <span>{subjectNotes.length} Chapters Available</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* MCQs */}
          <Link
            href={`/classes/${currentClass.slug}/${currentSubject.slug}/mcqs`}
            className="edu-card p-6 flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-navy-900 mb-1 group-hover:text-navy-600 transition-colors">
                Interactive MCQs Quiz
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Online multiple choice test with instant scores and answer
                explanations.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>{subjectMCQs.length} MCQs Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Past Papers */}
          <Link
            href={`/classes/${currentClass.slug}/${currentSubject.slug}/past-papers`}
            className="edu-card p-6 flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                <FileCode className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-navy-900 mb-1 group-hover:text-navy-600 transition-colors">
                Board Past Papers
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Past 5-year board question papers from BISE Lahore, Gujranwala,
                Rawalpindi, and FBISE.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-orange-700">
              <span>{subjectPastPapers.length} Board Papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
