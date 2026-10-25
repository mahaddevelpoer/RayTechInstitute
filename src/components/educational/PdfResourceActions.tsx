"use client";

import { ExternalLink, FileText } from "lucide-react";
import { documentLinks } from "@/utils/documents";

interface PdfResourceActionsProps {
  pdfUrl?: string;
  title: string;
  detailHref?: string;
  downloadLabel?: string;
  previewLabel?: string;
  className?: string;
}

export function PdfResourceActions({
  pdfUrl,
  title,
  detailHref,
  downloadLabel = "Open PDF",
  className = "",
}: PdfResourceActionsProps) {
  const { href, isPdf } = documentLinks(pdfUrl);
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {detailHref && (
        <a
          href={detailHref}
          className="btn-outline text-xs"
          aria-label={`Read details: ${title}`}
        >
          <FileText className="h-4 w-4" /> Read &amp; preview
        </a>
      )}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs"
        >
          {isPdf ? downloadLabel : "Open source website"}
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : (
        <span className="text-sm text-slate-500">PDF not yet available</span>
      )}
    </div>
  );
}
