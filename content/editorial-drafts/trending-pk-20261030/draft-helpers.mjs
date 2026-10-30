import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
export function save(position,title,slug,category,excerpt,image,tags,sources,body,terms=[]){
 const dir=path.join(root,`${String(position).padStart(3,'0')}-${slug}`);
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'input.json'),JSON.stringify({title,slug,category,excerpt,image,tags,sources,body,terms},null,2)+'\n');
}
