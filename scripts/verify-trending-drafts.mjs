import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {loadTypescript} from './load-typescript.mjs';
import {hasPrivateCredential} from './private-credential-patterns.mjs';

const root=path.resolve('content/editorial-drafts/trending-pk-20261030');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'progress.json'),'utf8'));
const {BLOG_CATEGORIES}=await loadTypescript('src/data/blogCategories.ts');
const {buildSeoTitle}=await loadTypescript('src/utils/seo.ts');
const categories=new Map(BLOG_CATEGORIES.map(c=>[c.id,c.label]));
const dirs=fs.readdirSync(root).filter(n=>/^\d{3}-/.test(n));
assert.equal(manifest.length,79);assert.equal(dirs.length,79);
assert.equal(manifest.filter(e=>e.state==='completed-draft').length,79);
function csvRows(text){let rows=[],row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if(c==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';}else cell+=c;}if(cell||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}return rows;}
if(process.argv[2]){const rows=csvRows(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,''));const col=rows[0].indexOf('Trends');assert.ok(col>=0);const trends=rows.slice(1).filter(r=>r[col]?.trim()).map(r=>r[col].trim());assert.deepEqual(manifest.map(e=>e.trend),trends,'Manifest must exactly match all CSV trends in order.');}
const posts=[],reviews=[],slugs=new Set(),titles=new Set(),descriptions=new Set();
for(const entry of manifest){
 const dir=path.join(root,dirs.find(n=>n.startsWith(String(entry.position).padStart(3,'0')+'-')));
 const post=JSON.parse(fs.readFileSync(path.join(dir,'post.json'),'utf8'));
 const review=JSON.parse(fs.readFileSync(path.join(dir,'review.json'),'utf8'));
 assert.equal(post.content,fs.readFileSync(path.join(dir,'article.md'),'utf8'));
 assert.match(post.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
 assert.ok(!slugs.has(post.slug));slugs.add(post.slug);
 const title=buildSeoTitle(post.title);assert.ok(title.length>=50&&title.length<=60);assert.ok(!titles.has(title),`Duplicate SEO title: ${title}`);titles.add(title);
 assert.ok(post.excerpt.length>=120&&post.excerpt.length<=155);assert.ok(!descriptions.has(post.excerpt));descriptions.add(post.excerpt);
 assert.ok(categories.has(post.category));assert.ok(post.tags.length>=4);
 assert.equal(post.datePublished,'','Publication date stays unset until explicit approval.');
 assert.ok(review.words>=250);assert.ok(review.relatedTermsUsed.length>=30);
 const prose=post.content.split('## Sources and image credit')[0].replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').toLowerCase();
 for(const term of review.relatedTermsUsed)assert.ok(prose.includes(term.toLowerCase()),`Missing keyword ${entry.position}: ${term}`);
 assert.ok(!/^# /m.test(post.content),'The page title supplies the only H1.');
 assert.ok(!hasPrivateCredential(JSON.stringify(post)),'Private credential detected.');
 assert.ok(!/<script\b|javascript:|onerror=/i.test(post.content));
 assert.match(post.featuredImage,/^\/images\/editorial\/trending-pk-20261030\/[a-z]+\.webp$/);
 const imageFile=path.join('public',post.featuredImage);
 const image=await sharp(imageFile).metadata();
 assert.equal(image.format,'webp');assert.equal(image.width,review.image.width);assert.equal(image.height,review.image.height);
 assert.ok(fs.statSync(imageFile).size<350000);assert.ok(review.image.creator&&review.image.license&&review.image.source);
 assert.ok(post.content.includes(review.image.licenseUrl));
 posts.push(post);reviews.push({...review,position:entry.position,directory:path.basename(dir),seoTitle:title});
}
for(const post of posts)for(const match of post.content.matchAll(/\]\((\/[^)]+)\)/g)){
 const href=match[1].split('#')[0].split('?')[0];
 const blog=href.match(/^\/blogs\/([^/]+)\/?$/);
 if(blog&&slugs.has(blog[1]))continue;
 const clean=href.replace(/^\/+|\/+$/g,'');
 assert.ok(fs.existsSync(path.join('out',clean,'index.html'))||fs.existsSync(path.join('src/app',clean,'page.tsx')),`Broken internal link in ${post.slug}: ${href}`);
}
fs.writeFileSync(path.join(root,'posts.json'),JSON.stringify(posts,null,2)+'\n');
const summary={state:'local-drafts-validated-not-published',articles:posts.length,totalWords:reviews.reduce((n,r)=>n+r.words,0),minimumWords:Math.min(...reviews.map(r=>r.words)),minimumRelevantTerms:Math.min(...reviews.map(r=>r.relatedTermsUsed.length)),categories:[...new Set(posts.map(p=>p.category))],uniqueSlugs:slugs.size,uniqueSeoTitles:titles.size,images:[...new Set(posts.map(p=>p.featuredImage))].length,checks:['CSV topic coverage','Unique slugs and SEO metadata','At least 30 curated relevant terms present in each article','Valid Markdown headings','Internal link targets','Local WebP files and dimensions','Image attribution and licences','Private credential patterns','No publication dates or production writes'],limitations:['These are concise explainers, not 3,000-word pillar articles.','Historical and illustrative images are credited; not every article has a unique photograph.','Live scores, rankings, availability and legal or policy changes need rechecking at publication.','No ranking, indexing or traffic guarantee. No publication or deployment performed.']};
fs.writeFileSync(path.join(root,'validation.json'),JSON.stringify(summary,null,2)+'\n');
const index=['# Trending articles: 30 October 2026','',`${summary.articles} local drafts. ${summary.totalWords.toLocaleString('en-US')} teaching words. Nothing published.`,'','| # | Article | Category | Words | Relevant terms |','|---|---|---|---:|---:|',...posts.map((p,i)=>`| ${i+1} | [${p.title}](./${reviews[i].directory}/article.md) | ${categories.get(p.category)} | ${reviews[i].words} | ${reviews[i].relatedTermsUsed.length} |`),'','Review `validation.json` for checks and publication limits. `posts.json` is the import-ready batch; do not import it into production without approval.',''].join('\n');
fs.writeFileSync(path.join(root,'INDEX.md'),index);
const preview=path.resolve('artifacts/trending-articles-preview');fs.mkdirSync(preview,{recursive:true});
fs.mkdirSync(path.join(preview,'images'),{recursive:true});
for(const image of new Set(posts.map(p=>p.featuredImage)))fs.copyFileSync(path.join('public',image),path.join(preview,'images',path.basename(image)));
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=':root{color-scheme:light dark}*{box-sizing:border-box}body{margin:0;font:17px/1.8 system-ui,sans-serif;background:light-dark(#fff,#202020);color:light-dark(#182439,#eee)}main{max-width:900px;margin:auto;padding:32px 24px}h1{font-size:2rem;line-height:1.25}h2{font-size:1.35rem;line-height:1.4;margin-top:2rem}a{color:light-dark(#174fb8,#9cc5ff)}.meta{font-size:14px;color:light-dark(#4b5867,#bbb)}.cover{display:block;max-width:100%;max-height:420px;object-fit:contain;margin:24px auto}li{margin-bottom:10px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #888;padding:8px}';
for(const [i,post] of posts.entries()){
 const img=reviews[i].image;const src=`images/${path.basename(post.featuredImage)}`;
 const body=renderToStaticMarkup(React.createElement(Markdown,{remarkPlugins:[remarkGfm],children:post.content,components:{a:({href,children})=>{const internal=href?.match(/^\/blogs\/([^/]+)\/?$/);return React.createElement('a',{href:internal&&slugs.has(internal[1])?`${internal[1]}.html`:href?.startsWith('/')?`https://raytechinstitute.com${href}`:href},children);}}}));
 fs.writeFileSync(path.join(preview,`${post.slug}.html`),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(post.title)}</title><style>${css}</style><main><a href="index.html">All 79 drafts</a><h1>${escape(post.title)}</h1><p class="meta">${escape(categories.get(post.category))} · ${reviews[i].words} words · ${escape(post.readTime)}</p><img class="cover" src="${src}" width="${img.width}" height="${img.height}" alt="${escape(img.alt)}">${body}</main></html>`);
}
fs.writeFileSync(path.join(preview,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>79 article drafts | RayTech Institute</title><style>${css}</style><main><h1>79 article drafts</h1><p>Local review copy. Nothing published. Images are downloaded, credited network assets.</p><ol>${posts.map((p,i)=>`<li><a href="${p.slug}.html">${escape(p.title)}</a><div class="meta">${escape(categories.get(p.category))} · ${reviews[i].words} words · ${reviews[i].relatedTermsUsed.length} relevant terms</div></li>`).join('')}</ol></main></html>`);
console.log(JSON.stringify(summary,null,2));
