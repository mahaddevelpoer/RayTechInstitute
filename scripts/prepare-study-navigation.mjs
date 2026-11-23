import fs from 'node:fs/promises';
import {loadTypescript} from './load-typescript.mjs';
const [catalog, helpers, links] = await Promise.all([loadTypescript('src/data/staticCatalog.ts'),loadTypescript('src/utils/study-directory.ts'),loadTypescript('src/utils/study-links.ts')]);
const directory=helpers.buildStudyDirectory({classes:catalog.INITIAL_CLASSES,subjects:catalog.INITIAL_SUBJECTS,chapters:catalog.INITIAL_CHAPTERS,notes:catalog.INITIAL_NOTES,mcqs:catalog.INITIAL_MCQS,papers:catalog.INITIAL_PAST_PAPERS});
const classes=catalog.INITIAL_CLASSES.filter(c=>c.isActive&&directory.some(s=>s.classSlug===c.slug));
const subjects=catalog.INITIAL_SUBJECTS.filter(s=>classes.some(c=>c.slug===s.classSlug)).map(s=>{
 const row=directory.find(d=>d.classSlug===s.classSlug&&d.slug===s.slug);return {...s,notes:row?.notes||0,mcqs:row?.mcqs||0,papers:row?.papers||0};
});
const shortcuts=links.buildStudyLinks(classes.filter(c=>directory.some(s=>s.classSlug===c.slug&&helpers.hasStudyResources(s))),subjects,catalog.INITIAL_GAZETTES).filter(link=>{
 const parts=link.href.split('/').filter(Boolean);if(parts.length!==4||parts[0]!=='classes')return true;
 const subject=directory.find(s=>s.classSlug===parts[1]&&s.slug===parts[2]);const resource=parts[3]==='past-papers'?'papers':parts[3];return !!subject&&helpers.hasStudyResources(subject,resource);
});
await fs.writeFile('src/data/studyNavigation.json',JSON.stringify({classes,subjects,links:shortcuts,directory}));
await fs.writeFile('src/data/videoQuestionSnapshot.ts',`import type { VideoInteractiveMCQ } from '@/types/educational';\nexport const INITIAL_VIDEO_MCQS: VideoInteractiveMCQ[] = ${JSON.stringify(catalog.INITIAL_VIDEO_MCQS)};\n`);
const omitBody=({content,...record})=>record;
const resources=[['CLASSES','ClassItem',catalog.INITIAL_CLASSES],['SUBJECTS','SubjectItem',catalog.INITIAL_SUBJECTS],['CHAPTERS','ChapterItem',catalog.INITIAL_CHAPTERS],['NOTES','NoteItem',catalog.INITIAL_NOTES.map(omitBody)],['MCQS','MCQItem',catalog.INITIAL_MCQS],['PAST_PAPERS','PastPaperItem',catalog.INITIAL_PAST_PAPERS.map(omitBody)],['GAZETTES','GazetteItem',catalog.INITIAL_GAZETTES.map(omitBody)]];
// Normalize display punctuation only; the database and authored source remain intact.
await fs.writeFile('src/data/academicResourceSnapshot.ts',(`import type {ClassItem,SubjectItem,ChapterItem,NoteItem,MCQItem,PastPaperItem,GazetteItem} from '@/types/educational';\n`+resources.map(([name,type,rows])=>`export const INITIAL_${name}: ${type}[] = /* @__PURE__ */ JSON.parse(${JSON.stringify(JSON.stringify(rows))});`).join('\n')+'\n').replace(/\u2014/g,'-'));
console.log(`[study-navigation] ${classes.length} classes, ${subjects.length} subjects, ${directory.filter(s=>helpers.hasStudyResources(s)).length} subjects with available resources. Public labels/counts only.`);
