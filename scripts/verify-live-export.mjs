import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = path.resolve(process.env.VERIFY_EXPORT_ROOT || 'out'); const routes = [];
async function collect(directory) { for (const entry of await fs.readdir(directory, { withFileTypes: true })) { const file = path.join(directory, entry.name); if (entry.isDirectory()) await collect(file); else if (entry.name === 'index.html') routes.push(file); } }
await collect(root);
let failures = []; let checked = 0;
const digest = text => createHash('sha256').update(text).digest('hex');
let pending = routes;
for (let attempt = 0; attempt < 3 && pending.length; attempt++) {
 if (attempt) await new Promise(resolve => setTimeout(resolve, 10000));
 failures = []; const retry = []; let cursor = 0;
 await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < pending.length) {
    const file = pending[cursor++]; const relative = path.relative(root, path.dirname(file)).replaceAll(path.sep, '/'); const route = `/${relative}${relative ? '/' : ''}`;
    try {
      const query = attempt ? `?release-check=${process.env.GITHUB_SHA || 'manual'}-${attempt}` : '';
      const response = await fetch(`https://raytechinstitute.web.app${route}${query}`, { signal: AbortSignal.timeout(20000), headers: { 'Cache-Control': 'no-cache' } });
      const body = await response.text(); const local = await fs.readFile(file, 'utf8');
      if (response.status !== 200 || digest(body) !== digest(local)) {
        retry.push(file); failures.push({ route, status: response.status, exactExportMatch: digest(body) === digest(local), expectedBytes: Buffer.byteLength(local), actualBytes: Buffer.byteLength(body), expectedSha256: digest(local), actualSha256: digest(body), contentType: response.headers.get('content-type') });
      }
      checked++;
    } catch { retry.push(file); failures.push({ route, error: 'Network verification failed; no raw diagnostics logged.' }); }
  }
 }));
 pending = retry;
}
console.log(JSON.stringify({ liveHtmlRoutesChecked: routes.length, requests: checked, failures, limitations: 'Static response integrity only. Does not prove signed-in user flows or interactive layout.' }, null, 2));
if (failures.length) process.exitCode = 1;
