'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { Info, ArrowRight, Check, RotateCcw } from 'lucide-react';
import type { UnderstandStage } from '@/types/lesson-blocks';
import { PythonVariableLab } from './PythonVariableLab';

/** Reviewed learning data, not a general code executor or a formal assessment. */
export function UnderstandActivity({ title, stages, experiment }: { title: string; stages: UnderstandStage[]; experiment?: 'python-bindings' }) {
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const activity = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);
  const [mastered, setMastered] = useState<number[]>([]);
  const [choices, setChoices] = useState<Record<number, number[]>>({});
  const [feedback, setFeedback] = useState<'correct' | 'retry' | null>(null);
  const [hint, setHint] = useState(false);
  const stage = stages[position];
  const selected = choices[position] || [];
  const solved = mastered.includes(position);
  const complete = mastered.length === stages.length;
  // Focus scrolls only the learning pane so a newly unlocked explanation is visible.
  useEffect(() => { if (open) (position === 0 && experiment ? activity.current?.querySelector<HTMLElement>('[data-lab-heading]') || heading.current : heading.current)?.focus(); }, [open, position, experiment]);
  function check() {
    const correct = stage.slots.every((slot, index) => selected[index] === slot.answer);
    setFeedback(correct ? 'correct' : 'retry');
    if (correct) setMastered(previous => previous.includes(position) ? previous : [...previous, position]);
  }
  function move(next: number) { setPosition(next); setFeedback(null); setHint(false); }
  return <section ref={activity} className="lesson-activity understand-activity" aria-label={title}>
    <div className="understand-intro"><div><p className="lesson-activity-label">AI suggested activity</p><h3>{title}</h3></div>
      <button className="learn-button" aria-expanded={open} aria-controls={`${id}-body`} onClick={() => setOpen(value => !value)}><span>Understand</span><Info size={18} aria-hidden="true" /></button>
    </div>
    <p>Build the result yourself. Complete every check in a part to unlock the next part of this same lesson. You can retry freely.</p>
    {open && <div id={`${id}-body`} className="understand-reveal">
      {experiment === 'python-bindings' && <PythonVariableLab />}
      <p className="text-sm font-semibold" aria-live="polite">{mastered.length} of {stages.length} parts completed</p>
      <p className="text-xs">Guided practice only. This does not change your topic-test score or unlock an assignment. Progress here lasts until this page is reloaded.</p>
      <ol className="understand-progress" aria-label="Activity parts">{stages.map((item, index) => <li key={index}><button className="learn-button" disabled={index > 0 && !mastered.includes(index - 1)} aria-current={position === index ? 'step' : undefined} onClick={() => move(index)}>{mastered.includes(index) ? <Check size={15} aria-hidden="true" /> : <span>{index + 1}</span>}<span>{item.title}</span></button></li>)}</ol>
      <div key={position} className="understand-stage">
        <h4 ref={heading} tabIndex={-1}>Part {position + 1}: {stage.title}</h4><p>{stage.explanation}</p>
        <pre><code>{stage.code}</code></pre>
        <fieldset disabled={solved}><legend>Complete the state below</legend>
          <div className="understand-state">{stage.slots.map((slot, index) => <label className="understand-cell" key={index}>
            <span>{slot.label}</span><select aria-label={slot.label} value={selected[index] ?? ''} onChange={event => {
              const value = Number(event.target.value); setChoices(previous => {
                const updated = [...(previous[position] || [])]; updated[index] = value; return { ...previous, [position]: updated };
              }); setFeedback(null);
            }}><option value="" disabled>Choose a value</option>{slot.options.map((option, optionIndex) => <option key={optionIndex} value={optionIndex}>{option}</option>)}</select>
            <output aria-live="polite" className="understand-value" key={selected[index] ?? 'empty'}>{selected[index] === undefined ? '?' : slot.options[selected[index]]}</output>
          </label>)}</div>
        </fieldset>
        <div className="flex flex-wrap gap-2"><button className="learn-button" disabled={solved || stage.slots.some((_, index) => selected[index] === undefined)} onClick={check}>Check this part</button><button className="learn-button" aria-expanded={hint} aria-controls={`${id}-hint`} onClick={() => setHint(value => !value)}> {hint ? 'Hide hint' : 'Show hint'}</button></div>
        {hint && <p id={`${id}-hint`} className="lesson-feedback">{stage.hint}</p>}
        {(feedback || solved) && <div className="lesson-feedback" role="status">{solved ? <><strong>All checks correct.</strong><p>{stage.success}</p></> : <><strong>Not yet. You can change your choices and try again.</strong><p>Follow the code from top to bottom. Every state must match before the next part opens.</p></>}</div>}
        <div className="flex flex-wrap gap-2">{position > 0 && <button className="learn-button" onClick={() => move(position - 1)}>Previous part</button>}{position < stages.length - 1 && <button className="learn-button" disabled={!solved} onClick={() => move(position + 1)}>Next part<ArrowRight size={16} aria-hidden="true" /></button>}</div>
      </div>
      {complete && <p className="lesson-feedback" role="status"><strong>Activity complete: every part is correct.</strong> Now change the example in Practice and explain the result without looking back.</p>}
      <button className="learn-button mt-4" onClick={() => { setMastered([]); setChoices({}); move(0); }}><RotateCcw size={16} aria-hidden="true" />Restart activity</button>
    </div>}
  </section>;
}
