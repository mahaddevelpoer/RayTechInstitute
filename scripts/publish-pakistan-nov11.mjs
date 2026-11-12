import fs from 'node:fs';
import assert from 'node:assert/strict';
import {learningProject,readLearningServiceKey} from './learning-cli-access.mjs';
import {fetchCatalogRows} from './catalog-fetch.mjs';
import {hasPrivateCredential} from './private-credential-patterns.mjs';
import {editorialRoot as root, editorialArtifacts as artifactRoot} from './editorial-daily-queue.mjs';
const region=process.argv.find(a=>a.startsWith('--region='))?.slice(9)||'PK';assert.ok(['PK','US'].includes(region),'Unsupported publication region');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const plan=read(root+'/plan.json');assert.equal(plan.publicationAuthorized,true);
const selection=process.argv.find(a=>a.startsWith('--articles='))?.slice(11).split(',').filter(Boolean);
assert.ok(selection?.length,'Select the exact authorised batch with --articles');
assert.equal(new Set(selection).size,selection.length);
const approved=plan.releaseBatches.find(b=>b.explicitUserAuthorization&&b.expectedSize===selection.length&&b.keys.length===selection.length&&b.keys.every(k=>selection.includes(k)));
assert.ok(approved,'Release must match the explicitly authorised batch');
const validation=read(root+'/'+(approved.validationFile||'validation.json'));
assert.equal(validation.articles,selection.length);assert.ok(selection.every(k=>validation.results.some(r=>r.key===k)));
const base='https://'+learningProject+'.supabase.co',key=readLearningServiceKey(),existing=await fetchCatalogRows(base,key,'blogs'),rows=[];
for(const g of plan.groups.filter(g=>validation.results.some(r=>r.key===g.key)&&(!selection||selection.includes(g.key)))){const dir=root+'/'+g.key,p=read(dir+'/post.json'),review=read(dir+'/review.json');assert.equal(review.imageVisualReview,'passed');assert.ok(review.words>=2000);assert.ok(validation.results.some(r=>r.slug===p.slug&&r.words===review.words));assert.ok(!hasPrivateCredential(JSON.stringify(p)));const row={id:p.id,title:p.title,slug:p.slug,category:p.category,excerpt:p.excerpt,content:p.content,featured_image:p.featuredImage,author:p.author,date_published:p.datePublished,read_time:p.readTime,tags:p.tags,seo:p.seo,action_button_text:null,action_button_url:null};const old=existing.find(r=>r.id===row.id||r.slug===row.slug);if(old)for(const[k,v]of Object.entries(row))assert.deepEqual(old[k],v,'Existing article differs; no overwrite allowed: '+row.slug+'/'+k);rows.push({row,exists:!!old});}
console.log(JSON.stringify({reviewed:rows.length,new:rows.filter(r=>!r.exists).length,overwrites:0,publish:process.argv.includes('--publish')}));if(!process.argv.includes('--publish'))process.exit(0);
fs.mkdirSync(artifactRoot,{recursive:true});fs.writeFileSync(artifactRoot+'/before-publish-'+Date.now()+'.json',JSON.stringify(existing));
const missing=rows.filter(r=>!r.exists).map(r=>r.row);if(missing.length){const response=await fetch(base+'/rest/v1/blogs',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(missing),signal:AbortSignal.timeout(45000)});assert.ok(response.ok,'Insert failed with HTTP '+response.status);}
const saved=await fetchCatalogRows(base,key,'blogs');for(const{row}of rows){const actual=saved.find(r=>r.id===row.id);for(const[k,v]of Object.entries(row))assert.deepEqual(actual?.[k],v,'Read-back mismatch '+row.slug+'/'+k);}
const before=new Map(existing.map(r=>[r.id,JSON.stringify(r)]));for(const r of saved)if(before.has(r.id))assert.equal(JSON.stringify(r),before.get(r.id),'Unrelated article changed');
fs.writeFileSync(artifactRoot+'/publication-receipt.json',JSON.stringify({state:'database-saved-awaiting-hosting',inserted:missing.length,verified:rows.length,existingArticlesPreserved:existing.length,articles:rows.map(r=>r.row.slug)},null,2));console.log(JSON.stringify({savedAndReadBackVerified:rows.length,existingArticlesPreserved:existing.length,hosting:'pending'}));
