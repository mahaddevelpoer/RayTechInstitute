import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='content/editorial-drafts/trending-pk-20261104';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const plan=read(root+'/plan.json');
const metadata={
'henry-nicholls':{
 title:'Henry Nicholls: Left-Handed Batting and Innings Guide',slug:'henry-nicholls-left-handed-batting-innings-guide',search:'Henry Nicholls - Batting Explained',
 description:'Understand Henry Nicholls, his left-handed batting role, partnership building and scorecard context, with practical examples for cricket learners.',
 tags:'Henry Nicholls|Henry Nicholls profile|New Zealand cricket|Canterbury cricket|left handed batter|middle order batting|Black Caps|batting role|innings analysis|cricket scorecard|partnership building|strike rotation|batting average|batting strike rate|not out innings|Test batting|ODI batting|T20 batting|off stump judgment|new ball cricket|seam bowling|swing bowling|shot selection|defensive batting|scoring singles|cricket boundaries|batting tempo|required run rate|chasing targets|wickets remaining|batting practice|cricket learning|match context|player selection|playing eleven|Devon Conway|Tim Seifert|Henry Nicholls batting hand|How to read a scorecard|How partnerships work|Cricket statistics explained|New Zealand batting guide|left handed cricket technique'},
'kl-rahul':{
 title:'KL Rahul: Batting Roles, Wicketkeeping and Scorecards',slug:'kl-rahul-batting-roles-wicketkeeping-guide',search:'KL Rahul - Roles and Batting Guide',
 description:'Learn how KL Rahul’s opening, middle-order and wicketkeeping roles differ, with worked scorecard examples and clear ODI, Test and T20 context.',
 tags:'KL Rahul|Lokesh Rahul|KL Rahul profile|India cricket|Karnataka cricket|wicketkeeper batter|right handed batting|opening batter|middle order role|Test cricket|ODI cricket|T20 internationals|new ball batting|run chase|partnership building|strike rotation|batting average|batting strike rate|not out scores|balls faced|required rate|target calculation|wicketkeeping workload|playing eleven|team selection|India New Zealand|BCCI profile|batting position|scoring singles|boundary options|batting technique|shot selection|leave outside off stump|cricket practice|scorecard reading|innings context|batting versatility|keeper catches|stumpings|How to judge an innings|Does Rahul always keep wicket|KL Rahul batting hand|Cricket learning guide'},
'kyle-jamieson':{
 title:'Kyle Jamieson: Bounce, Seam and Bowling Figures Explained',slug:'kyle-jamieson-bounce-seam-bowling-guide',search:'Kyle Jamieson - Bounce and Bowling',
 description:'Explore Kyle Jamieson’s bowling role, release height, bounce and seam, then learn to read overs, economy rates and wickets with practical examples.',
 tags:'Kyle Jamieson|Kyle Jamieson profile|New Zealand bowler|right arm fast medium|high release point|bowling bounce|seam movement|swing bowling|bowling angle|good length bowling|pace bowling|bowling control|off stump line|bowling figures|bowling economy|legal deliveries|overs notation|wickets|maidens|run out dismissal|new ball spell|Test bowling|ODI spells|T20 bowling|death overs|bowling partnership|batter setup|pitch map|cricket replay|bowling analysis|cricket learning|fast bowling workload|fitness reports|playing eleven|selection updates|New Zealand cricket|Basin Reserve|batting response|How bounce works|Swing versus seam|How to calculate economy|Reading a spell|bowling accuracy'},
'jacob-duffy':{
 title:'Jacob Duffy: Otago Pathway and Seam Bowling Explained',slug:'jacob-duffy-otago-seam-bowling-profile',search:'Jacob Duffy - Seam Bowling Profile',
 description:'Meet Jacob Duffy and explore his Otago pathway, seam-bowling role and match figures, with worked examples of economy, average and strike rate.',
 tags:'Jacob Duffy|Jacob Andrew Duffy|Jacob Duffy profile|Otago cricket|Southland cricket|Lumsden|New Zealand cricket|right arm fast medium|seam bowling|new ball spell|bowling control|bowling accuracy|line and length|domestic cricket|international cricket|first class wickets|List A cricket|domestic T20|Test cricket|ODI cricket|T20 internationals|bowling average|bowling strike rate|economy rate|legal balls|overs notation|wicketless spell|bowling figures|extras|wides|no balls|death bowling|field placement|ICC rankings|playing eleven|team selection|cricket learning|Kent cricket|bowling practice|How to read bowling figures|Why domestic experience matters|How overs work|spell analysis'},
'michigan-senate-election-results':{
 title:'Michigan Senate Election Results: Official Reports and Counting Guide',slug:'michigan-senate-results-official-reporting-guide',search:'Michigan Senate Results - Official Guide',
 description:'Find official Michigan Senate election-result routes and learn how to read unofficial counts, county reports, margins, timestamps and certification.',
 tags:'Michigan Senate election results|Michigan election results 2026|Michigan Senate results|US Senate Michigan|Michigan State Senate|November 3 election|Michigan Department of State|official election results|unofficial returns|certified results|county results|statewide results|election canvass|election certification|vote totals|vote margin|percentage point margin|precinct reporting|reporting units|election timestamps|election night count|Kalamazoo County|Michigan voting dashboard|voter participation|ballots versus votes|general election|primary election|Senate contest|election projections|election forecasts|election literacy|results verification|Pakistan readers|United States elections|midterm results|How to read election results|Where to find Michigan results|Why totals change|Who won Michigan Senate|county versus statewide|unofficial versus certified|election reporting guide|election source checking'},
'democrats-vs-republicans':{
 title:'Democrats vs Republicans: Parties, Policies and Government Explained',slug:'democrats-republicans-parties-government-guide',search:'Democrats vs Republicans - A Guide',
 description:'Compare Democrats and Republicans through party platforms, government roles, elections and voting rules, with a neutral guide for students.',
 tags:'Democrats vs Republicans|Democratic Party|Republican Party|Donald Trump party|United States politics|US political parties|party platforms|2024 Democratic platform|2024 Republican platform|red states|blue states|election maps|Congress|House of Representatives|United States Senate|presidency|executive branch|legislative branch|judicial branch|midterm elections|primary elections|general elections|independent voters|third parties|party registration|policy comparison|campaign promises|legislation|government authority|polls|forecasts|projections|certified results|electoral literacy|civics education|Pakistan students|party labels|voting records|political evidence|Is Trump Republican|What do midterms change|How parties differ|How to compare policies'},
'donald-trump':{
 title:'Donald Trump: Biography, Presidential Timeline and Powers',slug:'donald-trump-biography-presidency-powers-guide',search:'Donald Trump - Presidency Explained',
 description:'Read Donald Trump’s background and presidential timeline, then learn how executive orders, laws, election results and official records differ.',
 tags:'Donald Trump|Donald John Trump|Donald Trump biography|47th president|45th president|current US president|Republican president|presidential timeline|January 20 2025|2016 election|2020 election|2024 election|Queens New York|Wharton School|presidential library|National Archives|White House|executive orders|presidential powers|executive branch|Congress|legislative process|Federal Register|government documents|policy announcements|implemented policy|Electoral College|popular vote|electoral votes|midterm elections|presidential inauguration|nonconsecutive terms|political literacy|official biography|document verification|speech versus law|presidential term|campaign versus government|Is Trump Republican|Why 45th and 47th|How executive orders work|Who is Donald Trump|civics learning'}
};
const pick=(file,index)=>read('artifacts/november4/'+file)[index];
for(const g of plan.groups){
 const dir=root+'/'+g.key,m=metadata[g.key];
 let images=read(dir+'/images-candidates.json');
 if(g.key==='henry-nicholls')images[0]={...pick('-Henry-Nicholls-.json',0),role:'cover'};
 if(g.key==='kl-rahul')images[0]={...pick('-KL-Rahul-.json',1),role:'cover'};
 if(g.key==='kyle-jamieson')images[1]={...pick('-Basin-Reserve-.json',2),role:'inline'};
 if(g.key==='michigan-senate-election-results')images=[{...pick('-Michigan-State-Capitol-.json',0),role:'cover'},{...pick('-Michigan-State-Capitol-.json',1),role:'inline'}];
 if(g.key==='donald-trump')images[1]={...pick('-White-House--South-Lawn.json',1),role:'inline'};
 if(g.key==='democrats-vs-republicans')images[1]={...pick('capitol-options.json',0),role:'inline'};
 const captions={
 'henry-nicholls':['A scoreboard marking Henry Nicholls’ double century in March 2023; historical image, not today’s innings.','Hagley Oval in an aerial photograph from 2007, providing Canterbury cricket context.'],
 'kl-rahul':['KL Rahul during an interview at the 2022 T20 World Cup; historical photograph.','Chinnaswamy Stadium in Bengaluru, shown as cricket-ground context rather than a current match image.'],
 'kyle-jamieson':['Kyle Jamieson at the 2015 Lincoln University Blues Awards; historical portrait.','Grandstands at the Basin Reserve, illustrating the setting of New Zealand cricket.'],
 'jacob-duffy':['Jacob Duffy in a historical player photograph.','New Zealand and Pakistan at University Oval in Dunedin; historical venue image, not a live match report.'],
 'michigan-senate-election-results':['Michigan State Capitol in Lansing, photographed in 2024. The building is not a live results display.','The Michigan State Capitol rotunda in 2025, illustrating the state-government setting.'],
 'democrats-vs-republicans':['The historic Senate chamber in Congress Hall, Philadelphia; this is not the current United States Senate chamber.','The United States Capitol at dusk, illustrating the federal legislature rather than a political-party campaign event.'],
 'donald-trump':['Donald Trump’s official presidential portrait from January 2025.','The White House’s south facade viewed from the Washington Monument; architectural context, not a current event.']
 };
 images=images.map((i,n)=>({...i,alt:captions[g.key][n],caption:captions[g.key][n],reviewState:'metadata-reviewed'}));
 assert.equal(images.length,2);fs.writeFileSync(dir+'/images-candidates.json',JSON.stringify(images,null,2));
 const article=fs.readFileSync(dir+'/article.md','utf8'),words=article.split('## Sources')[0].trim().split(/\s+/).length;
 const tags=[...new Set(m.tags.split('|'))].slice(0,42);assert.equal(tags.length,42);
 const seoTitle=m.search+' | RayTech Institute';assert.ok(seoTitle.length>=50&&seoTitle.length<=60,g.key+' title '+seoTitle.length);assert.ok(m.description.length>=120&&m.description.length<=155,g.key+' description '+m.description.length);
 const sources=[...article.split('## Sources')[1].matchAll(/\]\((https:[^)]+)\)/g)].map(x=>x[1]);
 const internal=[...article.matchAll(/\]\((\/[^)]+)\)/g)].map(x=>x[1]);
 const post={id:'trend-20261104-'+g.key,title:m.title,slug:m.slug,category:g.category,excerpt:m.description,content:article,featuredImage:'',author:'RayTech Institute',datePublished:'',readTime:Math.ceil(words/220)+' min read',tags,seo:{enabled:['title','description','socialTitle','socialDescription','imageAlt','imageCaption'],title:seoTitle,description:m.description,socialTitle:m.title,socialDescription:m.description,sources:sources.join('\n'),internalLinks:internal.join('\n'),authorUrl:'',socialImage:''}};
 fs.writeFileSync(dir+'/post.json',JSON.stringify(post,null,2));g.slug=m.slug;g.state='draft-written';
 console.log(JSON.stringify({article:g.key,words,tags:tags.length}));
}
fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));
