'use client';

import React from 'react';
import { classroomCommentsData } from '@/data/comments';
import { HelpCircle, MessageSquare } from 'lucide-react';

export const Classroom: React.FC = () => {
  return (
    <section id="classroom" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="section-title">
            Student FAQs &amp; Inquiries
          </h2>
          <p className="text-slate-600 text-sm">
            Common questions asked by intermediate students in our lectures and comment sections.
          </p>
        </div>

        {/* Selected Inquiries List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classroomCommentsData.map((inquiry, idx) => (
            <div
              key={inquiry.id}
              className="edu-card p-5 flex flex-col justify-between bg-white"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-navy-700 mb-2">
                  <HelpCircle className="w-4 h-4 text-orange-600" />
                  <span>Question #{idx + 1}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium mb-4 italic">
                  &ldquo;{inquiry.text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold text-navy-600">Topic: </span>
                <span>{inquiry.relatedCategory}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
