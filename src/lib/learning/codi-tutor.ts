export interface CodiLessonSource { id: string; title: string; slug: string; order: number; content: string }
export interface CodiExplanation { title: string; slug: string; section: string; text: string; relation: 'current' | 'previous' | 'upcoming' }
export function codiNarration(markdown: string): string {
  const code: string[] = [];
  const protectedText = markdown.replace(/```[^\n]*\n([\s\S]*?)```|`([^`\n]+)`/g, (_match, fenced: string | undefined, inline: string | undefined) => {
    code.push(fenced ?? inline ?? ''); return `\uE000${code.length - 1}\uE001`;
  });
  return protectedText.replace(/<!--[\s\S]*?-->/g, '').replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').replace(/^\s{0,3}#{1,6}\s+/gm, '').replace(/[*_`]/g, '').replace(/^\s*[-+]\s+/gm, '').replace(/\uE000(\d+)\uE001/g, (_match, index) => code[Number(index)] ?? '').replace(/\n{3,}/g, '\n\n').trim();
}
/** Queue the complete text. Each neural voice request remains small and bounded. */
export function codiSpeechChunks(text: string, format: 'markdown' | 'text' = 'markdown'): string[] {
  const clean = format === 'text' ? text.trim() : codiNarration(text); if (!clean || clean.length > 200000) return [];
  const chunks: string[] = []; let buffer = '';
  for (const word of clean.split(/\s+/)) {
    if (word.length > 420) { if (buffer) { chunks.push(buffer); buffer = ''; } for (let index = 0; index < word.length; index += 420) chunks.push(word.slice(index, index + 420)); continue; }
    if (buffer.length + word.length + 1 > 420) { chunks.push(buffer); buffer = ''; }
    buffer += `${buffer ? ' ' : ''}${word}`;
    if (buffer.length > 180 && /[.!?।]$/.test(word)) { chunks.push(buffer); buffer = ''; }
  }
  if (buffer) chunks.push(buffer); return chunks;
}
const ignored = new Set('a an the this that these those is are was were be to of for and or in on with it its as at by can will you your we our use using example explain explanation what how does do'.split(' '));
const words = (text: string) => Array.from(new Set((text.toLowerCase().match(/[a-z0-9_\u0900-\u097f]{2,}/g) || []).filter(word => !ignored.has(word))));
/** Grounded retrieval, not generated advice: return actual published lesson prose. */
export function findCodiExplanation(selection: string, sources: CodiLessonSource[], currentId: string): CodiExplanation | null {
  const query = words(selection); if (!query.length || selection.length > 2000) return null;
  const current = sources.find(source => source.id === currentId); if (!current) return null;
  let best: { score: number; value: CodiExplanation } | null = null;
  for (const source of sources) {
    let heading = source.title;
    for (const part of source.content.split(/(?=^#{1,6}\s)/m)) {
      const title = part.match(/^#{1,6}\s+([^\n]+)/)?.[1]; if (title) heading = title;
      const prose = codiNarration(part.replace(/```[\s\S]*?```/g, ''));
      if (prose.length < 70) continue;
      const terms = new Set(words(prose)); const headingTerms = new Set(words(heading));
      const hits = query.filter(word => terms.has(word)).length; if (hits / query.length < .45) continue;
      const headingHits = query.filter(word => headingTerms.has(word)).length;
      const score = hits / query.length * 10 + headingHits * 4 + (source.id === currentId ? 2 : 0) - Math.min(Math.abs(source.order - current.order), 10) * .12;
      if (!best || score > best.score) best = { score, value: { title: source.title, slug: source.slug, section: heading, text: prose, relation: source.id === currentId ? 'current' : source.order < current.order ? 'previous' : 'upcoming' } };
    }
  }
  return best?.value || null;
}
export function codiDockPoint(rect: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom' | 'width' | 'height'>, viewport: { width: number; height: number }) {
  const width = viewport.width <= 767 ? 72 : 104;
  return clampCodiPosition({ x: rect.right - width - 8, y: rect.top + 4 }, viewport);
}
export function clampCodiPosition(point: { x: number; y: number }, viewport: { width: number; height: number }) {
  const width = viewport.width <= 767 ? 72 : 104; const height = width + 48;
  return { x: Math.max(0, Math.min(Number.isFinite(point.x) ? point.x : 8, Math.max(0, viewport.width - width - 8))), y: Math.max(0, Math.min(Number.isFinite(point.y) ? point.y : 8, Math.max(0, viewport.height - height - 8))) };
}
export function codiSettingsPosition(point: { x: number; y: number }, viewport: { width: number; height: number }) {
  const width = Math.max(0, Math.min(336, viewport.width - 16)); const height = Math.min(440, Math.max(0, viewport.height - 16));
  const robotWidth = viewport.width <= 767 ? 72 : 104;
  const preferred = point.x >= width + 16 ? point.x - width - 8 : point.x + robotWidth + 8;
  return { left: Math.max(8, Math.min(preferred, viewport.width - width - 8)), top: Math.max(8, Math.min(point.y, viewport.height - height - 8)), width, maxHeight: height };
}
export function codiRobotPose(seconds: number, speaking: boolean, flying: boolean, reduced: boolean) {
  const phase = seconds % 4.3;
  return {
    eyeScale: !speaking && !reduced && phase > 3.9 && phase < 4.08 ? .09 : 1,
    mouth: [0, 1, 2].map(index => speaking && !reduced ? 1.2 + Math.abs(Math.sin(seconds * 13 + index)) * 3 : 1),
    bodyY: reduced ? 0 : Math.sin(seconds * 1.6) * .018,
    headYaw: speaking && !reduced ? Math.sin(seconds * 2) * .045 : 0,
    arm: flying ? .85 : .12,
    lean: flying && !reduced ? -.1 : 0,
  };
}
