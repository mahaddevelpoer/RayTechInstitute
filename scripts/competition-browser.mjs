import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {chromium} from 'playwright';import sharp from 'sharp';
import {localPrivateQuestions} from './competition-local-fixtures.mjs';import {loadTypescript} from './load-typescript.mjs';
const {competitionPractice}=await loadTypescript('src/lib/competition/practice.ts');
const origin='http://localhost:4186',folder='artifacts/competition-preview/screenshots';await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1','--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[],responses=[];let posts=0;
 page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(request.url().includes('/api/competition')&&request.method()==='POST')posts++;});
 page.on('response',async response=>{if(response.url().includes('/api/competition')&&response.request().method()==='POST'&&response.ok())try{responses.push(await response.json());}catch{}});
 await page.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
 await page.addInitScript(()=>{window.__audioCount=0;const original=window.AudioContext?.prototype.createOscillator;if(original)window.AudioContext.prototype.createOscillator=function(...args){window.__audioCount++;return original.apply(this,args);};});
 for(const route of ['', 'play/', 'practice/', 'leaderboard/', 'results/', 'rules/']){
  await page.goto(origin+'/competition/'+route,{waitUntil:'networkidle'});assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('dialog').count(),0);assert.equal(await page.getByRole('navigation',{name:'Breadcrumb',exact:true}).count(),1);assert.ok(await page.locator('footer').count());
  for(const width of [360,768,1366]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route+' width '+width);}
  await page.screenshot({path:folder+'/page-'+(route.replace('/','')||'home')+'.png',fullPage:true});
 }
 async function enter(){await page.goto(origin+'/competition/play/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Try local ranked demo',exact:true}).click();await page.getByLabel('Display name',{exact:true}).fill('Browser Learner');await page.getByLabel(/I accept the rules/).check();await page.getByRole('button',{name:'Start my attempt',exact:true}).click();await page.locator('.arena-game').waitFor();}
 await page.setViewportSize({width:1366,height:900});await enter();assert.equal(await page.locator('.arena-options button').count(),4);assert.equal(await page.locator('.arena-question h2').count(),1);
 const firstText=await page.locator('.arena-question h2').innerText();const firstResponse=responses.find(response=>response.data?.question);assert.ok(firstResponse);const id=firstResponse.data.id;
 assert.doesNotMatch(JSON.stringify(firstResponse),/correctIndex|"paper"|roundRevision|"uid"/);
 await page.waitForTimeout(1100);assert.ok(Number(await page.locator('.arena-clock strong').innerText())>0);await page.reload({waitUntil:'networkidle'});await enter();assert.equal(await page.locator('.arena-question h2').innerText(),firstText);
 const resumed=responses.filter(response=>response.data?.question).at(-1);assert.equal(resumed.data.deadline,firstResponse.data.deadline);
 await page.screenshot({path:folder+'/ranked-question.png',fullPage:true});
 await page.setViewportSize({width:360,height:800});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:folder+'/ranked-question-mobile.png',fullPage:true});await page.setViewportSize({width:1366,height:900});
 let failedOnce=false;
 await page.route('**/api/competition',async route=>{const request=route.request();if(!failedOnce&&request.method()==='POST'&&request.postDataJSON().action==='answer'){failedOnce=true;return route.abort();}return route.fallback();});
 const first=localPrivateQuestions().find(q=>q.prompt===firstText);await page.locator('.arena-options button').filter({has:page.getByText(first.options[first.correctIndex],{exact:true})}).click();await page.getByRole('button',{name:'Lock answer',exact:true}).click();await page.getByRole('button',{name:'Resume attempt',exact:true}).click();await page.locator('.arena-error').waitFor({state:'detached'});assert.equal(await page.locator('.arena-question h2').innerText(),firstText);
 const seen=new Set();for(let index=0;index<20;index++){
  const prompt=await page.locator('.arena-question h2').innerText();const question=localPrivateQuestions().find(q=>q.prompt===prompt);assert.ok(question);assert.ok(!seen.has(question.id));seen.add(question.id);
  await page.locator('.arena-options button').filter({has:page.getByText(question.options[question.correctIndex],{exact:true})}).click();

  await page.getByRole('button',{name:index===19?'Finish test':'Lock answer',exact:true}).click();
  if(index<19)await page.getByText(`Question ${index+2} of 20`,{exact:true}).waitFor();
 }
 await page.locator('.arena-result').waitFor();await page.waitForFunction(()=>document.querySelector('.arena-counted-score')?.textContent==='20');assert.match(await page.locator('.arena-result-score').innerText(),/20\s*\/20/);assert.match(await page.locator('.arena-result-badges').innerText(),/Ranking releases on result day/);assert.equal(await page.locator('.arena-confetti i').count(),42);assert.match(page.url(),/competition\/results\//);
 await page.screenshot({path:folder+'/ranked-result.png',fullPage:true});
 await page.setViewportSize({width:360,height:800});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:folder+'/ranked-result-mobile.png',fullPage:true});await page.setViewportSize({width:1366,height:900});
 const downloadEvent=page.waitForEvent('download');await page.getByRole('button',{name:'Save card',exact:true}).click();const download=await downloadEvent;await download.saveAs(folder+'/result-card.png');const metadata=await sharp(folder+'/result-card.png').metadata();assert.equal(metadata.width,1200);assert.equal(metadata.height,800);
 for(const response of responses)assert.doesNotMatch(JSON.stringify(response),/correctIndex|"paper"|roundRevision|"events"|"uid"/);
 await page.getByRole('link',{name:'Back to standings',exact:true}).click();await page.locator('.competition-no-result').waitFor();await page.goto(origin+'/competition/play/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Try local ranked demo',exact:true}).click();await page.getByLabel(/I accept the rules/).check();await page.getByRole('button',{name:'Start my attempt',exact:true}).click();await page.locator('.arena-result').waitFor();assert.equal(responses.filter(r=>r.data?.id).at(-1).data.id,id);
 await page.goto(origin+'/competition/practice/',{waitUntil:'networkidle'});const beforePosts=posts;await page.getByRole('button',{name:'Start practice',exact:true}).click();
 for(let index=0;index<10;index++){const prompt=await page.locator('.arena-question h2').innerText();const q=competitionPractice.find(item=>item.prompt===prompt);assert.ok(q);await page.locator('.arena-options button').filter({has:page.getByText(q.options[q.correctIndex],{exact:true})}).click();await page.getByRole('button',{name:index===9?'Finish test':'Lock answer',exact:true}).click();}
 await page.locator('.arena-result').waitFor();assert.match(await page.locator('.arena-result-badges').innerText(),/Not on the leaderboard/);assert.equal(posts,beforePosts,'guest practice never submits a ranked result');assert.ok(!(await page.locator('.arena-result-badges').innerText()).includes('#1'));
 assert.deepEqual(errors,[]);console.log('PASS: six distinct routes, responsive 360/768/1366 layouts, shared footer, no entry dialog, server resume/deadline, failed request recovery, 20/20 private answers, one weekly attempt, result route, confetti, PNG sharing and unranked guest practice.');
}finally{await browser.close();}
