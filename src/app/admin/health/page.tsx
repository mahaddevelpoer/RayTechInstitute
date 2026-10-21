'use client';
import { useEffect, useRef, useState } from 'react';
import { auth } from '@/lib/firebase';
import { learningAdminRequest } from '@/lib/learning/admin';
import { MANUAL_REVIEW_ITEMS, parseManualReviews } from '@/lib/learning/health';
import { BrowserPractice } from '@/components/learning/BrowserPractice';
import { LessonVideo } from '@/components/learning/LessonVideo';
import { lectureSnapshot } from '@/data/lectureSnapshot';
import type { HealthCheck } from '@/types/learning-health';
import type { BrowserRuntime } from '@/types/learning';

const statusText = { ok: 'Passed this check', error: 'Failed', attention: 'Needs attention', 'not-tested': 'Not tested' };
const samples: Record<BrowserRuntime, string> = {
  html: '<h1>Browser preview</h1>\n<p>RayTech practice is ready.</p>',
  css: 'h1 { color: #0f766e; }\np { font-size: 20px; }',
  javascript: 'console.log("RAYTECH_PRACTICE_OK");\nawait new Promise(resolve => setTimeout(resolve, 100));\nconsole.log("ASYNC_OK");',
  python: 'for number in range(3):\n    print("RAYTECH_PRACTICE_OK", number)',
  php: '<?php\nfor ($number = 0; $number < 3; $number++) {\n    echo "RAYTECH_PRACTICE_OK $number\\n";\n}',
};
interface Deployment { builtAt: string; revision: string | null; siteOrigin: string; indexablePages: number; sitemapSha256: string; learning: { courses: number; languages: number; topics: number }; workflowUrl: string | null }
export default function HealthPage() {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [error, setError] = useState('');
  const [checkedAt, setCheckedAt] = useState('');
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [publicStatus, setPublicStatus] = useState('Not checked');
  const [reviews, setReviews] = useState<Record<string, string>>({});
  const [storageKey, setStorageKey] = useState('');
  const [storageNotice, setStorageNotice] = useState('');
  const [language, setLanguage] = useState<BrowserRuntime>('javascript');
  const [videoId, setVideoId] = useState(lectureSnapshot[0]?.videoId || '');
  const video = lectureSnapshot.find(item => item.videoId === videoId);
  useEffect(() => {
    if (!deployment || !auth.currentUser) return;
    const key = `raytech_health_review_v1:${auth.currentUser.uid}:${deployment.builtAt}`;
    setStorageKey(key);
    try { setReviews(parseManualReviews(localStorage.getItem(key) || '{}')); }
    catch { setStorageNotice('Checklist storage is unavailable. Reviews will last only in this session.'); }
  }, [deployment]);
  function mark(id: string, checked: boolean) {
    const next = { ...reviews }; if (checked) next[id] = new Date().toISOString(); else delete next[id];
    setReviews(next);
    if (storageKey) try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { setStorageNotice('Checklist changes could not be stored on this device.'); }
  }
  async function runChecks() {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError('');
    try {
      const report = await learningAdminRequest('learning_health');
      if (!Array.isArray(report.checks) || report.checks.some((item: any) => typeof item.id !== 'string' || typeof item.label !== 'string' || typeof item.detail !== 'string' || !Object.hasOwn(statusText, item.status))) throw new Error('The server did not return a valid health report.');
      setChecks(report.checks); setCheckedAt(report.checkedAt);
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Health checks could not be reached.'); }
    finally { inFlight.current = false; setBusy(false); }
  }
  async function checkPublicExport() {
    setDeployment(null); setStorageKey(''); setReviews({});
    setPublicStatus('Checking the deployed export...');
    try {
      const [manifestResponse, sitemapResponse] = await Promise.all(['/deployment.json', '/sitemap.xml'].map(url => fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) })));
      if (!manifestResponse.ok || !sitemapResponse.ok) throw new Error();
      const manifest = await manifestResponse.json(); const xml = await sitemapResponse.text();
      if (manifest.schema !== 1 || !Number.isFinite(Date.parse(manifest.builtAt)) || !Number.isSafeInteger(manifest.indexablePages) || !manifest.learning || !['courses', 'languages', 'topics'].every(key => Number.isSafeInteger(manifest.learning[key]) && manifest.learning[key] >= 0) || typeof manifest.siteOrigin !== 'string') throw new Error();
      const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(xml)))).map(byte => byte.toString(16).padStart(2, '0')).join('');
      const document = new DOMParser().parseFromString(xml, 'application/xml');
      const urls = Array.from(document.getElementsByTagName('loc')).map(node => node.textContent || '');
      if (document.querySelector('parsererror') || digest !== manifest.sitemapSha256 || urls.length !== manifest.indexablePages || new Set(urls).size !== urls.length || urls.some(url => new URL(url).origin !== manifest.siteOrigin)) throw new Error();
      setDeployment(manifest);
      setPublicStatus(`Export manifest and sitemap agree on ${urls.length} indexable pages. Individual page content and visual behavior still need review.`);
    } catch { setPublicStatus('The export manifest or sitemap is missing, unavailable or inconsistent. No successful export check was recorded.'); }
  }
  return <div className="space-y-8">
    <header><h1 className="text-2xl font-bold">Health checks and release review</h1><p className="mt-3 max-w-3xl text-sm text-[var(--text-sub)]">Run targeted checks and review the actual learning flow. A successful read or valid key does not prove that publishing, grading or every user action works.</p></header>
    <section className="space-y-4 rounded-md border border-[var(--border)] bg-[var(--bg-card)] p-5"><h2 className="text-xl font-semibold">Server services</h2><button className="learn-button" disabled={busy} onClick={runChecks}>{busy ? 'Checking services...' : 'Run read-only service checks'}</button><p className="text-xs">Checks read table access, provider metadata, channel uploads and the student endpoint. They do not modify content or generate AI responses. Recent reports may be cached for 30 seconds.</p>{checkedAt && <p className="text-xs">Report time: {new Date(checkedAt).toLocaleString()}</p>}{error && <p role="alert" className="text-sm">{error}</p>}<div aria-live="polite" className="divide-y divide-[var(--border)]">{checks.map(check => <article key={check.id} className="py-4"><div className="flex flex-wrap justify-between gap-3"><h3 className="font-semibold">{check.label}</h3><strong className={check.status === 'error' ? 'text-red-700 dark:text-red-300' : check.status === 'ok' ? 'text-emerald-700 dark:text-emerald-300' : 'text-[var(--text-sub)]'}>{statusText[check.status]}</strong></div><p className="mt-2 text-sm">{check.detail}</p><p className="mt-2 text-xs text-[var(--text-muted)]">{check.checkedAt ? new Date(check.checkedAt).toLocaleString() : 'No timestamp'} · {check.durationMs} ms</p></article>)}</div></section>
    <section className="space-y-4 rounded-md border border-[var(--border)] bg-[var(--bg-card)] p-5"><h2 className="text-xl font-semibold">Public static export</h2><button className="learn-button" onClick={checkPublicExport}>Check this site's export</button><p role="status" className="text-sm">{publicStatus}</p>{deployment && <dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="font-semibold">Exported at</dt><dd>{new Date(deployment.builtAt).toLocaleString()}</dd></div><div><dt className="font-semibold">Published learning catalog</dt><dd>{deployment.learning.courses} courses, {deployment.learning.languages} languages, {deployment.learning.topics} topics</dd></div><div className="min-w-0"><dt className="font-semibold">Source revision</dt><dd className="break-all">{deployment.revision || 'Local build; no CI revision recorded'}</dd></div></dl>}</section>
    <section className="space-y-4 rounded-md border border-[var(--border)] bg-[var(--bg-card)] p-5"><h2 className="text-xl font-semibold">Compiler practice checks</h2><label className="block text-sm font-semibold">Language<select value={language} onChange={event => setLanguage(event.target.value as BrowserRuntime)} className="ml-3 min-h-12 rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3">{Object.keys(samples).map(value => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select></label><p className="text-sm">Run the sample. JavaScript should print both markers; Python/PHP should print the practice marker three times. HTML/CSS should render the preview. Also test errors, input, Stop and Reset before marking the compiler review complete.</p><div className="max-w-3xl overflow-hidden rounded-md border border-[var(--border)]"><BrowserPractice key={language} language={language} starterCode={samples[language]} /></div></section>
    <section className="space-y-4 rounded-md border border-[var(--border)] bg-[var(--bg-card)] p-5"><h2 className="text-xl font-semibold">Manual release checklist</h2><p className="text-sm">These are your review notes, not automated test results. {Object.keys(reviews).length} of {MANUAL_REVIEW_ITEMS.length} reviewed on this device. Entries are tied to your account and this export's timestamp.</p>{!deployment && <p className="text-xs">Check the public export first to save this checklist against a specific build. Until then, changes last only in this session.</p>}{storageNotice && <p role="status" className="text-xs">{storageNotice}</p>}<ul className="divide-y divide-[var(--border)]">{MANUAL_REVIEW_ITEMS.map(item => <li key={item.id}><label className="flex min-h-12 cursor-pointer items-start gap-3 py-4"><input type="checkbox" className="mt-1" checked={!!reviews[item.id]} onChange={event => mark(item.id, event.target.checked)} /><span><strong>{item.title}</strong><span className="mt-2 block text-sm">{item.detail}</span>{reviews[item.id] && <span className="mt-2 block text-xs">Reviewed by you: {new Date(reviews[item.id]).toLocaleString()}</span>}</span></label></li>)}</ul></section>
    <section className="space-y-4 rounded-md border border-[var(--border)] bg-[var(--bg-card)] p-5">
      <h2 className="text-xl font-semibold">Lesson video playback check</h2>
      <p className="text-sm">Select an existing RayTech lecture and load its player. Check play/pause, seeking, speed, volume, captions, full screen and the direct link before marking the video review complete.</p>
      <label className="block text-sm font-semibold">Lecture<select value={videoId} onChange={event => setVideoId(event.target.value)} className="mt-2 block min-h-12 w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3">{lectureSnapshot.map(item => <option key={item.videoId} value={item.videoId}>{item.title}</option>)}</select></label>
      {video ? <div className="max-w-3xl"><LessonVideo key={video.videoId} videoId={video.videoId} title={video.title} /></div> : <p>No static lecture is available to preview.</p>}
    </section>
  </div>;
}
