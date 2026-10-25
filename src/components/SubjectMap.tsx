'use client';

import React from 'react';
import { Lecture } from '@/types';
import { BookOpen, Terminal, Layers } from 'lucide-react';
import Link from 'next/link';
import { INITIAL_CLASSES } from '@/data/staticCatalog';

interface SubjectMapProps {
  lectures?: Lecture[];
  onSelectCategory?: (category: string) => void;
}

export const SubjectMap: React.FC<SubjectMapProps> = ({
  onSelectCategory,
}) => {
  const categories = [
    ...INITIAL_CLASSES.filter(grade => grade.isActive).map(grade => ({
      title: grade.title,
      desc: grade.description,
      link: `/classes/${grade.slug}/`,
      icon: BookOpen,
      tag: 'Class resources',
      catFilter: undefined as string | undefined,
    })),
    {
      title: "Python Programming Course",
      desc: "Basics of Python, Indentation, Loops, Lists, Dictionaries and Beginner Projects",
      link: "/#archive",
      catFilter: "PYTHON",
      icon: Terminal,
      tag: "Coding",
      color: "orange",
    },
    {
      title: "Web Development (HTML & CSS)",
      desc: "Web design basics, page structure, forms, styles and modern responsive layout",
      link: "/#archive",
      catFilter: "WEB",
      icon: Layers,
      tag: "Web",
      color: "navy",
    },
  ];

  return (
    <section id="subjects" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="section-title">
            Browse By Subjects &amp; Topics
          </h2>
          <p className="text-slate-600 text-sm">
            Select a subject to view related notes, MCQs test, video lectures, and exam tips.
          </p>
        </div>

        {/* 4 Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="edu-card p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge-primary">{c.tag}</span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="font-bold text-navy-900 text-sm mb-1.5 leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {c.desc}
                  </p>
                </div>

                {c.catFilter ? (
                  <button
                    onClick={() => {
                      if (onSelectCategory && c.catFilter) onSelectCategory(c.catFilter);
                      const el = document.getElementById('archive');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left text-xs font-semibold text-navy-600 hover:text-navy-800 pt-3 border-t border-slate-100"
                  >
                    View Lectures &rarr;
                  </button>
                ) : (
                  <Link
                    href={c.link}
                    className="text-xs font-semibold text-navy-600 hover:text-navy-800 pt-3 border-t border-slate-100"
                  >
                    Open Syllabus &rarr;
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
