import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { loadTypescript } from './load-typescript.mjs';
test('homepage directory contains public previews and valid first-lesson links only',async()=>{
 const data=JSON.parse(await fs.readFile('src/data/learningDirectory.json','utf8'));
 const catalog=await loadTypescript('src/data/learningCatalog.ts');
 for(const track of data){
  const topics=catalog.LEARNING_TOPICS.filter(t=>t.languageId===track.id).sort((a,b)=>a.order-b.order);
  assert.equal(track.count,topics.length);assert.deepEqual(Object.keys(track).sort(),['count','first','id','slug','title']);
  if(track.first){assert.equal(track.first.slug,topics[0].slug);assert.deepEqual(Object.keys(track.first).sort(),['code','slug','summary','title']);assert.ok(track.first.code.split('\n').length<=7);}
 }
});
