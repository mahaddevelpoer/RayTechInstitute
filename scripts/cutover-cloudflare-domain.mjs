import fs from 'node:fs/promises';import assert from 'node:assert/strict';import dns from 'node:dns/promises';import tls from 'node:tls';import https from 'node:https';
const account='67c68fe5eb47fcda8d58c8b5e5862f09',zone='88e97a0f6ad15e2c6d0d3c035ccd3ee4',domain='raytechinstitute.com',project='raytechinstitute',target=project+'.pages.dev';
const token=process.env.CLOUDFLARE_API_TOKEN;assert.ok(token);
async function api(route,method='GET',body){const r=await fetch('https://api.cloudflare.com/client/v4'+route,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(30000)});assert.ok(r.ok,'Cloudflare API '+method+' failed: HTTP '+r.status);const d=await r.json();assert.equal(d.success,true);return d.result;}
const registry=await(await fetch('https://rdap.verisign.com/com/v1/domain/'+domain,{signal:AbortSignal.timeout(20000)})).json();
assert.deepEqual(registry.nameservers.map(n=>n.ldhName.toLowerCase().replace(/\.$/,'')).sort(),['monika.ns.cloudflare.com','nicolas.ns.cloudflare.com'],'Registry delegation must be correct before domain cutover');
const {address}=await dns.lookup(target,{family:4});
for(const host of [domain,'www.'+domain])await new Promise((resolve,reject)=>{const socket=tls.connect({host:address,port:443,servername:host,rejectUnauthorized:true},()=>{assert.ok(socket.authorized);socket.destroy();resolve();});socket.setTimeout(15000,()=>socket.destroy(new Error('Cloudflare certificate is not ready; website DNS remains unchanged')));socket.on('error',reject);});
const before=await api(`/zones/${zone}/dns_records?per_page=500`);
await fs.mkdir('artifacts/cloudflare-migration',{recursive:true});await fs.writeFile('artifacts/cloudflare-migration/dns-before-cutover.json',JSON.stringify({records:before},null,2));
const projectPath=`/accounts/${account}/pages/projects/${project}`;
const domains=await api(projectPath+'/domains');
for(const host of [domain,'www.'+domain])if(!domains.some(d=>d.name===host))await api(projectPath+'/domains','POST',{name:host});
const current=await api(`/zones/${zone}/dns_records?per_page=500`);
for(const name of [domain,'www.'+domain]){
 const records=current.filter(r=>r.name===name&&['A','AAAA','CNAME'].includes(r.type));assert.equal(records.length,1,'Unexpected website records need review before changing DNS');
 const r=records[0];assert.ok([target,'199.36.158.100','raytechinstitute.web.app'].includes(r.content),'Unexpected origin; cutover stopped');
 if(r.type!=='CNAME'||r.content!==target||!r.proxied)await api(`/zones/${zone}/dns_records/${r.id}`,'PUT',{type:'CNAME',name,content:target,proxied:true,ttl:1});
}
const after=await api(`/zones/${zone}/dns_records?per_page=500`);
for(const old of before){if([domain,'www.'+domain].includes(old.name)&&['A','AAAA','CNAME'].includes(old.type))continue;const next=after.find(r=>r.id===old.id);assert.ok(next,'Non-website DNS record was removed');for(const field of ['name','type','content','priority','proxied'])assert.equal(next[field],old[field],'Non-website DNS changed unexpectedly');}
function edgeRequest(host,path='/'){return new Promise((resolve,reject)=>{const req=https.request({hostname:address,servername:host,port:443,path,headers:{Host:host},rejectUnauthorized:true},response=>{let text='';response.setEncoding('utf8');response.on('data',chunk=>{text+=chunk;if(text.length>4000000)req.destroy(new Error('Unexpected oversized verification response'));});response.on('end',()=>resolve({status:response.statusCode,headers:response.headers,text}));});req.setTimeout(20000,()=>req.destroy(new Error('Edge verification timed out')));req.on('error',reject);req.end();});}
let root,ready=false;
for(let attempt=0;attempt<18&&!ready;attempt++){root=await edgeRequest(domain);ready=root.status===200&&root.headers['x-raytech-hosting']==='cloudflare-pages';if(!ready)await new Promise(resolve=>setTimeout(resolve,5000));}
assert.ok(ready,'Pages custom domain has not activated yet; Firebase fallback has not been disabled');
assert.ok(!/noindex/i.test(root.headers['x-robots-tag']||''),'Production homepage must be indexable');assert.ok(root.text.includes('rel="canonical" href="https://'+domain+'/"'));
const www=await edgeRequest('www.'+domain,'/classes/');assert.equal(www.status,301);assert.equal(www.headers.location,'https://'+domain+'/classes/');
const missing=await edgeRequest(domain,'/this-page-must-not-exist-cloudflare-migration/');assert.equal(missing.status,404);
const manifest=JSON.parse((await edgeRequest(domain,'/deployment.json')).text);assert.equal(manifest.siteOrigin,'https://'+domain);
await fs.writeFile('artifacts/cloudflare-migration/domain-cutover.json',JSON.stringify({checkedAt:new Date().toISOString(),domain,certificateVerified:true,cloudflareEdgeVerified:true,revision:manifest.revision,indexablePages:manifest.indexablePages,wwwRedirect:true,real404:true,nonWebsiteDnsPreserved:true,firebaseHostingDisabled:false,remaining:'Recursive DNS caches may continue to serve Firebase until their old TTL expires; signed-in account flows still require verification.'},null,2));
console.log('[domain-cutover]',{domain,certificateVerified:true,pagesVerified:true,wwwRedirect:true,indexablePages:manifest.indexablePages,nonWebsiteDnsPreserved:true,firebaseHostingDisabled:false});
