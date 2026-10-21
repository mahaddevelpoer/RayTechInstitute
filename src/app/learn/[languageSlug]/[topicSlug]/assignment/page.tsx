import { notFound } from 'next/navigation';
import { LearningWorkspace } from '@/components/learning/LearningWorkspace';
import { findTopicPage, topicRouteParams, type TopicRouteParams } from '@/lib/learning/pages';
import { siteUrl } from '@/lib/site';
import { buildSeoTitle } from '@/utils/seo';
export const dynamicParams = false;
export const generateStaticParams = topicRouteParams;
export async function generateMetadata({ params }: { params: Promise<TopicRouteParams> }) {
  const p = await params;
  const { topic } = findTopicPage(p);
  return { title: buildSeoTitle(`${topic?.title || 'Topic'} Coding Assignment`), description: 'Apply the concepts from your lesson in a coding assignment with instructions, practical hints and a clear marking rubric.', alternates: { canonical: siteUrl(`/learn/${p.languageSlug}/${p.topicSlug}/assignment/`) }, robots: { index: false, follow: true } };
}
export default async function TopicAssignmentPage({ params }: { params: Promise<TopicRouteParams> }) {
  const { language, topic, topics } = findTopicPage(await params);
  if (!language || !topic) notFound();
  return <LearningWorkspace key={`${topic.id}@${topic.version}:assignment`} language={language} topic={topic} topics={topics} mode="assignment" />;
}
