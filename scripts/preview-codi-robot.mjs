// One small esbuild bundle and one loopback server. No Next build or ML test.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { build as esbuild } from 'esbuild';
import { loadTypescript } from './load-typescript.mjs';
const build = options => esbuild({ ...options, define: { 'process.env': '{}', ...options.define } });
await import('./prepare-codi-lessons.mjs');
const { LEARNING_TOPICS, LEARNING_LANGUAGES } = await loadTypescript('src/data/learningCatalog.ts');
const language = LEARNING_LANGUAGES.find(item => item.slug === 'html');
const topic = LEARNING_TOPICS.find(item => item.languageId === language?.id);
if (!topic || !language) throw new Error('A published HTML lesson is needed for the preview.');
const fixture = path.resolve('artifacts/codi/robot-preview'); await fs.mkdir(fixture, { recursive: true });
await build({ stdin: { resolveDir: process.cwd(), loader: 'tsx', contents: `
import React,{useRef,useState}from'react';import{createRoot}from'react-dom/client';
import{CodiReader}from'./src/components/learning/CodiReader';import{BrowserPractice}from'./src/components/learning/BrowserPractice';import{MarkdownRenderer}from'./src/components/MarkdownRenderer';
const topic=${JSON.stringify({ id: topic.id, title: topic.title, slug: topic.slug, order: topic.order, content: topic.content, starterCode: topic.starterCode })};
function App(){const lesson=useRef(null),compiler=useRef(null);const[run,setRun]=useState(0),[code,setCode]=useState(topic.starterCode);return <div className="learning-page"><header className="preview-header"><strong>RayTech Institute</strong><span>Codi robot tutor: local interaction preview</span><button className="learn-button" onClick={()=>document.documentElement.classList.toggle('dark')}>Switch theme</button></header><main className="learning-workspace"><aside className="learning-topics"><div className="learning-panel-toolbar">HTML course</div><p className="preview-help">Click a lesson line to read it. Highlight text for an explanation. Click the robot for the entire lesson. Run the example to move Codi to the practice pane.</p></aside><article ref={lesson} tabIndex={0} className="learning-lesson"><h1>{topic.title}</h1><MarkdownRenderer content={topic.content} practiceLanguage="html" onTryCode={setCode}/></article><aside ref={compiler} className="learning-practice-pane"><BrowserPractice language="html" starterCode={topic.starterCode} code={code} onCodeChange={setCode} onRunStart={()=>setRun(value=>value+1)}/></aside></main><CodiReader content={lesson} compiler={compiler} runSignal={run} fullText={topic.title+'\\n'+topic.content} languageSlug="html" currentLesson={topic}/><footer className="learning-footer">Robot preview only. No automatic speech-model download.</footer></div>};createRoot(document.getElementById('root')).render(<App/>);` }, outfile: path.join(fixture, 'preview.js'), jsx: 'automatic', bundle: true, platform: 'browser', format: 'iife', target: 'es2022', define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'preview-dynamic', setup(b) { b.onResolve({ filter: /^next\/dynamic$/ }, () => ({ path: 'dynamic', namespace: 'preview' })); b.onLoad({ filter: /.*/, namespace: 'preview' }, () => ({ resolveDir: process.cwd(), contents: `import React,{lazy,Suspense}from'react';export default(load,options)=>{const C=lazy(async()=>({default:await load()}));return props=>React.createElement(Suspense,{fallback:options.loading?React.createElement(options.loading):null},React.createElement(C,props));}` })); } }] });
const css = (await Promise.all(['src/app/globals.css', 'src/app/learning.css', 'src/app/codi.css'].map(file => fs.readFile(file, 'utf8')))).join('\n') + '\n*{box-sizing:border-box}body{margin:0}.preview-header{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px 24px;border-bottom:1px solid var(--border)}.preview-header>span{font-size:12px;color:var(--text-muted)}.preview-help{padding:16px;font-size:14px;line-height:1.8}.learning-lesson h1{font-size:28px;line-height:1.3}.learning-lesson h2{margin-top:28px;font-size:21px}.learning-lesson p{line-height:1.8}.learning-lesson pre{overflow:auto;padding:16px;background:var(--bg-soft)}@media(max-width:767px){.preview-header>span{display:none}.learning-workspace{display:flex;flex-direction:column;overflow:auto}.learning-lesson,.learning-practice-pane{height:auto;overflow:visible}.learning-lesson{padding-bottom:32px}.learning-practice-pane{min-height:500px}.learning-page{height:100dvh}}';
const config = JSON.parse(await fs.readFile('firebase.json', 'utf8'));
const server = http.createServer(async (req, res) => {
  try {
    const route = new URL(req.url, 'http://localhost').pathname;
    const rules = config.hosting.headers.filter(rule => rule.source && path.posix.matchesGlob(route, rule.source));
    for (const rule of rules) for (const { key, value } of rule.headers) res.setHeader(key, value);
    if (route === '/') { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Codi robot tutor preview</title><link rel="stylesheet" href="/preview.css"></head><body><div id="root"></div><script src="/preview.js"></script></body></html>'); return; }
    if (route === '/preview.css') { res.setHeader('Content-Type', 'text/css'); res.end(css); return; }
    const file = route === '/preview.js' ? path.join(fixture, 'preview.js') : path.resolve('public', `.${route}`);
    if (file !== path.join(fixture, 'preview.js') && !file.startsWith(path.resolve('public') + path.sep)) throw new Error('Invalid path');
    const mime = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.txt': 'text/plain' };
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); res.end(await fs.readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(4178, '127.0.0.1', () => console.log('[codi-preview] http://127.0.0.1:4178/ . No Next build, browser automation, or model inference running.'));
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? 'Preview port is in use; no existing process was stopped.' : 'Preview could not start.'); process.exitCode = 1; });
