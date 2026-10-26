import { reviewedLessonBlocks } from '@/lib/learning/reviewed-lessons';
import { notFound } from 'next/navigation';
import { LEARNING_LANGUAGES, LEARNING_TOPICS } from '@/data/learningCatalog';
import { LearningWorkspace } from '@/components/learning/LearningWorkspace';
import { staticExportParams } from '@/utils/staticExport';
import { siteUrl } from '@/lib/site';
import { withSocialMetadata } from '@/utils/social-metadata';
import { buildTopicSeoTitle, buildLessonDescription, serializeJsonLd } from '@/utils/seo';
import { learningStructuredData } from '@/utils/learning-seo';

type Params = { languageSlug: string; topicSlug: string };
export const dynamicParams = false;
export function generateStaticParams() { return staticExportParams(LEARNING_TOPICS.flatMap(t => { const language = LEARNING_LANGUAGES.find(l => l.id === t.languageId); return language ? [{ languageSlug: language.slug, topicSlug: t.slug }] : []; }), ['languageSlug', 'topicSlug']); }
function getTopic(params: Params) { const language = LEARNING_LANGUAGES.find(l => l.slug === params.languageSlug); const topic = LEARNING_TOPICS.find(t => t.languageId === language?.id && t.slug === params.topicSlug); return { language, topic }; }
export async function generateMetadata({ params }: { params: Promise<Params> }) { const p = await params; const { language, topic } = getTopic(p); return withSocialMetadata({ title: buildTopicSeoTitle(topic?.title || 'Lesson', language?.title || 'Programming', 'lesson'), description: buildLessonDescription(topic?.summary || '', `${topic?.title || 'Lesson'} (${language?.title || 'Programming'})`), alternates: { canonical: siteUrl(`/learn/${p.languageSlug}/${p.topicSlug}/`) } }); }
export default async function TopicPage({ params }: { params: Promise<Params> }) { const { language, topic } = getTopic(await params); if (!language || !topic) notFound(); const topics = LEARNING_TOPICS.filter(t => t.languageId === language.id).sort((a, b) => a.order - b.order).map(({ id, title, slug, order }) => ({ id, title, slug, order })); const canonical = siteUrl(`/learn/${language.slug}/${topic.slug}/`); return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(learningStructuredData(language, topic, canonical, 'lesson')) }} /><LearningWorkspace key={`${topic.id}@${topic.version}`} language={language} topic={topic} topics={topics} lessonBlocks={reviewedLessonBlocks(topic)} /></>; }
