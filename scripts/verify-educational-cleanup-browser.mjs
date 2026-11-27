import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {loadTypescript} from './load-typescript.mjs';
const {LEARNING_TOPICS}=await loadTypescript('src/data/learningCatalog.ts');
const topic=LEARNING_TOPICS.find(t=>t.id==='authored-python-002');assert.ok(topic);
const base=process.env.VERIFY_BASE_URL||'http://127.0.0.1:4178';
const out='artifacts/educational-cleanup';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({...(process.platform==='win32'?{channel:'msedge'}:{}),headless:true});
const checks=[];
try{
 for(const width of [360,1366])for(const dark of [false,true]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const [name,route] of [['note','/classes/11th-class/computer-science/notes/class11-alp2027-chapter-5-study-guide/'],['python',`/learn/python/${topic.slug}/`]]){
   await page.goto(base+route,{waitUntil:'domcontentloaded'});
   const decline=page.getByRole('button',{name:'Decline Optional',exact:true});if(await decline.isVisible())await decline.click();
   await page.waitForFunction(()=>{const button=document.querySelector('.site-header button[aria-label^="Switch to"]');return button&&!button.disabled;});
   const toggle=page.getByRole('button',{name:dark?'Switch to dark theme':'Switch to light theme',exact:true});if(await toggle.count())await toggle.click();
   await page.waitForFunction(expected=>document.documentElement.classList.contains('dark')===expected,dark);
   assert.equal(await page.locator('h1').count(),1);await page.getByRole('region',{name:'Quick summary',exact:true}).waitFor();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'No document-level horizontal overflow');
   const summary=page.locator('[data-study-summary]');assert.ok((await summary.innerText()).includes('Published by RayTech Institute'));
   if(name==='python'){
    assert.equal(await page.locator('table caption').textContent(),'Common Python value types');
    assert.equal(await page.evaluate(()=>!!(document.querySelector('[data-study-summary]').compareDocumentPosition(document.querySelector('.learning-practice-invite'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
   }else assert.equal(await summary.locator('time').getAttribute('datetime'),'2026-11-27');
   await page.screenshot({path:`${out}/${name}-${width}-${dark?'dark':'light'}.png`});checks.push({name,width,dark,summaryVisible:true,overflow:false});
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 await fs.writeFile(out+'/browser-checks.json',JSON.stringify(checks,null,2)+'\n');console.log(JSON.stringify({passed:checks.length}));
}finally{await browser.close();}
