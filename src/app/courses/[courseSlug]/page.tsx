import Link from 'next/link';
import { LanguageCard } from '@/components/learning/LanguageCard';
import { notFound } from 'next/navigation';
import { LEARNING_COURSES, LEARNING_LANGUAGES, LEARNING_TOPICS } from '@/data/learningCatalog';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { staticExportParams } from '@/utils/staticExport';
import { siteUrl } from '@/lib/site';
import { withSocialMetadata } from '@/utils/social-metadata';
import { buildSeoTitle, buildLessonDescription } from '@/utils/seo';
export const dynamicParams = false;
export function generateStaticParams() { return staticExportParams(LEARNING_COURSES.map(c => ({ courseSlug: c.slug })), ['courseSlug']); }
export async function generateMetadata({ params }: { params: Promise<{ courseSlug: string }> }) { const { courseSlug } = await params; const course = LEARNING_COURSES.find(c => c.slug === courseSlug); return withSocialMetadata({ title: buildSeoTitle(`${course?.title || 'Programming'} Course and Learning Path`), description: buildLessonDescription('Study its language tracks, follow worked examples and practise each topic with browser exercises.', `${course?.title || 'Programming'} course`), alternates: { canonical: siteUrl(`/courses/${courseSlug}/`) } }); }
export default async function CoursePage({params}:{params:Promise<{courseSlug:string}>}){
 const{courseSlug}=await params;const course=LEARNING_COURSES.find(c=>c.slug===courseSlug);if(!course)notFound();
 return <div className="academic-page"><Header/><main id="main-content" className="page-main"><nav className="breadcrumb"><Link href="/courses/">Courses</Link><span>/</span><span>{course.title}</span></nav><div className="directory-intro"><h1>{course.title}</h1><p>{course.description}</p></div><h2 className="directory-section-title">Study each language separately</h2><div className="language-directory">{course.languageIds.map(id=>{const language=LEARNING_LANGUAGES.find(l=>l.id===id);return language?<LanguageCard key={id} language={language} count={LEARNING_TOPICS.filter(t=>t.languageId===id).length}/>:null;})}</div><aside className="directory-guidance"><h2>Follow the learning path</h2><p>Open a language track, begin with its first topic and use the examples as you read. Topic tests and assignments belong to that language, not to a mixed course-wide test.</p></aside></main><Footer/></div>;
}
