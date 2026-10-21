import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LEARNING_COURSES, LEARNING_LANGUAGES } from '@/data/learningCatalog';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { staticExportParams } from '@/utils/staticExport';
import { siteUrl } from '@/lib/site';
import { buildSeoTitle } from '@/utils/seo';
export const dynamicParams = false;
export function generateStaticParams() { return staticExportParams(LEARNING_COURSES.map(c => ({ courseSlug: c.slug })), ['courseSlug']); }
export async function generateMetadata({ params }: { params: Promise<{ courseSlug: string }> }) { const { courseSlug } = await params; const course = LEARNING_COURSES.find(c => c.slug === courseSlug); return { title: buildSeoTitle(`${course?.title || 'Programming'} Course and Learning Path`), description: 'Follow a structured programming course with separate language tracks, clear English lessons and practical browser exercises from RayTech Institute.', alternates: { canonical: siteUrl(`/courses/${courseSlug}/`) } }; }
export default async function CoursePage({ params }: { params: Promise<{ courseSlug: string }> }) { const { courseSlug } = await params; const course = LEARNING_COURSES.find(c => c.slug === courseSlug); if (!course) notFound(); return <div><Header /><main id="main-content" className="page-main"><nav className="breadcrumb"><Link href="/courses/">Courses</Link><span>/</span><span>{course.title}</span></nav><div className="page-intro"><h1 className="text-3xl font-bold">{course.title}</h1><p className="mt-4">{course.description}</p></div><h2 className="mb-5 text-xl font-semibold">Language tracks</h2><ol className="space-y-4">{course.languageIds.map(id => { const language = LEARNING_LANGUAGES.find(l => l.id === id); return language ? <li key={id}><Link className="learn-button" href={`/learn/${language.slug}/`}>{language.title}</Link><p className="mt-2 text-sm">{language.description}</p></li> : null; })}</ol></main><Footer /></div>; }
