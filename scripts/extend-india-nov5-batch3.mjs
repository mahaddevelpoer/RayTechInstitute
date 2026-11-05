import fs from 'node:fs';import assert from 'node:assert/strict';
const root='content/editorial-drafts/trending-in-20261105-daily',plan=JSON.parse(fs.readFileSync(root+'/plan.json','utf8'));
const groups=[
 ['ios-guide','iOS updates, backups and privacy checks','technology',['ios']],
 ['hyperos-4','Xiaomi HyperOS 4: official rollout and device checks','technology',['xiaomi hyperos 4']],
 ['jac-board','Jharkhand Academic Council: notices, results and study records','education',['झारखंड एकेडमिक काउंसिल']],
 ['nasa-guide','NASA: missions, research and official learning resources','science',['nasa','नासा']],
 ['asteroid-guide','Asteroids: orbits, close approaches and evidence','science',['asteroid']],
 ['thunderstorm-guide','Thunderstorms: weather science, nowcasts and lightning safety','science',['thunderstorm']],
 ['indian-railways','Indian Railways: train numbers, PNR and journey information','technology',['ভারতীয় রেল']],
 ['dow-jones','Dow Jones: index weighting, quotes and comparisons','economy',['dow jones','dow jones moneycontrol']],
 ['bonus-shares','Bonus shares: ratios, dates and ownership calculations','economy',['बोनस शेयर']],
 ['fixed-deposits','Fixed deposits: interest, maturity and deposit insurance','economy',['सावधि जमा']],
];
for(const [key,topic,category,queries]of groups){assert.ok(!plan.groups.some(g=>g.key===key));for(const q of queries){const row=plan.rowDisposition.find(r=>r.topic===q);assert.equal(row?.state,'needs-intent-review');Object.assign(row,{state:'research-pending',group:key});}plan.groups.push({key,topic,category,queries,state:'research-pending'});fs.mkdirSync(root+'/'+key,{recursive:true});}
plan.releaseBatches.push({number:3,keys:groups.map(g=>g[0]),expectedSize:10,explicitUserAuthorization:true,authorization:'User instructed continuation on 5 November 2026; standing approval to publish completed reviewed articles.',state:'research-pending'});
plan.remainingSelected=10;plan.intentReview={sameIntentCovered:plan.rowDisposition.filter(r=>r.state==='already-covered').length,unclear:plan.rowDisposition.filter(r=>r.state==='skipped-unclear').length,unreviewed:plan.rowDisposition.filter(r=>r.state==='needs-intent-review').length};fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));console.log(JSON.stringify({next:groups.map(g=>g.key),unreviewed:plan.intentReview.unreviewed}));
