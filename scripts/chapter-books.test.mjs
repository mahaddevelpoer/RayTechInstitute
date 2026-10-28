import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {loadTypescript} from './load-typescript.mjs';
const {chapterPlacement,groupChapterBooks,chapterDisplayLabel}=await loadTypescript('src/utils/chapter-books.ts');
const banks=await Promise.all(['dit-computer-networks-chapter-1','dit-ms-office-chapter-1','dit-ms-word-2016-chapter-2'].map(async name=>JSON.parse(await fs.readFile(`content/imports/${name}.json`,'utf8'))));
const chapters=banks.map((bank,index)=>({id:bank.chapterId||'networking',classSlug:bank.classSlug,subjectSlug:bank.subjectSlug,chapterNumber:index+1,title:bank.chapterTitle,isActive:true}));

test('D.I.T presents two books and independent chapter numbering without changing the 240 source questions',()=>{
 const snapshot=JSON.stringify({chapters,banks});
 const books=groupChapterBooks(chapters.slice().reverse());
 assert.deepEqual(books.map(book=>book.title),['Computer Networking','MS Office']);
 assert.deepEqual(books[0].chapters.map(item=>[item.number,item.title,item.chapter.chapterNumber]),[[1,'Basic Terminologies',1]]);
 assert.deepEqual(books[1].chapters.map(item=>[item.number,item.title,item.chapter.chapterNumber]),[[1,'Introduction to MS Office',2],[2,'Microsoft Word 2016',3]]);
 assert.deepEqual(banks.map(bank=>new Set(bank.questions.map(question=>question.topic)).size),[8,6,10]);
 assert.equal(banks.reduce((n,bank)=>n+bank.questions.length,0),240);
 assert.equal(JSON.stringify({chapters,banks}),snapshot);
 assert.equal(chapterDisplayLabel(chapters[2]),'MS Office / Chapter 2: Microsoft Word 2016');
});

test('new chapters remain visible and other classes are not placed into D.I.T books',()=>{
 const unknown={...chapters[0],id:'future-chapter',chapterNumber:4,title:'New published chapter'};
 const books=groupChapterBooks([...chapters,unknown]);assert.equal(books[2].title,'Additional chapters');assert.equal(books[2].chapters[0].chapter.id,unknown.id);
 assert.equal(chapterPlacement({...chapters[0],classSlug:'11th-class'}),null);
 assert.equal(chapterPlacement({...chapters[0],subjectSlug:'other-subject'}),null);
 assert.equal(groupChapterBooks(chapters.map(chapter=>({...chapter,isActive:false}))).length,0);
});
