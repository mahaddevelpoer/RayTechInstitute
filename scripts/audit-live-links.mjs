import fs from 'node:fs';
const root='artifacts/live-site-audit',crawl=JSON.parse(fs.readFileSync(`${root}/crawl.json`,'utf8'));
const known=new Set(crawl.pages.map(p=>p.url)),targets=new Map();
for(const page of crawl.pages)for(const href of page.links){
 try{const url=new URL(href,page.url);url.hash='';if(url.origin!=='https://raytechinstitute.com'||url.search||known.has(url.href)||/^\/(admin|api)\//.test(url.pathname))continue;
 if(!targets.has(url.href))targets.set(url.href,[]);targets.get(url.href).push(page.url);
 }catch{}
}
const entries=[...targets],results=[];let index=0;
await Promise.all(Array.from({length:2},async()=>{while(index<entries.length){const [url,from]=entries[index++];try{const r=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(15000)});results.push({url,status:r.status,finalUrl:r.url,from:[...new Set(from)]});}catch(e){results.push({url,error:e.message,from:[...new Set(from)]});}await new Promise(r=>setTimeout(r,200));}}));
fs.writeFileSync(`${root}/links.json`,JSON.stringify(results,null,2));console.log(JSON.stringify({additionalTargets:results.length,failed:results.filter(r=>r.status>=400||r.error)}));
