import fs from 'node:fs';
import path from 'node:path';
import {hasPrivateCredential} from './private-credential-patterns.mjs';
const root=path.resolve('content/editorial-revisions/trending-pk-20261030');
const original=JSON.parse(fs.readFileSync('content/editorial-drafts/trending-pk-20261030/posts.json','utf8'));
const directories=fs.readdirSync(root).filter(n=>/^\d{3}-/.test(n));
const issues=[],ready=[];
const plain=text=>text.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*_`|#]/g,'');
for(let position=1;position<=79;position++){
 const name=directories.find(n=>Number(n.slice(0,3))===position);if(!name)continue;
 const directory=path.join(root,name);
 if(!['article.md','post.json','review.json'].every(file=>fs.existsSync(path.join(directory,file))))continue;
 try{
  const article=fs.readFileSync(path.join(directory,'article.md'),'utf8'),post=JSON.parse(fs.readFileSync(path.join(directory,'post.json'),'utf8')),review=JSON.parse(fs.readFileSync(path.join(directory,'review.json'),'utf8'));
  const sourceMatch=/^## Sources\s*$/m.exec(article);
  const prose=sourceMatch?article.slice(0,sourceMatch.index):article;
  const clean=plain(prose),words=clean.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)||[];
  const terms=[...new Set((review.seoTerms||[]).map(t=>t.trim()).filter(Boolean))];
  const missing=terms.filter(t=>!clean.toLowerCase().includes(t.toLowerCase()));
  const problems=[];
  if(words.length<2000)problems.push(`Only ${words.length} prose words`);
  if(terms.length<45)problems.push(`Only ${terms.length} curated terms`);
  if(missing.length)problems.push('Missing terms: '+missing.join('; '));
  if(post.id!==original[position-1].id||post.slug!==original[position-1].slug)problems.push('Existing id or slug changed');
  if(!sourceMatch)problems.push('Final Sources section missing');
  if(/\]\(https?:\/\//i.test(prose))problems.push('External link outside Sources');
  if(post.content.replaceAll('\r\n','\n').trim()!==article.replaceAll('\r\n','\n').trim())problems.push('post.json content differs from article.md');
  if(/^# /m.test(article))problems.push('Extra H1 in article');
  if(article.includes('\u2014'))problems.push('Em dash');
  if(!Array.isArray(review.questions)||review.questions.length<6)problems.push('Need six substantive questions');
  if(post.actionButtonText||post.actionButtonUrl)problems.push('Promotional source CTA is still set');
  if(hasPrivateCredential(article+JSON.stringify(post)))problems.push('Private credential pattern');
  if(problems.length)issues.push({position,directory:name,problems});
  else ready.push({position,directory:name,words:words.length,terms:terms.length,questions:review.questions.length});
 }catch{issues.push({position,directory:name,problems:['Incomplete or invalid record; may still be writing']});}
}
const result={required:79,started:directories.length,completeRecords:ready.length+issues.length,validated:ready.length,ready,issues};
fs.mkdirSync('artifacts/editorial-image-revision',{recursive:true});fs.writeFileSync('artifacts/editorial-image-revision/content-audit.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(process.argv.includes('--complete')&&(ready.length!==79||issues.length))process.exitCode=1;
