import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';

// Downloads existing, credited artwork only. No AI image generation or new artwork.
sharp.concurrency(1);
const root=path.resolve('content/editorial-drafts/trending-pk-20261030');
const rawDir=path.resolve('artifacts/trend-network-images');
const outputDir=path.resolve('public/images/editorial/trending-pk-20261030');
fs.mkdirSync(rawDir,{recursive:true});fs.mkdirSync(outputDir,{recursive:true});
const images=JSON.parse(fs.readFileSync(path.join(root,'network-images.json'),'utf8'));
const firstDir=fs.readdirSync(root).find(n=>n.startsWith('001-'));
const firstReview=JSON.parse(fs.readFileSync(path.join(root,firstDir,'review.json'),'utf8'));
images.eden=firstReview.image.originalUrl?{...firstReview.image,url:firstReview.image.originalUrl}:firstReview.image;
const manifestFile=path.join(root,'downloaded-images.json');
const results=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):{};
for(const [id,image] of Object.entries(images)){
  if(results[id]&&fs.existsSync(path.join(outputDir,`${id}.webp`)))continue;
  const raw=path.join(rawDir,`${id}${new URL(image.url).pathname.endsWith('.svg')?'.svg':'.img'}`);
  if(!fs.existsSync(raw)){
    try{execFileSync('curl.exe',['--fail','--location','--silent','--show-error','--ssl-no-revoke','--max-time','20','--retry','2','--retry-delay','20','--output',raw,image.url],{stdio:['ignore','pipe','pipe'],timeout:105000});}
    catch{console.error(`Network image download unavailable: ${id}. Cached images retained; rerun to resume.`);process.exit(1);}
    await new Promise(resolve=>setTimeout(resolve,2500));
  }
  const target=path.join(outputDir,`${id}.webp`);
  const info=await sharp(raw,{limitInputPixels:24000000}).resize({width:1280,height:960,fit:'inside',withoutEnlargement:true}).webp({quality:80,effort:3}).toFile(target);
  results[id]={url:`/images/editorial/trending-pk-20261030/${id}.webp`,originalUrl:image.url,width:info.width,height:info.height,bytes:info.size,modifications:'Resized to fit within 1280 × 960 pixels without cropping; converted to WebP'};
  console.log(`${id}: downloaded and verified, ${info.width}x${info.height}, ${info.size} bytes`);
  fs.writeFileSync(path.join(root,'downloaded-images.json'),JSON.stringify(results,null,2)+'\n');
}
const firstPostFile=path.join(root,firstDir,'post.json');
const firstPost=JSON.parse(fs.readFileSync(firstPostFile,'utf8'));
firstPost.featuredImage=results.eden.url;
firstReview.image={...firstReview.image,...results.eden};
fs.writeFileSync(firstPostFile,JSON.stringify(firstPost,null,2)+'\n');
fs.writeFileSync(path.join(root,firstDir,'review.json'),JSON.stringify(firstReview,null,2)+'\n');
console.log(`Saved ${Object.keys(results).length} licensed network images locally.`);
