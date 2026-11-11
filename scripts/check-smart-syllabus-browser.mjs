// Small isolated feature harness: no Next build, no private credentials, no external API calls.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import {chromium} from 'playwright';
import {loadTypescript} from './load-typescript.mjs';
const directory=path.resolve('artifacts/smart-syllabus-2027/browser');await fs.mkdir(directory,{recursive:true});
const rows=JSON.parse(await fs.readFile('content/smart-syllabus-2027/articles.json','utf8'));
const posts=rows.map(p=>({...p,featuredImage:p.featured_image,datePublished:p.date_published,readTime:p.read_time,actionButtonText:p.action_button_text,actionButtonUrl:p.action_button_url}));
const entry=`import React from 'react';import{createRoot}from'react-dom/client';
import SubjectPage,{generateMetadata}from'./src/app/smart-syllabus/[grade]/[subject]/page';
import Directory from './src/app/smart-syllabus/page';import Admin from './src/app/admin/smart-syllabus/page';
const p=location.pathname;let view;
if(p.startsWith('/admin/'))view=<Admin/>;
else if(p==='/smart-syllabus/')view=<Directory/>;
else {const parts=p.split('/').filter(Boolean);const props={params:Promise.resolve({grade:parts[1],subject:parts[2]})};view=await SubjectPage(props);const meta=await generateMetadata(props);document.title=String(meta.title||'');window.__meta=meta;}
createRoot(document.getElementById('root')).render(view);`;
await build({stdin:{resolveDir:process.cwd(),contents:entry,loader:'tsx'},bundle:true,jsx:'automatic',format:'esm',target:'es2022',outfile:path.join(directory,'app.js'),define:{'process.env.NODE_ENV':'"production"','process.env.NEXT_PUBLIC_SITE_URL':'"https://raytechinstitute.com"'},plugins:[{name:'isolated-fixtures',setup(b){b.onResolve({filter:/^(next\/(link|image|navigation)|@\/components\/(Header|Footer)|@\/data\/(staticCatalog|educationalStore))$/},a=>({path:a.path,namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},a=>{
 if(a.path==='next/link')return{resolveDir:process.cwd(),loader:'tsx',contents:`import React from'react';export default function Link({children,prefetch,...props}){return <a {...props}>{children}</a>}`};
 if(a.path==='next/image')return{resolveDir:process.cwd(),loader:'tsx',contents:`import React from'react';export default function Image({priority,alt,width,height,...props}){return <img {...props} alt={alt} width={width} height={height}/>} `};
 if(a.path==='next/navigation')return{contents:`export function notFound(){throw Error('Not found')}`};
 if(a.path.includes('/Header'))return{resolveDir:process.cwd(),loader:'tsx',contents:`import React from'react';export function Header(){return <header style={{padding:16,borderBottom:'1px solid #ccc'}}>RayTech Institute</header>}`};
 if(a.path.includes('/Footer'))return{resolveDir:process.cwd(),loader:'tsx',contents:`import React from'react';export function Footer(){return <footer style={{padding:24}}>RayTech Institute</footer>}`};
 if(a.path.endsWith('staticCatalog'))return{contents:`export const INITIAL_BLOGS=${JSON.stringify(posts)};`};
 return{contents:`let rows=${JSON.stringify(posts)};export const EducationalStore={async syncFromSupabase(){},getBlogs(){return rows},async saveBlog(p){rows=[...rows.filter(r=>r.id!==p.id),p];window.__saved=p},async deleteBlog(id){rows=rows.filter(r=>r.id!==id);window.__deleted=id}};`};
});}}]});
const {default:config}=await loadTypescript('tailwind.config.ts');
const css=await postcss([tailwind({...config,content:['src/app/smart-syllabus/**/*.tsx','src/app/admin/smart-syllabus/*.tsx','src/components/educational/ArticleAttachment.tsx']})]).process(await fs.readFile('src/app/globals.css','utf8'),{from:'src/app/globals.css'});await fs.writeFile(path.join(directory,'style.css'),css.css);
const server=http.createServer(async(req,res)=>{try{const route=new URL(req.url,'http://localhost').pathname;let file;
 if(route==='/app.js'||route==='/style.css')file=path.join(directory,route.slice(1));
 else if(route.startsWith('/documents/')||route.startsWith('/images/'))file=path.resolve('public','.'+route);
 else {res.setHeader('content-type','text/html');res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>');return;}
 if(!file.startsWith(directory+path.sep)&&!file.startsWith(path.resolve('public')+path.sep))throw Error();
 res.setHeader('content-type',file.endsWith('.pdf')?'application/pdf':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'image/webp');res.end(await fs.readFile(file));
}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1','--disable-gpu']});const results=[];
try{
 const context=await browser.newContext({acceptDownloads:true});const errors=[];let external=0;
 await context.route('**/*',async route=>{if(route.request().url().startsWith(base+'/'))return route.continue();external++;return route.abort();});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const width of [360,602,1280]){
  await page.setViewportSize({width,height:850});await page.goto(base+'/smart-syllabus/');await page.locator('h1').waitFor();assert.equal(await page.locator('a[href^="/smart-syllabus/grade-"]').count(),15);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.locator('a[href="/smart-syllabus/grade-11/computer-science/"]').click();await page.locator('h1').waitFor();
  assert.equal(await page.locator('h1').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.getByRole('button',{name:'Preview document',exact:true}).click();await page.locator('iframe').waitFor();assert.match(await page.locator('iframe').getAttribute('src'),/grade-11\/computer-science.pdf/);
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Download PDF',exact:true}).click()]);assert.equal(download.suggestedFilename(),'computer-science.pdf');assert.equal(await download.failure(),null);
  await page.getByRole('button',{name:'Hide preview',exact:true}).click();assert.equal(await page.locator('iframe').count(),0);
  await page.screenshot({path:path.join(directory,`resource-${width}.png`),fullPage:false});results.push({width,directoryCards:15,pdfPreview:true,pdfDownload:true,horizontalOverflow:false});
 }
 for(const row of rows){
  const grade=row.tags.find(t=>t.startsWith('syllabus-grade-')).replace('syllabus-grade-','');const subject=row.tags.find(t=>t.startsWith('syllabus-subject-')).replace('syllabus-subject-','');
  await page.goto(base+`/smart-syllabus/grade-${grade}/${subject}/`);await page.locator('h1').waitFor();
  const meta=await page.evaluate(()=>window.__meta);assert.ok(meta.title.length>=50&&meta.title.length<=60,meta.title);assert.ok(meta.description.length>=120&&meta.description.length<=155,meta.description);
  assert.equal(meta.alternates.canonical,`https://raytechinstitute.com/smart-syllabus/grade-${grade}/${subject}/`);
  const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());assert.equal(schema[0]['@type'],'LearningResource');assert.equal(schema[1]['@type'],'BreadcrumbList');
 }
 await page.evaluate(()=>document.documentElement.classList.add('dark'));await page.screenshot({path:path.join(directory,'resource-dark.png'),fullPage:false});
 await page.goto(base+'/admin/smart-syllabus/');await page.getByText('Published resources (15)',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Edit',exact:true}).first().click();await page.getByLabel('Article title',{exact:true}).fill('Reviewed Physics syllabus');await page.getByRole('button',{name:'Save and publish',exact:true}).click();await page.getByRole('status').waitFor();assert.equal(await page.evaluate(()=>window.__saved.title),'Reviewed Physics syllabus');assert.equal(await page.evaluate(()=>window.__saved.seo.title),'Reviewed Physics syllabus');
 page.on('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Delete',exact:true}).first().click();await page.getByText('Published resources (14)',{exact:true}).waitFor();assert.ok(await page.evaluate(()=>window.__deleted));
 assert.deepEqual(errors,[]);assert.equal(external,0);await fs.writeFile(path.join(directory,'checks.json'),JSON.stringify({results,subjectMetadataAndSchemas:15,adminFixtureEdit:true,adminFixtureDelete:true,externalCalls:external,pageErrors:errors},null,2));console.log(JSON.stringify({results,subjectMetadataAndSchemas:15,adminFixtureEdit:true,adminFixtureDelete:true,externalCalls:external,pageErrors:errors}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
