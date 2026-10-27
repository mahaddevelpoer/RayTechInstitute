import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const base='http://127.0.0.1:4183';
const bank=JSON.parse(await fs.readFile('content/imports/dit-ms-word-2016-chapter-2.json','utf8'));
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true,args:['--renderer-process-limit=1','--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[],external=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',route=>{if(route.request().url().startsWith(base+'/'))return route.continue();external.push(new URL(route.request().url()).hostname);return route.abort();});
 await page.goto(base+'/classes/dit-intermediate/dit-computer-science/mcqs/',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:/Chapter 3: Microsoft Word 2016/}).click();
 assert.equal(await page.locator('.mcq-topic-grid>button').count(),10);
 const office=page.locator('.mcq-topic-grid>button').filter({has:page.getByText(bank.sourceSections[0],{exact:true})});
 assert.equal(await office.getAttribute('data-new'),'true');assert.equal(await page.locator('.mcq-topic-grid>[data-new="true"]').count(),10);
 for(const section of bank.sourceSections)assert.equal(await page.getByText(section,{exact:true}).count(),1);
 await fs.mkdir('artifacts/word-mcq-review',{recursive:true});
 for(const width of [360,768,1366])for(const dark of [false,true]){
  await page.setViewportSize({width,height:900});await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);
  const colors=await office.evaluate(element=>({background:getComputedStyle(element).backgroundColor,text:getComputedStyle(element.querySelector('strong')).color}));
  assert.equal(colors.background,dark?'rgb(48, 37, 19)':'rgb(255, 251, 235)');
  assert.equal(colors.text,dark?'rgb(253, 230, 138)':'rgb(120, 53, 15)');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  if(width===360&&!dark||width===1366&&dark)await page.screenshot({path:`artifacts/word-mcq-review/topics-${width}-${dark?'dark':'light'}.png`,fullPage:true});
 }
 const seen=new Set();
 for(const topic of bank.sourceSections){
  await page.locator('.mcq-topic-grid>button').filter({has:page.getByText(topic,{exact:true})}).click();
  for(let i=0;i<10;i++){
   const text=await page.locator('h2 .bilingual-line[lang="en"]').innerText();const item=bank.questions.find(q=>q.question.split('\n')[0]===text);assert.ok(item);assert.equal(item.topic,topic);assert.ok(!seen.has(item.id));seen.add(item.id);
   assert.ok(!(await page.locator('.mcq-page').innerText()).includes('Correct answer:'));
   await page.locator('button[aria-pressed]').filter({has:page.getByText(item.options[item.correctIndex].split('\n')[0],{exact:true})}).click();
   await page.getByRole('button',{name:i===9?'View Result':'Next',exact:true}).click();
  }
  assert.match(await page.locator('.mcq-page').innerText(),/Your score:\s*10\s*\/\s*10/);await page.getByRole('button',{name:'Choose another topic',exact:true}).click();
 }
 assert.equal(seen.size,100);
 await page.getByRole('button',{name:/Chapter 1: Basic Terminologies/}).click();assert.equal(await page.locator('.mcq-topic-grid>button').count(),8);
 await page.getByRole('button',{name:/Chapter 2: MS Office/}).click();assert.equal(await page.locator('.mcq-topic-grid>button').count(),6);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 console.log('PASS: Word chapter, ten source topics and 100/100 shuffled answers; golden cards at 360/768/1366px in both themes. Original chapters preserve 8 and 6 topics. No external requests.');
}finally{await browser.close();}
