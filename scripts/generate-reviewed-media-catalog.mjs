import fs from 'node:fs';
const root='content/editorial-revisions/trending-pk-20261030';
const images=JSON.parse(fs.readFileSync(`${root}/images.json`,'utf8'));
const covers={},keywords={};
for(const row of images){if(!row.cover)continue;const {alt,caption,width,height}=row.cover;covers[row.cover.publicUrl]={alt,caption,width,height};}
for(const directory of fs.readdirSync(root).filter(n=>/^\d{3}-/.test(n))){
 const post=JSON.parse(fs.readFileSync(`${root}/${directory}/post.json`,'utf8'));
 const review=JSON.parse(fs.readFileSync(`${root}/${directory}/review.json`,'utf8'));
 keywords[post.id]=review.seoTerms;
}
if(Object.keys(covers).length!==79)throw Error('All 79 reviewed covers are required');
const type='export interface ReviewedArticleCover { alt: string; caption: string; width: number; height: number; }\n';
fs.writeFileSync('src/data/reviewedArticleMedia.ts',type+`export const REVIEWED_ARTICLE_COVERS: Record<string, ReviewedArticleCover> = ${JSON.stringify(covers,null,2)};\nexport const REVIEWED_ARTICLE_KEYWORDS: Record<string, string[]> = ${JSON.stringify(keywords,null,2)};\n`);
console.log('Generated 79 reviewed cover records and keyword sets.');
