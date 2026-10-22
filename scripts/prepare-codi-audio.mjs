import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createProcessor } from '@mdx-js/mdx';
import { loadTypescript } from './load-typescript.mjs';
const {LEARNING_TOPICS,LEARNING_LANGUAGES}=await loadTypescript('src/data/learningCatalog.ts');
const {codiSentences,codiAudioKeyMaterial,codiInlineCodeRanges}=await loadTypescript('src/lib/learning/codi-sentences.ts');
const {codiSpeechChunks}=await loadTypescript('src/lib/learning/codi-tutor.ts');
const {explainCodeLine}=await loadTypescript('src/lib/learning/code-explanation.ts');
const reviewed=JSON.parse(await fs.readFile('src/data/reviewedLessons.json','utf8'));
const processor=createProcessor({format:'mdx'});const units=new Map();const lessons=[];
const plain=node=>typeof node.value==='string'?node.value:(node.children||[]).map(plain).join('');
const addUnit=(chunk,topic)=>{if(!chunk||chunk.length>420)return;for(const language of ['ur','en']){const hash=createHash('sha256').update(codiAudioKeyMaterial(chunk,language)).digest('hex');if(!units.has(hash))units.set(hash,{hash,language,text:chunk,lesson:topic.slug,course:LEARNING_LANGUAGES.find(l=>l.id===topic.languageId)?.slug});}};
const add=(text,topic,code=false,ranges=[])=>{for(const sentence of code?[text.trim()]:codiSentences(text,ranges))for(const chunk of codiSpeechChunks(sentence,'text'))addUnit(chunk,topic);if(code){const explanation=explainCodeLine(topic.languageId,text);if(explanation)addUnit(explanation.narration,topic);}};
const topics=[...LEARNING_TOPICS].filter(t=>t.state==='published').sort((a,b)=>Number(b.languageId.includes('python'))-Number(a.languageId.includes('python'))||a.order-b.order);
for(const topic of topics){
 add(topic.summary,topic);
 const blocks=reviewed[topic.id]?.blocks.filter(b=>b.type==='markdown')||[{content:topic.content}];
 for(const block of blocks){const walk=node=>{if(['paragraph','heading','tableCell'].includes(node.type)){add(plain(node),topic,false,codiInlineCodeRanges(node));return;}if(node.type==='code'){for(const line of node.value.split('\n'))add(line,topic,true);return;}for(const child of node.children||[])walk(child);};walk(processor.parse(block.content));}
 for(const block of reviewed[topic.id]?.blocks || []){
  if(block.type==='markdown')continue;add(block.title,topic);
  if(block.type==='Understand')for(const [i,stage]of block.stages.entries()){for(const value of [`Part ${i+1}: ${stage.title}`,stage.explanation,stage.hint,stage.success])add(value,topic);for(const line of stage.code.split('\n'))add(line,topic,true);}
  if(block.type==='PredictOutput'){add(block.explanation,topic);for(const line of block.code.split('\n'))add(line,topic,true);}
  if(block.type==='CodeTrace')for(const step of block.steps){add(step.explanation,topic);for(const line of (step.line+'\n'+step.values).split('\n'))add(line,topic,true);}
  if(block.type==='TryExample'){add(block.task,topic);for(const line of block.code.split('\n'))add(line,topic,true);}
 }
 add(topic.title,topic);for(const objective of topic.objectives)add(objective,topic);
 lessons.push(topic.slug);
}
await fs.mkdir('public/codi/audio',{recursive:true});
await fs.writeFile('public/codi/audio/catalog.json',JSON.stringify({schema:1,lessons,units:[...units.values()]}));
try{await fs.access('public/codi/audio/index.json');}catch{await fs.writeFile('public/codi/audio/index.json',JSON.stringify({schema:1,ready:[]}));}
console.log(`[codi-audio] ${units.size} unique published sentence/voice files queued. No audio generation in this step.`);
