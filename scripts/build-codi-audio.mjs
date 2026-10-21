import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { audioRelease,audioAssets,github,repository,tag } from './codi-audio-release.mjs';
const max=Number(process.env.CODI_AUDIO_BATCH||6);if(!Number.isInteger(max)||max<1||max>12)throw Error('Choose a batch of 1 to 12 sentence recordings.');
const catalog=JSON.parse(await fs.readFile('public/codi/audio/catalog.json','utf8'));let release=await audioRelease();
if(!release){const r=await github('/releases',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tag_name:tag,target_commitish:process.env.GITHUB_SHA,name:'Codi prepared lesson audio',body:'Generated public lesson sentence recordings. Served by Firebase Hosting; no private drafts, credentials or learner submissions.',prerelease:true})});release=await r.json();}
const existing=new Set((await audioAssets(release)).map(a=>a.name.slice(0,-4)));const pending=catalog.units.filter(u=>!existing.has(u.hash)&&(!process.env.CODI_AUDIO_LESSON||u.lesson===process.env.CODI_AUDIO_LESSON)).slice(0,max);
const folder=path.resolve('artifacts/codi-prepared');await fs.mkdir(folder,{recursive:true});const guestId=randomUUID();let generated=0;
for(const [index,unit]of pending.entries()){
 if(index)await new Promise(r=>setTimeout(r,31000));
 const response=await fetch('https://btxrkhwyugzliswznkpx.supabase.co/functions/v1/codi-voice',{method:'POST',headers:{Origin:'https://raytechinstitute.web.app','Content-Type':'application/json'},body:JSON.stringify({action:'read',language:unit.language,text:unit.text,guestId,consent:true}),signal:AbortSignal.timeout(65000)});
 if(response.status===429){console.log('[codi-audio] Shared free allowance reached. Remaining sentences stay queued; no paid fallback.');break;}
 if(!response.ok){console.log(`[codi-audio] Sentence not published (${response.status}); it stays queued. Continuing within this bounded batch.`);continue;}
 const data=await response.json();if(data.rate!==24000||typeof data.audio!=='string'||!['gemini-2.5-flash-preview-tts','gemini-2.5-flash-native-audio-preview-12-2025'].includes(data.model))throw Error('Unexpected prepared speech format');
 const pcm=Buffer.from(data.audio,'base64');if(pcm.length<1000||pcm.length>4400000||pcm.length%2||!pcm.some(n=>n!==0))throw Error('Invalid prepared speech');
 const source=path.join(folder,unit.hash+'.pcm'),target=path.join(folder,unit.hash+'.mp3');await fs.writeFile(source,pcm);
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','s16le','-ar','24000','-ac','1','-i',source,'-codec:a','libmp3lame','-b:a','64k',target],{stdio:'pipe',timeout:20000});
 const bytes=await fs.readFile(target);const upload=await fetch(`https://uploads.github.com/repos/${repository}/releases/${release.id}/assets?name=${unit.hash}.mp3`,{method:'POST',headers:{Authorization:'Bearer '+process.env.GH_TOKEN,'Content-Type':'audio/mpeg'},body:bytes,signal:AbortSignal.timeout(30000)});if(!upload.ok)throw Error('Prepared audio upload failed; no private provider response logged');existing.add(unit.hash);generated++;console.log(`[codi-audio] Saved ${unit.language} sentence ${generated}/${pending.length}.`);
}
console.log(JSON.stringify({generated,ready:existing.size,total:catalog.units.length,remaining:catalog.units.filter(u=>!existing.has(u.hash)).length}));
if(generated){const dispatch=await github('/actions/workflows/deploy-firebase.yml/dispatches',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ref:'main'})});if(!dispatch.ok)throw Error('Prepared audio saved; hosting refresh needs a manual deployment.');}
