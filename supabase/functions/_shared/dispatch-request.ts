/** Bound unauthenticated request work before parsing an administrator action. */
export class DispatchRequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const MAX_DISPATCH_BODY_BYTES = 2_000_000;

export async function readDispatchRequest(request: Request, timeoutMs = 8000): Promise<Record<string, any>> {
  if (request.method !== 'POST') throw new DispatchRequestError(405, 'Use POST for this service.');
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    throw new DispatchRequestError(415, 'Send a JSON request.');
  }
  const declaredLength = request.headers.get('content-length');
  if (declaredLength !== null && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_DISPATCH_BODY_BYTES)) {
    throw new DispatchRequestError(413, 'This request is too large.');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new DispatchRequestError(400, 'Missing JSON request.');
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let text = '';
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, timeoutMs);
  try {
    while (true) {
      const part = await reader.read();
      if (timedOut) throw new DispatchRequestError(408, 'The request took too long to upload. Please try again.');
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > MAX_DISPATCH_BODY_BYTES) {
        await reader.cancel();
        throw new DispatchRequestError(413, 'This request is too large.');
      }
      text += decoder.decode(part.value, { stream: true });
    }
    text += decoder.decode();
  } catch (error) {
    if (error instanceof DispatchRequestError) throw error;
    throw new DispatchRequestError(400, 'The JSON request could not be read.');
  } finally { clearTimeout(timer); reader.releaseLock(); }
  let body: unknown;
  try { body = JSON.parse(text); } catch { throw new DispatchRequestError(400, 'Invalid JSON in request body.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new DispatchRequestError(400, 'Send a JSON object.');
  return body as Record<string, any>;
}
