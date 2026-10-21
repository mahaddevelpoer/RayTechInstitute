import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LEARNING_COURSES, LEARNING_LANGUAGES, LEARNING_TOPICS } from '@/data/learningCatalog';
import { siteUrl } from '@/lib/site';
import { buildSeoTitle } from '@/utils/seo';

export const metadata: Metadata = { title: buildSeoTitle('Programming Courses and Browser Practice'), description: 'Explore programming courses with clear English lessons, topic-based practice and browser coding exercises. Study each language at your own pace.', alternates: { canonical: siteUrl('/courses/') }, robots: { index: LEARNING_TOPICS.length > 0, follow: true } };
export default function CoursesPage() {
  return <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]"><Header /><main id="main-content" className="page-main"><nav className="breadcrumb"><Link href="/classes/">Classes</Link><span>/</span><span>Courses</span></nav><div className="page-intro"><h1 className="text-3xl font-bold">Learn programming, one topic at a time</h1><p className="mt-4">Read a lesson, test an example, and practice before moving on.</p></div>
    {!LEARNING_COURSES.length && !LEARNING_LANGUAGES.length && <section className="rounded-lg border border-[var(--border)] p-6"><h2 className="text-xl font-semibold">Courses are being prepared</h2><p className="mt-3">Reviewed lessons will appear here after publication.</p><Link className="learn-button mt-5" href="/classes/">Explore class resources</Link></section>}
    {LEARNING_COURSES.map(course => <section key={course.id} className="mb-10 border-t border-[var(--border)] pt-6"><h2 className="text-2xl font-semibold"><Link href={`/courses/${course.slug}/`}>{course.title}</Link></h2><p className="mt-2 max-w-2xl text-[var(--text-sub)]">{course.description}</p><div className="mt-5 flex flex-wrap gap-3">{course.languageIds.map(id => { const language = LEARNING_LANGUAGES.find(l => l.id === id); return language ? <Link key={id} className="learn-button" href={`/learn/${language.slug}/`}>{language.title}</Link> : null; })}</div></section>)}
    {!!LEARNING_LANGUAGES.length && <section><h2 className="mb-5 text-xl font-semibold">Language library</h2><div className="grid gap-4 md:grid-cols-2">{LEARNING_LANGUAGES.map(language => <Link key={language.id} href={`/learn/${language.slug}/`} className="rounded-lg border border-[var(--border)] p-5 hover:bg-[var(--bg-soft)]"><h3 className="text-lg font-semibold">{language.title}</h3><p className="mt-2 text-sm text-[var(--text-sub)]">{language.description}</p><p className="mt-4 text-xs">{LEARNING_TOPICS.filter(t => t.languageId === language.id).length} published topics</p></Link>)}</div></section>}
  </main><Footer /></div>;
}
