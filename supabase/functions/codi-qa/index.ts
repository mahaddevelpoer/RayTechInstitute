import { createLearningQAHandler, verifyQAServiceCredential } from '../_shared/learning-qa-handler.ts';
import { mintCodiToken, generateCodiSpeech, CODI_LIVE_ENDPOINT, CODI_LIVE_MODEL } from '../_shared/codi-cloud.ts';
// Temporary, service-credential-only probe. No lesson writes or student bypass.
Deno.serve(createLearningQAHandler(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '', Date.parse('2026-10-22T18:59:00Z'), async request => {
  const check = new URL(request.url).searchParams.get('check');
  const key = Deno.env.get('GEMINI_API_KEY') || '';
  if (!key) return { configured: false };
  const diagnostics: { endpoint: string; status: number; message?: string; details?: unknown[] }[] = [];
  const events: unknown[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    const response = await fetch(input, init);
    if (!response.ok) {
      const result = await response.clone().json().catch(() => ({}));
      const details = (Array.isArray(result.error?.details) ? result.error.details : []).filter((d: { '@type'?: string }) => /(?:QuotaFailure|RetryInfo|ErrorInfo)$/.test(d['@type'] || ''));
      const safeDetails = JSON.parse(JSON.stringify(details).replace(/AIza[\w-]+/g, '[redacted]').slice(0, 12000) || '[]');
      diagnostics.push({ endpoint: String(input).split('?')[0], status: response.status, message: String(result.error?.message || '').replace(/AIza[\w-]+/g, '[redacted]').slice(0, 1600), details: safeDetails });
    }
    return response;
  };
  try {
    if (check === 'live') {
      const token = await mintCodiToken(key, 'en', 'In Python, a variable names a value. score = 3 assigns the integer 3 to score.', fetcher);
      const result = await new Promise(resolve => {
        const socket = new WebSocket(`${CODI_LIVE_ENDPOINT}?access_token=${encodeURIComponent(token.token)}`);
        let bytes = 0; let transcript = ''; let setup = false;
        const finish = (value: unknown) => { clearTimeout(timer); socket.close(); resolve(value); };
        const timer = setTimeout(() => finish({ success: false, setup, bytes, reason: 'probe deadline' }), 30000);
        socket.onopen = () => socket.send(JSON.stringify({ setup: { model: `models/${CODI_LIVE_MODEL}` } }));
        socket.onmessage = async event => {
          const raw = typeof event.data === 'string' ? event.data : await event.data.text();
          const msg = JSON.parse(raw);
          if (msg.setupComplete) { setup = true; socket.send(JSON.stringify({ clientContent: { turns: [{ role: 'user', parts: [{ text: 'Explain what score = 3 means in one sentence.' }] }], turnComplete: true } })); }
          for (const part of msg.serverContent?.modelTurn?.parts || []) if (part.inlineData?.data) bytes += Math.floor(part.inlineData.data.length * .75);
          transcript += msg.serverContent?.outputTranscription?.text || '';
          if (msg.serverContent?.turnComplete) finish({ success: bytes > 1000, setup, bytes, transcript: transcript.slice(0, 600) });
          if (msg.error) finish({ success: false, reason: String(msg.error.message).slice(0, 300) });
        };
        socket.onerror = () => finish({ success: false, setup, bytes, reason: 'socket error' });
        socket.onclose = event => finish({ success: false, setup, bytes, code: event.code, reason: event.reason.slice(0, 300) });
      });
      return { check, result, diagnostics };
    }
    if (check === 'tts-en' || check === 'tts-ur') {
      const started = Date.now();
      const speech = await generateCodiSpeech(key, check === 'tts-ur' ? 'ur' : 'en', 'A variable is a name that refers to a value. In Python, score equals three.', fetcher, url => {
        const socket = new WebSocket(url);
        socket.addEventListener('message', async event => {
          const msg = JSON.parse(typeof event.data === 'string' ? event.data : await event.data.text());
          if (events.length < 20) events.push({ keys: Object.keys(msg), contentKeys: Object.keys(msg.serverContent || {}), text: (msg.serverContent?.modelTurn?.parts || []).map((p: { text?: string; inlineData?: { mimeType: string } }) => ({ text: p.text?.slice(0, 400), audio: p.inlineData?.mimeType })), transcript: msg.serverContent?.outputTranscription?.text });
        });
        return socket;
      });
      const pcm = atob(speech.audio); let nonzero = false; for (let i = 0; i < pcm.length; i++) if (pcm.charCodeAt(i)) { nonzero = true; break; }
      return { check, success: pcm.length > 1000 && nonzero, bytes: pcm.length, rate: speech.rate, model: speech.model, transcript: 'transcript' in speech ? speech.transcript : undefined, elapsedMs: Date.now() - started, diagnostics };
    }
    return { error: 'Unknown check' };
  } catch (error) { return { check, success: false, message: error instanceof Error ? error.message : 'Probe failed', diagnostics, events }; }
}, verifyQAServiceCredential));
