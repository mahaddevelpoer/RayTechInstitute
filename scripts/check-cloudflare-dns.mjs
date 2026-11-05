// Read-only DNS comparison. Never changes records, nameservers or billing.
import fs from 'node:fs/promises';import {Resolver} from 'node:dns/promises';
import {hasPrivateCredential} from './private-credential-patterns.mjs';
const token=process.env.CLOUDFLARE_API_TOKEN;if(!token)throw Error('Scoped Cloudflare deployment secret is required for the read-only DNS check');
const zone='88e97a0f6ad15e2c6d0d3c035ccd3ee4',domain='raytechinstitute.com';
const response=await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}/dns_records?per_page=500`,{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(30000)});
if(!response.ok)throw Error('Cloudflare DNS read permission is unavailable (HTTP '+response.status+'). No DNS was changed.');
const data=await response.json();if(!data.success||!Array.isArray(data.result))throw Error('Cloudflare DNS response was invalid');
const records=data.result.map(({id,type,name,content,priority,proxied,ttl})=>({id,type,name,content,priority,proxied,ttl}));
if(hasPrivateCredential(JSON.stringify(records)))throw Error('A DNS value resembles a private credential; comparison stopped without logging it');
const resolver=new Resolver({timeout:3000,tries:1});
const queries=[[domain,'A'],[domain,'AAAA'],[domain,'TXT'],[domain,'MX'],['www.'+domain,'CNAME'],['results.'+domain,'CNAME'],['send.'+domain,'MX'],['send.'+domain,'TXT'],['resend._domainkey.'+domain,'TXT'],['send.results.'+domain,'MX'],['send.results.'+domain,'TXT'],['resend._domainkey.results.'+domain,'TXT'],['_dmarc.results.'+domain,'TXT'],['_dmarc.'+domain,'TXT'],['_acme-challenge.'+domain,'TXT'],['competition.'+domain,'CNAME']];
const live=[];const failures=[];
await Promise.all(queries.map(async([name,type])=>{try{for(const value of await resolver.resolve(name,type)){live.push({name,type,content:type==='TXT'?value.join(''):type==='MX'?value.exchange:String(value),...(type==='MX'?{priority:value.priority}:{})});}}catch(error){if(!['ENODATA','ENOTFOUND'].includes(error.code))failures.push({name,type,code:error.code||'DNS_ERROR'});}}));
const normal=(type,value)=>type==='TXT'?value.replace(/^"|"$/g,'').replace(/"\s+"/g,''):value.replace(/\.$/,'').toLowerCase();
const missing=live.filter(old=>!records.some(next=>next.type===old.type&&next.name.toLowerCase()===old.name.toLowerCase()&&normal(old.type,next.content)===normal(old.type,old.content)&&(old.type!=='MX'||next.priority===old.priority)));
await fs.mkdir('artifacts/cloudflare-migration',{recursive:true});
await fs.writeFile('artifacts/cloudflare-migration/dns-review.json',JSON.stringify({checkedAt:new Date().toISOString(),domain,readOnly:true,records,knownLiveRecords:live,missingKnownRecords:missing,lookupFailures:failures,limitations:'Known service names only; unknown DKIM selectors and unlisted subdomains require the source DNS inventory.'},null,2));
console.log('[dns-review]',{imported:records.length,knownLiveRecords:live.length,missingKnownRecords:missing.map(({type,name})=>({type,name})),lookupFailures:failures.length,changed:0});
