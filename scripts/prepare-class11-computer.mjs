// Deterministic local authoring. Never writes to a database or deployment service.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chapters} from '../content/class11-computer-2027/index.mjs';
import {modelPaper} from '../content/class11-computer-2027/model-paper.mjs';
import {workedProject} from '../content/class11-computer-2027/worked-project.mjs';
import {legacyPapers} from '../content/class11-computer-2027/legacy-papers.mjs';
const root='content/class11-computer-2027';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const alp=await read(root+'/exclusions.json'),legacy=await read(root+'/legacy-audit.json');
const pdfs=await read(root+'/pdf-manifest.json').catch(()=>({}));
const hash=x=>createHash('sha256').update(x).digest('hex');
const base='/classes/11th-class/computer-science';
const pdfBase='/documents/class11/computer-2027/';
const scope='These original revision notes follow the supplied Punjab Grade 11 Computer Science and Entrepreneurship textbook and the PECTAA ALP for Annual Examination 2027, session 2026-27. Deleted sections and specified deleted exercise questions are excluded from teaching and practice. Printed book page numbers are used throughout; PDF page = printed page + 3. These are study answers, not an official marking scheme.';
const sources='## Sources and study route\n\nTextbook: user-supplied Punjab Grade 11 Computer Science and Entrepreneurship, printed pages 1-140. ALP: notification PECTAA/C&C Unit/2026/1239, dated 6 November 2026; CS exclusions PDF pages 43-44, structure 45-46, model paper 47-51.\n\n[Choose a chapter]('+base+'/) | [Practise chapter MCQs]('+base+'/mcqs/) | [Legacy past-paper study pages]('+base+'/past-papers/).';
const cite=p=>`**Book printed page${p.length===1?'':'s'}:** ${p.join(', ')}.`;
const excluded=legacy.mcqs.filter(q=>/Supplementary: excluded/.test(q.topic||''));
if(excluded.length!==40)throw Error('Expected exactly 40 reviewed excluded MCQs');
const questions=[];
for(const old of legacy.mcqs.filter(q=>!excluded.some(e=>e.id===q.id))){
 let code=old.topic.split(' ')[0];
 if(old.chapterNumber===3&&code==='3.3')code='3.3.1-3.3.2';
 if(old.chapterNumber===3&&code==='3.6')code=/Sorting/.test(old.topic)?'3.6.1':/Searching/.test(old.topic)?'3.6.2':'3.6.3';
 const topic=chapters[old.chapterNumber-1].topics.find(t=>t.section===code);
 if(!topic)throw Error('Missing reviewed topic '+old.topic);
 questions.push({...old,topic:`${code} ${topic.title}`,explanation:`${old.explanation} Source: supplied book, printed pages ${topic.pages.join(', ')}; retained ALP 2027 section ${code}.`});
}
for(const chapter of chapters)for(const [i,q] of (chapter.practice||[]).entries()){
 questions.push({id:`class11-alp2027-ch${chapter.number}-q${String(i+1).padStart(3,'0')}`,classSlug:'11th-class',subjectSlug:'computer-science',chapterNumber:chapter.number,topic:`${q.section} ${chapter.topics.find(t=>t.section===q.section)?.title||'Retained revision'}`,createdAt:'2026-11-27T00:00:00.000Z',question:q.question,options:[q.answer,...q.wrong],correctIndex:0,explanation:`${q.explanation} Source: supplied book, printed pages ${q.pages.join(', ')}; retained ALP 2027 section ${q.section}.`});
}
// Stable shuffled balanced keys: balance does not reveal a repeated A/B/C/D cycle.
const positions=questions.map((_,i)=>i%4);
for(let i=positions.length-1;i>0;i--){const j=createHash('sha256').update(`class11-alp2027:${i}`).digest().readUInt32BE(0)%(i+1);[positions[i],positions[j]]=[positions[j],positions[i]];}
questions.forEach((q,i)=>{const answer=q.options[q.correctIndex];const wrong=q.options.filter((_,j)=>j!==q.correctIndex);wrong.sort((a,b)=>hash(q.id+a).localeCompare(hash(q.id+b)));wrong.splice(positions[i],0,answer);q.options=wrong;q.correctIndex=positions[i];if(new Set(q.options).size!==4)throw Error('Duplicate options '+q.id);});
if(questions.length!==400)throw Error('Expected 400 reviewed MCQs');
function showQuestion(q,i,reveal=false){return `### Q${i+1}. ${q.question}\n\n${q.codeSnippet?'~~~python\n'+q.codeSnippet+'\n~~~\n\n':''}${q.options.map((v,j)=>`**${'ABCD'[j]})** ${v}`).join('\n\n')}${reveal?'\n\n**Answer: '+ 'ABCD'[q.correctIndex]+'.** '+q.explanation:''}`;}
function program(p){return `### ${p.title}\n\n${cite(p.pages||[])}\n\n~~~python\n${p.code.trimEnd()}\n~~~\n\n${p.cases?'| Input | Expected output |\n|---|---|\n'+p.cases.map(t=>`| ${t.stdin.trim()} | ${t.stdout.trim()} |`).join('\n'):'**Expected output:**\n\n~~~text\n'+p.stdout.trimEnd()+'\n~~~'}${p.note?'\n\n'+p.note:''}`;}
const generated={chapters:[],notes:[],mcqs:questions,papers:[],excludedMcqIds:excluded.map(q=>q.id),noteSeo:{},documents:[],sourceSha256:hash(JSON.stringify({chapters,modelPaper,workedProject,legacyPapers,alp,legacy}))};
const seo=['SDLC','Python','Algorithms','Structures','Data Analytics','Emerging Tech','Ethics & Safety','Digital Literacy','Entrepreneurship'];
function addNote({id,key,chapter,title,chapterTitle,description,content,seoTitle}){
 const old=legacy.notes.find(n=>n.id===id),url='https://raytechinstitute.com'+pdfBase+key+'.pdf';
 const note={...(old||{}),id,classSlug:'11th-class',subjectSlug:'computer-science',chapterNumber:chapter,chapterTitle,title,description,content,pdfUrl:url,previewPdfUrl:url,actionButtonUrl:url,actionButtonText:'Download ALP Study PDF',downloadCount:old?.downloadCount||0,lastUpdated:'2026-11-27',...(pdfs[key]?{fileSize:Math.ceil(pdfs[key].bytes/1024)+' KB'}:{})};
 generated.notes.push(note);generated.noteSeo[id]=chapter<=2&&key.startsWith('chapter-')?seoTitle.replace('Notes PDF','Notes & MCQs PDF'):seoTitle;
 generated.documents.push({key,title,content,contentSha256:hash(content),kind:'note',id});
}
for(const c of chapters){
 const a=alp.chapters[c.number-1],bank=questions.filter(q=>q.chapterNumber===c.number);
 const exercise=a.excludedExercise;
 const removed=[exercise.mcqs?.length?`MCQs ${exercise.mcqs.join(', ')}`:'',exercise.short?.length?`short questions ${exercise.short.join(', ')}`:'',exercise.long?.length?`long questions ${exercise.long.join(', ')}`:'',exercise.longParts?'long question 1 parts (a) and (c)':''].filter(Boolean).join('; ');
 const parts=['## Exam scope for 2027',scope,`**Chapter ${c.number}: ${a.title}.** Book printed pages ${a.printedPages.join('-')}.`,a.excludedSections.length?`**Excluded sections:** ${a.excludedSections.join(', ')}. A shared printed page may also contain a retained section; the section boundary controls the selection.`:'**All chapter sections are retained.**',removed?`**Deleted textbook exercise items:** ${removed}. These are not included below.`:'All numbered textbook exercise items are retained.','## Retained topic map',...c.topics.map(t=>`- ${t.section}: ${t.title} (printed pages ${t.pages.join(', ')})`)];
 for(const t of c.topics)parts.push(`## ${t.section} ${t.title}`,cite(t.pages),t.notes);
 for(const [name,rows] of [['short',c.short],['long',c.long]]){parts.push(`## Solved retained ${name} questions`);for(const q of rows)parts.push(`### Textbook ${name} ${q.number}. ${q.question}`,q.answer,cite(q.pages));}
 parts.push('## Solved retained exercise MCQs','The prompts below are typed study adaptations. The original exercise numbers are preserved; distractors may be rewritten to remove ambiguity.');
 for(const q of c.exerciseMcqs)parts.push(`### Textbook MCQ ${q.number}. ${q.question}`,`**Answer:** ${q.answer}. ${q.explanation}`);
 for(const issue of c.exerciseIssues||[])parts.push(`### Textbook MCQ ${issue.number}: source issue`,issue.question,issue.answer,cite(issue.pages));
 if(c.programs?.length)parts.push('## Checked programming examples','The following examples were executed with the stated inputs. Their expected outputs are recorded independently of the scanned book.',...c.programs.map(program));
 parts.push('## Independent chapter MCQ practice','Attempt the questions first, then check the separate answer key. These are original revision questions, not an official paper prediction.',...bank.map((q,i)=>showQuestion(q,i)),'## Chapter practice answer key',...bank.map((q,i)=>`${i+1}. **${'ABCD'[q.correctIndex]}.** ${q.explanation}`),sources);
 const id=c.number<=3?`class11-nov12-chapter-${c.number}-study-guide`:`class11-alp2027-chapter-${c.number}-study-guide`;
 addNote({id,key:`chapter-${c.number}`,chapter:c.number,chapterTitle:a.title,title:`Chapter ${c.number}: ${a.title} - ALP 2027 Notes`,description:`Revise ${a.title} with retained-topic notes, solved exercises, explained MCQs and a downloadable Punjab Class 11 ALP 2027 study PDF.`,content:parts.join('\n\n')+'\n',seoTitle:`11th CS Ch ${c.number} ${seo[c.number-1]} Notes PDF`});
 generated.chapters.push({id:`chapter-11th-class-computer-science-${c.number}`,classSlug:'11th-class',subjectSlug:'computer-science',chapterNumber:c.number,title:a.title,description:'Punjab ALP 2027: retained topics, solved exercises and chapter MCQs.',isActive:true});
}
addNote({id:'note-1792667992687',key:'sdlc-worked-project',chapter:1,chapterTitle:alp.chapters[0].title,title:'Attendance System: SDLC Worked Project - Class 11',description:'Apply retained Class 11 SDLC concepts to an attendance project with requirements, planning, risks, testing and a clear revision checklist.',content:scope+'\n\n'+workedProject+'\n\n'+sources,seoTitle:'11th CS SDLC Attendance Project PDF'});
const m=modelPaper;
const model=['## Current 2027 model paper: source and attempt rules',scope,'Questions are typed study adaptations of the supplied PECTAA model paper, PDF pages 47-51. Options remain in the printed order. Worked answers are original study guidance, not an official answer key. The model is a specimen for 2027, not an already conducted past examination.','75 marks; 150 minutes total. Objective: 15 MCQs, 15 marks, 20 minutes. Subjective: 60 marks, 130 minutes. Attempt six short questions from each group (12 marks each) and three of five long questions (8 marks each).','## Objective questions: attempt before checking answers',...m.mcqs.map(([n,q,opts])=>`### Q1(${n}). ${q}\n\n${opts.map((o,i)=>`**${'ABCD'[i]})** ${o}`).join('\n\n')}`)];
for(const group of m.shortGroups)model.push(`## Short question ${group.number}: attempt any ${group.attempt}`,...group.questions.map(([n,q])=>`### Q${group.number}(${n}). ${q}`));
model.push('## Long questions: attempt any three',...m.longQuestions.map(q=>`### Q${q.number}. ${q.question}`),'## Objective worked key',...m.mcqs.map(([n,,opts,k,why,p])=>`### Q1(${n}): ${'ABCD'[k]}. ${opts[k]}\n\n${why}\n\n${cite(p)}`));
for(const group of m.shortGroups)model.push(`## Short question ${group.number}: worked answers`,...group.questions.map(([n,q,a,p])=>`### Q${group.number}(${n}). ${q}\n\n${a}\n\n${cite(p)}`));
model.push('## Long questions: worked answers');
for(const q of m.longQuestions){model.push(`### Q${q.number}. ${q.question}`,q.answer,cite(q.pages));if(q.programId)model.push(program(chapters[q.chapter-1].programs.find(p=>p.id===q.programId)));}
model.push(sources);
addNote({id:'class11-alp2027-model-paper-solutions',key:'model-paper-solutions',chapter:1,chapterTitle:'2027 Model Paper Solutions',title:'Class 11 Computer Science: 2027 Model Paper Solved',description:'Attempt and check all 15 MCQs, 27 short questions and five long questions in the supplied PECTAA 2027 model, with textbook-based worked answers.',content:model.join('\n\n')+'\n',seoTitle:'11th CS Model Paper 2027 Solved PDF'});
for(const p of legacyPapers){
 const index=['## Typed topic index: Group I only','This is a brief topic index, not a full transcription or a substitute for the original paper. The download linked below is the original archive scan, which also contains Group II. Only Group I is indexed and answered here.','### Objective Q1',p.objective.map((t,i)=>`${i+1}. ${t}`).join('\n')];
 p.shortGroups.forEach((rows,i)=>index.push(`### Short Q${i+2}`,rows.map((t,j)=>`${j+1}. ${t}`).join('\n')));
 index.push('### Long questions',p.long.map((t,i)=>`${i+5}. ${t}`).join('\n'));
 const content=['## Legacy paper: compare the course before revising',`Archive-attributed ${p.board}, Annual ${p.year}, Computer Science Part I. This is an OLD-COURSE paper. The archive attribution has not been independently authenticated by the board. It is not a current 2027 course paper.`, `[Open the original four-page archive PDF](${p.sourceUrl}). Group I objective and subjective pages are PDF pages 1-2. The original scan is linked without modification.`,...index,'## Answers supported by the supplied new book','Only the following overlapping concepts have book-supported answers here. Every other indexed item is marked outside the supplied new-book answer set; do not treat an old hardware, networking or Office question as a required 2027 topic.',...p.answers.map(q=>`### ${q.ref}: ${q.title}\n\n${q.answer}\n\n${cite(q.pages)}`),'## Items without a new-book answer','The remaining indexed questions belong to legacy hardware, registers, communication/networking, Windows and Office topics or require more detail than the supplied book provides. Their answers are deliberately not invented. Use the source scan and an appropriate old-course text if studying that syllabus. For current examination preparation, use the ALP-filtered chapter guides and the 2027 model paper.',sources].join('\n\n')+'\n';
 const key=p.key+'-legacy-companion',id='class11-legacy-'+p.key;
 generated.papers.push({id,classSlug:'11th-class',subjectSlug:'computer-science',board:p.board,year:p.year,session:'Annual',pdfUrl:'https://raytechinstitute.com'+pdfBase+key+'.pdf',description:`Legacy-course ${p.year} archive: Group I typed topic index and new-book-supported answers. Original scan linked separately; not a 2027 syllabus paper.`,content});
 generated.documents.push({key,title:`${p.board} ${p.year}: Legacy Paper Study Companion`,content,contentSha256:hash(content),kind:'past-paper',id});
}
const studyBook=generated.notes.slice(0,9).map(n=>`# ${n.title}\n\n${n.content}`).join('\n\n');
generated.documents.push({key:'complete-study-book',title:'Class 11 Computer Science: ALP 2027 Complete Study Book',content:scope+'\n\n'+studyBook,contentSha256:hash(scope+'\n\n'+studyBook),kind:'book'});
const bank=[scope,'## Independent practice: 400 MCQs','Questions are grouped by chapter. Attempt them before consulting the separate explained key.'];
for(const c of chapters){bank.push(`## Chapter ${c.number}: ${alp.chapters[c.number-1].title}`);questions.forEach((q,i)=>{if(q.chapterNumber===c.number)bank.push(showQuestion(q,i));});}
bank.push('## Explained answer key',...questions.map((q,i)=>`${i+1}. **${'ABCD'[q.correctIndex]}.** ${q.explanation}`));
generated.documents.push({key:'400-mcq-bank',title:'Class 11 Computer Science: 400 ALP 2027 MCQs',content:bank.join('\n\n')+'\n',contentSha256:hash(bank.join('\n\n')+'\n'),kind:'mcq-bank',questionsSha256:hash(JSON.stringify(questions))});
await fs.writeFile(root+'/generated.json',JSON.stringify(generated,null,2)+'\n');
await fs.writeFile(root+'/study-map.json',JSON.stringify({examYear:2027,mcqs:questions.length,chapters:generated.notes.slice(0,9).map(n=>({number:n.chapterNumber,title:n.chapterTitle,noteId:n.id,pdf:n.pdfUrl})),downloads:[['Complete study book','complete-study-book'],['400 explained MCQs','400-mcq-bank'],['Solved 2027 model paper','model-paper-solutions']].map(([title,key])=>({title,url:pdfBase+key+'.pdf'}))},null,2)+'\n');
console.log(JSON.stringify({chapters:generated.chapters.length,notes:generated.notes.length,mcqs:questions.length,withheld:excluded.length,legacyPapers:generated.papers.length,documents:generated.documents.length,productionWrites:0}));
