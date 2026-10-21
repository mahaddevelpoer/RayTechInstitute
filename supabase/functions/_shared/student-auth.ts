export class StudentRequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Token claims are only preliminary checks. Google's account lookup must also
 * accept the exact token before its identity can be trusted by any caller.
 */
export async function verifyStudent(
  authorization: string | null,
  config: { projectId: string; webApiKey: string },
  fetcher: typeof fetch = fetch,
  now = Date.now(),
): Promise<{ uid: string }> {
  const deny = () => new StudentRequestError(401, 'Sign in again before submitting your assignment.');
  if (!config.projectId || !config.webApiKey) throw new StudentRequestError(503, 'Assignment sign-in verification is unavailable.');
  if (!authorization?.startsWith('Bearer ')) throw deny();
  const token = authorization.slice(7).trim();
  if (token.length > 12000) throw deny();
  let claims;
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts.every(Boolean)) throw deny();
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
  } catch { throw deny(); }
  const seconds = Math.floor(now / 1000);
  if (!claims || typeof claims.sub !== 'string' || claims.sub.length < 1 || claims.sub.length > 128
    || claims.aud !== config.projectId || claims.iss !== `https://securetoken.google.com/${config.projectId}`
    || !Number.isSafeInteger(claims.exp) || claims.exp <= seconds
    || !Number.isSafeInteger(claims.iat) || claims.iat > seconds
    || !Number.isSafeInteger(claims.auth_time) || claims.auth_time > seconds
    || !claims.firebase?.sign_in_provider || claims.firebase.sign_in_provider === 'anonymous') throw deny();
  let response: Response;
  try {
    response = await fetcher(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(config.webApiKey)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }), signal: AbortSignal.timeout(8000),
    });
  } catch { throw new StudentRequestError(503, 'Sign-in verification is temporarily unavailable.'); }
  if (response.status === 429 || response.status >= 500) throw new StudentRequestError(503, 'Sign-in verification is temporarily unavailable.');
  if (!response.ok) throw deny();
  let result;
  try { result = await response.json(); } catch { throw new StudentRequestError(503, 'Sign-in verification is temporarily unavailable.'); }
  const user = result?.users?.[0];
  if (!user || user.disabled || user.localId !== claims.sub) throw deny();
  // Account lookup rejects invalid tokens; validSince also rejects revoked sessions.
  if (user.validSince && Number(user.validSince) > claims.auth_time) throw deny();
  return { uid: user.localId };
}

/** Streaming limit also applies to chunked bodies without Content-Length. */
export async function readStudentSubmission(request: Request, timeoutMs = 8000) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new StudentRequestError(415, 'Send a JSON assignment submission.');
  const reader = request.body?.getReader();
  if (!reader) throw new StudentRequestError(400, 'Missing assignment submission.');
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, timeoutMs);
  let size = 0;
  let text = '';
  const decoder = new TextDecoder('utf-8', { fatal: true });
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (timedOut) throw new StudentRequestError(408, 'The submission took too long to upload. Please try again.');
      if (done) break;
      size += value.byteLength;
      if (size > 90000) { await reader.cancel(); throw new StudentRequestError(413, 'The submission is too large.'); }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } catch (error) {
    if (error instanceof StudentRequestError) throw error;
    throw new StudentRequestError(400, 'The submission could not be read.');
  } finally { clearTimeout(timer); reader.releaseLock(); }
  let value;
  try { value = JSON.parse(text); } catch { throw new StudentRequestError(400, 'Invalid JSON submission.'); }
  if (!value || Array.isArray(value) || Object.keys(value).some(key => !['topicId', 'version', 'code', 'answers'].includes(key))
    || typeof value.topicId !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(value.topicId)
    || !Number.isSafeInteger(value.version) || value.version < 1
    || typeof value.code !== 'string' || !value.code.trim() || value.code.length > 20000
    || !value.answers || Array.isArray(value.answers) || typeof value.answers !== 'object'
    || Object.keys(value.answers).length > 100
    || Object.entries(value.answers).some(([id, answer]) => !/^[a-zA-Z0-9_-]{1,100}$/.test(id) || typeof answer !== 'string' || answer.length > 100)) {
    throw new StudentRequestError(400, 'Provide a topic, version, code and quiz answers only.');
  }
  return value as { topicId: string; version: number; code: string; answers: Record<string, string> };
}
