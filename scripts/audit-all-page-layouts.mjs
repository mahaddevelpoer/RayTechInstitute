import fs from 'node:fs';
import {chromium} from 'playwright';
const root='artifacts/live-site-audit';
const urls=JSON.parse(fs.readFileSync(`${root}/crawl.json`,'utf8')).pages.map(p=>p.url);
const file=`${root}/layouts.json`;
const results=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):[];
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--renderer-process-limit=1']});
const context=await browser.newContext({reducedMotion:'reduce'});
const page=await context.newPage();let errors=[];
page.on('pageerror',e=>errors.push(e.message.slice(0,250)));
await page.route('**/*',route=>['media'].includes(route.request().resourceType())?route.abort():route.continue());
try{for(const url of urls){
 if(results.some(r=>r.url===url))continue;
 const record={url,checks:[]};
 try{
  errors=[];await page.setViewportSize({width:390,height:844});
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(450);
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900});await page.waitForTimeout(120);
   const check=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,overflow:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+3||r.left< -3)&&getComputedStyle(e).position!=='fixed';}).slice(0,12).map(e=>({tag:e.tagName,className:String(e.className).slice(0,100),text:e.textContent?.trim().slice(0,80)})),brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.currentSrc).map(i=>i.currentSrc)}));
   record.checks.push(check);
   if(check.documentWidth>width+3)await page.screenshot({path:`${root}/overflow-${results.length}-${width}.png`,fullPage:false});
  }
  record.status=response.status();record.errors=[...new Set(errors)];
 }catch(e){record.error=e.message.slice(0,250);}
 results.push(record);fs.writeFileSync(file,JSON.stringify(results,null,2));
 console.log(`Layout ${results.length}/${urls.length}: ${record.error?'request issue':record.checks.some(c=>c.documentWidth>c.width+3)?'overflow':'checked'}`);
}}finally{await browser.close();}
