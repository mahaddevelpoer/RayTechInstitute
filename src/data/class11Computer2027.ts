import data from '../../content/class11-computer-2027/generated.json';
import type {ChapterItem,MCQItem,NoteItem,PastPaperItem} from '@/types/educational';

export const CLASS11_COMPUTER_CHAPTERS = data.chapters as ChapterItem[];
export const CLASS11_COMPUTER_NOTES = data.notes as NoteItem[];
export const CLASS11_COMPUTER_MCQS = data.mcqs as MCQItem[];
export const CLASS11_COMPUTER_PAPERS = data.papers as PastPaperItem[];
export const CLASS11_EXCLUDED_MCQS = new Set(data.excludedMcqIds);
const notes = new Map(CLASS11_COMPUTER_NOTES.map(n=>[n.id,n]));
const questions = new Map(CLASS11_COMPUTER_MCQS.map(q=>[q.id,q]));
const chapters = new Map(CLASS11_COMPUTER_CHAPTERS.map(c=>[c.id,c]));
function samePlacement(a:{classSlug:string;subjectSlug:string;chapterNumber:number},b:typeof a){
 if(a.classSlug!==b.classSlug||a.subjectSlug!==b.subjectSlug||a.chapterNumber!==b.chapterNumber)throw Error('Class 11 reviewed identity placement changed');
}
export function completeClass11Note(note:NoteItem):NoteItem {
 const replacement=notes.get(note.id);if(!replacement)return note;samePlacement(note,replacement);
 return {...note,...replacement,downloadCount:note.downloadCount};
}
export function completeClass11Mcq(q:MCQItem):MCQItem {
 const replacement=questions.get(q.id);if(!replacement)return q;samePlacement(q,replacement);
 return {...q,...replacement,...(q.createdAt?{createdAt:q.createdAt}:{})};
}
export function completeClass11Chapter(c:ChapterItem):ChapterItem {
 const replacement=chapters.get(c.id);if(!replacement)return c;samePlacement(c,replacement);return {...c,...replacement};
}
export function class11NoteSeo(id:string):string|undefined {
 return (data.noteSeo as Record<string,string>)[id];
}
export function class11PaperSeo(id:string):{title:string;description:string}|undefined {
 const p=CLASS11_COMPUTER_PAPERS.find(p=>p.id===id);if(!p)return undefined;
 return {title:`11th CS ${p.board.replace('BISE ','')} ${p.year} Paper Guide`,description:`Read the ${p.board} ${p.year} old-course topic index, compare it with the new Class 11 book and check supported answers. Original scan linked.`};
}
export function appendClass11Resources<T extends {id:string}>(existing:T[],reviewed:T[]):T[]{
 const ids=new Set(existing.map(r=>r.id));return [...existing,...reviewed.filter(r=>!ids.has(r.id))];
}
