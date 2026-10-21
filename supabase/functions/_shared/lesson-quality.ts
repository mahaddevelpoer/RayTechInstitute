/** Count teaching prose, not code, URLs or Markdown punctuation. */
export function lessonWordCount(markdown: string): number {
  let fence: { marker: string; length: number } | null = null;
  const text = markdown.split('\n').map(line => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence.marker && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      return '';
    }
    if (marker) { fence = { marker: marker[1][0], length: marker[1].length }; return ''; }
    return line;
  }).join('\n');
  const prose = text
    .replace(/`[^`\n]*`/g, ' ').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]*>/g, ' ');
  return (prose.match(new RegExp("[\\p{L}\\p{N}]+(?:['’-][\\p{L}\\p{N}]+)*", 'gu')) || []).length;
}

export function lessonQualityIssues(content: string): string[] {
  const errors: string[] = [];
  if ((content.match(/^#{2,3}\s+\S/gm) || []).length < 4) errors.push('Use at least four Markdown section headings (## or ###).');
  if ((content.match(/^```(?:python|py|javascript|js|html|css|php)\s*$/gm) || []).length < 3) errors.push('Include at least three language-tagged worked code examples.');
  if ((content.match(/expected (?:output|result)|what you should see/gi) || []).length < 3) errors.push('Explain the expected output or visible result for each worked example.');
  return errors;
}
