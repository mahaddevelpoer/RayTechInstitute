'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {SlidersHorizontal,Volume2,VolumeX} from 'lucide-react';
import {ArenaAudio,defaultArenaAudio,type ArenaAudioPreferences,type ArenaCue} from '@/lib/competition/arena-audio';

const storageKey = 'raytech-arena-audio-v1';
export function useArenaAudio(focused:boolean) {
  const [settings,setSettings]=useState<ArenaAudioPreferences>(defaultArenaAudio);
  const [ready,setReady]=useState(false),[unlocked,setUnlocked]=useState(false);
  const engine=useRef<ArenaAudio|null>(null),current=useRef(settings);
  current.current=settings;
  useEffect(()=>{
    engine.current=new ArenaAudio();
    try { const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved)setSettings({music:false,effects:saved.effects===true,musicVolume:Number.isFinite(saved.musicVolume)?Math.max(0,Math.min(100,saved.musicVolume)):32,effectsVolume:Number.isFinite(saved.effectsVolume)?Math.max(0,Math.min(100,saved.effectsVolume)):48}); } catch { /* Default to silence. */ }
    setReady(true);
    const unlock=()=>{if(current.current.music||current.current.effects)void engine.current?.unlock().then(()=>setUnlocked(true)).catch(()=>{});};
    const visibility=()=>engine.current?.visibility(document.hidden);
    document.addEventListener('pointerdown',unlock);document.addEventListener('keydown',unlock);document.addEventListener('visibilitychange',visibility);
    return()=>{document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock);document.removeEventListener('visibilitychange',visibility);engine.current?.dispose();engine.current=null;};
  },[]);
  useEffect(()=>{engine.current?.configure(settings,focused);if(ready)try{localStorage.setItem(storageKey,JSON.stringify(settings));}catch{/* Storage is optional. */}},[settings,focused,ready]);
  const cue=useCallback((value:ArenaCue)=>engine.current?.cue(value),[]);
  const change=useCallback((value:Partial<ArenaAudioPreferences>)=>{
    const next={...current.current,...value,music:false};current.current=next;setSettings(next);engine.current?.configure(next,focused);
    if(next.music||next.effects)void engine.current?.unlock().then(()=>{setUnlocked(true);if(value.effects===true)engine.current?.cue('select');}).catch(()=>setUnlocked(false));
  },[focused]);
  return {settings,change,cue,unlocked};
}

export function ArenaAudioControls({audio}:{audio:ReturnType<typeof useArenaAudio>}){
 const {settings,change}=audio;
 return <div className="arena-audio-controls">

  <button type="button" className="arena-icon-button" aria-pressed={settings.effects} onClick={()=>change({effects:!settings.effects})}>{settings.effects?<Volume2 size={17}/>:<VolumeX size={17}/>}<span>Sound {settings.effects?'on':'off'}</span></button>
  <details className="arena-audio-settings" onKeyDown={event=>{if(event.key==='Escape')event.currentTarget.open=false;}}><summary aria-label="Audio settings"><SlidersHorizontal size={18}/></summary><div className="arena-audio-popover"><strong>Your arena. Your sound.</strong><label>Effects volume <output>{settings.effectsVolume}%</output><input aria-label="Effects volume" type="range" min="0" max="100" value={settings.effectsVolume} onChange={event=>change({effectsVolume:Number(event.target.value)})}/></label><p>Short sound effects only. Audio pauses when you leave this tab.</p></div></details>
 </div>;
}

export function ArenaScore({score}:{score:number}){
 const ref=useRef<HTMLSpanElement>(null);
 useEffect(()=>{if(!ref.current)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){ref.current.textContent=String(score);return;}const began=performance.now();let frame=0;const tick=(time:number)=>{const progress=Math.min(1,(time-began)/1050);if(ref.current)ref.current.textContent=String(Math.round(score*(1-(1-progress)**3)));if(progress<1)frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[score]);
 return <span ref={ref} className="arena-counted-score" aria-hidden="true">{score}</span>;
}
