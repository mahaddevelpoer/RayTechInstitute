import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {loadTypescript} from './load-typescript.mjs';
const require=createRequire(import.meta.url);
const books=await loadTypescript('src/utils/chapter-books.ts');
function component(source,mocks){const module={exports:{}};const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;vm.runInNewContext(code,{module,exports:module.exports,require:id=>id in mocks?mocks[id]:require(id)});return module.exports;}
const {BookNotesDirectory}=component(await fs.readFile('src/components/educational/BookNotesDirectory.tsx','utf8'),{'@/utils/chapter-books':books});
const context={classSlug:'dit-intermediate',subjectSlug:'dit-computer-science'};
const chapters=[{...context,id:'network',chapterNumber:1,title:'Basic Terminologies',isActive:true},{...context,id:'office',chapterNumber:2,title:'MS Office',isActive:true},{...context,id:'word',chapterNumber:3,title:'Microsoft Word 2016',isActive:true}];
const sourceNote=JSON.parse(await fs.readFile('content/imports/dit-computer-networks-chapter-1-note.json','utf8'));
const source=await fs.readFile('src/components/educational/NotesClientView.tsx','utf8');
const publishedSnapshot=JSON.parse(await fs.readFile('content/imports/dit-notes-preview.json','utf8'));

test('the reported Office and Word notes are included in the preview and counted under the correct chapters',()=>{
 const office=publishedSnapshot.notes.find(note=>note.id==='note-1793112803271');
 const word=publishedSnapshot.notes.find(note=>note.id==='note-1793115340417');
 assert.ok(office);assert.ok(word);assert.equal(office.chapterNumber,2);assert.equal(word.chapterNumber,3);
 assert.match(books.chapterDisplayLabel({...office,title:office.chapterTitle}),/^MS Office \/ Chapter 1:/);
 assert.match(books.chapterDisplayLabel({...word,title:word.chapterTitle}),/^MS Office \/ Chapter 2:/);
 const {NotesClientView}=componentSource(publishedSnapshot.notes);
 const dom=new JSDOM(renderToStaticMarkup(React.createElement(NotesClientView,context)));
 try{
  const book=dom.window.document.querySelectorAll('.notes-book-directory>.mcq-book')[1];assert.match(book.querySelector('summary').textContent,/2 documents available/);
  const sections=book.querySelectorAll('.notes-book-chapter');assert.equal(sections.length,2);
  for(const [index,note] of [office,word].entries()){assert.equal(sections[index].querySelectorAll('article').length,1);assert.ok(sections[index].querySelector('article h2 a').href.endsWith('/'+note.id+'/'));}
  assert.equal(book.querySelectorAll('.notes-book-empty').length,0);
 }finally{dom.window.close();}
});

test('ordinary chapter notes and MCQ revision PDFs share their real book/chapter and keep distinct links',()=>{
 const notes=[sourceNote,{...sourceNote,id:'chapter-study-notes',title:'Basic Terminologies Study Guide',pdfUrl:'/documents/study-guide.pdf'},{...sourceNote,id:'word-study-notes',chapterNumber:3,chapterTitle:'Microsoft Word 2016',title:'Microsoft Word Document Formatting',pdfUrl:'/documents/word-notes.pdf'}];
 const snapshot=JSON.stringify({notes,chapters});
 const {NotesClientView}=componentSource(notes);
 const dom=new JSDOM(renderToStaticMarkup(React.createElement(NotesClientView,context)));
 try{
  const document=dom.window.document;assert.equal(document.querySelectorAll('.notes-book-directory>.mcq-book').length,2);assert.equal(document.querySelectorAll('.notes-book-chapter').length,3);assert.equal(document.querySelectorAll('article').length,3);
  const network=document.querySelector('.notes-book-directory>.mcq-book');assert.equal(network.querySelectorAll('article').length,2);assert.match(network.textContent,/MCQ Revision Notes/);assert.match(network.textContent,/Basic Terminologies Study Guide/);
  const office=document.querySelectorAll('.notes-book-directory>.mcq-book')[1];assert.equal(office.querySelectorAll('article').length,1);assert.match(office.textContent,/Chapter 2: Microsoft Word 2016/);assert.equal(office.querySelectorAll('.notes-book-empty').length,1);
  const links=Array.from(document.querySelectorAll('article h2 a')).map(link=>link.getAttribute('href'));assert.equal(new Set(links).size,3);assert.ok(links.includes(`/classes/${context.classSlug}/${context.subjectSlug}/notes/${sourceNote.id}/`));
  assert.equal(JSON.stringify({notes,chapters}),snapshot);
 }finally{dom.window.close();}
});

test('published notes with a missing chapter stay discoverable; foreign subject notes stay excluded',()=>{
 const notes=[{...sourceNote,id:'future-notes',chapterNumber:4,chapterTitle:'Future Chapter',title:'Future Study Guide'},{...sourceNote,id:'foreign',subjectSlug:'physics',title:'Foreign Notes'}];
 const {NotesClientView}=componentSource(notes);const dom=new JSDOM(renderToStaticMarkup(React.createElement(NotesClientView,context)));
 try{assert.equal(dom.window.document.querySelectorAll('article').length,1);assert.match(dom.window.document.body.textContent,/Additional chapters/);assert.match(dom.window.document.body.textContent,/Future Study Guide/);assert.doesNotMatch(dom.window.document.body.textContent,/Foreign Notes/);}finally{dom.window.close();}
});

function componentSource(notes){return component(source,{
 'next/link':{default:({children,...props})=>React.createElement('a',props,children)},
 '@/data/staticCatalog':{INITIAL_CLASSES:[{slug:context.classSlug,title:'D.I.T'}],INITIAL_SUBJECTS:[{classSlug:context.classSlug,slug:context.subjectSlug,title:'Computer Science'}],INITIAL_CHAPTERS:chapters,INITIAL_NOTES:notes},
 '@/utils/chapter-books':books,'./BookNotesDirectory':{BookNotesDirectory},
 './PdfResourceActions':{PdfResourceActions:({pdfUrl,detailHref})=>React.createElement('a',{href:pdfUrl,'data-detail-href':detailHref},'Open PDF')},
});}
