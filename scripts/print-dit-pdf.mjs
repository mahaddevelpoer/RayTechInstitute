import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const input=path.resolve('artifacts/dit-topic-review/source-document.html');
const output=path.resolve('public/documents/dit/computer-networks-chapter-1-basic-terminologies.pdf');
await fs.mkdir(path.dirname(output),{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1']});
try {
 const page=await browser.newPage();await page.goto(pathToFileURL(input).href,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
 await page.pdf({path:output,preferCSSPageSize:true,printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font:9px Arial;width:100%;text-align:center;color:#555">Computer Networks · Chapter 1 · <span class="pageNumber"></span> / <span class="totalPages"></span></div>',tagged:true,outline:true});
 console.log(`PDF created: ${output}`);
} finally { await browser.close(); }
