import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile);
test('the export gate rejects duplicate metadata, missing social images, invalid JSON-LD and indexable admin HTML',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'raytech-seo-gate-'));
 const title='Programming notes and lesson practice | RayTech Institute';
 const description='Read structured programming notes, practise the examples in your browser and review topic questions before progressing to your next lesson.';
 const html=()=>`<!doctype html><html><head><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="https://site.test/"><meta property="og:image" content="https://site.test/og.png"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script></head><body><header></header><main><h1>Programming notes</h1><img src="/logo.png" width="40" height="40" alt="Institute logo"></main><footer></footer></body></html>`;
 const run=()=>exec(process.execPath,['scripts/audit-seo.mjs'],{env:{...process.env,SEO_EXPORT_DIR:root}});
 try{
  await fs.writeFile(path.join(root,'index.html'),html());await fs.writeFile(path.join(root,'sitemap.xml'),'<urlset><url><loc>https://site.test/</loc></url></urlset>');
  await run();
  for(const [from,to,error] of [
   ['<meta property="og:image" content="https://site.test/og.png">','',/missing HTTPS Open Graph image/],
   ['alt="Institute logo"','',/missing alt text/],
   ['width="40"','',/needs dimensions/],
   ['{"@context":"https://schema.org","@type":"WebPage"}','invalid JSON',/invalid JSON-LD/],
  ]){await fs.writeFile(path.join(root,'index.html'),html().replace(from,to));await assert.rejects(run(),error);}
  await fs.writeFile(path.join(root,'index.html'),html());await fs.mkdir(path.join(root,'other'));
  await fs.writeFile(path.join(root,'other/index.html'),html().replace('rel="canonical" href="https://site.test/"','rel="canonical" href="https://site.test/other/"'));
  await assert.rejects(run(),/duplicate title/);await fs.unlink(path.join(root,'other/index.html'));
  await fs.mkdir(path.join(root,'admin'));await fs.writeFile(path.join(root,'admin/index.html'),html());await assert.rejects(run(),/private admin HTML must include noindex/);
  await fs.writeFile(path.join(root,'admin/index.html'),html().replace('<head>','<head><meta name="robots" content="noindex, nofollow">'));await run();
 } finally {
  const resolved=await fs.realpath(root),temp=await fs.realpath(os.tmpdir());if(!resolved.startsWith(temp+path.sep)||!path.basename(resolved).startsWith('raytech-seo-gate-'))throw Error('Unsafe temporary cleanup target');await fs.rm(resolved,{recursive:true,force:true});
 }
});
