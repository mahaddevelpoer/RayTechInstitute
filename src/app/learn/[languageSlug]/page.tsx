import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LEARNING_LANGUAGES, LEARNING_TOPICS } from '@/data/learningCatalog';
import { siteUrl } from '@/lib/site';
import { withSocialMetadata } from '@/utils/social-metadata';
import { buildSeoTitle } from '@/utils/seo';
import { staticExportParams } from '@/utils/staticExport';

export const dynamicParams = false;
export function generateStaticParams() { return staticExportParams(LEARNING_LANGUAGES.map(l => ({ languageSlug: l.slug })), ['languageSlug']); }
export async function generateMetadata({ params }: { params: Promise<{ languageSlug: string }> }) { const { languageSlug } = await params; const language = LEARNING_LANGUAGES.find(l => l.slug === languageSlug); return withSocialMetadata({ title: buildSeoTitle(`${language?.title || 'Programming'} Tutorial & Coding Practice`), description: `Study ${language?.title || 'programming'} with structured English lessons, worked examples and browser practice. Choose a topic and learn at your own pace with RayTech.`, alternates: { canonical: siteUrl(`/learn/${languageSlug}/`) }, robots: { index: LEARNING_TOPICS.some(t => t.languageId === language?.id), follow: true } }); }
export default async function LanguagePage({params}:{params:Promise<{languageSlug:string}>}){
 const {languageSlug}=await params;const language=LEARNING_LANGUAGES.find(l=>l.slug===languageSlug);if(!language)notFound();
 const topics=LEARNING_TOPICS.filter(t=>t.languageId===language.id).sort((a,b)=>a.order-b.order);
 return <div className="academic-page"><Header/><main id="main-content" className="page-main"><nav className="breadcrumb"><Link href="/courses/">Courses</Link><span>/</span><span>{language.title}</span></nav><div className="directory-intro"><h1>Learn {language.title}</h1><p>{language.description} {topics.length} published {topics.length===1?'lesson':'lessons'}, with practice code and topic activities.</p>{topics[0]&&<Link className="learn-button mt-5" href={`/learn/${language.slug}/${topics[0].slug}/`}>Start the first lesson<ArrowRight size={18}/></Link>}</div>{!topics.length?<div className="directory-empty"><h2>Lessons are being reviewed</h2><p>This track will appear after its lessons are published.</p><Link href="/courses/" className="learn-button">Browse other languages</Link></div>:<ol className="topic-directory">{topics.map(t=><li key={t.id}><Link href={`/learn/${language.slug}/${t.slug}/`}><span className="topic-directory-number">{String(t.order).padStart(2,'0')}</span><div><h2>{t.title}</h2><p>{t.summary}</p></div><ArrowRight size={20}/></Link></li>)}</ol>}</main><Footer/></div>;
}
