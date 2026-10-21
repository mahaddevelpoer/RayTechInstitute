// Public lesson sentences only. Credentials and student explanations never enter
// this release. GitHub's unique asset names also provide a cross-worker lease.
export interface CodiRecording { audio: string; rate: number; model: string; transcript?: string }
type Language = 'en' | 'ur';
const repository = 'mahaddevelpoer/RayTechInstitute';
const tag = 'codi-prepared-audio-v1';
const site = 'https://raytechinstitute.web.app';
const version = 'sentence-urdu-v1';
export async function codiRecordingHash(text: string, language: Language) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${version}:Kore:${language}:${text.replace(/\s+/g, ' ').trim()}`));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
function validRecording(value: unknown): value is CodiRecording {
  const r = value as CodiRecording;
  return !!r && r.rate === 24000 && ['gemini-2.5-flash-preview-tts', 'gemini-2.5-flash-native-audio-preview-12-2025'].includes(r.model) && typeof r.audio === 'string' && r.audio.length >= 4 && r.audio.length <= 5800000 && /^[A-Za-z0-9+/]+={0,2}$/.test(r.audio) && atob(r.audio).length % 2 === 0;
}
export function createCodiAudioCache(token: string, fetcher: typeof fetch = fetch, hot?: {get(hash: string): Promise<CodiRecording | null>; put(hash: string, recording: CodiRecording): Promise<boolean>}) {
  let catalog: { until: number; hashes: Set<string> } | undefined;
  let releaseId = 0;
  const active = new Map<string, Promise<CodiRecording & { cacheSaved: boolean }>>();
  const api = (route: string, init: RequestInit = {}) => fetcher(`https://api.github.com/repos/${repository}${route}`, { ...init, signal: AbortSignal.timeout(10000), headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...init.headers } });
  async function published(hash: string) {
    if (!token) return false;
    if (!catalog || catalog.until < Date.now()) {
      const response = await fetcher(`${site}/codi/audio/catalog.json`, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw Error('Public audio catalog unavailable');
      const raw = await response.text(); if (raw.length > 12000000) throw Error('Audio catalog too large');
      const data = JSON.parse(raw);
      if (data.schema !== 1 || !Array.isArray(data.units) || data.units.length > 30000) throw Error('Invalid audio catalog');
      catalog = { until: Date.now() + 60000, hashes: new Set(data.units.map((unit: { hash: string }) => unit.hash).filter((key: unknown) => typeof key === 'string' && /^[a-f0-9]{64}$/.test(key))) };
    }
    return catalog.hashes.has(hash);
  }
  async function release() {
    if (!releaseId) { const r = await api(`/releases/tags/${tag}`); if (!r.ok) throw Error('Audio release unavailable'); releaseId = (await r.json()).id; }
    return releaseId;
  }
  // A known public release URL avoids listing thousands of assets on each click.
  async function lookup(hash: string) {
    const cached = await hot?.get(hash).catch(() => null); if (cached) return cached;
    const response = await fetcher(`https://github.com/${repository}/releases/download/${tag}/${hash}.json?cache=${Math.floor(Date.now() / 15000)}`, { signal: AbortSignal.timeout(10000) });
    if (response.status === 404) return null;
    if (!response.ok) throw Error('Shared recording unavailable');
    const raw = await response.text(); if (raw.length > 6000000) throw Error('Shared recording too large');
    const data = JSON.parse(raw); if (!validRecording(data)) throw Error('Invalid shared recording');
    await hot?.put(hash, data).catch(() => false);
    return data;
  }
  async function get(language: Language, text: string) {
    const hash = await codiRecordingHash(text, language);
    if (!await published(hash)) return null;
    return lookup(hash);
  }
  async function upload(id: number, name: string, body: string) {
    return fetcher(`https://uploads.github.com/repos/${repository}/releases/${id}/assets?name=${encodeURIComponent(name)}`, { method: 'POST', signal: AbortSignal.timeout(15000), headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' }, body });
  }
  async function expireLease(id: number, name: string) {
    // Recover a terminated worker using the immutable ID, never a newer lease.
    for (let page = 1; page <= 400; page++) {
      const r = await api(`/releases/${id}/assets?per_page=100&page=${page}`);
      if (!r.ok) return false;
      const assets = await r.json(); if (!Array.isArray(assets)) return false;
      const lock = assets.find(a => a.name === name);
      if (lock) {
        if (Date.now() - Date.parse(lock.created_at) < 180000 || !Number.isSafeInteger(lock.id)) return false;
        return (await api(`/releases/assets/${lock.id}`, { method: 'DELETE' })).ok;
      }
      if (assets.length < 100) return false;
    }
    return false;
  }
  async function run(language: Language, text: string, produce: () => Promise<CodiRecording>, authorize: () => Promise<void> = async () => {}) {
    const hash = await codiRecordingHash(text, language);
    if (!await published(hash)) { await authorize(); return { ...await produce(), cacheSaved: false }; }
    if (active.has(hash)) return active.get(hash)!;
    const task = (async () => {
      const saved = await lookup(hash); if (saved) return { ...saved, cacheSaved: true };
      // Quota denial must not cause repository writes, even for public text.
      await authorize();
      const id = await release();
      let lock = await upload(id, `${hash}.lock`, JSON.stringify({ expires: Date.now() + 180000 }));
      if (lock.status === 422 && await expireLease(id, `${hash}.lock`)) {
        const recovered = await lookup(hash); if (recovered) return { ...recovered, cacheSaved: true };
        lock = await upload(id, `${hash}.lock`, JSON.stringify({ expires: Date.now() + 180000 }));
      }
      if (!lock.ok) {
        // Never spend another generation on a sentence another worker owns.
        if (lock.status === 422) throw Error('Recording is already being prepared. Please try this sentence again shortly.');
        throw Error('Shared recording could not be reserved');
      }
      const lockId = (await lock.json()).id;
      try {
        const recording = await produce(); if (!validRecording(recording)) throw Error('Invalid generated recording');
        const saved = await upload(id, `${hash}.json`, JSON.stringify(recording));
        if (!saved.ok && saved.status !== 422) return { ...recording, cacheSaved: false };
        await hot?.put(hash, recording).catch(() => false);
        return { ...recording, cacheSaved: true };
      } finally { await api(`/releases/assets/${lockId}`, { method: 'DELETE' }).catch(() => undefined); }
    })();
    active.set(hash, task);
    try { return await task; } finally { active.delete(hash); }
  }
  return { get, run };
}
