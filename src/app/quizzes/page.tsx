import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LEARNING_LANGUAGES, LEARNING_TOPICS } from '@/data/learningCatalog';
import { siteUrl } from '@/lib/site';
import { buildSeoTitle } from '@/utils/seo';
export const metadata = { title: buildSeoTitle('Programming Topic Tests and MCQ Practice'), description: 'Choose a programming language and topic to test your knowledge. Review your answers after submission and unlock a practical assignment at 80%.', alternates: { canonical: siteUrl('/quizzes/') }, robots: { index: LEARNING_TOPICS.length > 0, follow: true } };
export default function ProgrammingTestsPage() {
  return <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]"><Header /><main id="main-content" className="page-main">
    <nav className="breadcrumb"><Link href="/courses/">Courses</Link><span>/</span><span>Topic tests</span></nav>
    <div className="page-intro"><h1 className="text-3xl font-bold">Programming topic tests</h1><p className="mt-4">Choose a language, then a topic. Answer one question at a time and review your results after submitting.</p></div>
    {!LEARNING_TOPICS.length && <p>Tests will appear here as reviewed lessons are published.</p>}
    {LEARNING_LANGUAGES.map(language => {
      const topics = LEARNING_TOPICS.filter(topic => topic.languageId === language.id).sort((a, b) => a.order - b.order);
      if (!topics.length) return null;
      return <details key={language.id} className="mb-4 rounded-md border border-[var(--border)] p-5"><summary className="min-h-12 cursor-pointer text-lg font-semibold">{language.title}<span className="ml-3 text-sm font-normal">{topics.length} topics</span></summary><ul className="mt-4 space-y-2">{topics.map(topic => <li key={topic.id}><Link className="learn-button w-full justify-between" href={`/learn/${language.slug}/${topic.slug}/quiz/`}><span>{topic.order}. {topic.title}</span><span className="text-xs">{topic.questionsPerAttempt} questions</span></Link></li>)}</ul></details>;
    })}
    <Link className="learn-button mt-8" href="/classes/">Class study resources</Link>
  </main><Footer /></div>;
}
