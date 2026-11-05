import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {cloudflareHeaders,expandFirebasePath} from './prepare-cloudflare-export.mjs';
test('Firebase frame paths become explicit Pages routes, preserving compiler restrictions',async()=>{
 assert.deepEqual(expandFirebasePath('/learning-dom-frame{,.html}{,/}'),['/learning-dom-frame','/learning-dom-frame/','/learning-dom-frame.html','/learning-dom-frame.html/']);
 const config=JSON.parse(await fs.readFile('firebase.json','utf8')),headers=cloudflareHeaders(config);
 assert.match(headers,/\/learning-dom-frame\n[^]*?connect-src 'none'/);
 assert.match(headers,/\/learning-wasm-frame\n[^]*?'wasm-unsafe-eval'/);
 assert.match(headers,/Content-Security-Policy: default-src 'self'/);
 assert.match(headers,/X-Content-Type-Options: nosniff/);
 assert.match(headers,/Permissions-Policy: camera=\(\), microphone=\(\)/);
 assert.ok(!headers.includes('{,.html}'));assert.ok(!headers.includes('**'));
});
test('Only temporary Pages hostnames receive preview noindex, and hashed assets retain immutable caching',async()=>{
 const headers=cloudflareHeaders(JSON.parse(await fs.readFile('firebase.json','utf8')));
 assert.match(headers,/https:\/\/:project.pages.dev\/\*\n  X-Robots-Tag: noindex, nofollow/);
 assert.match(headers,/\/_next\/static\/\*\n  Cache-Control: public,max-age=31536000,immutable/);
 const global=headers.split('\n\n').find(rule=>rule.startsWith('/*\n'));
 assert.doesNotMatch(global,/X-Robots-Tag|Cache-Control/);
 assert.ok(headers.split('\n').every(line=>line.length<=2000));
});
