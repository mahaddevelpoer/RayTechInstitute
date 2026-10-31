import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {loadTypescript} from './load-typescript.mjs';
const {validateAiArticleSeo}=await loadTypescript('supabase/functions/_shared/article-draft.ts');
test('AI requires real editorial fields but permits unknown source/profile details to remain blank',()=>{
 assert.throws(()=>validateAiArticleSeo({}));
 const seo=Object.fromEntries(['title','description','imageAlt','socialTitle','socialDescription'].map(key=>[key,'Specific topic detail']));
 Object.assign(seo,{sources:'',internalLinks:'',imageCaption:'',socialImage:'',authorUrl:''});
 assert.ok(validateAiArticleSeo({seo}).seo.enabled.includes('title'));assert.ok(!seo.enabled.includes('sources'));
});
test('omitted optional review fields do not discard an otherwise valid AI draft',()=>{
 const seo=Object.fromEntries(['title','description','imageAlt','socialTitle','socialDescription'].map(key=>[key,'Topic detail']));
 const article={content:'Preserved article',seo};validateAiArticleSeo(article);
 assert.equal(article.content,'Preserved article');assert.equal(seo.sources,'');assert.equal(seo.authorUrl,'');assert.ok(!seo.enabled.includes('sources'));
 seo.sources=['https://example.org/source',null];seo.internalLinks=null;
 validateAiArticleSeo(article);assert.equal(seo.sources,'https://example.org/source');assert.equal(seo.internalLinks,'');assert.ok(seo.enabled.includes('sources'));
});
test('SEO migration is repeatable and preserves existing articles and optional settings',async()=>{
 const db=new PGlite();try{
 await db.exec("CREATE TABLE public.blogs(id text primary key, content text); INSERT INTO public.blogs VALUES('existing','Preserved content');");
 const sql=await fs.readFile('supabase/migrations/20261031020000_blog_editorial_seo.sql','utf8');await db.exec(sql);await db.exec(sql);
 const seo={enabled:['title'],title:'Complete topic title'};await db.query('UPDATE blogs SET seo=$1 WHERE id=$2',[JSON.stringify(seo),'existing']);
 const row=(await db.query('SELECT * FROM blogs')).rows[0];assert.equal(row.content,'Preserved content');assert.deepEqual(row.seo,seo);
 }finally{await db.close();}
});
