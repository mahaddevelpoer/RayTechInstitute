'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { Pause, Play } from 'lucide-react';
import { INITIAL_CLASSES, INITIAL_SUBJECTS, INITIAL_GAZETTES } from '@/data/staticCatalog';
import { buildStudyLinks, type StudyLink } from '@/utils/study-links';

const catalogLinks = buildStudyLinks(INITIAL_CLASSES, INITIAL_SUBJECTS, INITIAL_GAZETTES);
export function StudyResourceStrip({ links = catalogLinks }: { links?: StudyLink[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [geometry, setGeometry] = useState({ width: 0, copies: 2 });
  useEffect(() => {
    const measure = () => {
      const width = group.current?.getBoundingClientRect().width || 0;
      const available = viewport.current?.clientWidth || 0;
      if (width) setGeometry(previous => {
        const copies = Math.max(2, Math.ceil(available / width) + 1);
        return previous.width === width && previous.copies === copies ? previous : { width, copies };
      });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    if (viewport.current) observer.observe(viewport.current);
    if (group.current) observer.observe(group.current);
    return () => observer.disconnect();
  }, [links]);
  if (!links.length) return null;
  const style = { '--study-distance': `${geometry.width}px`, '--study-duration': `${Math.max(30, geometry.width / 34)}s` } as CSSProperties;
  return <nav className="study-resource-strip" aria-label="Class study shortcuts" data-paused={paused} data-manual={manual} data-ready={geometry.width > 0} style={style}>
    <span className="study-strip-label">Study links</span>
    <div className="study-strip-viewport" ref={viewport} onPointerDown={event => { if (event.pointerType === 'touch') setPaused(true); }} onFocusCapture={event => {
      if (event.target.matches(':focus-visible')) { const target = event.target; setManual(true); setPaused(true); requestAnimationFrame(() => target.scrollIntoView({ inline: 'nearest', block: 'nearest' })); }
    }}>
      <div className="study-strip-track">{Array.from({ length: geometry.copies }, (_, copy) => <div key={copy} ref={copy === 0 ? group : undefined} className="study-strip-group" aria-hidden={copy ? true : undefined}>
        {links.map(link => <Link key={link.id} href={link.href} prefetch={false} tabIndex={copy ? -1 : 0}>{link.label}</Link>)}
      </div>)}</div>
    </div>
    <button type="button" className="study-strip-control" aria-label={paused || manual ? 'Resume study links scrolling' : 'Pause study links scrolling'} aria-pressed={paused || manual} onClick={() => {
      if (paused || manual) { setPaused(false); setManual(false); if (viewport.current) viewport.current.scrollLeft = 0; }
      else setPaused(true);
    }}>{paused || manual ? <Play size={16}/> : <Pause size={16}/>}</button>
  </nav>;
}
