import fs from 'node:fs';
import path from 'node:path';

// Local staging only. This script deliberately has no database or deploy access.
const root=path.resolve('content/editorial-revisions/trending-pk-20261030');
const images=JSON.parse(fs.readFileSync(path.join(root,'images.json'),'utf8'));
const posts=[],missing=[];
const escape=text=>String(text).replace(/[\[\]<>\r\n]/g,' ').trim();
for(const name of fs.readdirSync(root).filter(n=>/^\d{3}-/.test(n)).sort()){
 const position=Number(name.slice(0,3)),dir=path.join(root,name);
 const media=images.find(row=>row.position===position);
 if(!media?.cover||!media?.inline){missing.push(position);continue;}
 const post=JSON.parse(fs.readFileSync(path.join(dir,'post.json'),'utf8'));
 const review=JSON.parse(fs.readFileSync(path.join(dir,'review.json'),'utf8'));
 let content=fs.readFileSync(path.join(dir,'article.md'),'utf8').replace(/\r\n/g,'\n');
 const headings=[...content.matchAll(/^## (?!Sources\s*$).+$/gm)];
 if(!headings.length)throw Error(`No insertion heading for ${position}`);
 const heading=headings[Math.floor(headings.length/2)];
 const offset=heading.index+heading[0].length;
 const inline=media.inline;
 content=content.slice(0,offset)+`\n\n![${escape(inline.alt)}](${inline.publicUrl})\n\n*${escape(inline.caption)}*`+content.slice(offset);
 content+='\n\nImage credits: '+['cover','inline'].map(role=>{
  const image=media[role];
  const licenseLink=image.licenseUrl?`[${escape(image.license)}](${image.licenseUrl})`:escape(image.license);
  return `${role==='cover'?'Cover':'Article image'}: ${escape(image.creator||'See source attribution')}, [source](${image.source}), ${licenseLink}. Resized and converted to WebP.`;
 }).join(' ')+'\n';
 delete post.actionButtonText;delete post.actionButtonUrl;
 posts.push({...post,content,featuredImage:media.cover.publicUrl,readTime:`${Math.ceil(review.proseWords/220)} min read`});
}
fs.writeFileSync(path.join(root,'assembled-posts.json'),JSON.stringify(posts,null,2)+'\n');
console.log(JSON.stringify({assembled:posts.length,required:79,missingImages:missing,publicationChanged:false}));
if(process.argv.includes('--complete')&&(posts.length!==79||missing.length))process.exitCode=1;
