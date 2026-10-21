import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const {createCodiAudioCache,codiRecordingHash}=await loadTypescript('supabase/functions/_shared/codi-audio-cache.ts');
const {codiAudioKeyMaterial}=await loadTypescript('src/lib/learning/codi-sentences.ts');
const text='A variable names a value.';
const recording={audio:'AAABAA==',rate:24000,model:'gemini-2.5-flash-preview-tts'};
const hash=await codiRecordingHash(text,'en');
function fixture(){
 const assets=new Map(),calls=[];let next=1,writeFailure=false;
 const fetcher=async(url,init={})=>{
  calls.push({url:String(url),init});const u=new URL(url);
  if(u.pathname.endsWith('catalog.json'))return Response.json({schema:1,units:[{hash}]});
  if(u.hostname==='github.com'){const a=assets.get(u.pathname.split('/').at(-1));return a?new Response(a.body):new Response('',{status:404});}
  assert.equal(init.headers.Authorization,'Bearer private-fixture');
  if(u.hostname==='uploads.github.com'){
   const name=u.searchParams.get('name');if(writeFailure&&name.endsWith('.json'))return new Response('',{status:503});
   if(assets.has(name))return new Response('',{status:422});
   const a={id:next++,name,created_at:new Date().toISOString(),body:init.body};assets.set(name,a);return Response.json(a,{status:201});
  }
  if(u.pathname.includes('/releases/tags/'))return Response.json({id:5});
  if(init.method==='DELETE'){for(const [name,a]of assets)if(a.id===Number(u.pathname.split('/').at(-1)))assets.delete(name);return new Response(null,{status:204});}
  if(u.pathname.endsWith('/assets'))return Response.json([...assets.values()]);
  throw Error('Unexpected test request');
 };
 return {assets,calls,fetcher,cache:createCodiAudioCache('private-fixture',fetcher),failWrites:()=>{writeFailure=true;}};
}
test('shared hash exactly matches browser and prepared-recording version',async()=>{
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(codiAudioKeyMaterial(text,'en')));
 assert.equal(hash,Buffer.from(bytes).toString('hex'));assert.notEqual(hash,await codiRecordingHash(text,'ur'));
});
test('first read persists, independent worker reuses it with zero new generations',async()=>{
 const f=fixture();let generated=0;
 assert.equal((await f.cache.run('en',text,async()=>{generated++;return recording;})).cacheSaved,true);
 const other=createCodiAudioCache('private-fixture',f.fetcher);
 assert.deepEqual(await other.get('en',text),recording);
 assert.equal((await other.run('en',text,async()=>{generated++;return recording;})).cacheSaved,true);
 assert.equal(generated,1);assert.ok(f.assets.has(hash+'.json'));assert.equal(f.assets.has(hash+'.lock'),false);
 assert.ok(f.calls.filter(c=>new URL(c.url).hostname==='github.com').every(c=>!c.init.headers?.Authorization));
});
test('simultaneous reads share one generation; separate worker cannot bypass active lease',async()=>{
 const f=fixture();let resolve,started;const ready=new Promise(r=>{started=r;});let generations=0;
 const produce=()=>{generations++;started();return new Promise(r=>{resolve=r;});};
 const first=f.cache.run('en',text,produce);await ready;
 const second=f.cache.run('en',text,produce);
 await assert.rejects(createCodiAudioCache('private-fixture',f.fetcher).run('en',text,produce),/already being prepared/);
 resolve(recording);await Promise.all([first,second]);assert.equal(generations,1);
});
test('failed generation releases lease and stale crash leases recover',async()=>{
 const f=fixture();await assert.rejects(f.cache.run('en',text,async()=>{throw Error('Provider failed');}),/Provider failed/);
 assert.equal(f.assets.size,0);
 f.assets.set(hash+'.lock',{id:99,name:hash+'.lock',body:'{}',created_at:new Date(Date.now()-200000).toISOString()});
 assert.equal((await f.cache.run('en',text,async()=>recording)).cacheSaved,true);
});
test('private/unpublished selections are not read from or saved into public assets',async()=>{
 const f=fixture();assert.equal(await f.cache.get('en','Private student code'),null);
 assert.equal((await f.cache.run('en','Private student code',async()=>recording)).cacheSaved,false);
 assert.equal(f.assets.size,0);assert.equal(f.calls.filter(c=>!c.url.endsWith('catalog.json')).length,0);
});
test('shared hits spend no quota, while quota denial cannot write a lease or generate',async()=>{
 const f=fixture();let quota=0;
 await assert.rejects(f.cache.run('en',text,async()=>{throw Error('Must not generate');},async()=>{quota++;throw Error('Quota denied');}),/Quota denied/);
 assert.equal(f.assets.size,0);assert.equal(f.calls.filter(c=>c.init.method==='POST').length,0);assert.equal(quota,1);
 f.assets.set(hash+'.json',{body:JSON.stringify(recording)});
 await f.cache.run('en',text,async()=>{throw Error('Must not generate');},async()=>{quota++;});assert.equal(quota,1);
});
test('corrupt shared audio fails closed and unsuccessful saves never claim persistence',async()=>{
 const f=fixture();f.assets.set(hash+'.json',{body:JSON.stringify({...recording,model:'untrusted'})});
 await assert.rejects(f.cache.get('en',text),/Invalid shared/);
 f.assets.clear();f.failWrites();assert.equal((await f.cache.run('en',text,async()=>recording)).cacheSaved,false);assert.equal(f.assets.size,0);
});
