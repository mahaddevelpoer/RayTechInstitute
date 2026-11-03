import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {hasPrivateCredential} from './private-credential-patterns.mjs';

// Local editorial checks only: never writes to a live database or dispatches CI.
const root='content/editorial-drafts/trending-pk-20261103';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const plan=read(`${root}/plan.json`);
const categoryType=fs.readFileSync('src/types/educational.ts','utf8').match(/export type BlogCategory\s*=([^;]+);/)?.[1];
assert.ok(categoryType,'Known public blog categories required');
const categories=new Set([...categoryType.matchAll(/'([^']+)'/g)].map(match=>match[1]));
const batch=process.argv.find(a=>a.startsWith('--batch='))?.slice(8)||'01';
const expected=Number(process.argv.find(a=>a.startsWith('--expected='))?.slice(11)||plan.localVerified||10);
assert.match(batch,/^\d{2}$/);
assert.ok(Number.isInteger(expected)&&expected>0&&expected<=plan.groups.length);
const oldPosts=[];
for(const date of ['20261030','20261101','20261102']){
  const dir=`content/editorial-drafts/trending-pk-${date}`;
  for(const name of fs.readdirSync(dir)){
    const p=`${dir}/${name}/post.json`;
    if(fs.existsSync(p))oldPosts.push(read(p));
  }
}
const oldSlugs=new Set(oldPosts.map(p=>p.slug));
const sitemapFile='artifacts/november-publish/november3-live-sitemap.xml';
assert.ok(fs.existsSync(sitemapFile),'Fetch the current public sitemap before final verification.');
const liveUrls=new Set([...fs.readFileSync(sitemapFile,'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));
assert.ok(liveUrls.size>0,'Readable live sitemap required');
const oldIds=new Set(oldPosts.map(p=>p.id));
const oldBodies=new Set(oldPosts.map(p=>crypto.createHash('sha256').update(p.content).digest('hex')));
const oldImageHashes=new Set();
for(const date of ['20261101','20261102']){
  const dir=`content/editorial-drafts/trending-pk-${date}`;
  for(const name of fs.readdirSync(dir)){
    const p=`${dir}/${name}/images.json`;
    if(fs.existsSync(p))for(const image of read(p))oldImageHashes.add(image.sha1);
  }
}
for(const row of read('content/editorial-revisions/trending-pk-20261030/images.json')){
  oldImageHashes.add(row.cover.sha1);oldImageHashes.add(row.inline.sha1);
}
const slugs=new Set(),ids=new Set(),imageHashes=new Set(),bodyHashes=new Set(),results=[];
for(const name of fs.readdirSync(root)){
  const dir=`${root}/${name}`;
  if(!fs.existsSync(`${dir}/post.json`))continue;
  const p=read(`${dir}/post.json`),review=read(`${dir}/review.json`),images=read(`${dir}/images.json`);
  assert.ok(categories.has(p.category),`${name}: category absent from public blog filters`);
  const original=fs.readFileSync(`${dir}/article.md`,'utf8');
  const body=original.split('## Sources')[0];
  const words=body.trim().split(/\s+/).length;
  assert.ok(words>=2000,`${name}: body too short`);
  assert.ok(!/^# /m.test(original),`${name}: page supplies its own H1`);
  assert.equal(original.split('## Sources').length,2,`${name}: one sources section`);
  let level=1;
  for(const h of original.matchAll(/^(#{2,6}) /gm)){
    assert.ok(h[1].length<=level+1,`${name}: skipped heading level`);level=h[1].length;
  }
  assert.ok(!/[\u2014]/u.test(original),`${name}: em dash`);
  assert.ok(!/<(?:script|iframe|object|embed|style)\b/i.test(p.content),`${name}: active HTML`);
  assert.ok(!hasPrivateCredential(JSON.stringify(p)),`${name}: private credential pattern`);
  assert.ok(!oldSlugs.has(p.slug)&&!slugs.has(p.slug),`${name}: duplicate URL`);slugs.add(p.slug);
  if(!review.published)assert.ok(!liveUrls.has(`https://raytechinstitute.com/blogs/${p.slug}/`),`${name}: unapproved URL already exists in live sitemap`);
  assert.ok(!oldIds.has(p.id)&&!ids.has(p.id),`${name}: duplicate ID`);ids.add(p.id);
  const hash=crypto.createHash('sha256').update(p.content).digest('hex');
  assert.ok(!oldBodies.has(hash)&&!bodyHashes.has(hash),`${name}: duplicate complete body`);bodyHashes.add(hash);
  assert.match(p.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(p.datePublished,'',`${name}: unapproved draft date must remain unset`);
  assert.equal(typeof review.published,'boolean');
  assert.equal(review.words,words);
  assert.equal(p.tags.length,42);
  assert.equal(new Set(p.tags.map(t=>t.toLowerCase())).size,42);
  assert.ok(p.seo.title.length>=50&&p.seo.title.length<=60,`${name}: title length`);
  assert.ok(p.seo.description.length>=120&&p.seo.description.length<=155,`${name}: description length`);
  assert.ok(p.seo.sources.split('\n').filter(Boolean).length>=2,`${name}: source metadata`);
  // Body sources and links already exist; avoid rendering duplicate source lists.
  assert.ok(!p.seo.enabled.includes('sources')&&!p.seo.enabled.includes('internalLinks'));
  for(const link of p.seo.internalLinks.split('\n').filter(Boolean))assert.ok(link.startsWith('/')&&!link.startsWith('//'));
  assert.equal(images.length,2);
  assert.equal(images.find(i=>i.role==='cover')?.url,p.featuredImage);
  assert.equal((p.content.match(/!\[/g)||[]).length,1,`${name}: exactly one inline image`);
  let bytes=0;
  for(const image of images){
    assert.ok(!oldImageHashes.has(image.sha1)&&!imageHashes.has(image.sha1),`${name}: repeated image source`);imageHashes.add(image.sha1);
    assert.ok(image.alt&&image.caption&&image.creator&&image.license&&image.source);
    const file=path.resolve('public'+image.url);
    assert.ok(file.startsWith(path.resolve('public/images/editorial/trending-pk-20261103')+path.sep));
    const info=await sharp(file).metadata();
    assert.equal(info.format,'webp');assert.equal(info.width,image.width);assert.equal(info.height,image.height);
    assert.ok(info.width<=1280&&info.height<=960);bytes+=fs.statSync(file).size;
  }
  const links=[...p.content.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
  for(const link of links){
    assert.ok(link.startsWith('/')||link.startsWith('https://'),`${name}: unsafe link scheme`);
    if(link.startsWith('/blogs/')&&link!=='/blogs/')assert.ok(oldSlugs.has(link.split('/')[2]),`${name}: unrecognised existing blog URL`);
    else if(link.startsWith('/')&&!link.startsWith('/images/'))assert.ok(['/blogs/','/classes/','/courses/'].includes(link),`${name}: unverified internal route`);
    if(link.startsWith('/')&&!link.startsWith('/images/'))assert.ok(liveUrls.has(`https://raytechinstitute.com${link}`),`${name}: linked page absent from current live sitemap`);
  }
  results.push({key:name,slug:p.slug,words,tags:p.tags.length,images:images.length,imageBytes:bytes,state:review.published?'published-live-verified':'local-verified-unpublished'});
}
assert.equal(results.length,expected,'Every expected draft must be present');
assert.equal(plan.rowDisposition.length,59);
assert.equal(plan.rowDisposition.filter(r=>r.state==='excluded-by-user').length,7);
assert.equal(plan.groups.length,40);
const report={date:'2026-11-03',state:'editorial-verified',articles:results.length,
  bodyWords:results.reduce((n,r)=>n+r.words,0),uniqueImages:imageHashes.size,
  imageBytes:results.reduce((n,r)=>n+r.imageBytes,0),previousPostsCompared:oldPosts.length,
  liveSitemapUrlsCompared:liveUrls.size,
  remainingNewTopics:plan.groups.length-results.length,existingPageReviews:plan.existingRows,
  excludedQueries:7,published:results.filter(r=>r.state==='published-live-verified').length,results,
  limits:['This validator performs no deployment or production writes; publication states come from the separate live-verification ledger.','Checks do not prove Google indexing, ranking or click-through rate.','Exact ID, URL, body and image checks supplement editorial intent review; they are not a universal semantic-duplicate detector.']};
fs.writeFileSync(`${root}/batch-${batch}-validation.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({articles:report.articles,bodyWords:report.bodyWords,uniqueImages:report.uniqueImages,
  imageBytes:report.imageBytes,remainingNewTopics:report.remainingNewTopics,published:report.published,checks:'pass'}));
