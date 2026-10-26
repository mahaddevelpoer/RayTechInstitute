import { notFound } from 'next/navigation';
import { LearningWorkspace } from '@/components/learning/LearningWorkspace';
import { findTopicPage, topicRouteParams, type TopicRouteParams } from '@/lib/learning/pages';
import { siteUrl } from '@/lib/site';
import { withSocialMetadata } from '@/utils/social-metadata';
import { buildTopicSeoTitle, buildLessonDescription, serializeJsonLd } from '@/utils/seo';
import { learningStructuredData } from '@/utils/learning-seo';
export const dynamicParams = false;
export const generateStaticParams = topicRouteParams;
export async function generateMetadata({ params }: { params: Promise<TopicRouteParams> }) {
  const p = await params;
  const { language, topic } = findTopicPage(p);
  return withSocialMetadata({ title: buildTopicSeoTitle(topic?.title || 'Topic', language?.title || 'Programming', 'quiz'), description: buildLessonDescription('Answer topic questions, review explanations and unlock its coding assignment with a score of at least 80%.', `${language?.title || 'Programming'} ${topic?.title || 'topic'} test`), alternates: { canonical: siteUrl(`/learn/${p.languageSlug}/${p.topicSlug}/quiz/`) } });
}
export default async function TopicQuizPage({ params }: { params: Promise<TopicRouteParams> }) {
  const { language, topic, topics } = findTopicPage(await params);
  if (!language || !topic) notFound();
  const canonical = siteUrl(`/learn/${language.slug}/${topic.slug}/quiz/`);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(learningStructuredData(language, topic, canonical, 'quiz')) }} /><LearningWorkspace key={`${topic.id}@${topic.version}:quiz`} language={language} topic={topic} topics={topics} mode="quiz" /></>;
}
