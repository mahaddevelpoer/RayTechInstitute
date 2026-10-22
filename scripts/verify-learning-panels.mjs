import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--renderer-process-limit=1']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:900}});
 await page.goto('https://raytechinstitute.web.app/learn/python/values-names-and-output/',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Decline Optional',exact:true}).click();
 const topics=page.locator('.learning-topics');const pane=page.locator('.learning-practice-pane');const lesson=page.locator('.learning-lesson');
 await page.evaluate(()=>{window.__panelTransitions=[];document.querySelector('main').addEventListener('transitionrun',e=>window.__panelTransitions.push(e.propertyName));});
 await topics.getByRole('button',{name:'Hide topics',exact:true}).click();assert.equal(await page.locator('#learning-topics-body').isVisible(),false);
 const editor=page.locator('.cm-content').first();await editor.waitFor();await editor.fill('print("preserved after collapse")');
 await pane.getByRole('button',{name:'Hide compiler',exact:true}).click();assert.equal(await page.locator('#learning-practice-body').isVisible(),false);
 await page.waitForFunction(()=>document.querySelector('.learning-lesson').getBoundingClientRect().width>1200);
 assert.ok((await page.evaluate(()=>window.__panelTransitions)).includes('grid-template-columns'),'real grid collapse transition ran');
 await pane.getByRole('button',{name:'Show compiler',exact:true}).click();await editor.waitFor();assert.match(await editor.innerText(),/preserved after collapse/);
 await topics.getByRole('button',{name:'Show topics',exact:true}).click();assert.equal(await page.locator('#learning-topics-body').isVisible(),true);
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>document.documentElement.classList.add('dark'));
 assert.ok(await page.locator('main').evaluate(e=>getComputedStyle(e).transitionDuration.split(',').every(t=>parseFloat(t)<=.001)));
 await topics.getByRole('button',{name:'Hide topics',exact:true}).click();assert.equal(await page.locator('#learning-topics-body').isVisible(),false);
 await topics.getByRole('button',{name:'Show topics',exact:true}).click();await page.emulateMedia({reducedMotion:'no-preference'});
 await page.evaluate(()=>document.documentElement.classList.remove('dark'));
 for(const width of [900,360]){
  await page.setViewportSize({width,height:900});const mobile=page.locator('.learning-mobile-controls');
  if(width===900){await pane.getByRole('button',{name:'Hide compiler',exact:true}).click();assert.equal(await page.locator('#learning-practice-body').isVisible(),false);await pane.getByRole('button',{name:'Show compiler',exact:true}).click();}
  else{await mobile.getByRole('button',{name:'Code & Run',exact:true}).click();assert.equal(await pane.isVisible(),true);assert.equal(await lesson.isVisible(),false);await mobile.getByRole('button',{name:'Lesson',exact:true}).click();assert.equal(await pane.isVisible(),false);}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 console.log('[learning-panels] Desktop independent collapse, retained editor, tablet and mobile controls passed.');
 // This sentence was generated and persisted by the production smoke test.
 // A fresh page may retrieve it, but must never call either AI action.
 const catalog=await(await fetch('https://raytechinstitute.web.app/codi/audio/catalog.json')).json();
 const unit=catalog.units.find(u=>u.hash==='b5353b75671a0f7ddf72a72d94ff06cb1fed86f49a6c1fd9d28b0cca6827bda8');
 if(unit){
  const shared=await browser.newPage({viewport:{width:1366,height:900}});let generations=0,cached=0,cdn=0;
  shared.on('response',r=>{if(r.url().includes('/storage/v1/object/public/codi-lesson-audio/')&&r.status()===200)cdn++;});
  await shared.addInitScript(()=>{window.__sharedAudio=[];const A=window.Audio;window.Audio=function(...args){const a=new A(...args);window.__sharedAudio.push(a);return a;};});
  await shared.route('**/functions/v1/codi-voice',route=>{const action=route.request().postDataJSON().action;if(action!=='cached'){generations++;return route.abort();}cached++;return route.continue();});
  await shared.goto(`https://raytechinstitute.web.app/learn/${unit.course}/${unit.lesson}/`,{waitUntil:'domcontentloaded'});
  await shared.getByRole('button',{name:'Codi settings',exact:true}).click();await shared.locator('.codi-settings').getByRole('combobox',{name:/Language/}).selectOption(unit.language);await shared.getByRole('button',{name:'Close Codi settings',exact:true}).click();
  await shared.getByRole('button',{name:unit.text,exact:true}).first().click();
  await shared.waitForFunction(()=>window.__sharedAudio.at(-1)?.currentTime>.2,undefined,{timeout:25000});
  assert.equal(generations,0);assert.ok(cached+cdn>=1);assert.equal(await shared.locator('.codi-settings').count(),0);
  console.log('[shared-audio] Fresh browser played saved production speech without consent or a generation request.');
 }
}finally{await browser.close();}
