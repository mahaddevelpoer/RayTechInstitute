import fs from 'node:fs';import assert from 'node:assert/strict';const root='content/editorial-drafts/trending-in-20261105-daily',plan=JSON.parse(fs.readFileSync(root+'/plan.json'));
const rows=[
  [
    "rinky-hijikata",
    "rinky-hijikata-doubles-title-teamwork-guide",
    "Rinky Hijikata - Doubles and Teamwork",
    "Rinky Hijikata: The 2023 Doubles Title, Singles Progress and Teamwork",
    "Explore Rinky Hijikata’s 2023 doubles title and singles progress. Learn court coverage, partnership roles and how to read tennis records.",
    [
      "base",
      0,
      "base",
      2
    ],
    [
      "Rinky Hijikata at the Cary Challenger in August 2023; historical player context rather than the Australian Open final.",
      "Rinky Hijikata in the first round of the 2023 US Open, shown as a separate singles-career reference."
    ],
    "Rinky Hijikata|Jason Kubler|2023 Australian Open doubles|2023 US Open|fourth round|wild card entry|doubles teamwork|court coverage|net player|poaching|serve and return|shared court awareness|partnership roles|singles versus doubles|tie break notation|tennis ranking categories|point log|team points|entry route|Grand Slam doubles|Hugo Nys|Jan Zielinski|historical tennis|tennis arithmetic|student project"
  ],
  [
    "karen-khachanov",
    "karen-khachanov-paris-olympics-tennis-guide",
    "Karen Khachanov - Career and Scoring",
    "Karen Khachanov: Paris 2018, Olympic Silver and Tennis Match Structure",
    "Explore Karen Khachanov’s Paris 2018 title and Tokyo silver. Learn score structure, service pressure and careful comparisons of tennis statistics.",
    [
      "base",
      0,
      "base",
      9
    ],
    [
      "Karen Khachanov during the 2018 US Open; the photograph is not from his Paris final.",
      "Karen Khachanov at practice during the 2024 Washington Open, shown as historical player context."
    ],
    "Karen Khachanov|Paris Masters 2018|Novak Djokovic final|7-5 6-4|Masters 1000|Tokyo Olympic silver|Tokyo 2020 held 2021|event edition|calendar year|tennis scoring|baseline pressure|service pressure|break points|break point saving|empty sample|match structure|sets and games|court recovery|shot depth|direction change|medal versus title|event category|historical record|student score tool|point distribution"
  ],
  [
    "ugo-humbert",
    "ugo-humbert-dubai-paris-left-handed-guide",
    "Ugo Humbert - Career and Court Angles",
    "Ugo Humbert: Dubai and Paris 2024, Left-Handed Angles and Match Context",
    "Explore Ugo Humbert’s Dubai title and Paris final in 2024. Learn left-handed angles, serve patterns and fair comparisons of match conditions.",
    [
      "base",
      0,
      "base",
      9
    ],
    [
      "Ugo Humbert during the Paris Olympics in July 2024; this is not a photograph of the Paris Masters final.",
      "Ugo Humbert after practice at Roland Garros in May 2023, shown as historical career context."
    ],
    "Ugo Humbert|Dubai 2024|Alexander Bublik final|Paris Masters 2024|Alexander Zverev final|Karen Khachanov semifinal|French tennis|left handed tennis|serve angles|return position|cross court|down the line|contact balance|shot depth|first serve percentage|serve points won|court orientation|indoor conditions|outdoor conditions|match context|career milestone|finalist versus champion|tennis diagrams|historical photographs|student analysis"
  ],
  [
    "nuno-borges",
    "nuno-borges-bastad-college-tennis-pathway",
    "Nuno Borges - Bastad and College Path",
    "Nuno Borges: Bastad 2024, College Tennis and a First Tour Title",
    "Explore Nuno Borges’s college pathway and 2024 Bastad title against Nadal. Learn match-score reading, development levels and weighted statistics.",
    [
      "extra",
      0,
      "extra",
      1
    ],
    [
      "Nuno Borges at the 2026 Libema Open in Rosmalen; player identification rather than a photograph of the 2024 Bastad final.",
      "Bastad Tennis Stadium, shown as venue context rather than evidence of a particular final or result."
    ],
    "Nuno Borges|Portuguese tennis|Bastad 2024|Rafael Nadal final|Nordea Open|first tour title|Mississippi State|college tennis|NCAA final 2019|career pathway|tour versus college|ATP 250|score reading|6-3 6-2|surface context|development timeline|weighted percentage|sample size|raw counts|career ranking date|match format|student research|source log|historical results|tennis arithmetic"
  ],
  [
    "learner-tien",
    "learner-tien-australian-open-qualifying-guide",
    "Learner Tien - Qualifying and Progress",
    "Learner Tien: Australian Open 2025, Qualifying and Reading a Breakthrough",
    "Explore Learner Tien’s 2025 Australian Open breakthrough against Medvedev. Learn qualifying, round labels, tie-break notation and draw structure.",
    [
      "base",
      0,
      "base",
      1
    ],
    [
      "Learner Tien practising ahead of the 2024 US Open; the image predates the Australian Open match discussed here.",
      "Learner Tien speaking with fans at the 2025 Washington Open, shown as dated career context."
    ],
    "Learner Tien|Australian Open 2025|Daniil Medvedev match|qualifying route|nineteen in 2025|second round victory|third round advancement|round of sixteen|five set match|late night finish|junior versus senior|qualifier versus seed|main draw|tie break notation|score parser|ranking date|match counts|source scope|career development|empty data|student draw tool|ATP report|ITF notes|historical result|tennis learning"
  ],
  [
    "ngolo-kante",
    "ngolo-kante-career-midfield-cover-guide",
    "N Golo Kante - Career and Midfield Cover",
    "N Golo Kante: League Titles, France 2018 and Midfield Cover Explained",
    "Explore N Golo Kante’s Leicester, Chelsea and France milestones. Learn midfield cover, ball recovery, support angles and football-statistics context.",
    [
      "extra",
      2,
      "extra",
      0
    ],
    [
      "N Golo Kante playing for Chelsea in October 2019; historical club context rather than current registration.",
      "N Golo Kante and Luka Modric at the 2018 World Cup, shown as historical international context."
    ],
    "N Golo Kante|Leicester City|Chelsea|France 2018|2015-16 league title|2016 Chelsea move|2016-17 league title|midfield cover|ball recovery|interception|pressure and cover|passing lane|first pass|defensive transition|support angle|carry decision|running distance|tackle definition|recovery definition|duel rate|sample context|role versus position|season labels|historical football|student possession log"
  ],
  [
    "michael-carrick",
    "michael-carrick-playing-career-midfield-guide",
    "Michael Carrick - Midfield Explained",
    "Michael Carrick: Playing Career, Passing Lanes and Midfield Control",
    "Explore Michael Carrick’s 2006-2018 United playing career. Learn passing lanes, support, tempo and careful comparisons of midfield statistics.",
    [
      "base",
      0,
      "base",
      8
    ],
    [
      "Michael Carrick in a Manchester United preseason match in July 2015; historical playing-career context.",
      "Manchester United against Watford on 13 May 2018, the date of Michael Carrick’s final appearance for the club."
    ],
    "Michael Carrick|Manchester United|Tottenham transfer 2006|464 appearances|May 2018 final match|five league titles|deep midfielder|passing lanes|support position|receiving angle|tempo control|point of attack|backward pass context|interception|defensive cover|passing percentage|progressive pass definition|per 90 rate|minutes versus appearances|playing versus coaching|dated evidence|historical data|missing values|midfield diagram|student event log"
  ],
  [
    "amul-cooperative",
    "amul-cooperative-dairy-history-supply-chain",
    "Amul - Cooperatives and Dairy Supply",
    "Amul Explained: Cooperative History, Producer Ownership and Dairy Supply Chains",
    "Understand Amul’s cooperative history and dairy supply chain. Learn producer ownership, collection records, shared costs and basic business data.",
    [
      "base",
      0,
      "extra",
      10
    ],
    [
      "An Amul GCMMF office building in Kolkata photographed in May 2015, shown as historical organisational context.",
      "Banas Dairy in a 2019 photograph, used as dairy-facility context rather than a current production or capacity claim."
    ],
    "Amul|Anand model|Kaira cooperative|1946 history|milk producers|village dairy society|district milk union|marketing federation|producer ownership|cooperative governance|professional management|dairy supply chain|collection records|traceability|measurement units|fixed costs|variable costs|cost per litre|economies of scale|revenue versus profit|data integrity|batch reference|cold chain concept|product labels|student dashboard"
  ],
  [
    "the-hindu-reading",
    "the-hindu-history-news-reading-student-guide",
    "The Hindu - History and News Reading",
    "The Hindu: Newspaper History and a Practical News-Reading Guide for Students",
    "Learn The Hindu’s early history and a practical way to read news. Check dates, attribution, primary sources, opinion labels and numerical claims.",
    [
      "base",
      0,
      "extra",
      4
    ],
    [
      "The Hindu’s Chennai headquarters in a photograph dated 2011; historical publication context.",
      "A person reading a newspaper in a 2014 photograph; illustrative reading context, not evidence that the paper is The Hindu."
    ],
    "The Hindu|newspaper history|1878 weekly launch|1889 daily publication|news literacy|student reading|news versus opinion|analysis writing|claim attribution|primary sources|publication date|amendment check|percentage points|forecast versus result|image captions|source log|exam notes|vocabulary context|digital access|e paper distinction|privacy notice|search snippets|media comparison|historical newspaper|critical reading"
  ],
  [
    "elder-scrolls-vi",
    "elder-scrolls-vi-official-updates-development",
    "Elder Scrolls VI - Updates Explained",
    "The Elder Scrolls VI: Official Updates, Teasers and Game Development Explained",
    "Understand The Elder Scrolls VI announcement history. Learn to check official updates, distinguish teasers from gameplay and explore development concepts.",
    [
      "extra",
      3,
      "extra",
      8
    ],
    [
      "Todd Howard of Bethesda in a portrait from 2010; historical developer context rather than a new announcement photo.",
      "Bethesda’s E3 booth in 2011; archival industry context, not a screenshot or display of The Elder Scrolls VI."
    ],
    "The Elder Scrolls VI|Bethesda Game Studios|2018 E3 announcement|Todd Howard|official update|teaser versus gameplay|announcement versus release|development stages|prototype|game systems|quest state|save data|state transitions|integration testing|platform evidence|system requirements|store placeholder|fan art distinction|historical event photo|source date|claim log|original game project|software validation|release date verification|programming exercise"
  ]
];
const errors=[];for(const[k,,primary,,description]of rows){const title=primary+' | RayTech Institute';if(title.length<50||title.length>60)errors.push(k+' title '+title.length);if(description.length<120||description.length>155)errors.push(k+' description '+description.length)}assert.equal(errors.length,0,errors.join('; '));
for(const[key,slug,primary,title,description,picks,captions,terms]of rows){const dir=root+'/'+key,article=fs.readFileSync(dir+'/article.md','utf8'),headings=[...article.matchAll(/^#{2,3} (?!Sources)(.+)$/gm)].map(m=>m[1]),tags=[...new Set([...terms.split('|'),...headings])].slice(0,42);assert.equal(tags.length,42,key);assert.equal(new Set(tags.map(t=>t.toLowerCase())).size,42,key);const sources=[...article.split('## Sources')[1].matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m=>m[1]),links=[...article.matchAll(/\]\((\/[^)]+)\)/g)].map(m=>m[1]),group=plan.groups.find(g=>g.key===key);const post={id:'trend-in-20261105-'+key,title,slug,category:group.category,excerpt:description,content:article,featuredImage:'',author:'RayTech Institute',datePublished:'2026-11-06',readTime:Math.ceil(article.split(/\s+/).length/220)+' min read',tags,seo:{enabled:['title','description','socialTitle','socialDescription','imageAlt','imageCaption'],title:primary+' | RayTech Institute',description,socialTitle:title,socialDescription:description,sources:sources.join('\n'),internalLinks:links.join('\n'),authorUrl:'',socialImage:''}};const images=[0,1].map(i=>{const type=picks[i*2],n=picks[i*2+1],options=JSON.parse(fs.readFileSync('artifacts/india-november5/image-api/'+key+(type==='base'?'':'-'+type)+'-options.json'));assert.ok(options[n],key+' image');return{...options[n],role:i?'inline':'cover',caption:captions[i],alt:captions[i],reviewState:'metadata-reviewed-awaiting-visual'}});fs.writeFileSync(dir+'/post.json',JSON.stringify(post,null,2));fs.writeFileSync(dir+'/images-candidates.json',JSON.stringify(images,null,2));Object.assign(group,{slug,state:'draft-written-checks-pending'});console.log(key,article.split('## Sources')[0].trim().split(/\s+/).length)}fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));
