'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize } from 'lucide-react';
import { loadLessonYouTubeAPI, lessonVideoURL, videoTime, boundedVideoTime, type LessonVideoPlayer } from '@/lib/learning/youtube-player';

export function LessonVideo({ videoId, title }: { videoId: string; title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<LessonVideoPlayer | null>(null);
  const scrub = useRef(false);
  const seekTimer = useRef<ReturnType<typeof setTimeout>>();
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [rates, setRates] = useState([1]);
  const [notice, setNotice] = useState('');
  const [connectionAttempt, setConnectionAttempt] = useState(0);
  useEffect(() => {
    if (!loaded || !host.current) return;
    let cancelled = false;
    let videoFailed = false;
    let instance: LessonVideoPlayer | null = null;
    let poll: ReturnType<typeof setInterval> | undefined;
    const element = host.current;
    setReady(false); setPlaying(false); setTime(0); setDuration(0);
    const frame = document.createElement('iframe');
    frame.title = title + ' teaching video';
    try { frame.src = lessonVideoURL(videoId, window.location.origin); }
    catch { setNotice('This lesson video link is invalid.'); return; }
    frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.allowFullscreen = true; frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.className = 'lesson-video-frame';
    element.replaceChildren(frame);
    function refresh() {
      if (cancelled || !instance || document.hidden) return;
      try {
        const length = instance.getDuration();
        setDuration(Number.isFinite(length) ? Math.max(0, length) : 0);
        if (!scrub.current) setTime(boundedVideoTime(instance.getCurrentTime(), length));
        const audio = instance.getVolume();
        if (Number.isFinite(audio)) setVolume(Math.max(0, Math.min(100, audio)));
        setMuted(instance.isMuted());
        const speed = instance.getPlaybackRate(); if (Number.isFinite(speed) && speed > 0) setRate(speed);
        const available = instance.getAvailablePlaybackRates();
        const speeds = Array.isArray(available) ? available.filter(value => Number.isFinite(value) && value > 0 && value <= 4) : [];
        const nextRates = speeds.length ? Array.from(new Set(speeds)) : [1];
        setRates(previous => previous.join(',') === nextRates.join(',') ? previous : nextRates);
        setPlaying(instance.getPlayerState() === 1);
      } catch { /* The native player remains usable while metadata loads. */ }
    }
    const onOtherPlay = (event: Event) => {
      if ((event as CustomEvent).detail !== frame && instance) try { instance.pauseVideo(); } catch { /* Disposed frame. */ }
    };
    window.addEventListener('raytech-lesson-video-playing', onOtherPlay);
    const deadline = setTimeout(() => { if (!cancelled) setNotice('Extra controls could not connect. Use the YouTube controls or the direct video link.'); }, 20000);
    void loadLessonYouTubeAPI().then(api => {
      if (cancelled) return;
      instance = new api.Player(frame, { events: {
        onReady(event) {
          if (cancelled || videoFailed) return;
          clearTimeout(deadline); instance = event.target; player.current = instance;
          setReady(true); setNotice('');
          refresh();
          poll = setInterval(refresh, 500);
        },
        onStateChange(event) {
          if (cancelled) return;
          if (event.data === 1) { setNotice(''); window.dispatchEvent(new CustomEvent('raytech-lesson-video-playing', { detail: frame })); }
          refresh();
        },
        onPlaybackRateChange(event) { if (!cancelled) setRate(event.data); },
        onAutoplayBlocked() { if (!cancelled) setNotice('Your browser blocked the play request. Press Play inside the YouTube player.'); },
        onError(event) {
          if (cancelled) return;
          videoFailed = true; clearTimeout(deadline); clearInterval(poll); setReady(false); setPlaying(false);
          setNotice([101, 150].includes(event.data) ? 'This video cannot play on other websites. Open it on YouTube.' : 'This video is unavailable here. Try its YouTube link.');
        },
      } });
      player.current = instance;
    }).catch(() => { if (!cancelled) { clearTimeout(deadline); setNotice('Extra controls are unavailable. Use the YouTube player controls below or open the direct link.'); } });
    return () => {
      cancelled = true; clearTimeout(deadline); clearInterval(poll); clearTimeout(seekTimer.current);
      window.removeEventListener('raytech-lesson-video-playing', onOtherPlay);
      player.current = null; try { instance?.destroy(); } catch { /* Frame may already be removed. */ }
      element.replaceChildren();
    };
  }, [loaded, videoId, title, connectionAttempt]);
  function seek(value: number) {
    clearTimeout(seekTimer.current); scrub.current = false;
    const next = boundedVideoTime(value, duration); setTime(next);
    try { player.current?.seekTo(next, true); } catch { setNotice('Seeking is unavailable. Try the YouTube controls.'); }
  }
  function command(run: (instance: LessonVideoPlayer) => void) {
    if (!ready || !player.current) return;
    try { run(player.current); } catch { setNotice('This control is unavailable. Try the YouTube player controls.'); }
  }
  return <div ref={container} className="lesson-video mb-6">
    {!loaded ? <div className="lesson-video-placeholder"><p className="font-semibold">{title}</p><p className="max-w-lg text-sm">Load this RayTech lesson through YouTube. Playback uses YouTube's player and privacy policies.</p><button className="learn-button" onClick={() => { setReady(false); setNotice(''); setLoaded(true); }}><Play size={18} />Load lesson video</button></div> : <div ref={host} className="lesson-video-host" />}
    {loaded && <div className="space-y-3 border-t border-[var(--border)] p-3">
      <label className="block text-xs font-semibold">Playback position: {videoTime(time)} / {duration ? videoTime(duration) : '--:--'}<input className="block min-h-12 w-full accent-teal-700" type="range" min={0} max={duration || 1} step={1} value={Math.min(time, duration || 1)} disabled={!ready || !duration} aria-valuetext={`${videoTime(time)} of ${videoTime(duration)}`} onChange={event => { scrub.current = true; const value = Number(event.target.value); setTime(value); clearTimeout(seekTimer.current); seekTimer.current = setTimeout(() => seek(value), 150); }} onPointerUp={event => seek(Number(event.currentTarget.value))} onKeyUp={event => seek(Number(event.currentTarget.value))} /></label>
      <div className="flex flex-wrap items-center gap-2">
        <button className="learn-button" disabled={!ready} aria-label={playing ? 'Pause lesson' : 'Play lesson'} onClick={() => command(instance => playing ? instance.pauseVideo() : instance.playVideo())}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
        <button className="learn-button" disabled={!ready || !duration} aria-label="Rewind 10 seconds" onClick={() => seek(time - 10)}><RotateCcw size={18} /><span className="text-xs">10s</span></button>
        <button className="learn-button" disabled={!ready || !duration} aria-label="Forward 10 seconds" onClick={() => seek(time + 10)}><RotateCw size={18} /><span className="text-xs">10s</span></button>
        <button className="learn-button" disabled={!ready} aria-label={muted ? 'Unmute lesson' : 'Mute lesson'} onClick={() => command(instance => { if (muted) instance.unMute(); else instance.mute(); setMuted(instance.isMuted()); })}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
        <label className="flex min-h-12 items-center gap-2 text-xs">Speed<select className="min-h-12 rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2" value={rate} disabled={!ready} onChange={event => command(instance => instance.setPlaybackRate(Number(event.target.value)))}>{rates.map(value => <option key={value} value={value}>{value}x</option>)}</select></label>
        <button className="learn-button" disabled={!ready} aria-label="Full screen lesson player" onClick={async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await container.current?.requestFullscreen(); } catch { setNotice('Full screen is unavailable here. Use the YouTube full-screen control.'); } }}><Maximize size={18} /></button>
      </div>
      <label className="flex min-h-12 flex-wrap items-center gap-3 text-xs">Volume<input type="range" min={0} max={100} value={volume} disabled={!ready} className="min-h-12 max-w-full accent-teal-700" onChange={event => command(instance => { instance.setVolume(Number(event.target.value)); setVolume(instance.getVolume()); })} /><span>{muted ? 'Muted' : `${Math.round(volume)}%`}</span></label>
      <p className="text-xs text-[var(--text-muted)]">Captions and video quality are available in the YouTube controls. Your device may manage audio volume.</p>
    </div>}
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-3 py-2"><span className="text-xs">RayTech Institute · YouTube lesson</span><a className="learn-button" href={`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`} target="_blank" rel="noopener noreferrer">Open on YouTube</a></div>
    {notice && <div className="space-y-3 px-3 pb-3"><p role="status" className="text-sm">{notice}</p>{loaded && !ready && <button className="learn-button" onClick={() => { setNotice(''); setConnectionAttempt(value => value + 1); }}>Reload player</button>}</div>}
  </div>;
}
