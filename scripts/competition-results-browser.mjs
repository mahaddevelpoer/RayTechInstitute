import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {loadTypescript} from './load-typescript.mjs';
const {resultFeedback}=await loadTypescript('src/lib/competition/result-feedback.ts');
for(const [score,tier,celebrate] of [[0,'practice',false],[4,'practice',false],[5,'building',false],[7,'building',false],[8,'strong',true],[10,'strong',true]]){const value=resultFeedback(score,10);assert.equal(value.tier,tier);assert.equal(value.celebrate,celebrate);}
assert.equal(resultFeedback(20,20,true).celebrate,false);assert.equal(resultFeedback(0,0).percentage,0);
const browser=await chromium.launch({channel:'msedge',headless:true});
try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const score of [0,4,5,7,8,10]){
 await page.goto('http://localhost:4186/competition/results/',{waitUntil:'networkidle'});
 await page.evaluate(score=>sessionStorage.setItem('arena-practice-result',JSON.stringify({displayName:'Local learner',score,completedAt:new Date().toISOString()})),score);
 await page.goto('http://localhost:4186/competition/results/?practice=1',{waitUntil:'networkidle'});
 const result=page.locator('.arena-result');await result.waitFor();
 assert.equal(await page.locator('.arena-confetti i').count(),score>=8?42:0);
 assert.equal(await page.locator('h1').innerText(),resultFeedback(score,10).title);
 assert.match(await page.locator('.arena-result-badges').innerText(),/Not on the leaderboard/);
 for(const width of [360,768,1366]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);}
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1100);
 await page.screenshot({path:`artifacts/competition-preview/screenshots/result-score-${score}.png`,fullPage:true});
 if(score===4){const download=page.waitForEvent('download');await page.getByRole('button',{name:'Save card',exact:true}).click();await (await download).saveAs('artifacts/competition-preview/screenshots/low-score-card.png');await page.setViewportSize({width:360,height:800});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(500);await page.screenshot({path:'artifacts/competition-preview/screenshots/result-low-mobile.png',fullPage:true});}
}
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.arena-confetti i').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS: 0/40/50/70/80/100 percent result feedback, no low-score celebrations, review suppression, reduced motion, 360/768/1366 layouts and low-score share card.');
}finally{await browser.close();}
