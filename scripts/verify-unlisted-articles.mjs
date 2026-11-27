import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {loadTypescript} from './load-typescript.mjs';
const {isArchivedArticleHref}=await loadTypescript('src/utils/article-visibility.ts');
const legacy=JSON.parse(await fs.readFile('content/editorial-policy/legacy-noindex.json','utf8')).articles;
const root=path.resolve('out');const files=[];
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else if(entry.name.endsWith('.html'))files.push(file);}}
await walk(root);let pages=0;const violations=[];
for(const file of files){const relative=path.relative(root,file).replaceAll('\\','/');if(relative.startsWith('admin/'))continue;const html=await fs.readFile(file,'utf8');pages++;
 for(const match of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/gi)){const href=match[1].replaceAll('&amp;','&');if(isArchivedArticleHref(href))violations.push({page:relative,href});}
}
assert.equal(violations.length,0,'Public archive anchor violations: '+JSON.stringify(violations.slice(0,20)));
for(const article of legacy){const html=await fs.readFile(path.join(root,'blogs',article.slug,'index.html'),'utf8');assert.match(html,/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i,article.slug);assert.match(html,/<h1\b/,article.slug);}
const report={publicHtmlPages:pages,archiveArticlesPreserved:legacy.length,publicArchiveAnchors:0};await fs.mkdir('artifacts/article-unlisting',{recursive:true});await fs.writeFile('artifacts/article-unlisting/checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
