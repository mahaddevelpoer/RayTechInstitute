'use client';

import React from 'react';
import { BookOpen, Layers, Terminal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const TheWork: React.FC = () => {
  const pillars = [
    {
      num: "01",
      title: "Concepts & Fundamentals",
      subtitle: "IPOS, Logic Gates & SDLC",
      description: "Thorough coverage of computer science basic concepts: input/output, processor architecture, memory units, and full Software Development Life Cycle.",
      icon: BookOpen,
      href: "/classes/11th-class/computer-science",
      actionText: "11th Class Syllabus",
    },
    {
      num: "02",
      title: "Coding & Programming",
      subtitle: "Python, C & C++ Languages",
      description: "Step-by-step programming tutorials with clear syntax explanation, loops, conditions, functions, and standard board exam pairing questions.",
      icon: Layers,
      href: "/classes/12th-class/computer-science",
      actionText: "12th Class Syllabus",
    },
    {
      num: "03",
      title: "Exam Preparation & Past Papers",
      subtitle: "MCQs, Short & Long Questions",
      description: "Comprehensive past papers solutions, chapter-wise MCQs practice quizzes, and gazette records from Lahore, Gujranwala, and Rawalpindi boards.",
      icon: Terminal,
      href: "/results-gazettes",
      actionText: "Board Gazettes",
    },
  ];

  return (
    <section id="work" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="section-title">
            Our Learning Modules
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need for intermediate board computer science preparation in one place.
          </p>
        </div>

        {/* 3 Clickable Full Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.num}
                href={pillar.href}
                className="edu-card p-6 flex flex-col justify-between group cursor-pointer hover:border-navy-600 transition-all block"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-navy-50 text-navy-600 flex items-center justify-center mb-4 group-hover:bg-navy-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-navy-900 text-base mb-1 group-hover:text-navy-600 transition-colors">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-600 mb-3">
                    {pillar.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="inline-flex items-center text-xs font-bold text-navy-600 group-hover:text-navy-800 gap-1 pt-3 border-t border-slate-100">
                  <span>{pillar.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
