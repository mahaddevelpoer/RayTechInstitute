"use client";

import React from "react";
import Link from "next/link";

import { channelData } from "@/data/channel";
import { BookOpen, FileText, Award } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="bg-white py-8 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text content */}
          <div>
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="badge-primary">Computer Science Education</span>
              <span className="badge-accent">11th &amp; 12th Class</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 leading-tight mb-3">
              11th &amp; 12th Class Computer Science Notes, MCQs &amp; Gazettes
            </h1>

            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Study chapter notes, practise MCQs and find board results in one
              place.
            </p>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link href="/classes" className="btn-primary">
                <BookOpen className="w-4 h-4" />
                Study Material
              </Link>
              <Link
                href="/results-gazettes/first-year-result/"
                className="btn-outline"
              >
                <Award className="w-4 h-4" />
                1st Year Results
              </Link>
            </div>
          </div>

          {/* Right: Channel image card */}
          <div className="hidden lg:block">
            <div className="edu-card overflow-hidden">
              {/* Cover banner */}
              <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={channelData.coverImage}
                  alt={`${channelData.name} Official Channel Banner`}
                  className="w-full h-full object-cover"
                  width={800}
                  height={343}
                />
              </div>

              {/* Channel identity row */}
              <div className="flex items-center gap-3 p-4 bg-white border-t border-slate-200">
                <div className="w-12 h-12 rounded-md overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50">
                  <img
                    src={channelData.profileImage}
                    alt={`${channelData.name} Profile`}
                    className="w-full h-full object-cover"
                    width={48}
                    height={48}
                  />
                </div>
                <div>
                  <div className="font-semibold text-navy-800 text-sm">
                    {channelData.name}
                  </div>
                  <div className="text-slate-500 text-xs">
                    Computer Science Instructor - Pakistan
                  </div>
                </div>
              </div>
            </div>

            {/* Quick links grid below image */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Link
                href="/classes/11th-class/computer-science/notes"
                className="edu-card p-3 flex items-center gap-2 text-sm text-slate-700 hover:text-navy-700 hover:border-navy-300 transition-all"
              >
                <FileText className="w-4 h-4 text-navy-600 flex-shrink-0" />
                <span>11th Class Notes</span>
              </Link>
              <Link
                href="/classes/12th-class/computer-science/past-papers"
                className="edu-card p-3 flex items-center gap-2 text-sm text-slate-700 hover:text-navy-700 hover:border-navy-300 transition-all"
              >
                <FileText className="w-4 h-4 text-navy-600 flex-shrink-0" />
                <span>Past Papers</span>
              </Link>
              <Link
                href="/classes/11th-class/computer-science/mcqs"
                className="edu-card p-3 flex items-center gap-2 text-sm text-slate-700 hover:text-navy-700 hover:border-navy-300 transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>MCQs Test</span>
              </Link>
              <Link
                href="/results-gazettes"
                className="edu-card p-3 flex items-center gap-2 text-sm text-orange-600 font-semibold hover:border-orange-300 transition-all"
              >
                <Award className="w-4 h-4 flex-shrink-0" />
                <span>Result Gazettes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
