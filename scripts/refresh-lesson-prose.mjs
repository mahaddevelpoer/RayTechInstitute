import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {authoredFoundationTopics} from '../content/courses/catalog.mjs';
import {authoredPythonTopics} from '../content/courses/python/topics.mjs';
import {readLearningServiceKey,learningProject} from './learning-cli-access.mjs';
import {fetchCatalogRows} from './catalog-fetch.mjs';
import {parseReviewedMdx} from './reviewed-mdx.mjs';
import {loadTypescript} from './load-typescript.mjs';
const {lessonWordCount,lessonQualityIssues}=await loadTypescript('supabase/functions/_shared/lesson-quality.ts');
const before=[...await authoredFoundationTopics({enriched:false}),...authoredPythonTopics({enriched:false})];
const after=[...await authoredFoundationTopics(),...authoredPythonTopics()];
const key=readLearningServiceKey(),base=`https://${learningProject}.supabase.co`;
const rows=await fetchCatalogRows(base,key,'learning_topics');const changes=[];
for(const topic of after){
 const row=rows.find(row=>row.id===topic.id),old=before.find(t=>t.id===topic.id);
 assert.ok(row&&row.state==='published'&&!row.pending_draft,'Preserve missing, unpublished or pending admin content.');
 assert.equal(row.language_id,topic.languageId);assert.equal(row.slug,topic.slug);
 assert.ok(row.content===old.content||row.content===topic.content,`Admin-edited prose must be reviewed before replacing ${topic.id}. No writes started.`);
 assert.deepEqual(lessonQualityIssues(topic.content),[],topic.id);parseReviewedMdx(topic.content);
 if(row.content!==topic.content)changes.push({topic,row});
}
console.log(JSON.stringify({lessons:after.length,changed:changes.length,words:after.map(topic=>({id:topic.id,before:lessonWordCount(before.find(t=>t.id===topic.id).content),after:lessonWordCount(topic.content)})),apply:process.argv.includes('--apply')},null,2));
if(!process.argv.includes('--apply'))process.exit(0);
const backup=await fs.mkdtemp(path.join(path.dirname(process.cwd()),'raytech-prose-backup-'));
await fs.writeFile(path.join(backup,'before.json'),JSON.stringify(changes.map(c=>c.row),null,2));
console.log(`Recoverable prose backup: ${backup}`);
let changed=0;
for(const {topic,row}of changes){
 const query=new URLSearchParams({id:`eq.${row.id}`,state:'eq.published',updated_at:`eq.${row.updated_at}`,pending_draft:'is.null'});
 const response=await fetch(`${base}/rest/v1/learning_topics?${query}`,{method:'PATCH',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({content:topic.content,updated_at:new Date().toISOString()})});
 if(!response.ok||(await response.json()).length!==1)throw Error(`Stopped after ${changed} changes; a record changed. Preserve the backup and review before retrying.`);
 changed++;
}
console.log(JSON.stringify({updatedProse:changed,changedVideoIds:0,changedQuestions:0,changedProgressVersions:0,hostingDeployed:false}));
