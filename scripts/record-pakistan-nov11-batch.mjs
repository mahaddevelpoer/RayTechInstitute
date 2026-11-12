// Record evidence only after a successful exact-revision release and live checks.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const arg=name=>process.argv.find(a=>a.startsWith('--'+name+'='))?.slice(name.length+3);
const number=Number(arg('batch-number')),revision=arg('revision'),run=arg('run');
assert.ok(Number.isInteger(number)&&number>0);assert.match(revision||'',/^[a-f0-9]{40}$/);assert.match(run||'',/^\d+$/);
import {editorialRoot as root, editorialArtifacts, editorialBatch} from './editorial-daily-queue.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),plan=read(root+'/plan.json');
const prefix='batch-'+String(number).padStart(2,'0'),workflow=read(editorialArtifacts+'/'+prefix+'-workflow-result.json'),live=read(editorialArtifacts+'/live-verification.json');
const batch=plan.releaseBatches.find(b=>b.number===number);assert.ok(batch?.explicitUserAuthorization);assert.equal(workflow.conclusion,'success');assert.equal(workflow.headSha,revision);assert.ok(workflow.url.endsWith('/'+run));assert.equal(live.expectedRevision,revision);assert.equal(live.deployment.revision,revision);
for(const old of plan.oldQueueSnapshot)assert.equal(createHash('sha256').update(fs.readFileSync(old.path)).digest('hex'),old.sha256,'Old article queue changed');
const results=[];
for(const key of batch.keys){
 const check=live.results.find(r=>r.name===key);assert.equal(check?.verified,true,key+' not verified live');
 const group=plan.groups.find(g=>g.key===key),post=read(root+'/'+key+'/post.json');assert.equal(check.url,'https://raytechinstitute.com/blogs/'+post.slug+'/');assert.equal(group.slug,post.slug);results.push(check);
 group.state='published-live-verified';for(const row of plan.rowDisposition.filter(r=>r.group===key))Object.assign(row,{state:group.state,slug:post.slug});
 const review=read(root+'/'+key+'/review.json');Object.assign(review,{state:group.state,published:true,liveUrl:check.url,liveVerifiedAt:live.checkedAt,releaseRevision:revision,workflowRun:run});fs.writeFileSync(root+'/'+key+'/review.json',JSON.stringify(review,null,2)+'\n');
}
Object.assign(batch,{state:'published-live-verified',revision,workflowRun:run,liveVerifiedAt:live.checkedAt});plan.state=prefix+'-published-next-research-pending';fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2)+'\n');
fs.writeFileSync(root+'/'+prefix+'-live-verification.json',JSON.stringify({...live,results},null,2)+'\n');fs.writeFileSync(root+'/'+prefix+'-workflow-result.json',JSON.stringify(workflow,null,2)+'\n');
const completed=plan.groups.filter(g=>g.state==='published-live-verified'),pending=plan.groups.length-completed.length,states=plan.rowDisposition.reduce((a,r)=>(a[r.state]=(a[r.state]||0)+1,a),{});
const batches=plan.releaseBatches.filter(b=>b.state==='published-live-verified').map(b=>{const v=read(root+'/'+b.validationFile);return `- Batch ${b.number}: ${v.articles} article(s), ${v.bodyWords.toLocaleString('en-US')} body words, ${v.articles*42} tags and ${v.uniqueImages} distinct licensed images.`;});
fs.writeFileSync(root+'/STATUS.md',`# Pakistan ${editorialBatch.slice(6,8)} November editorial queue\n\nThis daily CSV is active; earlier pending queues remain tracked separately and unchanged by this release.\n\n- Input: ${plan.rowDisposition.length} rows.\n- ${completed.length} new articles are published and live verified, covering ${states['published-live-verified']||0} input rows.\n${batches.join('\n')}\n- ${states['already-covered']||0} input rows already have relevant published articles.\n- ${states['unclear-skipped']||0} generic rows are skipped for insufficient context.\n- ${pending} topic groups remain incomplete, subject to further research.\n- Exact-revision live HTML, image bytes, metadata, listing and sitemap checks passed. Latest workflow: ${run}.\n- See batch evidence files and NEXT-RESEARCH.md.\n`);
console.log(JSON.stringify({published:completed.length,remainingGroups:pending,newlyVerified:results.length}));
