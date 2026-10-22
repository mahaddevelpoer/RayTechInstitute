import { codiWav } from './codi-line';
import { codiAudioKeyMaterial } from './codi-sentences';
type Language = 'en' | 'ur';
const cacheName = 'codi-gemini-reading-v2';
const model = 'gemini-2.5-flash-preview-tts';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://btxrkhwyugzliswznkpx.supabase.co';
let guestId: string;
const sharedMisses = new Map<string, number>();
let storageUnavailableUntil = 0;
let prepared: Promise<Set<string>> | undefined; let preparedAt = 0;
async function preparedIndex() {
  if(!prepared || Date.now()-preparedAt>60000){preparedAt=Date.now();prepared=(async()=>{try{const response=await fetch('/codi/audio/index.json',{credentials:'omit'});if(!response.ok)return new Set<string>();const data=await response.json();if(data.schema!==1||!Array.isArray(data.ready)||data.ready.length>30000)return new Set<string>();return new Set<string>(data.ready.filter((key: unknown)=>typeof key==='string'&&/^[a-f0-9]{64}$/.test(key)));}catch{return new Set<string>();}})();}return prepared;
}
async function audioHash(text: string,language: Language) {
  const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(codiAudioKeyMaterial(text,language))));return Array.from(digest,b=>b.toString(16).padStart(2,'0')).join('');
}
export { audioHash as codiAudioIdentity };
export async function hasPreparedCodiReading(chunks: string[],language: Language) {
  if(!chunks.length)return false;const ready=await preparedIndex();
  for(const chunk of chunks)if(!ready.has(await audioHash(chunk,language))){
    // Long lessons ask once instead of probing hundreds of missing sentences.
    if(chunks.length>4)return false;
    try { await codiCloudReading(chunk,language,AbortSignal.timeout(15000),false); } catch { return false; }
  }return true;
}
function codiGuestId() {
  if (guestId) return guestId;
  try { const saved = sessionStorage.getItem('codi-voice-session'); if (saved && /^[a-f0-9-]{36}$/i.test(saved)) guestId = saved; } catch { /* Storage can be disabled. */ }
  guestId ||= crypto.randomUUID();
  try { sessionStorage.setItem('codi-voice-session', guestId); } catch { /* In-memory identity is enough for this tab. */ }
  return guestId;
}
export async function codiCloudRequest(body: Record<string, unknown>, signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Stopped', 'AbortError');
  const response = await fetch(`${supabaseUrl}/functions/v1/codi-voice`, { method: 'POST', signal, credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, guestId: codiGuestId(), consent: body.action === 'cached' ? false : true }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(typeof data.error === 'string' ? data.error.slice(0, 250) : 'Codi cloud voice is unavailable.'),{status:response.status});
  return data;
}
function decodePcm(data: string): Float32Array {
  if (typeof data !== 'string' || data.length > 5800000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data)) throw new Error('Invalid voice audio.');
  const raw = atob(data); if (raw.length % 2) throw new Error('Invalid voice samples.');
  const samples = new Float32Array(raw.length / 2);
  for (let i = 0; i < samples.length; i++) { const value = raw.charCodeAt(i * 2) | raw.charCodeAt(i * 2 + 1) << 8; samples[i] = (value > 32767 ? value - 65536 : value) / 32768; }
  return samples;
}
/** Static audio, browser cache, then shared server cache. Only a consented read
 * action can generate speech. Tokens and identity are never cached. */
