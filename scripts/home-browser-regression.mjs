// One bounded browser, no Next build and no model downloads.
import os from 'node:os';
import fs from 'node:fs/promises';
import http from 'node:http';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
if(os.freemem()<1400*1048576)throw new Error('Not enough free memory for the browser check.');
const result=await build({stdin:{resolveDir:process.cwd(),loader:'tsx',contents:`import React from 'react';import{createRoot}from'react-dom/client';import{Hero}from'./src/components/Hero';createRoot(document.getElementById('root')).render(<Hero/>);`},bundle:true,write:false,jsx:'automatic',platform:'browser',define:{'process.env':'{}','process.env.NODE_ENV':'"production"'},plugins:[{name:'link',setup(b){b.onResolve({filter:/^next\/link$/},()=>({path:'link',namespace:'shim'}));b.onLoad({filter:/.*/,namespace:'shim'},()=>({resolveDir:process.cwd(),contents:`import React from'react';export default function Link(p){return React.createElement('a',p,p.children)}`}));}}]});
const sourceCss=(await Promise.all(['src/app/globals.css','src/app/home.css'].map(p=>fs.readFile(p,'utf8')))).join('\n');
const {css}=await postcss([tailwind({content:['./src/components/Hero.tsx'],theme:{extend:{}},plugins:[]})]).process(sourceCss,{from:undefined});
const server=http.createServer(async(req,res)=>{if(/^\/assets\/(avatar|banner)\.jpg$/.test(req.url)){res.setHeader('Content-Type','image/jpeg');res.end(await fs.readFile('public'+req.url));}else if(req.url==='/app.js'){res.setHeader('Content-Type','text/javascript');res.end(result.outputFiles[0].contents);}else if(req.url==='/style.css'){res.setHeader('Content-Type','text/css');res.end(css);}else{res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"></head><body><main id="root"></main><script src="/app.js"></script></body></html>');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1','--disable-extensions']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);await page.getByRole('tab',{name:'Python',exact:true}).waitFor();
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
 const directory=JSON.parse(await fs.readFile('src/data/learningDirectory.json','utf8'));
 for(const width of [360,768,1366]){
  await page.setViewportSize({width,height:900});
  for(const dark of [false,true]){
   await page.evaluate(d=>document.documentElement.classList.toggle('dark',d),dark);
   await page.waitForTimeout(60);
   assert.equal(await page.locator('.home-course-panel pre code').evaluate(e=>getComputedStyle(e).color),dark?'rgb(226, 232, 240)':'rgb(51, 65, 85)','Code must have readable theme contrast');
   for(const track of directory.filter(t=>t.first)){
    await page.getByRole('tab',{name:track.title,exact:true}).click();
    await page.waitForTimeout(250);
    assert.equal(await page.getByRole('tab',{name:track.title,exact:true}).getAttribute('aria-selected'),'true');
    assert.equal(await page.getByRole('link',{name:'Open this lesson'}).getAttribute('href'),`/learn/${track.slug}/${track.first.slug}/`);
    await page.getByRole('tabpanel').getByRole('heading',{name:track.first.title,exact:true}).waitFor();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal page overflow at '+width);
   }
  }
 }
 await page.getByRole('tab',{name:'Python',exact:true}).focus();await page.keyboard.press('ArrowRight');
 assert.equal(await page.locator('[role=tab][aria-selected=true]').evaluate(e=>e===document.activeElement),true);
 await page.keyboard.press('End');assert.equal(await page.getByRole('tab').last().getAttribute('aria-selected'),'true');
 await page.keyboard.press('Home');assert.equal(await page.getByRole('tab').first().getAttribute('aria-selected'),'true');
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.home-course-panel').evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.setViewportSize({width:1366,height:900});await page.evaluate(()=>document.documentElement.classList.remove('dark'));
 await page.waitForTimeout(100);
 await fs.mkdir('artifacts/home',{recursive:true});await page.screenshot({path:'artifacts/home/desktop.png',fullPage:true});
 await page.setViewportSize({width:360,height:900});await page.evaluate(()=>document.documentElement.classList.add('dark'));
 await page.waitForTimeout(100);
 await page.screenshot({path:'artifacts/home/mobile-dark.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log('PASS: five language previews, links, keyboard tabs, 360/768/1366 layouts, light/dark and reduced motion. No browser errors.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
