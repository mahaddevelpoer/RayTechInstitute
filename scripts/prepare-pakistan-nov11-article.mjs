import fs from 'node:fs';
import sharp from 'sharp';
import {execFileSync} from 'node:child_process';
const name=process.argv[2];if(!/^[a-z0-9-]+$/.test(name||''))throw Error('Article directory required');
const batch=process.argv.find(a=>a.startsWith('--batch='))?.slice(8)||'20261111-daily';
if(!/^2026111[12]-daily$/.test(batch))throw Error('Unsupported November batch');
const region=process.argv.find(a=>a.startsWith('--region='))?.slice(9)||'PK';if(!['PK','IN','US'].includes(region))throw Error('Unsupported region');
const root=`content/editorial-drafts/trending-${region.toLowerCase()}-${batch}`,dir=`${root}/${name}`,output=`public/images/editorial/trending-${region.toLowerCase()}-${batch}`;
const candidates=JSON.parse(fs.readFileSync(`${dir}/images-candidates.json`,'utf8'));
if(candidates.length!==2)throw Error('Two reviewed images required');
const used=new Set(JSON.parse(fs.readFileSync('content/editorial-revisions/trending-pk-20261030/images.json','utf8')).flatMap(r=>[r.cover.sha1,r.inline.sha1]));
for(const folder of fs.readdirSync('content/editorial-drafts').filter(folder=>/^trending-(?:pk|in)-2026/.test(folder))){const base=`content/editorial-drafts/${folder}`;for(const other of fs.readdirSync(base)){if((base!==root||other!==name)&&fs.existsSync(`${base}/${other}/images.json`))for(const i of JSON.parse(fs.readFileSync(`${base}/${other}/images.json`,'utf8')))used.add(i.sha1);}}
fs.mkdirSync(output,{recursive:true});sharp.concurrency(1);sharp.cache({memory:24,files:0,items:0});const images=[];
for(const candidate of candidates){
 const item={...candidate,licenseUrl:candidate.licenseUrl?.replace(/^http:\/\/(creativecommons\.org\/)/i,'https://$1')};
 if(used.has(item.sha1))throw Error('Duplicate image source');used.add(item.sha1);
 const ogl1=item.license==='OGL v1.0'&&/^https?:\/\/(?:www\.)?nationalarchives\.gov\.uk\/doc\/open-government-licence\/version\/1\/?$/i.test(item.licenseUrl||'');
 const godl=item.license==='GODL-India'&&/^https:\/\/(?:www\.)?data\.gov\.in\/(?:government-open-data-license-india\/?|sites\/default\/files\/Gazette_Notification_OGDL\.pdf)$/i.test(item.licenseUrl||'');
 if(!item.source||!item.creator||(!/(CC BY|CC0|Public domain)/i.test(item.license)&&!ogl1&&!godl))throw Error('Incomplete licence record');
 const raw=`artifacts/november-${item.sha1}.image`,destination=`${output}/${name}-${item.role}.webp`;
 let cached=false;if(fs.existsSync(raw)){try{await sharp(raw).stats();cached=true;}catch{cached=false;}}
 if(!cached){const u=new URL(item.url);u.search='';const match=u.pathname.match(/^\/wikipedia\/commons\/(?!thumb\/)(.+)$/);const filename=u.pathname.split('/').at(-1);const thumb=match?`https://upload.wikimedia.org/wikipedia/commons/thumb/${match[1]}/1280px-${filename}`:u.href;
 const args=['--ssl-no-revoke','--fail','--silent','--show-error','--location','--max-time','30','--max-filesize','16000000','--retry','1','--retry-max-time','45','--output',raw];
 try{execFileSync('curl.exe',[...args,thumb],{timeout:65000});}catch{execFileSync('curl.exe',[...args,u.href],{timeout:65000});}}

 const info=await sharp(raw,{limitInputPixels:40000000}).rotate().resize({width:1280,height:960,fit:'inside',withoutEnlargement:true}).webp({quality:80}).toFile(destination);
 images.push({...item,url:`/images/editorial/trending-${region.toLowerCase()}-${batch}/${name}-${item.role}.webp`,width:info.width,height:info.height,bytes:info.size});
}
const post=JSON.parse(fs.readFileSync(`${dir}/post.json`,'utf8'));let content=fs.readFileSync(`${dir}/article.md`,'utf8');
const inline=images.find(i=>i.role==='inline'),cover=images.find(i=>i.role==='cover');
const headings=[...content.matchAll(/^## (?!Sources).+$/gm)];const heading=headings[Math.floor(headings.length/2)];if(!heading)throw Error('Missing article headings');
const at=heading.index;content=content.slice(0,at)+`![${inline.alt.replace(/[\[\]]/g,'')}](${inline.url})\n\n*${inline.caption}*\n\n`+content.slice(at);
content+='\n\nImage credits: '+images.map(i=>`${i.role}: ${i.creator}, [source](${i.source}), [${i.license}](${i.licenseUrl||i.source}). Resized and converted to WebP.`).join(' ')+'\n';
post.content=content;post.featuredImage=cover.url;post.seo={...post.seo,imageAlt:cover.alt,imageCaption:cover.caption};
if(!post.seo.enabled)post.seo.enabled=['imageAlt','imageCaption'];
fs.writeFileSync(`${dir}/post.json`,JSON.stringify(post,null,2));fs.writeFileSync(`${dir}/images.json`,JSON.stringify(images,null,2));
console.log(JSON.stringify({prepared:name,images:2,words:content.split(/\s+/).length}));
