import fs from 'node:fs';
import crypto from 'node:crypto';
const root='content/editorial-drafts/trending-in-20261105-daily';
const previous=fs.existsSync(root+'/plan.json')?JSON.parse(fs.readFileSync(root+'/plan.json','utf8')):null;
const rows=JSON.parse(fs.readFileSync('artifacts/india-november5/input-rows.json','utf8').replace(/^\uFEFF/,''));
const baseline=JSON.parse(fs.readFileSync('artifacts/india-november5/published-index.json','utf8'));
const groups=[
 ['voyager-1','Voyager 1: the November 2026 light-day milestone','science',['voyager 1']],
 ['ktet-hall-ticket','KTET November 2026 hall ticket and exam-day guide','education',['ktet hall ticket download']],
 ['cbse-class10-2027','CBSE Class 10 2027: official date-sheet checks','education',['date sheet of class 10 2027 cbse board']],
 ['ssc-cgl-answer-key','SSC CGL 2026: answer keys and response-sheet reading','education',['ssc cgl answer key 2026']],
 ['uidai-aadhaar','UIDAI Aadhaar: official services and privacy','technology',['uidai aadhaar','आधार']],
 ['csir-net','CSIR-UGC NET: official bulletins and study planning','education',['csir net']],
 ['5g','5G explained: coverage, devices and real performance','technology',['5g']],
 ['bsnl','BSNL services, selfcare and coverage checks','technology',['भारत संचार निगम लिमिटेड']],
 ['delhi-ncr-aqi','Delhi NCR AQI: city, station, scale and timestamp','science',['delhi aqi today','aqi noida','aqi gurgaon']],
 ['sensex','Sensex: index points, percentages and market reading','economy',['sensex']],
];
const known={
 'aek vs real madrid':'aek-real-madrid-2-3-valverde-comeback-2026',
 'west indies vs bangladesh':'bangladesh-west-indies-second-test-sylhet-november-2026',
 'wi vs ban':'bangladesh-west-indies-second-test-sylhet-november-2026',
 'west indies cricket team vs bangladesh national cricket team match scorecard':'bangladesh-west-indies-second-test-sylhet-november-2026',
 'ban बनाम wi':'bangladesh-west-indies-second-test-sylhet-november-2026',
 'fenerbahçe vs liverpool':'fenerbahce-liverpool-3-2-goals-november-2026',
 'rb leipzig vs man city':'leipzig-man-city-2-3-haaland-winner-2026',
 'slavia praha vs arsenal':'slavia-arsenal-1-2-madueke-gyokeres-2026',
 'dortmund vs betis':'dortmund-betis-2-1-silva-karetsas-2026',
 'porto vs napoli':'porto-napoli-4-1-bednarek-veiga-kiwior-samu-2026',
 'united arab emirates national cricket team vs oman national cricket team standings':'oman-uae-cricket-league-two-standings-guide',
 'संयुक्त अरब अमीरात क्रिकेट टीम बनाम ओमान राष्ट्रीय क्रिकेट टीम टीम की रैंक':'oman-uae-cricket-league-two-standings-guide',
 'सौर ऊर्जा':'solar-power-panels-inverters-batteries-pakistan-guide',
 'rockstar games gta vi':'gta-6-release-date-platforms-pakistan-buying-guide',
};
const unclear=new Set(['iii','pictures','rank','suspended','ra','gm','next','all','7','real','district','seven seater','gt 750 price','gasoline','pension','interest rate','theft','child','crackers','economy','temple','thunderstorm','rain delay','war news','नट','நடிகர்','नकली नोट','आलू','பட்டாசு','வீடியோ','वीडियो','వైరల్ వీడియో','வైరల్ వీడియో','वायरल वीडियो','செய்தி','காய்கறி','নৌকা','বেতন','நவம்பர் 5','५ नवम्बर','৫ নভেম্বর','5 november','5 november 2026','నవంబర్ 5','નવેમ્બર ૫','४ नवम्बर','നവംബര് 4','வானிலை','मौसम','बारिश','மழை','ಮಳೆ','பெண்','சம்பளம்','बच्चा','खबर','నటుడు']);
const disposition=rows.map((r,i)=>{const topic=r.Trends,group=groups.find(g=>g[3].includes(topic));if(group)return {row:i+2,topic,state:'queued',group:group[0]};if(known[topic]){const match=baseline.find(p=>p.slug===known[topic]);if(match)return {row:i+2,topic,state:'already-covered',target:match.slug};}if(unclear.has(topic))return {row:i+2,topic,state:'skipped-unclear',reason:'No specific event or service identified; standing instruction to skip unclear queries.'};return {row:i+2,topic,breakdown:r['Trend breakdown'],state:'needs-intent-review'};});
// Keep meaningful general concepts for later editorial review rather than discarding them as vague news.
const reviewConcepts=new Set(['interest rate','pension','economy','temple','thunderstorm','gasoline','नकली नोट','आलू','காய்கறி','crackers','वार्ता']);
for(const row of disposition)if(row.state==='skipped-unclear'&&reviewConcepts.has(row.topic)){row.state='needs-intent-review';delete row.reason;row.breakdown=rows[row.row-2]['Trend breakdown'];}
fs.mkdirSync(root,{recursive:true});
const pkPath='content/editorial-drafts/trending-pk-20261105-daily/plan.json';
const plan={...previous,date:'2026-11-05',region:'IN',sourceCsv:'trending_IN_1d_20261105-1117.csv',sourceSha256:crypto.createHash('sha256').update(fs.readFileSync('C:/Users/HP/Downloads/trending_IN_1d_20261105-1117.csv')).digest('hex'),publicationAuthorized:true,batchSize:10,minimumBodyWords:2000,baselineArticles:baseline.length,hosting:'cloudflare-pages',fullyReviewed:false,pendingPakistan:{remaining:23,state:'deferred-until-india-file-complete',planSha256:crypto.createHash('sha256').update(fs.readFileSync(pkPath)).digest('hex')},groups:groups.map(([key,topic,category,queries])=>({...previous?.groups?.find(g=>g.key===key),key,topic,category,queries,state:previous?.groups?.find(g=>g.key===key)?.state||'research-pending'})),rowDisposition:disposition,releaseBatches:previous?.releaseBatches||[{number:1,keys:groups.map(g=>g[0]),state:'research-pending'}]};
fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));
console.log(JSON.stringify({rows:rows.length,baseline:baseline.length,firstBatch:groups.length,states:disposition.reduce((a,r)=>(a[r.state]=(a[r.state]||0)+1,a),{}),pakistanPendingUnchanged:23}));
