import assert from'node:assert/strict';import fs from'node:fs/promises';import{chromium}from'playwright';import{loadTypescript}from'./load-typescript.mjs';
const {LEARNING_TOPICS,LEARNING_LANGUAGES}=await loadTypescript('src/data/learningCatalog.ts');
const base='https://raytechinstitute.web.app';const browser=await chromium.launch({headless:true,args:['--renderer-process-limit=1']});
const routes=['/courses/','/courses/web-development/','/learn/python/','/classes/','/classes/11th-class/','/classes/11th-class/computer-science/','/classes/11th-class/computer-science/notes/','/classes/11th-class/computer-science/mcqs/','/classes/11th-class/computer-science/past-papers/','/results-gazettes/','/blogs/','/privacy-policy/','/terms-and-conditions/','/about/'];
try{
 const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[];let publicDatabaseReads=0;page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('.supabase.co/rest/v1/'))publicDatabaseReads++;});
 await page.goto(base+'/courses/',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Decline Optional',exact:true}).click();await fs.mkdir('artifacts/resource-pages',{recursive:true});
 for(const [width,dark]of[[1366,false],[360,true]]){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,route);await page.locator('h1').waitFor();assert.equal(await page.locator('h1').count(),1,route);
   const toggle=page.getByRole('button',{name:dark?'Switch to dark theme':'Switch to light theme',exact:true});if(await toggle.count())await toggle.click();await page.waitForTimeout(200);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`overflow: ${route} at ${width}`);
   const main=page.locator('#main-content').first();assert.ok((await main.innerText()).trim().length>70,route);
   assert.doesNotMatch(await main.innerText(),/SQLSTATE|PostgREST|schema cache|Unhandled server exception|github_pat_|sk-or-v1-/i,route);
   if(dark){const rgb=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--bg-main').trim());assert.equal(rgb,'#151515');}
   if(['/courses/','/classes/11th-class/','/classes/11th-class/computer-science/','/privacy-policy/'].includes(route))await page.screenshot({path:`artifacts/resource-pages/${route.replaceAll('/','_')}-${width}.png`});
  }
 }
 await page.goto(base+'/learn/python/',{waitUntil:'domcontentloaded'});assert.equal(await page.locator('.topic-directory>li').count(),LEARNING_TOPICS.filter(t=>t.languageId==='python').length);
 for(const topic of LEARNING_TOPICS.filter(t=>t.videoIds.length)){
  const language=LEARNING_LANGUAGES.find(l=>l.id===topic.languageId);await page.goto(`${base}/learn/${language.slug}/${topic.slug}/`,{waitUntil:'domcontentloaded'});await page.locator('.lesson-attached-videos').waitFor();assert.equal(await page.locator('.lesson-attached-videos .lesson-video').count(),topic.videoIds.length);
  assert.equal(await page.evaluate(()=>!!(document.querySelector('.lesson-attached-videos').compareDocumentPosition(document.querySelector('.lesson-opening'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
 }
 assert.deepEqual(errors,[]);assert.equal(publicDatabaseReads,0);console.log(`[resource-pages] ${routes.length} routes passed in desktop light and mobile charcoal; Python topic count and published video placement matched the catalog. No public database reads.`);
}finally{await browser.close();}
