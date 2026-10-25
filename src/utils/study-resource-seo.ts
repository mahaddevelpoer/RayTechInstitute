import type { NoteItem } from '@/types/educational';

export function studyResourceKeywords(classTitle: string, subjectTitle: string, topics: string[] = []) {
  const className = classTitle.replace(/\s*\([^)]*\)/, '').trim();
  return Array.from(new Set([`${className} ${subjectTitle}`, `${subjectTitle} MCQs`, `${subjectTitle} notes PDF`, ...topics].map(value => value.replace(/\s+/g, ' ').trim()).filter(Boolean))).slice(0, 14);
}

export function noteStructuredData(note: NoteItem, classTitle: string, subjectTitle: string, canonical: string, topics: string[]) {
  const origin = new URL(canonical).origin;
  const subjectPath = `/classes/${note.classSlug}/${note.subjectSlug}/`;
  const bilingual = /English\s+(?:and|\+)\s+Urdu/i.test(`${note.description} ${note.content || ''}`);
  return {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'LearningResource', '@id': `${canonical}#resource`, url: canonical,
      name: note.title, description: note.description, educationalLevel: classTitle,
      learningResourceType: /MCQ/i.test(note.title) ? 'Practice question bank' : 'Study notes',
      inLanguage: bilingual ? ['en', 'ur'] : ['en'], isAccessibleForFree: true,
      keywords: studyResourceKeywords(classTitle, subjectTitle, [note.chapterTitle, ...topics]),
      about: [subjectTitle, note.chapterTitle, ...topics].map(name => ({ '@type': 'Thing', name })),
      publisher: { '@type': 'Organization', name: 'RayTech Institute', url: origin },
      ...(/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(note.lastUpdated) ? { dateModified: note.lastUpdated } : {}),
      associatedMedia: { '@type': 'MediaObject', contentUrl: note.pdfUrl, encodingFormat: 'application/pdf' },
    }, {
      '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumbs`,
      itemListElement: [
        ['Home', '/'], ['Classes', '/classes/'], [classTitle, `/classes/${note.classSlug}/`],
        [subjectTitle, subjectPath], ['Notes', `${subjectPath}notes/`], [note.title, new URL(canonical).pathname],
      ].map(([name, pathname], index) => ({ '@type': 'ListItem', position: index + 1, name, item: new URL(pathname, origin).href })),
    }],
  };
}
