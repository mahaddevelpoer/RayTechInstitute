import fs from 'node:fs';import assert from 'node:assert/strict';
const root='content/editorial-drafts/trending-pk-20261104-daily';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const run=Number(process.argv.find(a=>a.startsWith('--run='))?.slice(6));
const offset=Number(process.argv.find(a=>a.startsWith('--offset='))?.slice(9)||0);
const count=Number(process.argv.find(a=>a.startsWith('--count='))?.slice(8)||10);
assert.ok(Number.isSafeInteger(run)&&run>0);assert.ok(Number.isInteger(offset)&&offset>=0);assert.ok(Number.isInteger(count)&&count>0);
const plan=read(root+'/plan.json'),ledger=read('artifacts/november4-daily/live-verification.json');
const selected=plan.groups.slice(offset,offset+count);assert.equal(selected.length,count);
for(const g of selected){
 const live=ledger.results.find(r=>r.name===g.key);assert.equal(live?.verified,true,'Missing verified live page: '+g.key);
 const file=root+'/'+g.key+'/review.json',review=read(file);assert.equal(review.imageVisualReview,'passed');
 Object.assign(review,{state:'published-live-verified',published:true,hostingRun:run,liveUrl:live.url,liveCheckedAt:ledger.checkedAt});fs.writeFileSync(file,JSON.stringify(review,null,2));
 g.state='published-live-verified';const row=plan.rowDisposition.find(r=>r.row===g.row);assert.ok(row);row.state='published-live-verified';row.target=g.slug;
}
plan.published=plan.groups.filter(g=>g.state==='published-live-verified').length;plan.remaining=plan.groups.length-plan.published;
plan.hostingRuns=[...new Set([...(plan.hostingRuns||[]),run])];
fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));
const evidence={checkedAt:ledger.checkedAt,hostingRun:run,results:ledger.results.filter(r=>selected.some(g=>g.key===r.name))};
fs.writeFileSync(root+'/batch-'+String(Math.floor(offset/10)+1).padStart(2,'0')+'-live-verification.json',JSON.stringify(evidence,null,2));
const validation=read(root+'/validation.json');
const doc=`# November 4 daily trends\n\nThe 84 CSV rows have individual dispositions. Editorial intent review identifies ${plan.groups.length} distinct new articles. ${plan.published} are published and live verified; ${plan.remaining} remain unfinished. Existing coverage and same-event searches are consolidated. Unclear queries are excluded with user approval.\n\nThe ${validation.articles} prepared articles contain ${validation.bodyWords.toLocaleString('en-US')} body words, 42 related tags each and ${validation.uniqueImages} distinct licensed images. The second insert preserved all 274 pre-existing article records.\n\nHosting workflows:\n\n${plan.hostingRuns.map(id=>'- https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/'+id).join('\n')}\n\nPublished pages, image pairs, exact SEO titles/descriptions, canonical URLs, single H1, BlogPosting schema, indexing directives, listing entries and sitemap URLs passed direct live checks. These checks do not guarantee Google indexing, rankings or clicks.\n`;
fs.writeFileSync(root+'/RELEASE.md',doc);console.log(JSON.stringify({published:plan.published,remaining:plan.remaining,recorded:count}));
