import fs from 'node:fs';
const origin='https://raytechinstitute.com',out='artifacts/live-site-audit';
fs.mkdirSync(out,{recursive:true});
async function get(url){try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});return{status:r.status,url:r.url,headers:Object.fromEntries(r.headers),body:await r.text()};}catch(e){return{url,error:e.message};}}
const sitemap=await get(origin+'/sitemap.xml'),robots=await get(origin+'/robots.txt');
fs.writeFileSync(`${out}/robots.txt`,robots.body||robots.error||'');
const urls=[...new Set([...String(sitemap.body).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&')))];
const pages=[];let cursor=0;
await Promise.all(Array.from({length:2},async()=>{while(cursor<urls.length){const url=urls[cursor++],r=await get(url),h=r.body||'';
const tags=[...h.matchAll(/<meta\b[^>]*>/gi)].map(m=>m[0]);
const attr=(tag,name)=>tag?.match(new RegExp(`\\b${name}=["']([^"']*)["']`,'i'))?.[1]||'';
const meta=name=>attr(tags.find(t=>attr(t,'name').toLowerCase()===name),'content');
const schemas=[...h.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m=>{try{return JSON.parse(m[1]);}catch{return{parseError:true};}});
pages.push({url,status:r.status,error:r.error,finalUrl:r.url,title:h.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'',description:meta('description'),robots:meta('robots'),h1:[...h.matchAll(/<h1\b/gi)].length,canonical:attr([...h.matchAll(/<link\b[^>]*>/gi)].map(m=>m[0]).find(t=>attr(t,'rel')==='canonical'),'href'),schemas,bytes:Buffer.byteLength(h),images:[...h.matchAll(/<[i]mg\b[^>]*>/gi)].map(m=>({src:attr(m[0],'src'),alt:attr(m[0],'alt')})),links:[...h.matchAll(/<a\b[^>]*>/gi)].map(m=>attr(m[0],'href')).filter(Boolean),headers:r.headers});
if(pages.length%25===0)console.log(`Audited ${pages.length}/${urls.length}`);
await new Promise(resolve=>setTimeout(resolve,250));}}));
const probes=[];for(const url of ['http://raytechinstitute.com/','https://www.raytechinstitute.com/',origin+'/audit-nonexistent-20261031/',origin+'/email-preferences/']){const r=await get(url);probes.push({...r,body:r.body?.slice(0,400)});}
const result={checkedAt:new Date().toISOString(),sitemapStatus:sitemap.status,sitemapUrls:urls.length,pages,probes};
fs.writeFileSync(`${out}/crawl.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify({pages:pages.length,badStatus:pages.filter(p=>p.status!==200).length,missingMetadata:pages.filter(p=>!p.title||!p.description).length,badH1:pages.filter(p=>p.h1!==1).length,noindexInSitemap:pages.filter(p=>/noindex/i.test(p.robots)).length,truncated:pages.filter(p=>/…/.test(p.title+p.description)).length,schemaErrors:pages.filter(p=>p.schemas.some(s=>s.parseError)).length}));
