'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, CheckCircle, Trash2, Edit2, X, RefreshCw } from 'lucide-react';
import { EducationalStore } from '@/data/educationalStore';
import { ClassItem, SubjectItem } from '@/types/educational';

export default function AdminSubjectsPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedClass, setSelectedClass] = useState('11th-class');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Code');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadData = async () => {
    setIsSyncing(true);
    await EducationalStore.syncFromSupabase();
    const cList = EducationalStore.getClasses();
    setClasses(cList);
    setSubjects(EducationalStore.getSubjects());
    if (cList.length > 0 && !selectedClass) {
      setSelectedClass(cList[0].slug);
    }
    setIsSyncing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !selectedClass) return;

    const newSubject: SubjectItem = {
      id: editingId || `subj-${Date.now()}`,
      classSlug: selectedClass,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      title: title.trim(),
      iconName: iconName || 'Code',
      description: description.trim(),
    };

    await EducationalStore.saveSubject(newSubject);
    setSubjects(EducationalStore.getSubjects());
    resetForm();
    setSuccessMsg(editingId ? `Subject "${newSubject.title}" updated successfully!` : `Subject "${newSubject.title}" added to ${selectedClass} successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleEdit = (subj: SubjectItem) => {
    setEditingId(subj.id);
    setSelectedClass(subj.classSlug);
    setTitle(subj.title);
    setSlug(subj.slug);
    setIconName(subj.iconName || 'Code');
    setDescription(subj.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setIconName('Code');
  };

  const handleDelete = async (id: string, subjTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${subjTitle}"? This will delete it from Supabase and the platform.`)) {
      return;
    }
    await EducationalStore.deleteSubject(id);
    setSubjects(EducationalStore.getSubjects());
    setSuccessMsg(`Subject "${subjTitle}" deleted permanently!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900">Manage Academic Subjects</h1>
          <p className="text-xs text-slate-500 mt-1">
            Register, edit, or delete subjects under classes with real-time Supabase cloud sync.
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
              <span>{editingId ? 'Edit Subject' : 'Add New Subject'}</span>
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

          <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
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
              <label className="block font-semibold text-slate-700 mb-1">Subject Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingId && !slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }}
                placeholder="e.g. Computer Science"
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
                placeholder="e.g. computer-science"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Icon Type</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              >
                <option value="Code">Code (Computer Science)</option>
                <option value="Atom">Atom (Physics)</option>
                <option value="FlaskConical">Flask (Chemistry)</option>
                <option value="Calculator">Calculator (Mathematics)</option>
                <option value="Book">Book (General / Language)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Key focus areas, chapters overview..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-navy-600 hover:bg-navy-700 text-white font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
            >
              {editingId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Update & Save Subject' : 'Publish Subject'}</span>
            </button>
          </form>
        </div>

        {/* Existing Subjects List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-navy-900 mb-2">Registered Subjects ({subjects.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.map((subj) => (
              <div
                key={subj.id}
                className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-navy-600" />
                      <span className="text-sm font-bold text-navy-900">{subj.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-mono rounded border border-slate-200">
                      {subj.classSlug}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{subj.description}</p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Path: /{subj.classSlug}/{subj.slug}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-3 mt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleEdit(subj)}
                    className="p-1.5 text-slate-600 hover:text-navy-600 hover:bg-slate-100 rounded transition-colors"
                    title="Edit Subject"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(subj.id, subj.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Subject Permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
