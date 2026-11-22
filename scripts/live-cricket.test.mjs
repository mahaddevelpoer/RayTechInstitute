import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {cloudflareHeaders} from './prepare-cloudflare-export.mjs';

test('score panel preserves provider attribution, sandbox and a match-specific fallback',async()=>{
 const compiled=await build({entryPoints:['src/components/educational/LiveCricketScorecard.tsx'],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],logLevel:'silent'});
 const module={exports:{}};vm.runInNewContext(compiled.outputFiles[0].text,{module,exports:module.exports,require:createRequire(import.meta.url)});
 const html=renderToStaticMarkup(React.createElement(module.exports.LiveCricketScorecard));
 assert.match(html,/src="https:\/\/www\.ipl\.com\/widget\/matchlist"/);
 assert.match(html,/sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"/);
 assert.match(html,/height="560"/);assert.match(html,/supplied by IPL.com and can be delayed/);
 assert.match(html,/india-a-vs-pakistan-a-100460\/live/);assert.match(html,/Reload scores/);
 assert.ok(html.indexOf('Open full match scorecard')<html.indexOf('<iframe'),'The specific match is accessible before the mixed-fixture feed');
 assert.ok(!/allow-top-navigation|allow-forms|autoplay=/.test(html));
});

test('external score frame is allowed only on its article while compiler policies stay intact',async()=>{
 const config=JSON.parse(await fs.readFile('firebase.json','utf8'));
 const global=config.hosting.headers.filter(rule=>rule.source==='**').flatMap(rule=>rule.headers).find(h=>h.key==='Content-Security-Policy').value;
 assert.ok(!global.includes('https://www.ipl.com'));
 const scoped=config.hosting.headers.filter(rule=>rule.headers.some(h=>h.value.includes('https://www.ipl.com')));
 assert.equal(scoped.length,1);assert.equal(scoped[0].source,'/blogs/pakistan-a-india-a-live-scorecard-rising-stars-2026{,/}');
 const value=scoped[0].headers[0].value;assert.equal(value.replace('https://www.ipl.com ',''),global);
 const headers=cloudflareHeaders(config);assert.match(headers,/pakistan-a-india-a-live-scorecard-rising-stars-2026\/\n  ! Content-Security-Policy/);
});
