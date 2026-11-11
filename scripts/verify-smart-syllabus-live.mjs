import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const origin='https://raytechinstitute.com';
const revision=process.argv[2];assert.ok(/^[a-f0-9]{40}$/.test(revision||''),'Pass the reviewed release SHA');
const articles=JSON.parse(await fs.readFile('content/smart-syllabus-2027/articles.json','utf8'));
const docs=JSON.parse(await fs.readFile('src/data/smart-syllabus.json','utf8'));
async function request(route){let last;for(let attempt=0;attempt<3;attempt++){try{const response=await fetch(origin+route,{signal:AbortSignal.timeout(25000),headers:{'Cache-Control':'no-cache'}});assert.equal(response.status,200,route);return response;}catch(e){last=e;}}throw last;}
const deployment=await (await request('/deployment.json?smart-syllabus='+revision.slice(0,8))).json();assert.equal(deployment.revision,revision,'Live site must serve this reviewed source revision');
const sitemap=await (await request('/sitemap.xml')).text();
assert.equal(createHash('sha256').update(sitemap).digest('hex'),deployment.sitemapSha256);
const directory=await (await request('/smart-syllabus/')).text();const checks=[];
for(let start=0;start<articles.length;start+=3)await Promise.all(articles.slice(start,start+3).map(async post=>{
 const grade=Number(post.tags.find(t=>t.startsWith('syllabus-grade-')).replace('syllabus-grade-',''));
 const subject=post.tags.find(t=>t.startsWith('syllabus-subject-')).replace('syllabus-subject-','');
 const resource=`/smart-syllabus/grade-${grade}/${subject}/`;const article=`/blogs/${post.slug}/`;const d=docs.find(d=>d.grade===grade&&d.subject===subject);
 for(const route of [resource,article]){
  const response=await request(route);assert.match(response.headers.get('content-type')||'',/text\/html/);const html=await response.text();assert.ok(html.includes(`href="${origin}${route}"`),'Canonical missing '+route);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);assert.ok(sitemap.includes(`<loc>${origin}${route}</loc>`),'Sitemap missing '+route);assert.ok(html.includes(d.pdf),'PDF missing '+route);assert.ok(html.includes('application/ld+json'));
 }
 assert.ok(directory.includes(resource));
 const pdf=await request(d.pdf);assert.match(pdf.headers.get('content-type')||'',/application\/pdf/);const bytes=Buffer.from(await pdf.arrayBuffer());assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert.equal(createHash('sha256').update(bytes).digest('hex'),d.sha256);
 for(const image of [d.image,d.notificationImage,`/images/smart-syllabus/2027/grade-${grade}-${subject}-paper.webp`]){const response=await request(image);assert.match(response.headers.get('content-type')||'',/image\//);await response.body.cancel();}
 checks.push({grade,subject,article,resource,pdf:d.pdf,pdfHashVerified:true,sitemap:true});
}));
const admin=await request('/admin/smart-syllabus/');const adminHtml=await admin.text();assert.match(adminHtml,/noindex/);
await fs.writeFile('artifacts/smart-syllabus-2027/live-checks.json',JSON.stringify({revision,deployment,checkedAt:new Date().toISOString(),checks},null,2));
console.log(JSON.stringify({revision,articles:checks.length,resources:checks.length,pdfs:checks.length,sitemapMatchesBuild:true,adminNoindex:true}));
