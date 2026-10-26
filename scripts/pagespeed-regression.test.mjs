import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import postcss from 'postcss';

test('public homepage initial bundle excludes authentication, analytics, database SDKs and modal', async () => {
  const result = await build({
    stdin: { resolveDir: process.cwd(), contents: `
      export {default as Home} from './src/app/page';
      export {default as Consent} from './src/components/CookieConsentBanner';
      export {FirebaseAnalytics} from './src/components/FirebaseAnalytics';
      export {default as Notifications} from './src/components/NotificationPrompt';
      export {CompilerMount} from './src/components/compiler/CompilerMount';`, loader: 'tsx' },
    bundle: true, splitting: true, format: 'esm', platform: 'browser', minify: true,
    outdir: 'artifacts/pagespeed-graph', write: false, metafile: true,
    define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
  });
  const outputs = result.metafile.outputs;
  await fs.mkdir('artifacts/pagespeed-review', {recursive:true});
  await fs.writeFile('artifacts/pagespeed-review/bundle-graph.json', JSON.stringify(result.metafile));
  const entry = Object.keys(outputs).find(file => outputs[file].entryPoint === '<stdin>');
  assert.ok(entry);
  const initial = new Set();
  function visit(file) {
    if (initial.has(file)) return;
    initial.add(file);
    for (const dependency of outputs[file].imports) {
      if (!dependency.external && dependency.kind !== 'dynamic-import' && outputs[dependency.path]) visit(dependency.path);
    }
  }
  visit(entry);
  const inputs = [...initial].flatMap(file => Object.keys(outputs[file].inputs));
  for (const forbidden of [/@firebase\/auth\//, /@firebase\/analytics\//, /@supabase\//, /src\/lib\/learning\/admin\.ts/, /educationalStore\.ts/, /LectureModal\.tsx/, /PythonCompiler\.tsx/]) {
    assert.ok(!inputs.some(file => forbidden.test(file.replaceAll('\\', '/'))), `Unexpected initial dependency: ${forbidden}`);
  }
  assert.ok(Object.values(outputs).some(output => output.entryPoint?.endsWith('LectureModal.tsx')), 'Lecture modal remains available in a deferred chunk');
  const gzipBytes = [...initial].filter(file => file.endsWith('.js')).reduce((sum, file) => {
    const output = result.outputFiles.find(item => path.resolve(item.path) === path.resolve(file));
    return sum + gzipSync(output.contents).length;
  }, 0);
  console.log(`Homepage source graph: ${initial.size} initial files, ${gzipBytes} gzip JS bytes (esbuild diagnostic, not Next release size).`);
});

test('consent is in initial HTML, rejects safely, custom analytics defaults off and acceptance initializes once', async () => {
  const result = await build({
    stdin: { resolveDir: process.cwd(), loader: 'tsx', contents: `
      import React from 'react'; import {createRoot} from 'react-dom/client';
      import {flushSync} from 'react-dom';
      import {renderToString} from 'react-dom/server';
      import Consent from './src/components/CookieConsentBanner';
      window.initialConsentHTML = renderToString(<Consent/>);
      window.flushUI = flushSync;
      flushSync(() => createRoot(document.getElementById('root')).render(<Consent/>));` },
    bundle: true, format: 'iife', platform: 'browser', write: false,
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [{ name: 'consent-test-boundaries', setup(bundler) {
      bundler.onResolve({ filter: /^(@\/lib\/analytics|next\/link)$/ }, args => ({ path: args.path, namespace: 'test' }));
      bundler.onLoad({ filter: /.*/, namespace: 'test' }, args => ({ resolveDir: process.cwd(), loader: 'js', contents: args.path === 'next/link'
        ? `import React from 'react'; export default function Link(props){return React.createElement('a',props);}`
        : `export async function initAnalytics(){window.analyticsCalls=(window.analyticsCalls||0)+1;}` }));
    } }],
  });
  const settle = () => new Promise(resolve => setTimeout(resolve, 35));
  async function mount(cookie = '') {
    const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'https://local.test/', runScripts: 'outside-only', pretendToBeVisual: true });
    dom.window.TextEncoder = TextEncoder;
    dom.window.TextDecoder = TextDecoder;
    if (cookie) dom.window.document.cookie = cookie;
    dom.window.eval(result.outputFiles[0].text);
    await settle();
    return dom;
  }
  const rejected = await mount();
  try {
    assert.match(rejected.window.initialConsentHTML, /Cookie and Privacy Consent/);
    assert.equal(rejected.window.analyticsCalls || 0, 0);
    rejected.window.flushUI(() => [...rejected.window.document.querySelectorAll('button')].find(button => button.textContent.includes('Decline Optional')).click());
    await settle();
    assert.equal(Boolean(rejected.window.document.querySelector('aside')), false);
    assert.match(rejected.window.document.cookie, /raytech_cookie_consent_v1=rejected/);
    assert.equal(rejected.window.analyticsCalls || 0, 0);
  } finally { rejected.window.close(); }
  const accepted = await mount();
  try {
    accepted.window.flushUI(() => [...accepted.window.document.querySelectorAll('button')].find(button => button.textContent.includes('Customize Preferences')).click()); await settle();
    assert.equal(accepted.window.document.querySelector('[aria-label="Allow performance analytics"]').checked, false);
    accepted.window.flushUI(() => [...accepted.window.document.querySelectorAll('button')].find(button => button.textContent.includes('Hide Options')).click()); await settle();
    accepted.window.flushUI(() => [...accepted.window.document.querySelectorAll('button')].find(button => button.textContent.includes('Accept All')).click()); await settle();
    assert.equal(accepted.window.analyticsCalls, 1);
    assert.match(accepted.window.document.cookie, /raytech_cookie_consent_v1=accepted/);
  } finally { accepted.window.close(); }
  for (const choice of ['rejected', 'accepted']) {
    const returning = await mount(`raytech_cookie_consent_v1=${choice}`);
    try {
      assert.equal(Boolean(returning.window.document.querySelector('aside')), false);
      assert.equal(returning.window.analyticsCalls || 0, 0, 'Missing preferences must not enable analytics');
    } finally { returning.window.close(); }
  }
});

