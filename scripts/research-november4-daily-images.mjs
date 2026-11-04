import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';const cache=path.resolve('artifacts/november4-daily/image-api');fs.mkdirSync(cache,{recursive:true});const root='content/editorial-drafts/trending-pk-20261104-daily';const plan=JSON.parse(fs.readFileSync(root+'/plan.json','utf8'));const used=new Set();for(const d of fs.readdirSync('content/editorial-drafts')){const p='content/editorial-drafts/'+d;for(const n of fs.readdirSync(p)){const f=p+'/'+n+'/images.json';if(fs.existsSync(f))for(const i of JSON.parse(fs.readFileSync(f,'utf8')))used.add(i.sha1);}}for(const r of JSON.parse(fs.readFileSync('content/editorial-revisions/trending-pk-20261030/images.json','utf8')))for(const i of [r.cover,r.inline])used.add(i.sha1);
const plain=value=>String(value||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&#0?39;|&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function get(url){
 const file=path.join(cache,createHash('sha256').update(url).digest('hex')+'.json');
 if(fs.existsSync(file))return JSON.parse(fs.readFileSync(file,'utf8'));
 await wait(1000);
 let result;try{result=execFileSync('curl.exe',['--fail','--location','--silent','--show-error','--ssl-no-revoke','--max-time','20','--retry','1','--retry-delay','3','--user-agent','RayTechEditorialImageReview/1.0 (https://raytechinstitute.com)',url],{encoding:'utf8',timeout:47000,maxBuffer:12000000});}catch{throw Error('Image source request unavailable');}
 const json=JSON.parse(result);if(json.error)throw Error('Image source API error');fs.writeFileSync(file,JSON.stringify(json));return json;
}
async function candidates(query){
 const search=new URL('https://api.wikimedia.org/core/v1/commons/search/page');search.searchParams.set('q',query+' filetype:bitmap');search.searchParams.set('limit','12');
 const found=await get(search.href);
 const titles=(found.pages||[]).filter(p=>p.key?.startsWith('File:')&&/\.(jpe?g|png|webp)$/i.test(p.key)&&!/(?:cropped|retouched|montage|collage|logo|flag|icon|screenshot|AI.generated)/i.test(p.key)).map(p=>p.key);
 if(!titles.length)return [];
 const info=new URL('https://en.wikipedia.org/w/api.php');info.searchParams.set('action','query');info.searchParams.set('titles',titles.join('|'));info.searchParams.set('prop','imageinfo');info.searchParams.set('iiprop','url|size|extmetadata|sha1');info.searchParams.set('iiurlwidth','1200');info.searchParams.set('format','json');
 const metadata=await get(info.href);
 const pages=Object.values(metadata.query?.pages||{});
 return titles.map(title=>pages.find(p=>p.title.replaceAll(' ','_')===title.replaceAll(' ','_'))).filter(Boolean).flatMap(page=>{
  const i=page.imageinfo?.[0],m=i?.extmetadata||{},license=plain(m.LicenseShortName?.value),description=plain(m.ImageDescription?.value),creator=plain(m.Attribution?.value||m.Artist?.value);
  if(!i||!i.sha1||i.width<600||i.height<400||!/^https:\/\/upload\.wikimedia\.org\//.test(i.url)||!/(^CC BY(?:-SA)? \d|CC0|Public domain|PDM)/i.test(license)||/AI.generated|Midjourney|Stable Diffusion|DALL.E/i.test(description+' '+plain(m.Categories?.value))||(/CC BY/i.test(license)&&!creator))return [];
  return [{fileTitle:page.title,url:i.thumburl||i.url,originalUrl:i.url,source:i.descriptionurl,creator:creator||'Public-domain source',license,licenseUrl:m.LicenseUrl?.value||i.descriptionurl,alt:description.slice(0,200)||page.title.replace(/^File:|\.[^.]+$/g,''),description,caption:description.slice(0,220),width:i.width,height:i.height,bytes:i.size,sha1:i.sha1,photographedAt:plain(m.DateTimeOriginal?.value),query,reviewState:'candidate-needs-visual-review'}];
 });
}

for(const g of plan.groups.slice(0,10)){const dir=root+'/'+g.key;fs.mkdirSync(dir,{recursive:true});const file=dir+'/images-candidates.json';if(fs.existsSync(file)){console.log(g.key+': cached');continue;}const selected=[];for(let n=0;n<2;n++){try{const found=await candidates(g.queries[n]);const pick=found.find(i=>!used.has(i.sha1));if(pick){selected.push({...pick,role:n?'inline':'cover'});used.add(pick.sha1);}else console.log(g.key+': missing '+g.queries[n]);}catch(e){console.log(g.key+': '+e.message);}}fs.writeFileSync(file,JSON.stringify(selected,null,2));console.log(g.key+': '+selected.length+' images');}