export async function codiCloudReading(text: string, language: Language, signal: AbortSignal, allowCloud = true): Promise<Blob> {
  if (signal.aborted) throw new DOMException('Stopped', 'AbortError');
  const hash = await audioHash(text,language);
  if((await preparedIndex()).has(hash)){
    const response=await fetch(`/codi/audio/${hash}.mp3`,{credentials:'omit',signal});
    if(response.ok){const blob=await response.blob();if(blob.size>=100&&blob.size<=2000000&&blob.type.startsWith('audio/'))return blob;}
    if(!allowCloud)throw new Error('This prepared recording could not load. Reload the lesson or allow live voice to regenerate it.');
  }
  const key = `${location.origin}/codi/audio-cache/${hash}.wav`;
  let cache: Cache | undefined;
  try { if ('caches' in globalThis) { cache = await caches.open(cacheName); const found = await cache.match(key); if (found && found.headers.get('content-type') === 'audio/wav') { const blob = await found.blob(); if (blob.size >= 44 && blob.size <= 4400000) return blob; } } } catch { /* Storage can be disabled; playback must still work. */ }
  let data;
  // Public, content-addressed lesson audio can be served by Storage's CDN
  // directly, avoiding an Edge cold start and GitHub's download redirect.
  let connectionDeadline: ReturnType<typeof setTimeout> | undefined;
  if(Date.now()>=storageUnavailableUntil)try {
    const connection=new AbortController();connectionDeadline=setTimeout(()=>connection.abort(),2500);
    const response=await fetch(`${supabaseUrl}/storage/v1/object/public/codi-lesson-audio/${hash}.json`,{credentials:'omit',signal:AbortSignal.any([signal,connection.signal,AbortSignal.timeout(45000)])});
    // Fail over quickly if Storage cannot connect, but allow a slow mobile
    // connection to finish downloading an otherwise healthy audio response.
    clearTimeout(connectionDeadline);
    if(response.status>=500||response.status===429)storageUnavailableUntil=Date.now()+30000;
    if(response.ok){const raw=await response.text();if(raw.length<=6000000){const saved=JSON.parse(raw);if(saved?.rate===24000&&[model,'gemini-2.5-flash-native-audio-preview-12-2025'].includes(saved.model)&&typeof saved.audio==='string'){decodePcm(saved.audio);data=saved;}}}
  }catch(error){if(signal.aborted)throw error;storageUnavailableUntil=Date.now()+30000;}finally{clearTimeout(connectionDeadline);}
  if(!data && !allowCloud){
    if((sharedMisses.get(hash)||0)>Date.now())throw new Error('This sentence has no prepared recording yet. Allow live voice to generate it.');
    data=await codiCloudRequest({action:'cached',language,text,consent:false},signal);
    if(data.cached===false){
      if(sharedMisses.size>=64)sharedMisses.delete(sharedMisses.keys().next().value!);
      sharedMisses.set(hash,Date.now()+15000);
      throw new Error('This sentence has no prepared recording yet. Allow live voice to generate it.');
    }
  }else if(!data)try { data=await codiCloudRequest({ action: 'read', language, text }, signal); }
  catch(error){
    if((error as {status?:number}).status!==409)throw error;
    // A different tab/worker owns this immutable recording. Poll read-only;
    // never spend a second AI generation while the first one is finishing.
    for(let attempt=0;attempt<15;attempt++){
      await new Promise<void>((resolve,reject)=>{const stop=()=>{clearTimeout(timer);reject(new DOMException('Stopped','AbortError'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',stop);resolve();},2000);signal.addEventListener('abort',stop,{once:true});if(signal.aborted)stop();});
      const saved=await codiCloudRequest({action:'cached',language,text,consent:false},signal);
      if(saved.audio){data=saved;break;}
    }
    if(!data)throw new Error('This recording is still being saved. Try this line again shortly; no second generation was started.');
  }
  if (data.audioId && data.audioId!==hash) throw new Error('The recording does not match the selected line.');
  if (data.rate !== 24000 || ![model, 'gemini-2.5-flash-native-audio-preview-12-2025'].includes(data.model)) throw new Error('Unexpected voice format.');
  const blob = new Blob([codiWav(decodePcm(data.audio), 24000) as BlobPart], { type: 'audio/wav' });
  if (signal.aborted) throw new DOMException('Stopped', 'AbortError');
  try { if (cache && data.cacheEligible!==false) { const entries = await cache.keys(); for (const entry of entries.slice(0, Math.max(0, entries.length - 23))) await cache.delete(entry); await cache.put(key, new Response(blob, { headers: { 'Content-Type': 'audio/wav' } })); } } catch { /* Quota failure must not prevent audio. */ }
  return blob;
}
/** One short-lived session per explanation. No microphone access, tools or SDK bundle. */
export async function codiCloudExplain(text: string, context: string, language: Language, audio: AudioContext, signal: AbortSignal, onSpeaking: () => void, onTranscript: (text: string) => void): Promise<void> {
  const session = await codiCloudRequest({ action: 'live', text: text.slice(0, 2000), context: context.slice(0, 12000), language }, signal);
  const endpoint = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained';
  if (session.endpoint !== endpoint || session.model !== 'gemini-2.5-flash-native-audio-preview-12-2025' || typeof session.token !== 'string' || !session.token.startsWith('auth_tokens/')) throw new Error('Invalid voice session.');
  if (signal.aborted) throw new DOMException('Stopped', 'AbortError');
  return new Promise<void>((resolve, reject) => {
    const socket = new WebSocket(`${endpoint}?access_token=${encodeURIComponent(session.token)}`);
    const playing = new Set<AudioBufferSourceNode>();
    let nextTime = audio.currentTime; let transcript = ''; let received = false; let settled = false; let completing = false; let samplesTotal = 0;
    let chain = Promise.resolve(); let deadline: ReturnType<typeof setTimeout>;
    const finish = (error?: Error) => {
      if (settled) return; settled = true; clearTimeout(deadline); signal.removeEventListener('abort', abort);
      socket.onclose = null; socket.onerror = null; socket.close();
      playing.forEach(node => { node.onended = null; try { node.stop(); } catch {} node.disconnect(); }); playing.clear();
      if (error) reject(error); else resolve();
    };
    const abort = () => finish(new DOMException('Stopped', 'AbortError'));
    deadline = setTimeout(() => finish(new Error('Codi voice connection took too long. Please retry.')), 45000);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) { abort(); return; }
    socket.onopen = () => socket.send(JSON.stringify({ setup: { model: `models/${session.model}` } }));
    socket.onerror = () => finish(new Error('Gemini Live could not connect. Check your connection and voice allowance.'));
    socket.onclose = () => { if (!completing) finish(new Error('Gemini Live disconnected before the explanation finished.')); };
    socket.onmessage = event => {
      chain = chain.then(async () => {
        if (settled) return;
        const raw = typeof event.data === 'string' ? event.data : await (event.data as Blob).text();
        if (raw.length > 6000000) throw new Error('Voice response is too large.');
        const msg = JSON.parse(raw);
        if (msg.error) throw new Error('Gemini Live rejected this session. Please retry later.');
        if (msg.setupComplete) socket.send(JSON.stringify({ clientContent: { turns: [{ role: 'user', parts: [{ text: `Explain this selected concept using the provided lesson source: ${text}` }] }], turnComplete: true } }));
        const content = msg.serverContent;
        if (!content) return;
        if (content.interrupted) throw new Error('The explanation was interrupted. Select the text again.');
        for (const part of content.modelTurn?.parts || []) if (part.inlineData) {
          const inline = part.inlineData;
          if (!/^audio\/pcm;rate=24000$/.test(inline.mimeType)) throw new Error('Unsupported live voice format.');
          const samples = decodePcm(inline.data); samplesTotal += samples.length;
          if (samplesTotal > 24000 * 120) throw new Error('Voice explanation exceeded its limit.');
          const buffer = audio.createBuffer(1, samples.length, 24000); buffer.getChannelData(0).set(samples);
          const node = audio.createBufferSource(); node.buffer = buffer; node.connect(audio.destination); playing.add(node);
          node.onended = () => { node.disconnect(); playing.delete(node); if (completing && !playing.size) finish(); };
          nextTime = Math.max(nextTime, audio.currentTime + .03); node.start(nextTime); nextTime += buffer.duration;
          received = true; onSpeaking();
        }
        if (content.outputTranscription?.text) { transcript = (transcript + content.outputTranscription.text).slice(0, 10000); onTranscript(transcript); }
        if (content.turnComplete) {
          if (!received) throw new Error('Gemini returned no playable explanation.');
          completing = true; clearTimeout(deadline); socket.onclose = null; socket.close();
          deadline = setTimeout(() => finish(new Error('Audio playback could not finish.')), Math.max(1000, (nextTime - audio.currentTime) * 1000 + 5000));
          if (!playing.size) finish();
        }
      }).catch(error => finish(error instanceof Error ? error : new Error('Invalid voice response.')));
    };
  });
}
