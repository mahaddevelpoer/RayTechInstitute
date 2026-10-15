'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EducationalStore } from '@/data/educationalStore';
import { ClassItem } from '@/types/educational';
import { ArrowRight, BookOpen } from 'lucide-react';

export function ClassesClientView() {
  const [classes, setClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    setClasses(EducationalStore.getClasses());
  }, []);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="text-slate-700">Classes</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Intermediate Classes (11th &amp; 12th)
        </h1>
        <p className="text-slate-600 text-sm">
          Complete computer science study resources according to Punjab Textbook Board syllabus. Click on any class or subject card to open its syllabus.
        </p>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => {
          const subjects = EducationalStore.getSubjects(cls.slug);
          return (
            <div
              key={cls.id}
              className="edu-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="badge-primary">Grade {cls.numericGrade}</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {subjects.length} Subjects
                  </span>
                </div>

                <Link href={`/classes/${cls.slug}`} className="block group">
                  <h2 className="text-xl font-bold text-navy-900 group-hover:text-navy-600 transition-colors mb-2">
                    {cls.title}
                  </h2>
                </Link>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {cls.description}
                </p>

                {/* Subjects List - Each Row Clickable with Quick Direct Sub-Actions */}
                <div className="border-t border-slate-100 pt-4 mb-6">
                  <div className="text-xs font-bold text-slate-700 mb-2.5">
                    Available Subjects:
                  </div>
                  <div className="space-y-2.5">
                    {subjects.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
                      >
                        <Link
                          href={`/classes/${cls.slug}/${sub.slug}`}
                          className="font-bold text-navy-900 hover:text-navy-600 text-xs flex-1 block"
                        >
                          <div className="leading-snug">{sub.title}</div>
                          <div className="text-[11px] text-slate-500 font-normal">
                            Full Syllabus &bull; Notes &bull; MCQs &bull; Papers
                          </div>
                        </Link>

                        <div className="flex items-center gap-1.5 shrink-0 pt-1 sm:pt-0">
                          <Link
                            href={`/classes/${cls.slug}/${sub.slug}/notes`}
                            className="px-2.5 py-1 text-[11px] font-bold bg-white border border-slate-300 rounded text-navy-700 hover:bg-navy-600 hover:text-white transition-colors"
                            title="Notes"
                          >
                            Notes
                          </Link>
                          <Link
                            href={`/classes/${cls.slug}/${sub.slug}/mcqs`}
                            className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 border border-emerald-300 rounded text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
                            title="MCQs"
                          >
                            MCQs
                          </Link>
                          <Link
                            href={`/classes/${cls.slug}/${sub.slug}/past-papers`}
                            className="px-2.5 py-1 text-[11px] font-bold bg-orange-50 border border-orange-300 rounded text-orange-800 hover:bg-orange-600 hover:text-white transition-colors"
                            title="Past Papers"
                          >
                            Papers
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={`/classes/${cls.slug}`}
                className="btn-primary w-full justify-center text-xs py-2.5"
              >
                <span>Explore Full {cls.title} Syllabus</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
