import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
const base=process.env.VERIFY_BASE_URL||'http://127.0.0.1:4178';
const banks=JSON.parse(await fs.readFile('content/dit/study-banks.generated.json','utf8'));
const directory=path.resolve('artifacts/dit-study-export');await fs.mkdir(directory,{recursive:true});
const browser=await chromium.launch({...(process.platform==='win32'?{channel:'msedge'}:{}),headless:true});
const results=[];
try{
 for(const width of [360,1366])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(`${base}/classes/dit-intermediate/`,{waitUntil:'domcontentloaded'});
  if(!response?.ok())throw Error('DIT export did not load');
  await page.waitForFunction(()=>{const button=document.querySelector('.site-header button[aria-label^="Switch to"]');return button&&!button.disabled;});
  const decline=page.getByRole('button',{name:'Decline Optional',exact:true});if(await decline.isVisible())await decline.click();
  const toggle=page.getByRole('button',{name:theme==='dark'?'Switch to dark theme':'Switch to light theme',exact:true});
  if(await toggle.count())await toggle.click();
  await page.waitForFunction(t=>document.documentElement.classList.contains('dark')===(t==='dark'),theme);
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
  if(await page.locator('h1').count()!==1||await page.locator('details[id^="dit-subject-"]').count()!==5)throw Error('DIT heading or subjects mismatch');
  if(await page.getByRole('link',{name:/^Read .* notes$/}).count()!==19)throw Error('Missing direct chapter guides');
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
  if(width===360&&theme==='light')for(const bank of banks){
   const result=await context.request.get(base+bank.url);if(!result.ok())throw Error('Exported bank missing: '+bank.id);
   if(createHash('sha256').update(await result.body()).digest('hex')!==bank.sha256)throw Error('Exported bank hash mismatch: '+bank.id);
  }
  if(errors.length)throw Error(errors.join('; '));
  results.push({width,theme,canonical,notes:19,subjects:5,overflow:false,pageErrors:errors});await context.close();
 }
 await fs.writeFile(path.join(directory,'checks.json'),JSON.stringify({kind:'actual Next production export',results},null,2));
 console.log(JSON.stringify(results));
}finally{await browser.close();}
