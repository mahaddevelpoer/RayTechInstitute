import { LEARNING_LANGUAGES, LEARNING_TOPICS } from '@/data/learningCatalog';
import { staticExportParams } from '@/utils/staticExport';
export type TopicRouteParams = { languageSlug: string; topicSlug: string };
export function topicRouteParams() {
  return staticExportParams(LEARNING_TOPICS.flatMap(topic => {
    const language = LEARNING_LANGUAGES.find(item => item.id === topic.languageId);
    return language ? [{ languageSlug: language.slug, topicSlug: topic.slug }] : [];
  }), ['languageSlug', 'topicSlug']);
}
export function findTopicPage(params: TopicRouteParams) {
  const language = LEARNING_LANGUAGES.find(item => item.slug === params.languageSlug);
  const topic = LEARNING_TOPICS.find(item => item.languageId === language?.id && item.slug === params.topicSlug);
  const topics = LEARNING_TOPICS.filter(item => item.languageId === language?.id)
    .sort((a, b) => a.order - b.order).map(({ id, title, slug, order }) => ({ id, title, slug, order }));
  return { language, topic, topics };
}
