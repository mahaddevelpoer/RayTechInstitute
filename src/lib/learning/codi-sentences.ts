export const CODI_AUDIO_VERSION = 'sentence-urdu-v1';
export const normalizeCodiText = (text: string) => text.replace(/\s+/g, ' ').trim();
export function codiSentences(text: string, protectedRanges: {start:number;end:number}[] = []): string[] {
  const result: string[] = []; let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (!/[.!?۔؟]/.test(text[i])) continue;
    if(protectedRanges.some(range=>i>=range.start&&i<range.end))continue;
    let end = i + 1; while (end < text.length && /[.!?۔؟"'”’\])]/.test(text[end])) end++;
    if (end < text.length && !/\s/.test(text[end])) continue;
    const prefix = text.slice(start, i + 1);
    if (text[i] === '.' && /(?:\b(?:e\.g|i\.e|Mr|Mrs|Ms|Dr|Prof|vs|etc|Fig|No|St)|\b[A-Z]|\b(?:[A-Za-z]\.){2,})\.$/i.test(prefix)) continue;
    const sentence = normalizeCodiText(text.slice(start, end)); if (sentence) result.push(sentence);
    start = end; i = end - 1;
  }
  const rest = normalizeCodiText(text.slice(start)); if (rest) result.push(rest);
  return result;
}
export const codiAudioKeyMaterial = (text: string, language: 'en' | 'ur') => `${CODI_AUDIO_VERSION}:Kore:${language}:${normalizeCodiText(text)}`;

interface Node { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: Node[] }
const textOf = (node: Node): string => typeof node.value==='string' ? node.value : (node.children || []).map(textOf).join('');
export function codiInlineCodeRanges(node: Node) {
  const ranges:{start:number;end:number}[]=[];let offset=0;
  const walk=(item:Node)=>{const length=textOf(item).length;if(item.tagName==='code'||item.type==='inlineCode'){ranges.push({start:offset,end:offset+length});offset+=length;return;}if(typeof item.value==='string'){offset+=length;return;}for(const child of item.children||[])walk(child);};walk(node);return ranges;
}
const phrasing = new Set(['strong','em','code','a','del','span','br']);
function sliceNode(node: Node, start: number, end: number): Node | null {
  if (node.type === 'text') { const value = (node.value || '').slice(start,end); return value ? {...node,value} : null; }
  let offset = 0; const children: Node[] = [];
  for (const child of node.children || []) { const length = textOf(child).length; const part = sliceNode(child,Math.max(0,start-offset),Math.min(length,end-offset)); if (end>offset && start<offset+length && part) children.push(part); offset+=length; }
  return children.length ? {...node,children} : null;
}
function button(children: Node[], text: string): Node { return {type:'element',tagName:'button',properties:{type:'button',className:['codi-sentence'],'data-codi-text':text,title:'Read this sentence with Codi'},children}; }
function hasLink(node: Node): boolean { return node.tagName==='a' || (node.children || []).some(hasLink); }
function linkedButtons(node: Node, sentence: string): Node {
  if (node.tagName==='a') return node;
  if (!hasLink(node)) return textOf(node).trim() ? button([node],sentence) : node;
  return {...node,children:(node.children || []).map(child=>linkedButtons(child,sentence))};
}
/** Trusted HAST transform. No raw HTML, JavaScript or user-authored handlers. */
export function codiSentencePlugin() {
  return (tree: Node) => {
    const walk = (node: Node) => {
      if (['pre','button','a','script','style'].includes(node.tagName || '')) return;
      const eligible = ['p','h1','h2','h3','h4','h5','h6','li','td','th','figcaption'].includes(node.tagName || '') && (node.children || []).every(child=>child.type==='text'||phrasing.has(child.tagName || ''));
      if (eligible) {
        const text = textOf(node); const sentences = codiSentences(text,codiInlineCodeRanges(node)); let offset = 0; const children: Node[] = [];
        for (const sentence of sentences) {
          // Match the exact source range while permitting normalized whitespace.
          const words=sentence.split(' '); let end=offset; while(end<text.length&&/\s/.test(text[end]))end++;
          const begin=end; for(const word of words){const found=text.indexOf(word,end);if(found<0){end=text.length;break;}end=found+word.length;}
          if(begin>offset)children.push({type:'text',value:text.slice(offset,begin)});
          const fragment=sliceNode(node,begin,end); const parts=fragment?.children || [];
          children.push(parts.some(hasLink)?{type:'element',tagName:'span',properties:{className:['codi-sentence-group']},children:parts.map(part=>linkedButtons(part,sentence))}:button(parts,sentence));offset=end;
        }
        if(offset<text.length)children.push({type:'text',value:text.slice(offset)});
        node.children=children; return;
      }
      for(const child of node.children || [])walk(child);
    };
    walk(tree);
  };
}
