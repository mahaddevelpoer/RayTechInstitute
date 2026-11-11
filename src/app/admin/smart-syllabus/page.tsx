'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { EducationalStore } from '@/data/educationalStore';
import type { BlogPostItem } from '@/types/educational';
import documents from '@/data/smart-syllabus.json';
import { secureDocumentUrl, syllabusIdentity, syllabusPath, syllabusTags } from '@/lib/syllabus-records';
import { siteUrl } from '@/lib/site';

const empty = { id: '', grade: 9, subject: '', year: 2027, title: '', slug: '', excerpt: '', content: '', pdf: '', image: '', source: '' };
export default function SyllabusAdmin() {
  const mutation = useRef(false);
  const [rows, setRows] = useState<BlogPostItem[]>([]);
  const [draft, setDraft] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  async function refresh() {
    await EducationalStore.syncFromSupabase(true);
    setRows(EducationalStore.getBlogs().filter(p => syllabusIdentity(p)));
  }
  useEffect(() => { refresh().catch(() => { setFailed(true); setMessage('Could not load syllabuses. Check your admin session and retry.'); }); }, []);
  function edit(post: BlogPostItem) {
    const identity = syllabusIdentity(post)!;
    setDraft({ id: post.id, ...identity, title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content,
      pdf: post.actionButtonUrl || '', image: post.featuredImage, source: post.seo?.sources?.split('\n')[0] || '' });
    setMessage('');
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); if (mutation.current) return; setFailed(false); setMessage('');
    if (!secureDocumentUrl(draft.pdf) || !secureDocumentUrl(draft.source) || !secureDocumentUrl(draft.image)) { setFailed(true); setMessage('Use full HTTPS links for the PDF, image and official source.'); return; }
    if (!/^[a-z]+(?:-[a-z]+)*$/.test(draft.subject) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) { setFailed(true); setMessage('Use lowercase words separated by hyphens for subject key and article URL.'); return; }
    if (rows.some(p => { const i = syllabusIdentity(p)!; return p.id !== draft.id && (p.slug === draft.slug || (i.grade === draft.grade && i.subject === draft.subject)); })) { setFailed(true); setMessage('This grade and subject already has a resource. Edit that entry instead.'); return; }
    const old = rows.find(p => p.id === draft.id);
    const post: BlogPostItem = { ...old, id: draft.id || `syllabus-${Date.now()}`, title: draft.title.trim(), slug: draft.slug,
      category: 'education', excerpt: draft.excerpt.trim(), content: draft.content.trim(), featuredImage: draft.image,
      author: old?.author || 'RayTech Institute', datePublished: old?.datePublished || new Date().toISOString(),
      readTime: `${Math.max(1, Math.ceil(draft.content.split(/\s+/).length / 200))} min read`,
      tags: syllabusTags(draft.grade, draft.subject, draft.year, old?.tags), actionButtonText: 'Download subject smart syllabus PDF', actionButtonUrl: draft.pdf,
      seo: { ...old?.seo, title: draft.title.trim(), description: draft.excerpt.trim(), socialTitle: draft.title.trim(), socialDescription: draft.excerpt.trim(), imageAlt: draft.title.trim(), enabled: Array.from(new Set([...(old?.seo?.enabled || []), 'sources', 'internalLinks'])), sources: draft.source, internalLinks: `${syllabusPath(draft)}\n/smart-syllabus/` } };
    mutation.current = true; setBusy(true);
    try { await EducationalStore.saveBlog(post); await refresh(); setDraft(empty); setMessage('Saved. The automatic static release will update the article, resource page, subject links and sitemap.'); }
    catch { setFailed(true); setMessage('Save could not be confirmed. Refresh the list before retrying; your text is still here.'); }
    finally { mutation.current = false; setBusy(false); }
  }
  async function remove(post: BlogPostItem) {
    if (mutation.current) return;
    if (!window.confirm(`Delete ${post.title}? Its article and resource will be removed on the next successful static release.`)) return;
    mutation.current = true; setBusy(true); setFailed(false);
    try { await EducationalStore.deleteBlog(post.id); await refresh(); if (draft.id === post.id) setDraft(empty); setMessage('Deleted. Public pages update after the automatic static release succeeds.'); }
    catch { setFailed(true); setMessage('Deletion could not be confirmed. Refresh the list before retrying.'); }
    finally { mutation.current = false; setBusy(false); }
  }
  const field = 'min-h-12 w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900';
  function input(key: keyof typeof draft, label: string, type = 'text') {
    return <label className="grid gap-2 text-sm font-semibold">{label}<input required type={type} className={field} value={draft[key]} onChange={e => setDraft({ ...draft, [key]: type === 'number' ? Number(e.target.value) : e.target.value })} min={type === 'number' ? (key === 'year' ? 2020 : 1) : undefined} max={type === 'number' ? (key === 'year' ? 2099 : 24) : undefined}/></label>;
  }
  return <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
    <div><h1 className="text-2xl font-bold">Smart syllabus</h1><p className="mt-2">One entry publishes a subject PDF resource and its explained article. Readers use static pages, not database requests.</p><Link className="inline-flex min-h-12 items-center underline" href="/smart-syllabus/">Open public directory</Link></div>
    {message && <p role={failed ? 'alert' : 'status'} className={`rounded-md border p-4 ${failed ? 'border-red-300' : 'border-green-400'}`}>{message}</p>}
    <section className="rounded-lg border bg-white p-4"><h2 className="text-lg font-bold">Published resources ({rows.length})</h2><button disabled={busy} className="min-h-12 underline" onClick={() => refresh().catch(() => { setFailed(true); setMessage('Refresh failed. Please sign in again and retry.'); })}>Refresh list</button><ul className="divide-y">{rows.map(post => <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><span>{post.title}</span><div className="flex gap-4"><button disabled={busy} className="min-h-12 underline" onClick={() => edit(post)}>Edit</button><button disabled={busy} className="min-h-12 text-red-700 underline" onClick={() => remove(post)}>Delete</button></div></li>)}</ul></section>
    <form onSubmit={save} className="space-y-4 rounded-lg border bg-white p-4 sm:p-6">
      <h2 className="text-xl font-bold">{draft.id ? 'Edit syllabus' : 'Add a syllabus'}</h2>
      {!draft.id && <label className="grid gap-2 text-sm">Optional: start with a verified 2027 subject PDF<select className={field} defaultValue="" onChange={e => { const d = documents[Number(e.target.value)]; if (!d) return; setDraft({ ...empty, grade: d.grade, subject: d.subject, pdf: siteUrl(d.pdf), image: siteUrl(d.image), source: d.source }); }}><option value="" disabled>Select a document</option>{documents.map((d, i) => <option key={d.pdf} value={i}>Grade {d.grade}: {d.subject}</option>)}</select></label>}
      <div className="grid gap-4 sm:grid-cols-3">{input('grade', 'Grade number', 'number')}{input('subject', 'Subject key, e.g. computer-science')}{input('year', 'Annual examination year', 'number')}</div>
      {input('title', 'Article title')}{input('slug', 'Article URL key')}{input('excerpt', 'Short description')}{input('pdf', 'Subject PDF: full HTTPS URL', 'url')}{input('source', 'Official source: full HTTPS URL', 'url')}{input('image', 'Article image: full HTTPS URL', 'url')}
      <label className="grid gap-2 font-semibold">Article and syllabus details (Markdown)<textarea required rows={18} className={field} value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })}/></label>
      <p className="text-sm">Include the notification image in Markdown: ![Official notification](https://...). Use only verified material for the stated examination year. A new PDF may be hosted on an HTTPS document provider; local file uploads are not supported here.</p>
      <div className="flex gap-4"><button disabled={busy} className="min-h-12 rounded-md bg-blue-800 px-5 font-semibold text-white" type="submit">{busy ? 'Saving...' : 'Save and publish'}</button><button disabled={busy} className="min-h-12 px-4 underline" type="button" onClick={() => { setDraft(empty); setMessage(''); }}>Clear form</button></div>
    </form>
  </div>;
}
