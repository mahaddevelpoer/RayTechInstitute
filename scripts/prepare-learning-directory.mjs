import fs from 'node:fs/promises';
import { loadTypescript } from './load-typescript.mjs';
const {LEARNING_LANGUAGES,LEARNING_TOPICS}=await loadTypescript('src/data/learningCatalog.ts');
const directory=LEARNING_LANGUAGES.map(language=>{
 const topics=LEARNING_TOPICS.filter(t=>t.languageId===language.id).sort((a,b)=>a.order-b.order);
 const first=topics[0];
 return {id:language.id,slug:language.slug,title:language.title,count:topics.length,first:first?{slug:first.slug,title:first.title,summary:first.summary,code:first.starterCode.split('\n').slice(0,7).join('\n')}:null};
});
await fs.writeFile('src/data/learningDirectory.json',JSON.stringify(directory));
console.log('[learning-directory] Prepared public course previews without question banks or assignments.');
