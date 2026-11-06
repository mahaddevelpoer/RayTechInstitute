import fs from'node:fs';import assert from'node:assert/strict';const root='content/editorial-drafts/trending-in-20261105-daily',plan=JSON.parse(fs.readFileSync(root+'/plan.json'));
const rows=[
  [
    "vande-bharat",
    "vande-bharat-trainsets-speed-journey-guide",
    "Vande Bharat - Train and Journey Guide",
    "Vande Bharat Explained: Trainsets, Speed, Energy and Official Journey Checks",
    "Understand Vande Bharat trainsets, speed, braking and journey information. Learn to check the right train, date, class and official booking record.",
    [
      "base",
      1,
      "base",
      5
    ],
    [
      "A Vande Bharat Express at Jalna, photographed in September 2024; historical service context rather than evidence of a new route announcement.",
      "A Vande Bharat train photographed in March 2024, shown as train-family context rather than proof of current timings or available seats."
    ],
    "Vande Bharat|Vande Bharat Express|Train 18|Indian Railways|trainset|passenger service|chair car|sleeper variant|maximum speed|average speed|acceleration|regenerative braking|energy recovery|power versus energy|kilowatt hour|train number|journey date|boarding station|operating days|midnight duration|IRCTC|fare components|booking confirmation|railway science|official timetable"
  ],
  [
    "cisf-guide",
    "cisf-full-form-public-role-recruitment-guide",
    "CISF - Public Role and Recruitment Guide",
    "CISF Explained: Full Form, Public Responsibilities and Recruitment Notices",
    "Learn CISF's full form, public role and how to read official recruitment notices, eligibility dates, selection stages and application updates.",
    [
      "extra",
      0,
      "extra",
      2
    ],
    [
      "CISF personnel at Jawaharlal Nehru Stadium Metro station, Delhi, photographed in August 2019; historical public-service context, not a current deployment claim.",
      "CISF personnel playing tug of war in January 2019, shown as historical team-activity context rather than a recruitment test or selection standard."
    ],
    "CISF|Central Industrial Security Force|CISF full form|Ministry of Home Affairs|Citizen Charter|industrial security|public responsibilities|airport security|official recruitment|recruitment notification|post title|recruiting authority|eligibility date|application deadline|qualification requirements|physical stage|medical stage|written examination|skill test|qualifying stage|final selection|provisional result|official amendment|application privacy|notice reading"
  ]
];
const errors=[];for(const[k,,primary,,description]of rows){const title=primary+' | RayTech Institute';if(title.length<50||title.length>60)errors.push(k+' title '+title.length);if(description.length<120||description.length>155)errors.push(k+' description '+description.length)}assert.equal(errors.length,0,errors.join('; '));
for(const[key,slug,primary,title,description,picks,captions,terms]of rows){const dir=root+'/'+key,article=fs.readFileSync(dir+'/article.md','utf8'),headings=[...article.matchAll(/^#{2,3} (?!Sources)(.+)$/gm)].map(m=>m[1]),tags=[...new Set([...terms.split('|'),...headings])].slice(0,42);assert.equal(tags.length,42,key);assert.equal(new Set(tags.map(t=>t.toLowerCase())).size,42,key);const sources=[...article.split('## Sources')[1].matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m=>m[1]),links=[...article.matchAll(/\]\((\/[^)]+)\)/g)].map(m=>m[1]),group=plan.groups.find(g=>g.key===key);const post={id:'trend-in-20261105-'+key,title,slug,category:group.category,excerpt:description,content:article,featuredImage:'',author:'RayTech Institute',datePublished:'2026-11-06',readTime:Math.ceil(article.split(/\s+/).length/220)+' min read',tags,seo:{enabled:['title','description','socialTitle','socialDescription','imageAlt','imageCaption'],title:primary+' | RayTech Institute',description,socialTitle:title,socialDescription:description,sources:sources.join('\n'),internalLinks:links.join('\n'),authorUrl:'',socialImage:''}};const images=[0,1].map(i=>{const type=picks[i*2],n=picks[i*2+1],options=JSON.parse(fs.readFileSync('artifacts/india-november5/image-api/'+key+(type==='base'?'':'-'+type)+'-options.json'));assert.ok(options[n],key+' image');return{...options[n],role:i?'inline':'cover',caption:captions[i],alt:captions[i],reviewState:'metadata-reviewed-awaiting-visual'}});fs.writeFileSync(dir+'/post.json',JSON.stringify(post,null,2));fs.writeFileSync(dir+'/images-candidates.json',JSON.stringify(images,null,2));Object.assign(group,{slug,state:'draft-written-checks-pending'});console.log(key,article.split('## Sources')[0].trim().split(/\s+/).length)}fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));
