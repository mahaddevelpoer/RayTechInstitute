// Deterministic delivery sizes from the reviewed transparent logo; no redesign.
import fs from 'node:fs/promises';
import sharp from 'sharp';
const source='content/branding/raytech-logo-source.png';
await fs.mkdir('public/assets',{recursive:true});
await sharp(source).resize(2560,2560,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png({compressionLevel:9}).toFile('content/branding/raytech-logo-hd.png');
await sharp(source).resize(192,192,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).webp({quality:90,effort:5}).toFile('public/assets/raytech-logo.webp');
for(const [file,size] of [['favicon-16x16.png',16],['favicon-32x32.png',32],['favicon-48x48.png',48],['favicon-96x96.png',96],['apple-touch-icon.png',180],['android-chrome-192x192.png',192],['android-chrome-512x512.png',512]]){
 await sharp(source).resize(size,size,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png({compressionLevel:9}).toFile('public/'+file);
}
// ICO accepts embedded PNG frames; retain the familiar /favicon.ico URL.
const sizes=[16,32,48];
const frames=await Promise.all(sizes.map(size=>sharp(source).resize(size,size).png().toBuffer()));
const header=Buffer.alloc(6+16*frames.length);header.writeUInt16LE(1,2);header.writeUInt16LE(frames.length,4);let offset=header.length;
frames.forEach((frame,index)=>{const start=6+16*index,size=sizes[index];header[start]=size===256?0:size;header[start+1]=size===256?0:size;header.writeUInt16LE(1,start+4);header.writeUInt16LE(32,start+6);header.writeUInt32LE(frame.length,start+8);header.writeUInt32LE(offset,start+12);offset+=frame.length;});
await fs.writeFile('public/favicon.ico',Buffer.concat([header,...frames]));
console.log('Prepared 2560px transparent HD logo, lightweight header WebP, square PNG favicons and multi-resolution ICO.');
