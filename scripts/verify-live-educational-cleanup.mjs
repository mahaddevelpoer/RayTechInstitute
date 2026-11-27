import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
const receipt=JSON.parse(await fs.readFile('docs/reviews/preferred-source-20261127/build-receipt.json','utf8'));
const base=process.env.VERIFY_BASE_URL||'https://raytechinstitute.com';
async function get(route,redirect='follow'){
 for(let attempt=0;attempt<3;attempt++)try{
  const response=await fetch(base+route,{redirect,signal:AbortSignal.timeout(45000)});return {response,bytes:Buffer.from(await response.arrayBuffer())};
 }catch(error){if(attempt===2)throw error;}
}
const deployment=JSON.parse((await get('/deployment.json')).bytes);assert.equal(deployment.revision,receipt.sourceRevision,'Custom domain must serve the approved artifact');
const {response,bytes}=await get('/');assert.equal(response.status,200);const document=new JSDOM(bytes.toString()).window.document;
assert.equal(document.querySelectorAll('h1').length,1);assert.equal(document.querySelectorAll('.study-strip-group').length,1);
const shortcuts=[...document.querySelectorAll('.study-resource-strip a')].map(a=>a.getAttribute('href'));assert.equal(shortcuts.length,18);assert.equal(new Set(shortcuts).size,18);
const summaries=[...document.querySelectorAll('[data-lecture-summary]')];assert.ok(summaries.length>0);for(const p of summaries){assert.ok(p.textContent.length>0&&p.textContent.length<=180);assert.doesNotMatch(p.textContent,/web\.app|https?:|\bsubscribe\b/i);}assert.doesNotMatch(document.body.textContent,/raytechinstitute\.web\.app/i);
const csp=response.headers.get('content-security-policy')||'';for(const name of ['script-src','connect-src','frame-src'])assert.ok(csp.split(';').find(d=>d.trim().startsWith(name+' '))?.includes('https://news.google.com'),name);
const llms=await get('/llms.txt');assert.equal(llms.response.status,200);assert.match(llms.response.headers.get('content-type')||'',/text\/plain/);assert.ok(llms.bytes.includes(Buffer.from('https://raytechinstitute.com/learn/python/')));assert.ok(!llms.bytes.includes(Buffer.from('/blogs/')));
const note='/classes/11th-class/computer-science/notes/class11-alp2027-chapter-5-study-guide/';const notePage=await get(note);const noteDoc=new JSDOM(notePage.bytes.toString()).window.document;assert.equal(notePage.response.status,200);assert.equal(noteDoc.querySelector('[data-study-summary] time')?.dateTime,'2026-11-27');
const malformed=await get('/classes/11th-class/computer-science/notes/index.txt?chapter=5','manual');assert.equal(malformed.response.status,302);assert.equal(new URL(malformed.response.headers.get('location'),base).pathname+new URL(malformed.response.headers.get('location'),base).search,'/classes/11th-class/computer-science/notes/?chapter=5');
const pdf=await get('/documents/class11/computer-2027/chapter-5.pdf');assert.equal(pdf.response.status,200);const hashes=JSON.parse(await fs.readFile('content/class11-computer-2027/pdf-manifest.json','utf8'));assert.equal(createHash('sha256').update(pdf.bytes).digest('hex'),hashes['chapter-5'].sha256);
process.env.VERIFY_BASE_URL=base;process.env.EXPECTED_REVISION=receipt.sourceRevision;
await import('./verify-article-indexing.mjs');
const report={checkedAt:new Date().toISOString(),base,revision:deployment.revision,homeH1:1,uniqueShortcuts:18,cleanLectureCards:summaries.length,googleCsp:true,llms:true,noteSummaryAndRecordedDate:true,legacyPayloadRedirect:302,chapter5PdfHash:true,legacyArticleNoindex:639};
await fs.mkdir('artifacts/educational-cleanup-live',{recursive:true});await fs.writeFile('artifacts/educational-cleanup-live/checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
