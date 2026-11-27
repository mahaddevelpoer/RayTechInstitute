import test from 'node:test';
import assert from 'node:assert/strict';
import {loadTypescript} from './load-typescript.mjs';
const {relatedArticles}=await loadTypescript('src/utils/related-articles.ts');
const post=(id,tags,extra={})=>({id,slug:id,title:tags.join(' '),category:'education',content:'Reviewed explanation.',seo:{educationScope:'pakistan-education',sources:'https://www.pbte.edu.pk/'},tags,...extra});
test('shared precise topics rank ahead of weaker matches, without self links or duplicates',()=>{
 const a=post('a',['fractions','ratios','proportions']);
 const b=post('b',['fractions','ratios']);const c=post('c',['fractions','ratios','proportions']);
 assert.deepEqual(relatedArticles(a,[a,b,c,b]).map(p=>p.slug),['c','b']);
});
test('generic tags, different categories and unsafe source-review content do not create recommendations',()=>{
 const a=post('a',['education','pakistan','fractions','ratios']);
 assert.deepEqual(relatedArticles(a,[post('b',['education','pakistan']),post('c',['fractions','ratios'],{category:'sports'}),post('d',['fractions','ratios'],{content:'I certify the result.'})]),[]);
 assert.deepEqual(relatedArticles({...a,content:'I certify the result.'},[post('b',['fractions','ratios'])]),[]);
});
test('recommendations have a bounded payload and stable order',()=>{
 const a=post('a',['fractions','ratios']);
 assert.deepEqual(relatedArticles(a,['e','d','c','b'].map(id=>post(id,a.tags))).map(p=>p.slug),['b','c','d']);
});
test('shared editorial-method tags cannot connect unrelated subject matter',()=>{
 const a=post('a',['source verification','reading guide'],{title:'Subscription payments and cancellation'});
 const b=post('b',a.tags,{title:'Operating system update preparation'});
 assert.deepEqual(relatedArticles(a,[b]),[]);
});
