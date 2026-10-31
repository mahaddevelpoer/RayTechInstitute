import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
sharp.concurrency(1);sharp.cache({memory:32,files:4,items:16});
const root=path.resolve('content/editorial-revisions/trending-pk-20261030');
const output=path.resolve('public/images/editorial/trending-pk-20261030-revised');
const raw=path.resolve('artifacts/editorial-image-revision/downloads');
fs.mkdirSync(output,{recursive:true});fs.mkdirSync(raw,{recursive:true});
const manifestFile=path.join(root,'images.json');
const manifest=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):[];
const reviews=fs.readdirSync(root).filter(name=>/^image-review-\d+-\d+\.json$/.test(name));
const requested=reviews.flatMap(name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'))).sort((a,b)=>a.position-b.position);
const issues=[],sourceIds=new Map(),pixelIds=new Map();
for(const row of requested)for(const role of ['cover','inline']){
 const image=row[role],key=`${row.position}-${role}`;
 if(!image?.sha1||!image?.url||!image?.source||!image?.license||!image?.alt||!image?.caption){issues.push({key,problem:'Incomplete image source record'});continue;}
 if(sourceIds.has(image.sha1))issues.push({key,problem:'Repeated original image',other:sourceIds.get(image.sha1)});else sourceIds.set(image.sha1,key);
 if(!/(^CC BY(?:-SA)? \d|CC0|Public domain|PDM)/i.test(image.license))issues.push({key,problem:'Reuse licence not verified'});
 if(image.reviewState!=='semantically-reviewed')issues.push({key,problem:'Semantic review is incomplete'});
}
const badKeys=new Set(issues.map(i=>i.key));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function downloadUrl(image){
 const original=new URL(image.originalUrl||image.url);original.search='';
 if(!original.hostname.endsWith('wikimedia.org'))return image.url;
 if(image.url.includes('/thumb/'))return image.url;
 const match=original.pathname.match(/^\/wikipedia\/commons\/([^/]+\/[^/]+\/.+)$/);
 if(!match)return image.url;
 const filename=match[1].split('/').at(-1);
 return `https://thumb.wikimedia.org/wikipedia/commons/thumb/${match[1]}/1280px-${filename}${/\.svg$/i.test(filename)?'.png':''}`;
}
async function differenceHash(filename){
 const pixels=await sharp(filename).resize(9,8,{fit:'fill'}).removeAlpha().greyscale().raw().toBuffer();let bits=0n;
 for(let y=0;y<8;y++)for(let x=0;x<8;x++)bits=(bits<<1n)|BigInt(pixels[y*9+x]>pixels[y*9+x+1]);
 return bits.toString(16).padStart(16,'0');
}
for(const row of requested){
 const record=manifest.find(r=>r.position===row.position)||{position:row.position};
 for(const role of ['cover','inline']){
  const key=`${row.position}-${role}`,image=row[role];if(badKeys.has(key))continue;
  const filename=`${String(row.position).padStart(3,'0')}-${role}.webp`,destination=path.join(output,filename);
  if(record[role]?.sha1===image.sha1&&fs.existsSync(destination))continue;
  try{
   const input=path.join(raw,`${image.sha1}.image`);
   if(!fs.existsSync(input)){
    await wait(1800);
    const options=['--fail','--location','--silent','--show-error','--ssl-no-revoke','--max-time','20','--max-filesize','12000000','--retry','1','--retry-delay','10','--output',input,downloadUrl(image)];
    try{execFileSync('curl.exe',options,{stdio:['ignore','pipe','pipe'],timeout:55000});}
    catch{if(image.bytes>12000000||/\.svg(?:\?|$)/i.test(image.originalUrl||image.url))throw Error('Network image unavailable');execFileSync('curl.exe',[...options.slice(0,-1),image.originalUrl||image.url],{stdio:['ignore','pipe','pipe'],timeout:55000});}
   }
   const format=(await sharp(input,{limitInputPixels:30000000}).metadata()).format;
   if(!['jpeg','png','webp'].includes(format))throw Error('Expected a decoded raster image');
   const info=await sharp(input,{limitInputPixels:30000000}).rotate().resize({width:1280,height:960,fit:'inside',withoutEnlargement:true}).webp({quality:82,effort:3}).toFile(destination);
   if(info.size>450000)throw Error('Image exceeds the compressed size budget');
   const fileHash=createHash('sha256').update(fs.readFileSync(destination)).digest('hex');
   if(pixelIds.has(fileHash))throw Error('A decoded image is already used by '+pixelIds.get(fileHash));pixelIds.set(fileHash,key);
   record[role]={...image,width:info.width,height:info.height,bytes:info.size,publicUrl:`/images/editorial/trending-pk-20261030-revised/${filename}`,fileSha256:fileHash,differenceHash:await differenceHash(destination),modifications:'Resized without cropping, converted to WebP and stripped of embedded metadata'};
   console.log(`${key}: verified ${info.width}x${info.height}, ${info.size} bytes`);
  }catch(error){issues.push({key,problem:error.message?.startsWith('A decoded')?error.message:'Download or image validation failed; source kept for review'});}
 }
 if(!manifest.includes(record))manifest.push(record);
 fs.writeFileSync(manifestFile,JSON.stringify(manifest.sort((a,b)=>a.position-b.position),null,2)+'\n');
}
const all=manifest.flatMap(row=>['cover','inline'].filter(role=>row[role]).map(role=>({key:`${row.position}-${role}`,...row[role]})));
const nearDuplicates=[];
for(let i=0;i<all.length;i++)for(let j=0;j<i;j++){
 let diff=BigInt('0x'+all[i].differenceHash)^BigInt('0x'+all[j].differenceHash),distance=0;while(diff){distance+=Number(diff&1n);diff>>=1n;}
 if(distance<=3)nearDuplicates.push({first:all[j].key,second:all[i].key,distance});
}
const report={reviewedArticles:requested.length,preparedArticles:manifest.filter(r=>r.cover&&r.inline).length,preparedImages:all.length,uniqueSources:new Set(all.map(i=>i.sha1)).size,uniqueFiles:new Set(all.map(i=>i.fileSha256)).size,nearDuplicates,issues};
fs.writeFileSync('artifacts/editorial-image-revision/image-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
