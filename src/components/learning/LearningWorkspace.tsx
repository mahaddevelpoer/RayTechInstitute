'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Code2, List, X, ArrowLeft, ArrowRight, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Header } from '@/components/Header';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { InteractiveLesson } from './InteractiveLesson';
import { AdReservation } from '@/components/AdReservation';
import { CodiReader } from './CodiReader';
import { CodiSentences } from './CodiSentences';
import type { LessonBlock } from '@/types/lesson-blocks';
import { BrowserPractice } from './BrowserPractice';
import { TopicQuiz } from './TopicQuiz';
import { TopicAssignment } from './TopicAssignment';
import { TopicProgressPanel } from './TopicProgressPanel';
import { LessonVideo } from './LessonVideo';
import { useLearningSession } from './LearningSession';
import { topicProgressKey } from '@/lib/learning/quiz';
import type { LearningLanguage, LearningTopic } from '@/types/learning';

export function LearningWorkspace({ language, topic, topics, mode = 'lesson', lessonBlocks }: { language: LearningLanguage; topic: LearningTopic; topics: Pick<LearningTopic, 'id' | 'title' | 'slug' | 'order'>[]; mode?: 'lesson' | 'quiz' | 'assignment'; lessonBlocks?: LessonBlock[] }) {
  const [mobilePanel, setMobilePanel] = useState<'lesson' | 'practice'>('lesson');
  const [codiRunSignal, setCodiRunSignal] = useState(0);
  const [topicsOpen, setTopicsOpen] = useState(true);
  const [practiceOpen, setPracticeOpen] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const practicePane = useRef<HTMLElement>(null);
  const lessonPane = useRef<HTMLElement>(null);
  const topicsBody = useRef<HTMLDivElement>(null);
  const practiceBody = useRef<HTMLDivElement>(null);
  useEffect(() => { if (topicsBody.current) topicsBody.current.inert = !topicsOpen; }, [topicsOpen]);
  useEffect(() => { if (practiceBody.current) practiceBody.current.inert = !practiceOpen; }, [practiceOpen]);
  const { state, dispatch } = useLearningSession();
  const codeKey = `${topicProgressKey(topic.id, topic.version)}:${mode === 'assignment' ? 'assignment' : 'practice'}`;
  const starterCode = mode === 'assignment' ? topic.assignment?.starterCode || '' : topic.starterCode;
  const position = topics.findIndex(t => t.id === topic.id);
  const tryCode = (code: string) => {
    const current = state.code[codeKey];
    if (current && current !== starterCode && current !== code && !window.confirm('Replace your current practice code with this example?')) return;
    dispatch({ type: 'code', key: codeKey, code }); setPracticeOpen(true); setMobilePanel('practice');
    requestAnimationFrame(() => practicePane.current?.focus());
  };
  const topicList = <nav aria-label={`${language.title} topics`} className="learning-topic-links">{topics.map(t => <Link key={t.id} href={`/learn/${language.slug}/${t.slug}/`} aria-current={t.id === topic.id ? 'page' : undefined} onClick={() => dialog.current?.close()}><span className="text-xs opacity-60">{t.order}</span><span>{t.title}</span></Link>)}</nav>;
  return <div className="learning-page">
    <Header scrollContainer={lessonPane} />
    <div className="learning-mobile-controls"><button className="learn-button" onClick={() => dialog.current?.showModal()}><List size={16} />Topics</button><button className="learn-button learning-mobile-lesson" aria-pressed={mobilePanel === 'lesson'} onClick={() => setMobilePanel('lesson')}><BookOpen size={16} />Lesson</button><button className="learn-button learning-mobile-practice" aria-pressed={mobilePanel === 'practice'} onClick={() => { setPracticeOpen(true); setMobilePanel('practice'); }}><Code2 size={16} />Practice</button></div>
    <main id="main-content" className="learning-workspace" data-mobile-panel={mobilePanel} data-topics-open={topicsOpen} data-practice-open={practiceOpen}>
      <aside id="learning-topics-panel" className="learning-topics"><div className="learning-pane-header"><div className="learning-pane-heading"><Link className="font-semibold" href={`/learn/${language.slug}/`}>{language.title}</Link><span className="text-xs">{topics.length} topics</span></div><button className="learning-pane-toggle" title={topicsOpen ? 'Hide topics' : 'Show topics'} aria-label={topicsOpen ? 'Hide topics' : 'Show topics'} aria-expanded={topicsOpen} aria-controls="learning-topics-body" onClick={() => setTopicsOpen(value => !value)}>{topicsOpen ? <PanelLeftClose size={19}/> : <PanelLeftOpen size={19}/>}</button></div><div id="learning-topics-body" ref={topicsBody} className="learning-panel-body" aria-hidden={!topicsOpen}>{topicList}<Link className="learn-button m-3" href="/courses/">All courses</Link></div></aside>
      <article ref={lessonPane} className="learning-lesson" tabIndex={0} aria-label="Lesson content">
        <nav className="mb-6 text-xs" aria-label="Breadcrumb"><Link href="/courses/">Courses</Link><span className="px-2">/</span><Link href={`/learn/${language.slug}/`}>{language.title}</Link></nav>
        <h1 className="mb-4 text-3xl font-bold tracking-tight">{mode==='lesson'?<CodiSentences text={topic.title}/>:topic.title}{mode === 'quiz' ? ': topic test' : mode === 'assignment' ? ': assignment' : ''}</h1>
        <TopicProgressPanel topic={topic} />
        <nav aria-label="Topic activities" className="mb-6 flex flex-wrap gap-2"><Link className="learn-button" aria-current={mode === 'lesson' ? 'page' : undefined} href={`/learn/${language.slug}/${topic.slug}/`}>Lesson</Link><Link className="learn-button" aria-current={mode === 'quiz' ? 'page' : undefined} href={`/learn/${language.slug}/${topic.slug}/quiz/`}>Topic test</Link><Link className="learn-button" aria-current={mode === 'assignment' ? 'page' : undefined} href={`/learn/${language.slug}/${topic.slug}/assignment/`}>Assignment</Link></nav>
        {mode === 'quiz' ? <TopicQuiz topic={topic} languageSlug={language.slug} /> : mode === 'assignment' ? <TopicAssignment topic={topic} languageSlug={language.slug} /> : <>
        <p className="mb-8 text-base leading-relaxed"><CodiSentences text={topic.summary}/></p>
        <section className="learning-objectives"><h2 className="mb-2 text-base font-semibold"><CodiSentences text="What you will learn"/></h2><ul className="list-disc space-y-1 pl-5 text-sm">{topic.objectives.map(objective => <li key={objective}><CodiSentences text={objective}/></li>)}</ul></section>
        {lessonBlocks ? <InteractiveLesson blocks={lessonBlocks} language={language.runtime} onTryCode={tryCode} /> : <MarkdownRenderer content={topic.content} practiceLanguage={language.runtime} onTryCode={tryCode} narration />}
        {!!topic.videoIds.length && <section className="mt-10"><h2 className="mb-4 text-xl font-semibold">Watch the lesson</h2>{topic.videoIds.map(id => <LessonVideo key={id} videoId={id} title={topic.title} />)}</section>}
        <AdReservation placement="lesson" />
        </>}
        <nav className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[var(--border)] pt-6" aria-label="Lesson navigation">{position > 0 ? <Link className="learn-button" href={`/learn/${language.slug}/${topics[position - 1].slug}/`}><ArrowLeft size={16} />Previous topic</Link> : <span />}{position < topics.length - 1 && <Link className="learn-button" href={`/learn/${language.slug}/${topics[position + 1].slug}/`}>Next topic<ArrowRight size={16} /></Link>}</nav>
        <p className="mt-8 text-xs leading-relaxed text-[var(--text-muted)]">Lessons, practice, tests and Codi voice are open to everyone. Cloud voice requires consent and shares a limited free allowance. Sign-in is required for AI assignment feedback and is optional for saving progress. Guest work clears on reload; signed-in students can restore their last saved checkpoint.</p>
      </article>
      <aside id="learning-practice-panel" ref={practicePane} tabIndex={-1} className="learning-practice-pane" aria-label="Practice code" data-codi-collapsed={!practiceOpen}><div className="learning-pane-header"><strong className="learning-pane-heading text-sm">Practice workspace</strong><button className="learning-pane-toggle" title={practiceOpen ? 'Hide compiler' : 'Show compiler'} aria-label={practiceOpen ? 'Hide compiler' : 'Show compiler'} aria-expanded={practiceOpen} aria-controls="learning-practice-body" onClick={() => { setPracticeOpen(value => !value); setMobilePanel('lesson'); }}>{practiceOpen ? <PanelRightClose size={19}/> : <PanelRightOpen size={19}/>}</button></div><div id="learning-practice-body" ref={practiceBody} className="learning-panel-body" aria-hidden={!practiceOpen}><BrowserPractice key={`${topic.id}@${topic.version}:${mode}`} language={language.runtime} starterCode={starterCode} code={state.code[codeKey] ?? starterCode} onCodeChange={code => dispatch({ type: 'code', key: codeKey, code })} onRunStart={() => setCodiRunSignal(value => value + 1)} /></div></aside>
    </main>
    {mode === 'lesson' && process.env.NEXT_PUBLIC_CODI_ENABLED !== 'false' && <CodiReader key={topic.id} content={lessonPane} compiler={practicePane} runSignal={codiRunSignal} fullText={`${topic.title}\n\n${topic.content}`} languageSlug={language.slug} currentLesson={{ id: topic.id, title: topic.title, slug: topic.slug, order: topic.order, content: topic.content }} />}
    <footer className="learning-footer"><span>RayTech Institute</span><div className="flex gap-4"><Link href="/privacy-policy/">Privacy</Link><Link href="/terms-and-conditions/">Terms</Link></div></footer>
    <dialog ref={dialog} className="learning-topic-dialog"><div className="learning-panel-toolbar"><strong>{language.title} topics</strong><button className="learn-button" aria-label="Close topics" onClick={() => dialog.current?.close()}><X size={18} /></button></div>{topicList}</dialog>
  </div>;
}
