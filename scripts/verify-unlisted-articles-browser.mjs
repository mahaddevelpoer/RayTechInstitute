import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {loadTypescript} from './load-typescript.mjs';
const {isArchivedArticleHref}=await loadTypescript('src/utils/article-visibility.ts');
const base=process.env.VERIFY_BASE_URL||'http://127.0.0.1:4178';
const browser=await chromium.launch({...(process.platform==='win32'?{channel:'msedge'}:{}),headless:true});const out='artifacts/article-unlisting';await fs.mkdir(out,{recursive:true});const checks=[];
async function noArchiveAnchors(page){const links=await page.locator('a[href]').evaluateAll(elements=>elements.map(e=>e.getAttribute('href')));assert.equal(links.filter(isArchivedArticleHref).length,0);}
try{
 for(const width of [360,1366]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>localStorage.setItem('raytech_edu_blogs',JSON.stringify([{id:'cached-old-news',slug:'noor-ahmad-explained-learning-guide',title:'Cached Noor Ahmad',category:'sports',content:'Cached article',excerpt:'cached',tags:[],datePublished:'2026-11-27'}])));
  await page.goto(base+'/blogs/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>{const b=document.querySelector('.site-header button[aria-label^="Switch to"]');return b&&!b.disabled;});
  const search=page.getByLabel('Search educational updates');await search.fill('Noor Ahmad');await noArchiveAnchors(page);assert.equal(await page.getByRole('link',{name:'Cached Noor Ahmad',exact:true}).count(),0);
  await search.fill('');await page.getByRole('button',{name:'Education',exact:true}).click();await noArchiveAnchors(page);assert.equal(await page.getByRole('link',{name:'Cached Noor Ahmad',exact:true}).count(),0);assert.equal(await page.getByRole('button',{name:'Sports',exact:true}).count(),0);
  await page.screenshot({path:`${out}/listing-${width}.png`});checks.push({width,listingSearchAndCategoryHideArchive:true,oldBrowserCacheCannotRestoreCards:true});
  for(const route of ['/blogs/noor-ahmad-explained-learning-guide/','/blogs/ssgc-bill-payment-complaint-service-guide/']){
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);assert.equal(await page.locator('h1').count(),1);assert.ok((await page.locator('h1').innerText()).length>20);await noArchiveAnchors(page);assert.equal(await page.getByRole('navigation',{name:'More on this topic'}).count(),0);assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/noindex/);checks.push({width,route,directAccess:200,noArchiveRecommendations:true});
  }
  const syllabus=await page.goto(base+'/smart-syllabus/grade-11/computer-science/',{waitUntil:'domcontentloaded'});assert.equal(syllabus.status(),200);await noArchiveAnchors(page);checks.push({width,syllabusResourceAvailable:true,archiveArticleLinkRemoved:true});
  assert.deepEqual(errors,[]);await page.close();
 }
 await fs.writeFile(out+'/browser-checks.json',JSON.stringify(checks,null,2)+'\n');console.log(JSON.stringify({passed:checks.length}));
}finally{await browser.close();}
