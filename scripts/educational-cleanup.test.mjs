import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {loadTypescript} from './load-typescript.mjs';
const require=createRequire(import.meta.url);
async function component(file){const result=await build({entryPoints:[file],bundle:true,write:false,jsx:'automatic',platform:'node',format:'cjs',external:['react','react/jsx-runtime','next/link']});const module={exports:{}};vm.runInNewContext(result.outputFiles[0].text,{module,exports:module.exports,URL,Intl,Date,require:id=>id==='next/link'?{__esModule:true,default:({children,prefetch,...props})=>React.createElement('a',props,children)}:require(id)});return module.exports;}
const {lectureSummary,canonicalLectureText}=await loadTypescript('src/utils/lecture-summary.ts');
const {lectureSnapshot}=await loadTypescript('src/data/lectureSnapshot.ts');
const {courseStructuredData}=await loadTypescript('src/utils/course-schema.ts');
test('all recorded lecture cards have bounded clean summaries and no promotional boilerplate',()=>{
 for(const lecture of lectureSnapshot){const text=lectureSummary(lecture);assert.ok(text.length>0&&text.length<=180,lecture.id);assert.doesNotMatch(text,/https?:|web\.app|#[\p{L}\p{N}_-]+|\bsubscribe\b/iu);}
 const lesson={title:'Values',description:'A string looks like text and stores characters.\nLike, share and subscribe!\n#Python https://raytechinstitute.web.app/',keyConcepts:[]};
 assert.equal(lectureSummary(lesson),'A string looks like text and stores characters.');
 assert.equal(canonicalLectureText('See https://raytechinstitute.web.app/classes/'),'See https://raytechinstitute.com/classes/');
});
test('server-rendered shortcuts contain only one copy and each link remains keyboard accessible',async()=>{
 const {StudyResourceStrip}=await component('src/components/StudyResourceStrip.tsx');
 const links=[{id:'a',href:'/classes/',label:'Classes'},{id:'b',href:'/learn/python/',label:'Python'},{id:'copy',href:'/classes/',label:'Duplicate'}];
 const document=new JSDOM(renderToStaticMarkup(React.createElement(StudyResourceStrip,{links}))).window.document;
 assert.equal(document.querySelectorAll('.study-strip-group').length,1);assert.equal(document.querySelectorAll('a').length,2);assert.equal(document.querySelectorAll('[aria-hidden],a[tabindex="-1"]').length,0);
});
test('resource summaries show recorded dates and publisher without invented faculty attribution',async()=>{
 const {StudySummary}=await component('src/components/StudySummary.tsx');
 for(const props of [{summary:'Python names refer to values.',lastUpdated:'2026-11-27'},{summary:'Python names refer to values.',version:1}]){
 const document=new JSDOM(renderToStaticMarkup(React.createElement(StudySummary,props))).window.document;
 assert.equal(document.querySelector('h2').textContent,'Quick summary');assert.ok(document.body.textContent.includes(props.summary));assert.ok(document.body.textContent.includes('Published by RayTech Institute'));assert.doesNotMatch(document.body.textContent,/Reviewed by|Faculty/);
 assert.equal(document.querySelectorAll('time').length,props.lastUpdated?1:0);
 }
});
test('course schema describes only the visible course and linked learning resources',()=>{
 const schema=courseStructuredData('Python','Python practice','https://raytechinstitute.com/learn/python/',[{name:'Values',url:'https://raytechinstitute.com/learn/python/values/',type:'LearningResource'}]);
 assert.equal(schema['@type'],'Course');assert.equal(schema.hasPart.length,1);assert.equal(schema.provider.name,'RayTech Institute');assert.ok(!('aggregateRating' in schema));assert.ok(!('dateModified' in schema));
});
test('Python reference tables have captions, headers and source links',async()=>{
 const {LessonReference}=await component('src/components/learning/LessonReference.tsx');
 for(const topicId of ['authored-python-002','authored-python-004']){
 const document=new JSDOM(renderToStaticMarkup(React.createElement(LessonReference,{topicId}))).window.document;
 assert.equal(document.querySelectorAll('table').length,1);assert.ok(document.querySelector('caption').textContent);assert.equal(document.querySelectorAll('th[scope="col"]').length,3);assert.equal(document.querySelectorAll('a[href^="https://docs.python.org/"]').length,2);
 }
});
