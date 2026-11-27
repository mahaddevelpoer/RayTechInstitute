import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import Markdown from 'react-markdown';
import gfm from 'remark-gfm';
import {chromium} from 'playwright';
const root='content/class11-computer-2027';
const data=JSON.parse(await fs.readFile(root+'/generated.json','utf8'));
const dir='public/documents/class11/computer-2027';
const qa=process.env.CLASS11_QA||'D:/raytech-11cs-20261127/output';
await fs.mkdir(dir,{recursive:true});await fs.mkdir(qa,{recursive:true});
const font=(await fs.readFile('public/fonts/noto-naskh-arabic/NotoNaskhArabic.ttf')).toString('base64');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const browser=await chromium.launch({channel:process.env.CLASS11_BROWSER||'msedge',headless:true,args:['--renderer-process-limit=1','--disable-gpu']});
const manifest={};
const previous=JSON.parse(await fs.readFile(root+'/pdf-manifest.json','utf8').catch(()=>'{}'));
try{
 for(const d of data.documents){
  const saved=previous[d.key];
  if(process.argv.includes('--changed')&&saved?.contentSha256===d.contentSha256&&saved.sourceSha256===data.sourceSha256){
   const bytes=await fs.readFile(path.join(dir,d.key+'.pdf'));
   if(createHash('sha256').update(bytes).digest('hex')===saved.sha256){manifest[d.key]=saved;continue;}
  }
  const rendered=renderToStaticMarkup(React.createElement(Markdown,{remarkPlugins:[gfm]},d.content));
  const body=rendered.replace(/(<h3[^>]*>[\s\S]*?)(?=<h[123][ >]|$)/g,'<section class="answer-block">$1</section>');
  const html=`<!doctype html><html lang="en"><meta charset="utf-8"><title>${esc(d.title)}</title><style>
@font-face{font-family:Urdu;src:url(data:font/ttf;base64,${font})} @page{size:A4;margin:16mm 16mm 20mm}*{box-sizing:border-box}body{font:10.5pt/1.5 Arial,Urdu,sans-serif;color:#162b3e}h1{font-size:23pt;line-height:1.2;border-bottom:3px solid #087f72;padding-bottom:5mm}h2{font-size:16pt;border-bottom:1px solid #b4c8ce;margin-top:8mm}h3{font-size:12pt}h1,h2,h3{break-after:avoid}p{orphans:3;widows:3}a{color:#076d64;overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;font-size:9.5pt}th,td{border:1px solid #afc0c8;padding:2mm;text-align:left;overflow-wrap:anywhere}tr{break-inside:avoid}thead{display:table-header-group}pre{white-space:pre-wrap;overflow-wrap:anywhere;border-left:3px solid #087f72;background:#f0f5f6;padding:3mm;font:9pt/1.4 Consolas,monospace;break-inside:avoid}code{font-family:Consolas,monospace}.answer-block{break-inside:avoid}li{break-inside:avoid}.brand{font-size:10pt;letter-spacing:1px;color:#087f72}.credit{font-size:9pt;color:#465d6d}.watermark{position:fixed;top:45%;left:12%;transform:rotate(-30deg);font:bold 46pt Arial;opacity:.035;z-index:-1}
</style><body><div class="watermark">raytechinstitute.com</div><p class="brand">RAYTECH INSTITUTE | CLASS 11 COMPUTER SCIENCE</p><h1>${esc(d.title)}</h1><p class="credit">ALP 2027 revision edition | Prepared 27 November 2026 | Original study guidance</p>${body}</body></html>`;
  const input=path.resolve(qa,d.key+'.html');await fs.writeFile(input,html);
  const page=await browser.newPage();await page.goto(pathToFileURL(input).href);await page.evaluate(()=>document.fonts.ready);
  const output=path.join(dir,d.key+'.pdf');
  await page.pdf({path:output,preferCSSPageSize:true,printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font:8px Arial;width:100%;text-align:center;color:#425466">raytechinstitute.com | ALP 2027 study edition | <span class="pageNumber"></span> / <span class="totalPages"></span></div>',tagged:true,outline:true});
  await page.close();const bytes=await fs.readFile(output);
  manifest[d.key]={bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),contentSha256:d.contentSha256,sourceSha256:data.sourceSha256,...(d.questionsSha256?{questionsSha256:d.questionsSha256}:{})};
  console.log(d.key+': '+bytes.length+' bytes');
 }
}finally{await browser.close();}
await fs.writeFile(root+'/pdf-manifest.json',JSON.stringify(manifest,null,2)+'\n');
// Existing public links now serve the same retained-only guide bytes.
for(const n of [1,2,3])await fs.copyFile(`${dir}/chapter-${n}.pdf`,`public/documents/class11/nov12/chapter-${n}.pdf`);
