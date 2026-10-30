import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {keywordPlan} from '../content/editorial-drafts/trending-pk-20261030/keyword-plan.mjs';
import {keywordPlanTail} from '../content/editorial-drafts/trending-pk-20261030/keyword-plan-tail.mjs';

const root = path.resolve('content/editorial-drafts/trending-pk-20261030');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'progress.json'), 'utf8').replace(/^\uFEFF/, ''));
const commons = (file, creator, license, licenseUrl, alt, width, height) => {
  const hash = crypto.createHash('md5').update(file).digest('hex');
  return {url:`https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0,2)}/${encodeURIComponent(file)}`, source:`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`, creator, license, licenseUrl, alt, width, height, modifications:'None; original network asset'};
};
const images = {
  cricket:commons('Cricketball.png','Stephen Turner, based on Albinomonkey; Commons upload Spundun','Public domain','https://commons.wikimedia.org/wiki/File:Cricketball.png','Cricket ball illustration; not a match photograph',325,325),
  american:commons('American_football.svg','Simanek / Open Clip Art Library','CC0 1.0','https://creativecommons.org/publicdomain/zero/1.0/','American football illustration',512,512),
  badger:commons('Badger-badger.jpg','BadgerHero','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/','Young Eurasian badger photographed in 2003',2560,1920),
  patrick:commons('Patrick_Stewart_by_Gage_Skidmore_2.jpg','Gage Skidmore','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/','Patrick Stewart speaking at San Diego Comic-Con in 2019',1297,1686),
  tennis:commons('Tennis_ball.svg','MesserWoland','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/','Tennis ball illustration; not a match photograph',263,263),
  book:commons('Open_book_nae_02.svg','nae / Open Clip Art Library','CC0 1.0','https://creativecommons.org/publicdomain/zero/1.0/','Open book illustration',400,200),
  film:commons('Film_reel.svg','Bromskloss','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/','Film reel illustration; not a production still',534,519),
  hongkong:commons('Hong-Kong_skyline.JPG','Robster1983','CC0 1.0','https://creativecommons.org/publicdomain/zero/1.0/','Hong Kong skyline photographed in 2009; location illustration, not match coverage',2272,1704),
  football:commons('Football_(soccer_ball).svg','flomar / Open Clip Art Library','CC0 1.0','https://creativecommons.org/publicdomain/zero/1.0/','Association football illustration; not a match photograph',512,544),
  computer:commons('Computer_inside.jpg','Carlosar','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/','Interior of a computer photographed in 2009; illustrative technology image',3264,2448),
  earth:commons('The_Earth_seen_from_Apollo_17_(Original_Orientation).jpg','NASA','Public domain','https://www.nasa.gov/nasa-brand-center/images-and-media/','Earth photographed by Apollo 17 in 1972; historical illustration',3000,3002),
};
for (const entry of manifest) {
  if(entry.position===1) continue;
  const dirname=fs.readdirSync(root).find(name=>name.startsWith(String(entry.position).padStart(3,'0')+'-'));
  if(!dirname) continue;
  const dir=path.join(root,dirname), inputFile=path.join(dir,'input.json');
  if(!fs.existsSync(inputFile)) continue;
  const draft=JSON.parse(fs.readFileSync(inputFile,'utf8').replace(/^\uFEFF/,''));
  draft.body=draft.body.replaceAll('](/learn/)','](/courses/)');
  if(draft.image==='hongkong'&&entry.position!==2) draft.image='cricket';
  if(draft.category==='entertainment'&&draft.image==='computer') draft.image='film';
  if(entry.position===6) draft.image='patrick';
  if(entry.position===34) draft.image='american';
  if(entry.position===47) draft.image='tennis';
  if(entry.position===77) draft.image='badger';
  if([20,38].includes(entry.position)) draft.image='book';
  // Credit the selected asset in one place; remove the superseded closing cover note.
  const sentences=draft.body.split(/(?<=[.!?])\s+(?=[A-Z])/);
  if(/(?:cover|photograph|image|skyline|illustrat)/i.test(sentences.at(-1)||'')) {
    draft.body=draft.body.slice(0,-sentences.at(-1).length).trim();
  }
  let image=images[draft.image];
  if(!image) throw new Error(`Unknown image for ${entry.position}`);
  const assetManifest=path.join(root,'downloaded-images.json');
  const assets=fs.existsSync(assetManifest)?JSON.parse(fs.readFileSync(assetManifest,'utf8')):{};
  if(assets[draft.image]) image={...image,...assets[draft.image]};
  const sourceBlock=draft.sources.map(s=>`- [${s.title}](${s.url})`).join('\n');
  const content=`${draft.body.trim()}\n\n## Sources and image credit\n\n${sourceBlock}\n\nImage: [${image.creator}](${image.source}), [${image.license}](${image.licenseUrl}). ${image.alt}. ${image.modifications}. No endorsement implied.\n`;
  const prose=draft.body.replace(/\[([^\]]+)\]\([^)]*\)/g,'$1');
  const words=prose.match(/\b[\p{L}\p{N}][\p{L}\p{N}'-]*\b/gu)||[];
  const candidates=[...(draft.terms||[]),...(keywordPlan[entry.position]||keywordPlanTail[entry.position]||[])];
  const relatedTermsUsed=[...new Set(candidates.filter(term=>prose.toLowerCase().includes(term.toLowerCase())))];
  if(relatedTermsUsed.length<30||words.length<250)throw new Error(`Incomplete article ${entry.position}: ${words.length} words / ${relatedTermsUsed.length} terms`);
  if(draft.excerpt.length<120||draft.excerpt.length>155)throw new Error(`Meta description length ${entry.position}: ${draft.excerpt.length}`);
  if(/^# /m.test(content)||content.includes('\u2014'))throw new Error(`Invalid heading or punctuation ${entry.position}`);
  const post={id:`trend-draft-20261030-${String(entry.position).padStart(3,'0')}`,title:draft.title,slug:draft.slug,category:draft.category,excerpt:draft.excerpt,content,featuredImage:image.url,author:'RayTech Institute',datePublished:'',readTime:`${Math.max(2,Math.ceil(words.length/220))} min read`,tags:draft.tags,actionButtonText:draft.sources[0].title,actionButtonUrl:draft.sources[0].url};
  fs.writeFileSync(path.join(dir,'article.md'),content);
  fs.writeFileSync(path.join(dir,'post.json'),JSON.stringify(post,null,2)+'\n');
  fs.writeFileSync(path.join(dir,'review.json'),JSON.stringify({state:'completed-draft-not-published',trend:entry.trend,words:words.length,relatedTermsUsed,keywordMethod:'Topic-specific phrases plus terms present in the teaching prose; not measured search volume.',sources:draft.sources,timeSensitiveRecheckRequired:true,image,publicationNotes:draft.notes||['Recheck linked sources and any changing details before approved publication.']},null,2)+'\n');
  entry.state='completed-draft';
}
fs.writeFileSync(path.join(root,'progress.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(root,'network-images.json'),JSON.stringify(images,null,2)+'\n');
console.log(JSON.stringify({completed:manifest.filter(e=>e.state==='completed-draft').length,total:manifest.length}));
