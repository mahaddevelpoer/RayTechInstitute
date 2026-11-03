// Run against the actual static export on GitHub before Hosting deployment.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {loadTypescript} from './load-typescript.mjs';
const {INITIAL_CLASSES,INITIAL_SUBJECTS,INITIAL_CHAPTERS,INITIAL_NOTES,INITIAL_MCQS}=await loadTypescript('src/data/staticCatalog.ts');
const {academicGroups,programSubjectChoices}=await loadTypescript('src/utils/academic-structure.ts');
const {LEARNING_LANGUAGES}=await loadTypescript('src/data/learningCatalog.ts');
const {programs}=academicGroups(INITIAL_CLASSES);
const program=programs.find(item=>item.title==='DIT')||programs[0];
const choice=program&&programSubjectChoices(program.semesters,INITIAL_SUBJECTS)[0];
const chapter=choice&&INITIAL_CHAPTERS.find(item=>item.isActive&&item.classSlug===choice.classSlug&&item.subjectSlug===choice.slug&&INITIAL_NOTES.some(note=>note.classSlug===choice.classSlug&&note.subjectSlug===choice.slug&&note.chapterNumber===item.chapterNumber)&&INITIAL_MCQS.some(question=>question.classSlug===choice.classSlug&&question.subjectSlug===choice.slug&&question.chapterNumber===item.chapterNumber));
const base=process.env.ACADEMIC_VERIFY_URL||'http://127.0.0.1:4192';
const server=process.env.ACADEMIC_VERIFY_URL?null:spawn(process.execPath,['scripts/preview-static.mjs'],{env:{...process.env,PORT:'4192'},stdio:'ignore'});
let browser;
try {
 let ready=false;
 for(let attempt=0;attempt<40;attempt++){
  try {if((await fetch(base+'/classes/')).ok){ready=true;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,250));
 }
 assert.ok(ready,'Static academic export must be reachable');
 browser=await chromium.launch({headless:true,args:['--renderer-process-limit=1']});
 const page=await browser.newPage();const errors=[];let databaseReads=0;
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(request.url().includes('.supabase.co/rest/v1/'))databaseReads++;});
 await fs.mkdir('artifacts/academic-cards',{recursive:true});
 for(const [width,dark] of [[360,false],[360,true],[1366,false],[1366,true]]){
  await page.setViewportSize({width,height:900});
  await page.goto(base+'/classes/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{const toggle=document.querySelector('.site-header button[aria-label^="Switch to"]');return toggle&&!toggle.disabled;});
  const consent=page.getByRole('button',{name:'Decline Optional',exact:true});if(await consent.isVisible())await consent.click();
  const toggle=page.getByRole('button',{name:dark?'Switch to dark theme':'Switch to light theme',exact:true});if(await toggle.count())await toggle.click();
  await page.waitForFunction(value=>document.documentElement.classList.contains('dark')===value,dark);
  assert.equal(await page.locator('.study-card-hit').count(),2);
  assert.equal(await page.locator('.study-family-card>p').first().evaluate(node=>getComputedStyle(node).webkitLineClamp),'3');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await page.screenshot({path:`artifacts/academic-cards/directory-${width}-${dark?'dark':'light'}.png`});
  await page.getByRole('button',{name:'Explore programming courses',exact:true}).click();
  await page.getByRole('heading',{name:'Choose your programming course',exact:true}).waitFor();
  assert.equal(await page.locator('a.study-option-card[href^="/learn/"]').count(),LEARNING_LANGUAGES.filter(language=>language.state==='published').length);
  await page.getByRole('button',{name:'Back to study areas',exact:true}).click();
  await page.getByRole('button',{name:'Explore academic programs',exact:true}).click();
  if(!program||!choice)continue;
  await page.locator('button.study-option-card').filter({has:page.getByRole('heading',{name:program.title,exact:true})}).click();
  const subject=`/classes/${choice.classSlug}/${choice.slug}/`;
  await page.locator(`a.study-option-card[href="${subject}"]`).click();
  await page.locator('.study-semesters a[aria-current="page"]').waitFor();
  const semester=program.semesters.find(item=>item.slug===choice.classSlug);
  assert.equal((await page.locator('.study-semesters a[aria-current="page"]').innerText()).trim(),`Semester ${semester.semesterNumber}`);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  if(!chapter)continue;
  const number=String(chapter.chapterNumber);
  await page.locator(`.study-chapter-hit[href="${subject}notes/?chapter=${number}"]`).click();
  await page.waitForFunction(value=>Array.from(document.querySelectorAll('select')).some(node=>node.value===value),number);
  assert.equal(new URL(page.url()).searchParams.get('chapter'),number);
  await page.goto(base+subject,{waitUntil:'domcontentloaded'});
  await page.locator(`.course-track-links a[href="${subject}mcqs/?chapter=${number}"]`).click();
  const topics=new Set(INITIAL_MCQS.filter(question=>question.classSlug===choice.classSlug&&question.subjectSlug===choice.slug&&question.chapterNumber===chapter.chapterNumber).map(question=>question.topic?.trim()||'')).size;
  await page.waitForFunction(count=>document.querySelectorAll('.mcq-topic-grid>button').length===count,topics);
  assert.equal(new URL(page.url()).searchParams.get('chapter'),number);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 }
 assert.deepEqual(errors,[]);assert.equal(databaseReads,0);
 console.log('[academic-cards] Whole-card navigation, published program subjects, semester context and available chapter resources passed at 360px/1366px in light/charcoal. No public database reads or page errors.');
}finally {await browser?.close();server?.kill();}
