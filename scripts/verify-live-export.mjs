import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = path.resolve('out'); const routes = [];
async function collect(directory) { for (const entry of await fs.readdir(directory, { withFileTypes: true })) { const file = path.join(directory, entry.name); if (entry.isDirectory()) await collect(file); else if (entry.name === 'index.html') routes.push(file); } }
await collect(root);
const failures = []; let checked = 0; let cursor = 0;
const digest = text => createHash('sha256').update(text).digest('hex');
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < routes.length) {
    const file = routes[cursor++]; const relative = path.relative(root, path.dirname(file)).replaceAll(path.sep, '/'); const route = `/${relative}${relative ? '/' : ''}`;
    try {
      const response = await fetch(`https://raytechinstitute.web.app${route}`, { signal: AbortSignal.timeout(20000) });
      const body = await response.text(); const local = await fs.readFile(file, 'utf8');
      if (response.status !== 200 || digest(body) !== digest(local)) failures.push({ route, status: response.status, exactExportMatch: digest(body) === digest(local) });
      checked++;
    } catch { failures.push({ route, error: 'Network verification failed; no raw diagnostics logged.' }); }
  }
}));
console.log(JSON.stringify({ liveHtmlRoutesChecked: checked, failures, limitations: 'Static response integrity only. Does not prove signed-in user flows or interactive layout.' }, null, 2));
if (failures.length) process.exitCode = 1;
