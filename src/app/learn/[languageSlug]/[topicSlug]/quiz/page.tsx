import { notFound } from 'next/navigation';
import { LearningWorkspace } from '@/components/learning/LearningWorkspace';
import { findTopicPage, topicRouteParams, type TopicRouteParams } from '@/lib/learning/pages';
import { siteUrl } from '@/lib/site';
import { buildSeoTitle } from '@/utils/seo';
export const dynamicParams = false;
export const generateStaticParams = topicRouteParams;
export async function generateMetadata({ params }: { params: Promise<TopicRouteParams> }) {
  const p = await params;
  const { language, topic } = findTopicPage(p);
  return { title: buildSeoTitle(`${topic?.title || 'Topic'} Test - ${language?.title || 'Programming'}`), description: 'Check your understanding with topic questions, review final explanations and unlock a practical coding assignment with a score of at least 80%.', alternates: { canonical: siteUrl(`/learn/${p.languageSlug}/${p.topicSlug}/quiz/`) } };
}
export default async function TopicQuizPage({ params }: { params: Promise<TopicRouteParams> }) {
  const { language, topic, topics } = findTopicPage(await params);
  if (!language || !topic) notFound();
  return <LearningWorkspace key={`${topic.id}@${topic.version}:quiz`} language={language} topic={topic} topics={topics} mode="quiz" />;
}
