'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, CheckCircle, Trash2, Edit2, X, RefreshCw } from 'lucide-react';
import { EducationalStore } from '@/data/educationalStore';
import { ClassItem } from '@/types/educational';

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [numericGrade, setNumericGrade] = useState<number>(11);
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadData = async () => {
    setIsSyncing(true);
    await EducationalStore.syncFromSupabase();
    setClasses(EducationalStore.getClasses());
    setIsSyncing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveClass = async (e: React.FormEvent) => {
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
  };

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

  const handleDelete = async (classSlug: string, classTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${classTitle}"? This will delete it from Supabase and the platform.`)) {
      return;
    }
    await EducationalStore.deleteClass(classSlug);
    setClasses(EducationalStore.getClasses());
    setSuccessMsg(`Class "${classTitle}" deleted permanently!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

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
                placeholder="e.g. 11th Class (1st Year)"
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
                placeholder="e.g. 11th-class"
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
    </div>
  );
}
