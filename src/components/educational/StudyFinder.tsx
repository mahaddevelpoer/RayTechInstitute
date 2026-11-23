'use client';
import {useEffect, useId, useState} from 'react';
import Link from 'next/link';
import {ArrowRight, BookOpen, Search} from 'lucide-react';
import navigation from '@/data/studyNavigation.json';
import {hasStudyResources, matchesStudySearch, matchingStudyChapters, type StudyResource} from '@/utils/study-directory';

export function StudyQuickFind() {
  return <form action="/classes/" method="get" role="search" className="study-quick-find" aria-label="Find your study resources">
    <label htmlFor="home-study-search">What are you studying?</label>
    <div><input id="home-study-search" type="search" name="q" maxLength={180} placeholder="Class, subject or topic, e.g. DIT ICT"/><button type="submit"><Search size={18}/>Find resources</button></div>
    <nav aria-label="Choose your study level"><Link href="/classes/?class=11th-class#find-resources">11th class</Link><Link href="/classes/?class=dit-intermediate#find-resources">DIT</Link><Link href="/courses/">Programming</Link><Link href="/classes/#find-resources">All classes</Link></nav>
  </form>;
}

export function StudyFinder({classSlug = ''}: {classSlug?: string}) {
  const id = useId();
  const [query,setQuery] = useState(''), [grade,setGrade] = useState(classSlug), [resource,setResource] = useState<StudyResource>('all');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery((params.get('q') || '').slice(0,180));
    const selected = params.get('class');
    setGrade(classSlug || (navigation.classes.some(c=>c.slug===selected) ? selected! : ''));
    const kind = params.get('resource');
    setResource(kind === 'notes' || kind === 'mcqs' || kind === 'papers' ? kind : 'all');
  },[classSlug]);
  const matches = navigation.directory.filter(s=>(!grade || s.classSlug === grade) && hasStudyResources(s,resource) && matchesStudySearch(s,query));
  const groups = navigation.classes.filter(c=>(!grade || c.slug===grade) && matches.some(s=>s.classSlug===c.slug));
  const reset = () => {setQuery('');setGrade(classSlug);setResource('all');};
  return <section id="find-resources" className="study-finder" aria-labelledby={id+'-title'}>
    <header><h2 id={id+'-title'}>Find your class, subject or topic</h2><p>Search published study material, then go straight to the notes or practice you need.</p></header>
    <form action="/classes/" method="get" role="search" className="study-finder-form" onSubmit={e=>e.preventDefault()}>
      <div className="study-finder-query"><label htmlFor={id+'-query'}>Subject or topic</label><input id={id+'-query'} type="search" name="q" maxLength={180} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try ICT, networking, algebra or a chapter title"/></div>
      <div><label htmlFor={id+'-class'}>Class or program</label><select id={id+'-class'} name="class" value={grade} onChange={e=>setGrade(e.target.value)} disabled={!!classSlug}><option value="">All classes</option>{navigation.classes.filter(c=>navigation.directory.some(s=>s.classSlug===c.slug)).map(c=><option key={c.slug} value={c.slug}>{c.title}</option>)}</select></div>
      <div><label htmlFor={id+'-resource'}>Resource type</label><select id={id+'-resource'} name="resource" value={resource} onChange={e=>setResource(e.target.value as StudyResource)}><option value="all">All resources</option><option value="notes">Notes & PDFs</option><option value="mcqs">MCQ practice</option><option value="papers">Past papers</option></select></div>
      <button type="button" className="study-finder-reset" onClick={reset}>Clear filters</button>
    </form>
    <p className="study-finder-status" role="status">{matches.length} {matches.length===1?'subject':'subjects'} with available {resource==='all'?'study resources':resource==='mcqs'?'MCQ practice':resource==='notes'?'notes':'past papers'}{query ? ` matching “${query}”` : ''}.</p>
    {!matches.length && <div className="study-finder-empty"><BookOpen size={25}/><h3>No published resources match these filters</h3><p>Try a broader topic or clear the resource filter. Subjects still being prepared are not shown as available.</p><button type="button" onClick={reset}>Show available subjects</button><Link href="/courses/">Browse programming courses<ArrowRight size={16}/></Link></div>}
    {groups.map(c=><section className="study-result-group" key={c.slug} aria-labelledby={id+'-'+c.slug}><h3 id={id+'-'+c.slug}><Link prefetch={false} href={`/classes/${c.slug}/`}>{c.title}<ArrowRight size={18}/></Link></h3>
      {matches.filter(s=>s.classSlug===c.slug).map(s=><article className="study-result" key={s.id}>
        <div className="study-result-heading"><div><h4><Link prefetch={false} href={`/classes/${s.classSlug}/${s.slug}/`}>{s.title}</Link></h4><p>{s.chapters.length} {s.chapters.length===1?'chapter':'chapters'} with published material</p></div><Link prefetch={false} className="study-result-open" href={`/classes/${s.classSlug}/${s.slug}/`}>Open subject<ArrowRight size={17}/></Link></div>
        <div className="resource-quick-links">{s.notes>0 && <Link prefetch={false} href={`/classes/${s.classSlug}/${s.slug}/notes/`}>{s.notes} notes & PDFs</Link>}{s.mcqs>0 && <Link prefetch={false} href={`/classes/${s.classSlug}/${s.slug}/mcqs/`}>{s.mcqs} MCQs</Link>}{s.papers>0 && <Link prefetch={false} href={`/classes/${s.classSlug}/${s.slug}/past-papers/`}>{s.papers} past papers</Link>}</div>
        {!!s.chapters.length && <details className="study-result-chapters" open={query.trim() ? true : undefined}><summary>Chapters and topics</summary><ol>{matchingStudyChapters(s,query).map(ch=><li key={ch.number}><strong>{ch.label}</strong>{!!ch.topics.length && <p>{ch.topics.join(' · ')}</p>}<div>{ch.notes>0 && <Link prefetch={false} href={`/classes/${s.classSlug}/${s.slug}/notes/?chapter=${ch.number}`}>Read chapter notes</Link>}{ch.mcqs>0 && <Link prefetch={false} href={`/classes/${s.classSlug}/${s.slug}/mcqs/?chapter=${ch.number}`}>Practise {ch.mcqs} MCQs</Link>}</div></li>)}</ol></details>}
      </article>)}
    </section>)}
  </section>;
}
