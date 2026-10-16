'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { channelData } from '@/data/channel';
import { BookOpen, FileText, Youtube, Award } from 'lucide-react';
import { sanitizeUrl } from '@/utils/security';

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

            <p className="text-slate-600 text-base leading-relaxed mb-2">
              {channelData.tagline}
            </p>

            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Free study resources for 11th and 12th class students - Notes, MCQs, Past Papers, Video Lectures, and Result Gazettes for all Punjab Boards.
            </p>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/classes"
                className="btn-primary"
              >
                <BookOpen className="w-4 h-4" />
                Study Material
              </Link>
              <Link
                href="/classes/11th-class/computer-science/mcqs"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Python IDE &amp; MCQs Test
              </Link>
              <Link
                href="/results-gazettes"
                className="btn-outline"
              >
                <Award className="w-4 h-4" />
                Result Gazettes
              </Link>
              <a
                href={sanitizeUrl(channelData.youtubeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors"
              >
                <Youtube className="w-4 h-4" />
                YouTube Channel
              </a>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-navy-600 inline-block"></span>
                Computer Science (11th &amp; 12th)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                Python, C, C++, HTML
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-600 inline-block"></span>
                All Punjab Boards + FBISE
              </span>
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
                  <div className="font-semibold text-navy-800 text-sm">{channelData.name}</div>
                  <div className="text-slate-500 text-xs">Computer Science Instructor - Pakistan</div>
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
