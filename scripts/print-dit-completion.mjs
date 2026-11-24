import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {chromium} from 'playwright';
const data=JSON.parse(await fs.readFile('content/dit/completion/generated.json','utf8'));
const qa=path.resolve(process.env.DIT_COMPLETION_QA||'D:/raytech-dit-completion/qa');
await fs.mkdir(qa,{recursive:true});
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const manifest={};
const browser=await chromium.launch({...(process.platform==='win32'?{channel:'msedge'}:{}),headless:true,args:['--renderer-process-limit=1']});
try{
 const page=await browser.newPage();
 for(const module of data.modules){
  const note=data.replacements[module.noteId]||data.notes.find(note=>note.id===module.noteId);
  const body=renderToStaticMarkup(React.createElement(ReactMarkdown,{remarkPlugins:[remarkGfm],components:{img:({src,alt})=>React.createElement('img',{src:src?.startsWith('/')?pathToFileURL(path.resolve('public','.'+src)).href:src,alt})},children:note.content}));
  const html=`<!doctype html><html lang="en"><meta charset="utf-8"><title>${esc(module.title)} | DIT study guide</title><style>
  @page{size:A4;margin:18mm 16mm}*{box-sizing:border-box}body{color:#0f172a;font:10pt/1.5 Arial,'Segoe UI',sans-serif;margin:0}h1{font-size:25pt;line-height:1.2}h2{font-size:16pt;line-height:1.3;margin:20pt 0 9pt;break-after:avoid}h3{font-size:11pt;margin:14pt 0 6pt;break-after:avoid}p{margin:0 0 9pt}p,li,h3{unicode-bidi:plaintext;white-space:pre-line}li{margin-bottom:4pt}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:9pt/1.4 Consolas,monospace;background:#f1f5f9;border:1px solid #cbd5e1;padding:10pt;break-inside:avoid}code{font-family:Consolas,monospace}table{border-collapse:collapse;width:100%;font-size:9pt;margin:10pt 0}th,td{border:1px solid #cbd5e1;padding:5pt;text-align:start;overflow-wrap:anywhere}tr{break-inside:avoid}thead{display:table-header-group}a{color:#1b4f9b;overflow-wrap:anywhere}img{display:block;max-width:100%;height:auto;margin:12pt auto;break-inside:avoid}.cover{break-after:page;padding-top:35pt}.cover p{font-size:11pt}.watermark{position:fixed;z-index:-1;top:44%;left:10%;transform:rotate(-38deg);font-size:34pt;color:#f0f3f6;font-weight:bold;white-space:nowrap}
  </style><body><div class="watermark">raytechinstitute.com</div><section class="cover"><p>RAYTECH INSTITUTE / D.I.T FIRST SEMESTER</p><h1>${esc(module.title)}</h1><h2>${esc(module.subject)}${module.extra?' / Practical workbook':' / Module '+module.module}</h2><p>Topic notes, solved answers, revision questions and lab instructions.</p><p>Aligned to the PBTE two-year DIT course outline, pages ${esc(module.pages)}.</p><p>Original study material. This is not an official PBTE textbook, authenticated past paper or guarantee of examination questions.</p><p>Read the theory and attempt the tasks before checking the answers. Configuration/physical work requires the instructor-authorised lab; desktop GUI exercises require their stated environment.</p><p>https://raytechinstitute.com/classes/dit-intermediate/</p><p>Prepared 24 November 2026</p></section><article>${body}</article></body></html>`;
  const input=path.join(qa,module.key+'.html');await fs.writeFile(input,html);
  await page.goto(pathToFileURL(input).href,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'.print-question,li{break-inside:avoid}'});
  await page.evaluate(()=>{
   for(const heading of Array.from(document.querySelectorAll('article h3')).filter(heading=>/^Q\d+\./.test(heading.textContent||''))){
    const group=document.createElement('section');group.className='print-question';heading.parentNode.insertBefore(group,heading);
    let current=heading;
    while(current){const next=current.nextElementSibling;group.appendChild(current);if(!next||next.tagName==='H2'||next.tagName==='H3')break;current=next;}
   }
  });
  const broken=await page.locator('img').evaluateAll(images=>images.filter(image=>!image.complete||!image.naturalWidth).map(image=>image.src));if(broken.length)throw Error('Missing print diagram: '+broken.join(', '));
  const output=path.resolve('public/documents/dit/complete',module.key+'-study-guide.pdf');
  await page.pdf({path:output,preferCSSPageSize:true,printBackground:true,tagged:true,outline:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:`<div style="font:8px Arial;width:100%;padding:0 16mm;color:#475569;display:flex;justify-content:space-between"><span>raytechinstitute.com | ${esc(module.subject)} | ${esc(module.key)}</span><span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`});
  const bytes=await fs.readFile(output);manifest[module.key]={url:'/documents/dit/complete/'+module.key+'-study-guide.pdf',bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),contentSha256:module.contentSha256};
  console.log(`${module.key}: ${bytes.length} bytes`,);
 }
 await page.close();
}finally{await browser.close();}
await fs.writeFile('content/dit/completion/pdf-manifest.json',JSON.stringify(manifest,null,2)+'\n');
