'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, CheckCircle, Trash2, Edit2, X, RefreshCw } from 'lucide-react';
import { EducationalStore } from '@/data/educationalStore';
import { adminOperation } from '@/utils/admin-operation';
import { chapterDisplayLabel } from '@/utils/chapter-books';
import { adminStudyContext } from '@/utils/admin-study-context';
import { ChapterItem, ClassItem, SubjectItem } from '@/types/educational';

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [numericGrade, setNumericGrade] = useState<number>(11);
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [chapterClass, setChapterClass] = useState('');
  const [chapterSubject, setChapterSubject] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [bookTitle,setBookTitle]=useState('');
  const [displayNumber,setDisplayNumber]=useState(1);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  const loadData = async () => {
    setIsSyncing(true);
    await EducationalStore.syncFromSupabase();
    setClasses(EducationalStore.getClasses());
    setSubjects(EducationalStore.getSubjects());
    setChapters(EducationalStore.getChapters());
    const context=adminStudyContext(EducationalStore.getClasses(),EducationalStore.getSubjects(),window.location.search,chapterClass,chapterSubject);setChapterClass(context.classSlug);setChapterSubject(context.subjectSlug);
    setIsSyncing(false);
  };

  const handleSaveChapter = adminOperation('classes:handleSaveChapter', async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterTitle.trim() || !chapterClass || !chapterSubject || chapterNumber < 1) return;
    const chapter: ChapterItem = {
      id: editingChapterId || `chapter-${chapterClass}-${chapterSubject}-${chapterNumber}`,
      classSlug: chapterClass,
      subjectSlug: chapterSubject,
      chapterNumber: Number(chapterNumber),
      title: chapterTitle.trim(),
      bookTitle: bookTitle.trim()||undefined,
      displayChapterNumber: displayNumber,
      description: chapterDescription.trim() || undefined,
      isActive: true,
    };
    await EducationalStore.saveChapter(chapter);
    setChapters(EducationalStore.getChapters());
    resetChapterForm();
    setSuccessMsg(editingChapterId ? `Chapter "${chapter.title}" updated successfully!` : `Chapter "${chapter.title}" added successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  });

  const resetChapterForm = () => {
    setEditingChapterId(null);
    setChapterNumber(1);
    setChapterTitle('');setBookTitle('');setDisplayNumber(1);
    setChapterDescription('');
  };

  const handleEditChapter = (chapter: ChapterItem) => {
    setEditingChapterId(chapter.id);
    setChapterClass(chapter.classSlug);
    setChapterSubject(chapter.subjectSlug);
    setChapterNumber(chapter.chapterNumber);
    setChapterTitle(chapter.title);setBookTitle(chapter.bookTitle||'');setDisplayNumber(chapter.displayChapterNumber||chapter.chapterNumber);
    setChapterDescription(chapter.description || '');
  };

  const handleDeleteChapter = adminOperation('classes:handleDeleteChapter', async (chapter: ChapterItem) => {
    if (!confirm(`Delete chapter "${chapter.title}" permanently?`)) return;
    await EducationalStore.deleteChapter(chapter.id);
    setChapters(EducationalStore.getChapters());
    setSuccessMsg(`Chapter "${chapter.title}" deleted permanently!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  });

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveClass = adminOperation('classes:handleSaveClass', async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    const classData: ClassItem = {
      id: editingId || `class-${Date.now()}`,
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      numericGrade: Number(numericGrade) || 11,
      description: description.trim(),
      isActive: true,
    };

    await EducationalStore.saveClass(classData);
    setClasses(EducationalStore.getClasses());
    resetForm();
    setSuccessMsg(editingId ? `Class "${classData.title}" updated successfully!` : `Class "${classData.title}" registered successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  });

  const handleEdit = (cls: ClassItem) => {
    setEditingId(cls.id);
    setTitle(cls.title);
    setSlug(cls.slug);
    setNumericGrade(cls.numericGrade);
    setDescription(cls.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setNumericGrade(11);
    setDescription('');
  };

  const handleDelete = adminOperation('classes:handleDelete', async (classSlug: string, classTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${classTitle}"? This will delete it from Supabase and the platform.`)) {
      return;
    }
    await EducationalStore.deleteClass(classSlug);
    setClasses(EducationalStore.getClasses());
    setSuccessMsg(`Class "${classTitle}" deleted permanently!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900">Manage Academic Classes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic class hierarchy. Edit or delete classes permanently with real-time Supabase cloud synchronization.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
              {editingId ? <Edit2 className="w-4 h-4 text-navy-600" /> : <Plus className="w-4 h-4 text-navy-600" />}
              <span>{editingId ? 'Edit Class' : 'Add New Class'}</span>
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Class Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingId && !slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }}
                placeholder="e.g. Class 9"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. 9th-class"
                disabled={!!editingId}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Numeric Grade</label>
              <input
                type="number"
                value={numericGrade}
                onChange={(e) => setNumericGrade(Number(e.target.value))}
                placeholder="11 or 12"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief summary of syllabus and study scope..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-navy-600 hover:bg-navy-700 text-white font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
            >
              {editingId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Update & Save Class' : 'Save & Publish Class'}</span>
            </button>
          </form>
        </div>

        {/* Existing Classes List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-navy-900 mb-2">Registered Classes ({classes.length})</h2>
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="p-4 bg-white border border-slate-200 rounded-lg flex items-start justify-between shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-navy-600 flex-shrink-0" />
                  <span className="text-sm font-bold text-navy-900">{cls.title}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-mono rounded border border-slate-200">
                    /{cls.slug}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{cls.description}</p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Grade Level: <span className="font-semibold text-slate-700">{cls.numericGrade}</span> &bull; Status: <span className="text-emerald-600 font-semibold">Active</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleEdit(cls)}
                  className="p-1.5 text-slate-600 hover:text-navy-600 hover:bg-slate-100 rounded transition-colors"
                  title="Edit Class"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cls.slug, cls.title)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete Class Permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="border-t border-slate-200 pt-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-navy-900">Manage Subject Chapters</h2>
          <p className="text-xs text-slate-500 mt-1">Set each chapter's number and name here. These chapters will appear in MCQ generation and student quizzes.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <form onSubmit={handleSaveChapter} className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-navy-900">{editingChapterId ? 'Edit Chapter' : 'Add Chapter'}</h3>
              {editingChapterId && <button type="button" onClick={resetChapterForm} className="text-slate-500 hover:text-slate-800">Cancel</button>}
            </div>
            <select value={chapterClass} onChange={(e) => { setChapterClass(e.target.value); setChapterSubject(''); }} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded" required>
              <option value="">Select class</option>
              {classes.map((item) => <option key={item.id} value={item.slug}>{item.title}</option>)}
            </select>
            <select value={chapterSubject} onChange={(e) => setChapterSubject(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded" required>
              <option value="">Select subject</option>
              {subjects.filter((item) => item.classSlug === chapterClass).map((item) => <option key={item.id} value={item.slug}>{item.title}</option>)}
            </select>
            <input type="number" min={1} value={chapterNumber} onChange={(e) => setChapterNumber(Number(e.target.value))} placeholder="Chapter number" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded" required />
            <label className="block">Book name (optional)<input value={bookTitle} onChange={e=>setBookTitle(e.target.value)} placeholder="e.g. MS Office" className="w-full border p-3"/></label><label className="block">Chapter number shown within this book<input type="number" min={1} value={displayNumber} onChange={e=>setDisplayNumber(Number(e.target.value))} className="w-full border p-3"/></label>
            <input value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} placeholder="e.g. Problem Solving" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded" required />
            <textarea value={chapterDescription} onChange={(e) => setChapterDescription(e.target.value)} placeholder="Short chapter description" rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded" />
            <button type="submit" className="w-full py-2 bg-navy-600 hover:bg-navy-700 text-white font-semibold rounded">{editingChapterId ? 'Update Chapter' : 'Save Chapter'}</button>
          </form>
          <div className="lg:col-span-2 space-y-2">
            {chapters.length === 0 && <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded p-4">No chapters have been added yet. Add your first chapter to get started.</p>}
            {chapters.map((chapter) => (
              <div key={chapter.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-start justify-between gap-3">
                <div><div className="text-sm font-bold text-navy-900">{chapterDisplayLabel(chapter)}</div><div className="text-[11px] text-slate-500 mt-1">{chapter.classSlug} · {chapter.subjectSlug}</div>{chapter.description && <p className="text-xs text-slate-600 mt-1">{chapter.description}</p>}</div>
                <div className="flex gap-1"><button type="button" onClick={() => handleEditChapter(chapter)} className="p-1.5 text-slate-600 hover:text-navy-600" title="Edit chapter"><Edit2 className="w-4 h-4" /></button><button type="button" onClick={() => handleDeleteChapter(chapter)} className="p-1.5 text-slate-500 hover:text-red-600" title="Delete chapter"><Trash2 className="w-4 h-4" /></button></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
