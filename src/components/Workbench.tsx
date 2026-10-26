'use client';

import React from 'react';
import { workbenchData } from '@/data/workbench';
import { Code, Terminal } from 'lucide-react';

export const Workbench: React.FC = () => {
  const languages = workbenchData.filter((i) => i.category === 'Language');
  const web = workbenchData.filter((i) => i.category === 'Web Standard');
  const tools = workbenchData.filter((i) => i.category === 'Development Environment');

  return (
    <section id="workbench" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="section-title">
            Languages &amp; Software Tools
          </h2>
          <p className="text-slate-600 text-sm">
            Technologies, programming languages, and IDEs covered in the syllabus and practical labs.
          </p>
        </div>

        {/* Simple 3 Column List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Col 1: Languages */}
          <div className="edu-card p-5">
            <h3 className="font-bold text-navy-900 text-sm mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Code className="w-4 h-4 text-navy-600" />
              <span>Programming Languages</span>
            </h3>
            <ul className="space-y-3">
              {languages.map((l) => (
                <li key={l.id} className="text-xs">
                  <div className="font-semibold text-slate-800">{l.name}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{l.specification}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Web Standards */}
          <div className="edu-card p-5">
            <h3 className="font-bold text-navy-900 text-sm mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Code className="w-4 h-4 text-emerald-600" />
              <span>Web Development</span>
            </h3>
            <ul className="space-y-3">
              {web.map((w) => (
                <li key={w.id} className="text-xs">
                  <div className="font-semibold text-slate-800">{w.name}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{w.specification}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Tools & IDEs */}
          <div className="edu-card p-5">
            <h3 className="font-bold text-navy-900 text-sm mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Terminal className="w-4 h-4 text-orange-600" />
              <span>IDEs &amp; Compilers</span>
            </h3>
            <ul className="space-y-3">
              {tools.map((t) => (
                <li key={t.id} className="text-xs">
                  <div className="font-semibold text-slate-800">{t.name}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{t.specification}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive Pyodide WebAssembly Feature Callout */}
        <div className="mt-8 p-6 bg-navy-900 text-white rounded-lg border border-navy-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">100% Free In-Browser Compiler</span>
            </div>
            <h3 className="text-lg font-bold text-white">Live Python WebAssembly Compiler</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Run Python 3 scripts, loops, lists, and Board practical syllabus code instantly inside your browser without installing anything on your computer or phone.
            </p>
          </div>
          <a
            href="/learn/python/"
            className="btn-primary px-4 py-2 text-xs font-bold rounded transition-colors whitespace-nowrap self-start md:self-auto"
          >
            Open Python Lessons
          </a>
        </div>

      </div>
    </section>
  );
};
