// Read-only checks on the explicitly approved published release.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
const receipt=JSON.parse(await fs.readFile('docs/reviews/class11-computer-20261127/build-receipt.json','utf8'));
const data=JSON.parse(await fs.readFile('content/class11-computer-2027/generated.json','utf8'));
const pdfs=JSON.parse(await fs.readFile('content/class11-computer-2027/pdf-manifest.json','utf8'));
const base='https://raytechinstitute.com',route='/classes/11th-class/computer-science';
async function get(url){
 for(let attempt=0;attempt<3;attempt++)try{
  const response=await fetch(url,{signal:AbortSignal.timeout(45000)});
  const bytes=Buffer.from(await response.arrayBuffer());return {response,bytes};
 }catch(error){if(attempt===2)throw error;}
}
const deployment=JSON.parse((await get(base+'/deployment.json')).bytes.toString());
assert.equal(deployment.revision,receipt.headSha,'Live source differs from the approved artifact');
const sitemap=(await get(base+'/sitemap.xml')).bytes.toString();
const routes=[route+'/',...data.notes.map(n=>route+'/notes/'+n.id+'/'),...data.papers.map(p=>route+'/past-papers/'+p.id+'/')];
const pages=[],downloads=[];
for(let offset=0;offset<routes.length;offset+=3){
 pages.push(...await Promise.all(routes.slice(offset,offset+3).map(async pathname=>{
  const {response,bytes}=await get(base+pathname);assert.ok(response.ok,pathname);
  const doc=new JSDOM(bytes.toString()).window.document;
  assert.equal(doc.querySelectorAll('h1').length,1,pathname);
  assert.equal(doc.querySelector('link[rel="canonical"]')?.href,base+pathname);
  assert.ok(!/noindex/i.test(doc.querySelector('meta[name="robots"]')?.content||''));
  assert.ok(sitemap.includes(base+pathname),'Missing sitemap route '+pathname);
  if(pathname===route+'/')assert.equal(doc.querySelectorAll('.study-chapter-card').length,9);
  if(pathname.includes('/past-papers/'))assert.ok(doc.body.textContent.includes('OLD-COURSE'));
  return {url:base+pathname,status:response.status,title:doc.title,canonical:true,indexable:true,sitemap:true};
 })));
}
assert.equal(new Set(pages.map(p=>p.title)).size,pages.length,'Duplicate live page titles');
const files=[...Object.entries(pdfs).map(([key,meta])=>({pathname:'/documents/class11/computer-2027/'+key+'.pdf',...meta})),...[1,2,3].map(n=>({pathname:`/documents/class11/nov12/chapter-${n}.pdf`,...pdfs[`chapter-${n}`]}))];
for(let offset=0;offset<files.length;offset+=3){
 downloads.push(...await Promise.all(files.slice(offset,offset+3).map(async file=>{
  const {response,bytes}=await get(base+file.pathname);assert.ok(response.ok,file.pathname);
  assert.ok(response.headers.get('content-type')?.includes('application/pdf'));
  assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert.equal(bytes.length,file.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256,file.pathname);
  return {url:base+file.pathname,status:response.status,bytes:bytes.length,sha256:file.sha256};
 })));
}
const dit=await get(base+'/classes/dit-intermediate/');assert.ok(dit.response.ok);
const ditDoc=new JSDOM(dit.bytes.toString()).window.document;assert.equal(ditDoc.querySelectorAll('a[data-dit-note]').length,36);assert.ok(ditDoc.body.textContent.includes('35 of 35 syllabus modules'));
const report={checkedAt:new Date().toISOString(),revision:deployment.revision,build:deployment.workflowUrl,pages,downloads,dit:{guides:36,modules:35},published:true};
await fs.mkdir('artifacts/class11-computer-live',{recursive:true});
await fs.writeFile('artifacts/class11-computer-live/http-checks.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({revision:report.revision,pages:pages.length,downloads:downloads.length,ditGuides:36,sitemap:true}));
