// Read-only custom-domain verification after an explicitly approved deployment.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
const base='https://raytechinstitute.com';
const expected=process.env.EXPECTED_REVISION;
if(!/^[a-f0-9]{40}$/.test(expected||''))throw Error('Set EXPECTED_REVISION to the reviewed application revision.');
const get=url=>fetch(url,{signal:AbortSignal.timeout(30000)});
const deployment=await(await get(base+'/deployment.json')).json();
if(deployment.revision!==expected)throw Error('Live revision differs from reviewed application source');
const response=await get(base+'/classes/dit-intermediate/');
if(!response.ok)throw Error('DIT class page is not available');
const doc=new JSDOM(await response.text()).window.document;
const canonical=doc.querySelector('link[rel="canonical"]')?.href;
if(canonical!==base+'/classes/dit-intermediate/'||doc.querySelectorAll('h1').length!==1)throw Error('Class canonical or heading mismatch');
if(/noindex/i.test(doc.querySelector('meta[name="robots"]')?.content||''))throw Error('DIT page is unexpectedly noindex');
const hrefs=Array.from(doc.querySelectorAll('a[aria-label^="Read "]'),a=>a.getAttribute('href'));
if(hrefs.length!==19||new Set(hrefs).size!==19)throw Error('Direct chapter-guide count changed');
const chapters=[];
for(let offset=0;offset<hrefs.length;offset+=4){
 const batch=await Promise.all(hrefs.slice(offset,offset+4).map(async href=>{
  const result=await get(base+href);const note=new JSDOM(await result.text()).window.document;
  if(!result.ok||note.querySelector('link[rel="canonical"]')?.href!==base+href)throw Error('Missing or mismatched chapter guide: '+href);
  return {url:base+href,status:result.status,canonical:true};
 }));chapters.push(...batch);
}
const banks=[];
for(const bank of JSON.parse(await fs.readFile('content/dit/study-banks.generated.json','utf8'))){
 const result=await get(base+bank.url);const bytes=Buffer.from(await result.arrayBuffer());
 if(!result.ok||!result.headers.get('content-type')?.includes('application/pdf'))throw Error('PDF response failed: '+bank.id);
 const sha256=createHash('sha256').update(bytes).digest('hex');
 if(sha256!==bank.sha256||bytes.length!==bank.bytes)throw Error('PDF bytes differ from reviewed bank: '+bank.id);
 banks.push({url:base+bank.url,status:result.status,bytes:bytes.length,sha256,questions:bank.questions});
}
const report={checkedAt:new Date().toISOString(),base,revision:deployment.revision,buildWorkflow:deployment.workflowUrl,classPage:{status:response.status,canonical,h1:1,indexable:true},chapters,banks};
await fs.mkdir('artifacts/dit-study-live',{recursive:true});
await fs.writeFile('artifacts/dit-study-live/http-checks.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({revision:deployment.revision,classPage:true,chapters:chapters.length,banks:banks.map(b=>({url:b.url,questions:b.questions,hash:true}))}));
