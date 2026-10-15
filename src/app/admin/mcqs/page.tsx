'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  CheckCircle,
  Trash2,
  Edit2,
  X,
  RefreshCw,
  Code,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { EducationalStore } from '@/data/educationalStore';
import { ClassItem, SubjectItem, MCQItem } from '@/types/educational';
import { supabase } from '@/lib/supabase';
import { getFirebaseIdToken } from '@/utils/security';

export default function AdminMCQsPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [mcqs, setMCQs] = useState<MCQItem[]>([]);

  const [selectedClass, setSelectedClass] = useState('11th-class');
  const [selectedSubject, setSelectedSubject] = useState('computer-science');
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [question, setQuestion] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // ── AI MCQs Modal State (OpenCode Big Pickle) ──────────────
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiClass, setAiClass] = useState('11th-class');
  const [aiSubject, setAiSubject] = useState('computer-science');
  const [aiChapter, setAiChapter] = useState(1);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadData = async () => {
    setIsSyncing(true);
    await EducationalStore.syncFromSupabase();
    setClasses(EducationalStore.getClasses());
    setSubjects(EducationalStore.getSubjects());
    setMCQs(EducationalStore.getMCQs());
    setIsSyncing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableSubjects = subjects.filter((s) => s.classSlug === selectedClass);
  const aiAvailableSubjects = subjects.filter((s) => s.classSlug === aiClass);

  const handleSaveMCQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !opt0.trim() || !opt1.trim() || !opt2.trim() || !opt3.trim()) return;

    const newMCQ: MCQItem = {
      id: editingId || `mcq-${Date.now()}`,
      classSlug: selectedClass,
      subjectSlug: selectedSubject,
      chapterNumber: Number(chapterNumber) || 1,
      question: question.trim(),
      codeSnippet: codeSnippet.trim() || undefined,
      options: [opt0.trim(), opt1.trim(), opt2.trim(), opt3.trim()],
      correctIndex: Number(correctIndex),
      explanation: explanation.trim() || 'Correct answer verified against syllabus.',
    };

    await EducationalStore.saveMCQ(newMCQ);
    setMCQs(EducationalStore.getMCQs());
    resetForm();
    setSuccessMsg(
      editingId
        ? 'MCQ question updated successfully!'
        : 'New MCQ added successfully to the testing bank!'
    );
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleEdit = (m: MCQItem) => {
    setEditingId(m.id);
    setSelectedClass(m.classSlug);
    setSelectedSubject(m.subjectSlug);
    setChapterNumber(m.chapterNumber);
    setQuestion(m.question);
    setCodeSnippet(m.codeSnippet || '');
    setOpt0(m.options[0] || '');
    setOpt1(m.options[1] || '');
    setOpt2(m.options[2] || '');
    setOpt3(m.options[3] || '');
    setCorrectIndex(m.correctIndex || 0);
    setExplanation(m.explanation || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setQuestion('');
    setCodeSnippet('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setExplanation('');
    setCorrectIndex(0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this MCQ? This will delete it from Supabase.')) {
      return;
    }
    await EducationalStore.deleteMCQ(id);
    setMCQs(EducationalStore.getMCQs());
    setSuccessMsg('MCQ deleted permanently!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // ── AI MCQs Generation Handler (OpenCode Big Pickle) ───────
  const handleGenerateMCQsWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.functions.invoke('secure-dispatch', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0eHJraHd5dWd6bGlzd3pua3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzUwMTAsImV4cCI6MjEwNzIxMTAxMH0.VQ0mmf_6a2swpSyyEMBUpWtgt9CZ3hkBCH_l2fISwD4'}`,
        },
        body: {
          action: 'generate_mcqs',
          payload: {
            classSlug: aiClass,
            subjectSlug: aiSubject,
            chapterNumber: Number(aiChapter) || 1,
            topic: aiTopic.trim(),
            count: Number(aiCount) || 5,
          },
        },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Failed to generate MCQs with OpenCode Big Pickle.');
      }

      const generatedList = data.mcqs;
      if (!Array.isArray(generatedList) || generatedList.length === 0) {
        throw new Error('No MCQs returned from AI reasoning engine.');
      }

      // Save each generated MCQ to local store + Supabase
      for (const item of generatedList) {
        const newMCQ: MCQItem = {
          id: `mcq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          classSlug: aiClass,
          subjectSlug: aiSubject,
          chapterNumber: Number(aiChapter) || 1,
          question: item.question,
          codeSnippet: item.codeSnippet || undefined,
          options: Array.isArray(item.options) ? item.options : ['A', 'B', 'C', 'D'],
          correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
          explanation: item.explanation || 'Verified textbook reasoning.',
        };
        await EducationalStore.saveMCQ(newMCQ);
      }

      setMCQs(EducationalStore.getMCQs());
      setAiModalOpen(false);
      setSuccessMsg(`Successfully generated and stored ${generatedList.length} MCQs via Big Pickle!`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while contacting OpenCode AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900">MCQs Testing Bank Builder</h1>
          <p className="text-xs text-slate-500 mt-1">
            Build, edit, or delete interactive quizzes with OpenCode Big Pickle reasoning and live Supabase sync.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setAiModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ Generate MCQs with Big Pickle</span>
          </button>

          <button
            onClick={loadData}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── AI MCQS GENERATOR MODAL (OpenCode Big Pickle) ──────────── */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-navy-900">
                    OpenCode Big Pickle AI Exam Generator
                  </h2>
                  <p className="text-xs text-slate-500">
                    Deep reasoning engine for verified board MCQs &amp; code snippets.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateMCQsWithAI} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={aiClass}
                    onChange={(e) => {
                      setAiClass(e.target.value);
                      const subjs = subjects.filter((s) => s.classSlug === e.target.value);
                      if (subjs.length > 0) setAiSubject(subjs[0].slug);
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
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                  >
                    {aiAvailableSubjects.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chapter #</label>
                  <input
                    type="number"
                    value={aiChapter}
                    onChange={(e) => setAiChapter(Number(e.target.value))}
                    min={1}
                    max={20}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Number of Questions</label>
                  <select
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions (Recommended)</option>
                    <option value={10}>10 Questions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specific Topic / Focus Concept (Optional)
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Loops &amp; Nested Conditionals in Python or Memory Addressing"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-[11px] text-emerald-900 space-y-1">
                <span className="font-bold">Reasoning Validation:</span>
                <p>
                  Big Pickle will reason step-by-step to formulate authentic 4-option questions matching standard Punjab Board exam patterns with verified answer keys.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  disabled={isGenerating}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded flex items-center gap-2 transition-colors disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Reasoning &amp; Generating MCQs...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate &amp; Import MCQs</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MAIN MCQ BUILDER GRID ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
              {editingId ? <Edit2 className="w-4 h-4 text-navy-600" /> : <Plus className="w-4 h-4 text-navy-600" />}
              <span>{editingId ? 'Edit MCQ' : 'Create New MCQ'}</span>
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

          <form onSubmit={handleSaveMCQ} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class</label>
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
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chapter #</label>
              <input
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(Number(e.target.value))}
                min={1}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Question Statement</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="Type the full exam question statement..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Code Snippet (Optional)</span>
                <Code className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={2}
                placeholder="e.g. for i in range(5): print(i)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono text-[11px] focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">4 Multiple Choices</label>
              {[
                { val: opt0, set: setOpt0, idx: 0, label: 'A' },
                { val: opt1, set: setOpt1, idx: 1, label: 'B' },
                { val: opt2, set: setOpt2, idx: 2, label: 'C' },
                { val: opt3, set: setOpt3, idx: 3, label: 'D' },
              ].map((opt) => (
                <div key={opt.idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct_choice"
                    checked={correctIndex === opt.idx}
                    onChange={() => setCorrectIndex(opt.idx)}
                    className="w-4 h-4 text-navy-600"
                    title={`Mark ${opt.label} as correct answer`}
                  />
                  <span className="font-bold text-slate-600 w-4">{opt.label}:</span>
                  <input
                    type="text"
                    value={opt.val}
                    onChange={(e) => opt.set(e.target.value)}
                    placeholder={`Option ${opt.label}`}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              ))}
              <p className="text-[10px] text-slate-500 italic">Select the radio button beside the correct answer.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Answer Explanation</label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={2}
                placeholder="Explain why this option is correct according to textbook..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-navy-600 hover:bg-navy-700 text-white font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
            >
              {editingId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Update & Save MCQ' : 'Save & Publish MCQ'}</span>
            </button>
          </form>
        </div>

        {/* Existing MCQs List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-navy-900 mb-2">Quiz Bank ({mcqs.length} Questions)</h2>
          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {mcqs.map((m, i) => (
              <div
                key={m.id}
                className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-navy-50 text-navy-700 font-bold text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-xs text-slate-500">
                        {m.classSlug} &bull; {m.subjectSlug} &bull; Chapter {m.chapterNumber}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mt-2">{m.question}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(m)}
                      className="p-1.5 text-slate-600 hover:text-navy-600 hover:bg-slate-100 rounded transition-colors"
                      title="Edit MCQ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete MCQ Permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {m.codeSnippet && (
                  <pre className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded overflow-x-auto">
                    {m.codeSnippet}
                  </pre>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {m.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded border ${
                        idx === m.correctIndex
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="font-bold mr-1.5">
                        {['A', 'B', 'C', 'D'][idx]}:
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>

                {m.explanation && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="font-semibold text-slate-700">Explanation: </span>
                    {m.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
