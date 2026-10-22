'use client';

import { useEffect, useRef, useState } from 'react';
import { BookOpen, Plus, RefreshCw, Save, Send, Trash2 } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { learningAdminRequest, learningGenerateStream, newLearningTopic, type LearningAdminCatalog, type LearningAiSetting, type RegistryEntry } from '@/lib/learning/admin';
import { validateTopicPublication } from '@/lib/learning/curriculum';
import type { LearningTopic } from '@/types/learning';
import { lessonQualityIssues, lessonWordCount } from '@/lib/learning/lesson-quality';

const input = 'w-full min-h-12 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:bg-slate-100';
const button = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-slate-100';
const lines = (value: string) => value.split('\n').map(s => s.trim()).filter(Boolean);
const generationLabels: Record<string, string> = { topic: 'Writing lesson', content: 'Improving lesson content', questions: 'Checking questions and assignment' };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-2 text-sm font-medium text-slate-700"><span>{label}</span>{children}</label>;
}

export default function CoursesAdmin() {
  const [catalog, setCatalog] = useState<LearningAdminCatalog>({ topics: [], languages: [], courses: [] });
  const [languageId, setLanguageId] = useState('');
  const [topic, setTopic] = useState<LearningTopic | null>(null);
  const [tab, setTab] = useState('Lesson');
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [aiSetting, setAiSetting] = useState<LearningAiSetting | null>(null);
  const [aiSettingBusy, setAiSettingBusy] = useState(false);
  const [generationCount, setGenerationCount] = useState(2);
  const [bankCount, setBankCount] = useState(20);
  const [generatedTestSize, setGeneratedTestSize] = useState(10);
  const [generationLive, setGenerationLive] = useState('');
  const [generationStage, setGenerationStage] = useState('');
  const generationAbort = useRef<AbortController | null>(null);
  useEffect(() => () => generationAbort.current?.abort(), []);
  const [videos, setVideos] = useState<{ id: string; title: string; publishedAt: string }[]>([]);
  const [nextVideoPage, setNextVideoPage] = useState('');
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [topicSearch,setTopicSearch]=useState('');

  async function reload(selectedId?: string) {
    const data:LearningAdminCatalog=await learningAdminRequest('learning_catalog');
    setCatalog(data);
    try { const control=await learningAdminRequest('learning_ai_settings');setAiSetting(control.settings); } catch { setAiSetting(null); }
    setLanguageId(current => current || data.languages[0]?.id || '');
    if (selectedId) { const entry = data.topics.find(e => e.topic.id === selectedId); setTopic(entry ? structuredClone(entry.draft || entry.topic) : null); if(entry)setLanguageId(entry.topic.languageId); }
  }
  useEffect(() => {
    let alive = true;
    learningAdminRequest('learning_ai_settings').then(data => { if (alive) setAiSetting(data.settings); }).catch(e => { if (alive) setError(e.message); });
    learningAdminRequest('learning_catalog').then((data: LearningAdminCatalog) => {
      if (!alive) return; setCatalog(data); setLanguageId(data.languages[0]?.id || '');
    }).catch(e => { if (alive) setError(e.message); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const guard = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', guard); return () => window.removeEventListener('beforeunload', guard);
  }, [dirty]);
  const leaveEditor = () => !dirty || window.confirm('Discard your unsaved edits?');
  const edit = (patch: Partial<LearningTopic>) => { setTopic(current => current ? { ...current, ...patch } : null); setDirty(true); };
  const entry = catalog.topics.find(e => e.topic.id === topic?.id);
  const peers = catalog.topics.filter(e => e.topic.languageId === languageId).sort((a, b) => a.topic.order - b.topic.order);
  const visiblePeers=peers.filter(e=>`${e.topic.order} ${e.topic.title}`.toLowerCase().includes(topicSearch.toLowerCase()));
  const issues = topic ? [...validateTopicPublication(topic, catalog.topics.map(e => e.topic)), ...lessonQualityIssues(topic.content)] : [];
  const latestDraft = peers.filter(e => e.draft || e.topic.state === 'draft').sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
  function removeDraft(target: typeof latestDraft) {
    if (!target || busy || !leaveEditor()) return;
    const pending = target.topic.state === 'published';
    if (!window.confirm(pending ? `Discard the saved draft changes for "${target.topic.title}"? The published lesson stays unchanged.` : `Delete the draft "${target.topic.title}"? This does not delete any published lesson.`)) return;
    void perform(pending ? 'learning_discard_draft' : 'learning_delete', { id: target.topic.id, expectedUpdatedAt: target.updatedAt }, topic?.id);
  }

  async function perform(action: string, payload: Record<string, unknown>, selectedId?: string) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await learningAdminRequest(action, payload);
      setNotice(result.message || 'Saved.'); setDirty(false);
      await reload(selectedId);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save.'); }
    finally { setBusy(false); }
  }
  function visibility(item: RegistryEntry, table: string) {
    if (!leaveEditor()) return;
    const state = item.state === 'published' ? 'draft' : 'published';
    if (!window.confirm(`${state === 'published' ? 'Publish' : 'Unpublish'} ${item.title}? Public pages change after the rebuild.`)) return;
    void perform('learning_registry_state', { id: item.id, table, state, expectedUpdatedAt: item.updated_at }, topic?.id);
  }

  async function generateLessons() {
    if (busy || !leaveEditor()) return;
    if (!aiSetting?.enabled || aiSettingBusy) { setError('AI topic generation is off. Switch it on to generate new topics, or create a lesson manually.'); return; }
    if (!Number.isInteger(generationCount) || generationCount < 1 || generationCount > 5 || !Number.isInteger(bankCount) || bankCount < 1 || bankCount > 50 || !Number.isInteger(generatedTestSize) || generatedTestSize < 1 || generatedTestSize > bankCount) { setError('Choose 1-5 topics, 1-50 bank questions, and a test size no larger than the bank.'); return; }
    setBusy(true); setError(''); let completed = 0; let lastId: string | undefined;
    const controller = new AbortController(); generationAbort.current = controller;
    setGenerationLive(''); setGenerationStage('Connecting');
    try {
      for (let i = 0; i < generationCount; i++) {
        setNotice(`Generating topic ${i + 1} of ${generationCount}. ${completed} draft(s) saved. Keep this page open.`);
        const result = await learningGenerateStream({ languageId, questionCount: bankCount, testSize: generatedTestSize }, event => {
          if (event.type === 'stage') { setGenerationStage(generationLabels[event.stage] || event.stage); setGenerationLive(''); }
          else if (event.text) setGenerationLive(current => (current + event.text).slice(-80000));
        }, controller.signal);
        completed++; lastId = result.topicId;
      }
      setNotice(`${completed} draft(s) saved. Review every lesson, question and rubric before publishing.`);
      setGenerationStage('Draft saved');
    } catch (e) {
      setNotice(''); setGenerationStage(controller.signal.aborted ? 'Stopped' : 'Failed');
      setError(`${completed} draft(s) saved. ${controller.signal.aborted ? 'Generation stopped. Reload the catalog to confirm whether a draft was saved.' : e instanceof Error ? e.message : 'Generation failed.'}`);
    }
    finally {
      generationAbort.current = null;
      try { await reload(lastId); if (lastId) { setDirty(false); setTab('Lesson'); } } catch { setError('Reload the catalog to inspect saved drafts.'); }
      setBusy(false);
    }
  }

  async function loadVideos(more = false) {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const result = await learningAdminRequest('learning_videos', { pageToken: more ? nextVideoPage : '' });
      setVideos(previous => more ? [...previous, ...result.videos.filter((v: { id: string }) => !previous.some(p => p.id === v.id))] : result.videos);
      setNextVideoPage(result.nextPageToken); setVideosLoaded(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Videos could not be loaded.'); }
    finally { setBusy(false); }
  }

  return <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-2xl font-bold text-slate-900">Courses &amp; lessons</h1><p className="mt-2 max-w-2xl text-sm text-slate-600">Draft, review and publish learning material. Saving a draft does not change a live lesson.</p></div>
      <button className={button} disabled={busy || loading} onClick={() => { if (leaveEditor()) { setBusy(true); reload(topic?.id).then(() => setDirty(false)).catch(e => setError(e.message)).finally(() => setBusy(false)); } }}><RefreshCw size={16} />Reload catalog</button>
    </header>
    {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">{notice}</p>}
    <section aria-label="AI topic generation setting" className="rounded-lg border border-slate-200 bg-white p-4">
      <label className="flex min-h-12 items-center gap-3 font-semibold"><input type="checkbox" role="switch" className="h-5 w-5 accent-teal-700" checked={aiSetting?.enabled || false} disabled={busy || aiSettingBusy || !aiSetting} onChange={async event => {
        if (!aiSetting || busy || aiSettingBusy) return;
        setAiSettingBusy(true); setError('');
        try { const result = await learningAdminRequest('learning_ai_set_enabled', { enabled: event.target.checked, expectedUpdatedAt: aiSetting.updatedAt }); setAiSetting(result.settings); setNotice(result.message); }
        catch (e) { setError(e instanceof Error ? e.message : 'Unable to update AI generation.'); }
        finally { setAiSettingBusy(false); }
      }} />AI topic generation: {aiSettingBusy ? 'Saving...' : aiSetting ? aiSetting.enabled ? 'On' : 'Off' : 'Checking...'}</label>
      <p className="mt-2 text-sm text-slate-600">Controls AI-generated course topics for every admin. Manual writing, editing, publishing and existing lessons stay available. Turning it off also blocks saving an unfinished AI generation.</p>
    </section>
    {(generationLive || generationAbort.current) && <section aria-label="Live AI response" className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Live AI response: {generationStage}</h2>{generationAbort.current && <button className={button} onClick={() => generationAbort.current?.abort()}>Stop generation</button>}</div>
      <p className="my-2 text-xs text-slate-600">Dots3-Note Preview, with Gemini Flash Lite fallback if unavailable. The active provider appears above. This is unvalidated output, not a saved lesson. Hosting and free allowances still apply.</p>
      <pre tabIndex={0} className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md bg-slate-50 p-3 text-xs text-slate-800">{generationLive || 'Waiting for the first response...'}</pre>
    </section>}
    {loading ? <p role="status">Loading course catalog...</p> : <>
      <details className="rounded-lg border border-slate-200 bg-white p-4"><summary className="min-h-12 cursor-pointer font-semibold">Course and language visibility</summary><p className="mb-4 text-sm text-slate-600">Publish language tracks first, then their course. Lessons have their own review and publish controls below.</p>
        <div className="grid gap-4 md:grid-cols-2">{[['Languages', catalog.languages, 'learning_languages'], ['Courses', catalog.courses, 'learning_courses']].map(([title, items, table]) => <section key={String(title)}><h2 className="mb-2 font-semibold">{String(title)}</h2>{(items as RegistryEntry[]).map(item => <div key={item.id} className="flex items-center justify-between gap-3 border-t border-slate-100 py-2"><span className="text-sm">{item.title}<span className="ml-2 text-slate-500">{item.state}</span></span><button className={button} disabled={busy} onClick={() => visibility(item, String(table))}>{item.state === 'published' ? 'Unpublish' : 'Publish'}</button></div>)}</section>)}</div>
      </details>
      <div className="grid items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
          <Field label="Language"><select className={input} value={languageId} disabled={busy} onChange={e => { if (leaveEditor()) { setLanguageId(e.target.value); setTopic(null); setTopicSearch('');setDirty(false); } }}>{catalog.languages.map(l => <option key={l.id} value={l.id}>{l.title} ({catalog.topics.filter(e=>e.topic.languageId===l.id&&e.topic.state==='published').length} published)</option>)}</select></Field>
          <p role="status" className="text-sm">{peers.length} topics in {catalog.languages.find(l=>l.id===languageId)?.title}. {peers.filter(e=>e.topic.state==='published').length} published.</p>
          <Field label="Find a topic"><input className={input} type="search" value={topicSearch} onChange={e=>setTopicSearch(e.target.value)} placeholder="Topic title or number"/></Field>
          <button className={`${button} w-full`} disabled={busy || !languageId} onClick={() => { if (leaveEditor()) { setTopic(newLearningTopic(languageId, Math.max(0, ...peers.map(e => e.topic.order)) + 1)); setDirty(false); setTab('Lesson'); } }}><Plus size={16} />New topic</button>
          <button className={`${button} w-full text-red-700`} disabled={busy || !latestDraft} onClick={() => removeDraft(latestDraft)}><Trash2 size={16} />Delete latest draft</button>
          {latestDraft && <p className="text-xs text-slate-500">Latest saved draft: {latestDraft.draft?.title || latestDraft.topic.title}. Published content is preserved when discarding a pending revision.</p>}
          <details className="border-y border-slate-200 py-3"><summary className="min-h-12 cursor-pointer text-sm font-semibold">Generate next topics with AI</summary><fieldset disabled={busy || aiSettingBusy || !aiSetting?.enabled} className="space-y-3"><p className="text-xs leading-relaxed text-slate-600">Uses the admin AI provider and the existing curriculum. Each completed topic is saved as a draft; nothing is published automatically.</p><Field label="New topics (1-5)"><input className={input} type="number" min={1} max={5} value={generationCount} onChange={e => setGenerationCount(Number(e.target.value))} /></Field><Field label="Question-bank size"><input className={input} type="number" min={1} max={50} list="bank-sizes" value={bankCount} onChange={e => setBankCount(Number(e.target.value))} /><datalist id="bank-sizes"><option value="10" /><option value="20" /><option value="30" /><option value="50" /></datalist></Field><Field label="Questions per test"><input className={input} type="number" min={1} max={bankCount} value={generatedTestSize} onChange={e => setGeneratedTestSize(Number(e.target.value))} /></Field><button className={`${button} w-full`} disabled={!languageId} onClick={() => void generateLessons()}>Generate draft topics</button></fieldset></details>
          <nav aria-label="Edit lesson" className="max-h-[60vh] space-y-2 overflow-y-auto">{visiblePeers.map(e => <button key={e.topic.id} disabled={busy} className={`${button} w-full flex-col items-start text-left ${topic?.id === e.topic.id ? 'border-teal-600 bg-teal-50' : ''}`} onClick={() => { if (leaveEditor()) { setTopic(structuredClone(e.draft || e.topic)); setDirty(false); setTab('Lesson'); } }}><span>{e.topic.order}. {e.topic.title}</span><span className="text-xs text-slate-500">{e.draft ? 'Published with pending draft' : e.topic.state}</span></button>)}{!visiblePeers.length && <p className="text-sm text-slate-500">No lessons yet. Add the first topic to begin.</p>}</nav>
        </aside>
        {!topic ? <section className="rounded-lg border border-dashed border-slate-300 p-8"><BookOpen className="mb-4 text-teal-700" /><h2 className="text-lg font-semibold">Choose a topic or create one</h2><p className="mt-2 text-sm text-slate-600">Each topic includes a lesson, practice code, a question bank and a marked assignment.</p></section> : <section className="min-w-0 rounded-lg border border-slate-200 bg-white">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 p-4" aria-label="Editor sections">{['Lesson', 'Questions', 'Assignment', 'Videos', 'Preview'].map(t => <button key={t} className={`${button} ${tab === t ? 'border-teal-600 bg-teal-50' : ''}`} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}</div>
          <div className="border-b border-slate-200 bg-teal-50 p-4 text-teal-900"><strong>Editing {catalog.languages.find(l=>l.id===topic.languageId)?.title}: {topic.title || 'New topic'}</strong><p className="mt-1 text-sm">Save draft keeps the live page unchanged. Publish lesson applies your changes, including videos, after deployment.</p>{entry?.topic.state==='published'&&<a className="mt-2 inline-flex min-h-12 items-center font-semibold underline" href={`/learn/${catalog.languages.find(l=>l.id===topic.languageId)?.slug}/${topic.slug}/`} target="_blank" rel="noopener noreferrer">View published lesson</a>}</div>
          <fieldset disabled={busy} className="min-w-0 space-y-5 p-4 sm:p-6">
            {tab === 'Lesson' && <>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Topic title"><input className={input} maxLength={160} value={topic.title} onChange={e => edit({ title: e.target.value })} /></Field><Field label="URL slug (fixed after first save)"><input className={input} disabled={!!entry} value={topic.slug} placeholder="understanding-variables" onChange={e => edit({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} /></Field></div>
              <Field label="Position in this language"><input className={input} type="number" min={1} value={topic.order} onChange={e => edit({ order: Number(e.target.value) })} /></Field>
              <Field label="Short summary"><textarea className={input} rows={2} maxLength={2000} value={topic.summary} onChange={e => edit({ summary: e.target.value })} /></Field>
              <Field label="Learning objectives (one per line)"><textarea className={input} rows={3} value={topic.objectives.join('\n')} onChange={e => edit({ objectives: e.target.value.split('\n') })} /></Field>
              <div><p className="mb-2 text-sm font-medium">Prerequisites</p><div className="space-y-2">{peers.filter(e => e.topic.id !== topic.id && e.topic.order < topic.order).map(e => <label key={e.topic.id} className="flex min-h-12 items-center gap-3 text-sm"><input type="checkbox" checked={topic.prerequisiteIds.includes(e.topic.id)} onChange={event => edit({ prerequisiteIds: event.target.checked ? [...topic.prerequisiteIds, e.topic.id] : topic.prerequisiteIds.filter(id => id !== e.topic.id) })} />{e.topic.title}</label>)}</div></div>
              <Field label="Lesson content (Markdown)"><textarea className={`${input} font-mono`} rows={16} maxLength={100000} value={topic.content} onChange={e => edit({ content: e.target.value })} /></Field>
              <p className="text-sm text-slate-600">{lessonWordCount(topic.content).toLocaleString('en-US')} teaching words. There is no required word-count range. Include clear section headings, three worked examples and their expected results. Code blocks are excluded from this informational count.</p>
              <p className="text-xs text-slate-500">Use language-tagged fenced code for runnable examples. Fenced hint and solution blocks become click-to-reveal controls. Markdown cannot run scripts; examples run only in the isolated practice editor.</p>
              <Field label="Practice starter code"><textarea className={`${input} font-mono`} rows={6} maxLength={20000} value={topic.starterCode} onChange={e => edit({ starterCode: e.target.value })} /></Field>
            </>}
            {tab === 'Questions' && <>
              <p className="text-sm text-slate-600">The bank contains {topic.questions.length} questions. Each attempt draws the test size below, prioritizing questions the learner has not seen.</p>
              <Field label="Questions per test"><input className={input} type="number" min={1} max={100} value={topic.questionsPerAttempt} onChange={e => edit({ questionsPerAttempt: Number(e.target.value) })} /></Field>
              {topic.questions.map((q, index) => <details key={q.id} open={index === topic.questions.length - 1} className="rounded-md border border-slate-200 p-4"><summary className="min-h-12 cursor-pointer font-medium">Question {index + 1}: {q.question || 'Untitled'}</summary><div className="space-y-4">
                <Field label="Question"><textarea className={input} value={q.question} onChange={e => edit({ questions: topic.questions.map(item => item.id === q.id ? { ...item, question: e.target.value } : item) })} /></Field>
                {q.options.map((option, oi) => <Field key={option.id} label={`Option ${oi + 1}`}><input className={input} value={option.text} onChange={e => edit({ questions: topic.questions.map(item => item.id === q.id ? { ...item, options: item.options.map(o => o.id === option.id ? { ...o, text: e.target.value } : o) } : item) })} /></Field>)}
                <Field label="Correct answer"><select className={input} value={q.correctOptionId} onChange={e => edit({ questions: topic.questions.map(item => item.id === q.id ? { ...item, correctOptionId: e.target.value } : item) })}>{q.options.map((o, oi) => <option key={o.id} value={o.id}>Option {oi + 1}</option>)}</select></Field>
                <Field label="Explanation shown after the test"><textarea className={input} value={q.explanation} onChange={e => edit({ questions: topic.questions.map(item => item.id === q.id ? { ...item, explanation: e.target.value } : item) })} /></Field>
                <button className={button} onClick={() => { if (window.confirm('Remove this question from the draft?')) edit({ questions: topic.questions.filter(item => item.id !== q.id) }); }}>Remove question</button>
              </div></details>)}
              <button className={button} onClick={() => edit({ questions: [...topic.questions, { id: crypto.randomUUID(), question: '', explanation: '', correctOptionId: 'a', options: ['a', 'b', 'c', 'd'].map(id => ({ id, text: '' })) }] })}><Plus size={16} />Add question</button>
            </>}
            {tab === 'Assignment' && !topic.assignment && <button className={button} onClick={() => edit({ assignment: newLearningTopic(topic.languageId, topic.order).assignment })}>Add assignment and marking rubric</button>}
            {tab === 'Assignment' && topic.assignment && <>
              <Field label="Assignment instructions"><textarea className={input} rows={6} value={topic.assignment.instructions} onChange={e => edit({ assignment: { ...topic.assignment!, instructions: e.target.value } })} /></Field>
              {(['hints', 'requiredConcepts', 'allowedConcepts', 'prohibitedConcepts'] as const).map(key => <Field key={key} label={`${({ hints: 'Hints', requiredConcepts: 'Required concepts', allowedConcepts: 'Allowed concepts', prohibitedConcepts: 'Prohibited concepts' })[key]} (one per line)`}><textarea className={input} rows={3} value={topic.assignment![key].join('\n')} onChange={e => edit({ assignment: { ...topic.assignment!, [key]: e.target.value.split('\n') } })} /></Field>)}
              <Field label="Assignment starter code"><textarea className={`${input} font-mono`} rows={5} value={topic.assignment.starterCode} onChange={e => edit({ assignment: { ...topic.assignment!, starterCode: e.target.value } })} /></Field>
              <h2 className="font-semibold">Marking rubric: {topic.assignment.rubric.reduce((n, r) => n + r.points, 0)} / 100 points</h2>
              {topic.assignment.rubric.map(r => <div key={r.id} className="grid gap-3 sm:grid-cols-[1fr_100px_auto]"><Field label="Criterion"><input className={input} value={r.description} onChange={e => edit({ assignment: { ...topic.assignment!, rubric: topic.assignment!.rubric.map(item => item.id === r.id ? { ...item, description: e.target.value } : item) } })} /></Field><Field label="Points"><input className={input} type="number" min={1} max={100} value={r.points} onChange={e => edit({ assignment: { ...topic.assignment!, rubric: topic.assignment!.rubric.map(item => item.id === r.id ? { ...item, points: Number(e.target.value) } : item) } })} /></Field><button className={`${button} self-end`} onClick={() => edit({ assignment: { ...topic.assignment!, rubric: topic.assignment!.rubric.filter(item => item.id !== r.id) } })}>Remove</button></div>)}
              <button className={button} onClick={() => edit({ assignment: { ...topic.assignment!, rubric: [...topic.assignment!.rubric, { id: crypto.randomUUID(), description: '', points: 10 }] } })}>Add criterion</button>
            </>}
            {tab === 'Videos' && <>
              <p className="rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">Videos selected here belong to {catalog.languages.find(l=>l.id===topic.languageId)?.title}: {topic.title}. Select a video, then use Publish lesson below. Selecting a checkbox alone does not publish it.</p>
              <button className={`${button} bg-teal-700 text-white hover:bg-teal-800`} disabled={busy||!!issues.length} onClick={()=>{if(window.confirm(`Publish video changes for ${topic.title}?`))void perform('learning_publish',{topic,expectedUpdatedAt:entry?.updatedAt||null},topic.id);}}>Save and publish video changes</button>
              <p className="text-sm text-slate-600">Choose uploads from the RayTech Institute channel for this topic. Video playback stays on YouTube; public learners do not call the Data API.</p>
              <button className={button} onClick={() => void loadVideos()}><RefreshCw size={16} />Fetch latest uploads</button>
              <h2 className="font-semibold">Attached videos ({topic.videoIds.length}/20)</h2>
              {topic.videoIds.map(id => <div key={id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 p-3"><a className="text-sm text-teal-800 underline" href={`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`} target="_blank" rel="noopener noreferrer">{videos.find(v => v.id === id)?.title || `YouTube video ${id}`}</a><button className={button} onClick={() => edit({ videoIds: topic.videoIds.filter(v => v !== id) })}>Remove</button></div>)}
              <div className="max-h-[32rem] space-y-2 overflow-y-auto">{videos.map(v => <label key={v.id} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-md border border-slate-200 p-3 text-sm"><input className="mt-1" type="checkbox" checked={topic.videoIds.includes(v.id)} disabled={!topic.videoIds.includes(v.id) && topic.videoIds.length >= 20} onChange={e => edit({ videoIds: e.target.checked ? [...topic.videoIds, v.id] : topic.videoIds.filter(id => id !== v.id) })} /><span>{v.title}<span className="mt-1 block text-xs text-slate-500">{v.publishedAt.slice(0, 10)}</span></span></label>)}</div>
              {videosLoaded && !videos.length && <p className="text-sm text-slate-500">No public channel uploads were returned.</p>}
              {nextVideoPage && <button className={button} onClick={() => void loadVideos(true)}>Load older uploads</button>}
            </>}
            {tab === 'Preview' && <article className="min-w-0 break-words"><h2 className="mb-4 text-2xl font-bold">{topic.title || 'Untitled lesson'}</h2><MarkdownRenderer content={topic.content || 'Write a lesson to see its preview.'} /></article>}
          </fieldset>
          <footer className="space-y-4 border-t border-slate-200 p-4">
            {!!issues.length && <details><summary className="min-h-12 cursor-pointer text-sm font-medium text-amber-800">{issues.length} publication checks need attention</summary><ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">{issues.map(issue => <li key={issue}>{issue}</li>)}</ul></details>}
            <div className="flex flex-wrap gap-3"><button className={button} disabled={busy} onClick={() => { const normalized = { ...topic, objectives: lines(topic.objectives.join('\n')), assignment: topic.assignment ? { ...topic.assignment, hints: lines(topic.assignment.hints.join('\n')), requiredConcepts: lines(topic.assignment.requiredConcepts.join('\n')), allowedConcepts: lines(topic.assignment.allowedConcepts.join('\n')), prohibitedConcepts: lines(topic.assignment.prohibitedConcepts.join('\n')) } : null }; void perform('learning_save_draft', { topic: normalized, expectedUpdatedAt: entry?.updatedAt || null }, topic.id); }}><Save size={16} />Save draft</button>
            <button className={`${button} border-teal-700 bg-teal-700 text-white hover:bg-teal-800`} disabled={busy || !!issues.length} onClick={() => { if (window.confirm('Publish this lesson and request a website rebuild?')) void perform('learning_publish', { topic, expectedUpdatedAt: entry?.updatedAt || null }, topic.id); }}><Send size={16} />Publish lesson</button>
            {entry?.draft && <button className={`${button} text-red-700`} disabled={busy} onClick={() => removeDraft(entry)}><Trash2 size={16} />Discard draft changes</button>}
            {entry && <button className={`${button} text-red-700`} disabled={busy} onClick={() => { if (window.confirm(`Delete "${topic.title}"? ${entry.topic.state === 'published' ? 'The published lesson AND any pending draft will be deleted. Public pages are removed after the rebuild.' : 'This saved draft will be deleted.'}`)) void perform('learning_delete', { id: topic.id, expectedUpdatedAt: entry.updatedAt }, topic.id); }}><Trash2 size={16} />{entry.topic.state === 'published' ? 'Delete lesson' : 'Delete draft'}</button>}
            <span className="self-center text-xs text-slate-500">{busy ? 'Working...' : dirty ? 'Unsaved changes' : 'Editor ready'}</span></div>
          </footer>
        </section>}
      </div>
    </>}
  </div>;
}
