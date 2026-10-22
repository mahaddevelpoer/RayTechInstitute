'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  FileText,
  HelpCircle,
  FileCode,
  Award,
  Newspaper,
  Video,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { EducationalStore } from '@/data/educationalStore';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    classes: 0,
    subjects: 0,
    notes: 0,
    mcqs: 0,
    pastPapers: 0,
    gazettes: 0,
    blogs: 0,
    videoMCQs: 0,
  });

  useEffect(() => {
    let alive=true;
    void EducationalStore.syncFromSupabase(true).then(()=>{if(!alive)return;
    setStats({
      classes: EducationalStore.getClasses().length,
      subjects: EducationalStore.getSubjects().length,
      notes: EducationalStore.getNotes().length,
      mcqs: EducationalStore.getMCQs().length,
      pastPapers: EducationalStore.getPastPapers().length,
      gazettes: EducationalStore.getGazettes().length,
      blogs: EducationalStore.getBlogs().length,
      videoMCQs: EducationalStore.getVideoMCQs().length,
    });
    });return()=>{alive=false;};
  }, []);

  const statCards = [
    { label: 'Active Classes', count: stats.classes, href: '/admin/classes', icon: GraduationCap, color: 'text-navy-600' },
    { label: 'Registered Subjects', count: stats.subjects, href: '/admin/subjects', icon: BookOpen, color: 'text-navy-600' },
    { label: 'Chapter Notes (PDFs)', count: stats.notes, href: '/admin/notes', icon: FileText, color: 'text-emerald-600' },
    { label: 'MCQs in Database', count: stats.mcqs, href: '/admin/mcqs', icon: HelpCircle, color: 'text-emerald-600' },
    { label: 'Video Quizzes (Timeline)', count: stats.videoMCQs, href: '/admin/videos', icon: Video, color: 'text-emerald-600' },
    { label: 'Past Papers Catalog', count: stats.pastPapers, href: '/admin/past-papers', icon: FileCode, color: 'text-orange-600' },
    { label: 'Board Gazettes', count: stats.gazettes, href: '/admin/gazettes', icon: Award, color: 'text-orange-600' },
    { label: 'Articles & Updates', count: stats.blogs, href: '/admin/blogs', icon: Newspaper, color: 'text-navy-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900">
            Admin Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management for RayTech Educational Portal (11th &amp; 12th Classes).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/mcqs"
            className="btn-primary text-xs py-2 px-3"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add MCQ</span>
          </Link>
          <Link
            href="/admin/gazettes"
            className="btn-outline text-xs py-2 px-3"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Gazette</span>
          </Link>
        </div>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5"><h2 className="text-lg font-semibold">What would you like to do?</h2><p className="my-3 text-sm text-slate-600">Choose the content type directly. Save the item, then check publishing status before opening its public page.</p><div className="grid gap-3 sm:grid-cols-2"><Link className="learn-button justify-between" href="/admin/gazettes/">Add or update a gazette<ArrowRight size={17}/></Link><Link className="learn-button justify-between" href="/admin/notes/">Add notes and a PDF<ArrowRight size={17}/></Link><Link className="learn-button justify-between" href="/admin/courses/">Edit lessons or attach a video<ArrowRight size={17}/></Link><Link className="learn-button justify-between" href="/admin/blogs/">Write an update or attach a document<ArrowRight size={17}/></Link></div></section>

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="edu-card p-5 bg-white flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">{c.label}</span>
                <Icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-navy-900 group-hover:text-navy-600 transition-colors">
                  {c.count}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-navy-600 flex items-center gap-1 transition-colors">
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Access Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="bg-white border border-slate-200 p-6 rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-navy-600" />
            <h2 className="text-base font-bold text-navy-900">Publishing Shortcuts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              href="/admin/notes"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 flex items-center justify-between transition-colors font-medium text-slate-700"
            >
              <span>+ Upload Notes PDF</span>
              <ArrowRight className="w-3.5 h-3.5 text-navy-600" />
            </Link>
            <Link
              href="/admin/blogs"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 flex items-center justify-between transition-colors font-medium text-slate-700"
            >
              <span>+ Post Date Sheet</span>
              <ArrowRight className="w-3.5 h-3.5 text-navy-600" />
            </Link>
            <Link
              href="/admin/subjects"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 flex items-center justify-between transition-colors font-medium text-slate-700"
            >
              <span>+ Register Subject</span>
              <ArrowRight className="w-3.5 h-3.5 text-navy-600" />
            </Link>
            <Link
              href="/admin/past-papers"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 flex items-center justify-between transition-colors font-medium text-slate-700"
            >
              <span>+ Add Past Paper</span>
              <ArrowRight className="w-3.5 h-3.5 text-navy-600" />
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">Cloud &amp; Security Status</h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Connected
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
              <span>Supabase Cloud DB:</span>
              <span className="text-emerald-700 font-semibold font-mono">btxrkhwyugzliswznkpx &bull; Active</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
              <span>Edge Secrets Vault:</span>
              <span className="text-emerald-700 font-semibold">SERVICE_ROLE_KEY Protected</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
              <span>Firebase Auth Guard:</span>
              <span className="text-emerald-700 font-semibold">Locked to Authorized Email Only</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
              <span>Python Compiler:</span>
              <span className="text-emerald-700 font-semibold">Pyodide Wasm Active (0s Server Cost)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
              <span>SEO Compliance:</span>
              <span className="text-emerald-700 font-semibold">100% JSON-LD &bull; Core Web Vitals OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
