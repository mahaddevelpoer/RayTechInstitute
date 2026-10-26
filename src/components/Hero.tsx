"use client";
import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, Award, Code2 } from 'lucide-react';
import { channelData } from '@/data/channel';
import directory from '@/data/learningDirectory.json';
import { sanitizeUrl } from '@/utils/security';

export function Hero() {
  const tracks = [...directory].filter(track => track.first).sort((a,b) => Number(b.slug==='python')-Number(a.slug==='python'));
  const [selected,setSelected] = useState(tracks[0]?.id || '');
  const tabs = useRef<HTMLDivElement>(null); const id = useId();
  const track = tracks.find(item => item.id===selected) || tracks[0];
  const first = track?.first;
  return <section className="home-hero">
    <div className="home-hero-grid">
      <div className="home-hero-copy">
        <p className="home-hero-kicker">Class resources and programming</p>
        <h1>Learn the concept.<br /><span>Then write the code.</span></h1>
        <p className="home-hero-description">Study class notes, follow programming lessons and test each idea in your browser.</p>
        <div className="home-hero-actions"><Link href="/courses/" className="btn-primary">Explore courses<ArrowRight size={17}/></Link><Link href="/classes/" className="btn-outline"><BookOpen size={17}/>Class resources</Link></div>
        <div className="home-channel"><img src={channelData.profileImage} alt="RayTech Institute" width={44} height={44}/><div><strong>{channelData.name}</strong><p>Learn. Understand. Apply.</p></div><a href={sanitizeUrl(channelData.youtubeUrl)} target="_blank" rel="noopener noreferrer">Watch lessons<ArrowRight size={14}/></a></div>
      </div>
      {first && <div className="home-course-preview">
        <div className="home-course-cover"><img src={channelData.coverImage} alt="RayTech Institute educational channel" width={1280} height={212} loading="eager" decoding="async" fetchPriority="high"/></div>
        <div ref={tabs} className="home-course-tabs" role="tablist" aria-label="Explore a programming language">{tracks.map((item,index)=><button key={item.id} id={id+'-'+item.id} type="button" role="tab" aria-selected={item.id===track.id} aria-controls={id+'-panel'} tabIndex={item.id===track.id?0:-1} onClick={()=>setSelected(item.id)} onKeyDown={event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tracks.length;else if(event.key==='ArrowLeft')next=(index+tracks.length-1)%tracks.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tracks.length-1;else return;event.preventDefault();setSelected(tracks[next].id);tabs.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();}} aria-label={item.title}>{item.slug==='javascript'?'JavaScript':item.title}</button>)}</div>
        <div role="tabpanel" id={id+'-panel'} aria-labelledby={id+'-'+track.id} className="home-course-panel" key={track.id}>
          <div className="home-course-meta"><span><Code2 size={15}/>{track.title}</span><span>{track.count} published {track.count===1?'lesson':'lessons'}</span></div>
          <h2>{first.title}</h2><p>{first.summary}</p>
          <pre aria-label={track.title+' lesson starter code'}><code>{first.code || 'Open the lesson to begin your first exercise.'}</code></pre>
          <Link href={'/learn/'+track.slug+'/'+first.slug+'/'} className="home-course-open">Open this lesson<ArrowRight size={17}/></Link>
        </div>
      </div>}
    </div>
    <nav className="home-shortcuts" aria-label="Quick study resources">
      <Link href="/classes/"><FileText size={19}/><span>Chapter notes<small>Choose a class and subject</small></span><ArrowRight size={17}/></Link>
      <Link href="/classes/"><BookOpen size={19}/><span>Test your understanding<small>Chapter-wise MCQs</small></span><ArrowRight size={17}/></Link>
      <Link href="/classes/"><FileText size={19}/><span>Past papers<small>Prepare with previous exams</small></span><ArrowRight size={17}/></Link>
      <Link href="/results-gazettes/"><Award size={19}/><span>Results and gazettes<small>Board-wise guidance</small></span><ArrowRight size={17}/></Link>
    </nav>
  </section>;
}
