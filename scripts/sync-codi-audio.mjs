import fs from 'node:fs/promises';
import { audioRelease,audioAssets,github } from './codi-audio-release.mjs';
const catalog=JSON.parse(await fs.readFile('public/codi/audio/catalog.json','utf8'));const required=new Set(catalog.units.map(u=>u.hash));
const release=await audioRelease();const assets=release?await audioAssets(release):[];const ready=[];
for(const asset of assets){const hash=asset.name.slice(0,-4);if(!required.has(hash))continue;if(asset.size<100||asset.size>2000000)throw Error('Prepared audio size is invalid');
 const response=await github(`/releases/assets/${asset.id}`,{headers:{Accept:'application/octet-stream'}});if(!response.ok)throw Error('Prepared audio download failed');const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length!==asset.size)throw Error('Prepared audio download is incomplete');
 await fs.writeFile(`public/codi/audio/${asset.name}`,bytes);ready.push(hash);
}
await fs.writeFile('public/codi/audio/index.json',JSON.stringify({schema:1,ready:ready.sort()}));
console.log(`[codi-audio] ${ready.length}/${required.size} ready sentence recordings synchronized for Firebase Hosting.`);
