import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {chromium} from 'playwright';
import {loadTypescript} from './load-typescript.mjs';
const base=process.env.VERIFY_BASE_URL||'https://raytechinstitute.pages.dev';
const canonical=process.env.NEXT_PUBLIC_SITE_URL||'https://raytechinstitute.com';
const local=JSON.parse(await fs.readFile('out/deployment.json','utf8'));
const request=url=>fetch(url,{signal:AbortSignal.timeout(30000)});
let manifest;
for(let attempt=0;attempt<18;attempt++){
 manifest=await(await request(base+'/deployment.json?release-check='+local.revision+'-'+attempt)).json();
 if(manifest.revision===local.revision)break;
 await new Promise(resolve=>setTimeout(resolve,5000));
}
assert.equal(manifest.revision,local.revision,'Cloudflare serves the exact reviewed export after edge propagation');
const sitemap=await(await request(base+'/sitemap.xml')).text();assert.ok(sitemap.includes(canonical+'/blogs/'));assert.ok(!sitemap.includes('.pages.dev'));
for(const route of ['/','/classes/','/courses/','/blogs/','/admin/login/','/competition/','/results-gazettes/']){
 const response=await request(base+route),html=await response.text();assert.equal(response.status,200,route);
 assert.match(response.headers.get('content-type')||'',/text\/html/);
 assert.match(response.headers.get('content-security-policy')||'',/default-src 'self'/);
 assert.equal(response.headers.get('x-content-type-options'),'nosniff');
 assert.equal(response.headers.get('x-raytech-hosting'),'cloudflare-pages','Response must come from Pages rather than proxied Firebase');
 assert.match(response.headers.get('x-robots-tag')||'',/noindex/,'Temporary hostnames must remain out of search');
 assert.ok(html.includes('<html')&&!html.startsWith('1:'),route+' is an HTML document, not a navigation payload');
}
const missing=await request(base+'/this-page-must-not-exist-cloudflare-migration/');assert.equal(missing.status,404,'Missing pages must never return the homepage with HTTP 200');await missing.body?.cancel();
const noteResponse=await request(base+'/classes/dit-intermediate/dit-computer-science/notes/dit-cn-chapter-1-basic-terminologies-mcq-notes/');assert.equal(noteResponse.status,200);
const noteHtml=await noteResponse.text();assert.ok(noteHtml.includes(canonical+'/documents/dit/computer-networks-chapter-1-basic-terminologies.pdf'));assert.ok(!noteHtml.includes('https://raytechinstitute.web.app/documents/'),'Owned PDF downloads must not depend on the retired host');
const pdf=await fetch(base+'/documents/dit/computer-networks-chapter-1-basic-terminologies.pdf',{method:'HEAD',signal:AbortSignal.timeout(30000)});assert.equal(pdf.status,200);assert.match(pdf.headers.get('content-type')||'',/application\/pdf/);
const {LEARNING_TOPICS,LEARNING_LANGUAGES}=await loadTypescript('src/data/learningCatalog.ts');
const browser=await chromium.launch({headless:true,args:['--renderer-process-limit=1']});const results=[];
try{
 for(const [language,code,answer]of [['python','print(6 * 7)','42'],['php','<?php echo 6 * 7;','42'],['javascript','console.log(typeof document); console.log(6 * 7);','42'],['html','<h1>42</h1><script>parent.document.body.innerHTML="blocked"</script>','42'],['css','h1 { color: rgb(27, 79, 155); }','Practice heading']]){
  const lang=LEARNING_LANGUAGES.find(l=>l.id===language),topic=LEARNING_TOPICS.filter(t=>t.languageId===language&&t.status==='published').toSorted((a,b)=>a.order-b.order)[0]||LEARNING_TOPICS.filter(t=>t.languageId===language).toSorted((a,b)=>a.order-b.order)[0];assert.ok(lang&&topic);
  console.log('[cloudflare-workspace] Checking',language);
  const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[],consoleErrors=[],failedRequests=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text().slice(0,1000));});
  page.on('requestfailed',request=>failedRequests.push({path:new URL(request.url()).pathname,error:request.failure()?.errorText}));
  page.on('response',response=>{if(response.status()>=400)failedRequests.push({path:new URL(response.url()).pathname,status:response.status()});});
  try{
  await page.goto(base+'/learn/'+lang.slug+'/'+topic.slug+'/',{waitUntil:'domcontentloaded'});
  const consent=page.getByRole('button',{name:'Decline Optional',exact:true});await consent.waitFor();await consent.click();
  await page.locator('.cm-content').first().fill(code);await page.getByRole('button',{name:'Run',exact:true}).click();
  if(language==='html'||language==='css'){
   const element=await page.getByTitle('Sandboxed page preview',{exact:true}).elementHandle();assert.equal(await element.getAttribute('sandbox'),'');
   const frame=await element.contentFrame();assert.ok(frame);await frame.getByRole('heading',{name:answer,exact:true}).waitFor();
   assert.equal(await frame.locator('script').count(),0,'Preview strips active scripts');
   if(language==='css')assert.equal(await frame.locator('h1').evaluate(e=>getComputedStyle(e).color),'rgb(27, 79, 155)');
  }else{
   await page.waitForFunction(value=>{const text=document.querySelector('.learning-output pre')?.textContent||'';return text.split('\n').some(line=>line.trim()===value)||/error|unavailable|could not|failed|invalid|stopped/i.test(text);},answer,{timeout:90000});
   assert.ok((await page.locator('.learning-output pre').innerText()).split('\n').some(line=>line.trim()===answer),'Compiler must print the exact expected result');
  }
  if(language==='javascript')assert.match(await page.locator('.learning-output').innerText(),/undefined/);
  if(language==='python'){
   const nextTopic=LEARNING_TOPICS.filter(t=>t.languageId===language&&t.id!==topic.id).toSorted((a,b)=>a.order-b.order)[0];
   if(nextTopic){const href='/learn/'+lang.slug+'/'+nextTopic.slug+'/';await page.locator('.learning-topics a[href="'+href+'"]').first().click();await page.waitForURL(base+href);await page.getByRole('heading',{name:nextTopic.title,level:1,exact:true}).waitFor();}
  }
  assert.deepEqual(errors,[],language+' has no unhandled browser errors');
  await page.setViewportSize({width:360,height:800});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  results.push({language,compiled:true,mobileOverflow:false});
  }catch(error){
   await fs.mkdir('artifacts/cloudflare-migration',{recursive:true});
   await fs.writeFile('artifacts/cloudflare-migration/compiler-diagnostic-'+language+'.json',JSON.stringify({language,errors,consoleErrors,failedRequests,output:await page.locator('.learning-output').innerText().catch(()=>''),status:await page.getByRole('status').allTextContents().catch(()=>[])},null,2));
   await page.screenshot({path:'artifacts/cloudflare-migration/compiler-'+language+'.png'}).catch(()=>{});throw error;
  }finally{await page.close();}
 }
}finally{await browser.close();}
await fs.mkdir('artifacts/cloudflare-migration',{recursive:true});
await fs.writeFile('artifacts/cloudflare-migration/live-preview.json',JSON.stringify({revision:local.revision,base,staticRoutes:7,real404:true,previewNoindex:true,compilers:results,limitations:'No claim of signed-in Google account or live AI generation verification.'},null,2));
console.log('[cloudflare-preview]',{staticRoutes:7,real404:true,compilers:results});
