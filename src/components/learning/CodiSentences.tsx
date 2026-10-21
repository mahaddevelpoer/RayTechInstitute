import { codiSentences } from '@/lib/learning/codi-sentences';
export function CodiSentences({text}:{text:string}) {
  return <>{codiSentences(text).map((sentence,index)=><span key={index}>{index>0?' ':''}<button type="button" className="codi-sentence" data-codi-text={sentence} title="Read this sentence with Codi">{sentence}</button></span>)}</>;
}
export function CodiCodeLines({code}:{code:string}) {
  return <>{code.split('\n').map((line,index)=><span key={index}>{index>0?'\n':''}{line.trim()?<button type="button" className="codi-sentence codi-code-sentence" data-codi-text={line.trim()} title="Read this code line with Codi">{line}</button>:line}</span>)}</>;
}
