export function courseStructuredData(name: string, description: string, canonical: string, parts: Array<{name: string; url: string; type: 'Course' | 'LearningResource'}>) {
  return {'@context':'https://schema.org', '@type':'Course', '@id':canonical+'#course', name, description, url:canonical,
    isAccessibleForFree:true, inLanguage:'en', provider:{'@type':'Organization', name:'RayTech Institute', url:new URL(canonical).origin},
    hasPart:parts.map(part=>({'@type':part.type, name:part.name, url:part.url})),
  };
}
