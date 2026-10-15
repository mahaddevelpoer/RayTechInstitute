'use client';

import React, { useState, useEffect } from 'react';
import { FileCode, Plus, CheckCircle, ExternalLink, Trash2, Edit2, X, RefreshCw } from 'lucide-react';
import { EducationalStore } from '@/data/educationalStore';
import { ClassItem, SubjectItem, PastPaperItem } from '@/types/educational';

export default function AdminPastPapersPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [pastPapers, setPastPapers] = useState<PastPaperItem[]>([]);

  const [selectedClass, setSelectedClass] = useState('11th-class');
  const [selectedSubject, setSelectedSubject] = useState('computer-science');
  const [board, setBoard] = useState('BISE Lahore');
  const [year, setYear] = useState<number>(2024);
  const [session, setSession] = useState<'Annual' | 'Supplementary'>('Annual');
  const [pdfUrl, setPdfUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadData = async () => {
    setIsSyncing(true);
    await EducationalStore.syncFromSupabase();
    setClasses(EducationalStore.getClasses());
    setSubjects(EducationalStore.getSubjects());
    setPastPapers(EducationalStore.getPastPapers());
    setIsSyncing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableSubjects = subjects.filter((s) => s.classSlug === selectedClass);

  const handleSavePastPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfUrl.trim() || !board.trim()) return;

    const paperData: PastPaperItem = {
      id: editingId || `pp-${Date.now()}`,
      classSlug: selectedClass,
      subjectSlug: selectedSubject,
      board: board.trim(),
      year: Number(year) || 2024,
      session,
      pdfUrl: pdfUrl.trim(),
    };

    await EducationalStore.savePastPaper(paperData);
    setPastPapers(EducationalStore.getPastPapers());
    resetForm();
    setSuccessMsg(editingId ? `Past Paper (${board} ${year}) updated successfully!` : `Past Paper (${board} ${year}) added successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleEdit = (p: PastPaperItem) => {
    setEditingId(p.id);
    setSelectedClass(p.classSlug);
    setSelectedSubject(p.subjectSlug);
    setBoard(p.board);
    setYear(p.year);
    setSession(p.session);
    setPdfUrl(p.pdfUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setPdfUrl('');
    setYear(2024);
    setSession('Annual');
  };

  const handleDelete = async (id: string, boardName: string, yr: number) => {
    if (!confirm(`Are you sure you want to permanently delete "${boardName} ${yr}" past paper? This will delete it from Supabase.`)) {
      return;
    }
    await EducationalStore.deletePastPaper(id);
    setPastPapers(EducationalStore.getPastPapers());
    setSuccessMsg(`Past Paper deleted permanently!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const BOARDS = [
    'BISE Lahore',
    'BISE Gujranwala',
    'BISE Rawalpindi',
    'BISE Faisalabad',
    'BISE Multan',
    'BISE Sahiwal',
    'BISE Bahawalpur',
    'BISE DG Khan',
    'BISE Sargodha',
    'Federal Board (FBISE)',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900">Past Papers Archive Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish, edit, or delete board past papers across Punjab and Federal boards with live Supabase cloud sync.
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
              <span>{editingId ? 'Edit Past Paper' : 'Upload Past Paper'}</span>
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

          <form onSubmit={handleSavePastPaper} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Class</label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  const subjs = subjects.filter((s) => s.classSlug === e.target.value);
                  if (subjs.length > 0) setSelectedSubject(subjs[0].slug);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              >
                {classes.map((cls) => (
                  <option key={cls.slug} value={cls.slug}>
                    {cls.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              >
                {availableSubjects.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Board of Examination</label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              >
                {BOARDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  min={2015}
                  max={2030}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session</label>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                >
                  <option value="Annual">Annual Exam</option>
                  <option value="Supplementary">Supplementary Exam</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">PDF File URL</label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://... direct PDF download link"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-navy-600 hover:bg-navy-700 text-white font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
            >
              {editingId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Update & Save Past Paper' : 'Publish Past Paper'}</span>
            </button>
          </form>
        </div>

        {/* Existing Past Papers List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-navy-900 mb-2">Stored Past Papers ({pastPapers.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pastPapers.map((p) => (
              <div
                key={p.id}
                className="p-4 bg-white border border-slate-200 rounded-lg space-y-2.5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileCode className="w-4 h-4 text-navy-600" />
                      <span className="text-sm font-bold text-navy-900">{p.board}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 font-mono rounded border border-slate-200">
                      {p.year} {p.session}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mt-1">
                    {p.classSlug} &bull; <span className="font-semibold text-slate-800">{p.subjectSlug}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <a
                    href={p.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-navy-600 hover:underline"
                  >
                    <span>View PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-1.5 text-slate-600 hover:text-navy-600 hover:bg-slate-100 rounded transition-colors"
                      title="Edit Past Paper"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.board, p.year)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Past Paper Permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
