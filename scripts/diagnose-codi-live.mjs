import os from 'node:os';
import { chromium } from 'playwright';
if (os.freemem() < 1400 * 1048576) throw new Error('Not enough spare memory for one browser; no browser started.');
const browser = await chromium.launch({ channel:'msedge', headless:true, args:['--renderer-process-limit=1','--disable-extensions'] });
try {
  const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[],requests=[],responses=[];
  if(process.env.CODI_FORCE_QUOTA_TEST==='1')await page.route('**/functions/v1/codi-voice',route=>route.fulfill({status:429,json:{error:'Gemini quota reached.'},headers:{'Access-Control-Allow-Origin':'*'}}));
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('/functions/v1/codi-voice')){const b=r.postDataJSON();requests.push({action:b.action,text:b.text,language:b.language,hasGuestId:!!b.guestId});}});
  page.on('response',r=>{if(r.url().includes('/functions/v1/codi-voice'))responses.push({status:r.status()});});
  await page.addInitScript(()=>{
    window.__codiAudio=[];const NativeAudio=window.Audio;
    window.Audio=function(...args){const a=new NativeAudio(...args);window.__codiAudio.push(a);return a;};
    window.__codiSpeech=[];const speak=window.speechSynthesis.speak.bind(window.speechSynthesis);
    window.speechSynthesis.speak=u=>{const entry={text:u.text,started:false,ended:false,error:null};window.__codiSpeech.push(entry);u.addEventListener('start',()=>entry.started=true);u.addEventListener('end',()=>entry.ended=true);u.addEventListener('error',e=>entry.error=e.error);speak(u);};
  });
  await page.goto(process.env.CODI_TEST_URL || 'https://raytechinstitute.web.app/learn/css/how-css-rules-work/',{waitUntil:'domcontentloaded',timeout:25000});
  await page.getByRole('button',{name:'Codi settings',exact:true}).waitFor({timeout:15000});
  const paragraph=page.locator('.learning-lesson .markdown-article p').first();
  await paragraph.waitFor();const text=await paragraph.innerText();await paragraph.click({position:{x:20,y:10}});
  await page.getByRole('checkbox',{name:/Allow Gemini voice/}).check();
  let advanced=false;try{await page.waitForFunction(()=>window.__codiAudio.some(a=>a.currentTime>.25)||window.__codiSpeech.some(s=>s.started),null,{timeout:45000});advanced=true;}catch{}
  const playback=await page.evaluate(()=>window.__codiAudio.map(a=>({time:a.currentTime,duration:Number.isFinite(a.duration)?a.duration:null,paused:a.paused,error:a.error?.code||null})));
  const status=await page.locator('[role=status]').allTextContents();
  const deviceSpeech=await page.evaluate(()=>({voices:window.speechSynthesis.getVoices().length,utterances:window.__codiSpeech}));
  console.log(JSON.stringify({paragraph:text,requests,responses,playback,deviceSpeech,advanced,status,errors},null,2));
  if(!advanced)process.exitCode=1;
} finally {await browser.close();}
