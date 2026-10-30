import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {learningProject,readLearningServiceKey} from './learning-cli-access.mjs';
import {fetchCatalogRows} from './catalog-fetch.mjs';
import {hasPrivateCredential} from './private-credential-patterns.mjs';

// Local review files stay unchanged. Only --publish writes the explicitly approved batch.
const root=path.resolve('content/editorial-drafts/trending-pk-20261030');
const posts=JSON.parse(fs.readFileSync(path.join(root,'posts.json'),'utf8'));
const validation=JSON.parse(fs.readFileSync(path.join(root,'validation.json'),'utf8'));
assert.equal(posts.length,79);assert.equal(validation.articles,79);
const editorialClean=content=>content
  .replace(/\bThis draft\b/g,'This guide').replace(/\bthis draft\b/g,'this guide')
  .replace('the official live table must be checked at publication','the official live table changes as results are processed')
  .replaceAll('before publication or travel planning','before sharing an update or planning travel')
  .replaceAll('before publication','before sharing an update');
const base=`https://${learningProject}.supabase.co`, key=readLearningServiceKey();
const existing=await fetchCatalogRows(base,key,'blogs');
const publicationDate=new Date().toISOString().slice(0,10);
const rows=posts.map(p=>({id:p.id,title:p.title,slug:p.slug,category:p.category,excerpt:p.excerpt,content:editorialClean(p.content),featured_image:p.featuredImage,author:p.author,date_published:existing.find(b=>b.id===p.id)?.date_published||publicationDate,read_time:p.readTime,tags:p.tags,action_button_text:p.actionButtonText||null,action_button_url:p.actionButtonUrl||null}));
for(const row of rows){
 assert.ok(!hasPrivateCredential(JSON.stringify(row)),'Credential scan failed.');
 assert.ok(fs.existsSync(path.join('public',row.featured_image)),'Publication image missing.');
 const collision=existing.find(b=>b.id===row.id||b.slug===row.slug);
 if(collision)for(const [field,value] of Object.entries(row))assert.deepEqual(collision[field],value,`Existing blog conflicts with the reviewed batch: ${row.slug} (${field}). Nothing overwritten.`);
}
const missing=rows.filter(row=>!existing.some(b=>b.id===row.id));
console.log(JSON.stringify({reviewed:rows.length,existingBlogs:existing.length,newBlogs:missing.length,overwrites:0,willPublish:process.argv.includes('--publish')}));
if(!process.argv.includes('--publish'))process.exit(0);
const evidence=path.resolve('artifacts/trending-publish');fs.mkdirSync(evidence,{recursive:true});
const backup=path.join(evidence,`blogs-before-${Date.now()}.json`);
fs.writeFileSync(backup,JSON.stringify(existing,null,2));
if(missing.length){
 const response=await fetch(`${base}/rest/v1/blogs`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(missing),signal:AbortSignal.timeout(45000)});
 if(!response.ok)throw new Error(`Blog publication rejected (${response.status}). Existing blogs were not overwritten; reload the catalog before retrying.`);
}
const saved=await fetchCatalogRows(base,key,'blogs');
for(const row of rows){const record=saved.find(b=>b.id===row.id);assert.ok(record,`Published blog missing: ${row.slug}`);for(const [field,value] of Object.entries(row))assert.deepEqual(record[field],value,`Publication read-back mismatch: ${row.slug} (${field})`);}
const receipt={state:'database-published-awaiting-static-release',publishedAt:new Date().toISOString(),count:rows.length,inserted:missing.length,preservedExisting:existing.length,slugs:rows.map(r=>r.slug),publicationDate};
fs.writeFileSync(path.join(evidence,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({publishedAndReadBackVerified:rows.length,inserted:missing.length,overwritten:0,siteDeployment:'pending'}));
