import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {loadTypescript} from './load-typescript.mjs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url);
const catalog=await loadTypescript('src/data/learningCatalog.ts');
const seo=await loadTypescript('src/utils/seo.ts');
const social=await loadTypescript('src/utils/social-metadata.ts');
const learningSeo=await loadTypescript('src/utils/learning-seo.ts');
const channel=await loadTypescript('src/data/channel.ts');
const origin='https://raytechinstitute.web.app';
async function page(file){
 const module={exports:{}};
 const mocks={
  '@/data/learningCatalog':catalog,'@/utils/seo':seo,'@/utils/social-metadata':social,
  '@/data/channel':channel,'@/utils/security':{sanitizeUrl:value=>value},'next/link':{default:({children,...props})=>React.createElement('a',props,children)},
  '@/utils/learning-seo':learningSeo,'@/lib/site':{siteUrl:path=>origin+path},
  '@/lib/learning/pages':{topicRouteParams:()=>[],findTopicPage:params=>{const language=catalog.LEARNING_LANGUAGES.find(l=>l.slug===params.languageSlug);return{language,topic:catalog.LEARNING_TOPICS.find(t=>t.languageId===language?.id&&t.slug===params.topicSlug)}}},
 };
 const code=ts.transpileModule(await fs.readFile(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,process:{env:{}},URL,require:id=>id in mocks?mocks[id]:id.startsWith('@/')?{}:require(id)});
 return module.exports;
}

test('the actual lesson, quiz and course generators have distinct bounded metadata and correct share URLs',async()=>{
 const lesson=await page('src/app/learn/[languageSlug]/[topicSlug]/page.tsx');
 const quiz=await page('src/app/learn/[languageSlug]/[topicSlug]/quiz/page.tsx');
 const course=await page('src/app/courses/[courseSlug]/page.tsx');
 const titles=new Set(),descriptions=new Set();
 const check=meta=>{
  assert.ok(meta.title.trim().length>0&&!meta.title.includes('…'),meta.title);
  assert.ok(meta.description.trim().length>0&&!meta.description.endsWith('…'),meta.description);
  assert.ok(!titles.has(meta.title),'duplicate title: '+meta.title);assert.ok(!descriptions.has(meta.description),'duplicate description: '+meta.description);
  titles.add(meta.title);descriptions.add(meta.description);
  assert.equal(meta.openGraph.url,meta.alternates.canonical);assert.equal(meta.openGraph.title,meta.title);assert.equal(meta.twitter.title,meta.title);assert.equal(meta.openGraph.images[0].url,'/og/raytech-study-resources.png');
 };
 for(const topic of catalog.LEARNING_TOPICS){const language=catalog.LEARNING_LANGUAGES.find(l=>l.id===topic.languageId);const params=Promise.resolve({languageSlug:language.slug,topicSlug:topic.slug});check(await lesson.generateMetadata({params}));check(await quiz.generateMetadata({params}));}
 for(const item of catalog.LEARNING_COURSES)check(await course.generateMetadata({params:Promise.resolve({courseSlug:item.slug})}));
 assert.equal(titles.size,catalog.LEARNING_TOPICS.length*2+catalog.LEARNING_COURSES.length);
});

test('lesson and quiz schema reflects the published content and its real answers without fabricated metrics',()=>{
 for(const topic of catalog.LEARNING_TOPICS){const language=catalog.LEARNING_LANGUAGES.find(l=>l.id===topic.languageId);for(const mode of ['lesson','quiz']){
  const url=`${origin}/learn/${language.slug}/${topic.slug}/${mode==='quiz'?'quiz/':''}`;
  const data=learningSeo.learningStructuredData(language,topic,url,mode);const [resource,crumbs]=data['@graph'];
  assert.equal(resource.url,url);assert.equal(resource.name.includes(topic.title),true);assert.equal(resource['@type'],mode==='quiz'?'Quiz':'LearningResource');assert.equal(crumbs.itemListElement.at(-1).item,url);
  assert.equal(resource.aggregateRating,undefined);assert.equal(resource.totalTime,undefined);
  if(mode==='quiz')resource.hasPart.forEach(q=>assert.ok(q.suggestedAnswer.some(a=>a.text===q.acceptedAnswer.text)));
  assert.doesNotMatch(seo.serializeJsonLd({...data,untrusted:'</script>'}),/<\/script>/);
 }}
});

test('admin HTML metadata denies indexing while preserving the client authorization shell',async()=>{
 const layout=await page('src/app/admin/layout.tsx');assert.equal(layout.metadata.robots.index,false);assert.equal(layout.metadata.robots.follow,false);
 const shell=await fs.readFile('src/components/admin/AdminShell.tsx','utf8');assert.match(shell,/verifyAdminAccess/);assert.match(shell,/onAuthStateChanged/);
});

test('social image has the promised dimensions and compression retains the original asset URLs',async()=>{
 const image=await fs.readFile('public/og/raytech-study-resources.png');assert.equal(image.readUInt32BE(16),1200);assert.equal(image.readUInt32BE(20),630);assert.ok(image.length<100000);
 for(const name of ['avatar','banner']){const original=await fs.stat(`public/assets/${name}.jpg`);const compressed=await fs.stat(`public/assets/${name}.webp`);assert.ok(compressed.size<original.size*.5);}
});

test('canonical configuration requires an HTTPS origin and keeps the future custom-domain switch explicit',async()=>{
 const {normalizeSiteOrigin}=await loadTypescript('src/lib/site.ts');
 assert.equal(normalizeSiteOrigin(' https://raytechinstitute.web.app/ '),origin);
 assert.equal(normalizeSiteOrigin('https://raytechinstitute.com'),'https://raytechinstitute.com');
 for(const value of ['http://raytechinstitute.com','https://user:pass@raytechinstitute.com','https://raytechinstitute.com/path','https://raytechinstitute.com/?q=1','https://raytechinstitute.com/#anchor'])assert.throws(()=>normalizeSiteOrigin(value));
});

test('programming tests have an ordinary crawlable footer link',async()=>{
 const {Footer}=await page('src/components/Footer.tsx');
 const markup=renderToStaticMarkup(React.createElement(Footer));assert.match(markup,/href="\/quizzes\/"/);assert.match(markup,/href="\/courses\/"/);assert.doesNotMatch(markup,/<h4/);
});
