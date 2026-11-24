// Browser shaping preserves the existing Urdu and English question text.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
const {banks}=JSON.parse(await fs.readFile('artifacts/dit-study-20261124/bank-source.json','utf8'));
const dir=path.resolve('artifacts/dit-study-20261124');
const out=path.resolve('public/documents/dit/mcq-banks');
await fs.mkdir(out,{recursive:true});
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(value,prefix='')=>String(value).split('\n').map((line,index)=>`<div dir="auto">${esc((index===0?prefix:'')+line)}</div>`).join('');
const hash=value=>createHash('sha256').update(value).digest('hex');
const manifest=[];
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1']});
try {
 for(const bank of banks){
  const questions=bank.modules.flatMap(module=>module.questions);
  const html=`<!doctype html><html lang="en"><meta charset="utf-8"><title>DIT ${esc(bank.title)} MCQ Practice Bank</title><style>
  @page{size:A4;margin:18mm 17mm}*{box-sizing:border-box}body{margin:0;color:#0f172a;font:10pt/1.5 Arial,'Segoe UI',sans-serif}h1{font-size:26pt;line-height:1.2;margin:16pt 0}h2{font-size:18pt;line-height:1.3;margin:0 0 14pt}h3{font-size:11pt;margin:0 0 7pt}p{margin:0 0 12pt}li{margin:0 0 6pt}.chapter{break-before:page}.question,.answer{break-inside:avoid;margin:0 0 15pt}.option{margin:4pt 0 0 12pt}.explanation{margin-top:4pt}.watermark{position:fixed;z-index:-1;top:44%;left:10%;transform:rotate(-38deg);color:#eff2f5;font-size:34pt;font-weight:bold;white-space:nowrap}.source{font-size:8pt;overflow-wrap:anywhere}pre{white-space:pre-wrap;font:9pt/1.4 Consolas,monospace}[dir=auto]{unicode-bidi:plaintext}h3 [dir=auto]:lang(ur){font-size:12pt}
  </style><body><div class="watermark">raytechinstitute.com</div><section><p>RAYTECH INSTITUTE / D.I.T FIRST SEMESTER</p><h1>${esc(bank.title)}<br>MCQ Practice Bank</h1><p>${questions.length} published revision questions across ${bank.modules.length} chapters. Snapshot: 24 November 2026.</p><p>Attempt the questions first. Each chapter has a separate answer key with explanations. These same questions are available in the website practice tests.</p><p>These are study and revision questions, not authenticated PBTE past papers or a guarantee of examination questions. This question bank does not replace complete theory notes, practical work or the official course outline.</p><p>Course alignment: PBTE two-year D.I.T, first-semester course outline. The outline defines the syllabus; it is not a full textbook. Original question wording and answer explanations are retained from the website catalog.</p><p>Study resources: https://raytechinstitute.com/classes/dit-intermediate/</p><p class="source">Official course outline: https://www.pbte.edu.pk/Academics/textbooks/2026/DIT/Syllabus%20of%20DIT%2002%20year/1.%20Course%20Content%20DIT%201st%20Semester%20First%20year.pdf</p><h2>Chapters in this bank</h2><ol>${bank.modules.map(m=>`<li>Chapter ${m.number}: ${esc(m.title)} (${m.questions.length} questions)</li>`).join('')}</ol></section>
  ${bank.modules.map(m=>`<section class="chapter"><h2>Chapter ${m.number}: ${esc(m.title)}</h2><p>Practice questions. The answer key follows this chapter.</p>${m.questions.map((q,i)=>`<article class="question" data-question-id="${esc(q.id)}"><h3>${text(q.question,`Q${i+1}. `)}</h3>${q.codeSnippet?`<pre>${esc(q.codeSnippet)}</pre>`:''}${q.options.map((option,j)=>`<div class="option">${text(option,`${String.fromCharCode(65+j)}) `)}</div>`).join('')}</article>`).join('')}</section><section class="chapter"><h2>Chapter ${m.number}: answer key</h2><p>Check your answers after attempting the questions.</p>${m.questions.map((q,i)=>`<article class="answer"><h3>${text(q.options[q.correctIndex],`Q${i+1}. ${String.fromCharCode(65+q.correctIndex)}) `)}</h3><div class="explanation">${text(q.explanation)}</div></article>`).join('')}</section>`).join('')}</body></html>`;
  const htmlPath=path.join(dir,bank.id+'-bank.html');
  await fs.writeFile(htmlPath,html);
  const page=await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
  if(await page.locator('[data-question-id]').count()!==questions.length)throw Error('Print question count mismatch');
  const filename=bank.id+'-mcq-bank.pdf';const file=path.join(out,filename);
  await page.pdf({path:file,preferCSSPageSize:true,printBackground:true,tagged:true,outline:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:`<div style="font:8px Arial;width:100%;padding:0 17mm;color:#475569;display:flex;justify-content:space-between"><span>raytechinstitute.com | ${esc(bank.title)} | 24 Nov 2026</span><span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`});
  await page.close();
  const bytes=await fs.readFile(file);
  manifest.push({id:bank.id,title:bank.title,url:'/documents/dit/mcq-banks/'+filename,questions:questions.length,chapters:bank.modules.length,bytes:bytes.length,sha256:hash(bytes),questionSha256:hash(JSON.stringify(questions)),snapshotDate:'2026-11-24'});
  console.log(`${bank.id}: ${questions.length} questions printed with bilingual shaping.`);
 }
} finally {await browser.close();}
await fs.writeFile('content/dit/study-banks.generated.json',JSON.stringify(manifest,null,2)+'\n');
