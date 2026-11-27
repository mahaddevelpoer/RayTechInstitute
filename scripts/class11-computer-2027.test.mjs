import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {chapters} from '../content/class11-computer-2027/index.mjs';
import {modelPaper} from '../content/class11-computer-2027/model-paper.mjs';
const root='content/class11-computer-2027';
const read=async p=>JSON.parse(await fs.readFile(root+'/'+p,'utf8'));
const data=await read('generated.json'),legacy=await read('legacy-audit.json'),alp=await read('exclusions.json');
const hash=x=>createHash('sha256').update(x).digest('hex');
const compiled=await build({stdin:{contents:"export * from './src/data/staticCatalog'; export * from './src/data/class11Computer2027'; export {STATIC_OVERRIDES} from './src/data/staticOverrides';",resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,platform:'node',format:'cjs',logLevel:'silent'});
const ctx={module:{exports:{}},URL};ctx.exports=ctx.module.exports;vm.runInNewContext(compiled.outputFiles[0].text,ctx);const catalog=ctx.module.exports;
const target=q=>q.classSlug==='11th-class'&&q.subjectSlug==='computer-science';
test('nine retained chapter scopes exclude exactly the notified sections and exercises',()=>{
 assert.deepEqual(chapters.map(c=>c.number),[1,2,3,4,5,6,7,8,9]);
 for(const c of chapters){
  const a=alp.chapters[c.number-1];
  for(const t of c.topics){assert.ok(t.notes.split(/\s+/).length>=80);assert.ok(!a.excludedSections.some(e=>t.section===e||t.section.startsWith(e+'.')),t.section);}
  for(const [key,rows] of [['mcqs',c.exerciseMcqs],['short',c.short],['long',c.long]]){
   const numbers=rows.map(q=>q.number);assert.equal(new Set(numbers).size,numbers.length);
   for(const n of a.excludedExercise[key]||[])assert.ok(!numbers.includes(n),`${c.number} ${key} ${n}`);
  }
 }
 assert.deepEqual(chapters[1].long.map(q=>q.number),['1(b,d)','2-3',4,5,6]);
 assert.deepEqual(chapters[5].short.map(q=>q.number),[3,4,6,8,9]);
 assert.ok(chapters[0].topics.some(t=>t.section==='1.7'));
 assert.equal(chapters[3].exerciseMcqs.length,6);assert.equal(chapters[7].exerciseMcqs.length,10);
 const expected={short:[[1,2,3,4,7],[1,2,3,4,6,7],[1,2,3,4,5,6,7,8],[1,2,3,4,5,6],[3,4],[3,4,6,8,9],[1,2,4,5],[1,2,3,4,5],[1,2,3,4,5,6,8]]};
 chapters.forEach((c,i)=>assert.deepEqual(c.short.map(q=>q.number),expected.short[i]));
 assert.equal(chapters[2].exerciseIssues[0].number,5);assert.deepEqual(chapters[6].exerciseIssues.map(q=>q.number),[1,9]);
});
test('400 practice questions preserve 220 approved legacy answers and withhold 40 exclusions',()=>{
 assert.equal(data.mcqs.length,400);assert.equal(new Set(data.mcqs.map(q=>q.id)).size,400);
 assert.deepEqual(chapters.map(c=>data.mcqs.filter(q=>q.chapterNumber===c.number).length),[70,70,80,30,30,30,30,30,30]);
 let retained=0,removed=0;const positions=[0,0,0,0];
 for(const old of legacy.mcqs){const q=data.mcqs.find(q=>q.id===old.id);if(/Supplementary: excluded/.test(old.topic)){assert.equal(q,undefined);removed++;}else{assert.equal(q.question,old.question);assert.equal(q.options[q.correctIndex],old.options[old.correctIndex]);retained++;}}
 assert.equal(retained,220);assert.equal(removed,40);
 for(const c of chapters){const rows=data.mcqs.filter(q=>q.chapterNumber===c.number&&q.id.startsWith('class11-alp2027-'));assert.equal(rows.length,(c.practice||[]).length);rows.forEach((q,i)=>assert.equal(q.options[q.correctIndex],c.practice[i].answer));}
 for(const q of data.mcqs){assert.equal(new Set(q.options).size,4);assert.ok(q.options.every(v=>typeof v==='string'&&v.length));assert.match(q.explanation,/Source: supplied book, printed pages/);assert.ok(!/Supplementary: excluded/.test(q.topic));positions[q.correctIndex]++;}
 assert.deepEqual(positions,[100,100,100,100]);assert.ok(data.mcqs.some((q,i)=>q.correctIndex!==i%4));
 assert.equal(catalog.INITIAL_MCQS.filter(target).length,400);
});
test('only explicitly reviewed saved identities change; all other resources are preserved',()=>{
 for(const [key,list,transform] of [['notes',catalog.INITIAL_NOTES,catalog.completeClass11Note],['chapters',catalog.INITIAL_CHAPTERS,catalog.completeClass11Chapter],['mcqs',catalog.INITIAL_MCQS,catalog.completeClass11Mcq]]){
  for(const old of catalog.STATIC_OVERRIDES[key]||[]){
   if(key==='mcqs'&&(data.excludedMcqIds.includes(old.id)||['mcq-1791959684546-sn62b','mcq-1791959685116-xidgz','mcq-1791959685379-8st80','mcq-1791959685663-b8b3q','mcq-1791959685796-p9mf4'].includes(old.id)))continue;
   // DIT has an independently checked completion transform and preservation suite.
   if(old.classSlug==='dit-intermediate')continue;
   assert.equal(JSON.stringify(list.find(r=>r.id===old.id)),JSON.stringify(transform(old)),old.id);
  }
  assert.equal(new Set(list.map(r=>r.id)).size,list.length);
 }
 assert.equal(catalog.INITIAL_NOTES.filter(target).length,11);assert.equal(catalog.INITIAL_CHAPTERS.filter(target).length,9);
 for(const old of legacy.notes){const n=catalog.INITIAL_NOTES.find(n=>n.id===old.id);assert.equal(n.downloadCount,old.downloadCount);assert.ok(n.pdfUrl.includes('/computer-2027/'));}
 const fake={...legacy.notes[0],downloadCount:123};assert.equal(catalog.completeClass11Note(fake).downloadCount,123);
 assert.throws(()=>catalog.completeClass11Note({...fake,chapterNumber:9}),/placement/);
});
test('model paper has 15 objective, 27 short and five long book-supported solutions',()=>{
 assert.equal(modelPaper.mcqs.length,15);assert.deepEqual(modelPaper.shortGroups.map(g=>g.questions.length),[9,9,9]);assert.equal(modelPaper.longQuestions.length,5);
 assert.equal(modelPaper.mcqs.map(q=>'ABCD'[q[3]]).join(''),'BDAACBBBBCDCDBC');
 const note=data.notes.find(n=>n.id==='class11-alp2027-model-paper-solutions');assert.match(note.content,/not an official answer key/);assert.match(note.content,/Count:/);assert.match(note.content,/Median = \(60 \+ 70\) \/ 2 = 65/);
 assert.equal(new Set(Object.values(data.noteSeo)).size,11);
 for(const title of Object.values(data.noteSeo))assert.ok((title+' | RayTech Institute').length<=65,title);
});
test('legacy papers label source attribution, Group I coverage and unsupported answers',()=>{
 assert.equal(data.papers.length,2);for(const p of data.papers){assert.match(p.content,/OLD-COURSE/);assert.match(p.content,/not been independently authenticated/);assert.match(p.content,/Group I only/);assert.match(p.content,/outside the supplied new-book answer set/);assert.match(p.content,/ustad360.com/);}
 const titles=data.papers.map(p=>catalog.class11PaperSeo(p.id).title);assert.equal(new Set(titles).size,2);
 for(const p of data.papers){const seo=catalog.class11PaperSeo(p.id);assert.ok((seo.title+' | RayTech Institute').length>=50&&(seo.title+' | RayTech Institute').length<=60);assert.ok(seo.description.length>=120&&seo.description.length<=155);assert.ok(seo.title.includes(p.board.replace('BISE ','')));}
});
test('executed Python proof matches the authored code and every stated test case',async()=>{
 const proof=await read('program-verification.json');assert.equal(proof.programs,16);assert.equal(proof.executions,18);
 const programs=chapters.flatMap(c=>c.programs||[]);programs.push({id:'model-if-else',code:modelPaper.shortGroups[0].questions[6][2].match(/~~~python\n([\s\S]*?)\n~~~/)[1],stdout:'Positive\n'});
 for(const p of programs){const rows=proof.results.filter(r=>r.id===p.id),cases=p.cases||[{stdout:p.stdout}];assert.equal(rows.length,cases.length);rows.forEach((r,i)=>{assert.equal(r.codeSha256,hash(p.code));assert.equal(r.stdout,cases[i].stdout);assert.equal(r.passed,true);});}
});
test('all PDF bytes match content/source hashes and old download URLs serve filtered guides',async()=>{
 const manifest=await read('pdf-manifest.json');assert.equal(Object.keys(manifest).length,15);
 for(const d of data.documents){const p=manifest[d.key],bytes=await fs.readFile('public/documents/class11/computer-2027/'+d.key+'.pdf');assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert.equal(bytes.length,p.bytes);assert.equal(hash(bytes),p.sha256);assert.equal(hash(d.content),p.contentSha256);assert.equal(p.sourceSha256,data.sourceSha256);}
 assert.equal(manifest['400-mcq-bank'].questionsSha256,hash(JSON.stringify(data.mcqs)));
 for(const n of [1,2,3])assert.equal(hash(await fs.readFile(`public/documents/class11/nov12/chapter-${n}.pdf`)),manifest[`chapter-${n}`].sha256);
});
