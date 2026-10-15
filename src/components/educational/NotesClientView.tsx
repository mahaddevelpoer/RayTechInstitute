'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EducationalStore, INITIAL_SUBJECTS, INITIAL_CLASSES } from '@/data/educationalStore';
import { NoteItem } from '@/types/educational';
import { FileText, Download, Eye, ArrowLeft, X, ExternalLink, Calendar, HardDrive, BookOpen, Link2 } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { sanitizeUrl } from '@/utils/security';

interface NotesClientViewProps {
  classSlug: string;
  subjectSlug: string;
}

/**
 * Converts a standard Google Drive share link to an embeddable preview URL.
 * Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * Output: https://drive.google.com/file/d/FILE_ID/preview
 */
function convertGoogleDriveToPreview(url: string): string {
  if (!url) return '';
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }
  return sanitizeUrl(url);
}


export const NotesClientView: React.FC<NotesClientViewProps> = ({ classSlug, subjectSlug }) => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activePdfPreview, setActivePdfPreview] = useState<string | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug
  );

  useEffect(() => {
    setNotes(EducationalStore.getNotes(classSlug, subjectSlug));
  }, [classSlug, subjectSlug]);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/classes">Classes</Link>
          <span>/</span>
          <Link href={`/classes/${classSlug}`}>{currentClass?.title || classSlug}</Link>
          <span>/</span>
          <Link href={`/classes/${classSlug}/${subjectSlug}`}>{currentSubject?.title || subjectSlug}</Link>
          <span>/</span>
          <span className="text-slate-700">Notes (PDF)</span>
        </nav>

        {/* Back Link */}
        <div className="mb-4">
          <Link
            href={`/classes/${classSlug}/${subjectSlug}`}
            className="inline-flex items-center gap-1.5 text-xs text-navy-600 hover:text-navy-800 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {currentSubject?.title || 'Subject'} Hub</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="badge-primary">{currentClass?.title}</span>
            <span className="badge-accent">{currentSubject?.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            Solved Chapter Notes &amp; Handouts (PDF)
          </h1>
          <p className="text-slate-600 text-sm">
            Free download chapter-wise solved notes, short questions, and long questions for board exams.
          </p>
        </div>

        {/* Notes List */}
        <div className="space-y-5">
          {notes.map((note) => {
            // Every attached PDF gets an on-page preview. A dedicated Drive preview
            // URL is preferred, while a direct PDF URL is used as the fallback.
            const hasPreview = Boolean(note.previewPdfUrl || note.pdfUrl);
            const hasContent = Boolean(note.content);
            const hasAction = Boolean(note.actionButtonText && note.actionButtonUrl);
            const isExpanded = expandedNoteId === note.id;

            return (
              <div
                key={note.id}
                className="edu-card border border-slate-200 rounded-lg overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="badge-primary">
                        Chapter {note.chapterNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {note.chapterTitle}
                      </span>
                    </div>

                    <Link href={`/classes/${classSlug}/${subjectSlug}/notes/${note.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="block text-base font-bold text-navy-900 hover:text-navy-700">{note.title}</Link>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {note.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>Size: {note.fileSize || '3.2 MB'}</span>
                      <span>&bull;</span>
                      <span>Updated: {note.lastUpdated}</span>
                      <span>&bull;</span>
                      <span>{note.downloadCount} Downloads</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
                    {/* On-Page PDF Preview Button */}
                    {hasPreview && (
                      <button
                        onClick={() => setActivePdfPreview(convertGoogleDriveToPreview(note.previewPdfUrl || note.pdfUrl))}
                        className="btn-outline text-xs py-2 px-3 flex-1 sm:flex-initial"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview PDF</span>
                      </button>
                    )}

                    {/* Expand Study Guide Button */}
                    {hasContent && (
                      <button
                        onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                        className="btn-outline text-xs py-2 px-3 flex-1 sm:flex-initial"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Hide Guide' : 'Study Guide'}</span>
                      </button>
                    )}

                    {/* Custom Action Button */}
                    {hasAction && (
                      <a
                        href={sanitizeUrl(note.actionButtonUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline text-xs py-2 px-3 flex-1 sm:flex-initial text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>{note.actionButtonText}</span>
                      </a>
                    )}

                    {/* Download Button or Unavailable Badge */}
                    {note.pdfUrl && !note.pdfUrl.includes('example.com') ? (
                      <a
                        href={sanitizeUrl(note.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs py-2 px-3 flex-1 sm:flex-initial"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 bg-slate-100 border border-slate-200 py-2 px-3 rounded flex-1 sm:flex-initial text-center font-medium">
                        Document in Curation
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Study Guide Content */}
                {isExpanded && hasContent && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-2">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                        <BookOpen className="w-4 h-4 text-navy-600" />
                        <span className="text-sm font-bold text-navy-900">Chapter Study Guide</span>
                      </div>
                      <MarkdownRenderer content={note.content!} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Full-Screen PDF Preview Modal */}
        {activePdfPreview && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-300 w-full max-w-5xl h-[90vh] rounded-md flex flex-col overflow-hidden shadow-2xl" style={{ aspectRatio: 'auto' }}>
              <div className="px-4 py-3 bg-navy-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-bold">PDF Document Preview</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={activePdfPreview.replace('/preview', '/view')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white underline flex items-center gap-1"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => setActivePdfPreview(null)}
                    className="p-1 hover:bg-navy-700 rounded transition-colors text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full bg-slate-100">
                <iframe
                  src={activePdfPreview}
                  title="PDF Document Preview"
                  className="w-full h-full border-none"
                  allow="autoplay"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
