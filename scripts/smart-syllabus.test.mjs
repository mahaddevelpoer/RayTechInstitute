import {createHash} from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {loadTypescript} from './load-typescript.mjs';
const {syllabusIdentity,syllabusTags,syllabusPath,publishedSyllabusPosts,secureDocumentUrl}=await loadTypescript('src/lib/syllabus-records.ts');
const articles=JSON.parse(await fs.readFile('content/smart-syllabus-2027/articles.json','utf8'));
const documents=JSON.parse(await fs.readFile('src/data/smart-syllabus.json','utf8'));
const posts=articles.map(p=>({...p,actionButtonUrl:p.action_button_url}));
test('fifteen verified records have unique article and subject-resource identities',()=>{
 assert.equal(articles.length,15); assert.equal(new Set(articles.map(p=>p.slug)).size,15);
 assert.equal(new Set(posts.map(p=>syllabusPath(syllabusIdentity(p)))) .size,15);
 assert.equal(publishedSyllabusPosts(posts).length,15);
});
test('deletion does not resurrect a source seed and editing changes the shared resource',()=>{
 assert.equal(publishedSyllabusPosts(posts.slice(1)).length,14);
 assert.equal(publishedSyllabusPosts([]).length,0);
 const changed={...posts[0],actionButtonUrl:'https://example.org/revised.pdf',content:'Revised text'};
 assert.equal(publishedSyllabusPosts([changed])[0].post.content,'Revised text');
 assert.equal(publishedSyllabusPosts([changed])[0].post.actionButtonUrl,changed.actionButtonUrl);
});
test('ordinary blogs and malformed metadata cannot create syllabus routes',()=>{
 for(const tags of [[],['smart-syllabus'],syllabusTags(0,'physics',2027),syllabusTags(9,'../physics',2027),syllabusTags(9,'physics',0)]) assert.equal(syllabusIdentity({tags}),null);
 assert.equal(publishedSyllabusPosts([{...posts[0],actionButtonUrl:'javascript:alert(1)'}]).length,0);
 for(const url of ['http://example.org/a.pdf','javascript:alert(1)','https://user:password@example.org/a.pdf','file:///secret','/local.pdf']) assert.equal(secureDocumentUrl(url),false);
 assert.equal(secureDocumentUrl('https://example.org/a.pdf'),true);
});
test('grade, year and subject identity survive edits without stale tags',()=>{
 const tags=syllabusTags(10,'computer-science',2028,posts[0].tags);
 assert.deepEqual(syllabusIdentity({tags}),{grade:10,subject:'computer-science',year:2028});
 assert.equal(tags.filter(t=>t.startsWith('syllabus-grade-')).length,1);
});
test('each article has an actual PDF, two readable images, source references and subject facts',async()=>{
 for(const post of articles){
  const identity=syllabusIdentity(post);const d=documents.find(d=>d.grade===identity.grade&&d.subject===identity.subject);
  assert.ok(d);assert.ok(post.content.split(/\s+/).length>1200);
  assert.ok(post.content.includes(d.notification));assert.ok(post.content.includes(d.source));
  assert.ok(post.content.includes(syllabusPath(identity)));assert.ok(!/^# /m.test(post.content),'article supplies its only H1');
  assert.equal(post.action_button_url,'https://raytechinstitute.com'+d.pdf);
  const images=Array.from(post.content.matchAll(/!\[[^\]]+\]\(([^)]+)\)/g),m=>m[1]);
  assert.equal(images.length,2);assert.equal(new Set(images).size,2);
  for(const image of images) assert.ok((await fs.stat('public'+image)).size>1000);
  assert.ok((await fs.stat('public'+d.pdf)).size>1000);
  assert.equal(createHash('sha256').update(await fs.readFile('public'+d.pdf)).digest('hex'),d.sha256);
 }
});
test('unverified subjects are not fabricated and the conflicting Islamiat date is explicit',()=>{
 assert.equal(documents.filter(d=>d.grade===10).length,0);
 assert.equal(documents.filter(d=>d.grade===9&&d.subject==='computer-science').length,0);
 const post=articles.find(p=>p.id==='alp-2027-11-islamiat');assert.ok(post.content.includes('2025-26'));assert.ok(post.content.includes('internal year inconsistency'));
});
