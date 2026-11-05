import fs from 'node:fs';
const root='content/editorial-drafts/trending-pk-20261105-daily';
const previous=fs.existsSync(root+'/plan.json')?JSON.parse(fs.readFileSync(root+'/plan.json','utf8')):null;
const rows=JSON.parse(fs.readFileSync('artifacts/november5-daily/input-rows.json','utf8').replace(/^\uFEFF/,''));
const baseline=JSON.parse(fs.readFileSync('artifacts/november5-daily/published-index.json','utf8'));
const groups=[
 ['gold-prices','Gold prices in Pakistan: units, purity and dated quotes',['gold prices','سونے کی قیمت']],
 ['ssgc','Sui Southern Gas Company: bills, service and complaints',['sui southern gas company']],
 ['bisp','Benazir Income Support Programme: official routes and safe checks',['بے نظیر انکم سپورٹ پروگرام']],
 ['iqbal-day','9 November 2026 holiday and Iqbal Day planning',['9 november holiday']],
 ['west-indies-bangladesh','West Indies versus Bangladesh: dated Test match',['west indies vs bangladesh']],
 ['aek-real-madrid','AEK Athens versus Real Madrid: November 4 match',['aek vs real madrid']],
 ['leipzig-manchester-city','RB Leipzig versus Manchester City: November 4 match',['rb leipzig vs man city']],
 ['slavia-arsenal','Slavia Prague versus Arsenal: November 4 match',['slavia praha vs arsenal']],
 ['fenerbahce-liverpool','Fenerbahce versus Liverpool: November 4 match',['fenerbahçe vs liverpool f.c. standings']],
 ['lens-como','Lens versus Como: dated match',['lens vs como']],
 ['dortmund-betis','Dortmund versus Real Betis: November 4 match',['dortmund vs betis']],
 ['maliha-ali','Maliha Ali at IMMAF World Championships',['maliha ali immaf world championships','mixed martial arts']],
 ['munna-bhai-3','Munna Bhai 3: verified production announcements',['munna bhai 3']],
 ['rizwan-domestic','Mohammad Rizwan domestic return and Lahore Whites',['mohammad rizwan domestic cricket comeback','quaid e azam trophy lahore whites']],
 ['shaheen-odi-ranking','Shaheen Afridi: current ODI bowling ranking',['shaheen afridi icc odi ranking']],
 ['asim-azhar','Asim Azhar: current confirmed music coverage',['asim azhar']],
 ['one-piece-1198','One Piece chapter 1198: official release and spoiler boundaries',['one piece chapter 1198 spoilers']],
 ['hakeem-jeffries','Hakeem Jeffries: elected office and public record',['hakeem jeffries']],
 ['koffee-season-9','Koffee with Karan season 9: official announcements',['koffee with karan season 9']],
 ['apple-ios','iOS 27.2 and current Apple software releases',['ios update','ios 27.2']],
 ['j-sale','J. sale: official offers and purchase conditions',['j.','j. sale']],
 ['virat-kohli-birthday','Virat Kohli birthday and verified milestones',['وراٹ کوہلی','virat kohli birthday']],
 ['porto-napoli','Porto versus Napoli: November 4 match',['porto vs napoli']],
 ['vivo-v80-fe','vivo V80 FE: announcement and specification checks',['vivo v80 fe']],
 ['philadelphia-76ers','Philadelphia 76ers: dated NBA results and team context',['philadelphia 76ers']],
 ['starc-test-ranking','Mitchell Starc: current Test bowling ranking',['mitchell starc icc test bowling rankings']],
 ['jd-vance','JD Vance: office, responsibilities and public record',['jd vance']],
 ['abdul-el-sayed','Abdul El-Sayed: official election records',['abdul el sayed','el sayed']],
 ['esteban-ocon','Esteban Ocon: verified current Formula 1 coverage',['esteban ocon']],
 ['nabeela-syed','Nabeela Syed: Illinois office and election records',['nabeela syed illinois']],
 ['solar-power','Solar power: Pakistan study and household guide',['solar power']],
 ['salik-hussain','Chaudhry Salik Hussain: official office and public record',['salik hussain']],
 ['gina-hinojosa','Gina Hinojosa: official office and election records',['gina hinojosa']],
 ['amish-shah','Amish Shah: office and official election records',['amish shah']],
 ['champions-league-matchday-four','Champions League matchday four: complete table context',['champions league standings']],
];
const covered={
 'banknote':'cash-pakistan-banknotes', 'bail':'bail-pakistan-meaning', 'faaz missile pakistan':'faaz',
 'samsung galaxy s27 ultra dummy unit':'samsung-galaxy-s27',
 'united arab emirates national cricket team vs oman national cricket team standings':'oman-uae-cricket',
 'gold prices':'gold', 'سونے کی قیمت':'gold', 'u19 asia cup':'acc-u19', 'oil prices':'crude-oil',
 'today petrol price in pakistan':'pakistan-petrol-price', 'gta vi ps5':'gta',
 'james talarico':'james-talarico','karl bushby':'karl-bushby','manuel neuer':'manuel-neuer',
 'us senate elections 2026':'us-midterm','us election result':'us-midterm','american elections':'us-midterm',
 'now':'us-midterm','novak djokovic':'novak-djokovic','auckland weather':'new-zealand-india-first-odi',
 'shabana mahmood':'shabana-mahmood','jesús owono':'jesus-de-miguel',
 'carlos alcaraz':'carlos-alcaraz','alexander zverev':'alexander-zverev',
};
const unclear=new Set(['videos','night sky','weather today','کرنسی','fuel','weather forecast','gasoline','today weather','موسم','ویزا','weather update','indian','fa','psl','ad','face','republican party leader']);
const prior=JSON.parse(fs.readFileSync('content/editorial-drafts/trending-pk-20261104-daily/plan.json','utf8'));
const priorKeys=new Set(prior.groups.filter(g=>g.state!=='published-live-verified').map(g=>g.key));
const sports=new Set(['west-indies-bangladesh','aek-real-madrid','leipzig-manchester-city','slavia-arsenal','fenerbahce-liverpool','lens-como','dortmund-betis','maliha-ali','rizwan-domestic','shaheen-odi-ranking','esteban-ocon','virat-kohli-birthday','porto-napoli','philadelphia-76ers','starc-test-ranking','champions-league-matchday-four']);
const technology=new Set(['apple-ios','vivo-v80-fe','solar-power']);
const entertainment=new Set(['munna-bhai-3','asim-azhar','one-piece-1198','koffee-season-9']);
const politics=new Set(['hakeem-jeffries','jd-vance','abdul-el-sayed','nabeela-syed','salik-hussain','gina-hinojosa','amish-shah']);
const planGroups=groups.map(([key,topic,queries])=>{const old=previous?.groups?.find(g=>g.key===key);return {...old,key,topic,queries,state:old?.state||(priorKeys.has(key)?'pending-existing-research':'research-pending'),category:old?.slug?old.category:sports.has(key)?'sports':technology.has(key)?'technology':entertainment.has(key)?'entertainment':politics.has(key)?'world-affairs':key==='gold-prices'?'economy':key==='iqbal-day'?'education':'general'};});
const disposition=rows.map((r,index)=>{const topic=r.Trends;const group=planGroups.find(g=>g.queries.includes(topic));if(group)return {row:index+2,topic,state:'queued',group:group.key};if(unclear.has(topic))return {row:index+2,topic,state:'skipped-unclear',reason:'No specific event, location or identity; standing instruction to skip unclear queries.'};const search=covered[topic];if(!search)throw Error('Unclassified row '+topic);const matches=baseline.filter(p=>(p.slug+' '+p.title).toLowerCase().includes(search));return {row:index+2,topic,state:matches.length?'already-covered':'coverage-review-required',existing:matches.map(p=>({id:p.id,slug:p.slug})),search};});
fs.mkdirSync(root,{recursive:true});
const plan={...previous,date:'2026-11-05',sourceCsv:'trending_PK_1d_20261105-1014.csv',publicationAuthorized:true,batchSize:10,minimumBodyWords:2000,baselineArticles:baseline.length,hosting:'cloudflare-pages',groups:planGroups,rowDisposition:disposition.map(r=>{const old=previous?.rowDisposition?.find(p=>p.row===r.row&&p.topic===r.topic);return old?.state==='published-live-verified'?old:r;})};
fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));
console.log(JSON.stringify({csvRows:rows.length,groups:groups.length,states:disposition.reduce((a,r)=>(a[r.state]=(a[r.state]||0)+1,a),{}),review:disposition.filter(r=>r.state==='coverage-review-required').map(r=>({topic:r.topic,search:r.search}))}));
