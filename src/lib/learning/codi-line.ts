const blocked = 'a,button,input,textarea,select,summary,[contenteditable="true"],[aria-hidden="true"],[data-codi-ignore]';
export function codiLineAt(root: HTMLElement, target: EventTarget | null, y?: number): string | null {
  if (target instanceof Element && root.contains(target) && !target.closest('a,input,textarea,select,summary,[contenteditable="true"],[data-codi-ignore]')) {
    const sentence = target.closest('button[data-codi-text]');
    if (sentence && root.contains(sentence)) return sentence.getAttribute('data-codi-text')?.trim() || null;
  }
  if (!(target instanceof Element) || !root.contains(target) || target.closest(blocked)) return null;
  const block = target.closest('p,h1,h2,h3,h4,h5,h6,li,pre,blockquote,td,th,figcaption');
  if (!block || !root.contains(block)) return null;
  const text = block.textContent?.trim() || '';
  if (!text || text.length > 6000) return null;
  if (!Number.isFinite(y)) return text.length <= 1000 ? text : null;
  // Measure rendered words, so clicking a wrapped paragraph selects its visible line.
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  const words: { text: string; top: number; bottom: number }[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    for (const match of Array.from((node.textContent || '').matchAll(/\S+/g))) {
      const range = document.createRange(); range.setStart(node, match.index!); range.setEnd(node, match.index! + match[0].length);
      if (typeof range.getClientRects !== 'function') continue;
      for (const rect of Array.from(range.getClientRects())) if (rect.height > 0) words.push({ text: match[0], top: rect.top, bottom: rect.bottom });
      if (words.length > 1000) return null;
    }
  }
  if (!words.length) return text.length <= 1000 ? text : null;
  const distance = (word: typeof words[number]) => Math.max(word.top - y!, y! - word.bottom, 0);
  const nearest = words.reduce((a, b) => distance(a) <= distance(b) ? a : b);
  const result = words.filter(word => Math.abs(word.top - nearest.top) < 3).map(word => word.text).join(' ').replace(/\s+([.,!?;:])/g, '$1');
  return result.length <= 1000 ? result : null;
}

export function codiWav(samples: Float32Array, rate: number): Uint8Array {
  if (!Number.isInteger(rate) || rate < 8000 || rate > 48000 || !samples.length || samples.length > rate * 90) throw new Error('Invalid generated audio.');
  const data = new Uint8Array(44 + samples.length * 2); const view = new DataView(data.buffer);
  const word = (offset: number, value: string) => Array.from(value).forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  word(0, 'RIFF'); view.setUint32(4, data.length - 8, true); word(8, 'WAVE'); word(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); word(36, 'data'); view.setUint32(40, samples.length * 2, true);
  samples.forEach((sample, index) => { if (!Number.isFinite(sample)) throw new Error('Invalid generated sample.'); const value = Math.max(-1, Math.min(1, sample)); view.setInt16(44 + index * 2, value < 0 ? value * 32768 : value * 32767, true); });
  return data;
}
