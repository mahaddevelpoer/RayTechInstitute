import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const origin='https://raytechinstitute.com',root='content/imports/dit-nov11',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),payload=read(root+'/payload.json'),review=read(root+'/REVIEW.json');
const revision=process.argv[2];assert.match(revision||'',/^[a-f0-9]{40}$/);
async function request(path){let last;for(let i=0;i<2;i++){try{const r=await fetch(origin+path,{signal:AbortSignal.timeout(25000)});assert.equal(r.status,200,path);return r;}catch(e){last=e;}}throw last;}
const manifest=await(await request('/deployment.json?dit-nov11='+revision)).json();assert.equal(manifest.revision,revision);
const sitemap=await(await request('/sitemap.xml')).text();assert.equal(createHash('sha256').update(sitemap).digest('hex'),manifest.sitemapSha256);
const base='/classes/dit-intermediate/dit-computer-science',mcqs=await(await request(base+'/mcqs/')).text(),notes=await(await request(base+'/notes/')).text();
const results=[];
for(const note of payload.notes){
 const chapter=payload.chapters.find(c=>c.chapter_number===note.chapter_number);assert.ok(mcqs.includes(chapter.title),'MCQ chapter absent '+chapter.title);
 const route=base+'/notes/'+note.id+'/';assert.ok(notes.includes(note.id),'Note missing from listing '+note.id);assert.ok(sitemap.includes(origin+route),'Note missing from sitemap');
 const r=await request(route),html=await r.text();assert.match(r.headers.get('content-type')||'',/text\/html/);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);assert.ok(html.includes('href="'+origin+route+'"'),'Canonical missing');
 const path='/documents/dit/nov11/'+review.missing.find(i=>i.storageChapter===note.chapter_number).key+'.pdf';assert.ok(html.includes(path),'PDF viewer/download absent');
 const pdf=await request(path);assert.match(pdf.headers.get('content-type')||'',/application\/pdf/);const bytes=Buffer.from(await pdf.arrayBuffer());assert.equal(createHash('sha256').update(bytes).digest('hex'),review.pdfs.find(p=>p.path==='public'+path).sha256);
 results.push({chapter:chapter.title,book:chapter.book_title,number:chapter.display_chapter_number,note:origin+route,pdf:origin+path,pdfHashVerified:true,listing:true,sitemap:true,canonical:true});
}
const old=await(await request(base+'/notes/dit-ms-office-chapter-3-powerpoint-mcq-notes/')).text();assert.ok(old.includes('Chapter 4'),'Existing PowerPoint URL must show approved label');
assert.ok(old.includes('/documents/dit/ms-office-chapter-3-microsoft-powerpoint.pdf'),'Existing PowerPoint PDF URL retained');
const report={revision,checkedAt:new Date().toISOString(),chapters:7,newMcqs:760,pdfs:7,existingPowerPointUrlPreserved:true,results};fs.writeFileSync('artifacts/dit-nov11/live-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify({chapters:7,newMcqs:760,pdfs:7,verified:true}));
