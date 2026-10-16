'use client';

import React from 'react';
import Link from 'next/link';
import { channelData, hasValidTikTokUrl } from '@/data/channel';
import { Youtube, ExternalLink, ArrowUp, Lock, BookOpen, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const showTikTok = hasValidTikTokUrl(channelData.tiktokUrl);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-sm">
          
          {/* Col 1: Institute About */}
          <div className="md:col-span-1 space-y-3">
            <p className="font-bold text-white text-base">
              {channelData.name}
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              {channelData.tagline}
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Educational portal dedicated to intermediate students (11th &amp; 12th classes), providing syllabus notes, past papers, MCQs, and board results.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white text-sm">
              Study Resources
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link href="/classes" className="hover:text-white transition-colors">
                  11th &amp; 12th Class Notes
                </Link>
              </li>
              <li>
                <Link href="/classes/11th-class/computer-science/mcqs" className="hover:text-white transition-colors">
                  Online MCQs Test
                </Link>
              </li>
              <li>
                <Link href="/classes/12th-class/computer-science/past-papers" className="hover:text-white transition-colors">
                  Board Past Papers
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Date Sheets &amp; Alerts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Gazettes & Boards */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white text-sm">
              Punjab Boards &amp; Gazettes
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link href="/results-gazettes" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                  BISE Lahore Gazettes
                </Link>
              </li>
              <li>
                <Link href="/results-gazettes" className="hover:text-white transition-colors">
                  BISE Gujranwala Gazettes
                </Link>
              </li>
              <li>
                <Link href="/results-gazettes" className="hover:text-white transition-colors">
                  BISE Rawalpindi &amp; Multan
                </Link>
              </li>
              <li>
                <Link href="/results-gazettes" className="hover:text-white transition-colors">
                  FBISE Federal Board
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official & Legal */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white text-sm">
              Official Links
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a
                  href={channelData.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>YouTube Channel</span>
                </a>
              </li>
              {showTikTok && (
                <li>
                  <a
                    href={channelData.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    TikTok Channel
                  </a>
                </li>
              )}
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors pt-1">
                  <Lock className="w-3 h-3" />
                  <span>Admin Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} {channelData.name}. All educational materials prepared for Pakistani students.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-slate-300 transition-colors"
          >
            <span>Top of page</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
