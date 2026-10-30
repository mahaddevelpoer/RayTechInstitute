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

/** Keep search titles readable and within the project's 50-60 character target. */
export function buildSeoTitle(primary: string): string {
  const suffix = ' | RayTech Institute';
  const maxPrimaryLength = 60 - suffix.length;
  const minPrimaryLength = 50 - suffix.length;
  let value = primary.replace(/\s+/g, ' ').trim() || 'Learning Resources';

  for (const addition of [' Resources', ' Guide', ' Online', ' Study Notes']) {
    if (value.length >= minPrimaryLength) break;
    value += addition;
  }

  if (value.length > maxPrimaryLength) {
    value = `${value.slice(0, maxPrimaryLength - 1).trimEnd()}…`;
  }
  return `${value}${suffix}`;
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
  if (value.length <= 155) return value;
  let shortened = value.slice(0, 154);
  const boundary = shortened.lastIndexOf(' ');
  if (boundary >= 120) shortened = shortened.slice(0, boundary);
  return `${shortened.trimEnd()}…`;
}

/** Bound search metadata only. Never truncate the saved document description or content. */
export function buildDocumentDescription(summary: string, context: string): string {
  const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
  const text = normalize(summary);
  const label = normalize(context);
  let value = label && text ? `${label}: ${text}` : label || text || 'View this study document.';
  if (value.length < 120)
    value += `${/[.!?]$/.test(value) ? '' : '.'} Read its details, open the original document and check the class, subject and examination session before using it for revision.`;
  if (value.length <= 155) return value;
  let shortened = value.slice(0, 154);
  const boundary = shortened.lastIndexOf(' ');
  if (boundary >= 120) shortened = shortened.slice(0, boundary);
  return `${shortened.trimEnd()}…`;
}

/** Preserve the resource intent when shortening long class/subject titles. */
export function buildResourceSeoTitle(classTitle:string,subjectTitle:string,purpose:string):string {
 const level=classTitle.replace(/\s*\([^)]*\)/g,'').replace(/\bclass\b/ig,'').replace(/D\.?I\.?T\.?/ig,'DIT').replace(/\s+/g,' ').trim();
 const subject=subjectTitle.replace(/\s+/g,' ').trim();
 const primary=[level,subject,purpose].filter(Boolean).join(' ');
 const max=60-' | RayTech Institute'.length;
 if(primary.length<=max)return buildSeoTitle(primary);
 const prefix=[level,subject].filter(Boolean).join(' ');const budget=Math.max(5,max-purpose.length-1);
 const short=prefix.slice(0,budget).replace(/\s+\S*$/,'').trim()||prefix.slice(0,budget);
 return buildSeoTitle(short+' '+purpose);
}
