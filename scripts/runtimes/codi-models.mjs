// SPDX-License-Identifier: GPL-3.0-or-later
import { env, pipeline, StyleTextToSpeech2Model, AutoTokenizer, Tensor } from '@huggingface/transformers';
import createEphone, { all } from 'ephone';
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;
let voiceModel; let tokenizer; let translator; let pronunciation; const styles = new Map();
const VOICE_REVISION = '1939ad2a8e416c0acfeecc08a694d14ef25f2231';
const TRANSLATION_REVISION = '7aad72006a1588a9c3485ed6203aed99eebbc872';
export async function createCodiAudio(text, language, progress = () => {}, device = 'wasm') {
  let previousMessage = '';
  const notify = message => { if (message !== previousMessage) { previousMessage = message; progress(message); } };
  if (!['en', 'hi'].includes(language) || typeof text !== 'string' || !text.trim() || text.length > 1000) throw new Error('Choose a shorter lesson line.');
  let spoken = text;
  if (language === 'hi') {
    notify('Loading Hindi translation model');
    translator ||= await pipeline('translation', 'Xenova/opus-mt-en-hi', { revision: TRANSLATION_REVISION, dtype: 'q8', device, progress_callback: () => notify('Downloading Hindi model files') });
    const result = await translator(text, { max_new_tokens: 256, do_sample: false });
    spoken = result[0]?.translation_text;
    if (typeof spoken !== 'string' || !/[\u0900-\u097f]/.test(spoken) || spoken.length > 2000) throw new Error('Hindi translation was not produced.');
  }
  notify('Loading natural voice model');
  voiceModel ||= await StyleTextToSpeech2Model.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { revision: VOICE_REVISION, dtype: 'q8', device, progress_callback: () => notify('Downloading voice model files') });
  tokenizer ||= await AutoTokenizer.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { revision: VOICE_REVISION });
  const voice = language === 'hi' ? 'hf_alpha' : 'af_heart';
  if (!styles.has(voice)) {
    const response = await fetch(`https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/${VOICE_REVISION}/voices/${voice}.bin`);
    if (!response.ok) throw new Error('The selected voice could not download.');
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength < 1024 || bytes.byteLength > 1048576 || bytes.byteLength % 1024) throw new Error('Invalid voice file.');
    styles.set(voice, new Float32Array(bytes));
  }
  notify('Preparing pronunciation');
  pronunciation ||= await createEphone(all);
  pronunciation.setVoice(language === 'hi' ? 'hi' : 'en-US');
  const phones = pronunciation.textToIpa(spoken).replace(/ʲ/g, 'j').replace(/r/g, 'ɹ');
  const { input_ids } = tokenizer(phones);
  if (input_ids.dims.at(-1) > 512) throw new Error('This line is too long for the voice. Select a shorter line.');
  const style = styles.get(voice); const position = Math.min(Math.max(0, input_ids.dims.at(-1) - 2), style.length / 256 - 1);
  notify('Generating speech on this device');
  const { waveform } = await voiceModel({ input_ids, style: new Tensor('float32', style.slice(position * 256, (position + 1) * 256), [1, 256]), speed: new Tensor('float32', [1], [1]) });
  return { text: spoken, samples: new Float32Array(waveform.data), rate: 24000 };
}
