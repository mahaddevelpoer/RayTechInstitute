/** Temporary service-credential-only diagnostic gate. Not a student/admin route. */
export async function verifyQAServiceCredential(token: string, fetcher: typeof fetch = fetch): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const claims = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (claims.role !== 'service_role' || claims.ref !== 'btxrkhwyugzliswznkpx' || typeof claims.exp !== 'number' || claims.exp <= Date.now() / 1000) return false;
    // Decoded claims are NOT trusted as authentication. The fixed project's
    // Data API must validate the actual credential and private-table privilege.
    const response = await fetcher('https://btxrkhwyugzliswznkpx.supabase.co/rest/v1/learning_languages?select=id&limit=0', { headers: { apikey: token, Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000) });
    return response.status === 200 && (await response.text()).trim() === '[]';
  } catch { return false; }
}
export function createLearningQAHandler(serviceKey: string, expiresAt: number, run: (request: Request) => Promise<unknown>, verifyAlternate?: (token: string) => Promise<boolean>) {
  return async (request: Request) => {
    const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
    if (Date.now() > expiresAt) return reply(410, { error: 'QA window ended.' });
    if (request.method !== 'POST' || request.headers.has('origin')) return reply(403, { error: 'Forbidden.' });
    const supplied = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
    if (!serviceKey || !supplied || supplied.length > 4096) return reply(401, { error: 'Unauthorized.' });
    const digest = (value: string) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    const [a, b] = await Promise.all([digest(supplied), digest(serviceKey)]);
    const left = new Uint8Array(a), right = new Uint8Array(b); let different = 0;
    for (let i = 0; i < left.length; i++) different |= left[i] ^ right[i];
    if (different && !(await verifyAlternate?.(supplied))) return reply(401, { error: 'Unauthorized.' });
    try { return reply(200, await run(request)); }
    catch { return reply(503, { error: 'QA service check failed. Provider details were suppressed.' }); }
  };
}
