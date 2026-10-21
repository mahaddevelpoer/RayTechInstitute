'use client';
import { useEffect, useId, useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw, ArrowRight } from 'lucide-react';
import { variableLabFrames } from '@/lib/learning/variable-lab';

export function PythonVariableLab() {
  const id = useId();
  const [days, setDays] = useState(5); const [minutes, setMinutes] = useState(30); const [changedDays, setChangedDays] = useState(6);
  const [recalculate, setRecalculate] = useState(false); const [position, setPosition] = useState(0); const [playing, setPlaying] = useState(false);
  const frames = variableLabFrames(days, minutes, changedDays, recalculate); const frame = frames[position - 1];
  const previous = frames[position - 2]; const finished = position === frames.length;
  useEffect(() => {
    if (!playing) return;
    if (finished) { setPlaying(false); return; }
    const timer = setTimeout(() => setPosition(value => value + 1), 1300);
    return () => clearTimeout(timer);
  }, [playing, position, finished]);
  function reset() { setPosition(0); setPlaying(false); }
  function change(update: () => void) { reset(); update(); }
  return <section className="variable-lab" aria-labelledby={`${id}-title`}>
    <p className="lesson-activity-label">Interactive experiment</p><h4 id={`${id}-title`} data-lab-heading tabIndex={-1}>Make a change. Watch what really changes.</h4>
    <p>Choose the numbers, then play or step through the instructions. Try changing days without recalculation, then compare with recalculation enabled.</p>
    <div className="variable-lab-controls">{[
      { label: 'Starting days', value: days, max: 10, min: 1, set: setDays },
      { label: 'Minutes per day', value: minutes, max: 60, min: 5, set: setMinutes },
      { label: 'Changed days', value: changedDays, max: 10, min: 1, set: setChangedDays },
    ].map(control => <label key={control.label}><span>{control.label}<strong>{control.value}</strong></span><input type="range" aria-label={control.label} min={control.min} max={control.max} value={control.value} onChange={event => change(() => control.set(Number(event.target.value)))} /></label>)}</div>
    <label className="variable-lab-toggle"><input type="checkbox" checked={recalculate} onChange={event => change(() => setRecalculate(event.target.checked))} /><span>Recalculate total after changing days</span></label>
    <div className="flex flex-wrap gap-2"><button className="learn-button" onClick={() => { if (playing) setPlaying(false); else { if (finished) setPosition(0); setPlaying(true); } }}>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? 'Pause experiment' : finished ? 'Replay experiment' : 'Play experiment'}</button><button className="learn-button" disabled={finished || playing} onClick={() => setPosition(value => value + 1)}><SkipForward size={16} />Step one line</button><button className="learn-button" disabled={position === 0 && !playing} onClick={reset}><RotateCcw size={16} />Reset experiment</button></div>
    <p className="text-xs mt-3">{position} of {frames.length} instructions executed</p>
    <ol className="variable-lab-code" aria-label="Program instructions">{frames.map((item, index) => <li key={index} aria-current={position === index + 1 ? 'step' : undefined}><span>{index + 1}</span><code>{item.line}</code></li>)}</ol>
    <div className="variable-bindings" aria-label="Names and current values">{(['days', 'minutes_per_day', 'total'] as const).map(name => {
      const value = frame?.state[name]; const changed = value !== undefined && value !== previous?.state[name];
      return <div className="variable-binding" key={name} data-changed={changed}><code>{name}</code><ArrowRight size={18} aria-hidden="true" /><output aria-label={`${name} current value`} key={`${name}:${value ?? 'unbound'}`} className={changed ? 'variable-value-changed' : undefined}>{value === undefined ? 'Not assigned' : <>{value}<small>integer</small></>}</output></div>;
    })}</div>
    <div className="variable-lab-note" role="status"><strong>{frame ? `After instruction ${position}` : 'Ready to explore'}</strong><p>{frame?.note || 'Predict the total first. Press Step one line to inspect the program at your own pace.'}</p></div>
    <section className="variable-lab-output" aria-label="Experiment output"><strong>Printed output</strong><pre>{frame?.output.length ? frame.output.join('\n') : 'Nothing printed yet.'}</pre></section>
    <p className="text-xs">This is a controlled model of these exact instructions, not a debugger or a physical memory diagram. Run the equivalent code in Practice to compare with Python. Resetting this experiment does not reset your guided activity answers.</p>
  </section>;
}