function luminance(hex) { const rgb = hex.slice(1).match(/../g).map(pair => parseInt(pair,16)/255).map(n => n <= .04045 ? n/12.92 : ((n+.055)/1.055)**2.4); return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]; }
function contrast(a,b) { const [bright,dark] = [luminance(a),luminance(b)].sort((x,y)=>y-x); return (bright+.05)/(dark+.05); }
test('reported footer and workbench text use AA contrast in both themes; heading and subject names are unambiguous', async () => {
  const css = postcss.parse(await fs.readFile('src/app/globals.css','utf8'));
  for (const selector of [':root','html.dark']) {
    const theme = {};
    css.walkRules(rule => { if (rule.selector === selector) rule.walkDecls(/^--/, d => { theme[d.prop] = d.value; }); });
    for (const color of ['--link','--text-main']) assert.ok(contrast(theme[color], theme['--bg-soft']) >= 4.5);
    for (const color of ['--primary','--primary-hover']) assert.ok(contrast('#ffffff', theme[color]) >= 4.5);
  }
  const footer = await fs.readFile('src/components/Footer.tsx','utf8');
  assert.doesNotMatch(footer, /<h4|text-orange-400|text-red-400/);
  assert.match(footer, /footer-board-link/); assert.match(footer, /footer-youtube-link/);
  const catalogCSS = await fs.readFile('src/app/catalog.css','utf8');
  assert.match(catalogCSS, /footer-board-link,.footer-youtube-link\)\s*\{ color:var\(--link\)/);
  assert.match(await fs.readFile('src/components/Workbench.tsx','utf8'), /className="btn-primary/);
  assert.match(await fs.readFile('src/components/TheWork.tsx','utf8'), /aria-label=\{`\$\{c.title\}: \$\{subject.title\} study resources`\}/);
});

test('hosting isolates opener while preserving OAuth popups and long-lived fingerprinted asset caching', async () => {
  const config = JSON.parse(await fs.readFile('firebase.json','utf8'));
  const headers = config.hosting.headers.flatMap(rule => rule.headers);
  assert.equal(headers.find(header => header.key === 'Cross-Origin-Opener-Policy').value, 'same-origin-allow-popups');
  assert.match(config.hosting.headers.find(rule => rule.source.includes('_next/static')).headers.find(h => h.key === 'Cache-Control').value, /31536000,immutable/);
});

test('lesson and tutor CSS load with learning routes while common controls keep their global styles', async () => {
  const root = await fs.readFile('src/app/layout.tsx','utf8');
  assert.doesNotMatch(root, /import\s+["'].\/(?:learning|codi|home)\.css/);
  const learning = await fs.readFile('src/app/learn/layout.tsx','utf8');
  for (const file of ['learning','codi']) assert.ok(learning.includes(`import '../${file}.css'`));
  assert.match(await fs.readFile('src/app/page.tsx','utf8'), /import '.\/home.css'/);
  const globals = await fs.readFile('src/app/globals.css','utf8');
  assert.match(globals, /\.learn-button\s*\{/); assert.match(globals, /--learn-accent:/);
});

test('deferred admin store does not break public video question checkpoints', async () => {
  const result = await build({stdin:{resolveDir:process.cwd(),loader:'tsx',contents:`
    import React from 'react'; import {createRoot} from 'react-dom/client'; import {flushSync} from 'react-dom';
    import {InteractiveVideoPlayer} from './src/components/InteractiveVideoPlayer';
    window.flushUI=flushSync;
    flushSync(()=>createRoot(document.getElementById('root')).render(<InteractiveVideoPlayer videoId="abcdefghijk" title="Test lecture"/>));`},
    bundle:true,platform:'browser',format:'iife',write:false,jsx:'automatic',define:{'process.env.NODE_ENV':'"production"','process.env':'{}'},
    plugins:[{name:'video-checkpoint-fixture',setup(bundler){
      bundler.onResolve({filter:/^@\/data\/staticCatalog$/},()=>({path:'catalog',namespace:'fixture'}));
      bundler.onResolve({filter:/^@\/lib\/learning\/youtube-player$/},()=>({path:'youtube',namespace:'fixture'}));
      bundler.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='catalog'
        ? `export const INITIAL_VIDEO_MCQS=[{id:'checkpoint',videoId:'abcdefghijk',timestampSeconds:5,timestampFormatted:'00:05',topic:'Variables',question:'Which value is assigned?',options:['One','Two','Three','Four'],correctIndex:1,explanation:'Two is assigned.'}];`
        : `export async function loadLessonYouTubeAPI(){window.YT={Player:class{constructor(id,options){this.options=options;window.testPlayer=this;}getCurrentTime(){return 5;}pauseVideo(){window.pauses=(window.pauses||0)+1;}playVideo(){}destroy(){}}};return window.YT;}` }));
    }}],
  });
  const dom = new JSDOM('<!doctype html><div id="root"></div>',{url:'https://local.test/',runScripts:'outside-only',pretendToBeVisual:true});
  dom.window.setInterval=callback=>{dom.window.testTick=callback;return 1;};
  dom.window.clearInterval=()=>{};
  const until = async check => {const end=Date.now()+2000;while(!check()){assert.ok(Date.now()<end,'Component did not become ready');await new Promise(resolve=>setTimeout(resolve,10));}};
  try{
    dom.window.eval(result.outputFiles[0].text);
    await until(()=>dom.window.document.body.textContent.includes('1 Interactive Timeline Quiz'));
    dom.window.flushUI(()=>dom.window.document.querySelector('[aria-label="Play lecture video: Test lecture"]').click());
    await until(()=>dom.window.testPlayer);
    dom.window.testPlayer.options.events.onStateChange({data:1});
    dom.window.flushUI(()=>dom.window.testTick());
    assert.equal(dom.window.pauses,1);
    assert.ok(dom.window.document.body.textContent.includes('Which value is assigned?'));
    dom.window.flushUI(()=>[...dom.window.document.querySelectorAll('button')].find(button=>button.textContent.includes('Two')).click());
    assert.ok(dom.window.document.body.textContent.includes('Two is assigned.'));
  }finally{dom.window.close();}
});
