import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {completionModules} from '../content/dit/completion/index.mjs';
import {requiredSections,requiredTerms,mappedSections} from '../content/dit/completion/coverage.mjs';
const data=JSON.parse(await fs.readFile('content/dit/completion/generated.json','utf8'));
const refs=JSON.parse(await fs.readFile('content/dit/completion/legacy-references.json','utf8'));
const pdfs=JSON.parse(await fs.readFile('content/dit/completion/pdf-manifest.json','utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
const normalize=value=>value.toLowerCase().replace(/[^a-z0-9]/g,'');
const compiled=await build({stdin:{contents:`export * from './src/data/staticCatalog'; export * from './src/data/ditCompletion'; export * from './src/utils/dit-study';`,resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,platform:'node',format:'cjs',logLevel:'silent'});
const context={module:{exports:{}},URL};context.exports=context.module.exports;vm.runInNewContext(compiled.outputFiles[0].text,context);const catalog=context.module.exports;

test('every required syllabus section maps to substantive topic notes and named concepts',()=>{
 const missing=[];
 for(const module of completionModules.filter(module=>!module.extra)){
  const mapped=mappedSections(module),text=normalize(module.topics.map(t=>t.notes).join(' '));
  assert.ok(module.topics.reduce((n,t)=>n+t.notes.split(/\s+/).length,0)>=250,module.key+' needs substantive topic notes');
  for(const section of requiredSections[module.key]||[])if(!mapped.has(section))missing.push(module.key+' section '+section);
  for(const term of requiredTerms[module.key]||[])if(!text.includes(normalize(term)))missing.push(module.key+' concept '+term);
  assert.ok(module.short.length>=6&&module.long.length>=2,module.key+' lacks solved written answers');
 }
 assert.deepEqual(missing,[]);
});

test('all listed practical sets are represented without inventing Python entries 30 and 31',()=>{
 const refsFor=filter=>Array.from(new Set(completionModules.filter(filter).flatMap(m=>m.labs.flatMap(l=>l.practicals||[])).filter(value=>typeof value==='number'))).sort((a,b)=>a-b);
 const numbers=n=>Array.from({length:n},(_,i)=>i+1);
 assert.deepEqual(refsFor(m=>m.slug==='dit-python'),numbers(29));
 assert.deepEqual(refsFor(m=>m.slug==='dit-operating-systems'),numbers(25));
 assert.deepEqual(refsFor(m=>m.book==='MS Office'),numbers(60));
 assert.deepEqual(refsFor(m=>m.key==='network-8'),numbers(14));
 assert.deepEqual(refsFor(m=>m.key==='ict-practical'),numbers(33));
 const additional=completionModules.filter(m=>m.slug==='dit-operating-systems').flatMap(m=>m.labs.flatMap(l=>l.practicals||[])).filter(x=>typeof x==='string');
 assert.deepEqual(additional,['Additional a','Additional b','Additional c','Additional d']);
});

test('350 new questions retain their authored correct answers with balanced noncyclic positions',()=>{
 assert.equal(data.mcqs.length,350);assert.equal(new Set(data.mcqs.map(q=>q.id)).size,350);
 const global=[0,0,0,0];
 for(const module of completionModules){
  const raw=module.topics.flatMap(t=>t.questions),actual=data.mcqs.filter(q=>q.id.startsWith('dit-complete-'+module.key+'-q'));
  assert.equal(actual.length,raw.length);
  const positions=[0,0,0,0];actual.forEach((q,i)=>{assert.equal(q.question,raw[i].question);assert.equal(q.options[q.correctIndex],raw[i].answer);assert.equal(q.explanation,raw[i].explanation);assert.equal(new Set(q.options).size,4);positions[q.correctIndex]++;global[q.correctIndex]++;});
  if(actual.length){assert.ok(Math.max(...positions)-Math.min(...positions)<=1);assert.ok(actual.some((q,i)=>q.correctIndex!==i%4),'Correct options must not repeat a simple ABCD cycle');}
 }
 assert.ok(Math.max(...global)-Math.min(...global)<=1);
});

test('all 35 modules have chapter content and new subjects remain DIT-only',()=>{
 const subjects=catalog.buildDitStudySubjects({chapters:catalog.INITIAL_CHAPTERS,notes:catalog.INITIAL_NOTES,mcqs:catalog.INITIAL_MCQS,papers:catalog.INITIAL_PAST_PAPERS});
 assert.deepEqual(Array.from(subjects,s=>s.available),[7,5,8,6,9]);
 assert.deepEqual(Array.from(subjects,s=>s.mcqCount),[488,490,740,132,188]);
 assert.equal(subjects.reduce((n,s)=>n+s.noteCount,0),36);
 assert.equal(new Set(catalog.INITIAL_CHAPTERS.map(c=>[c.classSlug,c.subjectSlug,c.chapterNumber].join(':'))).size,catalog.INITIAL_CHAPTERS.length);
 assert.equal(data.chapters.length,16);assert.equal(data.notes.length,17);
 assert.equal(data.subjects.length,2);assert.ok(data.subjects.every(s=>s.classSlug==='dit-intermediate'));
});

test('twelve upgraded legacy guides retain saved identities, counters and original PDF access',()=>{
 assert.equal(Object.keys(data.replacements).length,12);
 for(const [id,record]of Object.entries(refs)){
  const note=catalog.INITIAL_NOTES.find(n=>n.id===id);assert.ok(note);
  for(const field of ['id','classSlug','subjectSlug','chapterNumber'])assert.equal(note[field],record[field]);
  assert.ok(note.content.includes(record.pdfUrl),'The earlier source/revision PDF must remain linked');
  assert.match(note.pdfUrl,/\/documents\/dit\/complete\//);assert.equal(note.actionButtonUrl,note.pdfUrl);
  assert.equal(catalog.completeDitNote({...note,downloadCount:123}).downloadCount,123);
 }
 const other={id:'unrelated',classSlug:'12th-class',subjectSlug:'physics',chapterNumber:1};assert.equal(catalog.completeDitNote(other),other);
});

test('all 29 new PDF guides match final web content, file bytes and source identity',async()=>{
 assert.equal(Object.keys(pdfs).length,29);
 for(const module of data.modules){
  const note=data.replacements[module.noteId]||data.notes.find(n=>n.id===module.noteId),pdf=pdfs[module.key];
  assert.equal(hash(note.content),module.contentSha256);assert.equal(pdf.contentSha256,module.contentSha256);
  const bytes=await fs.readFile('public'+pdf.url);assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert.equal(bytes.length,pdf.bytes);assert.equal(hash(bytes),pdf.sha256);
  const source=completionModules.find(m=>m.key===module.key);assert.equal(hash(JSON.stringify(source)),module.sourceSha256);
  assert.ok(note.content.includes('## Independent practice test'));assert.ok(note.content.includes('## Practice test key'));
  const practice=note.content.split('## Independent practice test')[1].split('## Practice test key')[0];assert.ok(!practice.includes('**Answer:'));
 }
});

test('five complete study books retain every reviewed chapter PDF and usable file bytes',async()=>{
 const books=JSON.parse(await fs.readFile('content/dit/completion/study-books.generated.json','utf8'));
 assert.deepEqual(books.map(book=>book.chapters),[7,5,8,6,9]);assert.deepEqual(books.map(book=>book.guides),[8,5,8,6,9]);
 for(const book of books){
  assert.equal(book.pages,1+book.sources.reduce((n,s)=>n+s.pages,0));
  assert.equal(new Set(book.sources.filter(s=>!s.extra).map(s=>s.module)).size,book.chapters);
  const bytes=await fs.readFile('public'+book.url);assert.equal(bytes.length,book.bytes);assert.equal(hash(bytes),book.sha256);
  for(const source of book.sources)assert.equal(hash(await fs.readFile('public'+source.url)),source.sha256);
 }
});

test('checked programs and downloadable solution archive match the final Python sources',async()=>{
 const stable=value=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])])):value;
 const sourceHash=hash(JSON.stringify(stable(completionModules.filter(m=>m.slug==='dit-python'))));
 const report=JSON.parse(await fs.readFile('content/dit/completion/program-verification.generated.json','utf8'));
 const download=JSON.parse(await fs.readFile('content/dit/completion/practical-download.generated.json','utf8'));
 assert.equal(report.pythonSourceSha256,sourceHash);assert.equal(download.pythonSourceSha256,sourceHash);
 assert.equal(report.checks.length,76);assert.equal(report.checks.filter(c=>c.mode==='headless-turtle-geometry').length,5);
 assert.deepEqual([...report.numberedPracticals].sort((a,b)=>a-b),Array.from({length:29},(_,i)=>i+1));
 const archive=await fs.readFile('public'+download.url);assert.equal(hash(archive),download.sha256);assert.equal(archive.length,download.bytes);assert.equal(archive.subarray(0,2).toString(),'PK');
 assert.equal(download.numberedSolutions,29);assert.equal(download.additionalExcelExample,1);
});
