// Stage the existing DNS on an inactive Cloudflare zone. This does not switch
// nameservers or point the public website away from Firebase.
import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const token=process.env.CLOUDFLARE_API_TOKEN;assert.ok(token,'Scoped Cloudflare secret required');
const zone='88e97a0f6ad15e2c6d0d3c035ccd3ee4',account='67c68fe5eb47fcda8d58c8b5e5862f09',domain='raytechinstitute.com';
async function api(route,method='GET',body){const r=await fetch('https://api.cloudflare.com/client/v4'+route,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Cloudflare '+method+' failed with HTTP '+r.status+'; no raw credential diagnostics logged');const d=await r.json();assert.equal(d.success,true,'Cloudflare operation did not succeed');return d.result;}
const review=JSON.parse(await fs.readFile('artifacts/cloudflare-migration/dns-review.json','utf8'));
assert.equal(review.domain,domain);assert.equal(review.readOnly,true);assert.equal(review.lookupFailures.length,0);
assert.ok(Date.now()-Date.parse(review.checkedAt)<2*60*60*1000,'DNS review is stale; repeat the read-only comparison');
const project=await api(`/accounts/${account}/pages/projects/raytechinstitute`);assert.equal(project.subdomain,'raytechinstitute.pages.dev','Token must reach the correct Pages project');
const before=await api(`/zones/${zone}/dns_records?per_page=500`);
const pending=[];
for(const old of review.missingKnownRecords){assert.equal(old.type,'CNAME','Unexpected missing record needs a fresh manual review');assert.ok(['results.'+domain,'send.'+domain].includes(old.name),'Unexpected record name');assert.ok(!before.some(r=>r.name===old.name),'A conflicting DNS record appeared after review');pending.push({action:'create',record:{type:old.type,name:old.name,content:old.content,proxied:false,ttl:300}});}
for(const name of [domain,'www.'+domain]){
 const r=before.find(record=>record.name===name&&['A','CNAME'].includes(record.type));assert.ok(r,'Existing website DNS must remain available');
 assert.equal(r.content,name===domain?'199.36.158.100':'raytechinstitute.web.app','Website must still point to Firebase during nameserver preparation');
 if(r.proxied)pending.push({action:'unproxy',id:r.id,name});
}
console.log('[dns-stage]',{apply:process.argv.includes('--apply'),operations:pending.map(p=>({action:p.action,name:p.name||p.record.name})),firebaseDestinationPreserved:true});
if(!process.argv.includes('--apply'))process.exit(0);
await fs.writeFile('artifacts/cloudflare-migration/dns-before-stage.json',JSON.stringify({checkedAt:new Date().toISOString(),records:before},null,2));
for(const operation of pending){if(operation.action==='create')await api(`/zones/${zone}/dns_records`,'POST',operation.record);else await api(`/zones/${zone}/dns_records/${operation.id}`,'PATCH',{proxied:false});}
const after=await api(`/zones/${zone}/dns_records?per_page=500`);
for(const old of before){const next=after.find(r=>r.id===old.id);assert.ok(next,'Existing DNS records must not be deleted');for(const field of ['name','type','content','priority'])assert.equal(next[field],old[field],'Existing DNS value changed unexpectedly');}
for(const old of review.missingKnownRecords){const next=after.find(r=>r.name===old.name&&r.type===old.type&&r.content===old.content);assert.ok(next,'Missing email alias was not preserved');assert.equal(next.proxied,false);}
const report={checkedAt:new Date().toISOString(),domain,records:after,addedEmailAliases:review.missingKnownRecords.length,existingRecordsPreserved:before.length,firebaseDestinationPreserved:true,nameserversChanged:false};
await fs.writeFile('artifacts/cloudflare-migration/dns-staged.json',JSON.stringify(report,null,2));
console.log('[dns-stage]',{existingRecordsPreserved:before.length,addedEmailAliases:review.missingKnownRecords.length,firebaseDestinationPreserved:true,nameserversChanged:false});
