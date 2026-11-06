import fs from 'node:fs';import assert from 'node:assert/strict';const root='content/editorial-drafts/trending-in-20261105-daily',plan=JSON.parse(fs.readFileSync(root+'/plan.json'));
const rows=[
  [
    "alex-de-minaur",
    "alex-de-minaur-career-movement-return-guide",
    "Alex de Minaur - Career and Movement",
    "Alex de Minaur: Career Milestones, Movement and Return Decisions",
    "Explore Alex de Minaur’s career, Acapulco titles and court coverage. Learn return depth, recovery positioning and how to read tennis statistics.",
    [
      "base",
      6,
      "base",
      3
    ],
    [
      "Alex de Minaur at the Laureus World Sports Awards in April 2024; historical player context.",
      "Alex de Minaur at the 2015 US Junior Open, shown as an early career image rather than a recent senior result."
    ],
    "Alex de Minaur|Australian tennis|Acapulco 2023|Acapulco 2024|2020 US Open|Grand Slam quarterfinal|court coverage|split step|recovery position|return depth|return position|baseline movement|tennis geometry|defence to attack|rally analysis|receiving points|break points|ATP 500|career timeline|ranking date|match context|tennis statistics|first serve return|second serve return|student worksheet"
  ],
  [
    "daniil-medvedev",
    "daniil-medvedev-us-open-ranking-baseline-guide",
    "Daniil Medvedev - Career and Tactics",
    "Daniil Medvedev: The 2021 US Open, No. 1 Milestone and Baseline Geometry",
    "Understand Daniil Medvedev’s 2021 US Open title and 2022 No. 1 milestone, with lessons on return position, rally geometry and tennis statistics.",
    [
      "base",
      0,
      "base",
      10
    ],
    [
      "Daniil Medvedev practising at the 2023 US Open; the image does not depict the 2021 final.",
      "Daniil Medvedev photographed in September 2013, shown as an earlier career reference."
    ],
    "Daniil Medvedev|2021 US Open|Novak Djokovic final|2022 world number one|28 February 2022|calendar year Grand Slam|ATP ranking|ranking points|match points|deep return position|baseline geometry|cross court rally|shot depth|direction change|rally tolerance|serve statistics|first serve percentage|first serve points won|aces|rally length|forced errors|head to head|surface context|historical final|tennis analysis"
  ],
  [
    "frances-tiafoe",
    "frances-tiafoe-career-attacking-tennis-guide",
    "Frances Tiafoe - Career and Attack",
    "Frances Tiafoe: Delray Beach, US Open Progress and Attacking Tennis",
    "Explore Frances Tiafoe’s Delray Beach title and US Open progress. Learn attacking choices, serve patterns and clear tennis conversion calculations.",
    [
      "extra",
      0,
      "base",
      0
    ],
    [
      "Frances Tiafoe at Queen’s Club in June 2018, shown as historical career context.",
      "Frances Tiafoe’s quarter-final against Grigor Dimitrov at the 2024 US Open; dated match context rather than the 2022 semifinal."
    ],
    "Frances Tiafoe|American tennis|Delray Beach 2018|2022 US Open semifinal|2024 US Open semifinal|Rafael Nadal match|attacking tennis|first strike|contact position|forward movement|serve plus one|serve placement|shot control|winners|unforced errors|break point conversion|sample size|tennis scoring|match momentum|point log|crowd atmosphere|career development|tournament run|return quality|student analysis"
  ],
  [
    "matteo-berrettini",
    "matteo-berrettini-wimbledon-serve-patterns",
    "Matteo Berrettini - Wimbledon Guide",
    "Matteo Berrettini: Wimbledon 2021 and the Serve-Plus-One Pattern",
    "Learn why Matteo Berrettini’s 2021 Wimbledon final mattered. Explore serve placement, grass-court patterns, slice and tie-break score reading.",
    [
      "base",
      0,
      "base",
      5
    ],
    [
      "Matteo Berrettini at the Miami Open in March 2025; a historical image rather than the 2021 Wimbledon final.",
      "Matteo Berrettini during the 2022 Tennis Napoli Cup final, shown as dated career context."
    ],
    "Matteo Berrettini|Wimbledon 2021|Italian tennis|Wimbledon finalist|Novak Djokovic final|serve plus one|serve placement|return quality|second serve|forehand pattern|grass court|low contact|backhand slice|shot variation|tie break score|service games|hold percentage|ace count|career milestone|major final|court recovery|serve speed|tennis tactics|sample size|historical match"
  ],
  [
    "taylor-fritz",
    "taylor-fritz-career-first-strike-tennis-guide",
    "Taylor Fritz - Career and First Strike",
    "Taylor Fritz: Indian Wells, the 2024 US Open Final and First-Strike Tennis",
    "Explore Taylor Fritz’s Indian Wells title and 2024 US Open final. Learn first-strike tennis, return statistics and weighted percentage calculations.",
    [
      "base",
      0,
      "base",
      8
    ],
    [
      "Taylor Fritz at the Miami Open in March 2025; historical player context rather than a new result.",
      "Taylor Fritz after practice at the 2023 US Open; the photograph predates his 2024 final."
    ],
    "Taylor Fritz|Indian Wells 2022|Rafael Nadal final|2024 US Open final|Jannik Sinner final|American tennis|Masters 1000|first strike tennis|return depth|serve patterns|forehand position|early contact|weighted average|return points won|first serve return|second serve return|raw counts|court position|ranking versus result|head to head context|major finalist|shot margin|tennis arithmetic|student calculator|historical records"
  ],
  [
    "maria-sakkari",
    "maria-sakkari-career-consistency-return-guide",
    "Maria Sakkari - Career and Consistency",
    "Maria Sakkari: Major Semifinals, Guadalajara and Competitive Consistency",
    "Explore Maria Sakkari’s 2021 major semifinals and 2023 Guadalajara title. Learn consistency, return pressure and careful tennis-statistics analysis.",
    [
      "extra",
      0,
      "extra",
      1
    ],
    [
      "Maria Sakkari photographed in February 2019; historical player context.",
      "Maria Sakkari photographed in June 2022, shown as a separate historical career image rather than her 2023 title ceremony."
    ],
    "Maria Sakkari|Greek tennis|Rabat 2019|Guadalajara 2023|Caroline Dolehide final|Roland Garros 2021|US Open 2021|Iga Swiatek quarterfinal|major semifinal|WTA title|competitive consistency|return pressure|break point opportunities|receiving points|tennis percentages|raw counts|sample size|ranking versus seed|missing data|match observation|rally pattern|career milestones|historical photographs|performance context|student worksheet"
  ],
  [
    "bruno-fernandes",
    "bruno-fernandes-career-creative-midfield-guide",
    "Bruno Fernandes - Creative Midfield",
    "Bruno Fernandes: United Timeline, Creative Midfield and Passing Risk",
    "Explore Bruno Fernandes’s United transfer and captaincy timeline. Learn creative passing, chance creation, off-ball support and football data.",
    [
      "extra",
      11,
      "extra",
      0
    ],
    [
      "Bruno Fernandes at the 2018 World Cup, shown as historical Portugal context.",
      "Bruno Fernandes during Croatia against Portugal on 2 July 2026; dated international football context, not a club-transfer announcement."
    ],
    "Bruno Fernandes|Manchester United|Sporting Clube de Portugal|January 2020 transfer|2023 captaincy|Portugal football|attacking midfielder|creative passing|passing risk|chance creation|assists|key passes|expected assists|passing completion|per 90 minutes|off ball movement|between the lines|receiving orientation|support angles|defensive cover|possession outcome|football statistics|career timeline|captain role|match analysis"
  ],
  [
    "romelu-lukaku",
    "romelu-lukaku-career-centre-forward-guide",
    "Romelu Lukaku - Centre Forward Guide",
    "Romelu Lukaku: Career Records, Centre-Forward Movement and Finishing",
    "Understand Romelu Lukaku’s dated transfer records and centre-forward role. Learn hold-up play, attacking runs, finishing rates and shot context.",
    [
      "base",
      4,
      "base",
      5
    ],
    [
      "Romelu Lukaku playing for Everton against Dynamo Kyiv in March 2015; historical club context rather than current registration.",
      "Romelu Lukaku during Belgium against Russia in June 2021, shown as historical international context."
    ],
    "Romelu Lukaku|Belgium striker|centre forward|2018 Bronze Boot|2024 Napoli transfer|Chelsea departure|Inter loan|Roma loan|dated transfer record|hold up play|striker movement|pinning defenders|lay off pass|support runs|runs behind defence|offside context|finishing rate|shot conversion|expected goals|chance quality|club versus country|career photographs|possession log|attacking support|football learning"
  ],
  [
    "eder-militao",
    "eder-militao-career-centre-back-analysis",
    "Eder Militao - Centre Back Explained",
    "Eder Militao: Career Timeline, Defensive Positioning and Centre-Back Analysis",
    "Explore Eder Militao’s Porto-to-Madrid milestone and defensive role. Learn line spacing, recovery, aerial duels and context for football statistics.",
    [
      "extra",
      1,
      "base",
      0
    ],
    [
      "Eder Militao in an archival interview image, used for player identification rather than a current fitness or squad update.",
      "A scene from the 2019 Copa America awards ceremony, shown as historical Brazil-team context rather than evidence of a current squad selection."
    ],
    "Eder Militao|Brazil defender|Sao Paulo|FC Porto|Real Madrid transfer|14 March 2019|centre back|defensive positioning|line spacing|ball pressure|high defensive line|recovery defending|offside context|aerial duel|second ball|clearance direction|defensive passing|passing lanes|clean sheet context|tackle totals|duel percentage|opportunity count|availability evidence|career timeline|defensive analysis"
  ],
  [
    "brahim-diaz",
    "brahim-diaz-career-receiving-between-lines",
    "Brahim Diaz - Career and Receiving",
    "Brahim Diaz: City, Madrid, Milan and Receiving Between the Lines",
    "Follow Brahim Diaz’s City, Madrid and Milan timeline. Learn receiving between lines, first touch, short combinations and per-90 calculations.",
    [
      "base",
      0,
      "extra",
      12
    ],
    [
      "Brahim Diaz against Niger in Rabat in September 2025; dated international player context.",
      "Brahim Diaz during Morocco against Norway in June 2026; dated international context rather than a new club announcement."
    ],
    "Brahim Diaz|Manchester City|Real Madrid|AC Milan loan|January 2019 transfer|2023 Madrid return|player development|between the lines|receiving space|passing lane|body orientation|scanning|first touch|turning under pressure|lay off pass|give and go|third player combination|dribble versus carry|per 90 rate|minutes versus appearances|missing values|short combinations|career timeline|historical football|student event log"
  ]
];
const errors=[];for(const[k,,primary,,description]of rows){const title=primary+' | RayTech Institute';if(title.length<50||title.length>60)errors.push(k+' title '+title.length);if(description.length<120||description.length>155)errors.push(k+' description '+description.length)}assert.equal(errors.length,0,errors.join('; '));
for(const[key,slug,primary,title,description,picks,captions,terms]of rows){const dir=root+'/'+key,article=fs.readFileSync(dir+'/article.md','utf8'),headings=[...article.matchAll(/^#{2,3} (?!Sources)(.+)$/gm)].map(m=>m[1]),tags=[...new Set([...terms.split('|'),...headings])].slice(0,42);assert.equal(tags.length,42,key);assert.equal(new Set(tags.map(t=>t.toLowerCase())).size,42,key);const sources=[...article.split('## Sources')[1].matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m=>m[1]),links=[...article.matchAll(/\]\((\/[^)]+)\)/g)].map(m=>m[1]),group=plan.groups.find(g=>g.key===key);const post={id:'trend-in-20261105-'+key,title,slug,category:group.category,excerpt:description,content:article,featuredImage:'',author:'RayTech Institute',datePublished:'2026-11-06',readTime:Math.ceil(article.split(/\s+/).length/220)+' min read',tags,seo:{enabled:['title','description','socialTitle','socialDescription','imageAlt','imageCaption'],title:primary+' | RayTech Institute',description,socialTitle:title,socialDescription:description,sources:sources.join('\n'),internalLinks:links.join('\n'),authorUrl:'',socialImage:''}};const images=[0,1].map(i=>{const type=picks[i*2],n=picks[i*2+1],options=JSON.parse(fs.readFileSync('artifacts/india-november5/image-api/'+key+(type==='base'?'':'-'+type)+'-options.json'));assert.ok(options[n],key+' image');return{...options[n],role:i?'inline':'cover',caption:captions[i],alt:captions[i],reviewState:'metadata-reviewed-awaiting-visual'}});fs.writeFileSync(dir+'/post.json',JSON.stringify(post,null,2));fs.writeFileSync(dir+'/images-candidates.json',JSON.stringify(images,null,2));Object.assign(group,{slug,state:'draft-written-checks-pending'});console.log(key,article.split('## Sources')[0].trim().split(/\s+/).length)}fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));
