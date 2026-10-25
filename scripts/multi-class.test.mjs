import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadTypescript} from './load-typescript.mjs';
const {buildStudyLinks}=await loadTypescript('src/utils/study-links.ts');
const {adminStudyContext}=await loadTypescript('src/utils/admin-study-context.ts');
const {resolveClassTitle}=await loadTypescript('supabase/functions/_shared/class-context.ts');
const {BRAND_DESCRIPTION}=await loadTypescript('src/data/brand.ts');
const {buildDocumentDescription}=await loadTypescript('src/utils/seo.ts');
const classes=[{id:'nine',slug:'9th-class',title:'Class 9',numericGrade:9,isActive:true},{id:'eleven',slug:'11th-class',title:'Class 11 (First Year)',numericGrade:11,isActive:true},{id:'hidden',slug:'hidden',title:'Hidden',numericGrade:1,isActive:false}];
const subjects=[{id:'physics',slug:'physics',title:'Physics',classSlug:'9th-class'},{id:'cs',slug:'computer-science',title:'Computer Science',classSlug:'11th-class'},{id:'orphan',slug:'orphan',title:'Orphan',classSlug:'missing'}];
const gazettes=[{id:'gazette-9',title:'Class 9 result gazette',classSlug:'9th-class'}];

test('study shortcuts adapt to new classes, subjects, removals and active state without article links',()=>{
 const links=buildStudyLinks(classes,subjects,gazettes);
 for(const route of ['notes','mcqs','past-papers'])assert.ok(links.some(l=>l.href===`/classes/9th-class/physics/${route}/`));
 assert.ok(links.some(l=>l.href==='/results-gazettes/gazette-9/'));
 assert.ok(!links.some(l=>/hidden|orphan|blogs|articles/.test(l.href)));
 assert.equal(new Set(links.map(l=>l.href)).size,links.length);
 const added={id:'seven',slug:'7th-class',title:'Class 7',numericGrade:7,isActive:true};
 assert.equal(buildStudyLinks([...classes,added],subjects)[0].href,'/classes/7th-class/');
 assert.ok(buildStudyLinks(classes,subjects.filter(s=>s.id!=='physics')).every(l=>!l.href.includes('/physics/')));
 assert.deepEqual(buildStudyLinks([],subjects,gazettes),[]);
});
test('admin task context uses only matching classes and subjects and preserves an existing selection',()=>{
 assert.deepEqual(adminStudyContext(classes,subjects,'?class=9th-class&subject=physics'),{classSlug:'9th-class',subjectSlug:'physics'});
 assert.deepEqual(adminStudyContext(classes,subjects,'?class=9th-class&subject=computer-science'),{classSlug:'9th-class',subjectSlug:'physics'});
 assert.equal(adminStudyContext(classes,subjects,'?class=missing').classSlug,'9th-class');
 assert.equal(adminStudyContext(classes,subjects,'?class=9th-class','11th-class','computer-science').classSlug,'11th-class');
 assert.deepEqual(adminStudyContext([],subjects),{classSlug:'',subjectSlug:''});
});
test('AI class naming resolves the actual new class instead of defaulting to 12th',async()=>{
 const title=await resolveClassTitle('9th-class','https://db.test','private',async url=>{assert.equal(new URL(url).searchParams.get('slug'),'eq.9th-class');return Response.json([{title:'Class 9'}]);});assert.equal(title,'Class 9');
 assert.equal(await resolveClassTitle('7th-class','',''),'7th Class');
 assert.equal(await resolveClassTitle('','',''),'Selected class');
});
test('general branding is class-neutral while class-specific content remains intact',async()=>{
 assert.ok(BRAND_DESCRIPTION.length>=120&&BRAND_DESCRIPTION.length<=155);
 for(const file of ['src/components/Header.tsx','src/components/Footer.tsx','src/components/Hero.tsx','src/app/layout.tsx','src/app/classes/page.tsx','src/app/admin/page.tsx'])assert.doesNotMatch(await fs.readFile(file,'utf8'),/11th|12th|1st.year|2nd.year/i,file);
 assert.match(await fs.readFile('src/data/educationalData.ts','utf8'),/11th-class/);
});
test('short and long new class/subject labels cannot break MCQ search metadata',()=>{
 for(const label of ['Class 9 Physics MCQs','A B MCQs','11th Class Physics MCQs','Long class and subject '.repeat(30)]){
  const description=buildDocumentDescription('Choose a chapter, practise one question at a time and review your answers and score after submitting the test.',label);
  assert.ok(description.length>=120&&description.length<=155);
 }
});
test('admin launcher renders validated class/subject links and clear empty guidance',async()=>{
 const require=createRequire(import.meta.url),module={exports:{}};
 const code=ts.transpileModule(await fs.readFile('src/components/admin/StudyTaskLauncher.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,URLSearchParams,require:id=>id==='next/link'?{default:({children,...props})=>React.createElement('a',props,children)}:require(id)});
 const html=renderToStaticMarkup(React.createElement(module.exports.StudyTaskLauncher,{classes,subjects}));
 assert.match(html,/\/admin\/notes\/\?class=9th-class&amp;subject=physics/);
 assert.match(html,/\/admin\/mcqs\/\?class=9th-class&amp;subject=physics/);
 assert.match(renderToStaticMarkup(React.createElement(module.exports.StudyTaskLauncher,{classes:[],subjects:[]})),/adding a class/);
});
