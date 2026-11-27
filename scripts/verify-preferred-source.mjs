import fs from 'node:fs/promises';
import http from 'node:http';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
let server;
let base=process.env.VERIFY_BASE_URL;
const fixture=!base;
if(fixture){
 const code=(await build({entryPoints:['src/utils/preferred-source.ts'],bundle:true,write:false,format:'iife',globalName:'PreferredSourceTest',platform:'browser'})).outputFiles[0].text;
 const config=JSON.parse(await fs.readFile('firebase.json','utf8'));
 const csp=config.hosting.headers.filter(r=>r.source==='**').flatMap(r=>r.headers).find(h=>h.key==='Content-Security-Policy').value;
 server=http.createServer((req,res)=>{
  if(req.url==='/widget-test.js'){res.writeHead(200,{'Content-Type':'text/javascript'});res.end(code+';PreferredSourceTest.mountPreferredSource(document,location.pathname);');return;}
  const noindex=/noor-ahmad|noindex/.test(req.url);
  res.writeHead(200,{'Content-Type':'text/html','Content-Security-Policy':csp});res.end(`<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="${noindex?'noindex':'index'}, follow"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><main><h1>Study resource</h1><p>Educational content</p></main><script src="/widget-test.js"></script></body></html>`);
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port;
}
const browser=await chromium.launch({...(process.platform==='win32'?{channel:'msedge'}:{}),headless:true});
const dir='artifacts/preferred-source';await fs.mkdir(dir,{recursive:true});const checks=[];
try{
 const positives=fixture?['/classes/11th-class/computer-science/notes/widget-test/','/blogs/new-reviewed-education/']:['/classes/11th-class/computer-science/notes/class11-alp2027-chapter-5-study-guide/','/learn/python/','/classes/11th-class/computer-science/past-papers/'];
 for(const width of [360,1366]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of positives){
   const requests=[];page.on('request',r=>{if(r.url()==='https://news.google.com/swg/js/v1/publisher.js')requests.push(r.url());});
   await page.goto(base+route,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!!document.querySelector('[google-add-preferred-source-btn]')?.shadowRoot?.querySelector('publisher-md-outlined-button'),{},{timeout:45000});
   const widget=page.locator('[google-add-preferred-source-btn]');assert.equal(await widget.count(),1);assert.equal(await widget.getAttribute('data-lang'),'en');
   assert.equal(await page.locator('head script[src="https://news.google.com/swg/js/v1/publisher.js"]').count(),1);
   assert.equal(await page.evaluate(()=>document.querySelector('h1').nextElementSibling.hasAttribute('google-add-preferred-source-btn')),true);
   assert.ok(await widget.locator('publisher-md-outlined-button').isVisible(),'Google must render the real widget, not merely an empty placeholder');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
   assert.equal(requests.length,1);await widget.scrollIntoViewIfNeeded();
   await page.screenshot({path:`${dir}/official-${width}-${checks.length}.png`});checks.push({route,width,officialShadowButton:true,scriptCount:1,containerCount:1,belowH1:true});
  }
  for(const route of ['/','/index.html','/blogs/noor-ahmad-explained-learning-guide/','/about/']){
   await page.goto(base+route,{waitUntil:'networkidle'});
   assert.equal(await page.locator('[google-add-preferred-source-btn]').count(),0,route);assert.equal(await page.locator('script[src="https://news.google.com/swg/js/v1/publisher.js"]').count(),0,route);checks.push({route,width,excluded:true});
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 await fs.writeFile(dir+'/checks.json',JSON.stringify({base,fixture,checks},null,2)+'\n');console.log(JSON.stringify({fixture,passed:checks.length,realGoogleWidget:true}));
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
