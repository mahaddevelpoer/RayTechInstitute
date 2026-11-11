import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const root='content/editorial-drafts/trending-pk-20261111-daily';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const plan=read(root+'/plan.json');
const evidence=read('artifacts/pakistan-nov11/live-verification.json');
const receipt=read('artifacts/pakistan-nov11/publication-receipt.json');
const workflow=read('artifacts/pakistan-nov11/workflow-result.json');
const batch=plan.releaseBatches.find(b=>b.number===1);
assert.equal(receipt.verified,10);
assert.equal(evidence.expectedRevision,'ac4624eefb60f70fa33e27c1d7be720802eb2942');
assert.equal(workflow.conclusion,'success');
assert.equal(workflow.headSha,evidence.expectedRevision);
for(const old of plan.oldQueueSnapshot){
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(old.path)).digest('hex'),old.sha256,'Older queue changed: '+old.path);
}
for(const key of batch.keys){
 const live=evidence.results.find(r=>r.name===key);
 assert.ok(live?.verified,key+' not verified live');
 const review=read(root+'/'+key+'/review.json');
 Object.assign(review,{state:'published-live-verified',published:true,liveVerifiedAt:evidence.checkedAt,liveUrl:live.url,releaseRevision:evidence.expectedRevision,workflowRun:'43007079491',localChecks:'batch-01-validation.json'});
 fs.writeFileSync(root+'/'+key+'/review.json',JSON.stringify(review,null,2)+'\n');
 const group=plan.groups.find(g=>g.key===key);
 group.state='published-live-verified';
 for(const row of plan.rowDisposition.filter(r=>r.group===key))Object.assign(row,{state:'published-live-verified',slug:group.slug});
}
Object.assign(batch,{state:'published-live-verified',revision:evidence.expectedRevision,workflowRun:'43007079491',liveVerifiedAt:evidence.checkedAt});
plan.state='batch-01-published-next-research-pending';
fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2)+'\n');
fs.writeFileSync(root+'/batch-01-live-verification.json',JSON.stringify(evidence,null,2)+'\n');
fs.writeFileSync(root+'/batch-01-workflow-result.json',JSON.stringify(workflow,null,2)+'\n');
fs.writeFileSync(root+'/STATUS.md',`# Pakistan 11 November editorial queue\n\nOnly this CSV is active; older unfinished queues are left unchanged.\n\n- Input: 70 rows.\n- Ten new articles are published and verified live, covering thirteen input rows.\n- Batch 1: 20,160 body words, 420 relevant tags and 20 distinct licensed images.\n- Live checks passed: HTML, exact image bytes, titles, descriptions, canonical URLs, single H1, BlogPosting schema, listing and sitemap.\n- Release: ac4624eefb60f70fa33e27c1d7be720802eb2942; workflow 43007079491.\n- Twelve input rows already have a relevant published article; no duplicate was created.\n- Twenty generic rows lack sufficient context and remain skipped.\n- Twenty-two research groups remain, subject to source and intent verification. They are not complete or published.\n- See NEXT-RESEARCH.md for the remaining current-CSV source leads.\n`);
console.log('Recorded 10 live-verified articles; older queues unchanged.');
