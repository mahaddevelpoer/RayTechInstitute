import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1','--disable-gpu']});
const results=[];
try{
 const context=await browser.newContext({acceptDownloads:true});const page=await context.newPage();const errors=[];let publicDatabaseReads=0;
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('.supabase.co/rest/v1/'))publicDatabaseReads++;});
 for(const width of [360,1280]){
  await page.setViewportSize({width,height:850});await page.goto('https://raytechinstitute.com/smart-syllabus/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('a[href^="/smart-syllabus/grade-"]').count(),15);await page.locator('a[href="/smart-syllabus/grade-11/computer-science/"]').click();await page.getByRole('heading',{level:1}).waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.getByRole('button',{name:'Preview document',exact:true}).click();await page.locator('iframe[title="Grade 11 Computer Science and Entrepreneurship smart syllabus 2027"]').waitFor();
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Download PDF',exact:true}).click()]);assert.equal(await download.failure(),null);assert.equal(download.suggestedFilename(),'computer-science.pdf');
  await page.getByRole('button',{name:'Hide preview',exact:true}).click();assert.equal(await page.locator('iframe[title="Grade 11 Computer Science and Entrepreneurship smart syllabus 2027"]').count(),0);
  await page.screenshot({path:`artifacts/smart-syllabus-2027/live-${width}.png`,fullPage:false});results.push({width,resourceNavigation:true,pdfPreview:true,pdfDownload:true,horizontalOverflow:false});
 }
 assert.deepEqual(errors,[]);assert.equal(publicDatabaseReads,0);await fs.writeFile('artifacts/smart-syllabus-2027/live-browser.json',JSON.stringify({results,errors,publicDatabaseReads},null,2));console.log(JSON.stringify({results,errors,publicDatabaseReads}));
}finally{await browser.close();}
