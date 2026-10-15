'use client';

import React, { useState } from 'react';
import { Download, ExternalLink, Eye, FileText, X } from 'lucide-react';
import { sanitizeUrl } from '@/utils/security';

interface PdfResourceActionsProps {
  pdfUrl?: string;
  title: string;
  downloadLabel?: string;
  previewLabel?: string;
  className?: string;
}

function previewUrl(url: string) {
  const driveId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
  return driveId ? `https://drive.google.com/file/d/${driveId}/preview` : sanitizeUrl(url);
}

export function PdfResourceActions({
  pdfUrl,
  title,
  downloadLabel = 'Download PDF',
  previewLabel = 'Preview PDF',
  className = '',
}: PdfResourceActionsProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const safeUrl = pdfUrl && !pdfUrl.includes('example.com') ? sanitizeUrl(pdfUrl) : '';

  if (!safeUrl) {
    return (
      <span className={`inline-flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 ${className}`}>
        PDF under preparation
      </span>
    );
  }

  return (
    <>
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="btn-outline inline-flex items-center gap-1.5 text-xs"
        >
          <Eye className="h-3.5 w-3.5" />
          {previewLabel}
        </button>
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-1.5 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          {downloadLabel}
        </a>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`${title} PDF preview`}>
          <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-navy-700 px-4 py-3 text-white sm:px-5">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate text-sm font-semibold">{title}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1 text-xs underline sm:flex">
                  Open in new tab <ExternalLink className="h-3 w-3" />
                </a>
                <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-md p-1.5 hover:bg-white/15" aria-label="Close PDF preview">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <iframe
              src={previewUrl(safeUrl)}
              title={`${title} PDF preview`}
              className="min-h-0 w-full flex-1 border-0 bg-slate-100"
              allow="autoplay"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      )}
    </>
  );
}
