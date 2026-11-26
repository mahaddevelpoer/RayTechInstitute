// Read-only custom-domain verification after an explicitly approved deployment.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
const base='https://raytechinstitute.com';
const expected=process.env.EXPECTED_REVISION;
if(!/^[a-f0-9]{40}$/.test(expected||''))throw Error('Set EXPECTED_REVISION to the reviewed application revision.');
const get=url=>fetch(url,{signal:AbortSignal.timeout(30000)});
async function download(url){
 for(let attempt=0;attempt<3;attempt++){
  try{const response=await fetch(url,{signal:AbortSignal.timeout(45000)});return {response,bytes:Buffer.from(await response.arrayBuffer())};}
  catch(error){if(attempt===2)throw error;console.log('Retrying interrupted download: '+new URL(url).pathname);}
 }
}
const deployment=await(await get(base+'/deployment.json')).json();
if(deployment.revision!==expected)throw Error('Live revision differs from reviewed application source');
const response=await get(base+'/classes/dit-intermediate/');
if(!response.ok)throw Error('DIT class page is not available');
const doc=new JSDOM(await response.text()).window.document;
const canonical=doc.querySelector('link[rel="canonical"]')?.href;
if(canonical!==base+'/classes/dit-intermediate/'||doc.querySelectorAll('h1').length!==1)throw Error('Class canonical or heading mismatch');
if(/noindex/i.test(doc.querySelector('meta[name="robots"]')?.content||''))throw Error('DIT page is unexpectedly noindex');
const hrefs=Array.from(doc.querySelectorAll('a[data-dit-note]'),a=>a.getAttribute('href'));
if(hrefs.length!==36||new Set(hrefs).size!==36)throw Error('Direct chapter-guide count changed');
if(!doc.body.textContent.includes('35 of 35 syllabus modules'))throw Error('Live syllabus coverage is incomplete');
const chapters=[];
for(let offset=0;offset<hrefs.length;offset+=4){
 const batch=await Promise.all(hrefs.slice(offset,offset+4).map(async href=>{
  const result=await get(base+href);const note=new JSDOM(await result.text()).window.document;
  if(!result.ok||note.querySelector('link[rel="canonical"]')?.href!==base+href)throw Error('Missing or mismatched chapter guide: '+href);
  if(note.querySelectorAll('h1').length!==1||/noindex/i.test(note.querySelector('meta[name="robots"]')?.content||''))throw Error('Guide heading/indexability mismatch: '+href);
  return {url:base+href,status:result.status,canonical:true};
 }));chapters.push(...batch);
}
console.log('Verified 36 live guide pages and their canonical URLs.');
const banks=[];
for(const bank of JSON.parse(await fs.readFile('content/dit/study-banks.generated.json','utf8'))){
 const {response:result,bytes}=await download(base+bank.url);
 if(!result.ok||!result.headers.get('content-type')?.includes('application/pdf'))throw Error('PDF response failed: '+bank.id);
 const sha256=createHash('sha256').update(bytes).digest('hex');
 if(sha256!==bank.sha256||bytes.length!==bank.bytes)throw Error('PDF bytes differ from reviewed bank: '+bank.id);
 banks.push({url:base+bank.url,status:result.status,bytes:bytes.length,sha256,questions:bank.questions});
 console.log('Verified bank: '+bank.id);
}
const books=JSON.parse(await fs.readFile('content/dit/completion/study-books.generated.json','utf8'));
const zip=JSON.parse(await fs.readFile('content/dit/completion/practical-download.generated.json','utf8'));
const files=[...books,...books.flatMap(book=>book.sources),zip];
const downloads=[];
for(let offset=0;offset<files.length;offset+=2){
 const batch=await Promise.all(files.slice(offset,offset+2).map(async file=>{
  const {response:result,bytes}=await download(base+file.url);
  if(!result.ok||createHash('sha256').update(bytes).digest('hex')!==file.sha256||(file.bytes!==undefined&&bytes.length!==file.bytes))throw Error('Live download differs from reviewed material: '+file.url);
  if(file.url.endsWith('.pdf')&&(!result.headers.get('content-type')?.includes('application/pdf')||bytes.subarray(0,5).toString()!=='%PDF-'))throw Error('Live guide is not a PDF: '+file.url);
  if(file.url.endsWith('.zip')&&bytes.subarray(0,2).toString()!=='PK')throw Error('Live practical ZIP is invalid');
  return {url:base+file.url,status:result.status,bytes:bytes.length,sha256:file.sha256};
 }));downloads.push(...batch);
 console.log('Verified books, chapter PDFs and ZIP: '+downloads.length+'/'+files.length);
}
const sitemap=await(await get(base+'/sitemap.xml')).text();
if(chapters.some(chapter=>!sitemap.includes(chapter.url)))throw Error('A guide is missing from the live sitemap');
const report={checkedAt:new Date().toISOString(),base,revision:deployment.revision,buildWorkflow:deployment.workflowUrl,classPage:{status:response.status,canonical,h1:1,indexable:true,modules:35},chapters,banks,downloads};
await fs.mkdir('artifacts/dit-study-live',{recursive:true});
await fs.writeFile('artifacts/dit-study-live/http-checks.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({revision:deployment.revision,classPage:true,chapters:chapters.length,banks:banks.length,books:books.length,checkedDownloads:banks.length+downloads.length,sitemap:true}));
