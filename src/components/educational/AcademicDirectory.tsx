import Link from 'next/link';
import { BookOpen, FileText, HelpCircle, ArrowRight, Layers } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { ClassItem, SubjectItem, ChapterItem } from '@/types/educational';
import { INITIAL_CLASSES, INITIAL_SUBJECTS, INITIAL_CHAPTERS } from '@/data/staticCatalog';
import { chapterDisplayLabel } from '@/utils/chapter-books';
import { serializeJsonLd } from '@/utils/seo';

export function SubjectDirectory({grade,subjects,jsonLd}:{grade:ClassItem;subjects:SubjectItem[];jsonLd:unknown}){
 return <div className="academic-page"><Header/><main id="main-content" className="page-main" tabIndex={-1}>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(jsonLd)}}/>
  <nav className="breadcrumb"><Link prefetch={false} href="/classes/">Classes</Link><span>/</span><span>{grade.title}</span></nav>
  <div className="directory-intro"><p className="directory-kicker">{grade.programTitle && grade.semesterNumber ? `${grade.programTitle} / Semester ${grade.semesterNumber}` : grade.numericGrade>=1&&grade.numericGrade<=12?'Class '+grade.numericGrade:'Study resources'}</p><h1>Choose your subject</h1><p>{grade.description}</p></div>
  <div className="subject-directory">{subjects.map(s=><section className="subject-directory-item" key={s.id}><div className="directory-icon"><BookOpen size={25}/></div><div><h2><Link prefetch={false} href={`/classes/${grade.slug}/${s.slug}/`}>{s.title}</Link></h2><p>{s.description}</p><div className="resource-quick-links"><Link prefetch={false} href={`/classes/${grade.slug}/${s.slug}/notes/`}>Notes</Link><Link prefetch={false} href={`/classes/${grade.slug}/${s.slug}/mcqs/`}>Chapter tests</Link><Link prefetch={false} href={`/classes/${grade.slug}/${s.slug}/past-papers/`}>Past papers</Link></div></div><Link prefetch={false} className="directory-open" href={`/classes/${grade.slug}/${s.slug}/`} aria-label={`Open ${s.title}`}><ArrowRight size={21}/></Link></section>)}</div>
  {!subjects.length&&<div className="directory-empty"><BookOpen/><h2>No subjects published yet</h2><p>Choose another class while its subject resources are prepared.</p><Link prefetch={false} className="learn-button" href="/classes/">All classes</Link></div>}
 </main><Footer/></div>;
}
export function SubjectResources({grade,subject,counts,jsonLd}:{grade:ClassItem;subject:SubjectItem;counts:{notes:number;mcqs:number;papers:number};jsonLd:unknown}){
 const base=`/classes/${grade.slug}/${subject.slug}`;
 const semesters = grade.programTitle ? INITIAL_CLASSES.filter(c => c.isActive && c.programTitle?.trim().toLowerCase() === grade.programTitle?.trim().toLowerCase()).sort((a,b) => (a.semesterNumber || 0) - (b.semesterNumber || 0)) : [];
 const chapters: ChapterItem[] = INITIAL_CHAPTERS.filter(c => c.classSlug === grade.slug && c.subjectSlug === subject.slug && c.isActive !== false).sort((a,b) => a.chapterNumber - b.chapterNumber);

 const resources=[{slug:'notes',title:'Chapter notes',description:'Read the chapter guide, preview the document and keep a PDF for revision.',count:counts.notes,unit:'documents',Icon:FileText},{slug:'mcqs',title:'Chapter practice & tests',description:'Choose a chapter, answer one question at a time and review your score after submission.',count:counts.mcqs,unit:'questions',Icon:HelpCircle},{slug:'past-papers',title:'Board past papers',description:'Find the examination year and board, then open its paper and study guidance.',count:counts.papers,unit:'papers',Icon:Layers}];
 return <div className="academic-page"><Header/><main id="main-content" className="page-main" tabIndex={-1}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(jsonLd)}}/>
  <nav className="breadcrumb"><Link prefetch={false} href="/classes/">Classes</Link><span>/</span><Link prefetch={false} href={`/classes/${grade.slug}/`}>{grade.title}</Link><span>/</span><span>{subject.title}</span></nav>
  <div className="directory-intro"><p className="directory-kicker">{grade.title}</p><h1>{subject.title}</h1><p>{subject.description}</p></div>
  {!!semesters.length && <nav className="study-semesters" aria-label="Subject semesters">{semesters.map(c => { const sibling = INITIAL_SUBJECTS.find(s => s.classSlug === c.slug && (s.slug === subject.slug || s.title.trim().toLowerCase() === subject.title.trim().toLowerCase())); return sibling ? <Link prefetch={false} key={c.id} aria-current={c.slug === grade.slug ? 'page' : undefined} href={`/classes/${c.slug}/${sibling.slug}/`}>Semester {c.semesterNumber}</Link> : <span key={c.id}>Semester {c.semesterNumber}: subject not published</span>; })}</nav>}
  {!!chapters.length && <section aria-labelledby="subject-chapters"><h2 id="subject-chapters" className="directory-section-title">Choose a chapter</h2><div className="study-family-grid">{chapters.map(c => <section key={c.id} className="study-option-card study-chapter-card"><Link prefetch={false} className="study-chapter-hit" aria-label={`Open ${c.title} notes`} href={`${base}/notes/?chapter=${c.chapterNumber}`} /><BookOpen size={26}/><h3>{chapterDisplayLabel(c)}</h3><p>{c.title}</p>{c.description && <p>{c.description}</p>}<div className="course-track-links"><Link prefetch={false} href={`${base}/notes/?chapter=${c.chapterNumber}`}>Chapter notes</Link><Link prefetch={false} href={`${base}/mcqs/?chapter=${c.chapterNumber}`}>Chapter MCQs</Link></div></section>)}</div></section>}
  <section aria-label="Choose a study resource" className="subject-resource-directory">{resources.map(({slug,title,description,count,unit,Icon})=><Link prefetch={false} key={slug} className="subject-resource-item" href={`${base}/${slug}/`}><Icon size={29}/><div><h2>{title}</h2><p>{description}</p><span className="directory-count">{count?`${count} ${unit} available`:'Resources are being prepared'}</span></div><ArrowRight size={22}/></Link>)}</section>
  <aside className="directory-guidance"><h2>A useful study routine</h2><p>Read the chapter first, run its examples where available, and check your understanding with a chapter test. Use past papers after you understand the topic.</p></aside>
 </main><Footer/></div>;
}
