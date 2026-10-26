// Generate small first-party images from the existing brand assets. No network.
import fs from 'node:fs/promises';
import sharp from 'sharp';
await fs.mkdir('public/og',{recursive:true});
for(const [name,width] of [['avatar',192],['banner',1280]]){
 await sharp(`public/assets/${name}.jpg`).rotate().resize({width,withoutEnlargement:true}).webp({quality:84,effort:5}).toFile(`public/assets/${name}.webp`);
}
const logo=await sharp('public/assets/avatar.jpg').resize(112,112).png().toBuffer();
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0a1f3b"/><rect x="72" y="74" width="8" height="482" fill="#39bfa9"/><image x="112" y="90" width="112" height="112" href="data:image/png;base64,${logo.toString('base64')}"/><text x="112" y="290" fill="white" font-family="Arial,sans-serif" font-size="76" font-weight="700">RayTech Institute</text><text x="116" y="352" fill="#cbd8eb" font-family="Arial,sans-serif" font-size="34">Class resources and programming courses</text><path d="M116 404H1080" stroke="#3c5271" stroke-width="2"/><text x="116" y="466" fill="white" font-family="Arial,sans-serif" font-size="28">Notes · Topic MCQs · Past papers · Browser practice</text><text x="116" y="530" fill="#82dccc" font-family="Arial,sans-serif" font-size="25">Learn. Understand. Apply.</text></svg>`;
await sharp(Buffer.from(svg)).png({compressionLevel:9,palette:true}).toFile('public/og/raytech-study-resources.png');
for(const file of ['assets/avatar.webp','assets/banner.webp','og/raytech-study-resources.png'])console.log(JSON.stringify({file,...await sharp('public/'+file).metadata()}));
