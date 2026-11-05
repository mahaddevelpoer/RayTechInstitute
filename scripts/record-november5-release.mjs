import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='content/editorial-drafts/trending-pk-20261105-daily';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const run=Number(process.argv.find(a=>a.startsWith('--run='))?.slice(6));
const number=Number(process.argv.find(a=>a.startsWith('--batch-number='))?.slice(15)||1);
assert.ok(Number.isSafeInteger(run)&&run>0);
const plan=read(root+'/plan.json'),batch=plan.releaseBatches.find(b=>b.number===number);
assert.ok(batch&&batch.keys.length===10,'A completed ten-article batch is required');
const ledger=read('artifacts/november5-daily/live-verification.json');
const evidence=[];
for(const key of batch.keys){
 const live=ledger.results.find(r=>r.name===key);assert.equal(live?.verified,true,'Missing live checks for '+key);
 const g=plan.groups.find(g=>g.key===key),file=root+'/'+key+'/review.json',review=read(file);
 assert.equal(review.imageVisualReview,'passed');
 Object.assign(review,{state:'published-live-verified',published:true,hostingRun:run,liveUrl:live.url,liveCheckedAt:ledger.checkedAt});
 fs.writeFileSync(file,JSON.stringify(review,null,2));g.state='published-live-verified';
 for(const row of plan.rowDisposition.filter(r=>r.group===key))Object.assign(row,{state:'published-live-verified',target:g.slug});
 evidence.push(live);
}
Object.assign(batch,{state:'published-live-verified',hostingRun:run,checkedAt:ledger.checkedAt});
plan.published=plan.groups.filter(g=>g.state==='published-live-verified').length;
plan.remaining=plan.groups.length-plan.published;
fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));
fs.writeFileSync(root+'/batch-'+String(number).padStart(2,'0')+'-live-verification.json',JSON.stringify({checkedAt:ledger.checkedAt,hostingRun:run,resolver:ledger.resolver,edgeAddress:ledger.edgeAddress,localDnsPropagation:'System DNS still returned Firebase 199.36.158.100. Cloudflare DoH returned the new proxy addresses; verification retained the canonical hostname and certificate validation.',results:evidence},null,2));
const validation=read(root+'/validation.json');
fs.writeFileSync(root+'/RELEASE.md',`# November 5 daily articles\n\n${plan.published} of ${plan.groups.length} distinct editorial topics are published and live verified. ${plan.remaining} remain unfinished. The CSV contains 81 rows: same-intent searches are consolidated, 22 previously covered rows are not duplicated, and 17 unclear rows are skipped.\n\nBatch ${number}: ten English articles, ${validation.results.filter(r=>batch.keys.includes(r.key)).reduce((n,r)=>n+r.words,0)} body words, 42 relevant tags each and twenty globally distinct licensed WebP images. Image captions identify historical or illustrative material. The insert preserved all 284 pre-existing article records; ten new records were read back field by field.\n\nCloudflare Pages release: https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/${run}\n\nAll ten live pages, exact SEO titles and descriptions, canonical URLs, single H1, BlogPosting schema, indexing directives, image pairs, listing entries and sitemap URLs passed direct checks. These checks do not guarantee search indexing, rankings or clicks. Firebase Hosting was not redeployed.\n`);
console.log(JSON.stringify({batch:number,published:plan.published,remaining:plan.remaining}));
fs.appendFileSync(root+'/RELEASE.md','\nDNS qualification: local system DNS still returned the old Firebase IP during verification. All ten canonical-domain checks passed through the Cloudflare address returned by DNS-over-HTTPS, with normal hostname/certificate validation. Visitors using cached old DNS may still see old Firebase content until propagation completes. No Firebase redeploy or hosting deletion was performed.\n');
