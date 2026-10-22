import type { CodiRecording } from './codi-audio-cache.ts';
export const CODI_BUCKET = 'codi-lesson-audio';
const MAX_BYTES = 250000000;
const MAX_FILE = 6000000;
/** Bounded hot cache. GitHub remains the durable copy before any eviction. */
export function createCodiStorageCache(base: string, serviceKey: string, fetcher: typeof fetch = fetch) {
  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' };
  const root = `${base}/storage/v1`;
  const safe = (hash: string) => /^[a-f0-9]{64}$/.test(hash);
  async function get(hash: string): Promise<CodiRecording | null> {
    if (!safe(hash)) return null;
    try {
      const r = await fetcher(`${root}/object/public/${CODI_BUCKET}/${hash}.json`, { signal: AbortSignal.timeout(3000) });
      if (!r.ok) return null;
      const raw = await r.text(); if (raw.length > MAX_FILE) return null;
      const data = JSON.parse(raw);
      if (!data || data.rate !== 24000 || !['gemini-2.5-flash-preview-tts','gemini-2.5-flash-native-audio-preview-12-2025'].includes(data.model) || typeof data.audio !== 'string' || data.audio.length > 5800000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data.audio) || atob(data.audio).length % 2) return null;
      return data;
    } catch { return null; }
  }
  async function put(hash: string, recording: CodiRecording) {
    if (!safe(hash) || !serviceKey) return false;
    const body = JSON.stringify(recording); const bytes = new TextEncoder().encode(body).length;
    if (bytes > MAX_FILE) return false;
    try {
      const list = await fetcher(`${root}/object/list/${CODI_BUCKET}`, { method:'POST',headers,signal:AbortSignal.timeout(3000),body:JSON.stringify({prefix:'',limit:1000,offset:0,sortBy:{column:'created_at',order:'asc'}}) });
      if (!list.ok) return false;
      const objects = await list.json();
      // Do not infer capacity from an incomplete listing or unknown metadata.
      if (!Array.isArray(objects) || objects.length >= 1000 || objects.some(o=>!Number.isFinite(Number(o.metadata?.size)) || Number(o.metadata.size)<0 || !/^[a-f0-9]{64}\.json$/.test(o.name))) return false;
      if (objects.some(o=>o.name===`${hash}.json`)) return true;
      const used = objects.reduce((total,o)=>total+Number(o.metadata.size),0);
      // Pin existing recordings. A full free cache must not discard the only
      // surviving copy of a line; new recordings can still use GitHub.
      if (used+bytes > MAX_BYTES || objects.length >= 500) return false;
      const uploaded = await fetcher(`${root}/object/${CODI_BUCKET}/${hash}.json`, {method:'POST',headers:{...headers,'cache-control':'public,max-age=31536000,immutable','x-upsert':'false'},signal:AbortSignal.timeout(5000),body});
      return uploaded.ok || uploaded.status === 409;
    } catch { return false; }
  }
  return {get,put};
}
