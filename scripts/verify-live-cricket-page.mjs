import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const base=process.env.VERIFY_BASE_URL||'http://127.0.0.1:4178';
const route='/blogs/pakistan-a-india-a-live-scorecard-rising-stars-2026/';
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||undefined,headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});let frameRequests=0;
 // The interaction check stubs only the third-party body. Live provider reachability
 // and the presence of this fixture are checked separately in the release research.
 await page.route('https://www.ipl.com/widget/matchlist',async request=>{frameRequests++;await request.fulfill({contentType:'text/html',body:'<!doctype html><title>Provider test fixture</title><p>Score feed interaction fixture</p>'});});
 const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
 const decline=page.getByRole('button',{name:'Decline Optional',exact:true});if(await decline.isVisible().catch(()=>false))await decline.click();
 const heading=page.getByRole('heading',{name:'Pakistan A vs India A: live scorecard',exact:true});await heading.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('iframe[title="Automatically updated cricket scores from IPL.com"]'));
 await page.getByRole('button',{name:'Reload scores',exact:true}).waitFor();
 await page.waitForTimeout(500);assert.ok(frameRequests>=1,'The provider frame loads');
 const before=frameRequests;await page.getByRole('button',{name:'Reload scores',exact:true}).click();
 await page.waitForTimeout(700);assert.ok(frameRequests>before,'Reload requests a fresh provider frame');
 assert.equal(await page.locator('h1').count(),1);
 assert.equal(await page.locator('.legacy-compiler-window').count(),0,'The compiler remains absent on blogs');
 assert.match(await page.getByRole('link',{name:'Open full match scorecard'}).getAttribute('href'),/100460\/live$/);
 await fs.mkdir('artifacts/live-cricket',{recursive:true});
 for(const width of [1280,360]){await page.setViewportSize({width,height:900});await heading.scrollIntoViewIfNeeded();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:`artifacts/live-cricket/panel-${width}.png`});}
 await page.goto(base+'/classes/dit-intermediate/dit-ict/',{waitUntil:'domcontentloaded'});assert.equal(await page.locator('iframe[src*="ipl.com"]').count(),0);
 console.log(JSON.stringify({article:route,reload:true,mobileOverflow:false,unrelatedPagesPreserved:true,thirdPartyBody:'stubbed for deterministic interaction check'}));
}finally{await browser.close();}
