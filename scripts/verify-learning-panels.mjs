import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--renderer-process-limit=1']});
try{
 const page=await browser.newPage({viewport:{width:1366,height:900}});
 await page.goto('https://raytechinstitute.web.app/learn/python/values-names-and-output/',{waitUntil:'domcontentloaded'});
 const controls=page.locator('.learning-desktop-controls');const pane=page.locator('.learning-practice-pane');const lesson=page.locator('.learning-lesson');
 await controls.getByRole('button',{name:'Hide topics',exact:true}).click();assert.equal(await page.locator('.learning-topics').isVisible(),false);
 const editor=page.locator('.cm-content').first();await editor.waitFor();await editor.fill('print("preserved after collapse")');
 await controls.getByRole('button',{name:'Hide compiler',exact:true}).click();assert.equal(await pane.isVisible(),false);assert.ok((await lesson.boundingBox()).width>1200);
 await controls.getByRole('button',{name:'Show compiler',exact:true}).click();assert.match(await editor.innerText(),/preserved after collapse/);
 await controls.getByRole('button',{name:'Show topics',exact:true}).click();assert.equal(await page.locator('.learning-topics').isVisible(),true);
 for(const width of [900,360]){
  await page.setViewportSize({width,height:900});const mobile=page.locator('.learning-mobile-controls');
  if(width===900){await mobile.getByRole('button',{name:'Hide compiler',exact:true}).click();assert.equal(await pane.isVisible(),false);await mobile.getByRole('button',{name:'Show compiler',exact:true}).click();}
  else{await mobile.getByRole('button',{name:'Practice',exact:true}).click();assert.equal(await pane.isVisible(),true);assert.equal(await lesson.isVisible(),false);await mobile.getByRole('button',{name:'Lesson',exact:true}).click();assert.equal(await pane.isVisible(),false);}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 console.log('[learning-panels] Desktop independent collapse, retained editor, tablet and mobile controls passed.');
}finally{await browser.close();}
