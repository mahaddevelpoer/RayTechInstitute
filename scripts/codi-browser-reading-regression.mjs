import os from 'node:os';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { loadTypescript } from './load-typescript.mjs';
if(os.freemem()<1400*1048576)throw new Error('Browser test skipped to protect available memory.');
const pcm=Buffer.alloc(24000*3*2);for(let i=0;i<pcm.length/2;i++)pcm.writeInt16LE(Math.round(Math.sin(i*2*Math.PI*220/24000)*3000),i*2);
// Transport fixture is a tone, not an assertion of voice/pronunciation quality.
// DOM, gestures, consent, actual HTMLAudioElement and the playback clock are real.
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1','--disable-extensions']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:900}});const requests=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__codiAudio=[];const A=window.Audio;window.Audio=function(...args){const a=new A(...args);window.__codiAudio.push(a);return a;};});
 await page.route('**/functions/v1/codi-voice',async route=>{if(route.request().method()==='OPTIONS'){await route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type','Access-Control-Allow-Methods':'POST, OPTIONS'}});return;}const b=route.request().postDataJSON();requests.push(b);await route.fulfill({json:{audio:pcm.toString('base64'),rate:24000,model:'gemini-2.5-flash-preview-tts'},headers:{'Access-Control-Allow-Origin':'*'}});});
 await page.goto(process.env.CODI_TEST_URL||'http://localhost:4178/',{waitUntil:'domcontentloaded',timeout:20000});
 await page.getByRole('button',{name:'Codi settings',exact:true}).waitFor();
 const paragraph=page.locator('.learning-lesson .markdown-article p').first();const prose=await paragraph.innerText();
 await paragraph.click({position:{x:20,y:10}});assert.equal(requests.length,0);
 await page.getByRole('checkbox',{name:/Allow Gemini voice/}).check();
 await page.waitForFunction(()=>window.__codiAudio.some(a=>a.currentTime>.2),null,{timeout:10000});
 assert.equal(requests.length,1);assert.ok(prose.includes(requests[0].text));
 await page.getByRole('button',{name:'Stop',exact:true}).click();
 await page.getByRole('button',{name:'Close Codi settings',exact:true}).click();
 const code=page.locator('.learning-lesson pre code').first();await code.scrollIntoViewIfNeeded();
 const target=await code.evaluate(element=>{const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);const node=walker.nextNode();const text=node.textContent;const end=Math.max(1,text.indexOf('\n'));const range=document.createRange();range.setStart(node,0);range.setEnd(node,Math.min(end,10));const rect=range.getClientRects()[0];return{x:rect.left+3,y:rect.top+rect.height/2,expected:text.split('\n')[0].trim()};});
 await page.mouse.click(target.x,target.y);await page.waitForFunction(()=>window.__codiAudio.length>=2&&window.__codiAudio.at(-1).currentTime>.2,null,{timeout:10000});
 assert.equal(requests.at(-1).text,target.expected,'HTML code line must reach speech transport intact');
 await page.reload({waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Codi settings',exact:true}).waitFor();
 await page.locator('.learning-lesson .markdown-article p').first().click({position:{x:20,y:10}});
 await page.waitForFunction(()=>window.__codiAudio.some(a=>a.currentTime>.2),null,{timeout:10000});
 assert.equal(await page.getByRole('dialog',{name:'Codi settings'}).count(),0,'consent should not be requested again in the same tab');
 const catalog=await loadTypescript('src/data/learningCatalog.ts');const lessons=[];
 for(const topic of catalog.LEARNING_TOPICS){
   const language=catalog.LEARNING_LANGUAGES.find(l=>l.id===topic.languageId);
   await page.goto(`http://localhost:4178/?readingTest=1&language=${language.slug}&topic=${topic.slug}`,{waitUntil:'domcontentloaded'});
   await page.getByRole('button',{name:'Codi settings',exact:true}).waitFor();
   await page.evaluate(async()=>{await caches.delete('codi-gemini-reading-v2');});
   const prose=page.locator('.learning-lesson .markdown-article p').first();await prose.scrollIntoViewIfNeeded();await prose.click({position:{x:20,y:10}});
   await page.waitForFunction(()=>window.__codiAudio.some(a=>a.currentTime>.2),null,{timeout:10000});
   let codePlayed=false;const snippet=page.locator('.learning-lesson pre code').first();
   if(await snippet.count()){
     await snippet.scrollIntoViewIfNeeded();
     const target=await snippet.evaluate(element=>{const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);const node=walker.nextNode();const text=node.textContent;const end=text.indexOf('\n')<0?text.length:text.indexOf('\n');const r=document.createRange();r.setStart(node,0);r.setEnd(node,Math.min(Math.max(1,end),10));const rect=r.getClientRects()[0];return{x:rect.left+3,y:rect.top+rect.height/2,expected:text.split('\n')[0].trim()};});
     const before=await page.evaluate(()=>window.__codiAudio.length);await page.mouse.click(target.x,target.y);
     await page.waitForFunction(n=>window.__codiAudio.length>n&&window.__codiAudio.at(-1).currentTime>.2,before,{timeout:10000});
     assert.equal(requests.at(-1).text,target.expected,topic.slug+': code was changed before speech');codePlayed=true;
   }
   lessons.push({language:language.slug,topic:topic.slug,prosePlayback:true,codePlayback:codePlayed});
 }
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({firstClickResumesAfterConsent:true,clickedHtmlLine:target.expected,htmlCodeReachesAudioPlayback:true,sameTabConsentSurvivesReload:true,lessons,pageErrors:errors,scope:'Real browser and real media playback with a synthetic PCM transport fixture; no Gemini quota used. Compiler paused for this reading-only test.'},null,2));
}finally{await browser.close();}
