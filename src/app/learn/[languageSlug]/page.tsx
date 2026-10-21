import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LEARNING_LANGUAGES, LEARNING_TOPICS } from '@/data/learningCatalog';
import { siteUrl } from '@/lib/site';
import { buildSeoTitle } from '@/utils/seo';
import { staticExportParams } from '@/utils/staticExport';

export const dynamicParams = false;
export function generateStaticParams() { return staticExportParams(LEARNING_LANGUAGES.map(l => ({ languageSlug: l.slug })), ['languageSlug']); }
export async function generateMetadata({ params }: { params: Promise<{ languageSlug: string }> }) { const { languageSlug } = await params; const language = LEARNING_LANGUAGES.find(l => l.slug === languageSlug); return { title: buildSeoTitle(`${language?.title || 'Programming'} Lessons and Coding Practice`), description: `Study ${language?.title || 'programming'} with structured English lessons, worked examples and browser practice. Choose a topic and learn at your own pace with RayTech.`, alternates: { canonical: siteUrl(`/learn/${languageSlug}/`) }, robots: { index: LEARNING_TOPICS.some(t => t.languageId === language?.id), follow: true } }; }
export default async function LanguagePage({ params }: { params: Promise<{ languageSlug: string }> }) {
  const { languageSlug } = await params; const language = LEARNING_LANGUAGES.find(l => l.slug === languageSlug); if (!language) notFound();
  const topics = LEARNING_TOPICS.filter(t => t.languageId === language.id).sort((a, b) => a.order - b.order);
  return <div><Header /><main id="main-content" className="page-main"><nav className="breadcrumb"><Link href="/courses/">Courses</Link><span>/</span><span>{language.title}</span></nav><div className="page-intro"><h1 className="text-3xl font-bold">Learn {language.title}</h1><p className="mt-4">{language.description}</p></div>{!topics.length ? <p>Lessons are being reviewed. Check back after publication.</p> : <ol className="grid gap-4 md:grid-cols-2">{topics.map(t => <li key={t.id}><Link className="block rounded-lg border border-[var(--border)] p-5 hover:bg-[var(--bg-soft)]" href={`/learn/${language.slug}/${t.slug}/`}><h2 className="text-lg font-semibold">{t.order}. {t.title}</h2><p className="mt-2 text-sm text-[var(--text-sub)]">{t.summary}</p></Link></li>)}</ol>}</main><Footer /></div>;
}
