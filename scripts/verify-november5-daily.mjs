import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {hasPrivateCredential} from './private-credential-patterns.mjs';
const root='content/editorial-drafts/trending-pk-20261105-daily',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const plan=read(root+'/plan.json'),existing=read('artifacts/november5-daily/published-index.json');
const oldSlugs=new Set(existing.map(p=>p.slug)),oldIds=new Set(existing.map(p=>p.id));
const prepared=plan.groups.filter(g=>g.slug&&fs.existsSync(root+'/'+g.key+'/images.json'));const slugs=new Set(prepared.map(g=>g.slug)),imagesUsed=new Set(),results=[];
assert.equal(slugs.size,prepared.length);assert.equal(plan.rowDisposition.length,81);assert.ok(prepared.length>=1);assert.equal(new Set(plan.groups.map(g=>g.key)).size,plan.groups.length);
for(const d of fs.readdirSync('content/editorial-drafts')){
 if(d==='trending-pk-20261105-daily')continue;
 const dir='content/editorial-drafts/'+d;
 for(const name of fs.readdirSync(dir)){const p=dir+'/'+name+'/images.json';if(fs.existsSync(p))for(const i of read(p))imagesUsed.add(i.sha1);}
}
for(const row of read('content/editorial-revisions/trending-pk-20261030/images.json'))for(const i of [row.cover,row.inline])imagesUsed.add(i.sha1);
const hashes=new Set();sharp.concurrency(1);sharp.cache({memory:16,files:0,items:0});
for(const g of prepared){
 const dir=root+'/'+g.key,p=read(dir+'/post.json'),images=read(dir+'/images.json'),article=fs.readFileSync(dir+'/article.md','utf8');
 const words=article.split('## Sources')[0].trim().split(/\s+/).length;
 assert.ok(words>=2000,g.key+' incomplete');assert.ok(!oldSlugs.has(p.slug)&&!oldIds.has(p.id),g.key+' already published');
 assert.equal(p.tags.length,42);assert.equal(new Set(p.tags.map(t=>t.toLowerCase())).size,42);
 assert.equal(p.slug,g.slug);assert.match(p.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
 assert.ok(p.seo.title.length>=50&&p.seo.title.length<=60);assert.ok(p.seo.title.endsWith(' | RayTech Institute'));
 assert.ok(p.seo.description.length>=120&&p.seo.description.length<=155);
 assert.ok(!hasPrivateCredential(JSON.stringify(p)));assert.ok(!/<(?:script|iframe|embed|object|style)\b/i.test(p.content));
 assert.ok(!/^# /m.test(article));assert.ok(!/\u2014/.test(article));assert.equal(article.split('## Sources').length,2);
 let level=1;for(const heading of article.matchAll(/^(#{2,6}) /gm)){assert.ok(heading[1].length<=level+1);level=heading[1].length;}
 assert.ok(p.seo.sources.split('\n').length>=2);assert.equal((p.content.match(/!\[/g)||[]).length,1);assert.equal(images.length,2);
 for(const i of images){assert.ok(!imagesUsed.has(i.sha1),g.key+' image reused');imagesUsed.add(i.sha1);assert.ok(i.creator&&i.source&&i.license&&i.caption&&i.alt);const file='public'+i.url,info=await sharp(file).metadata();assert.equal(info.format,'webp');assert.equal(info.width,i.width);assert.equal(info.height,i.height);assert.ok(info.width<=1280&&info.height<=960);}
 assert.equal(images[0].url,p.featuredImage);
 for(const match of p.content.matchAll(/\]\(([^)]+)\)/g)){const link=match[1];assert.ok(link.startsWith('/')||link.startsWith('https://'));if(link.startsWith('/blogs/')&&link!=='/blogs/')assert.ok(oldSlugs.has(link.split('/')[2])||slugs.has(link.split('/')[2]),'Unknown internal article '+link);}
 const hash=crypto.createHash('sha256').update(p.content).digest('hex');assert.ok(!hashes.has(hash));hashes.add(hash);
 const previous=fs.existsSync(dir+'/review.json')?read(dir+'/review.json'):{};const review={...previous,state:previous.published?'published-live-verified':'local-verified-unpublished',published:previous.published===true,words,imageVisualReview:previous.imageVisualReview||'pending',localChecks:'validation.json',sourceCheckedOn:'2026-11-05'};
 if(fs.existsSync(dir+'/review.json'))review.imageVisualReview=read(dir+'/review.json').imageVisualReview;
 fs.writeFileSync(dir+'/review.json',JSON.stringify(review,null,2));results.push({key:g.key,slug:p.slug,words,tags:p.tags.length,images:images.length});
}
const report={state:'local-verified-unpublished',articles:results.length,bodyWords:results.reduce((sum,r)=>sum+r.words,0),uniqueImages:results.length*2,existingArticlesCompared:existing.length,results};fs.writeFileSync(root+'/validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
