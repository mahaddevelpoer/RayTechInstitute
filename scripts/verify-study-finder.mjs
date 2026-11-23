import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const origin=process.env.VERIFY_BASE_URL||'http://127.0.0.1:4178';
const navigation=JSON.parse(await fs.readFile('src/data/studyNavigation.json','utf8'));
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||undefined,headless:true});
const results=[];
let page;
try{
 page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await fs.mkdir('artifacts/study-finder-review',{recursive:true});
 const html=await(await fetch(origin+'/classes/')).text();
 for(const s of navigation.directory.filter(s=>s.notes+s.mcqs+s.papers>0))assert.ok(html.includes(`/classes/${s.classSlug}/${s.slug}/`),'Subject must be reachable without JavaScript: '+s.id);
 for(const width of [360,1366])for(const dark of [false,true]){
  await page.setViewportSize({width,height:950});await page.goto(origin+'/classes/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{const b=document.querySelector('.site-header button[aria-label^="Switch to"]');return b&&!b.disabled;});
  const decline=page.getByRole('button',{name:'Decline Optional',exact:true});if(await decline.isVisible())await decline.click();
  const toggle=page.getByRole('button',{name:dark?'Switch to dark theme':'Switch to light theme',exact:true});if(await toggle.count())await toggle.click();
  await page.waitForFunction(value=>document.documentElement.classList.contains('dark')===value,dark);
  const finder=page.locator('.study-finder');
  assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.study-result').count(),navigation.directory.filter(s=>s.notes+s.mcqs+s.papers>0).length);
  await finder.getByLabel('Subject or topic',{exact:true}).fill('network topology');
  await page.waitForFunction(()=>document.querySelectorAll('.study-result').length===1);
  assert.ok((await finder.innerText()).includes('Network Topology'));
  await finder.getByRole('button',{name:'Clear filters',exact:true}).click();
  await finder.getByLabel('Class or program',{exact:true}).selectOption('12th-class');
  await finder.getByRole('heading',{name:'No published resources match these filters',exact:true}).waitFor();
  assert.equal(await page.locator('.study-result a').count(),0);
  await finder.getByRole('button',{name:'Clear filters',exact:true}).click();
  await finder.getByLabel('Subject or topic',{exact:true}).fill('D.I.T ICT');
  await page.waitForFunction(()=>document.querySelectorAll('.study-result').length===1);
  assert.ok((await finder.innerText()).includes('488 MCQs'));assert.ok((await finder.innerText()).includes('7 notes & PDFs'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await finder.scrollIntoViewIfNeeded();await page.screenshot({path:`artifacts/study-finder-review/classes-${width}-${dark?'dark':'light'}.png`});
  const link=finder.locator('a[href="/classes/dit-intermediate/dit-ict/mcqs/?chapter=7"]');assert.equal(await link.count(),1);
  await page.goto(origin+'/',{waitUntil:'domcontentloaded'});await page.locator('.study-quick-find').getByLabel('What are you studying?',{exact:true}).fill('DIT ICT');
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('.home-hero-copy,.home-course-preview')).every(node=>Number(getComputedStyle(node).opacity)>.99));
  await page.screenshot({path:`artifacts/study-finder-review/home-${width}-${dark?'dark':'light'}.png`});
  await Promise.all([page.waitForURL('**/classes/?q=DIT+ICT'),page.locator('.study-quick-find').getByRole('button',{name:'Find resources',exact:true}).click()]);
  await page.waitForFunction(()=>document.querySelector('.study-finder input')?.value==='DIT ICT');
  assert.equal(await page.locator('.study-result').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  results.push({width,dark,search:true,classFilter:true,topicFilter:true,queryLink:true,noOverflow:true,oneH1:true});
 }
 assert.deepEqual(errors,[]);await fs.writeFile('artifacts/study-finder-review/results.json',JSON.stringify({results,crawlableSubjects:true,pageErrors:errors},null,2));
 console.log('[study-finder] Crawlable subject links, class/topic search, deep resource links and homepage GET search passed in four responsive/theme combinations.');
}catch(error){
 if(page){await fs.mkdir('artifacts/study-finder-review',{recursive:true});await page.screenshot({path:'artifacts/study-finder-review/failure.png'}).catch(()=>{});await fs.writeFile('artifacts/study-finder-review/failure.json',JSON.stringify({url:page.url(),error:error.message,filters:await page.locator('.study-finder').innerText().catch(()=>''),results:await page.locator('.study-result').count()},null,2));}
 throw error;
}finally{await browser.close();}
