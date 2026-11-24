import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {loadTypescript} from './load-typescript.mjs';
const {buildStudyDirectory,hasStudyResources,matchesStudySearch,matchingStudyChapters}=await loadTypescript('src/utils/study-directory.ts');
const catalog=await loadTypescript('src/data/staticCatalog.ts');
const input={classes:catalog.INITIAL_CLASSES,subjects:catalog.INITIAL_SUBJECTS,chapters:catalog.INITIAL_CHAPTERS,notes:catalog.INITIAL_NOTES,mcqs:catalog.INITIAL_MCQS,papers:catalog.INITIAL_PAST_PAPERS};
const directory=buildStudyDirectory(input);

test('every published resource remains reachable and counts retain the class/subject/chapter boundaries',()=>{
 for(const type of ['notes','mcqs','papers']) for(const record of input[type]) {
  if(!input.classes.some(c=>c.slug===record.classSlug&&c.isActive)||!input.subjects.some(s=>s.classSlug===record.classSlug&&s.slug===record.subjectSlug))continue;
  const subject=directory.find(s=>s.classSlug===record.classSlug&&s.slug===record.subjectSlug);assert.ok(subject,record.id);assert.ok(subject[type]>0);
  if(type!=='papers')assert.ok(subject.chapters.some(c=>c.number===record.chapterNumber&&c[type]>0),record.id);
 }
 for(const subject of directory)for(const type of ['notes','mcqs','papers'])assert.equal(subject[type],input[type].filter(r=>r.classSlug===subject.classSlug&&r.subjectSlug===subject.slug).length);
 const ict=directory.find(s=>s.slug==='dit-ict');if(ict){assert.equal(ict.mcqs,488);assert.equal(ict.notes,8);assert.equal(ict.chapters.length,7);}
 assert.equal(catalog.INITIAL_MCQS.filter(q=>q.subjectSlug==='dit-ict').length,488,'Reviewed ICT bank remains intact even in a seed-only checkout');
});

test('subjects in inactive classes, duplicates and unknown parents cannot become available search destinations',()=>{
 const small={classes:[{id:'a',slug:'a',title:'Active',numericGrade:11,isActive:true},{id:'b',slug:'b',title:'Inactive',numericGrade:12,isActive:false}],subjects:[{id:'s',classSlug:'a',slug:'s',title:'Science',description:''},{id:'duplicate',classSlug:'a',slug:'s',title:'Science',description:''},{id:'b',classSlug:'b',slug:'s',title:'Hidden'},{id:'c',classSlug:'missing',slug:'s',title:'Orphan'}],chapters:[],notes:[{classSlug:'a',subjectSlug:'s',chapterNumber:4,chapterTitle:'Recovered chapter'}],mcqs:[],papers:[]};
 const result=buildStudyDirectory(small);assert.equal(result.length,1);assert.equal(result[0].chapters[0].number,4);assert.equal(result[0].chapters[0].title,'Recovered chapter');assert.equal(hasStudyResources(result[0],'notes'),true);assert.equal(hasStudyResources(result[0],'mcqs'),false);
});

test('class and topic searches select relevant chapters without exposing quiz answers',()=>{
 const ict={id:'dit/ict',classSlug:'dit-intermediate',classTitle:'D.I.T (2-Year)',grade:13,program:'',slug:'dit-ict',title:'Introduction to ICT',description:'',notes:2,mcqs:2,papers:0,chapters:[{number:1,title:'Computer Networks',label:'Chapter 1: Computer Networks',topics:['Network topology'],notes:1,mcqs:1},{number:2,title:'Microsoft Office',label:'Chapter 2: Microsoft Office',topics:['Spreadsheets'],notes:1,mcqs:1}]};
 assert.equal(matchesStudySearch(ict,'DIT ICT'),true);assert.equal(matchesStudySearch(ict,'not-a-real-topic-915324'),false);
 assert.equal(matchesStudySearch({...ict,title:'Computer Science',description:'Introduction to ICT has its own subject page.'},'DIT ICT'),false,'Cross-references in descriptions must not turn another subject into an ICT search hit');
 assert.equal(matchesStudySearch({...ict,title:'Computer Science',chapters:[{...ict.chapters[0],title:'PowerPoint',label:'MS Office Chapter 4',topics:['Shapes and Picture Formatting']}]},'DIT ICT'),false,'ICT must not match the middle of Picture');
 if(directory.some(s=>s.slug==='dit-ict'))assert.deepEqual(directory.filter(s=>matchesStudySearch(s,'DIT ICT')).map(s=>s.slug),['dit-ict']);
 const networking=ict;assert.equal(matchesStudySearch(networking,'network topology'),true);
 const matches=matchingStudyChapters(networking,'network topology');assert.equal(matches.length,1);assert.equal(matches[0].number,1);
 assert.equal(matchesStudySearch(ict,'<script>alert(1)</script>'),false);
 const text=JSON.stringify(directory);assert.doesNotMatch(text,/"(?:question|options|correctIndex|explanation|codeSnippet|pdfUrl|content)":/);
});

test('committed navigation is fresh, compact and never loads full publication records into the public shell',async()=>{
 const navigation=JSON.parse(await fs.readFile('src/data/studyNavigation.json','utf8'));assert.deepEqual(navigation.directory,directory);
 assert.ok(Buffer.byteLength(JSON.stringify(navigation))<100000);
 for(const file of ['src/components/Header.tsx','src/components/StudyResourceStrip.tsx'])assert.doesNotMatch(await fs.readFile(file,'utf8'),/from\s+['"]@\/data\/(?:staticCatalog|staticOverrides|educationalStore)/);
 for(const link of navigation.links){const parts=link.href.split('/').filter(Boolean);if(parts.length!==4||parts[0]!=='classes')continue;const subject=directory.find(s=>s.classSlug===parts[1]&&s.slug===parts[2]);assert.ok(subject);assert.ok(hasStudyResources(subject,parts[3]==='past-papers'?'papers':parts[3]),link.href);}
});

test('academic-only client snapshot preserves every practice question and resource identity without article bodies',async()=>{
 const snapshot=await loadTypescript('src/data/academicResourceSnapshot.ts');
 assert.deepEqual(Object.keys(snapshot).sort(),['INITIAL_CHAPTERS','INITIAL_CLASSES','INITIAL_GAZETTES','INITIAL_MCQS','INITIAL_NOTES','INITIAL_PAST_PAPERS','INITIAL_SUBJECTS'].sort());
 const normalize=value=>JSON.parse(JSON.stringify(value).replace(/\u2014/g,'-'));
 assert.deepEqual(snapshot.INITIAL_MCQS,normalize(catalog.INITIAL_MCQS));
 for(const [key,records] of [['INITIAL_NOTES',catalog.INITIAL_NOTES],['INITIAL_PAST_PAPERS',catalog.INITIAL_PAST_PAPERS],['INITIAL_GAZETTES',catalog.INITIAL_GAZETTES]]){
  assert.deepEqual(snapshot[key],normalize(records.map(({content,...summary})=>summary)));
 }
});
