import fs from 'node:fs';
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
import {learningProject,readLearningServiceKey} from './learning-cli-access.mjs';
import {fetchCatalogRows} from './catalog-fetch.mjs';
// Narrow metadata correction only. Refuse changes if the reviewed SEO object differs.
const root='content/editorial-drafts/trending-pk-20261103';
const changes=JSON.parse(fs.readFileSync(`${root}/search-title-corrections.json`,'utf8'));
const key=readLearningServiceKey(),base=`https://${learningProject}.supabase.co`;
const existing=await fetchCatalogRows(base,key,'blogs');
for(const change of changes){
 const old=existing.find(p=>p.id===change.id);assert.ok(old);
 assert.equal(old.slug,change.slug);
 assert.deepEqual({...change.after,title:change.before.title},change.before,'Only title can change');
 assert.ok(change.after.title.endsWith(' | RayTech Institute'));
 assert.ok(change.after.title.length>=50&&change.after.title.length<=60);
 if(!isDeepStrictEqual(old.seo,change.after))assert.deepEqual(old.seo,change.before,`SEO changed concurrently: ${change.slug}`);
}
console.log(JSON.stringify({reviewed:changes.length,onlyField:'seo.title',apply:process.argv.includes('--apply')}));
if(!process.argv.includes('--apply'))process.exit(0);
fs.writeFileSync(`artifacts/november-publish/title-backup-${Date.now()}.json`,JSON.stringify(existing));
let updated=0;
for(const change of changes){
 const old=existing.find(p=>p.id===change.id);
 if(isDeepStrictEqual(old.seo,change.after))continue;
 const url=new URL(`${base}/rest/v1/blogs`);
 url.searchParams.set('id',`eq.${change.id}`);url.searchParams.set('seo',`eq.${JSON.stringify(change.before)}`);
 const response=await fetch(url,{method:'PATCH',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({seo:change.after}),signal:AbortSignal.timeout(30000)});
 assert.ok(response.ok,`Title patch rejected (${response.status})`);
 const rows=await response.json();assert.equal(rows.length,1,'Concurrent change: nothing overwritten');
 assert.deepEqual(rows[0].seo,change.after);
 for(const field of ['content','title','slug','date_published','featured_image','tags'])assert.deepEqual(rows[0][field],old[field],`Unexpected change to ${field}`);
 updated++;
}
const saved=await fetchCatalogRows(base,key,'blogs');
for(const change of changes)assert.deepEqual(saved.find(p=>p.id===change.id)?.seo,change.after);
console.log(JSON.stringify({updated,readBackVerified:changes.length,otherFieldsPreserved:true}));
