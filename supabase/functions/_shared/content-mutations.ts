const tables=new Set(['classes','subjects','chapters','notes','mcqs','past_papers','gazettes','blogs','video_mcqs']);
export async function readEducationalCatalog(base:string,key:string,fetcher:typeof fetch=fetch){
 const catalog:Record<string,unknown[]>={};
 await Promise.all([...tables].map(async table=>{const rows:unknown[]=[];for(let offset=0;;offset+=500){const r=await fetcher(`${base}/rest/v1/${table}?select=*&order=id.asc&offset=${offset}&limit=500`,{headers:{apikey:key,Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('The admin catalog could not be refreshed. Existing content is unchanged.');const page=await r.json();if(!Array.isArray(page))throw new Error('Storage returned an incomplete catalog.');rows.push(...page);if(page.length<500)break;}catalog[table]=rows;}));
 return {success:true,tables:catalog,refreshedAt:new Date().toISOString()};
}
/** Administrator gate is enforced by secure-dispatch before this function. */
export async function writeEducationalContent(base:string,key:string,payload:any,fetcher:typeof fetch=fetch){
 const table=String(payload?.table||''),operation=payload?.operation;
 if(!tables.has(table)||!['upsert','delete'].includes(operation))throw new Error('Unsupported content operation.');
 if(!base||!key)throw new Error('Content storage is unavailable. Nothing was saved.');
 const headers={apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=representation'};
 let path=`${base}/rest/v1/${table}`;let body:Record<string,unknown>|undefined;
 if(operation==='delete'){
  const filter=payload.filter,field=table==='classes'?'slug':'id';
  if(!filter||Object.keys(filter).length!==1||typeof filter[field]!=='string'||!filter[field].trim())throw new Error('Select a specific saved item before deleting.');
  path+=`?${new URLSearchParams({[field]:`eq.${filter[field]}`})}`;
 }else{
  body=payload.record;
  if(!body||typeof body!=='object'||Array.isArray(body)||typeof body.id!=='string'||!body.id.trim())throw new Error('A valid content identity is required.');
  if(['gazettes','notes','past_papers','blogs'].includes(table)&&(!body.title||typeof body.title!=='string'))throw new Error('Add a title before saving.');
  for(const field of ['pdf_url','preview_pdf_url','direct_result_url','action_button_url']){
   if(!body[field])continue;
   try{const value=String(body[field]);if(field==='action_button_url'&&value.startsWith('/')&&!value.startsWith('//'))continue;const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password)throw new Error();}
   catch{throw new Error('Document and source links must be valid HTTPS URLs.');}
  }
  if(['gazettes','notes','past_papers'].includes(table)&&!body.pdf_url)throw new Error('Add the document link before saving.');
 }
 const response=await fetcher(path,{method:operation==='upsert'?'POST':'DELETE',headers,signal:AbortSignal.timeout(15000),...(body?{body:JSON.stringify(body)}:{})});
 if(!response.ok){
  if(response.status===409)throw new Error('This item conflicts with existing content. Reload and check its identity or category.');
  throw new Error('Content could not be saved. Your form is unchanged. Please retry or contact the administrator.');
 }
 const rows=await response.json();if(!Array.isArray(rows)||rows.length!==1)throw new Error(operation==='delete'?'The item was not found. Reload to confirm its current state.':'Storage did not confirm the saved item. Reload before retrying.');
 return {success:true,table,operation};
}
