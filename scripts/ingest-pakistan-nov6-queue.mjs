import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const root='content/editorial-drafts/trending-pk-20261106-daily';fs.mkdirSync(root,{recursive:true});
const input=JSON.parse(fs.readFileSync('artifacts/november5-daily/pk-nov6-input.json','utf8').replace(/^\uFEFF/,''));assert.equal(input.length,71);
const catalog=JSON.parse(fs.readFileSync('artifacts/india-november5/published-index-current.json','utf8'));
const covered={
'xiaomi hyperos 4':'hyperos-4-device-rollout-update-check-guide',
'ramayana movie ranbir kapoor':'ramayana-movie-explained-guide',
'mohammad rizwan':'rizwan-peshawar-blues-double-century-faisalabad-2026',
'petrol price in pakistan':'pakistan-petrol-price-notification-reading-guide',
'iqbal day public holiday':'9-november-holiday-2026-pakistan-iqbal-day-guide',
'gold price in pakistan per tola':'pakistan-gold-price-tola-purity-quote-guide',
'asia cup under 19':'acc-u19-asia-cup-2026-pakistan-schedule-oman',
'u19 asia cup 2026':'acc-u19-asia-cup-2026-pakistan-schedule-oman',
'chaudhry salik hussain':'salik-hussain-minister-overseas-pakistanis-guide',
'midterm elections democrats':'us-midterm-elections-2026-voting-results-explained',
'rockstar':'gta-vi-official-release-information-safety-guide'};
const unclear=new Set(['بارش','court order','debt','حکومت','gasoline','pakistan vs india','جعلی','fuel','پنجاب','news','free','ایران','automotive industry','wheat','finance','pakistan','2025','indian','ad','soccer','ecp','rockstar','airplane','paraguay bank','pakistani','next']);
for(const topic of ['rockstar','ecp','2025','automotive industry'])unclear.delete(topic);
const rows=input.map((r,index)=>{const topic=r.Trends,slug=covered[topic];if(slug)assert.ok(catalog.some(p=>p.slug===slug),'Missing canonical '+slug);return{row:index+2,topic,searchVolume:r['Search volume'],started:r.Started,ended:r.Ended||null,breakdown:r['Trend breakdown'],state:slug?'already-covered':unclear.has(topic)?'skipped-unclear':'needs-intent-review',...(slug?{target:slug,reason:'Same-intent published canonical reused; not a new article.'}:unclear.has(topic)?{reason:'No sufficiently identified event, entity or location in the supplied breakdown; standing user instruction is to skip unclear searches.'}:{})};});
const counts={rows:rows.length,covered:rows.filter(r=>r.state==='already-covered').length,unclear:rows.filter(r=>r.state==='skipped-unclear').length,awaitingReview:rows.filter(r=>r.state==='needs-intent-review').length};
fs.writeFileSync(root+'/plan.json',JSON.stringify({date:'2026-11-06',sourceCsv:'trending_PK_1d_20261106-1057.csv',sourceSha256:crypto.createHash('sha256').update(fs.readFileSync('C:/Users/HP/Downloads/trending_PK_1d_20261106-1057.csv')).digest('hex'),publicationAuthorized:true,batchSize:10,minimumBodyWords:2000,priority:'After earlier Pakistan and India queues, as explicitly requested by user on 6 November 2026.',state:'queued-old-work-first',counts,rowDisposition:rows,groups:[],releaseBatches:[]},null,2));
fs.writeFileSync(root+'/STATUS.md',`# Pakistan 6 November queue\n\n${counts.rows} input rows: ${counts.covered} already covered, ${counts.unclear} unclear and skipped under the standing instruction, ${counts.awaitingReview} awaiting source and same-intent review. These are queue decisions, not new publications. Earlier queues retain priority.\n`);console.log(JSON.stringify(counts));
