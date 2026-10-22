/** Decode SDK HTTP failures without exposing database, provider or credential diagnostics. */
export async function adminFunctionError(error: unknown, data: unknown, fallback: string): Promise<Error> {
  const response = (error as { context?: Response } | null)?.context;
  if (response?.status === 401)
    return new Error('Your administrator session has expired. Sign in again, then retry. Keep a copy of your unsaved changes.');
  if (response?.status === 403)
    return new Error('This account is not authorized for this operation. Sign in with an administrator account.');
  let body = data as { error?: unknown } | null;
  if (response && typeof response.clone === 'function') {
    try { body = await response.clone().json(); } catch { /* Keep the safe fallback. */ }
  }
  const message = typeof body?.error === 'string' ? body.error.trim() : '';
  const privateDetails = /schema cache|SQLSTATE|PostgREST|stack trace|\b(?:select|insert|update|delete)\s+.+\b(?:from|into|set|where)\b|github_pat_|sk-or-|AIza|Bearer\s|eyJ[A-Za-z0-9_-]{20}|<\/?(?:html|script)|non-2xx/i;
  if (message && message.length <= 500 && !privateDetails.test(message)) return new Error(message);
  return new Error(fallback);
}
