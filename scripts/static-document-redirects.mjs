import path from 'node:path';

/** Exact rules for exported payloads, never a catch-all rewrite or an external redirect. */
export function staticDocumentRedirects(files,existing=''){
 const lines=existing.trim().split(/\r?\n/).filter(Boolean);
 const rules=new Map(lines.filter(l=>!l.trim().startsWith('#')).map(l=>{const [from,to]=l.trim().split(/\s+/);return [from,to];}));
 for(const file of files){
  if(!/(?:^|\/)index\.txt$/.test(file))continue;
  if(file.startsWith('/')||file.includes('..')||/[\s?#\\]/.test(file))throw Error('Invalid exported payload path');
  const from='/'+file,parent=path.posix.dirname(file),to=parent==='.'?'/':'/'+parent+'/';
  if(rules.has(from)&&rules.get(from)!==to)throw Error('Conflicting payload redirect: '+from);
  if(!rules.has(from)){lines.push(`${from} ${to} 302`);rules.set(from,to);}
 }
 const staticCount=lines.filter(l=>!l.startsWith('#')&&!/[*:]/.test(l.split(/\s+/)[0])).length;
 if(staticCount>2000)throw Error('Static redirect limit exceeded');
 return lines.join('\n')+'\n';
}

/** Local preview of the exact redirect rules emitted for Cloudflare Pages. */
export function matchDocumentRedirect(pathname,search,text){
 for(const line of text.split(/\r?\n/)){
  if(!line.trim()||line.trim().startsWith('#'))continue;
  const [from,to,status='302']=line.trim().split(/\s+/);
  if(from!==pathname||!['301','302','303','307','308'].includes(status))continue;
  return {location:to+(to.includes('?')?'':search),status:Number(status)};
 }
 return undefined;
}
