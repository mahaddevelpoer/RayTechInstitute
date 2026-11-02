import fs from 'node:fs';
import assert from 'node:assert/strict';
import {learningProject,readLearningServiceKey} from './learning-cli-access.mjs';
import {fetchCatalogRows} from './catalog-fetch.mjs';
import {hasPrivateCredential} from './private-credential-patterns.mjs';
const batch=process.argv.find(a=>a.startsWith('--batch='))?.slice(8)||'20261101';
assert.match(batch,/^2026110[12]$/,'Unsupported November batch');
const root=`content/editorial-drafts/trending-pk-${batch}`;
const name=process.argv.find(a=>a.startsWith('--article='))?.slice(10);
assert.ok(name&&/^[a-z0-9-]+$/.test(name),'Pass a reviewed article directory');
const p=JSON.parse(fs.readFileSync(`${root}/${name}/post.json`,'utf8'));
const review=JSON.parse(fs.readFileSync(`${root}/${name}/review.json`,'utf8'));
const images=JSON.parse(fs.readFileSync(`${root}/${name}/images.json`,'utf8'));
assert.ok(review.words>=1000);assert.equal(images.length,2);assert.equal(new Set(images.map(i=>i.sha1)).size,2);
for(const i of images){assert.ok(fs.existsSync(`public${i.url}`));assert.ok(i.source&&i.license&&i.creator);}
assert.ok(!hasPrivateCredential(JSON.stringify(p)));
const base=`https://${learningProject}.supabase.co`,key=readLearningServiceKey();
const existing=await fetchCatalogRows(base,key,'blogs');
const old=existing.find(b=>b.id===p.id||b.slug===p.slug);
const row={id:p.id,title:p.title,slug:p.slug,category:p.category,excerpt:p.excerpt,content:p.content,featured_image:p.featuredImage,author:p.author,date_published:old?.date_published||p.datePublished||'2026-11-01',read_time:p.readTime,tags:p.tags,seo:p.seo||{},action_button_text:null,action_button_url:null};
if(old)for(const [k,v]of Object.entries(row))assert.deepEqual(old[k],v,`Existing article differs: ${k}. Nothing overwritten.`);
if(!process.argv.includes('--publish')){console.log(JSON.stringify({validated:p.slug,new:!old,publish:false}));process.exit(0);}
fs.mkdirSync('artifacts/november-publish',{recursive:true});
fs.writeFileSync(`artifacts/november-publish/backup-${Date.now()}.json`,JSON.stringify(existing));
if(!old){const r=await fetch(`${base}/rest/v1/blogs`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(row),signal:AbortSignal.timeout(30000)});assert.ok(r.ok,`Save failed (${r.status})`);}
const saved=(await fetchCatalogRows(base,key,'blogs')).find(b=>b.id===row.id);
for(const [k,v]of Object.entries(row))assert.deepEqual(saved?.[k],v,`Read-back mismatch: ${k}`);
review.state='database-saved-awaiting-hosting';review.published=false;fs.writeFileSync(`${root}/${name}/review.json`,JSON.stringify(review,null,2));
console.log(JSON.stringify({savedAndVerified:p.slug,hosting:'pending',otherArticlesPreserved:existing.length-(old?1:0)}));
