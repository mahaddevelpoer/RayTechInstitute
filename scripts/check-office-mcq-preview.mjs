import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const base='http://127.0.0.1:4182';
const bank=JSON.parse(await fs.readFile('content/imports/dit-ms-office-chapter-1.json','utf8'));
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true,args:['--renderer-process-limit=1','--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[],external=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',route=>{if(route.request().url().startsWith(base+'/'))return route.continue();external.push(new URL(route.request().url()).hostname);return route.abort();});
 await page.goto(base+'/classes/dit-intermediate/dit-computer-science/mcqs/',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:/Chapter 2: MS Office/}).click();
 assert.equal(await page.locator('.mcq-topic-grid>button').count(),6);
 const office=page.locator('.mcq-topic-grid>button').filter({has:page.getByText(bank.sourceSections[0],{exact:true})});
 assert.equal(await office.getAttribute('data-new'),'true');assert.equal(await page.locator('.mcq-topic-grid>[data-new="true"]').count(),6);
 for(const section of bank.sourceSections)assert.equal(await page.getByText(section,{exact:true}).count(),1);
 await fs.mkdir('artifacts/office-mcq-review',{recursive:true});
 for(const width of [360,768,1366])for(const dark of [false,true]){
  await page.setViewportSize({width,height:900});await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);
  const colors=await office.evaluate(element=>({background:getComputedStyle(element).backgroundColor,text:getComputedStyle(element.querySelector('strong')).color}));
  assert.equal(colors.background,dark?'rgb(48, 37, 19)':'rgb(255, 251, 235)');
  assert.equal(colors.text,dark?'rgb(253, 230, 138)':'rgb(120, 53, 15)');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  if(width===360&&!dark||width===1366&&dark)await page.screenshot({path:`artifacts/office-mcq-review/topics-${width}-${dark?'dark':'light'}.png`,fullPage:true});
 }
 await office.click();assert.match(await page.locator('.mcq-page').innerText(),/Question 1 \/ 10/);
 assert.equal(await page.locator('h2 .bilingual-line[lang="ur"][dir="rtl"]').count(),1);
 assert.equal(await page.locator('button[aria-pressed]').count(),4);
 assert.ok(!(await page.locator('.mcq-page').innerText()).includes('Correct answer:'));
 const first=await page.locator('h2 .bilingual-line[lang="en"]').innerText();await page.locator('button[aria-pressed]').first().click();
 await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByRole('button',{name:'Previous',exact:true}).click();
 assert.equal(await page.locator('h2 .bilingual-line[lang="en"]').innerText(),first);assert.equal(await page.locator('button[aria-pressed="true"]').count(),1);
 await page.getByRole('button',{name:'Change topic',exact:true}).click();await page.getByRole('button',{name:/Chapter 1: Basic Terminologies/}).click();
 assert.equal(await page.locator('.mcq-topic-grid>button').count(),8);assert.equal(await page.locator('.mcq-topic-grid>[data-new="true"]').count(),0);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 console.log('PASS: separate MS Office chapter, six golden topics with ten questions each, original eight networking topics intact, both themes at 360/768/1366px, bilingual RTL and Previous. No external requests.');
}finally{await browser.close();}
