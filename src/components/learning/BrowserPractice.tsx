'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Play, Square, RotateCcw } from 'lucide-react';
import type { BrowserRuntime } from '@/types/learning';
import { loadRuntimeAssets, loadDOMWorker } from '@/lib/learning/runtime-assets';
const CodeEditor = dynamic(() => import('./CodeEditor').then(m => m.CodeEditor), { ssr: false, loading: () => <p className="p-4" role="status">Loading editor...</p> });

export function BrowserPractice({ language, starterCode, code: externalCode, onCodeChange, onRunStart }: { language: BrowserRuntime; starterCode: string; code?: string; onCodeChange?: (value: string) => void; onRunStart?: () => void }) {
  const [localCode, setLocalCode] = useState(starterCode);
  const code = externalCode ?? localCode;
  function setCode(value: string) { setLocalCode(value); onCodeChange?.(value); }
  const [output, setOutput] = useState('Run your code to see its output.');
  const [preview, setPreview] = useState('');
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stdin, setStdin] = useState('');
  const [domPreview, setDOMPreview] = useState(false);
  // Fast static frames may load before hydration attaches their onLoad handler.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const frame = useRef<HTMLIFrameElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const runId = useRef('');
  const outputText = useRef('');
  const supported = ['html', 'css', 'javascript', 'python', 'php'].includes(language);
  const isPreview = language === 'html' || language === 'css';
  function stop(message = 'Execution stopped.') { frame.current?.contentWindow?.postMessage({ type: 'stop' }, '*'); clearTimeout(timer.current); runId.current = ''; setRunning(false); setLoading(false); if (message) setOutput(current => current ? `${current}\n${message}` : message); }
  useEffect(() => {
    const target = frame.current?.contentWindow;
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || !runId.current || event.data?.runId !== runId.current) return;
      if (event.data.type === 'executing' || (domPreview && event.data.type === 'heartbeat')) { clearTimeout(timer.current); setLoading(false); timer.current = setTimeout(() => stop('Stopped after 10 seconds without a responsive runtime.'), 10000); }
      if (domPreview && event.data.type === 'interactive' && !outputText.current) setOutput('Interactive preview active. Use the preview controls below, or select Stop before running again.');
      if (event.data.type === 'output') { outputText.current = `${outputText.current}${String(event.data.text).slice(0, 20000)}${language === 'javascript' ? '\n' : ''}`.slice(0, 20000); setOutput(outputText.current); }
      if (event.data.type === 'done') { clearTimeout(timer.current); setRunning(false); setLoading(false); runId.current = ''; const detail = typeof event.data.text === 'string' ? event.data.text.slice(0, 4000) : ''; setOutput(outputText.current + (detail ? `${outputText.current ? '\n' : ''}${detail}` : outputText.current ? '' : 'Finished with no printed output.')); }
    };
    window.addEventListener('message', receive);
    return () => { window.removeEventListener('message', receive); clearTimeout(timer.current); runId.current = ''; target?.postMessage({ type: 'stop' }, '*'); };
  }, [language, domPreview, mounted]);
  async function run() {
    if (runId.current) return;
    if (code.length > 20000) { setOutput('Use at most 20,000 characters per run.'); return; }
    if (!supported || (!isPreview && !ready)) return;
    onRunStart?.();
    if (language === 'html' || language === 'css') {
      const content = language === 'css' ? `<style>${code}</style><main><h1>Practice heading</h1><p>Change the CSS to style this sample page.</p><button>Sample button</button><ul><li>First item</li><li>Second item</li></ul></main>` : code;
      setPreview(`<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'; base-uri 'none'"></head><body>${content}</body></html>`);
      return;
    }
    if (language === 'javascript' && domPreview && ready) {
      const id = crypto.randomUUID(); runId.current = id;
      outputText.current = ''; setOutput(''); setRunning(true); setLoading(true);
      timer.current = setTimeout(() => stop('DOM runtime loading timed out. Try again.'), 90000);
      try {
        const workerSource = await loadDOMWorker();
        if (runId.current !== id) return;
        frame.current?.contentWindow?.postMessage({ type: 'run', runId: id, code, html: '<p id="demo">Your DOM example appears here.</p><button id="button">Try it</button>', workerSource }, '*');
      } catch { if (runId.current === id) stop('The DOM runtime could not download. Check your connection and try again.'); }
      return;
    }
    if (language === 'javascript' && ready) {
      outputText.current = ''; setOutput(''); setRunning(true); runId.current = crypto.randomUUID();
      frame.current?.contentWindow?.postMessage({ type: 'run', code, runId: runId.current }, '*');
      timer.current = setTimeout(() => stop('Stopped after the 10-second execution limit.'), 10000);
    }
    if ((language === 'python' || language === 'php') && ready) {
      const id = crypto.randomUUID(); runId.current = id;
      outputText.current = ''; setOutput(''); setRunning(true); setLoading(true);
      timer.current = setTimeout(() => stop('Runtime loading timed out. Check your connection and try again.'), 90000);
      try {
        const runtime = await loadRuntimeAssets(language);
        if (runId.current !== id) return;
        frame.current?.contentWindow?.postMessage({ type: 'run', language, code, stdin, runId: id, ...runtime }, '*');
      } catch (error) {
        if (runId.current !== id) return;
        clearTimeout(timer.current); runId.current = ''; setRunning(false); setLoading(false);
        setOutput(error instanceof Error && error.name !== 'TimeoutError' ? error.message : 'The runtime download timed out. Check your connection and try again.');
      }
    }
  }
  return <div className="learning-practice">
    <div className="learning-panel-toolbar"><strong className="text-sm">{language.toUpperCase()} practice</strong><div className="flex gap-1"><button className="learn-button" disabled={running || !supported || (!isPreview && !ready)} onClick={run}><Play size={15} />Run</button><button className="learn-button" disabled={!running} onClick={() => stop()} aria-label="Stop code"><Square size={15} /></button><button className="learn-button" disabled={running} aria-label="Reset code" onClick={() => { if (window.confirm('Reset your code to the lesson example?')) { setCode(starterCode); setStdin(''); setPreview(''); setOutput('Editor reset.'); } }}><RotateCcw size={15} /></button></div></div>
    {!supported && <p className="p-4 text-sm" role="status">The {language} runtime is not connected in this local build yet. You can edit code, but execution is unavailable.</p>}
    <div className="learning-editor-slot"><CodeEditor language={language} code={code} onChange={setCode} /></div>
    {language === 'javascript' && <div className="border-t border-[var(--border)] p-4 text-xs"><label className="flex min-h-12 items-center gap-3 font-semibold"><input type="checkbox" checked={domPreview} onChange={event => { stop('Practice mode changed. Select Run to start.'); setReady(false); setDOMPreview(event.target.checked); }} />Interactive DOM preview</label>{domPreview && <p>Use document.querySelector, createElement and event listeners. The sample has #demo and #button. Set document.body.innerHTML in your code to build a custom page. Network requests, navigation, external scripts and browser storage are unavailable. This worker-based DOM does not implement every browser API.</p>}</div>}
    {(language === 'python' || language === 'php') && <label className="block border-t border-[var(--border)] p-4 text-xs font-semibold">{language === 'python' ? 'Standard input: one line per input() call' : 'Request body: read with file_get_contents("php://input")'}<textarea value={stdin} disabled={running} maxLength={10000} onChange={event => setStdin(event.target.value)} rows={3} className="mt-2 block w-full resize-y rounded-md border border-[var(--border)] bg-[var(--bg-card)] p-3 font-mono text-sm font-normal" /></label>}
    {loading && <p className="p-4 text-xs" role="status">Preparing {language} in your browser. The first run downloads the interpreter.</p>}
    <section className="learning-output" aria-label="Code output"><h3 className="px-4 py-2 text-xs font-semibold">{language === 'html' || language === 'css' ? 'Preview' : 'Output'}</h3>{language === 'html' || language === 'css' ? <iframe title="Sandboxed page preview" sandbox="" srcDoc={preview} style={{ backgroundColor: '#fff', colorScheme: 'light' }} className="h-64 w-full border-0" /> : <pre className="whitespace-pre-wrap break-words px-4 pb-4 text-sm" role="status">{running && !output ? 'Running...' : output}</pre>}</section>
    {!isPreview && mounted && <iframe key={`${language}:${domPreview}`} ref={frame} title={`${language} execution sandbox`} sandbox="allow-scripts" src={language === 'javascript' ? domPreview ? '/learning-dom-frame.html' : '/learning-javascript-frame.html' : '/learning-wasm-frame.html'} onLoad={() => setReady(true)} className={language === 'javascript' && domPreview ? 'h-72 w-full shrink-0 border-0 bg-white' : 'hidden'} />}
    <p className="p-4 text-xs text-[var(--text-muted)]">{language === 'javascript' && domPreview ? 'DOM practice runs in an isolated worker. An unresponsive worker stops after 10 seconds; interactive sessions end after 10 minutes.' : 'Practice runs in your browser with a 10-second execution limit.'} Network requests and persistent files are unavailable.</p>
  </div>;
}
