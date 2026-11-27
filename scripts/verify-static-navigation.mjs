import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.VERIFY_BASE_URL||'http://127.0.0.1:4178',baseline=process.argv.includes('--baseline');
const hub='/classes/11th-class/computer-science/',notes=hub+'notes/';
const dir='artifacts/static-navigation';await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({...(process.platform==='win32'?{channel:'msedge'}:{}),headless:true,args:['--disable-quic']});
async function go(page,url){for(let n=0;n<3;n++)try{return await page.goto(url,{waitUntil:'domcontentloaded'});}catch(e){if(n===2||!/ERR_(?:CONNECTION_RESET|NETWORK_CHANGED|QUIC_PROTOCOL_ERROR)/.test(e.message))throw e;}}
const results=[];
try{
 for(const width of baseline?[1366]:[360,1366])for(const theme of baseline?['light']:['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();
  const payloads=[],navigations=[];
  await context.route('**/index.txt*',async route=>{
   if(!route.request().isNavigationRequest()){
    payloads.push(route.request().url());await route.fulfill({status:503,contentType:'text/plain',body:'Deliberately unavailable page data for navigation regression testing.'});
   }else await route.continue();
  });
  page.on('request',r=>{if(r.isNavigationRequest()&&r.frame()===page.mainFrame())navigations.push({url:r.url(),at:Date.now()});});
  await go(page,base+hub);await page.waitForFunction(()=>{const b=document.querySelector('.site-header button[aria-label^="Switch to"]');return b&&!b.disabled;});
  const decline=page.getByRole('button',{name:'Decline Optional',exact:true});if(await decline.isVisible())await decline.click();
  const toggle=page.getByRole('button',{name:`Switch to ${theme} theme`,exact:true});if(await toggle.count())await toggle.click();
  const link=page.locator(`a[href="${notes}?chapter=5"]`).last();await link.scrollIntoViewIfNeeded();
  const clicked=Date.now();await link.click();
  if(baseline){
   await page.waitForURL(u=>u.pathname.endsWith('/index.txt'));
   assert.ok(payloads.some(u=>u.includes('/notes/index.txt')));
   await page.screenshot({path:dir+'/baseline-payload-document.png'});
   results.push({reproduced:true,url:page.url(),failedPayloadRequests:payloads});
  }else{
   await page.waitForURL(u=>u.pathname===notes&&u.searchParams.get('chapter')==='5');
   await page.getByLabel('Chapter',{exact:true}).waitFor();await page.waitForFunction(()=>document.querySelector('select')?.value==='5');
   assert.equal(await page.getByLabel('Chapter',{exact:true}).inputValue(),'5');
   assert.equal(await page.locator('main article.edu-card').count(),1);
   assert.match(await page.locator('main article.edu-card h2').innerText(),/Data Analytics/);
   assert.equal(payloads.length,0,'A page click must not wait for an RSC request');
   const navigation=navigations.find(n=>n.at>=clicked&&n.url.includes('/notes/?chapter=5'));assert.ok(navigation,'Native document navigation did not start');
   results.push({width,theme,chapter:5,failedPayloadRequests:payloads.length,documentNavigationStartedMs:navigation.at-clicked,url:page.url()});
   await page.screenshot({path:dir+`/${width}-${theme}-chapter5.png`});
   await page.goBack({waitUntil:'domcontentloaded'});await page.waitForURL(base+hub);
   await page.locator(`a[href="${notes}?chapter=2"]`).last().click();await page.waitForURL(u=>u.pathname===notes&&u.searchParams.get('chapter')==='2');
   await page.waitForFunction(()=>document.querySelector('select')?.value==='2');assert.equal(await page.getByLabel('Chapter',{exact:true}).inputValue(),'2');
   await go(page,base+notes+'index.txt?chapter=5');
   assert.equal(new URL(page.url()).pathname,notes);assert.equal(new URL(page.url()).searchParams.get('chapter'),'5');
   await page.waitForFunction(()=>document.querySelector('select')?.value==='5');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  await context.close();
 }
 if(!baseline){
  const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();await go(page,base+hub);
  await page.locator(`a[href="${notes}?chapter=5"]`).last().click();await page.waitForURL(u=>u.pathname===notes&&u.searchParams.get('chapter')==='5');
  assert.equal(await page.locator('h1').count(),1);results.push({javaScript:false,documentNavigation:true,url:page.url()});await context.close();
 }
 await fs.writeFile(dir+(baseline?'/baseline.json':'/checks.json'),JSON.stringify({base,mode:baseline?'baseline fault reproduction':'fixed navigation with unavailable page-data service',results},null,2)+'\n');console.log(JSON.stringify(results));
}finally{await browser.close();}
