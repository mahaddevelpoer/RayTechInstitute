'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  CheckCircle,
  ExternalLink,
  Download,
  Trash2,
  Edit2,
  X,
  RefreshCw,
  Sparkles,
  Loader2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { EducationalStore } from '@/data/educationalStore';
import { adminOperation } from '@/utils/admin-operation';
import { GazetteItem } from '@/types/educational';
import { supabase } from '@/lib/supabase';

function normalizeUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('//')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default function AdminGazettesPage() {
  const [gazettes, setGazettes] = useState<GazetteItem[]>([]);
  const [title, setTitle] = useState('');
  const [board, setBoard] = useState('BISE Lahore');
  const [classSlug, setClassSlug] = useState('12th-class');
  const [year, setYear] = useState<number>(2026);
  const [session, setSession] = useState('1st Annual Examination');
  const [pdfUrl, setPdfUrl] = useState('');
  const [directResultUrl, setDirectResultUrl] = useState('https://www.biselahore.com/');
  const [totalCandidates, setTotalCandidates] = useState('');
  const [passingPercentage, setPassingPercentage] = useState('');
  const [content, setContent] = useState('');
  const [hasActionButton, setHasActionButton] = useState(false);
  const [actionButtonText, setActionButtonText] = useState('Download Official Gazette PDF');
  const [actionButtonUrl, setActionButtonUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // ── AI Gazette Generator Modal State ───────────────────────
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiBoard, setAiBoard] = useState('BISE Lahore');
  const [aiClassSlug, setAiClassSlug] = useState('12th-class');
  const [aiYear, setAiYear] = useState<number>(2026);
  const [aiSession, setAiSession] = useState('1st Annual Examination');
  const [aiCustomNotes, setAiCustomNotes] = useState('');
  const [aiEnableActionButton, setAiEnableActionButton] = useState(true);
  const [aiActionButtonText, setAiActionButtonText] = useState('Download Official Gazette PDF');
  const [aiActionButtonUrl, setAiActionButtonUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const loadData = async () => {
    setIsSyncing(true);
    try { await EducationalStore.syncFromSupabase(true); setGazettes(EducationalStore.getGazettes()); }
    catch { setErrorMsg('Gazettes could not be refreshed. Saved data has not been changed. Try again.'); }
    finally { setIsSyncing(false); }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const handleSaveGazette = adminOperation('gazettes:handleSaveGazette', async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !pdfUrl.trim()) return;

    const newGazette: GazetteItem = {
      id: editingId || `gazette-${Date.now()}`,
      title: title.trim(),
      board: board.trim(),
      classSlug,
      year: Number(year) || 2026,
      session: session.trim(),
      pdfUrl: normalizeUrl(pdfUrl),
      directResultUrl: normalizeUrl(directResultUrl) || 'https://www.biselahore.com/',
      releaseDate: new Date().toISOString().split('T')[0],
      totalCandidates: totalCandidates.trim() || undefined,
      passingPercentage: passingPercentage.trim() || undefined,
      actionButtonText: hasActionButton && actionButtonText.trim() ? actionButtonText.trim() : undefined,
      actionButtonUrl: hasActionButton && actionButtonUrl.trim() ? normalizeUrl(actionButtonUrl) : undefined,
      content: content.trim() || undefined,
    };

    await EducationalStore.saveGazette(newGazette);
    setGazettes(EducationalStore.getGazettes());
    resetForm();
    setSuccessMsg(
      editingId
        ? `Gazette "${newGazette.title}" saved. Its public page updates after the website rebuild.`
        : `Gazette "${newGazette.title}" saved. Its public page appears after the website rebuild.`
    );
    setTimeout(() => setSuccessMsg(''), 4000);
  });

  const handleEdit = (g: GazetteItem) => {
    setEditingId(g.id);
    setTitle(g.title);
    setBoard(g.board);
    setClassSlug(g.classSlug);
    setYear(g.year);
    setSession(g.session || '1st Annual Examination');
    setPdfUrl(g.pdfUrl);
    setDirectResultUrl(g.directResultUrl || '');
    setTotalCandidates(g.totalCandidates || '');
    setPassingPercentage(g.passingPercentage || '');
    setContent(g.content || '');
    if (g.actionButtonText) {
      setHasActionButton(true);
      setActionButtonText(g.actionButtonText);
      setActionButtonUrl(g.actionButtonUrl || g.pdfUrl || '');
    } else {
      setHasActionButton(false);
      setActionButtonText('Download Official Gazette PDF');
      setActionButtonUrl('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPdfUrl('');
    setDirectResultUrl('https://www.biselahore.com/');
    setTotalCandidates('');
    setPassingPercentage('');
    setContent('');
    setHasActionButton(false);
    setActionButtonText('Download Official Gazette PDF');
    setActionButtonUrl('');
  };

  const handleDelete = adminOperation('gazettes:handleDelete', async (id: string, gTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete "${gTitle}"? This will delete it from Supabase.`
      )
    ) {
      return;
    }
    await EducationalStore.deleteGazette(id);
    setGazettes(EducationalStore.getGazettes());
    setSuccessMsg(`Gazette deleted permanently!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  });

  // ── AI Gazette Generator Handler ───────────────────────────
  const handleGenerateGazetteWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.functions.invoke('secure-dispatch', {
        body: {
          action: 'generate_gazette',
          payload: {
            board: aiBoard,
            classSlug: aiClassSlug,
            year: aiYear,
            session: aiSession,
            customNotes: aiCustomNotes.trim(),
            actionButtonText: aiEnableActionButton ? aiActionButtonText.trim() : undefined,
            actionButtonUrl: aiEnableActionButton ? aiActionButtonUrl.trim() : undefined,
          },
        },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || 'Failed to generate gazette notification from AI.');
      }

      const g = data.gazette;
      setTitle(g.title || `${aiBoard} ${aiClassSlug} Gazette ${aiYear}`);
      setBoard(g.board || aiBoard);
      setClassSlug(g.classSlug || aiClassSlug);
      setYear(Number(g.year) || aiYear);
      setSession(g.session || aiSession);
      if (g.totalCandidates) setTotalCandidates(g.totalCandidates);
      if (g.passingPercentage) setPassingPercentage(g.passingPercentage);
      if (g.pdfUrl) setPdfUrl(g.pdfUrl);
      if (g.directResultUrl) setDirectResultUrl(g.directResultUrl);
      if (g.content) setContent(g.content);

      if (aiEnableActionButton) {
        setHasActionButton(true);
        setActionButtonText(aiActionButtonText.trim() || g.actionButtonText || 'Download Official Gazette PDF');
        setActionButtonUrl(aiActionButtonUrl.trim() || g.actionButtonUrl || g.pdfUrl || '');
      } else {
        setHasActionButton(false);
      }

      setAiModalOpen(false);
      setSuccessMsg('AI Gazette notification generated! Review the details below and click Publish.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while contacting AI service.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900">
            Result Gazettes &amp; Records Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish official BISE board gazettes, custom download action buttons, and AI-written result notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* AI Writer Button */}
          <button
            onClick={() => setAiModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Write Gazette with AI</span>
          </button>

          <button
            onClick={loadData}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Refreshing...' : 'Refresh list'}</span>
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

      {/* ── AI GAZETTE GENERATOR MODAL ────────────────────────────── */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-xl w-full p-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-navy-900">
                  AI Result Gazette &amp; Notification Assistant
                </h2>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateGazetteWithAI} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Education Board</label>
                  <select
                    value={aiBoard}
                    onChange={(e) => setAiBoard(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:outline-none"
                  >
                    {BOARDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={aiClassSlug}
                    onChange={(e) => setAiClassSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:outline-none"
                  >
                    <option value="11th-class">11th Class (1st Year HSSC-I)</option>
                    <option value="12th-class">12th Class (2nd Year HSSC-II)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Examination Year</label>
                  <input
                    type="number"
                    value={aiYear}
                    onChange={(e) => setAiYear(Number(e.target.value))}
                    min={2020}
                    max={2030}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Session</label>
                  <input
                    type="text"
                    value={aiSession}
                    onChange={(e) => setAiSession(e.target.value)}
                    placeholder="1st Annual Examination"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Custom Board Circular Notes or Remarks (Optional)
                </label>
                <textarea
                  value={aiCustomNotes}
                  onChange={(e) => setAiCustomNotes(e.target.value)}
                  rows={2}
                  placeholder="Paste any circular details, rechecking deadline, or specific stats..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:outline-none"
                />
              </div>

              {/* Optional Custom Action Button in AI Gazette */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={aiEnableActionButton}
                    onChange={(e) => setAiEnableActionButton(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Attach Custom Action / Download Button (Optional)</span>
                </label>

                {aiEnableActionButton && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200 animate-fade-in">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Button Label / Text
                      </label>
                      <input
                        type="text"
                        value={aiActionButtonText}
                        onChange={(e) => setAiActionButtonText(e.target.value)}
                        placeholder="e.g. Download Gazette PDF, Check Roll No"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:border-navy-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Target Link / URL
                      </label>
                      <input
                        type="text"
                        value={aiActionButtonUrl}
                        onChange={(e) => setAiActionButtonUrl(e.target.value)}
                        placeholder="e.g. https://www.biselahore.com/ or PDF URL"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:border-navy-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
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
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded flex items-center gap-2 transition-colors disabled:opacity-60 shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing Result Gazette with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Gazette Notification Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MAIN GAZETTE EDITOR GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
              {editingId ? <Edit2 className="w-4 h-4 text-navy-600" /> : <Plus className="w-4 h-4 text-navy-600" />}
              <span>{editingId ? 'Edit Gazette' : 'Publish Gazette'}</span>
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

          <form onSubmit={handleSaveGazette} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gazette Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. BISE Lahore 12th Class Gazette 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Board</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Class</label>
                <select
                  value={classSlug}
                  onChange={(e) => setClassSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                >
                  <option value="11th-class">11th Class (1st Year)</option>
                  <option value="12th-class">12th Class (2nd Year)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  min={2020}
                  max={2030}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Session</label>
              <input
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="1st Annual Examination"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">PDF File URL</label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="Direct PDF file download link"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Board Official Portal URL</label>
              <input
                type="url"
                value={directResultUrl}
                onChange={(e) => setDirectResultUrl(e.target.value)}
                placeholder="https://www.biselahore.com/"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Optional Custom Action / Download Button */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={hasActionButton}
                    onChange={(e) => setHasActionButton(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Attach Custom Action Button (Optional)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {hasActionButton ? '✓ Enabled' : '○ Disabled'}
                </span>
              </div>

              {hasActionButton && (
                <div className="space-y-2 pt-1 border-t border-slate-200 animate-fade-in">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Button Label / Name (e.g. Download Gazette, Check Roll No)
                    </label>
                    <input
                      type="text"
                      value={actionButtonText}
                      onChange={(e) => setActionButtonText(e.target.value)}
                      placeholder="e.g. Download Official Gazette PDF"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Target Link / URL (Overrides default PDF if set)
                    </label>
                    <input
                      type="text"
                      value={actionButtonUrl}
                      onChange={(e) => setActionButtonUrl(e.target.value)}
                      placeholder="https://... or /results-gazettes/"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Candidates</label>
                <input
                  type="text"
                  value={totalCandidates}
                  onChange={(e) => setTotalCandidates(e.target.value)}
                  placeholder="e.g. 185,000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pass %</label>
                <input
                  type="text"
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(e.target.value)}
                  placeholder="e.g. 68.2%"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Optional Detailed Notification Content */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Detailed Board Notification Writing (Markdown)</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Official board result summary, SMS checking instructions, rechecking schedule..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono text-xs focus:border-navy-600 focus:bg-white focus:outline-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-navy-600 hover:bg-navy-700 text-white font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
            >
              {editingId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Update & Save Gazette' : 'Publish Result Gazette'}</span>
            </button>
          </form>
        </div>

        {/* Existing Gazettes List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-navy-900 mb-2">
            Available Gazettes ({gazettes.length})
          </h2>

          {gazettes.map((g) => (
            <div
              key={g.id}
              className="p-4 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-navy-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-navy-900">{g.title}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {g.board} &bull; {g.year} &bull; {g.session}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(g)}
                    className="p-1.5 text-slate-600 hover:text-navy-600 hover:bg-slate-100 rounded transition-colors"
                    title="Edit Gazette"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(g.id, g.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Gazette Permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {g.totalCandidates && (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">Candidates</div>
                    <div className="font-semibold text-slate-800">{g.totalCandidates}</div>
                  </div>
                )}
                {g.passingPercentage && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                    <div className="text-[10px] text-emerald-700 uppercase tracking-wide">Pass Percentage</div>
                    <div className="font-semibold text-emerald-900">{g.passingPercentage}</div>
                  </div>
                )}
              </div>

              {/* Action Button Details if custom configured */}
              {g.actionButtonText && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-900 block text-[11px]">
                      Custom Action Button Active:
                    </span>
                    <span className="text-slate-600 text-[11px]">
                      {g.actionButtonText}
                    </span>
                  </div>
                  <a
                    href={g.actionButtonUrl || g.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>{g.actionButtonText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Notification writing preview if present */}
              {g.content && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                  <div className="font-bold text-navy-900 text-[11px] mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-navy-600" />
                    <span>Official Notification Summary:</span>
                  </div>
                  <p className="line-clamp-2 text-slate-600 text-[11px]">
                    {g.content}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <a
                  href={g.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-navy-600 hover:underline"
                >
                  <Download className="w-3 h-3" />
                  <span>Download PDF</span>
                </a>

                {g.directResultUrl && (
                  <a
                    href={g.directResultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-slate-600 hover:text-navy-600"
                  >
                    <span>Check Online Result</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
