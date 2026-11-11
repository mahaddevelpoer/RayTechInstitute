import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const packages=process.env.CODEX_ARTIFACT_NODE_MODULES;
if(!packages)throw Error('Configured bundled artifact packages are required');
const require=createRequire(path.join(packages,'../package.json'));
const {chromium}=require('playwright');
const root='content/imports/dit-nov11';
const review=JSON.parse(await fs.readFile(root+'/REVIEW.json','utf8'));
const font=(await fs.readFile('public/fonts/noto-naskh-arabic/NotoNaskhArabic.ttf')).toString('base64');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text=s=>s.split(/\n/).filter(Boolean).map(line=>`<span ${/[\u0600-\u06ff]/.test(line)?'lang="ur" dir="rtl"':'lang="en" dir="ltr"'}>${esc(line)}</span>`).join('');
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1','--disable-gpu']});
await fs.mkdir('public/documents/dit/nov11',{recursive:true});
try{
 for(const item of review.missing){
  const bank=JSON.parse(await fs.readFile(root+'/'+item.key+'.json','utf8'));
  const body=bank.sourceSections.map((topic,index)=>`<section class="topic"><h2>${text(topic)}</h2>${bank.questions.filter(q=>q.topic===topic).map(q=>`<section class="question"><p class="prompt">${q.sourceNumber}. ${text(q.question)}</p><table>${[0,2].map(start=>`<tr>${[start,start+1].map(i=>`<td class="${q.correctIndex===i?'correct':''}"><b>${'ABCD'[i]}.</b> ${text(q.options[i])}</td>`).join('')}</tr>`).join('')}</table></section>`).join('')}</section>`).join('');
  const key=`<section class="topic"><h2>Answer key</h2><table class="answer-key">${bank.questions.map(q=>`<tr><td>${q.sourceNumber}</td><td>${'ABCD'[q.correctIndex]}</td><td>${text(q.options[q.correctIndex])}</td></tr>`).join('')}</table></section>`;
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(item.title)} MCQ Revision Notes</title><style>@font-face{font-family:Urdu;src:url(data:font/ttf;base64,${font})} @page{size:A4;margin:13mm 13mm 17mm}*{box-sizing:border-box}body{font:10pt/1.4 Arial;color:#122338}h1{font-size:22pt}h2{font-size:15pt;break-after:avoid}span{display:block;unicode-bidi:isolate}[lang=ur]{font:12pt/1.5 Urdu;text-align:right}.topic{break-before:page}.question{break-inside:avoid;margin-bottom:5mm}.prompt{font-weight:bold}table{width:100%;border-collapse:collapse;table-layout:fixed}td{border:1px solid #b9c6d2;padding:2mm;vertical-align:top;overflow-wrap:anywhere}tr{break-inside:avoid}.correct{background:#fff0b3}.answer-key td:nth-child(1),.answer-key td:nth-child(2){width:8%;text-align:center}.answer-key td:nth-child(3){width:84%}</style></head><body><h1>${esc(item.title)}</h1><p>RayTech Institute | D.I.T Semester 1 | Computer Science</p><p>${esc(item.book)} | Chapter ${item.displayChapter} | ${item.questions} MCQs in ${item.topics} topics</p><p>English and Urdu revision edition. Correct answers are highlighted. Supplied practice material, not an official examination paper.</p>${body}${key}</body></html>`;
  const input=path.resolve('artifacts/dit-nov11/'+item.key+'.html');await fs.writeFile(input,html);
  const page=await browser.newPage();await page.goto(pathToFileURL(input).href);await page.evaluate(()=>document.fonts.ready);
  await page.pdf({path:'public/documents/dit/nov11/'+item.key+'.pdf',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font:8px Arial;width:100%;text-align:center">RayTech Institute | <span class="pageNumber"></span> / <span class="totalPages"></span></div>',tagged:true,outline:true});await page.close();console.log(item.key+': PDF prepared');
 }
}finally{await browser.close();}
