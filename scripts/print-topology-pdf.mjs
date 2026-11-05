import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
// Resolve Playwright from the configured artifact runtime, without a local install.
const runtime=process.env.CODEX_ARTIFACT_NODE_MODULES;
if(!runtime)throw Error('Set CODEX_ARTIFACT_NODE_MODULES to the configured bundled Node package directory.');
const require=createRequire(path.join(runtime,'../package.json'));
const {chromium}=require('playwright');
const input=path.resolve('artifacts/network-topology-notes/source.html');
const output=path.resolve('public/documents/dit/computer-networking-chapter-2-network-topology.pdf');
await fs.mkdir(path.dirname(output),{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1','--disable-gpu']});
try{
 const page=await browser.newPage();
 await page.goto(pathToFileURL(input).href,{waitUntil:'load'});
 await page.evaluate(()=>document.fonts.ready);
 await page.pdf({path:output,preferCSSPageSize:true,printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font:8px Arial;width:100%;text-align:center;color:#526477">RayTech Institute | Network Topology | <span class="pageNumber"></span> / <span class="totalPages"></span></div>',tagged:true,outline:true});
 console.log('Created '+output);
}finally{await browser.close();}
