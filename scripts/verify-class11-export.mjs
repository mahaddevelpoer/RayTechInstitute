import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
const data=JSON.parse(await fs.readFile('content/class11-computer-2027/generated.json','utf8'));
const pdfs=JSON.parse(await fs.readFile('content/class11-computer-2027/pdf-manifest.json','utf8'));
const base=process.env.VERIFY_BASE_URL||'http://127.0.0.1:4178';
const route='/classes/11th-class/computer-science';
const dir='artifacts/class11-computer-review';await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({...(process.platform==='win32'?{channel:'msedge'}:{}),headless:true,args:['--disable-quic']});
const checks=[];
try{
 for(const width of [360,768,1366,1920])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+route+'/',{waitUntil:'domcontentloaded'});assert.ok(response.ok());
  await page.waitForFunction(()=>{const b=document.querySelector('.site-header button[aria-label^="Switch to"]');return b&&!b.disabled;});
  const decline=page.getByRole('button',{name:'Decline Optional',exact:true});if(await decline.isVisible())await decline.click();
  const toggle=page.getByRole('button',{name:`Switch to ${theme} theme`,exact:true});if(await toggle.count())await toggle.click();
  await page.waitForFunction(t=>document.documentElement.classList.contains('dark')===(t==='dark'),theme);
  assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.study-chapter-card').count(),9);
  assert.match(await page.locator('#class11-alp-heading').innerText(),/ALP 2027/);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://raytechinstitute.com'+route+'/');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`hub overflow ${width} ${theme}`);
  await page.screenshot({path:path.join(dir,`${width}-${theme}-hub.png`)});
  if(width===360&&theme==='light'){
   const titles=[];
   for(const note of data.notes){
    const url=route+'/notes/'+note.id+'/';const r=await context.request.get(base+url);assert.ok(r.ok(),url);const html=await r.text();
    assert.ok(html.includes('https://raytechinstitute.com'+url));assert.ok(html.includes('ALP'));assert.ok(!html.includes('cssaspirants.pk'));
    const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.includes(title),'duplicate note title');titles.push(title);
   }
   for(const paper of data.papers){const r=await context.request.get(base+route+'/past-papers/'+paper.id+'/');assert.ok(r.ok());assert.match(await r.text(),/OLD-COURSE/);}
   for(const [key,pdf] of Object.entries(pdfs)){
    const r=await context.request.get(base+'/documents/class11/computer-2027/'+key+'.pdf');assert.ok(r.ok(),key);assert.equal(createHash('sha256').update(await r.body()).digest('hex'),pdf.sha256);
   }
   for(const chapter of [1,2,3,4,5,6,7,8,9]){
    await page.goto(base+route+'/mcqs/?chapter='+chapter,{waitUntil:'domcontentloaded'});await page.locator('.mcq-topic-grid>button').first().waitFor();
    const text=await page.locator('.mcq-topic-grid').innerText();assert.ok(!/Supplementary|excluded in 2027|Graphical Representation|Object-Oriented|Advanced Python/.test(text));
    await page.getByRole('button',{name:/Mixed chapter practice/}).click();await page.locator('button[aria-pressed]').first().waitFor();assert.equal(await page.locator('button[aria-pressed]').count(),4);
    await page.locator('button[aria-pressed]').first().click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'quiz overflow chapter '+chapter);
   }
   await page.screenshot({path:path.join(dir,'360-chapter9-quiz.png')});
   await page.goto(base+route+'/notes/class11-alp2027-model-paper-solutions/',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'model answer overflow');
   await page.screenshot({path:path.join(dir,'360-model-answers.png')});
  }
  assert.deepEqual(errors,[]);checks.push({width,theme,chapters:9,overflow:false,pageErrors:errors});await context.close();
 }
 await fs.writeFile(dir+'/checks.json',JSON.stringify({kind:'actual production export',notes:11,mcqs:400,legacyPapers:2,pdfs:15,checks},null,2)+'\n');
 console.log(JSON.stringify(checks));
}finally{await browser.close();}
