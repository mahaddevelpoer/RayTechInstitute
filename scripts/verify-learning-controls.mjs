import assert from'node:assert/strict';import{chromium}from'playwright';
const browser=await chromium.launch({headless:true,args:['--renderer-process-limit=1']});const base='https://raytechinstitute.web.app';
try{
 const page=await browser.newPage({viewport:{width:1366,height:900}});
 await page.addInitScript(()=>{window.__spoken=[];window.speechSynthesis.speak=u=>{window.__spoken.push(u.text);u.onstart?.();};window.speechSynthesis.cancel=()=>{};});
 await page.goto(base+'/learn/python/values-names-and-output/',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Decline Optional',exact:true}).click();
 const oldHeight=await page.locator('main').evaluate(e=>e.clientHeight);
 await page.getByRole('button',{name:'Hide navigation',exact:true}).click();await page.waitForFunction(h=>document.querySelector('main').clientHeight>h,oldHeight);
 assert.equal(await page.locator('#learning-navigation').evaluate(e=>e.inert),true);
 await page.getByRole('button',{name:'Show navigation',exact:true}).click();
 const editor=page.locator('.cm-content').first();await editor.fill('# comment\nstudy_days = 6\nprint(study_days)');
 await page.getByRole('button',{name:'Codi settings',exact:true}).click();await page.locator('.codi-settings').getByRole('combobox',{name:'Voice',exact:true}).selectOption('device');await page.locator('.codi-settings').getByRole('combobox',{name:/Language/}).selectOption('en');await page.getByRole('button',{name:'Close Codi settings',exact:true}).click();
 await editor.locator('.cm-line').nth(1).dblclick();
 await page.waitForFunction(()=>window.__spoken.some(t=>t.includes('study_days = 6')));
 assert.match(await page.getByRole('region',{name:'Selected code explanation'}).innerText(),/assignment/i);
 const before=await page.evaluate(()=>window.__spoken.length);await page.locator('.codi-robot-button').click();await page.waitForFunction(n=>window.__spoken.length>n,before);assert.match(await page.evaluate(()=>window.__spoken.at(-1)),/study_days = 6/);
 await page.setViewportSize({width:360,height:800});await page.locator('.learning-mobile-controls').getByRole('button',{name:'Lesson',exact:true}).click();await page.getByRole('button',{name:'Open compiler',exact:true}).click();assert.equal(await page.locator('.learning-practice-pane').isVisible(),true);await page.locator('.learning-mobile-controls').getByRole('button',{name:'Lesson',exact:true}).click();assert.equal(await page.locator('.learning-lesson').isVisible(),true);
 console.log('[learning-controls] Navbar collapse, selected code narration and mobile one-click compiler passed.');
 const attack=await browser.newPage({viewport:{width:1366,height:900}});let outgoing=0;await attack.route('https://security-canary.invalid/**',route=>{outgoing++;return route.abort();});
 await attack.goto(base+'/learn/javascript/values-and-console-output/',{waitUntil:'domcontentloaded'});
 await attack.getByRole('button',{name:'Decline Optional',exact:true}).click();
 await attack.locator('.cm-content').first().fill('console.log(typeof document);\ntry { await fetch("https://security-canary.invalid/probe"); } catch { console.log("network-blocked"); }\ntry { indexedDB.open("sandbox-probe"); } catch { console.log("storage-blocked"); }');
 await attack.getByRole('button',{name:'Run',exact:true}).click();await attack.waitForFunction(()=>document.querySelector('.learning-output').textContent.includes('storage-blocked'));
 assert.match(await attack.locator('.learning-output').innerText(),/undefined[\s\S]*network-blocked[\s\S]*storage-blocked/);assert.equal(outgoing,0);
 const frame=await(await attack.getByTitle('javascript execution sandbox',{exact:true}).elementHandle()).contentFrame();assert.ok(frame);assert.equal(await frame.evaluate(()=>{try{void parent.document.body;return false;}catch{return true;}}),true);
 console.log('[sandbox] Runtime cannot read parent DOM, access persistent storage or issue network requests.');
}finally{await browser.close();}
