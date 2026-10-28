import assert from'node:assert/strict';import fs from'node:fs/promises';import{chromium}from'playwright';import{loadTypescript}from'./load-typescript.mjs';
const {LEARNING_TOPICS,LEARNING_LANGUAGES}=await loadTypescript('src/data/learningCatalog.ts');
const base=process.env.NEXT_PUBLIC_SITE_URL||'https://raytechinstitute.web.app';const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||undefined,headless:true,args:['--renderer-process-limit=1']});
const routes=['/','/courses/','/courses/web-development/','/learn/python/','/classes/','/classes/11th-class/','/classes/11th-class/computer-science/','/classes/11th-class/computer-science/notes/','/classes/11th-class/computer-science/mcqs/','/classes/11th-class/computer-science/past-papers/','/results-gazettes/','/blogs/','/privacy-policy/','/terms-and-conditions/','/about/'];
try{
 const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[];let publicDatabaseReads=0;page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('.supabase.co/rest/v1/'))publicDatabaseReads++;});
 await page.goto(base+'/courses/',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Decline Optional',exact:true}).click();await fs.mkdir('artifacts/resource-pages',{recursive:true});
 for(const [width,dark]of[[1366,false],[360,true]]){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,route);await page.locator('h1').waitFor();assert.equal(await page.locator('h1').count(),1,route);
   const toggle=page.getByRole('button',{name:dark?'Switch to dark theme':'Switch to light theme',exact:true});if(await toggle.count())await toggle.click();await page.waitForTimeout(route==='/'?800:200);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`overflow: ${route} at ${width}`);
   const main=page.locator('#main-content').first();assert.ok((await main.innerText()).trim().length>70,route);
   assert.doesNotMatch(await main.innerText(),/SQLSTATE|PostgREST|schema cache|Unhandled server exception|github_pat_|sk-or-v1-/i,route);
   if(dark){const rgb=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--bg-main').trim());assert.equal(rgb,'#151515');}
   if(['/','/courses/','/classes/11th-class/','/classes/11th-class/computer-science/','/privacy-policy/'].includes(route))await page.screenshot({path:`artifacts/resource-pages/${route.replaceAll('/','_')}-${width}.png`});
  }
 }
 await page.goto(base+'/learn/python/',{waitUntil:'domcontentloaded'});assert.equal(await page.locator('.topic-directory>li').count(),LEARNING_TOPICS.filter(t=>t.languageId==='python').length);
 for(const topic of LEARNING_TOPICS.filter(t=>t.videoIds.length)){
  const language=LEARNING_LANGUAGES.find(l=>l.id===topic.languageId);await page.goto(`${base}/learn/${language.slug}/${topic.slug}/`,{waitUntil:'domcontentloaded'});await page.locator('.lesson-attached-videos').waitFor();assert.equal(await page.locator('.lesson-attached-videos .lesson-video').count(),topic.videoIds.length);
  assert.equal(await page.evaluate(()=>!!(document.querySelector('.lesson-attached-videos').compareDocumentPosition(document.querySelector('.lesson-opening'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
 }
 await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.setViewportSize({width:1366,height:900});
 const strip=page.getByRole('navigation',{name:'Class study shortcuts',exact:true});await page.waitForFunction(()=>document.querySelector('.study-resource-strip')?.dataset.ready==='true');
 assert.doesNotMatch(await page.locator('.site-header').innerText(),/11th|12th|1st year|2nd year/i);
 const track=strip.locator('.study-strip-track');await page.mouse.move(1,899);const initial=await track.evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(250);assert.notEqual(await track.evaluate(e=>getComputedStyle(e).transform),initial,'study links move without user input');
 await strip.hover();assert.equal(await track.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
 await strip.getByRole('button',{name:'Pause study links scrolling',exact:true}).click();await page.mouse.move(1,899);const paused=await track.evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(150);assert.equal(await track.evaluate(e=>getComputedStyle(e).transform),paused);
 await strip.getByRole('button',{name:'Resume study links scrolling',exact:true}).click();await page.mouse.move(1,899);await page.waitForTimeout(150);assert.equal(await track.evaluate(e=>getComputedStyle(e).animationPlayState),'running');
 await strip.getByRole('button',{name:'Pause study links scrolling',exact:true}).focus();await page.keyboard.press('Shift+Tab');await page.waitForFunction(()=>{const nav=document.querySelector('.study-resource-strip');const target=document.activeElement;const a=target.getBoundingClientRect(),b=nav.getBoundingClientRect();return nav.dataset.manual==='true'&&a.left>=b.left&&a.right<=b.right+1;});assert.equal(await strip.getAttribute('data-manual'),'true');
 const focused=await page.locator(':focus').boundingBox();const bounds=await strip.boundingBox();assert.ok(focused.x>=bounds.x&&focused.x+focused.width<=bounds.x+bounds.width+1,'keyboard focus remains visible');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/',{waitUntil:'domcontentloaded'});assert.equal(await page.locator('.study-strip-track').evaluate(e=>getComputedStyle(e).animationName),'none');
 const {STATIC_OVERRIDES}=await loadTypescript('src/data/staticOverrides.ts');const ditBank=(STATIC_OVERRIDES.mcqs||[]).filter(q=>q.id.startsWith('dit-cn-ch1-'));
 if(ditBank.length){
  assert.equal(ditBank.length,80);await page.goto(base+'/classes/dit-intermediate/dit-computer-science/mcqs/',{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:/Chapter 1: Basic Terminologies/}).click();
  assert.equal(await page.locator('.mcq-topic-grid>button').count(),8,'Chapter 1 must offer all eight source topics');
  await page.locator('.mcq-topic-grid>button').first().click();assert.match(await page.locator('.mcq-page').innerText(),/Question 1 \/ 10/);
  await page.getByRole('button',{name:'Change topic',exact:true}).click();await page.getByRole('button',{name:'Mixed chapter practice (80 MCQs)',exact:true}).click();assert.equal(await page.locator('.mcq-page button[aria-pressed]').count(),4);
  assert.equal(await page.locator('.mcq-page h2 [lang="ur"]').evaluate(e=>getComputedStyle(e).direction),'rtl');
  assert.equal(await page.evaluate(async()=>{await document.fonts.load('18px "RayTech Urdu"');return document.fonts.check('18px "RayTech Urdu"');}),true,'bundled Urdu font loads');
  for(const [width,dark]of[[1366,false],[360,true]]){
   await page.setViewportSize({width,height:900});const toggle=page.getByRole('button',{name:dark?'Switch to dark theme':'Switch to light theme',exact:true});if(await toggle.count())await toggle.click();await page.waitForTimeout(200);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:`artifacts/resource-pages/dit-quiz-${width}.png`});
  }
  await page.setViewportSize({width:1366,height:900});
  for(let index=0;index<80;index++){
   assert.ok(!(await page.locator('.mcq-page').innerText()).includes('Correct answer:'));
   const question=await page.locator('.mcq-page h2 .bilingual-line[lang="en"]').innerText();const item=ditBank.find(q=>q.question.split('\n')[0]===question);assert.ok(item,question);
   const answer=item.options[item.correctIndex].split('\n')[0];await page.locator('.mcq-page button[aria-pressed]').filter({has:page.getByText(answer,{exact:true})}).click();
   await page.getByRole('button',{name:index===79?'View Result':'Next',exact:true}).click();
  }
  assert.match(await page.locator('.mcq-page').innerText(),/Your score:\s*80\s*\/\s*80/);console.log('[dit-quiz] All 80 bilingual source questions scored correctly after shuffling; answers stayed hidden until the result. Desktop/mobile RTL layout passed.');
  const note=(STATIC_OVERRIDES.notes||[]).find(n=>n.id==='dit-cn-chapter-1-basic-terminologies-mcq-notes');assert.ok(note,'Chapter 1 PDF note is published');
  const notesPath='/classes/dit-intermediate/dit-computer-science/notes/';const detailPath=notesPath+note.id+'/';
  await page.goto(base+notesPath,{waitUntil:'domcontentloaded'});await Promise.all([page.waitForURL(base+detailPath),page.waitForResponse(response=>response.request().isNavigationRequest()&&response.request().resourceType()==='document'&&new URL(response.url()).pathname===detailPath&&response.status()===200),page.getByRole('link',{name:note.title,exact:true}).click()]);await page.getByRole('heading',{name:note.title,level:1,exact:true}).waitFor();assert.equal(new URL(page.url()).pathname,detailPath);
  assert.equal(await page.locator('h1').innerText(),note.title);assert.doesNotMatch(await page.locator('body').innerText(),/Unpublished preview|Preview only/i);
  await page.waitForFunction(url=>{const links=document.querySelectorAll('link[rel="canonical"]');return links.length===1&&links[0].href===url;},base+detailPath);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),base+detailPath);assert.match(await page.locator('meta[name="keywords"]').getAttribute('content'),/Basic Terminologies/);
  const schemas=await page.locator('script[type="application/ld+json"]').allTextContents();assert.ok(schemas.some(text=>JSON.parse(text)['@graph']?.some(item=>item['@type']==='LearningResource'&&item.associatedMedia?.contentUrl===note.pdfUrl)));
  const pdf=await page.request.get(note.pdfUrl);assert.equal(pdf.status(),200);assert.match(pdf.headers()['content-type'],/application\/pdf/);assert.ok((await pdf.body()).subarray(0,5).equals(Buffer.from('%PDF-')));
  assert.ok((await(await page.request.get(base+'/sitemap.xml')).text()).includes(base+detailPath));console.log('[dit-note] Chapter 1 note, PDF bytes, canonical URL, keywords, LearningResource schema and sitemap passed. No preview label.');
 }
 const officeBank=(STATIC_OVERRIDES.mcqs||[]).filter(q=>q.id.startsWith('dit-ms-office-ch1-'));
 if(officeBank.length){
  assert.equal(officeBank.length,60);assert.ok(officeBank.every(q=>q.chapterNumber===2));
  const officeChapter=(STATIC_OVERRIDES.chapters||[]).find(chapter=>chapter.id==='chapter-dit-computer-science-ms-office');assert.equal(officeChapter?.title,'MS Office');
  await page.goto(base+'/classes/dit-intermediate/dit-computer-science/mcqs/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{const toggle=document.querySelector('.site-header button[aria-label^="Switch to"]');return toggle&&!toggle.disabled;});
  await page.getByRole('button',{name:/Chapter 1: Introduction to MS Office/}).click();assert.equal(await page.locator('.mcq-topic-grid>button').count(),6);
  const {isRecentTopic}=await loadTypescript('src/utils/topic-freshness.ts');
  const topics=Array.from(new Set(officeBank.map(q=>q.topic)));
  for(const topic of topics){
   const questions=officeBank.filter(q=>q.topic===topic);assert.equal(questions.length,10);
   const card=page.locator('.mcq-topic-grid>button').filter({has:page.getByText(topic,{exact:true})});
   assert.equal(await card.getAttribute('data-new'),isRecentTopic(questions,Date.now())?'true':null);
   await card.click();const seen=new Set();
   for(let index=0;index<10;index++){
    assert.ok(!(await page.locator('.mcq-page').innerText()).includes('Correct answer:'));
    const text=await page.locator('.mcq-page h2 .bilingual-line[lang="en"]').innerText();const item=questions.find(q=>q.question.split('\n')[0]===text);assert.ok(item);assert.ok(!seen.has(item.id));seen.add(item.id);
    const answer=item.options[item.correctIndex].split('\n')[0];await page.locator('.mcq-page button[aria-pressed]').filter({has:page.getByText(answer,{exact:true})}).click();await page.getByRole('button',{name:index===9?'View Result':'Next',exact:true}).click();
   }
   assert.match(await page.locator('.mcq-page').innerText(),/Your score:\s*10\s*\/\s*10/);await page.getByRole('button',{name:'Choose another topic',exact:true}).click();
  }
  console.log('[office-mcqs] Chapter 2 has all six source topics; sixty shuffled bilingual questions scored correctly. Golden status follows original creation timestamps.');
 }
 assert.deepEqual(errors,[]);assert.equal(publicDatabaseReads,0);console.log(`[resource-pages] ${routes.length} routes passed in desktop light and mobile charcoal; Python topic count and published video placement matched the catalog. Study strip motion, pause, keyboard access and reduced motion passed. No public database reads.`);
}finally{await browser.close();}
