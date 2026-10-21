import {learningProject,readLearningServiceKey} from './learning-cli-access.mjs';
const key=readLearningServiceKey(),base=`https://${learningProject}.supabase.co/storage/v1`;
const headers={apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'};
const id='codi-lesson-audio';
const response=await fetch(base+'/bucket',{headers});if(!response.ok)throw Error('Storage inventory unavailable; credentials suppressed.');
const buckets=await response.json();const current=buckets.find(b=>b.id===id);
console.log(JSON.stringify({existingBuckets:buckets.length,audioBucketExists:!!current,apply:process.argv.includes('--apply'),billingChanges:false}));
if(!process.argv.includes('--apply'))process.exit(0);
if(current){if(!current.public||Number(current.file_size_limit)!==6000000||JSON.stringify(current.allowed_mime_types)!==JSON.stringify(['application/json']))throw Error('Existing bucket configuration differs; preserve and review it.');}
else{const r=await fetch(base+'/bucket',{method:'POST',headers,body:JSON.stringify({id,name:id,public:true,file_size_limit:6000000,allowed_mime_types:['application/json']})});if(!r.ok)throw Error('Could not create the bounded audio-only bucket.');}
console.log('Audio bucket ready. Public downloads only; writes use the existing service credential. Application hot-cache budget: 250 MB.');
