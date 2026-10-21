'use client';
import { useEffect, useId, useRef, useState, type RefObject, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { Square, Settings2, X } from 'lucide-react';
import { codiLineAt } from '@/lib/learning/codi-line';
import { codiCloudReading, codiCloudExplain } from '@/lib/learning/codi-cloud';
import { codiDockPoint, clampCodiPosition, codiSettingsPosition, codiSpeechChunks, findCodiExplanation, type CodiLessonSource, type CodiExplanation } from '@/lib/learning/codi-tutor';
const CodiRobot = dynamic(() => import('./CodiRobot').then(module => module.CodiRobot), { ssr: false, loading: () => <span>Loading Codi...</span> });

export function CodiReader({ content, compiler, runSignal = 0, fullText, languageSlug, currentLesson }: {
  content: RefObject<HTMLElement>; compiler?: RefObject<HTMLElement>; runSignal?: number; fullText?: string; languageSlug?: string; currentLesson?: CodiLessonSource;
}) {
  const [enabled, setEnabled] = useState(false); const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [engine, setEngine] = useState<'gemini' | 'device'>('gemini'); const [mounted, setMounted] = useState(false); const [settingsOpen, setSettingsOpen] = useState(false);
  const [deviceFallback, setDeviceFallback] = useState(true); const cloudRetryAt = useRef(0);
  const settingsId = useId(); const settingsButton = useRef<HTMLButtonElement>(null); const settingsPanel = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(''); const [translation, setTranslation] = useState(''); const [status, setStatus] = useState('Click Codi to read the lesson, or click a lesson line.');
  const [speaking, setSpeaking] = useState(false); const [busy, setBusy] = useState(false); const [prepared, setPrepared] = useState(false); const [finding, setFinding] = useState(false);
  const [source, setSource] = useState<CodiExplanation | null>(null); const [dock, setDock] = useState<'lesson' | 'compiler' | 'free'>('lesson'); const [flying, setFlying] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 1024, height: 768, ready: false });
  const carrier = useRef<HTMLDivElement>(null); const flight = useRef<Animation>(); const previous = useRef({ x: 0, y: 0, ready: false, dock: 'lesson' });
  const manual = useRef(false); const suppressClick = useRef(false);
  const drag = useRef<{ id: number; startX: number; startY: number; x: number; y: number; moved: boolean }>();
  const audio = useRef<HTMLAudioElement>(); const context = useRef<AudioContext>(); const url = useRef(''); const request = useRef(''); const active = useRef(false); const voice = useRef<AbortController>();
  const queue = useRef<string[]>([]); const total = useRef(0); const pending = useRef(''); const interaction = useRef(0); const lookup = useRef<AbortController>(); const sources = useRef<CodiLessonSource[]>();
  const pendingMarkdown = useRef(false);
  const nextChunk = useRef<(text: string) => Promise<void>>();
  const deviceUtterance = useRef<SpeechSynthesisUtterance>();
  function viewport() {
    return { width: Math.min(window.innerWidth, window.visualViewport?.width || window.innerWidth), height: Math.min(window.innerHeight, window.visualViewport?.height || window.innerHeight) };
  }
  function placeFloating(x: number, y: number, commit = false) {
    const size = viewport(); const point = clampCodiPosition({ x, y }, size);
    previous.current = { ...point, ready: true, dock: 'free' };
    if (carrier.current) carrier.current.style.transform = `translate3d(${point.x}px,${point.y}px,0)`;
    if (commit) setPosition({ ...point, ...size, ready: true });
  }
  function startDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || event.isPrimary === false) return;
    suppressClick.current = false;
    const rect = carrier.current?.getBoundingClientRect(); if (!rect) return;
    drag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x: rect.left, y: rect.top, moved: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function moveDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const start = drag.current; if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.startX; const dy = event.clientY - start.startY;
    if (!start.moved && Math.hypot(dx, dy) < 5) return;
    if (!start.moved) {
      start.moved = true; manual.current = true; suppressClick.current = true; flight.current?.cancel(); setFlying(false); setSettingsOpen(false); setDock('free');
      carrier.current?.setAttribute('data-dragging', 'true');
    }
    event.preventDefault(); placeFloating(start.x + dx, start.y + dy);
  }
  function endDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const start = drag.current; if (!start || start.id !== event.pointerId) return;
    drag.current = undefined;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    carrier.current?.removeAttribute('data-dragging');
    if (start.moved) { event.preventDefault(); placeFloating(previous.current.x, previous.current.y, true); }
  }
  function moveWithKeyboard(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') suppressClick.current = false;
    const step = event.shiftKey ? 24 : 8;
    const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (!delta[event.key]) return;
    event.preventDefault(); manual.current = true; flight.current?.cancel(); setFlying(false); setDock('free'); setSettingsOpen(false);
    placeFloating(previous.current.x + delta[event.key][0], previous.current.y + delta[event.key][1], true);
  }
  function stop(_terminate = true, clearQueue = true) {
    request.current = ''; audio.current?.pause(); audio.current = undefined;
    if (url.current) URL.revokeObjectURL(url.current); url.current = '';
    voice.current?.abort(); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); deviceUtterance.current = undefined;
    if (clearQueue) { queue.current = []; pending.current = ''; interaction.current++; lookup.current?.abort(); setFinding(false); }
    active.current = false; setSpeaking(false); setBusy(false); setPrepared(false);
  }
  async function readChunk(text: string) {
    stop(active.current, false); setSelected(text); setTranslation(''); setBusy(true); active.current = true;
    const id = crypto.randomUUID(); request.current = id; const part = `${total.current - queue.current.length}/${total.current}`;
    try {
      const following = () => { if (request.current !== id) return; stop(false, false); const next = queue.current.shift(); if (next) void nextChunk.current?.(next); else setStatus('Finished. Click a line, highlight text, or click Codi to read the lesson again.'); };
      const speakDevice = (fallback = false) => {
        if (!('speechSynthesis' in window)) throw new Error('Device voice is unavailable in this browser.');
        if (language === 'hi') throw new Error('Hindi translation requires Gemini voice. Device voice reads English text only.');
        const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-US'; utterance.rate = .94;
        deviceUtterance.current = utterance;
        utterance.onstart = () => { if (request.current === id) { active.current = false; setBusy(false); setSpeaking(true); setStatus(`${fallback ? 'Gemini is unavailable. ' : ''}Reading with device voice. Part ${part}.`); } };
        utterance.onend = following; utterance.onerror = () => { if (request.current === id) { stop(); setSettingsOpen(true); setStatus('Device voice could not play. Check your browser audio settings.'); } };
        window.speechSynthesis.speak(utterance);
      };
      if (engine === 'device') { speakDevice(); return; }
      if (deviceFallback && language === 'en' && Date.now() < cloudRetryAt.current) { speakDevice(true); return; }
      voice.current = new AbortController(); setStatus(`Preparing Gemini reading or loading saved audio. Part ${part}.`);
      let blob: Blob;
      try { blob = await codiCloudReading(text, language, voice.current.signal); }
      catch (error) {
        if (request.current !== id || voice.current.signal.aborted) return;
        if (deviceFallback && language === 'en' && 'speechSynthesis' in window) { cloudRetryAt.current = Date.now() + 60000; speakDevice(true); return; }
        throw error;
      }
      if (request.current !== id) return;
        active.current = false;
        try {
          url.current = URL.createObjectURL(blob);
          const player = new Audio(url.current); audio.current = player;
          player.onplay = () => { if (request.current === id) { setSpeaking(true); setBusy(false); setPrepared(false); setStatus(`Reading ${language === 'hi' ? 'the Hindi translation' : 'the lesson'}. Part ${part}.`); } };
          player.onended = following;
          player.onerror = () => { if (request.current === id) { stop(); setSettingsOpen(true); setStatus('Audio playback failed. Select the line again to retry.'); } };
          await player.play().catch(() => { if (request.current === id) { setBusy(false); setPrepared(true); setSettingsOpen(true); setStatus('Your browser requires a tap. Press Play audio to hear the selected text.'); } });
        } catch { if (request.current === id) { stop(); setStatus('This part could not play. Try a shorter selection.'); } }
    } catch (error) { if (request.current === id) { stop(); setSettingsOpen(true); setStatus(error instanceof Error ? error.message.slice(0, 250) : 'Speech is unavailable. The lesson remains readable.'); } }
  }
  nextChunk.current = readChunk;
  function beginReading(text: string, markdown = false) {
    const chunks = codiSpeechChunks(text, markdown ? 'markdown' : 'text'); stop(active.current);
    if (!chunks.length) { setSettingsOpen(true); setStatus('There is no readable lesson text in this selection.'); return; }
    total.current = chunks.length; queue.current = chunks; void readChunk(queue.current.shift()!);
  }
  function requestReading(text: string, markdown = false) {
    if (!manual.current) setDock('lesson');
    if (engine === 'gemini' && !enabled) { pending.current = text; pendingMarkdown.current = markdown; setSelected(codiSpeechChunks(text, markdown ? 'markdown' : 'text')[0] || ''); setSettingsOpen(true); setStatus('Allow Gemini voice to read your selected text. It will start when you allow it.'); return; }
    beginReading(text, markdown);
  }
  async function explain(text: string) {
    stop(); const id = interaction.current; if (!manual.current) setDock('lesson'); setFinding(true); setStatus('Looking for an explanation in the published lessons...'); lookup.current = new AbortController();
    if (engine === 'gemini' && !enabled) { setFinding(false); setSettingsOpen(true); setStatus('Allow Gemini voice, or choose Device voice.'); return; }
    try {
      if (engine === 'gemini') { context.current ||= new AudioContext(); await context.current.resume(); if (context.current.state !== 'running') throw new Error('Click the selected text again to allow browser audio.'); }
      if (id !== interaction.current) return;
      let available = currentLesson ? [currentLesson] : [];
      if (languageSlug && /^[a-z0-9-]+$/.test(languageSlug)) {
        if (!sources.current) {
          const response = await fetch(`/codi/lessons/${languageSlug}.json`, { credentials: 'omit', signal: lookup.current.signal });
          if (!response.ok) throw new Error('Lesson index unavailable');
          const body = await response.text(); if (body.length > 4000000) throw new Error('Lesson index is too large');
          const data: unknown = JSON.parse(body);
          if (!Array.isArray(data) || data.length > 250 || !data.every(item => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.content === 'string' && typeof item.order === 'number' && typeof item.slug === 'string' && /^[a-z0-9-]+$/.test(item.slug))) throw new Error('Invalid lesson index');
          sources.current = data;
        }
        available = sources.current!;
      }
      if (id !== interaction.current) return;
      const result = currentLesson && findCodiExplanation(text, available, currentLesson.id); setFinding(false);
      if (!result) { setSource(null); setStatus('No matching published explanation was found. Select a more specific phrase.'); return; }
      setSource(result);
      if (engine === 'device') { requestReading(result.text); return; }
      voice.current = new AbortController(); setBusy(true); setTranslation(''); setStatus('Connecting Gemini Live to the published lesson source...');
      await codiCloudExplain(text, `${result.title}\n${result.section}\n${result.text}`, language, context.current!, voice.current.signal,
        () => { if (id === interaction.current) { setBusy(false); setSpeaking(true); setStatus('Codi is explaining from the published source.'); } },
        value => { if (id === interaction.current) setTranslation(value); });
      if (id === interaction.current) { setBusy(false); setSpeaking(false); setStatus('Explanation complete. AI can make mistakes; check the linked lesson source.'); }
    } catch (error) { if (id === interaction.current) { stop(); setSettingsOpen(true); setStatus(error instanceof Error ? error.message.slice(0, 250) : 'Voice explanation is unavailable.'); } }
  }
  const readRef = useRef(requestReading); readRef.current = requestReading; const explainRef = useRef(explain); explainRef.current = explain;
  useEffect(() => {
    const root = content.current; if (!root) return;
    const selection = () => { const value = window.getSelection(); if (!value?.rangeCount || value.isCollapsed) return ''; const range = value.getRangeAt(0); return root.contains(range.startContainer) && root.contains(range.endContainer) ? value.toString().trim() : ''; };
    const click = (event: MouseEvent) => { if (selection()) return; const line = codiLineAt(root, event.target, event.clientY); if (line) { setSource(null); readRef.current(line); } };
    const highlight = () => { const text = selection(); if (text.length >= 2 && text.length <= 2000) void explainRef.current(text); };
    const keyboard = (event: KeyboardEvent) => { if (event.altKey && event.key === 'Enter') { const text = selection(); if (text) { event.preventDefault(); void explainRef.current(text); } } };
    root.addEventListener('click', click); root.addEventListener('mouseup', highlight); root.addEventListener('touchend', highlight); root.addEventListener('keydown', keyboard);
    return () => { root.removeEventListener('click', click); root.removeEventListener('mouseup', highlight); root.removeEventListener('touchend', highlight); root.removeEventListener('keydown', keyboard); };
  }, [content]);
  useEffect(() => { try { setEnabled(window.sessionStorage.getItem('codi-cloud-consent-v1') === 'yes'); } catch {} setMounted(true); }, []);
  useEffect(() => {
    if (runSignal > 0) { manual.current = false; drag.current = undefined; carrier.current?.removeAttribute('data-dragging'); setSettingsOpen(false); setDock('compiler'); }
  }, [runSignal]);
  useEffect(() => {
    const update = () => {
      const size = viewport(); const old = previous.current;
      if (manual.current || dock === 'free') { placeFloating(old.x, old.y, true); return; }
      let element = dock === 'compiler' ? compiler?.current : content.current;
      if (!element?.getBoundingClientRect().width) element = content.current?.getBoundingClientRect().width ? content.current : compiler?.current;
      if (!element) { setPosition(value => ({ ...value, ready: false })); return; }
      const point = codiDockPoint(element.getBoundingClientRect(), size);
      if (old.ready && old.x === point.x && old.y === point.y && old.dock === dock) { setPosition(value => value.width === size.width && value.height === size.height ? value : { ...value, ...size }); return; }
      flight.current?.cancel(); setFlying(false);
      if (old.ready && old.dock !== dock && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && carrier.current?.animate) {
        setFlying(true);
        flight.current = carrier.current.animate([{ transform: `translate3d(${old.x}px,${old.y}px,0)` }, { transform: `translate3d(${(old.x + point.x) / 2}px,${Math.max(0, Math.min(old.y, point.y) - 70)}px,0)`, offset: .5 }, { transform: `translate3d(${point.x}px,${point.y}px,0)` }], { duration: 850, easing: 'cubic-bezier(.35,0,.2,1)' });
        flight.current.onfinish = () => setFlying(false);
      }
      previous.current = { ...point, ready: true, dock }; setPosition({ ...point, ...size, ready: true });
    };
    const observer = new ResizeObserver(update); if (content.current) observer.observe(content.current); if (compiler?.current) observer.observe(compiler.current);
    window.addEventListener('resize', update); window.visualViewport?.addEventListener('resize', update); update();
    return () => { observer.disconnect(); window.removeEventListener('resize', update); window.visualViewport?.removeEventListener('resize', update); flight.current?.cancel(); };
  }, [dock, runSignal, content, compiler]);
  useEffect(() => {
    if (!settingsOpen) return;
    settingsPanel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const close = () => { setSettingsOpen(false); settingsButton.current?.focus(); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); close(); } };
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !settingsPanel.current?.contains(event.target) && !carrier.current?.contains(event.target)) setSettingsOpen(false); };
    document.addEventListener('keydown', keyboard); document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', keyboard); document.removeEventListener('pointerdown', outside); };
  }, [settingsOpen]);
  useEffect(() => { if (prepared) setSettingsOpen(true); }, [prepared]);
  useEffect(() => () => { interaction.current++; lookup.current?.abort(); request.current = ''; voice.current?.abort(); audio.current?.pause(); flight.current?.cancel(); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); void context.current?.close().catch(() => {}); if (url.current) URL.revokeObjectURL(url.current); }, []);
  const panelPosition = codiSettingsPosition(position, position);
  const controls = <section ref={settingsPanel} id={settingsId} className="codi-settings" data-codi-ignore role="dialog" aria-modal="false" aria-label="Codi settings" style={panelPosition}>
    <header><strong>Codi settings</strong><button className="codi-icon-button" aria-label="Close Codi settings" onClick={() => { setSettingsOpen(false); settingsButton.current?.focus(); }}><X size={18} /></button></header>
    <div className="codi-toolbar"><strong>Codi tutor</strong>
      <label>Voice<select value={engine} onChange={event => { stop(); setEngine(event.target.value as 'gemini' | 'device'); setStatus('Voice changed. Click a lesson line.'); }}><option value="gemini">Gemini cloud</option><option value="device">Device voice</option></select></label>
      <label>Language<select value={language} onChange={event => { stop(); setLanguage(event.target.value as 'en' | 'hi'); }}><option value="en">English</option><option value="hi">Hindi translation</option></select></label>
      <button className="learn-button" disabled={!busy && !speaking && !prepared && !finding} onClick={() => { stop(); setStatus('Stopped.'); }}><Square size={14} />Stop</button>
      {prepared && <button className="learn-button" onClick={() => void audio.current?.play().catch(() => setStatus('Allow browser audio, then press Play again.'))}>Play audio</button>}
    </div>
    {engine === 'gemini' && <label className="codi-consent"><input type="checkbox" checked={enabled} onChange={event => { const text = pending.current; const markdown = pendingMarkdown.current; const allowed = event.target.checked; stop(); setEnabled(allowed); try { if (allowed) window.sessionStorage.setItem('codi-cloud-consent-v1', 'yes'); else window.sessionStorage.removeItem('codi-cloud-consent-v1'); } catch {} setStatus(allowed ? 'Voice allowed for this tab. Click a lesson line to read it.' : 'Cloud voice is off.'); if (allowed && text) beginReading(text, markdown); }} />Allow Gemini voice for this tab: selected lesson text goes to Google. Free-tier data may improve its products. No sign-in needed. <a href="/privacy-policy/">Privacy</a></label>}
    {engine === 'gemini' && <label className="codi-consent"><input type="checkbox" checked={deviceFallback} onChange={event => { stop(); setDeviceFallback(event.target.checked); }} />Use device voice for English if Gemini is unavailable. Your browser or operating system provides this voice.</label>}
    {selected && <p className="codi-selected-text"><strong>Selected text</strong><code>{selected}</code></p>}
    <p role="status" className="codi-status">{status}</p>
    {(source || translation) && <details className="codi-source"><summary>Explanation transcript and lesson source</summary>{translation && <p lang={language}>{translation}</p>}{source && <><p>{source.relation === 'current' ? 'This lesson' : source.relation === 'previous' ? 'Earlier lesson' : 'Upcoming lesson'}: {source.section}</p><a href={languageSlug ? `/learn/${languageSlug}/${source.slug}/` : '#'}>Read {source.title}</a></>}</details>}
  </section>;
  return mounted ? createPortal(<aside className="codi-reader" data-codi-ignore aria-label="Codi robot tutor">
    {settingsOpen && controls}
    {!settingsOpen && <p className="sr-only" role="status">{status}</p>}
    <span id={`${settingsId}-drag-hint`} className="sr-only">Click to read the lesson. Drag Codi to move it, or focus Codi and use the arrow keys. Hold Shift for larger steps.</span>
    <div ref={carrier} className="codi-carrier" data-dock={dock} data-flying={flying} style={{ transform: `translate3d(${position.x}px,${position.y}px,0)`, visibility: position.ready ? 'visible' : 'hidden' }}>
      <button ref={settingsButton} className="codi-icon-button codi-settings-toggle" aria-label="Codi settings" aria-expanded={settingsOpen} aria-controls={settingsId} onClick={() => setSettingsOpen(value => !value)}><Settings2 size={17} /></button>
      <button className="codi-robot-button" aria-label="Codi: read the entire lesson" aria-describedby={`${settingsId}-drag-hint`} title="Click to read. Drag to move Codi." onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onKeyDown={moveWithKeyboard} onClick={event => { if (suppressClick.current) { event.preventDefault(); suppressClick.current = false; return; } setSource(null); requestReading(fullText || currentLesson?.content || '', true); }}><CodiRobot speaking={speaking} flying={flying} /></button>
      {(busy || finding || speaking || prepared) && <span className="codi-activity" aria-hidden="true">{prepared ? 'Tap settings to play' : speaking ? 'Reading' : 'Preparing voice...'}</span>}
      {flying && <span className="codi-thrust" aria-hidden="true" />}
    </div>
  </aside>, document.body) : null;
}
