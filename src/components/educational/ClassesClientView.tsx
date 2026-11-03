"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Code2, BookOpen, ArrowLeft } from 'lucide-react';
import type { ClassItem, SubjectItem } from '@/types/educational';
import { academicGroups, programSubjectChoices } from '@/utils/academic-structure';

interface StudyTrack { id: string; slug: string; title: string; description: string }
export function ClassesClientView({classes, subjects, courses, languages}: {classes: ClassItem[]; subjects: SubjectItem[]; courses: StudyTrack[]; languages: StudyTrack[]}) {
  const [view, setView] = useState('home');
  const { schoolClasses, programs } = academicGroups(classes);
  const program = programs.find(p => view === `program:${p.title}`);
  function open(next: string) { setView(next); document.getElementById('study-directory-title')?.focus(); }
  const title = view === 'home' ? 'What would you like to study?' : view === 'academic' ? 'Choose your academic program or class' : view === 'programming' ? 'Choose your programming course' : program?.title || 'Study resources';
  return <>
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link prefetch={false} href="/">Home</Link><span>/</span><span>Study directory</span></nav>
    {view !== 'home' && <button className="study-back" onClick={() => open(program ? 'academic' : 'home')}><ArrowLeft size={18}/>Back to {program ? 'academic programs' : 'study areas'}</button>}
    <div className="directory-intro"><h1 id="study-directory-title" tabIndex={-1}>{title}</h1><p>Choose a study area, open its subjects and work through the learning resources at your own pace.</p></div>
    {view === 'home' && <div className="study-family-grid">
      <section className="study-family-card"><div className="study-family-icon"><GraduationCap size={30}/></div><h2>Academic Programs</h2><p>Class and semester-based subjects, notes, chapter tests and past papers.</p><div className="study-child-list">{programs.map(p => <button key={p.title} onClick={() => open(`program:${p.title}`)}>{p.title}<ArrowRight size={18}/></button>)}{schoolClasses.map(c => <Link prefetch={false} key={c.id} href={`/classes/${c.slug}/`}>{c.title}<ArrowRight size={18}/></Link>)}</div><span className="study-card-prompt" aria-hidden="true">Explore academic programs<ArrowRight size={18}/></span><button type="button" className="study-card-hit" aria-label="Explore academic programs" onClick={() => open('academic')} /></section>
      <section className="study-family-card"><div className="study-family-icon"><Code2 size={30}/></div><h2>Programming Courses</h2><p>Learn a language through guided lessons, code practice and topic tests.</p><div className="study-child-list">{courses.map(c => <Link prefetch={false} key={c.id} href={`/courses/${c.slug}/`}>{c.title}<ArrowRight size={18}/></Link>)}</div><span className="study-card-prompt" aria-hidden="true">Explore programming courses<ArrowRight size={18}/></span><button type="button" className="study-card-hit" aria-label="Explore programming courses" onClick={() => open('programming')} /></section>
    </div>}
    {view === 'academic' && <div className="study-family-grid">{programs.map(p => <button className="study-option-card" key={p.title} onClick={() => open(`program:${p.title}`)}><GraduationCap size={28}/><h2>{p.title}</h2><p>{p.semesters.length} published semester{p.semesters.length === 1 ? '' : 's'}. Choose a subject to explore its resources.</p><span>View subjects<ArrowRight size={18}/></span></button>)}{schoolClasses.map(c => <Link prefetch={false} className="study-option-card" key={c.id} href={`/classes/${c.slug}/`}><GraduationCap size={28}/><h2>{c.title}</h2><p>{c.description}</p><span>View subjects<ArrowRight size={18}/></span></Link>)}</div>}
    {view === 'programming' && <><div className="study-family-grid">{courses.map(c => <Link prefetch={false} key={c.id} className="study-option-card" href={`/courses/${c.slug}/`}><Code2 size={28}/><h2>{c.title}</h2><p>{c.description}</p><span>Open course<ArrowRight size={18}/></span></Link>)}</div><h2 className="directory-section-title">Individual language tracks</h2><div className="study-family-grid">{languages.map(l => <Link prefetch={false} key={l.id} className="study-option-card" href={`/learn/${l.slug}/`}><Code2 size={25}/><h3>{l.title}</h3><p>{l.description}</p><span>Open language<ArrowRight size={18}/></span></Link>)}</div></>}
    {program && <div className="study-family-grid">{programSubjectChoices(program.semesters, subjects).map(s => <Link prefetch={false} className="study-option-card" key={s.slug} href={`/classes/${s.classSlug}/${s.slug}/`}><BookOpen size={28}/><h2>{s.title}</h2><p>{s.description}</p><span>Open subject<ArrowRight size={18}/></span></Link>)}{!subjects.some(s => program.semesters.some(c => c.slug === s.classSlug)) && <p>Subjects will appear here when published.</p>}</div>}
  </>;
}
