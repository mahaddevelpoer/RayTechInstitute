'use client';

import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { sanitizeUrl } from '@/utils/security';

interface PdfDetailClientViewProps {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  content?: string;
  pdfUrl?: string;
  metadata: string[];
}

export function PdfDetailClientView({ backHref, backLabel, eyebrow, title, description, content, pdfUrl, metadata }: PdfDetailClientViewProps) {
  const safePdfUrl = pdfUrl && !pdfUrl.includes('example.com') ? sanitizeUrl(pdfUrl) : '';

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Link href={backHref} className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)] lg:items-start">
        <article>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-orange-700">{eyebrow}</p>
          <h1 className="text-3xl font-bold leading-tight text-navy-950 sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {metadata.map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">{item}</span>)}
          </div>

          <section className="mt-9 border-t border-slate-200 pt-7">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-navy-900"><FileText className="h-5 w-5 text-orange-600" /> About this document</h2>
            {content ? <MarkdownRenderer content={content} /> : <p className="text-sm leading-7 text-slate-600">This official academic document contains board-relevant material for focused preparation. Use the viewer to inspect the paper, then download a copy for offline practice.</p>}
          </section>
        </article>

        <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm font-bold text-navy-900">Document preview</span>
            {safePdfUrl && <a href={safePdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-navy-700 underline">New tab <ExternalLink className="h-3 w-3" /></a>}
          </div>
          {safePdfUrl ? <iframe src={safePdfUrl} title={`${title} preview`} className="h-[520px] w-full border-0 bg-slate-100 sm:h-[650px]" allow="autoplay" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" /> : <div className="flex h-[360px] items-center justify-center px-8 text-center text-sm text-slate-500">The PDF is being prepared by the board team.</div>}
          {safePdfUrl && <div className="border-t border-slate-200 p-4"><a href={safePdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex w-full items-center justify-center gap-2 text-sm"><Download className="h-4 w-4" /> Download PDF</a></div>}
        </aside>
      </div>
    </main>
  );
}
