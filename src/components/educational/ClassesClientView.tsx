import Link from 'next/link';
import {ArrowRight,GraduationCap,Code2}from'lucide-react';
import {INITIAL_CLASSES,INITIAL_SUBJECTS}from'@/data/staticCatalog';
export function ClassesClientView(){return <>
 <nav className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Classes</span></nav>
 <div className="directory-intro"><h1>Find your class. Choose your subject.</h1><p>Chapter notes, practice tests and past papers for students across classes. Open a class to find its subjects and available study resources.</p></div>
 <div className="course-route-grid">{INITIAL_CLASSES.filter(c=>c.isActive).map(c=><section className="course-route" key={c.id}><GraduationCap size={28}/><h2>{c.title}</h2><p>{c.description}</p><div className="course-track-links">{INITIAL_SUBJECTS.filter(s=>s.classSlug===c.slug).map(s=><Link href={`/classes/${c.slug}/${s.slug}/`} key={s.id}>{s.title}</Link>)}</div><Link href={`/classes/${c.slug}/`}>Choose a subject<ArrowRight size={18}/></Link></section>)}</div>
 <aside className="directory-guidance"><h2 className="flex items-center gap-2"><Code2 size={22}/>Looking for programming?</h2><p>Programming courses have their own language tracks, in-browser compiler and guided topic activities.</p><Link className="learn-button mt-4" href="/courses/">Explore programming courses<ArrowRight size={18}/></Link></aside>
 </>;}
