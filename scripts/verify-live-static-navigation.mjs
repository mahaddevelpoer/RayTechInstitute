// Read-only verification of the approved static-navigation deployment.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
const root='docs/reviews/static-navigation-20261127';
const receipt=JSON.parse(await fs.readFile(root+'/build-receipt.json','utf8'));
const base='https://raytechinstitute.com',notes='/classes/11th-class/computer-science/notes/';
async function get(pathname,redirect='follow'){
 for(let i=0;i<3;i++)try{const response=await fetch(base+pathname,{redirect,signal:AbortSignal.timeout(45000)});return {response,bytes:Buffer.from(await response.arrayBuffer())};}catch(e){if(i===2)throw e;}
}
const {bytes:deploymentBytes}=await get('/deployment.json');const deployment=JSON.parse(deploymentBytes);
assert.equal(deployment.revision,receipt.headSha,'Custom domain must serve the approved artifact');
const redirects=[];
for(const [from,to] of [
 [notes+'index.txt?chapter=5',notes+'?chapter=5'],
 [notes+'index.txt?chapter=2&q=python',notes+'?chapter=2&q=python'],
 ['/index.txt','/'],
 ['/classes/dit-intermediate/index.txt','/classes/dit-intermediate/']
]){
 const {response}=await get(from,'manual');assert.equal(response.status,302,from);
 const target=new URL(response.headers.get('location'),base);assert.equal(target.origin,base);assert.equal(target.pathname+target.search,to,from);
 const result=await get(from);assert.ok(result.response.ok);assert.match(result.response.headers.get('content-type')||'',/text\/html/);
 const doc=new JSDOM(result.bytes.toString()).window.document;assert.equal(doc.querySelectorAll('h1').length,1);
 redirects.push({from:base+from,to:target.href,status:response.status,html:true});
}
const missing=await get('/classes/not-a-published-class/index.txt','manual');assert.equal(missing.response.status,404);
const robots=await get('/robots.txt','manual');assert.equal(robots.response.status,200);assert.match(robots.bytes.toString(),/User-agent:/);
const manifest=JSON.parse(await fs.readFile('content/class11-computer-2027/pdf-manifest.json','utf8'));
const pdf=await get('/documents/class11/computer-2027/chapter-5.pdf');assert.ok(pdf.response.ok);assert.equal(createHash('sha256').update(pdf.bytes).digest('hex'),manifest['chapter-5'].sha256);
const dit=await get('/classes/dit-intermediate/');assert.ok(dit.response.ok);assert.equal(new JSDOM(dit.bytes.toString()).window.document.querySelectorAll('a[data-dit-note]').length,36);
const report={checkedAt:new Date().toISOString(),revision:deployment.revision,base,redirects,unknownRoute:404,robots:true,chapter5PdfHash:true,ditGuides:36};
await fs.mkdir('artifacts/static-navigation-live-http',{recursive:true});await fs.writeFile('artifacts/static-navigation-live-http/checks.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
