import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const base='http://127.0.0.1:4181',route='/classes/dit-intermediate/dit-computer-science';
const bank=JSON.parse(await fs.readFile('content/imports/dit-computer-networks-chapter-1.json','utf8'));
const note=JSON.parse(await fs.readFile('content/imports/dit-computer-networks-chapter-1-note.json','utf8'));
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1']});
try {
 const page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))external.push(r.url());});
 await page.goto(base+route+'/mcqs/');assert.equal(await page.locator('.mcq-topic-grid>button').count(),8,'topics are visible immediately');await page.getByRole('button',{name:/Chapter 1: Basic Terminologies/}).click();
 assert.equal(await page.locator('.mcq-topic-grid>button').count(),8);assert.equal(await page.locator('button[aria-pressed]').count(),0);
 const topics=[...new Set(bank.questions.map(q=>q.topic))];
 for(let index=0;index<8;index++)assert.match(await page.locator('.mcq-topic-grid>button').nth(index).innerText(),new RegExp(topics[index].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
 await page.screenshot({path:'artifacts/dit-topic-review/topics-desktop.png',fullPage:true});
 await page.setViewportSize({width:360,height:850});await page.getByRole('button',{name:'Switch theme',exact:true}).click();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'artifacts/dit-topic-review/topics-mobile-dark.png',fullPage:true});
 await page.locator('.mcq-topic-grid>button').nth(5).click();
 for(let i=0;i<10;i++){
  assert.match(await page.locator('.mcq-page').innerText(),new RegExp(`Question ${i+1} / 10`));
  const english=await page.locator('h2 .bilingual-line[lang="en"]').innerText();const q=bank.questions.find(q=>q.question.split('\n')[0]===english);assert.equal(q.topic,topics[5]);
  const correct=q.options[q.correctIndex].split('\n')[0];await page.locator('button[aria-pressed]').filter({has:page.getByText(correct,{exact:true})}).click();
  if(i===0){await page.evaluate(()=>document.fonts.ready);assert.equal(await page.evaluate(()=>document.fonts.check('18px "RayTech Urdu"')),true);await page.screenshot({path:'artifacts/dit-topic-review/topic-quiz-mobile-dark.png',fullPage:true});}
  await page.getByRole('button',{name:i===9?'View Result':'Next',exact:true}).click();
 }
 assert.match(await page.locator('.mcq-page').innerText(),/Your score:\s*10\s*\/\s*10/);
 await page.getByRole('button',{name:'Choose another topic',exact:true}).click();assert.equal(await page.locator('.mcq-topic-grid>button').count(),8);
 await page.goto(base+route+'/notes/');assert.match(await page.locator('#main-content').innerText(),/1 study resource available/);assert.match(await page.locator('article').innerText(),/Chapter 1: Basic Terminologies/);
 await page.getByRole('link',{name:`Read details: ${note.title}`,exact:true}).click();assert.equal(await page.locator('h1').innerText(),note.title);
 await page.getByRole('button',{name:'Load document preview',exact:true}).click();assert.equal(await page.locator('iframe').getAttribute('src'),new URL(note.pdfUrl).pathname);
  assert.equal(await page.locator('iframe').getAttribute('sandbox'),null,'native PDF viewer must not be blocked by iframe sandbox');await page.waitForTimeout(800);
 const pdf=await page.request.get(base+new URL(note.pdfUrl).pathname);assert.equal(pdf.status(),200);assert.match(pdf.headers()['content-type'],/application\/pdf/);assert.ok((await pdf.body()).subarray(0,5).equals(Buffer.from('%PDF-')));
 for(const width of [360,1366]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:`artifacts/dit-topic-review/note-${width}.png`,fullPage:true});}
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 console.log('PASS: eight ordered topics, ten-question quiz, 10/10 score, topic switching, Urdu font, desktop/mobile themes, Chapter 1 note and bundled PDF preview. No external API calls or database writes.');
} finally { await browser.close(); }
