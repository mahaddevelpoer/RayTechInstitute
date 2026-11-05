import fs from 'node:fs';
import https from 'node:https';
const batch=process.argv.find(a=>a.startsWith('--batch='))?.slice(8)||'20261101';
if(!/^2026110[12345](?:-daily)?$/.test(batch))throw Error('Unsupported November batch');
const region=process.argv.find(a=>a.startsWith('--region='))?.slice(9)||'PK';if(!['PK','IN'].includes(region))throw Error('Unsupported article region');
const root=`content/editorial-drafts/trending-${region.toLowerCase()}-${batch}`,origin='https://raytechinstitute.com';
const useCloudflareResolver=process.argv.includes('--cloudflare-resolver');
let edgeAddress;
if(useCloudflareResolver){
 const answer=await(await fetch('https://cloudflare-dns.com/dns-query?name=raytechinstitute.com&type=A',{headers:{accept:'application/dns-json'},signal:AbortSignal.timeout(15000)})).json();
 edgeAddress=answer.Answer?.find(r=>r.type===1&&/^(?:104\.21\.|172\.67\.)/.test(r.data))?.data;
 if(!edgeAddress)throw Error('No reviewed Cloudflare proxy address returned by the DNS resolver');
}
function edgeRequest(url,options){
 return new Promise((resolve,reject)=>{
  const target=new URL(url);if(target.origin!==origin)return reject(Error('Unexpected verification origin'));
  const req=https.request(target,{method:options.method||'GET',servername:target.hostname,lookup:(_host,opts,cb)=>opts.all?cb(null,[{address:edgeAddress,family:4}]):cb(null,edgeAddress,4)},res=>{
   const chunks=[];res.on('data',chunk=>chunks.push(chunk));res.on('error',reject);res.on('end',()=>resolve(new Response(options.method==='HEAD'?null:Buffer.concat(chunks),{status:res.statusCode,headers:res.headers})));
  });
  req.setTimeout(30000,()=>req.destroy(Error('Cloudflare verification timed out')));req.on('error',reject);req.end();
 });
}
async function request(url, options={}) {
 for(let attempt=0;attempt<2;attempt++){
  try {
   const response=useCloudflareResolver?await edgeRequest(url,options):await fetch(url,{...options,signal:AbortSignal.timeout(30000)});
   if(response.status>=500&&attempt===0){await response.body?.cancel();continue;}
   return response;
  }catch(error){if(attempt===1)throw error;}
 }
}
const sitemap=await(await request(origin+'/sitemap.xml')).text();
const listing=await(await request(origin+'/blogs/')).text();
const target=process.argv.find(value=>value.startsWith('--article='))?.slice(10);
const targetsArg=process.argv.find(value=>value.startsWith('--articles='))?.slice(11);
const targets=targetsArg?new Set(targetsArg.split(',').filter(Boolean)):target?new Set([target]):null;
const ledger=region==='IN'?'artifacts/india-november5/live-verification.json':batch==='20261105-daily'?'artifacts/november5-daily/live-verification.json':batch==='20261104-daily'?'artifacts/november4-daily/live-verification.json':batch==='20261104'?'artifacts/november4/live-verification.json':'artifacts/november-publish/live-verification.json';
const previous=targets&&fs.existsSync(ledger)?JSON.parse(fs.readFileSync(ledger)).results:[];
const results=previous.filter(row=>!targets?.has(row.name));
const unescapeHtml=value=>value.replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
for(const name of fs.readdirSync(root)){
 if(targets&&!targets.has(name))continue;
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
fs.mkdirSync(ledger.slice(0,ledger.lastIndexOf('/')),{recursive:true});fs.writeFileSync(ledger,JSON.stringify({checkedAt:new Date().toISOString(),resolver:useCloudflareResolver?'Cloudflare DNS-over-HTTPS; canonical hostname with verified TLS':'system DNS',edgeAddress,results},null,2));
console.log(JSON.stringify({checked:results.length,verified:results.filter(r=>r.verified).length,pending:results.filter(r=>!r.verified).map(r=>r.name)}));
