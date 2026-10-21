// SPDX-License-Identifier: GPL-3.0-or-later
import { env } from '@huggingface/transformers';
import { createCodiAudio } from './codi-models.mjs';
env.backends.onnx.wasm.wasmPaths = '/codi/runtime/';
let busy = false;
self.onmessage = async event => {
  const { id, text, language } = event.data || {};
  if (busy || typeof id !== 'string' || id.length > 80 || typeof text !== 'string' || text.length > 1000 || !['en', 'hi'].includes(language)) return;
  busy = true;
  try {
    const audio = await createCodiAudio(text, language, message => self.postMessage({ id, type: 'progress', message }));
    self.postMessage({ id, type: 'audio', ...audio }, [audio.samples.buffer]);
  } catch { self.postMessage({ id, type: 'error', message: 'Codi could not prepare this line. Check your connection, try a shorter line, or stop and retry.' }); }
  finally { busy = false; }
};
