'use client';

import React from 'react';
import { Compass, BookCheck, Cpu } from 'lucide-react';

export const Approach: React.FC = () => {
  const steps = [
    {
      num: "1",
      title: "Concepts & Theory",
      desc: "First learn core concepts clearly - computer architecture, flowcharts, data structures, and algorithms.",
      icon: Compass,
    },
    {
      num: "2",
      title: "Code & Practice",
      desc: "Write code line-by-line in lab environment. Practice MCQs and solve previous board exam short questions.",
      icon: BookCheck,
    },
    {
      num: "3",
      title: "Board Exam Revision",
      desc: "Attempt model papers, review pairing schemes, and practice past 5-year board exam questions.",
      icon: Cpu,
    },
  ];

  return (
    <section id="approach" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="section-title">
            Our Learning Method
          </h2>
          <p className="text-slate-600 text-sm">
            Simple 3-step study system designed to help you secure top marks in Punjab Board exams.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => {
            return (
              <div
                key={s.num}
                className="edu-card p-6 bg-white relative"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-navy-600 text-white text-xs font-bold flex items-center justify-center">
                    {s.num}
                  </span>
                  <h3 className="font-bold text-navy-900 text-sm">
                    {s.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
