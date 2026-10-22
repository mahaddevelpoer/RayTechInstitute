'use client';
import {useState}from'react';
import {FileText,ExternalLink}from'lucide-react';
import {documentLinks}from'@/utils/documents';
export function ArticleAttachment({url,label}:{url:string;label:string}){
 const [open,setOpen]=useState(false);const doc=documentLinks(url);
 if(!doc.embed)return null;
 return <section className="my-6 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4" aria-label="Article document"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-semibold"><FileText size={20}/>Attached document</h2><button className="learn-button" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?'Hide preview':'Preview document'}</button></div><p className="my-3 text-sm text-[var(--text-sub)]">{label}. Preview loads through Google on request. If the source blocks preview, open the original document.</p>{open&&<iframe src={doc.embed} title={label} loading="lazy" className="h-[520px] w-full rounded border border-[var(--border)] bg-white" sandbox="allow-scripts allow-same-origin allow-popups"/>}<a className="mt-3 inline-flex min-h-12 items-center gap-2 font-semibold underline" href={doc.href} target="_blank" rel="noopener noreferrer">Open original document<ExternalLink size={15}/></a></section>;
}
