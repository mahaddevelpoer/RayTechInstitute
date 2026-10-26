// Read-only audit of an existing export. Does not build, crawl APIs or publish.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';

export async function reviewSeoExport(root) {
  const files=[];
  async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else if(entry.name==='index.html')files.push(file);}}
  await walk(root);
  const report={revision:JSON.parse(await fs.readFile(path.join(root,'deployment.json'),'utf8')).revision,pages:files.length,indexable:0,noindex:[],findings:[],duplicates:{titles:[],descriptions:[]},orphans:[],brokenPageLinks:[]};
  const titles=new Map(),descriptions=new Map(),pages=new Map();
  for(const file of files){
    const route='/'+path.relative(root,file).replaceAll(path.sep,'/').replace(/index\.html$/,'');
    const dom=new JSDOM(await fs.readFile(file,'utf8'));const doc=dom.window.document;
    const robots=Array.from(doc.querySelectorAll('meta[name="robots"]')).map(m=>m.content).join(',');
    const privatePage=route.startsWith('/admin/');
    if(privatePage&&!/noindex/i.test(robots))report.findings.push({route,code:'admin-html-indexable',severity:'warning',evidence:robots,qualification:'Live X-Robots-Tag independently protects admin routes.'});
    const indexable=!privatePage&&!/noindex/i.test(robots);
    const canonical=doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
    const links=Array.from(doc.querySelectorAll('a[href]')).map(a=>a.getAttribute('href'));
    pages.set(route,{indexable,canonical,links});
    if(!indexable){report.noindex.push(route);dom.window.close();continue;}
    report.indexable++;
    const add=(code,evidence,severity='warning')=>report.findings.push({route,code,evidence,severity});
    for(const [map,value] of [[titles,doc.title],[descriptions,doc.querySelector('meta[name="description"]')?.content||'']])map.set(value,[...(map.get(value)||[]),route]);
    if(doc.querySelectorAll('h1').length!==1)add('h1-count',doc.querySelectorAll('h1').length,'critical');
    if(doc.querySelectorAll('link[rel="canonical"]').length!==1)add('canonical-count',doc.querySelectorAll('link[rel="canonical"]').length,'critical');
    if(!canonical?.startsWith('https://'))add('canonical-https',canonical,'critical');
    if(!doc.querySelector('meta[property="og:image"]'))add('missing-og-image','No Open Graph image');
    if(!doc.querySelector('meta[name="twitter:image"]'))add('missing-twitter-image','No Twitter image');
    const main=doc.querySelector('.learning-lesson')||doc.querySelector('#main-content')||doc.querySelector('main')||doc.body;
    let previous=0;
    for(const heading of main.querySelectorAll('h1,h2,h3,h4,h5,h6')){const level=Number(heading.tagName.slice(1));if(level>previous+1)add('heading-skip',{from:previous,to:level,text:heading.textContent.trim().slice(0,100)});previous=level;}
    for(const image of doc.images){if(!image.hasAttribute('alt'))add('image-alt',image.src);if(!image.getAttribute('width')||!image.getAttribute('height'))add('image-dimensions',image.src);if(image.src.startsWith('http:'))add('mixed-image',image.src);}
    for(const block of doc.querySelectorAll('script[type="application/ld+json"]')){try{JSON.parse(block.textContent);}catch{add('invalid-jsonld','JSON parsing failed','critical');}}
    dom.window.close();
  }
  for(const [label,map] of [['titles',titles],['descriptions',descriptions]])report.duplicates[label]=Array.from(map).filter(([value,routes])=>value&&routes.length>1).map(([value,routes])=>({value,routes}));
  const origin=new URL(pages.get('/')?.canonical||'https://raytechinstitute.web.app').origin;
  const edges=new Map();
  for(const [route,page] of pages){const targets=[];for(const href of page.links){try{const u=new URL(href,new URL(route,origin));if(u.origin!==origin)continue;const target=u.pathname.replace(/\/+$/,'')+'/';if(pages.has(target))targets.push(target);else if(!path.posix.extname(u.pathname))report.brokenPageLinks.push({route,target});}catch{report.brokenPageLinks.push({route,target:href});}}edges.set(route,targets);}
  const visited=new Set(['/']),queue=['/'];
  while(queue.length){for(const target of edges.get(queue.shift())||[])if(!visited.has(target)){visited.add(target);queue.push(target);}}
  report.orphans=Array.from(pages).filter(([route,page])=>page.indexable&&!visited.has(route)).map(([route])=>route);
  report.qualifications=['Snapshot HTML only; no new export or publication performed.','Image attribute checks do not prove image URL availability.','Live headers and performance require separate evidence; no ranking or Core Web Vitals score is inferred.'];
  return report;
}

if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
  const report=await reviewSeoExport(path.resolve(process.argv[2]||'out'));
  if(process.argv[3])await fs.writeFile(process.argv[3],JSON.stringify(report,null,2));
  console.log(JSON.stringify({revision:report.revision,pages:report.pages,indexable:report.indexable,findings:report.findings.reduce((counts,f)=>(counts[f.code]=(counts[f.code]||0)+1,counts),{}),duplicateTitleGroups:report.duplicates.titles.length,duplicateDescriptionGroups:report.duplicates.descriptions.length,orphans:report.orphans,brokenPageLinks:report.brokenPageLinks},null,2));
}
