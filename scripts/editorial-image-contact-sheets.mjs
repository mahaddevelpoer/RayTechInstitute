import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
sharp.concurrency(1);
sharp.cache({memory:24,files:4,items:8});
const root='public/images/editorial/trending-pk-20261030-revised';
const output='artifacts/editorial-image-revision/contact-sheets';
fs.mkdirSync(output,{recursive:true});
const files=fs.readdirSync(root).filter(name=>name.endsWith('.webp')).sort();
for(let start=0;start<files.length;start+=20){
 const batch=files.slice(start,start+20),layers=[];
 for(let i=0;i<batch.length;i++){
  const left=(i%4)*300,top=Math.floor(i/4)*230;
  const input=await sharp(path.join(root,batch[i])).resize(288,194,{fit:'contain',background:'#eeeeee'}).png().toBuffer();
  layers.push({input,left:left+6,top:top+6});
  layers.push({input:Buffer.from(`<svg width="300" height="24"><text x="8" y="17" font-family="sans-serif" font-size="14">${batch[i]}</text></svg>`),left,top:top+203});
 }
 const destination=path.join(output,`sheet-${String(start/20+1).padStart(2,'0')}.jpg`);
 await sharp({create:{width:1200,height:Math.ceil(batch.length/4)*230,channels:3,background:'#ffffff'}}).composite(layers).jpeg({quality:83}).toFile(destination);
 console.log(destination);
}
