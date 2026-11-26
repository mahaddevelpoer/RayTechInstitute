import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
const base=process.env.VERIFY_BASE_URL||'http://127.0.0.1:4178';
const banks=JSON.parse(await fs.readFile('content/dit/study-banks.generated.json','utf8'));
const books=JSON.parse(await fs.readFile('content/dit/completion/study-books.generated.json','utf8'));
const practicalZip=JSON.parse(await fs.readFile('content/dit/completion/practical-download.generated.json','utf8'));
const directory=path.resolve('artifacts/dit-study-export');await fs.mkdir(directory,{recursive:true});
const browser=await chromium.launch({...(process.platform==='win32'?{channel:'msedge'}:{}),headless:true,args:['--disable-quic']});
const results=[];
async function navigate(page,url){
 for(let attempt=0;attempt<3;attempt++){
  try{return await page.goto(url,{waitUntil:'domcontentloaded'});}
  catch(error){if(attempt===2||!/ERR_(?:CONNECTION_RESET|QUIC_PROTOCOL_ERROR|NETWORK_CHANGED)/.test(error.message))throw error;}
 }
}
try{
 for(const width of [360,1366])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const response=await navigate(page,`${base}/classes/dit-intermediate/`);
  if(!response?.ok())throw Error('DIT export did not load');
  await page.waitForFunction(()=>{const button=document.querySelector('.site-header button[aria-label^="Switch to"]');return button&&!button.disabled;});
  const decline=page.getByRole('button',{name:'Decline Optional',exact:true});if(await decline.isVisible())await decline.click();
  const toggle=page.getByRole('button',{name:theme==='dark'?'Switch to dark theme':'Switch to light theme',exact:true});
  if(await toggle.count())await toggle.click();
  await page.waitForFunction(t=>document.documentElement.classList.contains('dark')===(t==='dark'),theme);
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
  if(await page.locator('h1').count()!==1||await page.locator('details[id^="dit-subject-"]').count()!==5)throw Error('DIT heading or subjects mismatch');
  if(await page.locator('a[data-dit-note]').count()!==36)throw Error('Missing direct chapter guides/workbook');
  if(await page.getByRole('link',{name:/^Download .* study book PDF$/}).count()!==5)throw Error('Missing full study-book downloads');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(`DIT overflow at ${width} ${theme}`);
  const canonical=await page.locator('link[rel="canonical"]').getAttribute('href');
  if(canonical!=='https://raytechinstitute.com/classes/dit-intermediate/')throw Error('DIT canonical changed');
  await page.screenshot({path:path.join(directory,`${width}-${theme}-top.png`)});
  await page.locator('#dit-subject-ms-office').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(directory,`${width}-${theme}-office.png`)});
  const word=page.getByRole('link',{name:'Read Microsoft Word notes',exact:true});
  const noteHref=await word.getAttribute('href');
  if(!(await context.request.get(base+noteHref)).ok())throw Error('Direct Word note is missing in export');
  const practiceHref=await page.getByRole('link',{name:'Practise Microsoft Word MCQs',exact:true}).getAttribute('href');
  if(new URL(practiceHref,base).searchParams.get('chapter')!=='3')throw Error('Display chapter number leaked into stored resource URL');
  if(width===360&&theme==='light')for(const bank of [...banks,...books,practicalZip]){
   const result=await context.request.get(base+bank.url,{maxRetries:3,timeout:60000});if(!result.ok())throw Error('Exported bank missing: '+bank.id);
   if(createHash('sha256').update(await result.body()).digest('hex')!==bank.sha256)throw Error('Exported bank hash mismatch: '+bank.id);
  }
  if(width===360&&theme==='light'){
   const workbook=await context.request.get(base+'/classes/dit-intermediate/dit-ict/notes/dit-ict-practical-workbook/');
   const workbookHtml=await workbook.text();
   if(!workbook.ok()||!workbookHtml.includes('<title>DIT ICT Practical Workbook &amp; Lab PDF | RayTech Institute</title>'))throw Error('ICT workbook must have its own resource title');
   await navigate(page,base+'/classes/dit-intermediate/dit-python/mcqs/?chapter=1');
   await page.locator('.mcq-topic-grid>button').first().waitFor();
   if(await page.locator('.mcq-topic-grid>button').count()!==4)throw Error('New Python topic filters did not resolve chapter 1');
   await page.locator('.mcq-topic-grid>button').first().click();await page.locator('button[aria-pressed]').first().waitFor();
   if(await page.locator('button[aria-pressed]').count()!==4)throw Error('New Python quiz question did not start');
   await page.locator('.mcq-page h2').scrollIntoViewIfNeeded();
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('New Python quiz overflows on mobile');
   await page.screenshot({path:path.join(directory,'new-python-quiz.png')});
   const os=await context.request.get(base+'/classes/dit-intermediate/dit-operating-systems/notes/dit-complete-os-3-study-guide/');
   if(!os.ok()||!(await os.text()).includes('process-states.svg'))throw Error('New process guide/diagram missing from export');
  }
  if(errors.length)throw Error(errors.join('; '));
  results.push({width,theme,canonical,notes:36,modules:35,studyBooks:5,subjects:5,overflow:false,pageErrors:errors});await context.close();
 }
 await fs.writeFile(path.join(directory,'checks.json'),JSON.stringify({kind:'actual Next production export',results},null,2));
 console.log(JSON.stringify(results));
}finally{await browser.close();}
