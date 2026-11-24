import {createHash} from 'node:crypto';
// Stable print identity: database timestamps and JSON property order are not
// printed material, while every question, option and correct answer matters.
export function questionFingerprint(questions) {
 const rows=questions.map(q=>({id:q.id,classSlug:q.classSlug,subjectSlug:q.subjectSlug,chapterNumber:q.chapterNumber,
  question:q.question,codeSnippet:q.codeSnippet||'',options:Array.from(q.options),correctIndex:q.correctIndex,explanation:q.explanation}));
 return createHash('sha256').update(JSON.stringify(rows)).digest('hex');
}
