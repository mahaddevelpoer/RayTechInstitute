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
  ArrowRight,
} from 'lucide-react';
import { EducationalStore } from '@/data/educationalStore';
import { StudyTaskLauncher } from '@/components/admin/StudyTaskLauncher';
import type { ClassItem, SubjectItem } from '@/types/educational';

export default function AdminDashboardPage() {
  const [study, setStudy] = useState<{classes:ClassItem[];subjects:SubjectItem[]}>({classes:[],subjects:[]});
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
    setStudy({classes:EducationalStore.getClasses(),subjects:EducationalStore.getSubjects()});
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
            Manage classes, subjects, study resources and programming lessons in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2"><Link className="learn-button" href="/admin/health/">Check services</Link><Link className="learn-button" href="/" target="_blank" rel="noopener noreferrer">View website</Link></div>
      </div>
      <StudyTaskLauncher classes={study.classes} subjects={study.subjects}/>
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

      <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm"><h2 className="text-base font-semibold">How publishing works</h2><p className="mt-2 text-slate-600">Add a class, add its subjects, then save study material. A website rebuild updates public pages and the home study links. Your database save is separate from the public deployment.</p><Link className="mt-3 inline-flex min-h-12 items-center gap-2 underline" href="/admin/health/">Review service and release checks<ArrowRight size={16}/></Link></section>
    </div>
  );
}
