import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {loadTypescript} from './load-typescript.mjs';
const {discoverableArticles,isArchivedArticleHref}=await loadTypescript('src/utils/article-visibility.ts');
const {relatedArticles}=await loadTypescript('src/utils/related-articles.ts');
const legacy=JSON.parse(await fs.readFile('content/editorial-policy/legacy-noindex.json','utf8')).articles;
const future={id:'new-education-update',slug:'new-education-update',title:'Punjab admissions eligibility',excerpt:'Punjab admissions eligibility guide',category:'education',tags:['admissions','eligibility'],content:'Checked educational guidance.',seo:{educationScope:'pakistan-education',sources:'https://www.pbte.edu.pk/'}};
test('every existing article is excluded from public discovery without deleting or editing its record',()=>{
 const posts=legacy.map(old=>({...future,...old}));const before=JSON.stringify(posts);assert.deepEqual(discoverableArticles(posts),[]);assert.equal(JSON.stringify(posts),before);
 assert.deepEqual(discoverableArticles([...posts,future]).map(p=>p.id),[future.id]);assert.deepEqual(discoverableArticles([{...future,seo:{}}]),[]);
});
test('relative, absolute, old-domain, encoded and legacy-preview links to every archived slug are recognized',()=>{
 for(const post of legacy){for(const path of [`/blogs/${post.slug}/`,`https://raytechinstitute.com/blogs/${post.slug}/?ref=notes`,`https://raytechinstitute.web.app/blogs/${post.slug}/`,`/blogs/post/?slug=${encodeURIComponent(post.slug)}`,`/blogs/${post.slug}/index.html`])assert.equal(isArchivedArticleHref(path),true,path);}
 for(const path of ['/classes/','/blogs/new-education-update/','/blogs/','#chapter','https://example.com/blogs/'+legacy[0].slug+'/'])assert.equal(isArchivedArticleHref(path),false,path);
});
test('related blocks cannot promote an archive even when it shares reviewed education metadata and tags',()=>{
 const old={...future,...legacy[0]};assert.deepEqual(relatedArticles(future,[old]),[]);assert.deepEqual(relatedArticles(old,[future]),[]);
});

test('the actual public listing renders only future reviewed articles and a useful empty state',async()=>{
 const {build}=await import('esbuild');const vm=await import('node:vm');const {createRequire}=await import('node:module');const React=(await import('react')).default;const {renderToStaticMarkup}=await import('react-dom/server');const {JSDOM}=await import('jsdom');const require=createRequire(import.meta.url);
 for(const includeFuture of [false,true]){
  const posts=legacy.slice(0,3).map(old=>({...future,featuredImage:'/android-chrome-512x512.png',datePublished:'2026-11-27',...old}));if(includeFuture)posts.push({...future,featuredImage:'/android-chrome-512x512.png',datePublished:'2026-11-27'});
  const result=await build({entryPoints:['src/components/educational/BlogsClientView.tsx'],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime','next/link'],plugins:[{name:'readonly-blog-fixture',setup(builder){builder.onResolve({filter:/^@\/data\/educationalStore$/},()=>({path:'store',namespace:'fixture'}));builder.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:'export const EducationalStore={getBlogs:()=>'+JSON.stringify(posts)+'};',loader:'js'}));}}]});
  const module={exports:{}};vm.runInNewContext(result.outputFiles[0].text,{module,exports:module.exports,URL,require:id=>id==='next/link'?{__esModule:true,default:({children,prefetch,...props})=>React.createElement('a',props,children)}:require(id)});
  const document=new JSDOM(renderToStaticMarkup(React.createElement(module.exports.BlogsClientView))).window.document;
  assert.equal([...document.querySelectorAll('a')].filter(a=>isArchivedArticleHref(a.getAttribute('href'))).length,0);
  for(const old of posts.filter(p=>p.id!==future.id))assert.ok(!document.body.textContent.includes(old.title));
  assert.equal(document.querySelectorAll('article').length,includeFuture?1:0);assert.ok(![...document.querySelectorAll('button')].some(b=>b.textContent==='Sports'));
  if(includeFuture)assert.equal(document.querySelector('article a').getAttribute('href'),'/blogs/'+future.slug+'/');else assert.ok(document.body.textContent.includes('New educational updates will appear here.'));
 }
});
