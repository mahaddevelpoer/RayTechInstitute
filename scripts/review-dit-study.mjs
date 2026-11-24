// Component preview only, using real local resources. Never writes production.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import {chromium} from 'playwright';
const require=createRequire(import.meta.url),dir=path.resolve('artifacts/dit-study-20261124/preview');
await fs.mkdir(dir,{recursive:true});
const compiled=await build({entryPoints:['src/components/educational/DitSemesterOverview.tsx'],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react-dom','react/jsx-runtime'],plugins:[{name:'preview-link',setup(b){b.onResolve({filter:/^next\/link$/},()=>({path:'link',namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},()=>({loader:'jsx',contents:'import React from "react"; export default function Link({prefetch,children,...props}) { return <a {...props}>{children}</a> }'}));}}]});
const module={exports:{}};vm.runInNewContext(compiled.outputFiles[0].text,{module,exports:module.exports,require,console,URL});
const css=(await postcss([tailwind('./tailwind.config.ts')]).process(await fs.readFile('src/app/globals.css','utf8'),{from:'src/app/globals.css'})).css;
const markup=renderToStaticMarkup(React.createElement(module.exports.DitSemesterOverview));
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DIT study component preview</title><style>${css}</style><body><main style="max-width:1120px;margin:auto;padding:20px"><h1 class="text-3xl font-bold">D.I.T first semester study resources</h1>${markup}</main></body></html>`;
await fs.writeFile(path.join(dir,'index.html'),html);
const root=path.resolve('public');
const server=http.createServer(async(req,res)=>{
 try{
  if(req.headers.host!=='127.0.0.1:4194'){res.writeHead(403).end();return;}
  const url=new URL(req.url,'http://127.0.0.1:4194');
  if(url.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex,nofollow'}).end(html);return;}
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+path.sep)||!url.pathname.startsWith('/documents/')||!file.endsWith('.pdf')){res.writeHead(404).end();return;}
  res.writeHead(200,{'Content-Type':'application/pdf','X-Content-Type-Options':'nosniff'}).end(await fs.readFile(file));
 }catch{res.writeHead(404).end();}
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(4194,'127.0.0.1',resolve)});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1']});
const checks=[];
try{
 for(const width of [360,1366])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1000},acceptDownloads:true});const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4194/',{waitUntil:'load'});
  await page.evaluate(t=>document.documentElement.classList.toggle('dark',t==='dark'),theme);
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(`Overflow: ${width} ${theme}`);
  if(await page.locator('h1').count()!==1)throw Error('Heading count');
  const small=await page.locator('a').evaluateAll(links=>links.filter(a=>a.getBoundingClientRect().height>0&&a.getBoundingClientRect().height<48).map(a=>a.textContent));
  // Inline source citation is prose, not a task button.
  if(small.some(label=>!label.includes('official PBTE')))throw Error('Small task link: '+small.join(', '));
  await page.screenshot({path:path.join(dir,`${width}-${theme}-top.png`)});
  for(const id of ['dit-ict','ms-office','computer-networks']){
   await page.locator(`#dit-subject-${id}`).scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(dir,`${width}-${theme}-${id}.png`)});
  }
  const unavailable=page.locator('#dit-subject-dit-python');await unavailable.locator('summary').click();
  if(await unavailable.locator('li').count()!==9||await unavailable.locator('a').count()!==0)throw Error('Unpublished Python module links');
  const downloadPromise=page.waitForEvent('download');await page.getByRole('link',{name:'Download Introduction to ICT MCQ bank PDF',exact:true}).click();
  const download=await downloadPromise;const saved=path.join(dir,`${width}-${theme}-download.pdf`);await download.saveAs(saved);
  const banks=JSON.parse(await fs.readFile('content/dit/study-banks.generated.json','utf8'));
  if(createHash('sha256').update(await fs.readFile(saved)).digest('hex')!==banks[0].sha256)throw Error('Download bytes mismatch');
  if(errors.length)throw Error(errors.join(';'));
  checks.push({width,theme,overflow:false,pageErrors:errors,downloadHash:true,pythonModules:9});await context.close();
 }
 await fs.writeFile(path.join(dir,'checks.json'),JSON.stringify({kind:'server-rendered component preview, not a Next production export',checks},null,2));console.log(JSON.stringify(checks));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
