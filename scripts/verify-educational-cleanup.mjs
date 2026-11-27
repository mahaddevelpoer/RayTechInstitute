import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {loadTypescript} from './load-typescript.mjs';
const {INITIAL_NOTES,INITIAL_PAST_PAPERS}=await loadTypescript('src/data/staticCatalog.ts');
const {LEARNING_TOPICS,LEARNING_LANGUAGES,LEARNING_COURSES}=await loadTypescript('src/data/learningCatalog.ts');
const read=async route=>new JSDOM(await fs.readFile('out'+route+'index.html','utf8')).window.document;
const home=await read('/');assert.equal(home.querySelectorAll('h1').length,1);assert.equal(home.querySelectorAll('.study-strip-group').length,1);
const urls=[...home.querySelectorAll('.study-resource-strip a')].map(a=>a.getAttribute('href'));assert.equal(urls.length,new Set(urls).size);
const summaries=[...home.querySelectorAll('[data-lecture-summary]')];assert.ok(summaries.length>=1);for(const p of summaries){assert.ok(p.textContent.length<=180);assert.ok(p.classList.contains('line-clamp-2'));assert.doesNotMatch(p.textContent,/https?:|web\.app|\bsubscribe\b/i);}assert.doesNotMatch(home.body.textContent,/raytechinstitute\.web\.app/i);
let notes=0,papers=0,python=0;
const slug=id=>id.toLowerCase().replace(/[^a-z0-9]+/g,'-');
function schemas(document){return [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(s=>{const value=JSON.parse(s.textContent);return value['@graph']||[value]});}
for(const note of INITIAL_NOTES){const document=await read(`/classes/${note.classSlug}/${note.subjectSlug}/notes/${slug(note.id)}/`);assert.equal(document.querySelectorAll('[data-study-summary]').length,1);assert.equal(document.querySelectorAll('h1').length,1);assert.ok(schemas(document).some(s=>s['@type']==='LearningResource'));if(/^\d{4}-\d{2}-\d{2}$/.test(note.lastUpdated))assert.equal(document.querySelector('[data-study-summary] time')?.dateTime,note.lastUpdated);notes++;}
for(const paper of INITIAL_PAST_PAPERS){const document=await read(`/classes/${paper.classSlug}/${paper.subjectSlug}/past-papers/${slug(paper.id)}/`);assert.equal(document.querySelectorAll('[data-study-summary]').length,1);assert.ok(schemas(document).some(s=>s['@type']==='LearningResource'));papers++;}
for(const topic of LEARNING_TOPICS.filter(t=>t.languageId==='python')){const document=await read(`/learn/python/${topic.slug}/`);assert.equal(document.querySelectorAll('[data-study-summary]').length,1);assert.ok(document.querySelector('[data-study-summary]').textContent.includes(topic.summary));assert.ok(schemas(document).some(s=>s['@type']==='LearningResource'));if(['authored-python-002','authored-python-004'].includes(topic.id))assert.ok(document.querySelector('table caption'));python++;}
for(const language of LEARNING_LANGUAGES){const document=await read(`/learn/${language.slug}/`);assert.ok(schemas(document).some(s=>s['@type']==='Course'));}
for(const course of LEARNING_COURSES){const document=await read(`/courses/${course.slug}/`);assert.ok(schemas(document).some(s=>s['@type']==='Course'));}
const llms=await fs.readFile('out/llms.txt','utf8');let llmsLinks=0;for(const match of llms.matchAll(/\]\((https:[^)]+)\)/g)){const url=new URL(match[1]);assert.equal(url.origin,'https://raytechinstitute.com');assert.ok(!url.pathname.startsWith('/blogs/'));await fs.access('out'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));llmsLinks++;}assert.ok(llmsLinks>=10);
const report={homeH1:1,shortcutGroups:1,shortcutLinks:urls.length,cleanLectureCards:summaries.length,notes,papers,pythonLessons:python,courseSchemas:LEARNING_COURSES.length+LEARNING_LANGUAGES.length,llmsLinks};await fs.mkdir('artifacts/educational-cleanup',{recursive:true});await fs.writeFile('artifacts/educational-cleanup/checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
