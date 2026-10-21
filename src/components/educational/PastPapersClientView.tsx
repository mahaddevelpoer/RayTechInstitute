"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  EducationalStore,
  INITIAL_SUBJECTS,
  INITIAL_CLASSES,
} from "@/data/educationalStore";
import { PastPaperItem } from "@/types/educational";
import {
  FileCode,
  ArrowLeft,
  Calendar,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import { PdfResourceActions } from "@/components/educational/PdfResourceActions";

interface PastPapersClientViewProps {
  classSlug: string;
  subjectSlug: string;
}

export const PastPapersClientView: React.FC<PastPapersClientViewProps> = ({
  classSlug,
  subjectSlug,
}) => {
  const [pastPapers, setPastPapers] = useState<PastPaperItem[]>(() =>
    EducationalStore.getPastPapers(classSlug, subjectSlug),
  );
  const [selectedBoard, setSelectedBoard] = useState<string>("all");

  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug,
  );

  useEffect(() => {
    setPastPapers(EducationalStore.getPastPapers(classSlug, subjectSlug));
  }, [classSlug, subjectSlug]);

  const boards = Array.from(new Set(pastPapers.map((p) => p.board)));
  const filteredPapers =
    selectedBoard === "all"
      ? pastPapers
      : pastPapers.filter((p) => p.board === selectedBoard);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <main id="main-content" tabIndex={-1} className="page-main flex-1">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/classes">Classes</Link>
          <span>/</span>
          <Link href={`/classes/${classSlug}`}>
            {currentClass?.title || classSlug}
          </Link>
          <span>/</span>
          <Link href={`/classes/${classSlug}/${subjectSlug}`}>
            {currentSubject?.title || subjectSlug}
          </Link>
          <span>/</span>
          <span className="text-slate-700">Past Papers</span>
        </nav>

        {/* Back Link */}
        <div className="mb-4">
          <Link
            href={`/classes/${classSlug}/${subjectSlug}`}
            className="inline-flex items-center gap-1.5 text-xs text-navy-600 hover:text-navy-800 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {currentSubject?.title || "Subject"} Hub</span>
          </Link>
        </div>

        {/* Header */}
        <div className="page-intro mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="badge-primary">{currentClass?.title}</span>
            <span className="badge-accent">{currentSubject?.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            Official Board Past Papers
          </h1>
          <p className="text-slate-600 text-sm">
            Download past 5 years board question papers (Annual &amp;
            Supplementary) in PDF format.
          </p>
        </div>

        {/* Board Filter */}
        {boards.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            <button
              onClick={() => setSelectedBoard("all")}
              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                selectedBoard === "all"
                  ? "bg-navy-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Boards ({pastPapers.length})
            </button>
            {boards.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBoard(b)}
                className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                  selectedBoard === b
                    ? "bg-navy-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <article
              key={paper.id}
              className="edu-card bg-white flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {paper.year}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
                    {paper.session} paper
                  </p>
                  <Link
                    href={`/classes/${classSlug}/${subjectSlug}/past-papers/${paper.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="text-base font-bold text-navy-900 mb-1 hover:text-navy-700"
                  >
                    {paper.board}
                  </Link>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Official {currentSubject?.title} question paper for{" "}
                    {currentClass?.title}, prepared for board exam practice.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-navy-600" /> Subject
                    paper
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClipboardList className="h-3.5 w-3.5 text-navy-600" />{" "}
                    Board pattern
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/70 p-4">
                <PdfResourceActions
                  detailHref={`/classes/${classSlug}/${subjectSlug}/past-papers/${paper.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`}
                  pdfUrl={paper.pdfUrl}
                  title={`${paper.board} ${paper.year} ${paper.session} ${currentSubject?.title} past paper`}
                  downloadLabel="Download paper"
                  className="w-full [&>*]:flex-1 [&>*]:justify-center"
                />
                <Link
                  href={`/classes/${classSlug}/${subjectSlug}/past-papers/${paper.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="mt-2 block text-center text-xs font-semibold text-navy-700 hover:underline"
                >
                  View full paper details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};
