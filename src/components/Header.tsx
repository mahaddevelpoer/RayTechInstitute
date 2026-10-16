'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { channelData } from '@/data/channel';
import { INITIAL_CLASSES, INITIAL_SUBJECTS } from '@/data/staticCatalog';
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutGrid,
  Lock,
  Menu,
  Newspaper,
  PlayCircle,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { sanitizeUrl } from '@/utils/security';

type MenuKey = 'classes' | 'notes' | 'mcqs' | 'results' | 'blogs';

const categoryItems: Array<{ key: MenuKey; label: string; description: string; icon: React.ElementType }> = [
  { key: 'classes', label: 'Classes', description: 'Browse grades and subjects', icon: GraduationCap },
  { key: 'notes', label: 'Notes', description: 'Chapter guides and handouts', icon: BookOpen },
  { key: 'mcqs', label: 'MCQs', description: 'Practice chapter-wise tests', icon: Sparkles },
  { key: 'results', label: 'Results & Gazettes', description: 'Board results and notices', icon: Trophy },
  { key: 'blogs', label: 'Blogs & Updates', description: 'Academic news and guidance', icon: Newspaper },
];

const classTitle = (title: string) => title.replace(/\s*\(.+\)$/, '');

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<MenuKey | null>(null);
  const [mobileCategory, setMobileCategory] = useState<MenuKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subjectsByClass = useMemo(() => {
    return INITIAL_CLASSES.reduce<Record<string, typeof INITIAL_SUBJECTS>>((groups, classItem) => {
      groups[classItem.slug] = INITIAL_SUBJECTS.filter((subject) => subject.classSlug === classItem.slug);
      return groups;
    }, {});
  }, []);

  const closeMenus = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenCategory(null);
    setMobileMenuOpen(false);
    setMobileCategory(null);
  };

  const keepMenuOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const scheduleMenuClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenCategory(null), 450);
  };

  const contentLink = (key: 'notes' | 'mcqs', classSlug: string, subjectSlug: string) =>
    `/classes/${classSlug}/${subjectSlug}/${key}/`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-nav backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" onClick={closeMenus} className="group flex min-w-0 items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-navy-100 bg-navy-50 shadow-sm">
              <img src={channelData.profileImage} alt="RayTech Institute logo" width={40} height={40} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute inset-0 ring-1 ring-inset ring-navy-900/10" aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-[1.05rem] font-bold tracking-tight text-navy-700">{channelData.name}</span>
              <span className="truncate text-[10px] tracking-wide text-slate-500">Computer Science | 11th &amp; 12th Class</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main Navigation" onMouseLeave={scheduleMenuClose} onMouseEnter={keepMenuOpen}>
            <Link href="/" className="nav-link" onFocus={() => setOpenCategory(null)}>Home</Link>
            {categoryItems.map((item) => {
              const Icon = item.icon;
              const isOpen = openCategory === item.key;
              return (
                <div key={item.key} className="relative" onMouseEnter={() => { keepMenuOpen(); setOpenCategory(item.key); }}>
                  <button type="button" className={`nav-link inline-flex items-center gap-1.5 ${isOpen ? 'nav-link-active' : ''}`} aria-expanded={isOpen} aria-haspopup="true" onClick={() => setOpenCategory(isOpen ? null : item.key)} onFocus={() => setOpenCategory(item.key)}>
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>

                  {isOpen && (
                    <div className="nav-mega-menu fixed top-[4.5rem] z-50 pt-2 origin-top rounded-xl border border-transparent bg-transparent">
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xl shadow-navy-900/10">
                      <div className="mb-3 flex items-center justify-between border-b border-slate-100 px-2 pb-3">
                        <div><p className="text-sm font-bold text-navy-900">{item.label}</p><p className="text-[11px] text-slate-500">{item.description}</p></div>
                        {item.key === 'classes' && <LayoutGrid className="h-4 w-4 text-navy-500" aria-hidden="true" />}
                      </div>
                      {item.key === 'classes' ? (
                        <div className="grid grid-cols-2 gap-2">
                          {INITIAL_CLASSES.map((classItem) => (
                            <div key={classItem.slug} className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5">
                              <Link href={`/classes/${classItem.slug}/`} onClick={closeMenus} className="mb-1 block text-xs font-bold text-navy-800 hover:text-navy-600">{classTitle(classItem.title)} <ArrowUpRight className="ml-0.5 inline h-3 w-3" aria-hidden="true" /></Link>
                              <div className="space-y-0.5">{(subjectsByClass[classItem.slug] || []).map((subject) => <Link key={subject.id} href={`/classes/${classItem.slug}/${subject.slug}/`} onClick={closeMenus} className="block rounded px-1.5 py-1 text-[11px] text-slate-600 transition-colors hover:bg-white hover:text-navy-700">{subject.title}</Link>)}</div>
                            </div>
                          ))}
                        </div>
                      ) : item.key === 'results' ? (
                        <Link href="/results-gazettes/" onClick={closeMenus} className="menu-feature-link"><Trophy className="h-5 w-5 text-orange-600" aria-hidden="true" /><span><strong>Board results and gazettes</strong><small>Find result notices, official portals, and verification links.</small></span><ArrowUpRight className="ml-auto h-4 w-4" aria-hidden="true" /></Link>
                      ) : item.key === 'blogs' ? (
                        <Link href="/blogs/" onClick={closeMenus} className="menu-feature-link"><Newspaper className="h-5 w-5 text-navy-600" aria-hidden="true" /><span><strong>Academic news and guidance</strong><small>Date sheets, admissions alerts, and career guides.</small></span><ArrowUpRight className="ml-auto h-4 w-4" aria-hidden="true" /></Link>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">{INITIAL_CLASSES.flatMap((classItem) => (subjectsByClass[classItem.slug] || []).map((subject) => <Link key={`${item.key}-${classItem.slug}-${subject.slug}`} href={contentLink(item.key as 'notes' | 'mcqs', classItem.slug, subject.slug)} onClick={closeMenus} className="menu-resource-link"><span className="font-semibold text-slate-700">{classTitle(classItem.title)}</span><span className="text-[11px] text-slate-500">{subject.title}</span><ArrowUpRight className="ml-auto h-3.5 w-3.5 text-slate-400" aria-hidden="true" /></Link>))}</div>
                      )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a href={sanitizeUrl(channelData.youtubeUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"><PlayCircle className="h-3.5 w-3.5" aria-hidden="true" /> YouTube</a>
            <Link href="/admin/login/" className="flex min-h-12 min-w-12 items-center justify-center rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy-600" title="Admin Login" aria-label="Admin Login"><Lock className="h-4 w-4" aria-hidden="true" /></Link>
          </div>

          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex min-h-12 min-w-12 items-center justify-center rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-navy-700 lg:hidden" aria-label="Toggle menu" aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="nav-mobile-panel border-t border-slate-200 bg-white px-4 py-3 shadow-lg lg:hidden">
          <Link href="/" onClick={closeMenus} className="mobile-nav-link">Home</Link>
          {categoryItems.map((item) => {
            const Icon = item.icon;
            const isOpen = mobileCategory === item.key;
            return (
              <div key={item.key} className="border-b border-slate-100 last:border-0">
                <button type="button" onClick={() => setMobileCategory(isOpen ? null : item.key)} className="flex min-h-12 w-full items-center gap-2 py-3 text-left text-sm font-semibold text-slate-700"><Icon className="h-4 w-4 text-navy-600" aria-hidden="true" /> {item.label}<ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" /></button>
                {isOpen && <div className="grid grid-cols-2 gap-1 pb-3 pl-6">
                  {item.key === 'results' && <Link href="/results-gazettes/" onClick={closeMenus} className="mobile-sub-link col-span-2">All results and gazettes</Link>}
                  {item.key === 'blogs' && <Link href="/blogs/" onClick={closeMenus} className="mobile-sub-link col-span-2">All blogs and updates</Link>}
                  {item.key === 'classes' && INITIAL_CLASSES.map((classItem) => <Link key={classItem.slug} href={`/classes/${classItem.slug}/`} onClick={closeMenus} className="mobile-sub-link">{classTitle(classItem.title)}</Link>)}
                  {(item.key === 'notes' || item.key === 'mcqs') && INITIAL_CLASSES.flatMap((classItem) => (subjectsByClass[classItem.slug] || []).map((subject) => <Link key={`${item.key}-${classItem.slug}-${subject.slug}`} href={contentLink(item.key as 'notes' | 'mcqs', classItem.slug, subject.slug)} onClick={closeMenus} className="mobile-sub-link">{classTitle(classItem.title)} · {subject.title}</Link>))}
                </div>}
              </div>
            );
          })}
          <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-3"><a href={sanitizeUrl(channelData.youtubeUrl)} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white"><PlayCircle className="h-3.5 w-3.5" aria-hidden="true" /> YouTube Channel</a><Link href="/admin/login/" onClick={closeMenus} className="flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"><Lock className="h-3.5 w-3.5" aria-hidden="true" /> Admin</Link></div>
        </div>
      )}
    </header>
  );
};
