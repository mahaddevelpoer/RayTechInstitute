import fs from 'node:fs';import assert from 'node:assert/strict';const root='content/editorial-drafts/trending-pk-20261107-daily',plan=JSON.parse(fs.readFileSync(root+'/plan.json'));
const rows=[
  [
    "harmeet-dhillon",
    "harmeet-dhillon-resignation-public-records-guide",
    "Harmeet Dhillon - Reports and Records",
    "Harmeet Dhillon Resignation Reports: Appointment Dates and Public Records",
    "Read Harmeet Dhillon’s reported resignation alongside dated DOJ appointment records. Learn office titles, timelines and careful source checking.",
    [
      "base",
      0,
      "base",
      2
    ],
    [
      "Harmeet Dhillon’s official portrait from 2025; historical office context rather than a new appointment claim.",
      "Harmeet Dhillon being sworn in on 7 April 2025; this archival image does not depict the reported 2026 resignation."
    ],
    "Harmeet Dhillon|November 2026 resignation reports|Civil Rights Division|Department of Justice|April 2025 confirmation|April 2025 swearing in|Assistant Attorney General|public office timeline|historical biography|current status checking|reported versus documented|agency versus court|appointment record|source attribution|publication date|event date|acting leadership|legal process literacy|civic education|primary documents|archival photograph|confirmation versus oath|news verification|record correction|student source log"
  ],
  [
    "sediqullah-atal",
    "sediqullah-atal-century-batting-records-guide",
    "Sediqullah Atal - Batting Explained",
    "Sediqullah Atal: Afghanistan Milestones and Understanding a Batting Innings",
    "Explore Sediqullah Atal’s dated Harare century and Afghanistan career context. Learn strike rate, partnerships, boundaries and batting averages.",
    [
      "base",
      0,
      "extra",
      1
    ],
    [
      "Harare Sports Club in a 2017 photograph; venue context for the historical innings, not a portrait of Atal or a new match image.",
      "Cricket equipment at Walker Cricket Ground in London in 2019; illustrative batting context, not Atal’s personal kit."
    ],
    "Sediqullah Atal|Afghanistan batter|Harare 2024|Zimbabwe ODI|maiden ODI century|104 from 128|batting strike rate|81.25 strike rate|partnership interval|runs versus balls|boundary contribution|fours and sixes|batting average|not out innings|team extras|format context|ODI versus T20|scorecard reading|232 run margin|innings date|career milestone|fictional cricket examples|batting calculator|player identity|historical cricket"
  ],
  [
    "chris-lynn",
    "chris-lynn-t20-career-power-hitting-guide",
    "Chris Lynn - T20 Batting and Records",
    "Chris Lynn: Big Bash Career, Power Hitting and T20 Score Reading",
    "Explore Chris Lynn’s Brisbane and Adelaide career stages. Learn power-hitting context, strike rate, boundary runs and required-rate calculations.",
    [
      "extra",
      1,
      "extra",
      0
    ],
    [
      "Chris Lynn pictured during cricket against New Zealand in February 2018; historical player context.",
      "Chris Lynn with Grant Wechsel, Andrew Gray, Darren Lockyer and Darren Lehmann in a 2026 photograph; a group image, not a match lineup."
    ],
    "Chris Lynn|Big Bash League|Brisbane Heat|Adelaide Strikers|2022 signing|dated contract update|T20 batting|power hitting|strike rate|boundary share|required rate|legal balls|partial overs|match context|field placement|contact quality|dot balls|finishing innings|opening role|franchise versus international|T10 versus T20|career photographs|batting data|student calculator|historical records"
  ],
  [
    "jisoo",
    "jisoo-solo-releases-music-credits-guide",
    "Jisoo - Solo Music and Release Guide",
    "Jisoo: BLACKPINK, Solo Releases and Understanding Music Credits",
    "Follow Jisoo’s group and solo release timeline, including later official news. Learn phrasing, arrangement, video analysis and music-credit reading.",
    [
      "base",
      0,
      "base",
      9
    ],
    [
      "Jisoo photographed in March 2022; historical artist identification rather than a new performance image.",
      "Jisoo at an airport departure in February 2024, shown as a separate dated career photograph."
    ],
    "Jisoo|BLACKPINK|BLISSOO|2016 group debut|ME 2023|Flower|AMORTAGE 2025|ADDICTED October 2026|solo versus group|release timeline|single album|EP format|music credits|vocal phrasing|tone versus volume|arrangement|production roles|video framing|editing rhythm|live versus recorded|chart categories|streaming definitions|historical photographs|original listening exercise|student catalogue"
  ],
  [
    "dean-norris",
    "dean-norris-screen-roles-acting-guide",
    "Dean Norris - Roles and Screen Acting",
    "Dean Norris: Screen Roles, Character Identity and How to Study Acting",
    "Explore Dean Norris’s screen roles and career context. Learn acting observation, voice, timing, framing and the difference between actor and character.",
    [
      "base",
      2,
      "base",
      0
    ],
    [
      "Dean Norris with Alexander Koch at a 2014 Under the Dome panel; historical cast-event context.",
      "Dean Norris at a Breaking Bad screening event in March 2010; the actor is shown outside the fictional story."
    ],
    "Dean Norris|Hank Schrader|Breaking Bad|Big Jim Rennie|Under the Dome|AMC biography|screen acting|actor versus character|Harvard background|RADA background|vocal timing|scene objective|listening and reaction|silence in acting|physical behaviour|props|camera distance|reaction shot|editing collaboration|ensemble nomination|historical cast record|original scene exercise|performance notes|fiction versus biography|student analysis"
  ],
  [
    "hasan-mahmud",
    "hasan-mahmud-five-wickets-bowling-figures",
    "Hasan Mahmud - Bowling Figures Guide",
    "Hasan Mahmud: Chennai Five-Wicket Milestone and Bowling Figures Explained",
    "Explore Hasan Mahmud’s dated Chennai five-wicket milestone. Learn overs notation, economy, bowling average, strike rate and scorecard scope.",
    [
      "base",
      0,
      "base",
      1
    ],
    [
      "Bangladesh’s cricket team with Muhammad Yunus in September 2024; team context rather than an individually identified Hasan Mahmud portrait.",
      "MA Chidambaram Stadium in Chennai in a 2011 photograph; historical venue context, not the September 2024 Test."
    ],
    "Hasan Mahmud|Bangladesh fast bowler|Chennai September 2024|5 for 83|Test five wicket haul|Sri Lanka Test debut 2024|innings versus match|bowling figures|legal balls|overs notation|economy rate|bowling average|bowling strike rate|wicketless sample|runs conceded|team extras|dismissal credit|line and length|dot ball context|format comparison|career data date|scorecard parser|partial over|student calculator|player identity"
  ],
  [
    "olivia-rodrigo",
    "olivia-rodrigo-sour-guts-songwriting-guide",
    "Olivia Rodrigo - Music and Songwriting",
    "Olivia Rodrigo: SOUR, GUTS and a Student Guide to Songwriting Choices",
    "Explore Olivia Rodrigo’s SOUR, GUTS and Grammy timeline. Learn song structure, phrasing, arrangement and accurate release-credit research.",
    [
      "base",
      3,
      "base",
      7
    ],
    [
      "Olivia Rodrigo at the White House in July 2021; historical artist context rather than a new music-release photograph.",
      "Olivia Rodrigo performing at Lollapalooza Argentina in 2025; a dated performance image rather than an album cover."
    ],
    "Olivia Rodrigo|SOUR 2021|GUTS 2023|8 September 2023|2022 Grammy|Best New Artist|release versus ceremony|songwriting|song structure|verse and chorus|hook|melody and rhythm|vocal phrasing|arrangement|production credits|texture|contrast|recording edition|narrator versus artist|streaming categories|chart period|original writing exercise|revision log|music catalogue|student listening"
  ],
  [
    "young-sohn",
    "young-sohn-technology-leadership-systems-guide",
    "Young Sohn - Technology and Systems",
    "Young Sohn: Technology Leadership, Connected Systems and Role Timelines",
    "Explore Young Sohn’s technology leadership history. Learn hardware-software interfaces, strategy, integration, prototypes and reliable role records.",
    [
      "base",
      0,
      "base",
      1
    ],
    [
      "Young Sohn at TechCrunch Disrupt Berlin in December 2019; the title belongs to that historical event context.",
      "Young Sohn at Web Summit in Lisbon in November 2018, shown as a separate historical speaking appearance."
    ],
    "Young Sohn|Samsung strategy history|HARMAN board biography|Inphi leadership|NETGEAR advisory biography|technology strategy|former versus current title|board versus executive|hardware software interface|connected systems|sensor units|timestamps|integration|prototype versus deployment|acceptance criteria|failure handling|baseline metrics|pilot sample|governance|responsibility table|credential boundaries|fictional dashboard|data validation|source log|student technology project"
  ],
  [
    "yangwang-u9-xtreme",
    "yangwang-u9-xtreme-503-17-speed-record-guide",
    "Yangwang U9 Xtreme - Record Explained",
    "YANGWANG U9 Xtreme: The 503.17 km/h Report and Record Categories Explained",
    "Read BYD’s November 2026 U9 Xtreme speed update. Understand single-direction records, speed units, power, energy and fair performance comparisons.",
    [
      "base",
      5,
      "base",
      0
    ],
    [
      "A YANGWANG U9 at the 2025 Japan Mobility Show; historical model-family context rather than the Abu Dhabi record attempt.",
      "A YANGWANG U9 photographed in 2026; related model-family context, not proof that this is the record-run U9 Xtreme."
    ],
    "YANGWANG U9 Xtreme|BYD speed announcement|503.17 kmh|November 2026 update|1 November run|496.22 kmh history|single direction record|Marc Basseng|Abu Dhabi|speed versus acceleration|maximum versus average|kmh to metres per second|lap time versus top speed|power versus energy|kW versus kWh|aerodynamic model|record category|test conditions|manufacturer attribution|model variant|historical display photograph|local price distinction|student calculator|unit conversion|engineering literacy"
  ],
  [
    "immaf-guide",
    "immaf-amateur-mma-history-results-guide",
    "IMMAF - Amateur MMA and Results Guide",
    "IMMAF Explained: Amateur MMA History, Event Categories and Reading Results",
    "Understand IMMAF’s amateur MMA role and history. Learn federation structures, brackets, medal categories and careful reading of official results.",
    [
      "base",
      0,
      "base",
      1
    ],
    [
      "Amateur youth MMA competition in Iran in May 2025; illustrative sport context, not a claim that this event was an IMMAF championship.",
      "Another scene from the same 2025 amateur youth competition; historical sport context rather than a current federation result."
    ],
    "IMMAF|International Mixed Martial Arts Federation|amateur MMA|2012 founding|2014 world championships|2018 WMMAA merger|national federation|event affiliation|amateur versus professional|bracket reading|entry versus advancement|bye versus bout win|age category|weight category|official result|medal table|current rules|historical handbook|anti doping context|International Testing Agency|athlete privacy|result verification|student catalogue|event date|governance literacy"
  ]
];
const errors=[];for(const[k,,primary,,description]of rows){const title=primary+' | RayTech Institute';if(title.length<50||title.length>60)errors.push(k+' title '+title.length);if(description.length<120||description.length>155)errors.push(k+' description '+description.length)}assert.equal(errors.length,0,errors.join('; '));
for(const[key,slug,primary,title,description,picks,captions,terms]of rows){const dir=root+'/'+key,article=fs.readFileSync(dir+'/article.md','utf8'),headings=[...article.matchAll(/^#{2,3} (?!Sources)(.+)$/gm)].map(m=>m[1]),tags=[...new Set([...terms.split('|'),...headings])].slice(0,42);assert.equal(tags.length,42,key);assert.equal(new Set(tags.map(t=>t.toLowerCase())).size,42,key);const sources=[...article.split('## Sources')[1].matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m=>m[1]),links=[...article.matchAll(/\]\((\/[^)]+)\)/g)].map(m=>m[1]),group=plan.groups.find(g=>g.key===key);const post={id:'trend-pk-20261107-'+key,title,slug,category:group.category,excerpt:description,content:article,featuredImage:'',author:'RayTech Institute',datePublished:'2026-11-07',readTime:Math.ceil(article.split(/\s+/).length/220)+' min read',tags,seo:{enabled:['title','description','socialTitle','socialDescription','imageAlt','imageCaption'],title:primary+' | RayTech Institute',description,socialTitle:title,socialDescription:description,sources:sources.join('\n'),internalLinks:links.join('\n'),authorUrl:'',socialImage:''}};const images=[0,1].map(i=>{const type=picks[i*2],n=picks[i*2+1],options=JSON.parse(fs.readFileSync('artifacts/november7-pk/image-api/'+key+(type==='base'?'':'-'+type)+'-options.json'));assert.ok(options[n],key+' image');return{...options[n],role:i?'inline':'cover',caption:captions[i],alt:captions[i],reviewState:'metadata-reviewed-awaiting-visual'}});fs.writeFileSync(dir+'/post.json',JSON.stringify(post,null,2));fs.writeFileSync(dir+'/images-candidates.json',JSON.stringify(images,null,2));Object.assign(group,{slug,state:'draft-written-checks-pending'});console.log(key,article.split('## Sources')[0].trim().split(/\s+/).length)}fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));
