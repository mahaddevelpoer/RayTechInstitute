'use client';
import { useId, useState } from 'react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import type { LessonBlock } from '@/types/lesson-blocks';
import { UnderstandActivity } from './UnderstandActivity';
import { CodiSentences, CodiCodeLines } from './CodiSentences';

function Prediction({ block }: { block: Extract<LessonBlock, { type: 'PredictOutput' }> }) {
  const id = useId(); const [selected, setSelected] = useState<number | null>(null); const [checked, setChecked] = useState(false);
  return <section className="lesson-activity" aria-labelledby={id}>
    <p className="lesson-activity-label">Predict before you run</p><h3 id={id}><CodiSentences text={block.title}/></h3>
    <pre><code><CodiCodeLines code={block.code}/></code></pre>
    <fieldset><legend>What will happen?</legend>{block.options.map((option, index) => <label className="lesson-choice" key={index}>
      <input type="radio" name={id} checked={selected === index} onChange={() => { setSelected(index); setChecked(false); }} /><span>{option}</span>
    </label>)}</fieldset>
    <button className="learn-button" disabled={selected === null} onClick={() => setChecked(true)}>Check prediction</button>
    {checked && <div role="status" className="lesson-feedback"><strong>{selected === block.answer ? 'Correct prediction.' : 'Not quite. Compare the steps below.'}</strong><p><CodiSentences text={block.explanation}/></p><button className="learn-button" onClick={() => { setSelected(null); setChecked(false); }}>Try again</button></div>}
  </section>;
}

function Trace({ block }: { block: Extract<LessonBlock, { type: 'CodeTrace' }> }) {
  const [position, setPosition] = useState(0); const id = useId(); const step = block.steps[position];
  return <section className="lesson-activity" aria-labelledby={id}>
    <p className="lesson-activity-label">Follow the program</p><h3 id={id}><CodiSentences text={block.title}/></h3>
    <ol className="lesson-trace">{block.steps.map((item, index) => <li key={index} aria-current={index === position ? 'step' : undefined}><span>{index + 1}</span><code><CodiCodeLines code={item.line}/></code></li>)}</ol>
    <div className="lesson-feedback" aria-live="polite"><p>Step {position + 1} of {block.steps.length}</p><p><CodiSentences text={step.explanation}/></p><pre><CodiCodeLines code={step.values}/></pre></div>
    <div className="flex flex-wrap gap-2"><button className="learn-button" disabled={position === 0} onClick={() => setPosition(p => p - 1)}>Previous step</button><button className="learn-button" disabled={position === block.steps.length - 1} onClick={() => setPosition(p => p + 1)}>Next step</button><button className="learn-button" disabled={position === 0} onClick={() => setPosition(0)}>Restart trace</button></div>
    <p className="mt-3 text-xs">This is an authored walkthrough, not a live debugger. Run the code in Practice to verify the result.</p>
  </section>;
}

export function InteractiveLesson({ blocks, language, onTryCode }: { blocks: LessonBlock[]; language: string; onTryCode: (code: string) => void }) {
  return <div className="interactive-lesson">{blocks.map((block, index) => {
    if (block.type === 'Understand') return <UnderstandActivity key={index} title={block.title} stages={block.stages} experiment={block.experiment} />;
    if (block.type === 'markdown') return <MarkdownRenderer key={index} content={block.content} practiceLanguage={language} onTryCode={onTryCode} narration teaching />;
    if (block.type === 'PredictOutput') return <Prediction key={index} block={block} />;
    if (block.type === 'CodeTrace') return <Trace key={index} block={block} />;
    return <section key={index} className="lesson-activity"><p className="lesson-activity-label">Change it and explain it</p><h3><CodiSentences text={block.title}/></h3><p><CodiSentences text={block.task}/></p><pre><code><CodiCodeLines code={block.code}/></code></pre><button className="learn-button" onClick={() => onTryCode(block.code)}>Open in Practice</button><p className="mt-3 text-xs">Loading an example does not run it. Your existing edits are protected by a replacement confirmation.</p></section>;
  })}</div>;
}
