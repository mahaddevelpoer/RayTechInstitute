export interface LessonVideoPlayer {
  playVideo(): void; pauseVideo(): void; destroy(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number; getDuration(): number; getPlayerState(): number;
  getVolume(): number; setVolume(volume: number): void; isMuted(): boolean; mute(): void; unMute(): void;
  getPlaybackRate(): number; setPlaybackRate(rate: number): void; getAvailablePlaybackRates(): number[];
}
export interface LessonYouTubeAPI {
  Player: new (element: HTMLElement, options: { events: {
    onReady: (event: { target: LessonVideoPlayer }) => void;
    onStateChange: (event: { data: number }) => void;
    onError: (event: { data: number }) => void;
    onPlaybackRateChange?: (event: { data: number }) => void;
    onAutoplayBlocked?: () => void;
  } }) => LessonVideoPlayer;
}
let pending: Promise<LessonYouTubeAPI> | null = null;
export function loadLessonYouTubeAPI(): Promise<LessonYouTubeAPI> {
  if (typeof window === 'undefined') return Promise.reject(new Error('The video API requires a browser.'));
  const target = window as unknown as { YT?: LessonYouTubeAPI; onYouTubeIframeAPIReady?: () => void };
  if (target.YT?.Player) return Promise.resolve(target.YT);
  if (pending) return pending;
  pending = new Promise<LessonYouTubeAPI>((resolve, reject) => {
    const previous = target.onYouTubeIframeAPIReady;
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api'; script.async = true;
    let complete = false;
    const finish = (error?: Error) => {
      if (complete) return; complete = true; clearTimeout(deadline);
      if (target.onYouTubeIframeAPIReady === ready) target.onYouTubeIframeAPIReady = previous;
      script.onerror = null;
      if (error || !target.YT?.Player) { script.remove(); reject(error || new Error('The video API is unavailable.')); }
      else resolve(target.YT);
    };
    const ready = () => { try { previous?.(); } catch { /* Other integrations cannot prevent this loader from resolving. */ } finish(); };
    const deadline = setTimeout(() => finish(new Error('The video API timed out.')), 15000);
    target.onYouTubeIframeAPIReady = ready;
    script.onerror = () => finish(new Error('The video API could not load.'));
    try { document.head.appendChild(script); } catch { finish(new Error('The video API could not be attached.')); }
  }).catch(error => { pending = null; throw error; });
  return pending;
}
export function lessonVideoURL(id: string, origin: string) {
  if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) throw new Error('Invalid lesson video.');
  const url = new URL('https://www.youtube-nocookie.com/embed/' + id);
  url.search = new URLSearchParams({ enablejsapi: '1', origin, controls: '1', playsinline: '1', rel: '0', autoplay: '0' }).toString();
  return url.href;
}
export function videoTime(value: number) {
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  return (hours ? `${hours}:${String(minutes).padStart(2, '0')}` : String(minutes)) + ':' + String(seconds % 60).padStart(2, '0');
}
export function boundedVideoTime(value: number, duration: number) {
  return Math.max(0, Math.min(Number.isFinite(duration) ? duration : 0, Number.isFinite(value) ? value : 0));
}
