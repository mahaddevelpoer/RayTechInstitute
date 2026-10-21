// No browser, model weights or credentials in output. QA is removed after use.
import { execFileSync } from 'node:child_process';
const cli = process.platform === 'win32' ? 'npx.cmd' : 'npx';
let raw;
try { raw = execFileSync(cli, ['--yes', 'supabase', 'projects', 'api-keys', '--project-ref', 'btxrkhwyugzliswznkpx', '-o', 'json'], { encoding: 'utf8', shell: process.platform === 'win32', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000 }); }
catch { throw new Error('Supabase CLI authorization is unavailable. No credential was printed.'); }
let keys; try { keys = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1)); } catch { throw new Error('Could not read project credentials securely.'); }
const key = keys.find(item => item.name === 'service_role')?.api_key;
if (!key) throw new Error('Project service credential is unavailable.');
const check = process.argv[2] || 'live';
if (!['live', 'tts-en', 'tts-hi'].includes(check)) throw new Error('Unknown check.');
try {
  const response = await fetch(`https://btxrkhwyugzliswznkpx.supabase.co/functions/v1/codi-qa?check=${check}`, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(55000) });
  console.log(JSON.stringify({ http: response.status, ...(await response.json()) }, null, 2));
} catch { throw new Error('QA request failed. No private diagnostics were printed.'); }
