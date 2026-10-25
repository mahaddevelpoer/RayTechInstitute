'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ClassItem, SubjectItem } from '@/types/educational';

export function StudyTaskLauncher({ classes, subjects }: { classes: ClassItem[]; subjects: SubjectItem[] }) {
  const [chosenClass, setChosenClass] = useState('');
  const [chosenSubject, setChosenSubject] = useState('');
  const active = classes.filter(c => c.isActive).slice().sort((a, b) => a.numericGrade - b.numericGrade);
  const grade = active.find(c => c.slug === chosenClass) || active[0];
  const available = subjects.filter(s => s.classSlug === grade?.slug);
  const subject = available.find(s => s.slug === chosenSubject) || available[0];
  const query = new URLSearchParams({ class: grade?.slug || '', subject: subject?.slug || '' }).toString();
  return <section className="rounded-lg border border-slate-200 bg-white p-5" aria-labelledby="study-task-title">
    <h2 id="study-task-title" className="text-lg font-semibold">Add class study material</h2>
    <p className="my-3 text-sm text-slate-600">Choose a class and subject once, then open the right editor with those selections already filled in.</p>
    {!grade ? <p className="text-sm">Start by <Link className="underline" href="/admin/classes/">adding a class</Link>.</p> : <>
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Class<select aria-label="Study material class" className="study-input mt-2 min-h-12" value={grade.slug} onChange={e => { setChosenClass(e.target.value); setChosenSubject(''); }}>{active.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}</select></label>
      <label className="text-sm font-semibold">Subject<select aria-label="Study material subject" className="study-input mt-2 min-h-12" value={subject?.slug || ''} onChange={e => setChosenSubject(e.target.value)} disabled={!subject}>{!subject && <option value="">Add a subject first</option>}{available.map(s => <option key={s.id} value={s.slug}>{s.title}</option>)}</select></label></div>
      {subject ? <div className="mt-4 flex flex-wrap gap-3">{[['notes', 'Add notes / PDF'], ['mcqs', 'Add MCQs'], ['past-papers', 'Add past paper']].map(([route, label]) => <Link key={route} className="learn-button" href={`/admin/${route}/?${query}`}>{label}<ArrowRight size={16}/></Link>)}</div> : <Link className="learn-button mt-4" href={`/admin/subjects/?${query}`}>Add a subject<ArrowRight size={16}/></Link>}
    </>}
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 pt-3 text-sm"><Link className="inline-flex min-h-12 items-center underline" href="/admin/classes/">Manage classes and chapters</Link><Link className="inline-flex min-h-12 items-center underline" href={`/admin/subjects/?${query}`}>Manage subjects</Link></div>
  </section>;
}
