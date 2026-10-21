/** Incremental SSE framing shared by the Edge provider and authenticated UI. */
export async function consumeLearningSse(response: Response, onData: (data: string) => void | boolean | Promise<void | boolean>) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('The generation stream is empty.');
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let buffer = ''; let data: string[] = [];
  const line = async (value: string) => {
    if (value.endsWith('\r')) value = value.slice(0, -1);
    if (!value) { const message = data.join('\n'); data = []; if (message) return await onData(message); }
    else if (value.startsWith('data:')) data.push(value.slice(5).replace(/^ /, ''));
    if (data.join('\n').length > 500000) throw new Error('The generation event exceeded its safety limit.');
  };
  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      let index;
      while ((index = buffer.indexOf('\n')) >= 0) {
        const next = buffer.slice(0, index); buffer = buffer.slice(index + 1);
        if (await line(next) === false) return;
      }
      if (buffer.length > 500000) throw new Error('The generation event exceeded its safety limit.');
      if (done) { if (buffer && await line(buffer) === false) return; await line(''); return; }
    }
  } finally { try { await reader.cancel(); } catch { /* The source may already be closed. */ } reader.releaseLock(); }
}

export type LearningStreamEvent = { type: 'stage' | 'delta'; stage: string; text?: string; model?: string };

export async function readLearningGenerationResult(response: Response, onEvent: (event: LearningStreamEvent) => void = () => {}) {
  let result: Record<string, any> | undefined;
  await consumeLearningSse(response, data => {
    let event;
    try { event = JSON.parse(data); } catch { throw new Error('The generation stream was interrupted. Reload the catalog before retrying.'); }
    if (event?.type === 'error') throw new Error(typeof event.error === 'string' ? event.error.slice(0, 2000) : 'Generation failed.');
    if (event?.type === 'result') {
      if (!event.result?.success || typeof event.result.topicId !== 'string') throw new Error('The service did not confirm a saved draft.');
      result = event.result; return false;
    }
    if ((event?.type === 'stage' || event?.type === 'delta') && typeof event.stage === 'string'
      && (event.type !== 'delta' || typeof event.text === 'string')) onEvent(event);
  });
  if (!result) throw new Error('The connection ended without a save confirmation. Reload the catalog before retrying.');
  return result;
}

export function learningGenerationResponse(headers: Record<string, string>, run: (emit: (event: LearningStreamEvent) => void, signal: AbortSignal) => Promise<unknown>) {
  const abort = new AbortController();
  const encoder = new TextEncoder(); let closed = false; let heartbeat: ReturnType<typeof setInterval> | undefined;
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (value: unknown) => { if (!closed) controller.enqueue(encoder.encode(`data: ${JSON.stringify(value)}\n\n`)); };
      send({ type: 'stage', stage: 'Connecting to Dots3-Note Preview' });
      heartbeat = setInterval(() => { if (!closed) { try { controller.enqueue(encoder.encode(': keep-alive\n\n')); } catch { abort.abort(); } } }, 15000);
      void (async () => {
        try { const result = await run(send, abort.signal); if (!abort.signal.aborted) send({ type: 'result', result }); }
        catch (error) { if (!abort.signal.aborted) send({ type: 'error', error: error instanceof Error ? error.message : 'Generation failed. Reload the catalog before retrying.' }); }
        finally { clearInterval(heartbeat); if (!closed) { closed = true; controller.close(); } }
      })();
    },
    cancel() { closed = true; clearInterval(heartbeat); abort.abort(); },
  });
  return new Response(body, { headers: { ...headers, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store, no-transform', 'X-Accel-Buffering': 'no' } });
}
