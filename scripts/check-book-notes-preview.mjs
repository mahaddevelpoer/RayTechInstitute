import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const base=process.env.PREVIEW_BASE_URL||'http://127.0.0.1:4184';
const {notes}=JSON.parse(await fs.readFile('content/imports/dit-notes-preview.json','utf8'));
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true,args:['--renderer-process-limit=1','--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:360,height:850}});const errors=[],external=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',route=>{if(route.request().url().startsWith(base+'/'))return route.continue();external.push(route.request().url());return route.abort();});
 await page.goto(base+'/classes/dit-intermediate/dit-computer-science/notes/',{waitUntil:'networkidle'});
 assert.deepEqual(await page.locator('.notes-book-directory>.mcq-book>summary strong').allTextContents(),['Computer Networking','MS Office']);
 assert.equal(await page.locator('.notes-book-chapter').count(),3);
 const article=page.locator('article');assert.equal(await article.count(),notes.length);
 assert.match(await article.locator('a').first().getAttribute('href'),/\/notes\/dit-cn-chapter-1-basic-terminologies-mcq-notes\/$/);
 const firstChapter=page.locator('.notes-book-chapter').first();assert.match(await firstChapter.innerText(),/MCQ Revision Notes/);
 await firstChapter.locator('summary').click();assert.equal(await article.first().isVisible(),false);await firstChapter.locator('summary').click();assert.equal(await article.first().isVisible(),true);
 assert.match(await page.locator('.notes-book-directory>.mcq-book').nth(1).locator('summary').first().innerText(),/2 documents available/);
 await fs.mkdir('artifacts/dit-books-review',{recursive:true});
 for(const width of [360,768,1280])for(const dark of [false,true]){
  await page.setViewportSize({width,height:850});await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  if(width===360&&!dark||width===1280&&dark)await page.screenshot({path:`artifacts/dit-books-review/notes-${width}-${dark?'dark':'light'}.png`,fullPage:true});
 }
 await page.getByLabel('Book',{exact:true}).selectOption('ms-office');assert.equal(await page.locator('.notes-book-directory>.mcq-book').count(),1);assert.equal(await page.locator('.notes-book-chapter').count(),2);assert.equal(await article.count(),2);assert.equal(await page.locator('.notes-book-empty').count(),0);
 await page.locator('select').last().selectOption('3');assert.equal(await page.locator('.notes-book-chapter').count(),1);assert.match(await page.locator('.notes-book-chapter>summary').innerText(),/Chapter 2: Microsoft Word 2016/);
 assert.equal(await article.count(),1);assert.match(await article.innerText(),/Microsoft Word 2016/);
 await page.getByLabel('Book',{exact:true}).selectOption('all');assert.equal(await article.count(),notes.length);
 await page.getByLabel('Search notes',{exact:true}).fill('missing-resource');assert.equal(await article.count(),0);assert.equal(await page.locator('.notes-book-directory>.mcq-book').count(),0);await page.getByRole('button',{name:'Clear filters',exact:true}).click();assert.equal(await article.count(),notes.length);
 for(const note of notes.filter(item=>['note-1793112803271','note-1793115340417'].includes(item.id))){
  await page.getByRole('link',{name:note.title,exact:true}).click();await page.getByRole('heading',{level:1,name:note.title,exact:true}).waitFor();assert.ok(page.url().endsWith('/'+note.id+'/'));assert.equal(await page.locator('a').filter({hasText:'New tab'}).getAttribute('href'),note.pdfUrl);
  const response=await page.request.get('https://raytechinstitute.com/classes/dit-intermediate/dit-computer-science/notes/'+note.id+'/');assert.equal(response.status(),200);
  await page.getByRole('link',{name:'Back to chapter notes',exact:true}).click();
 }
 const pdf=await page.request.get(base+'/documents/dit/computer-networks-chapter-1-basic-terminologies.pdf');assert.equal(pdf.status(),200);assert.ok((await pdf.body()).subarray(0,5).equals(Buffer.from('%PDF-')));
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 console.log('PASS: both existing Office notes assigned to their chapters; three real documents, both live URLs return 200, local detail titles/PDF links match, collapse and filters work at 360/768/1280px in both themes. No browser errors.');
}finally{await browser.close();}
