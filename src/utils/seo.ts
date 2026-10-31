/**
 * Serialize structured data for an inline JSON-LD script safely.
 * JSON.stringify alone does not escape a user-controlled `</script>` sequence.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/** Preserve complete editorial titles; search engines choose display length. */
export function buildSeoTitle(primary: string): string {
  const value = primary.replace(/\s+/g, ' ').trim() || 'Learning Resources';
  return value.endsWith(' | RayTech Institute') ? value : `${value} | RayTech Institute`;
}

/** Keep the page purpose visible even when a long topic title is shortened. */
export function buildTopicSeoTitle(topic: string, language: string, mode: 'lesson' | 'quiz' | 'assignment'): string {
  const label = language.replace(/\s+/g, ' ').trim() || 'Programming';
  let name = topic.replace(/\s+/g, ' ').trim() || 'Topic';
  if (name.toLowerCase().startsWith(`${label.toLowerCase()} `)) name = name.slice(label.length + 1);
  const purpose = mode === 'quiz' ? 'Quiz' : mode === 'assignment' ? 'Assignment' : 'Lesson';
  return buildSeoTitle(`${label} ${purpose}: ${name}`);
}

/** Short editorial summaries are valid; metadata must still fit the build contract. */
export function buildLessonDescription(summary: string, context: string): string {
  const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
  const text = normalize(summary);
  const label = normalize(context);
  let value = label && text ? `${label}: ${text}` : label || text || 'Learn this programming topic.';
  for (const sentence of [
    'Practice in your browser and check your understanding with a topic test.',
    'Review the lesson before completing the coding assignment.',
  ]) {
    if (value.length >= 120) break;
    value += `${/[.!?]$/.test(value) ? '' : '.'} ${sentence}`;
  }
  return value;
}

/** Bound search metadata only. Never truncate the saved document description or content. */
export function buildDocumentDescription(summary: string, context: string): string {
  const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
  const text = normalize(summary);
  const label = normalize(context);
  let value = label && text ? `${label}: ${text}` : label || text || 'View this study document.';
  if (value.length < 120)
    value += `${/[.!?]$/.test(value) ? '' : '.'} Read its details, open the original document and check the class, subject and examination session before using it for revision.`;
  return value;
}

/** Keep class, subject and resource purpose intact in metadata. */
export function buildResourceSeoTitle(classTitle:string,subjectTitle:string,purpose:string):string {
 const level=classTitle.replace(/\s*\([^)]*\)/g,'').replace(/\bclass\b/ig,'').replace(/D\.?I\.?T\.?/ig,'DIT').replace(/\s+/g,' ').trim();
 const subject=subjectTitle.replace(/\s+/g,' ').trim();
 const primary=[level,subject,purpose].filter(Boolean).join(' ');
 return buildSeoTitle(primary);
}
