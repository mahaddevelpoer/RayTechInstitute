import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const legacy=JSON.parse(await fs.readFile('content/editorial-policy/legacy-noindex.json','utf8')).articles;
const base=process.env.VERIFY_BASE_URL;
const get=async route=>{
 if(!base)return fs.readFile('out'+route+(route.endsWith('/')?'index.html':''),'utf8');
 for(let attempt=0;attempt<3;attempt++)try{
  const res=await fetch(base+route,{signal:AbortSignal.timeout(45000)});assert.equal(res.status,200,route);assert.ok(!/\bindex\b/i.test((res.headers.get('x-robots-tag')||'').replace(/noindex/gi,'')),'Conflicting header');return await res.text();
 }catch(error){if(attempt===2)throw error;}
};
if(base){
 const receipt=JSON.parse(await fs.readFile('docs/reviews/editorial-indexing-20261127/build-receipt.json','utf8'));
 const deployment=JSON.parse(await get('/deployment.json'));assert.equal(deployment.revision,process.env.EXPECTED_REVISION || receipt.headSha,'Live domain must serve the reviewed source revision');
}
const sitemap=await get('/sitemap.xml');const robots=await get('/robots.txt');
assert.ok(!/^Disallow:\s*\/blogs\/\s*$/mi.test(robots),'Article crawling must stay allowed');
const routes=base?legacy.map(a=>'/blogs/'+a.slug+'/'): (await fs.readdir('out/blogs',{withFileTypes:true})).filter(e=>e.isDirectory()&&e.name!=='post').map(e=>'/blogs/'+e.name+'/');
const legacyHtml=await get('/blogs/post/');assert.match(legacyHtml,/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i,'Legacy article route must be noindex');
const unique=[...new Set(routes)];let checked=0;
// Frozen historical routes removed before this release need not be recreated.
const missing=[];
async function worker(){while(unique.length){const route=unique.shift();let html;try{html=await get(route);}catch(error){if(!base&&error.code==='ENOENT')continue;throw error;}
 assert.ok(!/<meta[^>]*name="googlebot"[^>]*content="[^"]*(?<!no)\bindex\b/i.test(html),route+' contradictory googlebot');
 const noindex=/<meta[^>]*name="robots"[^>]*content="[^"]*noindex[^"]*"/i.test(html);
 if(base||legacy.some(a=>route==='/blogs/'+a.slug+'/')){assert.ok(noindex,route+' requires server-rendered noindex');assert.match(html,/<meta[^>]*name="robots"[^>]*content="[^"]*\bfollow\b/i,route);assert.ok(!sitemap.includes('<loc>https://raytechinstitute.com'+route+'</loc>'),route+' must leave sitemap');checked++;}
}}
await Promise.all(Array.from({length:6},worker));assert.ok(checked>=638,'Expected all existing articles checked');
for(const route of ['/classes/','/classes/dit-intermediate/','/classes/11th-class/computer-science/notes/','/smart-syllabus/']){
 const html=await get(route);assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html),route+' must remain indexable');assert.ok(sitemap.includes('https://raytechinstitute.com'+route),route+' remains in sitemap');
}
const report={checkedAt:new Date().toISOString(),base:base||'out',checkedLegacyArticles:checked,academicSamples:4,robotsAllowsArticles:true,missing};
await fs.mkdir('artifacts/article-indexing',{recursive:true});await fs.writeFile('artifacts/article-indexing/checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
