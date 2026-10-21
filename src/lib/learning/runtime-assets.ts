type WasmLanguage = 'python' | 'php';
export interface RuntimeAssets { workerSource: string; assets: Record<string, ArrayBuffer> }
const pending = new Map<WasmLanguage, Promise<RuntimeAssets>>();
let domPending: Promise<string> | undefined;
export function loadDOMWorker(): Promise<string> {
  return domPending ??= readAsset('dom-worker.js', 1000000).then(bytes => new TextDecoder().decode(bytes)).catch(error => { domPending = undefined; throw error; });
}
const files = { python: ['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'], php: ['php.wasm'] };
async function readAsset(name: string, limit: number) {
  const response = await fetch(`/learning-runtimes/${name}`, { credentials: 'omit', cache: 'no-cache', signal: AbortSignal.timeout(90000) });
  if (!response.ok || !response.body) throw new Error('The coding runtime could not download. Check your connection and try again.');
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error('The coding runtime download was invalid. Please reload and try again.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  if (size < 100) throw new Error('A coding runtime file is incomplete. Please try again later.');
  const result = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
  if (name.endsWith('.wasm') && (result[0] !== 0 || result[1] !== 97 || result[2] !== 115 || result[3] !== 109)) throw new Error('The coding runtime file is invalid. Please try again later.');
  return result.buffer;
}
/** Lazy page-memory cache. Downloads contain only public interpreter files. */
export function loadRuntimeAssets(language: WasmLanguage): Promise<RuntimeAssets> {
  let promise = pending.get(language);
  if (!promise) {
    promise = (async () => {
      const [worker, entries] = await Promise.all([
        readAsset(`${language}-worker.js`, 3000000),
        Promise.all(files[language].map(async name => [name, await readAsset(name, 24000000)] as const)),
      ]);
      return { workerSource: new TextDecoder().decode(worker), assets: Object.fromEntries(entries) };
    })().catch(error => { pending.delete(language); throw error; });
    pending.set(language, promise);
  }
  return promise;
}
