import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { LanguageCard } from '@/components/learning/LanguageCard';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LEARNING_COURSES, LEARNING_LANGUAGES, LEARNING_TOPICS } from '@/data/learningCatalog';
import { siteUrl } from '@/lib/site';
import { buildSeoTitle } from '@/utils/seo';

export const metadata: Metadata = { title: buildSeoTitle('Programming Courses and Browser Practice'), description: 'Explore programming courses with clear English lessons, topic-based practice and browser coding exercises. Study each language at your own pace.', alternates: { canonical: siteUrl('/courses/') }, robots: { index: LEARNING_TOPICS.length > 0, follow: true } };
export default function CoursesPage() {
 return <div className="academic-page"><Header/><main id="main-content" className="page-main" tabIndex={-1}>
  <nav className="breadcrumb"><Link href="/classes/">Classes</Link><span>/</span><span>Programming courses</span></nav>
  <header className="directory-intro"><h1>Programming, with a clear path</h1><p>Choose a course for a structured route, or open a language and start with its first lesson. Read, practise and check your understanding in the same workspace.</p></header>
  <div className="course-route-grid">{LEARNING_COURSES.map(course=><section className="course-route" key={course.id}><BookOpen size={27}/><h2>{course.title}</h2><p>{course.description}</p><div className="course-track-links">{course.languageIds.map(id=>{const l=LEARNING_LANGUAGES.find(x=>x.id===id);return l?<Link key={id} href={`/learn/${l.slug}/`}>{l.title}</Link>:null;})}</div><Link href={`/courses/${course.slug}/`}>View learning path<ArrowRight size={18}/></Link></section>)}</div>
  <section aria-labelledby="language-library"><h2 id="language-library" className="directory-section-title">Choose a language</h2><div className="language-directory">{LEARNING_LANGUAGES.map(language=><LanguageCard key={language.id} language={language} count={LEARNING_TOPICS.filter(t=>t.languageId===language.id).length}/>)}</div></section>
  {!LEARNING_LANGUAGES.length&&<div className="directory-empty"><h2>Lessons are being prepared</h2><p>Reviewed language tracks appear here after publication.</p><Link className="learn-button" href="/classes/">Explore class resources</Link></div>}
  <aside className="directory-guidance"><h2>Learning is open to everyone</h2><p>No account is needed to read lessons, use the compiler or take topic tests. Sign in when you want saved progress or assignment feedback.</p></aside>
 </main><Footer/></div>;
}
