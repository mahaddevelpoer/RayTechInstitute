import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs/promises';import{loadTypescript}from'./load-typescript.mjs';
const {writeEducationalContent,readEducationalCatalog}=await loadTypescript('supabase/functions/_shared/content-mutations.ts');
const {documentLinks}=await loadTypescript('src/utils/documents.ts');
test('gazette and note writes require a valid identity, document and a confirmed saved row',async()=>{
 for(const table of ['gazettes','notes']){let saved;const payload={table,operation:'upsert',record:{id:'fixture-1',title:'Fixture',pdf_url:'https://board.test/gazette.pdf'}};
 assert.equal((await writeEducationalContent('https://db.test','secret',payload,async(u,o)=>{saved=o;return Response.json([payload.record]);})).success,true);assert.match(saved.headers.Prefer,/return=representation/);
 await assert.rejects(writeEducationalContent('https://db.test','secret',{...payload,record:{...payload.record,pdf_url:''}}),/document link/);
 await assert.rejects(writeEducationalContent('https://db.test','secret',payload,async()=>Response.json([])),/did not confirm/);
 }
});
test('delete only accepts a single immutable identity and confirms exactly one removed row',async()=>{
 for(const filter of [{},{title:'all'},{id:'x',title:'y'},{id:''}])await assert.rejects(writeEducationalContent('https://db.test','secret',{table:'gazettes',operation:'delete',filter}),/specific saved item/);
 let target;await writeEducationalContent('https://db.test','secret',{table:'gazettes',operation:'delete',filter:{id:'x&or=anything'}},async(u)=>{target=new URL(u);return Response.json([{id:'x'}]);});assert.equal(target.searchParams.size,1);assert.equal(target.searchParams.get('id'),'eq.x&or=anything');
 await assert.rejects(writeEducationalContent('https://db.test','secret',{table:'notes',operation:'delete',filter:{id:'missing'}},async()=>Response.json([])),/not found/);
});
test('provider and database response details never become content-save errors',async()=>{
 try{await writeEducationalContent('https://db.test','secret',{table:'gazettes',operation:'upsert',record:{id:'x',title:'Fixture',pdf_url:'https://board.test/g.pdf'}},async()=>new Response('SQLSTATE private_table secret-key',{status:400}));assert.fail();}catch(e){assert.doesNotMatch(e.message,/SQLSTATE|private_table|secret-key/);assert.match(e.message,/form is unchanged/);}
});
test('unsafe document URLs cannot reach the database',async()=>{
 for(const pdf_url of ['javascript:alert(1)','http://board.test/a.pdf','https://user:password@board.test/a.pdf'])await assert.rejects(writeEducationalContent('https://db.test','secret',{table:'notes',operation:'upsert',record:{id:'x',title:'Fixture',pdf_url}}),/HTTPS/);
});
test('admin content catalog is complete, paginated and fails rather than silently returning partial data',async()=>{
 const result=await readEducationalCatalog('https://db.test','secret',async u=>{const url=new URL(u);return Response.json(url.pathname.endsWith('/notes')&&url.searchParams.get('offset')==='0'?Array.from({length:500},(_,id)=>({id})):[]);});assert.equal(result.tables.notes.length,500);assert.equal(Object.keys(result.tables).length,9);
 await assert.rejects(readEducationalCatalog('https://db.test','secret',async()=>new Response('private',{status:503})),/could not be refreshed/);
});
test('direct PDFs receive a fixed-host preview and homepages never masquerade as a PDF',()=>{
 const doc=documentLinks('https://board.test/gazette.pdf?year=2026');const viewer=new URL(doc.embed);assert.equal(viewer.hostname,'docs.google.com');assert.equal(viewer.searchParams.get('url'),doc.href);assert.equal(documentLinks('https://board.test/').embed,'');
});
test('lesson navigation resets activities and resource filters by actual topic/subject identity',async()=>{
 const workspace=await fs.readFile('src/components/learning/LearningWorkspace.tsx','utf8');assert.match(workspace,/<InteractiveLesson key=\{`\$\{topic.id\}@\$\{topic.version\}`\}/);assert.ok(workspace.indexOf('Watch this lesson')<workspace.indexOf('text={topic.summary}'));
 for(const page of ['notes','past-papers','mcqs'])assert.match(await fs.readFile(`src/app/classes/[classSlug]/[subjectSlug]/${page}/page.tsx`,'utf8'),/key=\{`\$\{classSlug\}\/\$\{subjectSlug\}`\}/);
});
