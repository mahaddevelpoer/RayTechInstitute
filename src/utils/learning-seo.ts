import type { LearningLanguage, LearningTopic } from '../types/learning';

export function learningStructuredData(language: LearningLanguage, topic: LearningTopic, canonical: string, mode: 'lesson' | 'quiz') {
  const origin = new URL(canonical).origin;
  const lessonPath = `/learn/${language.slug}/${topic.slug}/`;
  const crumbs = [['Home', '/'], ['Courses', '/courses/'], [language.title, `/learn/${language.slug}/`], [topic.title, lessonPath]];
  if (mode === 'quiz') crumbs.push(['Topic test', `${lessonPath}quiz/`]);
  return { '@context': 'https://schema.org', '@graph': [{
    '@type': mode === 'quiz' ? 'Quiz' : 'LearningResource', '@id': `${canonical}#resource`, url: canonical,
    name: mode === 'quiz' ? `${topic.title}: ${language.title} topic test` : topic.title,
    description: topic.summary, inLanguage: 'en', isAccessibleForFree: true,
    learningResourceType: mode === 'quiz' ? 'Practice quiz' : 'Programming lesson',
    teaches: topic.objectives,
    publisher: { '@type': 'EducationalOrganization', name: 'RayTech Institute', url: origin },
    ...(mode === 'quiz' ? { hasPart: topic.questions.map(question => ({
      '@type': 'Question', name: question.question,
      suggestedAnswer: question.options.map(option => ({ '@type': 'Answer', text: option.text })),
      acceptedAnswer: { '@type': 'Answer', text: question.options.find(option => option.id === question.correctOptionId)?.text || '' },
    })) } : {}),
  }, {
    '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, path], index) => ({ '@type': 'ListItem', position: index + 1, name, item: new URL(path, origin).href })),
  }] };
}
