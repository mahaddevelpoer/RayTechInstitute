// Local, reviewable import only. No database writes or deployments.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {hasPrivateCredential} from './private-credential-patterns.mjs';
const root='content/imports/dit-nov11',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const db=read('artifacts/dit-nov11/database-before.json');
const norm=s=>s.normalize('NFKC').replace(/^[ABCD][.)]\s*/gm,'').replace(/\s+/g,' ').trim();
const existingFiles=[['network-topology','content/imports/dit-network-topology-chapter-2.json'],['powerpoint','content/imports/dit-powerpoint-chapter-3.json']];
const report={state:'locally-staged-not-published',classSlug:'dit-intermediate',subjectSlug:'dit-computer-science',semester:1,existing:[],missing:[],questions:0,topics:0,overwrites:0,pending:['Confirm MS Office chapter order before any live change.','Publishing this academic import requires explicit approval.']};
for(const[key,file]of existingFiles){
 const source=read(root+'/'+key+'.json'),old=read(file);assert.equal(source.sourceSha256,old.sourceSha256,key+' source differs');
 for(const q of old.questions){const actual=db.mcqs.find(r=>r.id===q.id);assert.ok(actual,key+' missing live question '+q.id);assert.equal(norm(actual.question),norm(q.question));assert.deepEqual(actual.options.map(norm),q.options.map(norm));assert.equal(actual.correct_index,q.correctIndex);}
 report.existing.push({key,questions:old.questions.length,sourceSha256:source.sourceSha256,action:'leave-unchanged',verifiedAgainstLiveSnapshot:true});
}
const defs=[['networking-devices',6,'Networking Devices'],['transmission-media',7,'Transmission Media'],['network-models',8,'Network Models'],['ip-addresses',9,'IP Addresses'],['protocols',10,'Protocols'],['excel',11,'Microsoft Excel'],['access',12,'Microsoft Access']];
const chapters=[],mcqs=[];
for(const[key,storage,title]of defs){
 const bank=read(root+'/'+key+'.json');
 assert.ok(!db.chapters.some(c=>c.class_slug===bank.classSlug&&c.subject_slug===bank.subjectSlug&&c.chapter_number===storage),'Storage collision '+storage);
 const chapter={id:'chapter-dit-computer-science-'+key,class_slug:bank.classSlug,subject_slug:bank.subjectSlug,chapter_number:storage,title,description:`${bank.questions.length} supplied English and Urdu MCQs organised into ${bank.sourceSections.length} source topics.`,is_active:true,book_title:bank.bookTitle,display_chapter_number:bank.displayChapterNumber};
 assert.ok(!db.chapters.some(c=>c.id===chapter.id));chapters.push(chapter);
 for(const q of bank.questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(norm)).size,4);assert.ok(q.correctIndex>=0&&q.correctIndex<4);assert.ok(bank.sourceSections.includes(q.topic));const row={id:q.id,class_slug:bank.classSlug,subject_slug:bank.subjectSlug,chapter_number:storage,topic:q.topic,question:q.question,options:q.options,correct_index:q.correctIndex,explanation:q.explanation};assert.ok(!db.mcqs.some(m=>m.id===q.id));mcqs.push(row);}
 report.missing.push({key,title,book:bank.bookTitle,displayChapter:bank.displayChapterNumber,storageChapter:storage,questions:bank.questions.length,topics:bank.sourceSections.length,sourceSha256:bank.sourceSha256});report.questions+=bank.questions.length;report.topics+=bank.sourceSections.length;
}
assert.equal(report.questions,760);assert.equal(report.topics,76);assert.equal(new Set(mcqs.map(q=>q.id)).size,760);
const oldPowerPoint=db.chapters.find(c=>c.id==='chapter-dit-computer-science-powerpoint');
assert.equal(oldPowerPoint.display_chapter_number,3);
const oldNote=db.notes.find(n=>n.id==='dit-ms-office-chapter-3-powerpoint-mcq-notes');assert.ok(oldNote);
const payload={chapters,mcqs,updates:[{table:'chapters',id:oldPowerPoint.id,before:{display_chapter_number:3},after:{display_chapter_number:4}},{table:'notes',id:oldNote.id,before:{title:oldNote.title,content:oldNote.content},after:{title:oldNote.title.replace('Chapter 3','Chapter 4'),content:oldNote.content.replaceAll('Chapter 3','Chapter 4').replace('after Introduction to MS Office and Microsoft Word 2016','after Introduction to MS Office, Microsoft Word 2016 and Microsoft Excel')}}]};assert.ok(!hasPrivateCredential(JSON.stringify(payload)));
report.officeOrderConfirmed=true;report.officeOrder=['Introduction to MS Office','Microsoft Word 2016','Microsoft Excel','Microsoft PowerPoint','Microsoft Access'];report.pending=['Publishing this academic import requires explicit approval.'];
report.payloadSha256=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
fs.writeFileSync(root+'/payload.json',JSON.stringify(payload,null,2)+'\n');fs.writeFileSync(root+'/REVIEW.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
