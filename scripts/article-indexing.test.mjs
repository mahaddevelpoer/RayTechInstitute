import {checkArticleRobots} from './article-robots-check.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {loadTypescript} from './load-typescript.mjs';
const {articleCanIndex, isLegacyArticle, hasEducationReview} = await loadTypescript('src/utils/article-indexing.ts');
const legacy=JSON.parse(await fs.readFile('content/editorial-policy/legacy-noindex.json','utf8')).articles;
const post={id:'future-education-update',slug:'future-education-update',category:'education',content:'Source-based education update.',seo:{educationScope:'pakistan-education',sources:'https://www.pbte.edu.pk/'}};
test('every frozen article stays noindex after content, category or identity edits',()=>{
 assert.ok(legacy.length>=638);
 for(const old of legacy){
  assert.equal(articleCanIndex({...post,...old}),false);
  assert.equal(articleCanIndex({...post,id:old.id}),false);
  assert.equal(articleCanIndex({...post,slug:old.slug}),false);
 }
});
test('new reviewed Pakistan and world educational articles can index',()=>{
 assert.equal(articleCanIndex(post),true);
 assert.equal(articleCanIndex({...post,seo:{...post.seo,educationScope:'global-education'}}),true);
 assert.equal(isLegacyArticle(post),false);
});
test('unreviewed, unsourced and out-of-scope future content cannot index',()=>{
 for(const value of [{...post,category:'sports'},{...post,seo:{}},{...post,seo:{...post.seo,sources:'http://example.com'}},{...post,seo:{...post.seo,sources:'https://user:pass@example.com'}},{...post,content:'I certify the result.'}])assert.equal(articleCanIndex(value),false);
 assert.equal(hasEducationReview({...post,category:'entertainment'}),false);
});

test('export gate allows new indexed education while rejecting conflicting archive robot directives',()=>{
 assert.equal(checkArticleRobots('<meta name="robots" content="index, follow"><meta name="googlebot" content="index, follow">','/blogs/new-education/'),false);
 assert.equal(checkArticleRobots('<meta name="robots" content="noindex, follow"><meta name="googlebot" content="noindex, follow">','/blogs/archive/'),true);
 assert.throws(()=>checkArticleRobots('<meta name="robots" content="noindex, follow"><meta name="googlebot" content="index, follow">','/blogs/archive/'),/contradictory googlebot/);
});
