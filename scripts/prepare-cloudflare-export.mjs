import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export function expandFirebasePath(source) {
 const match=source.match(/\{([^{}]*)\}/);
 if(match)return match[1].split(',').flatMap(part=>expandFirebasePath(source.slice(0,match.index)+part+source.slice(match.index+match[0].length)));
 if(source==='**')return ['/*'];
 if(source==='**/_next/static/**')return ['/_next/static/*'];
 return [(source.startsWith('/')?source:'/'+source).replaceAll('**','*')];
}

export function cloudflareHeaders(config) {
 const rules=new Map();
 for(const rule of config.hosting.headers||[])for(const route of expandFirebasePath(rule.source)){
  if((route.match(/\*/g)||[]).length>1)throw Error('Unsupported multi-splat header rule: '+route);
  const headers=rules.get(route)||new Map();
  for(const h of rule.headers){
   // Pages' default browser policy already revalidates. Do not merge a global
   // max-age=0 with the immutable policy of hashed assets and audio.
   if(route==='/*'&&h.key.toLowerCase()==='cache-control')continue;
   headers.set(h.key,h.value);
  }
  rules.set(route,headers);
 }
 for(const route of ['https://:project.pages.dev/*','https://:version.:project.pages.dev/*'])rules.set(route,new Map([['X-Robots-Tag','noindex, nofollow']]));
 if(rules.size>100)throw Error('Pages header rule count exceeds the free platform limit');
 const output=[...rules].map(([route,headers])=>route+'\n'+[...headers].map(([key,value])=>'  '+key+': '+value).join('\n')).join('\n\n')+'\n';
 if(output.split('\n').some(line=>line.length>2000))throw Error('Pages header line exceeds 2,000 characters');
 return output;
}

export async function prepareCloudflareExport(root='out') {
 const directory=path.resolve(root);
 const config=JSON.parse(await fs.readFile('firebase.json','utf8'));
 const notFound=await fs.readFile(path.join(directory,'404.html'),'utf8');
 if(!/^<!doctype html/i.test(notFound))throw Error('A real top-level 404.html is required; SPA fallback would conceal missing pages');
 await fs.writeFile(path.join(directory,'_headers'),cloudflareHeaders(config));
 const files=[];
 async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isSymbolicLink())throw Error('Export must not contain symbolic links');if(entry.isDirectory())await walk(file);else if(entry.isFile())files.push({path:path.relative(directory,file).replaceAll(path.sep,'/'),bytes:(await fs.stat(file)).size});}}
 await walk(directory);
 const oversized=files.filter(file=>file.bytes>25*1024*1024);
 if(oversized.length)throw Error('Pages asset size limit exceeded: '+oversized.map(f=>f.path).join(', '));
 if(files.length>20000)throw Error('Pages export exceeds 20,000 files');
 const reserved=files.filter(f=>/^_worker\.js(?:\/|$)|^_routes\.json$/.test(f.path));
 if(reserved.length)throw Error('This deployment must remain static; unexpected Pages Function entry');
 await fs.mkdir('artifacts/cloudflare-migration',{recursive:true});
 const report={files:files.length,totalBytes:files.reduce((n,f)=>n+f.bytes,0),largest:files.toSorted((a,b)=>b.bytes-a.bytes).slice(0,10),staticOnly:true,real404:true};
 await fs.writeFile('artifacts/cloudflare-migration/export.json',JSON.stringify(report,null,2));
 return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log('[cloudflare-export]',await prepareCloudflareExport(process.argv[2]||'out'));
