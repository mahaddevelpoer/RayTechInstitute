import fs from 'node:fs';
import assert from 'node:assert/strict';
import {learningProject,readLearningServiceKey} from './learning-cli-access.mjs';
import {fetchCatalogRows} from './catalog-fetch.mjs';
import {hasPrivateCredential} from './private-credential-patterns.mjs';
const root='content/editorial-revisions/trending-pk-20261030';
const posts=JSON.parse(fs.readFileSync(`${root}/assembled-posts.json`,'utf8'));
const audit=JSON.parse(fs.readFileSync('artifacts/editorial-image-revision/image-audit.json','utf8'));
assert.equal(posts.length,79);assert.equal(audit.preparedImages,158);assert.equal(audit.uniqueFiles,158);assert.equal(audit.issues.length,0);assert.equal(audit.nearDuplicates.length,0);
const base=`https://${learningProject}.supabase.co`,key=readLearningServiceKey();
const existing=await fetchCatalogRows(base,key,'blogs');
const rows=posts.map(p=>{
 const old=existing.find(r=>r.id===p.id);assert.ok(old);assert.equal(old.slug,p.slug);
 const row={id:p.id,title:p.title,slug:p.slug,category:p.category,excerpt:p.excerpt,content:p.content,featured_image:p.featuredImage,author:p.author,date_published:old.date_published,read_time:p.readTime,tags:p.tags,action_button_text:null,action_button_url:null};
 assert.ok(!hasPrivateCredential(JSON.stringify(row)));assert.ok(fs.existsSync(`public${p.featuredImage}`));return row;
});
console.log(JSON.stringify({reviewed:rows.length,otherBlogsPreserved:existing.length-rows.length,publish:process.argv.includes('--publish')}));
if(process.argv.includes('--publish')){
 fs.mkdirSync('artifacts/editorial-revision-publish',{recursive:true});
 fs.writeFileSync(`artifacts/editorial-revision-publish/backup-${Date.now()}.json`,JSON.stringify(existing));
 const response=await fetch(`${base}/rest/v1/blogs?on_conflict=id`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(rows),signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw Error(`Revision save failed (${response.status})`);
 const saved=await fetchCatalogRows(base,key,'blogs');
 for(const row of rows)for(const [field,value] of Object.entries(row))assert.deepEqual(saved.find(r=>r.id===row.id)?.[field],value);
 console.log('79 revisions saved and read back successfully. Hosting deployment still required.');
}
