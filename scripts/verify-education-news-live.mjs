import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {chromium} from 'playwright';
import {loadTypescript} from './load-typescript.mjs';
const {isArchivedArticleHref}=await loadTypescript('src/utils/article-visibility.ts');
const post=JSON.parse(await fs.readFile('content/editorial-drafts/education-20261128/hec-china-scholarship/post.json','utf8'));
const receipt=JSON.parse(await fs.readFile('docs/reviews/education-news-20261128/build-receipt.json','utf8'));
const base=process.env.VERIFY_BASE_URL||'https://raytechinstitute.com',route='/blogs/'+post.slug+'/';
async function get(path){for(let i=0;i<3;i++)try{const response=await fetch(base+path,{signal:AbortSignal.timeout(45000)});return {response,bytes:Buffer.from(await response.arrayBuffer())};}catch(error){if(i===2)throw error;}}
const deployment=JSON.parse((await get('/deployment.json')).bytes);assert.equal(deployment.revision,receipt.sourceRevision);
const article=await get(route);assert.equal(article.response.status,200);const document=new JSDOM(article.bytes.toString(),{url:base+route}).window.document;
assert.equal(document.querySelectorAll('h1').length,1);assert.equal(document.querySelector('h1').textContent.trim(),post.title);assert.ok(!/noindex/i.test(document.querySelector('meta[name="robots"]')?.content||''));assert.equal(document.querySelector('link[rel="canonical"]').href,base+route);assert.equal(document.querySelector('meta[name="description"]').content,post.seo.description);assert.ok(document.body.textContent.includes(post.excerpt));assert.ok(document.querySelectorAll('table').length>=2);
for(const url of post.seo.sources.split('\n'))assert.ok([...document.querySelectorAll('a[href]')].some(a=>a.href===url));
const copy=document.querySelector('.markdown-article');assert.ok(copy);
const headings=[...copy.querySelectorAll('h2')];
assert.ok(headings.some(h=>h.textContent==='Scholarship highlights / quick facts'));
const faq=headings.find(h=>h.textContent==='Frequently asked questions');assert.ok(faq);
let questions=0;for(let next=faq.nextElementSibling;next&&next.tagName!=='H2';next=next.nextElementSibling)if(next.tagName==='H3')questions++;
assert.equal(questions,4);
for(const url of post.seo.sources.split('\n')){const link=[...copy.querySelectorAll('a[href]')].find(a=>a.href===url);assert.ok(link);assert.equal(link.target,'_blank');assert.ok(link.relList.contains('nofollow'));assert.ok(link.relList.contains('noopener'));}
for(const path of ['/classes/','/classes/11th-class/','/classes/11th-class/computer-science/']){const link=[...copy.querySelectorAll('a[href]')].find(a=>a.pathname===path);assert.ok(link);assert.ok(!link.textContent.startsWith('/'));}
const image=await get(post.featuredImage);assert.equal(image.response.status,200);assert.match(image.response.headers.get('content-type')||'',/image\/png/);assert.equal(createHash('sha256').update(image.bytes).digest('hex'),createHash('sha256').update(await fs.readFile('public'+post.featuredImage)).digest('hex'));
const listing=new JSDOM((await get('/blogs/')).bytes.toString(),{url:base+'/blogs/'}).window.document;assert.ok([...listing.querySelectorAll('a[href]')].some(a=>a.pathname===route));assert.equal([...listing.querySelectorAll('a[href]')].filter(a=>isArchivedArticleHref(a.href)).length,0);assert.ok((await get('/sitemap.xml')).bytes.includes(Buffer.from(base+route)));
const dir='artifacts/education-news-live';await fs.mkdir(dir,{recursive:true});const browser=await chromium.launch({...(process.platform==='win32'?{channel:'msedge'}:{}),headless:true});const views=[];
try{for(const width of [360,1366]){
 const page=await browser.newPage({viewport:{width,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+route,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!document.querySelector('[google-add-preferred-source-btn]')?.shadowRoot?.querySelector('publisher-md-outlined-button'),{},{timeout:45000});assert.equal(await page.locator('[google-add-preferred-source-btn]').count(),1);assert.equal(await page.locator('head script[src="https://news.google.com/swg/js/v1/publisher.js"]').count(),1);assert.equal(await page.evaluate(()=>document.querySelector('h1').nextElementSibling.hasAttribute('google-add-preferred-source-btn')),true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);assert.deepEqual(errors,[]);await page.screenshot({path:`${dir}/article-${width}.png`});views.push({width,officialGoogleWidget:true,belowH1:true,noHorizontalOverflow:true});await page.close();
}}finally{await browser.close();}
const report={checkedAt:new Date().toISOString(),revision:deployment.revision,url:base+route,status:200,indexable:true,inPublicEducationalListing:true,inSitemap:true,sourceLinks:true,coverHash:true,legacyArticlesStillUnlisted:true,views};await fs.writeFile(dir+'/checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
