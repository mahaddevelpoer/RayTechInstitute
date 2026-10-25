'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, CheckCircle, ExternalLink, Download, Trash2, Edit2, X, RefreshCw, Eye, Sparkles, Link2, AlertCircle, BookOpen } from 'lucide-react';
import { EducationalStore } from '@/data/educationalStore';
import { adminOperation } from '@/utils/admin-operation';
import { ClassItem, SubjectItem, NoteItem } from '@/types/educational';
import { supabase } from '@/lib/supabase';
import { adminFunctionError } from '@/lib/admin-function-error';
import { normalizeDocumentInput } from '@/utils/documents';
import { adminStudyContext } from '@/utils/admin-study-context';

export default function AdminNotesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [chapterTitle, setChapterTitle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [content, setContent] = useState('');
  const [previewPdfUrl, setPreviewPdfUrl] = useState('');

  // Action Button State
  const [hasActionButton, setHasActionButton] = useState(false);
  const [actionButtonText, setActionButtonText] = useState('');
  const [actionButtonUrl, setActionButtonUrl] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [saveError, setSaveError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // AI Writer Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiClassSlug, setAiClassSlug] = useState('11th-class');
  const [aiSubjectSlug, setAiSubjectSlug] = useState('computer-science');
  const [aiChapterNumber, setAiChapterNumber] = useState<number>(1);
  const [aiChapterTitle, setAiChapterTitle] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [aiCustomNotes, setAiCustomNotes] = useState('');
  const [aiEnableActionButton, setAiEnableActionButton] = useState(false);
  const [aiActionButtonText, setAiActionButtonText] = useState('');
  const [aiActionButtonUrl, setAiActionButtonUrl] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const loadData = async () => {
    setIsSyncing(true);
    try { await EducationalStore.syncFromSupabase(true); const c=EducationalStore.getClasses(),s=EducationalStore.getSubjects();setClasses(c);setSubjects(s);setNotes(EducationalStore.getNotes());const context=adminStudyContext(c,s,window.location.search,selectedClass,selectedSubject);setSelectedClass(context.classSlug);setSelectedSubject(context.subjectSlug); }
    finally { setIsSyncing(false); }
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableSubjects = subjects.filter((s) => s.classSlug === selectedClass);
  const aiAvailableSubjects = subjects.filter((s) => s.classSlug === aiClassSlug);

  /**
   * Converts a standard Google Drive share link to an embeddable preview URL.
   * Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
   * Output: https://drive.google.com/file/d/FILE_ID/preview
   */
  const convertGoogleDriveLink = (url: string): string => {
    if (!url) return '';
    // Match Google Drive file link patterns
    if (new URL(url).hostname !== 'drive.google.com') return url;
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    // Already an embed/preview link or non-Drive link: return as-is
    return url;
  };

  const handleSaveNote = adminOperation('notes:handleSaveNote', async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapterTitle.trim() || !pdfUrl.trim()) return;
    setSaveError('');
    setSuccessMsg('');

    const existing = editingId ? notes.find((n) => n.id === editingId) : null;

    try {
    const noteData: NoteItem = {
      id: editingId || `note-${Date.now()}`,
      classSlug: selectedClass,
      subjectSlug: selectedSubject,
      chapterNumber: Number(chapterNumber) || 1,
      chapterTitle: chapterTitle.trim(),
      title: title.trim(),
      description: description.trim(),
      pdfUrl: normalizeDocumentInput(pdfUrl, 'PDF download URL'),
      fileSize: fileSize.trim() || 'PDF',
      downloadCount: existing ? existing.downloadCount : 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      content: content.trim() || undefined,
      previewPdfUrl: previewPdfUrl.trim() ? convertGoogleDriveLink(normalizeDocumentInput(previewPdfUrl, 'PDF preview URL')) : undefined,
      actionButtonText: hasActionButton && actionButtonText.trim() ? actionButtonText.trim() : undefined,
      actionButtonUrl: hasActionButton && actionButtonUrl.trim() ? normalizeDocumentInput(actionButtonUrl, 'Action button URL', true) : undefined,
    };

      await EducationalStore.saveNote(noteData);
      setNotes(EducationalStore.getNotes());
      resetForm();
      setSuccessMsg(`Note "${noteData.title}" saved. Its public page updates after the website rebuild.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save note.';
      setSaveError(msg);
    }
  });

  const handleEdit = (n: NoteItem) => {
    setEditingId(n.id);
    setSelectedClass(n.classSlug);
    setSelectedSubject(n.subjectSlug);
    setChapterNumber(n.chapterNumber);
    setChapterTitle(n.chapterTitle);
    setTitle(n.title);
    setDescription(n.description);
    setPdfUrl(n.pdfUrl);
    setFileSize(n.fileSize || '');
    setContent(n.content || '');
    setPreviewPdfUrl(n.previewPdfUrl || '');
    setHasActionButton(Boolean(n.actionButtonText && n.actionButtonUrl));
    setActionButtonText(n.actionButtonText || '');
    setActionButtonUrl(n.actionButtonUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setChapterTitle('');
    setDescription('');
    setPdfUrl('');
    setFileSize('');
    setContent('');
    setPreviewPdfUrl('');
    setHasActionButton(false);
    setActionButtonText('');
    setActionButtonUrl('');
    setChapterNumber(1);
  };

  const handleDelete = adminOperation('notes:handleDelete', async (id: string, noteTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${noteTitle}"? This will delete it from Supabase and the platform.`)) {
      return;
    }
    await EducationalStore.deleteNote(id);
    setNotes(EducationalStore.getNotes());
    setSuccessMsg(`Note "${noteTitle}" deleted permanently!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  });

  // ── AI Notes Writer Handler ──
  const handleGenerateNotesWithAI = async () => {
    if (!aiChapterTitle.trim()) {
      setAiError('Chapter Title is required for AI to generate content.');
      return;
    }
    setAiLoading(true);
    setAiError('');

    try {
      const { data, error } = await supabase.functions.invoke('secure-dispatch', {
        body: {
          action: 'generate_notes',
          payload: {
            classSlug: aiClassSlug,
            subjectSlug: aiSubjectSlug,
            chapterNumber: aiChapterNumber,
            chapterTitle: aiChapterTitle.trim(),
            topic: aiTopic.trim() || aiChapterTitle.trim(),
            customNotes: aiCustomNotes.trim() || '',
            actionButtonText: aiEnableActionButton ? aiActionButtonText.trim() : '',
            actionButtonUrl: aiEnableActionButton ? aiActionButtonUrl.trim() : '',
          },
        },
      });

      if (error || !data?.success) {
        throw await adminFunctionError(error, data, 'The study guide could not be generated. Your form has not been cleared. Please retry.');
      }

      const aiNote = data.note;

      // Pre-fill the main form with AI-generated content
      setSelectedClass(aiClassSlug);
      setSelectedSubject(aiSubjectSlug);
      setChapterNumber(aiNote.chapterNumber || aiChapterNumber);
      setChapterTitle(aiNote.chapterTitle || aiChapterTitle);
      setTitle(aiNote.title || `Chapter ${aiChapterNumber}: ${aiChapterTitle} - Complete Solved Notes`);
      setDescription(aiNote.description || '');
      setContent(aiNote.content || '');
      if(aiNote.pdfUrl)setPdfUrl(aiNote.pdfUrl);
      if(aiNote.previewPdfUrl)setPreviewPdfUrl(aiNote.previewPdfUrl);

      if (aiNote.actionButtonText && aiNote.actionButtonUrl) {
        setHasActionButton(true);
        setActionButtonText(aiNote.actionButtonText);
        setActionButtonUrl(aiNote.actionButtonUrl);
      } else if (aiEnableActionButton && aiActionButtonText && aiActionButtonUrl) {
        setHasActionButton(true);
        setActionButtonText(aiActionButtonText);
        setActionButtonUrl(aiActionButtonUrl);
      }

      setShowAiModal(false);
      setSuccessMsg('AI Notes content generated! Review the form below, add your PDF link, and publish.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      setAiError(err.message || 'Failed to generate notes with AI.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {saveError && <div role="alert" className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-900"><p>{saveError}</p><p className="mt-2">Your form has not been cleared.</p><button type="button" className="mt-2 min-h-12 rounded-md border border-red-300 px-3 font-semibold" onClick={() => setSaveError('')}>Dismiss error</button></div>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900">Notes Repository Manager</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish, edit, or delete chapter-wise notes and PDF study resources with live Supabase cloud sync.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setAiClassSlug(selectedClass);
              setAiSubjectSlug(selectedSubject);
              setAiChapterNumber(chapterNumber);
              setAiChapterTitle('');
              setAiTopic('');
              setAiCustomNotes('');
              setAiEnableActionButton(false);
              setAiActionButtonText('');
              setAiActionButtonUrl('');
              setAiError('');
              setShowAiModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Write Notes with AI</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
              {editingId ? <Edit2 className="w-4 h-4 text-navy-600" /> : <Plus className="w-4 h-4 text-navy-600" />}
              <span>{editingId ? 'Edit Note' : 'Upload New Note'}</span>
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

          <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
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

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
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
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Chapter Title</label>
                <input
                  type="text"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="e.g. Information Networks"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Note Display Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete Solved Chapter 1 Notes"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">PDF Download URL (Direct Link)</label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://drive.google.com/uc?export=download&id=FILE_ID"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Direct download link for the PDF file.</p>
            </div>

            {/* Google Drive Preview URL */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Eye className="w-3 h-3 text-navy-600" />
                Google Drive PDF Preview URL (Optional)
              </label>
              <input
                type="url"
                value={previewPdfUrl}
                onChange={(e) => setPreviewPdfUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Paste Google Drive share link. Auto-converts to embeddable preview for on-page PDF viewer.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 2.4 MB"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Key topics and conceptual questions covered..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Detailed Content / AI-Generated Study Guide */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-navy-600" />
                Detailed Content / Study Guide (Optional - Markdown)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="AI-generated or manually written chapter analysis, key concepts, solved exercise summaries, important definitions, board exam tips..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none font-mono text-[11px] leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Rich Markdown content displayed on the public notes page below the PDF preview.</p>
            </div>

            {/* Optional Action Button */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasActionButton}
                  onChange={(e) => setHasActionButton(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                />
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-navy-600" />
                  Attach Action / Download Button (Optional)
                </span>
              </label>
              {hasActionButton && (
                <div className="mt-2 space-y-2 pl-5 border-l-2 border-navy-100">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Button Label</label>
                    <input
                      type="text"
                      value={actionButtonText}
                      onChange={(e) => setActionButtonText(e.target.value)}
                      placeholder='e.g. "Download Solved Exercises", "View Answer Key", "Practice Questions"'
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Target Link / URL</label>
                    <input
                      type="url"
                      value={actionButtonUrl}
                      onChange={(e) => setActionButtonUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  {actionButtonText && actionButtonUrl && (
                    <div className="mt-1">
                      <span className="text-[10px] text-slate-400">Preview:</span>
                      <div className="mt-0.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-600 text-white text-[11px] font-semibold rounded-md">
                        <ExternalLink className="w-3 h-3" />
                        {actionButtonText}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-navy-600 hover:bg-navy-700 text-white font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
            >
              {editingId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Update & Save Notes' : 'Save & Publish Notes'}</span>
            </button>
          </form>
        </div>

        {/* Existing Notes List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-navy-900 mb-2">Published Notes ({notes.length})</h2>
          {notes.map((n) => (
            <div
              key={n.id}
              className="p-4 bg-white border border-slate-200 rounded-lg space-y-2 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-navy-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-navy-900">{n.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {n.classSlug} &bull; {n.subjectSlug} &bull; Chapter {n.chapterNumber}: {n.chapterTitle}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-mono rounded border border-slate-200">
                  {n.fileSize || 'PDF'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-1.5">
                {n.previewPdfUrl && (
                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 font-medium flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" /> PDF Preview
                  </span>
                )}
                {n.content && (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-medium flex items-center gap-1">
                    <BookOpen className="w-2.5 h-2.5" /> Study Guide
                  </span>
                )}
                {n.actionButtonText && n.actionButtonUrl && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200 font-medium flex items-center gap-1">
                    <Link2 className="w-2.5 h-2.5" /> {n.actionButtonText}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <Download className="w-3 h-3 text-slate-400" />
                    <span>{n.downloadCount} Downloads</span>
                  </span>
                  <a
                    href={n.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-navy-600 hover:underline"
                  >
                    <span>Verify Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(n)}
                    className="p-1.5 text-slate-600 hover:text-navy-600 hover:bg-slate-100 rounded transition-colors"
                    title="Edit Note"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(n.id, n.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Note Permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Notes Writer Modal ── */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-5 py-3 bg-emerald-600 text-white flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold">AI Notes Writer</span>
              </div>
              <button onClick={() => setShowAiModal(false)} className="p-1 hover:bg-emerald-700 rounded transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                AI will generate a comprehensive chapter study guide with key concepts, important definitions,
                solved exercise summaries, board exam tips, and detailed topic analysis. You still need to provide
                the actual PDF link after generation.
              </p>

              {aiError && (
                <div className="p-2.5 bg-red-50 border border-red-300 rounded text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{aiError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Class</label>
                <select
                  value={aiClassSlug}
                  onChange={(e) => {
                    setAiClassSlug(e.target.value);
                    const subjs = subjects.filter((s) => s.classSlug === e.target.value);
                    if (subjs.length > 0) setAiSubjectSlug(subjs[0].slug);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-emerald-600 focus:outline-none"
                >
                  {classes.map((cls) => (
                    <option key={cls.slug} value={cls.slug}>{cls.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={aiSubjectSlug}
                  onChange={(e) => setAiSubjectSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-emerald-600 focus:outline-none"
                >
                  {aiAvailableSubjects.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Chapter #</label>
                  <input
                    type="number"
                    value={aiChapterNumber}
                    onChange={(e) => setAiChapterNumber(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Chapter Title *</label>
                  <input
                    type="text"
                    value={aiChapterTitle}
                    onChange={(e) => setAiChapterTitle(e.target.value)}
                    placeholder="e.g. Information Networks"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specific Topic / Focus Area (Optional)</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. OSI Model Layers, IP Addressing, Network Topologies"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Additional Context / Notes (Optional)</label>
                <textarea
                  value={aiCustomNotes}
                  onChange={(e) => setAiCustomNotes(e.target.value)}
                  rows={3}
                  placeholder="Any specific instructions, textbook edition, key topics to emphasize..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Optional Action Button in AI Modal */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={aiEnableActionButton}
                    onChange={(e) => setAiEnableActionButton(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">Attach Action Button (Optional)</span>
                </label>
                {aiEnableActionButton && (
                  <div className="mt-2 space-y-2 pl-5 border-l-2 border-emerald-100">
                    <input
                      type="text"
                      value={aiActionButtonText}
                      onChange={(e) => setAiActionButtonText(e.target.value)}
                      placeholder="Button Label (e.g. Download Answer Key)"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-emerald-600 focus:outline-none"
                    />
                    <input
                      type="url"
                      value={aiActionButtonUrl}
                      onChange={(e) => setAiActionButtonUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerateNotesWithAI}
                disabled={aiLoading || !aiChapterTitle.trim()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded flex items-center justify-center gap-2 transition-colors"
              >
                {aiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Study Guide...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Notes Content with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
