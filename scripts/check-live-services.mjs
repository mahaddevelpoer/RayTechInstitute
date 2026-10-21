import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const origin = 'https://raytechinstitute.web.app';
const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!base || new URL(base).hostname !== 'btxrkhwyugzliswznkpx.supabase.co') throw new Error('Expected project configuration unavailable.');
const checks = [];
async function probe(name, url, options, accept) {
  try {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
    const passed = await accept(response);
    checks.push({ name, status: response.status, passed });
  } catch { checks.push({ name, passed: false, error: 'Request failed; private diagnostics suppressed.' }); }
}
await Promise.all(['secure-dispatch', 'student-review'].flatMap(slug => {
  const url = `${base}/functions/v1/${slug}`;
  return [
    probe(`${slug}: allowed-origin preflight`, url, { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'authorization,content-type' } }, response => response.ok && response.headers.get('access-control-allow-origin') === origin),
    probe(`${slug}: unauthenticated request denied`, url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{}' }, response => [401, 403].includes(response.status)),
  ];
}));
await probe('Firebase: anonymous progress read denied', 'https://firestore.googleapis.com/v1/projects/raytechinstitute/databases/(default)/documents/students/release-probe/learningProgress/release-probe', {}, async response => {
  const body = await response.json().catch(() => ({}));
  return response.status === 403 && body.error?.status === 'PERMISSION_DENIED' && !JSON.stringify(body).includes('SERVICE_DISABLED');
});
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), checks, limitations: 'Read-only/preflight and denial checks only. Does not prove signed-in admin writes, AI output quality or cross-device progress.' }, null, 2));
if (checks.some(check => !check.passed)) process.exitCode = 1;
