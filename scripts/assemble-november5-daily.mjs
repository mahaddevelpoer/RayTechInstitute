import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='content/editorial-drafts/trending-pk-20261105-daily';
const entries=[
 {key:'ssgc',slug:'ssgc-bill-payment-complaint-service-guide',category:'general',
 title:'SSGC Bill Guide: Duplicate Bills, Payment Records and Complaints',
 seoTitle:'SSGC Bills - Payment and Help Guide | RayTech Institute',
 description:'Find official SSGC bill and support routes, compare billing entries, keep payment receipts and prepare a clear complaint without exposing account details.',
 tags:['SSGC','Sui Southern Gas Company','SSGC bill','SSGC duplicate bill','SSGC online bill','SSGC View Bill','viewbill.ssgc.com.pk','gas bill Pakistan','gas customer number','gas account reference','duplicate gas bill PDF','gas billing period','gas bill due date','gas payment receipt','unpaid gas balance','gas bill adjustment','domestic gas category','gas tariff effective date','gas consumption units','gas meter reading','SSGC domestic rates','SSGC bill calculator','SSGC payment options','online gas bill payment','bank ATM gas payment','pending bill payment','payment transaction reference','SSGC complaints','SSGC customer facilitation','SSGC official website','billing discrepancy','gas bill comparison','gas customer privacy','utility payment scams','official support channels','gas service enquiry','household bill records','utility bill download','SSGC account safety','gas bill troubleshooting','gas emergency guidance','bill versus receipt'],
 images:[['File:Sui Southern Gas Company Headquarters.jpg','SSGC headquarters, shown as company context rather than a current service announcement.'],['File:Gas-Meter-1785.jpg','An illustrative gas-meter readout; this is not a photograph of the reader’s SSGC account or installation.']]},
 {key:'iqbal-day',slug:'9-november-holiday-2026-pakistan-iqbal-day-guide',category:'education',
 title:'9 November Holiday 2026: Iqbal Day, School Checks and Study Ideas',
 seoTitle:'9 November 2026 - Iqbal Day Guide | RayTech Institute',
 description:'Check the Monday 9 November 2026 Iqbal Day date, school and exam arrangements, reliable notices and practical ideas for speeches and student activities.',
 tags:['9 November holiday','Iqbal Day 2026','9 November 2026','Pakistan public holiday','Allama Iqbal Day','Monday holiday Pakistan','November 2026 calendar','Iqbal Day school notice','Iqbal Day college notice','Iqbal Day university notice','Cabinet Division holidays','public and optional holidays','2026 holiday notification','holiday notice year','three day weekend','Saturday attendance','exam timetable checks','examination amendments','assignment deadlines','school assembly ideas','Iqbal Day speech','Allama Muhammad Iqbal','Iqbal birth anniversary','Iqbal 1877 Sialkot','149th birth anniversary','Iqbal Manzil','Iqbal tomb Lahore','Iqbal poetry study','verified Iqbal quotations','poetry interpretation','reading a translation','student study planning','November study break','institutional holiday instructions','official holiday sources','Pakistan mission calendar','Iqbal Day activities','short speech preparation','text evidence','literature discussion','revision checklist','school reopening checks'],
 images:[['File:Iqbal Manzil 1.jpg','Iqbal Manzil in Sialkot, the birthplace associated with Muhammad Iqbal.'],['File:Tomb of Allama Iqbal next to Badshahi Mosque main entrance.jpg','Allama Iqbal’s tomb beside the Badshahi Mosque entrance in Lahore; historical place context.']]},
 {key:'bisp',slug:'bisp-8171-survey-payment-official-help-guide',category:'general',
 title:'BISP 8171 Guide: Official Information, Free Survey and Payment Help',
 seoTitle:'BISP 8171 - Survey and Payment Help | RayTech Institute',
 description:'Use official BISP channels, understand free surveys versus eligibility and payment messages, protect CNIC details and report unexplained deductions.',
 tags:['BISP','Benazir Income Support Programme','بے نظیر انکم سپورٹ پروگرام','8171','official BISP messages','BISP official website','bisp.gov.pk','BISP survey','free BISP survey','BISP registration information','dynamic registry','NSER','BISP tehsil office','mobile registration vans','BISP eligibility information','BISP payment instructions','BISP payment location','BISP complaint','0800-26477','payment deductions','beneficiary privacy','CNIC safety','fake BISP messages','BISP registration scams','Benazir Kafaalat','Benazir Taleemi Wazaif','Benazir Nashonuma','school support information','household survey status','payment receipt records','government benefit information','BISP office enquiry','official beneficiary services','survey versus payment','payment round dates','BISP instalment checks','family assistance checklist','identity document privacy','BISP website unavailable','payment complaint reference','social protection Pakistan','beneficiary record keeping'],
 images:[['File:Government Boys’ Higher Secondary School Rera (5508274265).jpg','An archival classroom photograph at Government Boys’ Higher Secondary School Rera, used for education context. It does not identify BISP beneficiaries or a BISP event.'],['File:USAID-funded Faculty of Education building (22149594942).jpg','An archival education-building photograph from a separate USAID-supported project, used for general education context rather than as a BISP facility.']]},
];
const plan=JSON.parse(fs.readFileSync(root+'/plan.json','utf8'));
for(const item of entries){
 const dir=root+'/'+item.key;const body=fs.readFileSync(dir+'/article.md','utf8');
 assert.equal(item.tags.length,42,item.key);assert.equal(new Set(item.tags.map(t=>t.toLowerCase())).size,42);
 assert.ok(item.seoTitle.length>=50&&item.seoTitle.length<=60,item.key+' title');assert.ok(item.description.length>=120&&item.description.length<=155,item.key+' description');
 const sources=[...body.split('## Sources')[1].matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(m=>m[1]);
 const links=[...body.matchAll(/\]\((\/[^)]+)\)/g)].map(m=>m[1]);
 const post={id:'trend-20261105-'+item.key,title:item.title,slug:item.slug,category:item.category,excerpt:item.description,content:body,featuredImage:'',author:'RayTech Institute',datePublished:'2026-11-05',readTime:Math.ceil(body.split(/\s+/).length/220)+' min read',tags:item.tags,seo:{enabled:['title','description','socialTitle','socialDescription','imageAlt','imageCaption'],title:item.seoTitle,description:item.description,socialTitle:item.title,socialDescription:item.description,sources:sources.join('\n'),internalLinks:links.join('\n'),authorUrl:'',socialImage:''}};
 const options=JSON.parse(fs.readFileSync('artifacts/november5-daily/image-api/'+item.key+'-options.json','utf8'));
 const candidates=item.images.map(([name,caption],i)=>{const found=options.find(o=>o.fileTitle===name);assert.ok(found,'Missing image '+name);return {...found,role:i?'inline':'cover',caption,alt:caption,reviewState:'metadata-reviewed-awaiting-visual'};});
 fs.writeFileSync(dir+'/post.json',JSON.stringify(post,null,2));fs.writeFileSync(dir+'/images-candidates.json',JSON.stringify(candidates,null,2));
 const group=plan.groups.find(g=>g.key===item.key);Object.assign(group,{slug:item.slug,category:item.category,state:'draft-written-checks-pending'});
 console.log(JSON.stringify({key:item.key,bodyWords:body.split('## Sources')[0].trim().split(/\s+/).length,tags:post.tags.length,titleCharacters:item.seoTitle.length,descriptionCharacters:item.description.length}));
}
fs.writeFileSync(root+'/plan.json',JSON.stringify(plan,null,2));
