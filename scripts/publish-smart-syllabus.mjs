import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {readLearningServiceKey,learningProject} from './learning-cli-access.mjs';
import {fetchCatalogRows} from './catalog-fetch.mjs';
import {hasPrivateCredential} from './private-credential-patterns.mjs';
const rows=JSON.parse(await fs.readFile('content/smart-syllabus-2027/articles.json','utf8'));
assert.equal(rows.length,15);assert.ok(!hasPrivateCredential(JSON.stringify(rows)));
const key=readLearningServiceKey(),base=`https://${learningProject}.supabase.co`;
const existing=await fetchCatalogRows(base,key,'blogs');
for(const row of rows){const old=existing.find(p=>p.id===row.id||p.slug===row.slug);if(old)for(const [k,v] of Object.entries(row))assert.deepEqual(old[k],v,`Refusing overwrite: ${row.slug}/${k}`);}
const missing=rows.filter(row=>!existing.some(p=>p.id===row.id));
console.log(JSON.stringify({reviewed:rows.length,new:missing.length,existingArticles:existing.length,publish:process.argv.includes('--publish')}));
if(!process.argv.includes('--publish'))process.exit(0);
await fs.mkdir('artifacts/smart-syllabus-2027',{recursive:true});
await fs.writeFile('artifacts/smart-syllabus-2027/before-publish.json',JSON.stringify(existing));
if(missing.length){const response=await fetch(base+'/rest/v1/blogs',{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(missing),signal:AbortSignal.timeout(45000)});assert.ok(response.ok,'Insert failed with HTTP '+response.status);}
const saved=await fetchCatalogRows(base,key,'blogs');
for(const row of rows){const actual=saved.find(p=>p.id===row.id);for(const [k,v] of Object.entries(row))assert.deepEqual(actual?.[k],v,`Readback mismatch ${row.slug}/${k}`);}
for(const old of existing)assert.deepEqual(saved.find(p=>p.id===old.id),old,'Existing article changed: '+old.id);
await fs.writeFile('artifacts/smart-syllabus-2027/publication-receipt.json',JSON.stringify({state:'database-saved-awaiting-hosting',saved:rows.length,inserted:missing.length,existingPreserved:existing.length,slugs:rows.map(p=>p.slug)},null,2));
console.log('All 15 records read back exactly; existing articles preserved. Hosting verification is still required.');
