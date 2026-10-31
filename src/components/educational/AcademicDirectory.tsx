import Link from 'next/link';
import { BookOpen, FileText, HelpCircle, ArrowRight, Layers } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { ClassItem, SubjectItem } from '@/types/educational';
import { serializeJsonLd } from '@/utils/seo';

export function SubjectDirectory({grade,subjects,jsonLd}:{grade:ClassItem;subjects:SubjectItem[];jsonLd:unknown}){
 return <div className="academic-page"><Header/><main id="main-content" className="page-main" tabIndex={-1}>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(jsonLd)}}/>
  <nav className="breadcrumb"><Link href="/classes/">Classes</Link><span>/</span><span>{grade.title}</span></nav>
  <div className="directory-intro"><p className="directory-kicker">{grade.numericGrade>=1&&grade.numericGrade<=12?'Class '+grade.numericGrade:'Study resources'}</p><h1>Choose your subject</h1><p>{grade.description}</p></div>
  <div className="subject-directory">{subjects.map(s=><section className="subject-directory-item" key={s.id}><div className="directory-icon"><BookOpen size={25}/></div><div><h2><Link href={`/classes/${grade.slug}/${s.slug}/`}>{s.title}</Link></h2><p>{s.description}</p><div className="resource-quick-links"><Link href={`/classes/${grade.slug}/${s.slug}/notes/`}>Notes</Link><Link href={`/classes/${grade.slug}/${s.slug}/mcqs/`}>Chapter tests</Link><Link href={`/classes/${grade.slug}/${s.slug}/past-papers/`}>Past papers</Link></div></div><Link className="directory-open" href={`/classes/${grade.slug}/${s.slug}/`} aria-label={`Open ${s.title}`}><ArrowRight size={21}/></Link></section>)}</div>
  {!subjects.length&&<div className="directory-empty"><BookOpen/><h2>No subjects published yet</h2><p>Choose another class while its subject resources are prepared.</p><Link className="learn-button" href="/classes/">All classes</Link></div>}
 </main><Footer/></div>;
}
export function SubjectResources({grade,subject,counts,jsonLd}:{grade:ClassItem;subject:SubjectItem;counts:{notes:number;mcqs:number;papers:number};jsonLd:unknown}){
 const base=`/classes/${grade.slug}/${subject.slug}`;
 const resources=[{slug:'notes',title:'Chapter notes',description:'Read the chapter guide, preview the document and keep a PDF for revision.',count:counts.notes,unit:'documents',Icon:FileText},{slug:'mcqs',title:'Chapter practice & tests',description:'Choose a chapter, answer one question at a time and review your score after submission.',count:counts.mcqs,unit:'questions',Icon:HelpCircle},{slug:'past-papers',title:'Board past papers',description:'Find the examination year and board, then open its paper and study guidance.',count:counts.papers,unit:'papers',Icon:Layers}];
 return <div className="academic-page"><Header/><main id="main-content" className="page-main" tabIndex={-1}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(jsonLd)}}/>
  <nav className="breadcrumb"><Link href="/classes/">Classes</Link><span>/</span><Link href={`/classes/${grade.slug}/`}>{grade.title}</Link><span>/</span><span>{subject.title}</span></nav>
  <div className="directory-intro"><p className="directory-kicker">{grade.title}</p><h1>{subject.title}</h1><p>{subject.description}</p></div>
  <section aria-label="Choose a study resource" className="subject-resource-directory">{resources.map(({slug,title,description,count,unit,Icon})=><Link key={slug} className="subject-resource-item" href={`${base}/${slug}/`}><Icon size={29}/><div><h2>{title}</h2><p>{description}</p><span className="directory-count">{count?`${count} ${unit} available`:'Resources are being prepared'}</span></div><ArrowRight size={22}/></Link>)}</section>
  <aside className="directory-guidance"><h2>A useful study routine</h2><p>Read the chapter first, run its examples where available, and check your understanding with a chapter test. Use past papers after you understand the topic.</p></aside>
 </main><Footer/></div>;
}
