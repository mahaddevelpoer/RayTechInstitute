import test from 'node:test';import assert from 'node:assert/strict';
import{authoredFoundationTopics}from'../content/courses/catalog.mjs';import{authoredPythonTopics}from'../content/courses/python/topics.mjs';import{parseReviewedMdx}from'./reviewed-mdx.mjs';import{loadTypescript}from'./load-typescript.mjs';
const{lessonWordCount}=await loadTypescript('supabase/functions/_shared/lesson-quality.ts');
test('all 24 authored lessons gain topic-specific teaching, without changing grading or example answers',async()=>{
 const old=[...await authoredFoundationTopics({enriched:false}),...authoredPythonTopics({enriched:false})];const improved=[...await authoredFoundationTopics(),...authoredPythonTopics()];assert.equal(improved.length,24);
 for(const topic of improved){const before=old.find(t=>t.id===topic.id);assert.ok(lessonWordCount(topic.content)>lessonWordCount(before.content)*1.65,topic.id);assert.deepEqual(topic.questions,before.questions);assert.deepEqual(topic.assignment,before.assignment);const blocks=parseReviewedMdx(topic.content);assert.equal(blocks.filter(b=>b.type==='PredictOutput').length,1);assert.equal(blocks.filter(b=>b.type==='Understand').length,1);assert.ok(topic.content.includes(topic.languageId==='python'&&topic.order>1?'## The mistake worth understanding':'## Build it, change it, explain it'));}
});
