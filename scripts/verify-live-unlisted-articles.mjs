import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {loadTypescript} from './load-typescript.mjs';
const {isArchivedArticleHref}=await loadTypescript('src/utils/article-visibility.ts');
const receipt=JSON.parse(await fs.readFile('docs/reviews/article-unlisting-20261127/build-receipt.json','utf8'));
const archive=JSON.parse(await fs.readFile('content/editorial-policy/legacy-noindex.json','utf8')).articles;
const base=process.env.VERIFY_BASE_URL||'https://raytechinstitute.com';
async function get(route){for(let attempt=0;attempt<3;attempt++)try{const response=await fetch(base+route,{signal:AbortSignal.timeout(45000)});return {response,text:await response.text()};}catch(error){if(attempt===2)throw error;}}
const deployment=JSON.parse((await get('/deployment.json')).text);assert.equal(deployment.revision,receipt.sourceRevision,'Custom domain must serve the exact approved unlisting artifact');
const sitemap=(await get('/sitemap.xml')).text;const robots=(await get('/robots.txt')).text;assert.ok(!/^Disallow:\s*\/blogs\/\s*$/mi.test(robots));
const archivedRoutes=new Set(archive.map(p=>'/blogs/'+p.slug+'/'));
for(const route of archivedRoutes)assert.ok(!sitemap.includes('<loc>'+base+route+'</loc>'));
const routes=new Set([...archivedRoutes,'/blogs/','/blogs/post/','/']);
for(const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)){const url=new URL(match[1]);assert.equal(url.origin,base);routes.add(url.pathname+url.search);}
const queue=[...routes];let checked=0,archived=0;const violations=[];
async function worker(){while(queue.length){const route=queue.shift();const {response,text}=await get(route);assert.equal(response.status,200,route);assert.match(response.headers.get('content-type')||'',/text\/html/,route);
 for(const match of text.matchAll(/<a\b[^>]*\bhref="([^"]*)"/gi)){const href=match[1].replaceAll('&amp;','&');let absolute;try{absolute=new URL(href,base+route).href;}catch{continue;}if(isArchivedArticleHref(absolute))violations.push({route,href});}
 if(archivedRoutes.has(route)){assert.match(text,/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i,route);assert.match(text,/<h1\b/,route);archived++;}checked++;
}}
await Promise.all(Array.from({length:6},worker));assert.equal(archived,archive.length);assert.equal(violations.length,0,'Live public archive links: '+JSON.stringify(violations.slice(0,20)));
const report={checkedAt:new Date().toISOString(),base,revision:deployment.revision,livePublicPagesChecked:checked,directArchivePages200:archived,publicArchiveAnchors:0,archiveExcludedFromSitemap:true,archiveCrawlingAllowed:true};await fs.mkdir('artifacts/article-unlisting-live',{recursive:true});await fs.writeFile('artifacts/article-unlisting-live/checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
