// Actual deployed MP3 playback, no model calls, and no local PC browser needed.
import assert from 'node:assert/strict';import{chromium}from'playwright';
const base='https://raytechinstitute.web.app';const index=await(await fetch(base+'/codi/audio/index.json')).json();
if(!index.ready?.length){console.log('[prepared-audio] No recordings deployed yet; actual playback check not run.');process.exit(0);}
const catalog=await(await fetch(base+'/codi/audio/catalog.json')).json();const unit=catalog.units.find(u=>u.language==='ur'&&index.ready.includes(u.hash)&&u.text.length<400)||catalog.units.find(u=>index.ready.includes(u.hash));if(!unit)throw Error('Ready audio has no current published sentence');
const browser=await chromium.launch({headless:true,args:['--renderer-process-limit=1']});
try{const page=await browser.newPage({viewport:{width:1366,height:900}});let aiCalls=0;const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__preparedPlayers=[];const A=window.Audio;window.Audio=function(...args){const a=new A(...args);window.__preparedPlayers.push(a);return a;};});
 await page.route('**/functions/v1/codi-voice',route=>{aiCalls++;return route.abort();});
 await page.goto(`${base}/learn/${unit.course}/${unit.lesson}/`,{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Codi settings',exact:true}).waitFor();await page.getByRole('button',{name:'Codi settings',exact:true}).click();await page.locator('.codi-settings').getByRole('combobox',{name:/Language/}).selectOption(unit.language);await page.getByRole('button',{name:'Close Codi settings',exact:true}).click();
 for(const width of [1366,360]){await page.setViewportSize({width,height:900});const before=await page.evaluate(()=>window.__preparedPlayers.length);const started=Date.now();await page.getByRole('button',{name:unit.text,exact:true}).first().click();await page.waitForFunction(n=>window.__preparedPlayers.length>n&&window.__preparedPlayers.at(-1).currentTime>.2,before,{timeout:15000});assert.equal(aiCalls,0,'Prepared audio must not invoke live Gemini');assert.equal(await page.getByRole('dialog',{name:'Codi settings',exact:true}).count(),0,'Prepared audio needs no cloud consent');console.log(JSON.stringify({preparedVoice:unit.language,viewport:width,clickToPlaybackMs:Date.now()-started,liveAiCalls:aiCalls}));}
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
