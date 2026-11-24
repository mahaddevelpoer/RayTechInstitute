// Local source preparation only. Does not connect to a database or publish.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {completionModules} from '../content/dit/completion/index.mjs';
const root='content/dit/completion';
const qa=path.resolve(process.env.DIT_COMPLETION_QA||'D:/raytech-dit-completion/qa');
await fs.mkdir(qa,{recursive:true});await fs.mkdir('public/documents/dit/complete',{recursive:true});
const compiled=await build({entryPoints:['src/data/academicResourceSnapshot.ts'],bundle:true,write:false,platform:'node',format:'cjs',logLevel:'silent'});
const context={module:{exports:{}},URL};context.exports=context.module.exports;vm.runInNewContext(compiled.outputFiles[0].text,context);
const previous=context.module.exports;
const legacyPath=`${root}/legacy-references.json`;
const legacyReferences=JSON.parse(await fs.readFile(legacyPath,'utf8').catch(()=> '{}'));
for(const item of completionModules.filter(item=>item.legacyNoteId))if(!legacyReferences[item.legacyNoteId]){
 const original=previous.INITIAL_NOTES.find(note=>note.id===item.legacyNoteId);
 if(!original)throw Error('Original legacy note missing');
 legacyReferences[item.legacyNoteId]={id:original.id,classSlug:original.classSlug,subjectSlug:original.subjectSlug,chapterNumber:original.chapterNumber,title:original.title,pdfUrl:original.pdfUrl};
}
await fs.writeFile(legacyPath,JSON.stringify(legacyReferences,null,2)+'\n');
const syllabus=JSON.parse(await fs.readFile('content/dit/semester-one.json','utf8'));
const sha=value=>createHash('sha256').update(value).digest('hex');
const generated={subjects:[{id:'subject-dit-operating-systems',classSlug:'dit-intermediate',slug:'dit-operating-systems',title:'Operating Systems',iconName:'Monitor',description:'PBTE DIT first-semester OS study guides, five-state processes, Windows lab procedures, server roles and chapter practice.'},{id:'subject-dit-python',classSlug:'dit-intermediate',slug:'dit-python',title:'Introduction to Programming',iconName:'Code',description:'PBTE DIT first-semester Python: nine chapter guides, worked examples, explained MCQs and all 29 listed programming practicals.'}],chapters:[],notes:[],replacements:{},mcqs:[],modules:[]};
const allIds=new Set();
function showQuestion(question,index,reveal){
 const options=question.options.map((value,i)=>`${String.fromCharCode(65+i)}) ${value}`).join('\n\n');
 return `### Q${index+1}. ${question.question}\n\n${question.codeSnippet?'~~~python\n'+question.codeSnippet+'\n~~~\n\n':''}${options}${reveal?'\n\n**Answer: '+String.fromCharCode(65+question.correctIndex)+'.** '+question.explanation:''}`;
}
for(const item of completionModules){
 if(allIds.has(item.key))throw Error('Duplicate module key');allIds.add(item.key);
 const fresh=[];
 const rawCount=item.topics.reduce((count,topic)=>count+topic.questions.length,0);
 const positions=Array.from({length:rawCount},(_,i)=>({value:(generated.mcqs.length+i)%4,key:sha(item.key+':option:'+i)})).sort((a,b)=>a.key.localeCompare(b.key)).map(row=>row.value);
 for(const topic of item.topics)for(const raw of topic.questions){
  if(raw.wrong.length!==3||new Set([raw.answer,...raw.wrong]).size!==4||!raw.explanation)throw Error('Invalid question in '+item.key);
  const index=fresh.length,correctIndex=positions[index],options=[...raw.wrong];options.splice(correctIndex,0,raw.answer);
  fresh.push({id:`dit-complete-${item.key}-q${String(index+1).padStart(3,'0')}`,classSlug:'dit-intermediate',subjectSlug:item.slug,chapterNumber:item.chapter,topic:`${topic.code} ${topic.title}`,question:raw.question,options,correctIndex,explanation:raw.explanation,...(raw.code?{codeSnippet:raw.code}:{})});
 }
 let questions=fresh;
 if(item.reuseMcqs||item.extra){
  const bank=previous.INITIAL_MCQS.filter(q=>q.classSlug==='dit-intermediate'&&q.subjectSlug===item.slug&&q.chapterNumber===item.chapter);
  const count=Math.min(item.reuseMcqs||20,bank.length);
  if(count<10)throw Error('Missing legacy chapter source: '+item.key);
  questions=Array.from({length:count},(_,i)=>bank[Math.floor(i*bank.length/count)]);
 }
 const old=item.legacyNoteId?previous.INITIAL_NOTES.find(n=>n.id===item.legacyNoteId):undefined;
 if(item.legacyNoteId&&!old)throw Error('Legacy note identity missing: '+item.legacyNoteId);
 const id=item.noteId||item.legacyNoteId||`dit-complete-${item.key}-study-guide`;
 const pdfUrl=`https://raytechinstitute.com/documents/dit/complete/${item.key}-study-guide.pdf`;
 const metadata=JSON.parse(await fs.readFile(`${root}/pdf-manifest.json`,'utf8').catch(()=> '{}'))[item.key]||{};
 const parts=['## Study guide and syllabus coverage',`This original study guide follows the PBTE two-year DIT first-semester ${item.subject} course outline, ${item.extra?'practical list':`Module ${item.module}`}, pages ${item.pages}. Use the theory, solved answers and practical checklist together. Revision questions are learning material, not authenticated past papers or guaranteed examination questions.`,...(item.practicalNumbering?[item.practicalNumbering]:[]),'## Topic map',...item.topics.map(topic=>`- ${topic.code}: ${topic.title}`)];
 const diagrams={'os-3':['Simplified five-state process transitions','process-states.svg'],'network-5':['OSI and the four-layer TCP/IP teaching view','network-models.svg'],'network-8':['Isolated two-subnet router lab','routed-lab.svg']};
 if(diagrams[item.key])parts.push(`![${diagrams[item.key][0]}](/documents/dit/complete/diagrams/${diagrams[item.key][1]})`);
 for(const topic of item.topics)parts.push(`## ${topic.code} ${topic.title}`,item.key==='python-9'?topic.notes.replaceAll('~~~python\n','~~~python-desktop\n'):topic.notes);
 parts.push('## Solved short questions',...item.short.map(([question,answer],i)=>`### ${i+1}. ${question}\n\n${answer}`),'## Solved long questions',...item.long.map(([question,answer],i)=>`### ${i+1}. ${question}\n\n${answer}`),'## Practical workbook');
 for(const exercise of item.labs){
  parts.push(`### ${exercise.title}`,exercise.practicals?`${item.extra?'Workbook item references':'Course practical references'}: ${exercise.practicals.join(', ')}.`:'Original additional practice.',exercise.environment?.startsWith('desktop')?'Environment: desktop Python with the stated GUI/packages. The browser-only compiler does not provide every desktop feature.':'Perform configuration/physical work only in the instructor-authorised lab. Record the actual observed result.',exercise.steps.map((step,i)=>`${i+1}. ${step}`).join('\n'));
  if(exercise.code)parts.push(`~~~${exercise.environment?.startsWith('desktop')?'python-desktop':'python'}\n${exercise.code}\n~~~`);
  parts.push(`**Expected result:** ${exercise.expected}`);
  if(exercise.stdout)parts.push('~~~text\n'+exercise.stdout.trimEnd()+'\n~~~');
  if(exercise.tests)parts.push('Example test cases:\n\n| Input | Expected output |\n|---|---|\n'+exercise.tests.map(test=>`| ${test.stdin.trim().replaceAll('\n',', ')} | ${test.stdout.trim().replaceAll('\n','; ')} |`).join('\n'));
 }
 parts.push('## Revision questions and answer guidance',item.reuseMcqs||item.extra?'This selection reuses questions from the existing chapter practice bank. The full bank remains available on the website.':'These original questions include one correct option and a reason for each answer.',...questions.map((question,index)=>showQuestion(question,index,true)));
 const practice=Array.from({length:Math.min(10,questions.length)},(_,i)=>questions[Math.floor(i*questions.length/Math.min(10,questions.length))]);
 parts.push('## Independent practice test','Attempt these questions before reading the key. They revisit selected revision questions. This is a learning format, not an official board paper pattern.',...practice.map((question,index)=>showQuestion(question,index,false)),'## Practice test key',...practice.map((question,index)=>`${index+1}. **${String.fromCharCode(65+question.correctIndex)}.** ${question.explanation}`),'## Sources and further study',`- [PBTE official first-semester course outline, pages ${item.pages}](${syllabus.sourceUrl})`,...item.sources.map(([name,url])=>`- [${name}](${url})`));
 if(old)parts.push(`- [Earlier chapter revision PDF](${legacyReferences[old.id].pdfUrl})`);
 if(item.slug==='dit-python')parts.push('## Download the practical solutions','[Download the Python practical solutions ZIP](/documents/dit/complete/python-practical-solutions.zip). GUI tasks require desktop Turtle/Tk; Excel tasks need pandas/openpyxl.');
 parts.push('## Continue studying','[Choose a DIT subject and chapter](/classes/dit-intermediate/). Study every mapped topic and keep your instructor-checked lab evidence. Verified board past papers, when available, are a separate resource.');
 const content=parts.join('\n\n')+'\n';
 const note={...(old||{}),id,classSlug:'dit-intermediate',subjectSlug:item.slug,chapterNumber:item.chapter,chapterTitle:item.title,title:`${item.title}: DIT ${item.extra?'Practical Workbook':'Study Guide'}`,description:`Study ${item.title} with topic notes, solved questions, revision practice and assessed lab instructions for PBTE DIT Semester 1.`,pdfUrl,previewPdfUrl:pdfUrl,actionButtonUrl:pdfUrl,actionButtonText:'Download Study Guide PDF',fileSize:metadata.bytes?`${Math.ceil(metadata.bytes/1024)} KB`:undefined,downloadCount:old?.downloadCount||0,lastUpdated:'2026-11-24',content};
 if(old)generated.replacements[old.id]=note;else generated.notes.push(note);
 if(!item.legacyNoteId&&!item.extra)generated.chapters.push({id:`chapter-dit-complete-${item.key}`,classSlug:'dit-intermediate',subjectSlug:item.slug,chapterNumber:item.chapter,title:item.title,isActive:true,...(item.book?{bookTitle:item.book,displayChapterNumber:item.module}:{}),description:`PBTE first-semester Module ${item.module}: syllabus-aligned notes, revision questions and lab exercises.`});
 generated.mcqs.push(...fresh);
 const record={key:item.key,noteId:id,title:item.title,subject:item.subject,slug:item.slug,module:item.module,chapter:item.chapter,extra:!!item.extra,legacy:!!old,pages:item.pages,topics:item.topics.map(topic=>({code:topic.code,title:topic.title})),newQuestions:fresh.length,guideQuestions:questions.length,labs:item.labs.length,sourceSha256:sha(JSON.stringify(item)),contentSha256:sha(content),pdf:metadata};
 generated.modules.push(record);
 await fs.writeFile(path.join(qa,item.key+'.md'),content);
}
if(generated.chapters.length!==16||Object.keys(generated.replacements).length!==12)throw Error('Completion chapter identity totals changed unexpectedly');
await fs.writeFile(`${root}/generated.json`,JSON.stringify(generated,null,2)+'\n');
await fs.writeFile(path.join(qa,'authored-modules.json'),JSON.stringify(completionModules,null,2));
console.log(JSON.stringify({newChapters:generated.chapters.length,updatedLegacyGuides:Object.keys(generated.replacements).length,additionalWorkbook:1,newQuestions:generated.mcqs.length,newNotes:generated.notes.length,qa,productionWrites:0}));
