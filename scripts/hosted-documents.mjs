import path from 'node:path';import {existsSync} from 'node:fs';
const oldHosts=new Set(['raytechinstitute.web.app','raytechinstitute.firebaseapp.com']);
export function canonicalHostedDocument(value,siteOrigin,exists=existsSync){
 if(typeof value!=='string')return value;
 let url;try{url=new URL(value);}catch{return value;}
 if(url.protocol!=='https:'||url.username||url.password||!oldHosts.has(url.hostname)||!url.pathname.startsWith('/documents/'))return value;
 let decoded;try{decoded=decodeURIComponent(url.pathname);}catch{return value;}
 const root=path.resolve('public/documents'),file=path.resolve('public','.'+decoded);
 if(!file.startsWith(root+path.sep)||!exists(file))return value;
 const target=new URL(siteOrigin);if(target.protocol!=='https:'||target.username||target.password||target.pathname!=='/'||target.search||target.hash)throw Error('Hosted documents require a valid HTTPS site origin');
 return target.origin+url.pathname+url.search+url.hash;
}
