import fs from 'node:fs';
const batch=process.argv.find(a=>a.startsWith('--batch='))?.slice(8)||'20261101';
if(!/^2026110[123]$/.test(batch))throw Error('Unsupported November batch');
const root=`content/editorial-drafts/trending-pk-${batch}`,origin='https://raytechinstitute.com';
async function request(url, options={}) {
 for(let attempt=0;attempt<2;attempt++){
  try {
   const response=await fetch(url,{...options,signal:AbortSignal.timeout(30000)});
   if(response.status>=500&&attempt===0){await response.body?.cancel();continue;}
   return response;
  }catch(error){if(attempt===1)throw error;}
 }
}
const sitemap=await(await request(origin+'/sitemap.xml')).text();
const listing=await(await request(origin+'/blogs/')).text();
const target=process.argv.find(value=>value.startsWith('--article='))?.slice(10);
const previous=target&&fs.existsSync('artifacts/november-publish/live-verification.json')?JSON.parse(fs.readFileSync('artifacts/november-publish/live-verification.json')).results:[];
const results=previous.filter(row=>row.name!==target);
const unescapeHtml=value=>value.replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
for(const name of fs.readdirSync(root)){
 if(target&&name!==target)continue;
 if(!fs.existsSync(`${root}/${name}/post.json`)||!fs.existsSync(`${root}/${name}/images.json`))continue;
 const post=JSON.parse(fs.readFileSync(`${root}/${name}/post.json`,'utf8'));
 const images=JSON.parse(fs.readFileSync(`${root}/${name}/images.json`,'utf8'));
 const url=`${origin}/blogs/${post.slug}/`;
 try{
  const response=await request(url);const html=await response.text();
  const checks=[];for(const image of images){const r=await request(origin+image.url,{method:'HEAD'});checks.push({url:image.url,status:r.status,present:html.includes(image.url)});}
  const seo={title:unescapeHtml(html.match(/<title>([^<]*)<\/title>/)?.[1]||'')===post.seo.title,
    description:unescapeHtml(html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'')===post.seo.description,
    canonical:html.includes(`<link rel="canonical" href="${url}"`),
    oneH1:(html.match(/<h1\b/g)||[]).length===1,
    articleSchema:html.includes('"@type":"BlogPosting"'),
    indexable:![...html.matchAll(/<meta name="(?:robots|googlebot)" content="([^"]*)"/g)].some(match=>/noindex/i.test(match[1]))};
  results.push({name,batch,url,status:response.status,listing:listing.includes(post.slug),sitemap:sitemap.includes(url),images:checks,seo,verified:response.status===200&&listing.includes(post.slug)&&sitemap.includes(url)&&checks.every(i=>i.status===200&&i.present)&&Object.values(seo).every(Boolean)});
 }catch{results.push({name,url,verified:false,error:'Live verification request failed'});}
}
fs.mkdirSync('artifacts/november-publish',{recursive:true});fs.writeFileSync('artifacts/november-publish/live-verification.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
console.log(JSON.stringify({checked:results.length,verified:results.filter(r=>r.verified).length,pending:results.filter(r=>!r.verified).map(r=>r.name)}));
