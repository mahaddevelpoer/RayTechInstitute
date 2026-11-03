import fs from 'node:fs';
import assert from 'node:assert/strict';
import { learningProject, readLearningServiceKey } from './learning-cli-access.mjs';
import { fetchCatalogRows } from './catalog-fetch.mjs';
import { hasPrivateCredential } from './private-credential-patterns.mjs';
const root='content/editorial-drafts/trending-pk-20261103';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const plan=read(`${root}/plan.json`);
assert.equal(plan.publicationAuthorized,true,'Current article publication approval must be recorded.');
const candidates=plan.groups.filter(g=>g.state==='local-verified-unpublished');
if(!candidates.length){console.log(JSON.stringify({new:0,publish:false,message:'No completed unpublished articles remain.'}));process.exit(0);}
const base=`https://${learningProject}.supabase.co`,key=readLearningServiceKey();
const existing=await fetchCatalogRows(base,key,'blogs');
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const rows=[];
for(const g of candidates){
 const p=read(`${root}/${g.key}/post.json`),review=read(`${root}/${g.key}/review.json`),images=read(`${root}/${g.key}/images.json`);
 assert.equal(review.state,'local-verified-unpublished');assert.equal(review.imageVisualReview,'passed');
 assert.ok(review.words>=2000);assert.equal(p.tags.length,42);assert.equal(images.length,2);
 const validation=read(`${root}/${review.localChecks}`);assert.ok(validation.results.some(r=>r.key===g.key&&r.slug===p.slug&&r.words===review.words));
 assert.ok(!hasPrivateCredential(JSON.stringify(p)));
 for(const i of images){assert.ok(fs.existsSync(`public${i.url}`));assert.ok(i.license&&i.creator&&i.source);}
 const old=existing.find(b=>b.id===p.id||b.slug===p.slug);
 const row={id:p.id,title:p.title,slug:p.slug,category:p.category,excerpt:p.excerpt,content:p.content,featured_image:p.featuredImage,author:p.author,date_published:old?.date_published||date,read_time:p.readTime,tags:p.tags,seo:p.seo||{},action_button_text:null,action_button_url:null};
 if(old)for(const [k,v]of Object.entries(row))assert.deepEqual(old[k],v,`Existing article differs: ${p.slug}/${k}. No overwrite allowed.`);
 rows.push({name:g.key,row,exists:!!old});
}
console.log(JSON.stringify({reviewed:rows.length,new:rows.filter(x=>!x.exists).length,overwrites:0,publish:process.argv.includes('--publish')}));
if(!process.argv.includes('--publish'))process.exit(0);
fs.mkdirSync('artifacts/november-publish',{recursive:true});
fs.writeFileSync(`artifacts/november-publish/nov3-before-${Date.now()}.json`,JSON.stringify(existing));
const missing=rows.filter(x=>!x.exists).map(x=>x.row);
if(missing.length){const response=await fetch(`${base}/rest/v1/blogs`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(missing),signal:AbortSignal.timeout(45000)});assert.ok(response.ok,`Article insert failed (${response.status}); verify storage before retry.`);}
const saved=await fetchCatalogRows(base,key,'blogs');
for(const {row}of rows){const record=saved.find(x=>x.id===row.id);for(const [k,v]of Object.entries(row))assert.deepEqual(record?.[k],v,`Read-back mismatch: ${row.slug}/${k}`);}
fs.writeFileSync('artifacts/november-publish/nov3-publication-receipt.json',JSON.stringify({state:'database-saved-awaiting-hosting',date,inserted:missing.length,articles:rows.map(x=>({name:x.name,slug:x.row.slug})),otherArticlesPreserved:existing.length},null,2));
console.log(JSON.stringify({savedAndReadBackVerified:rows.length,hosting:'pending',otherArticlesPreserved:existing.length}));
