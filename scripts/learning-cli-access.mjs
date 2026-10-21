import { execFileSync } from 'node:child_process';
import path from 'node:path';
export const learningProject = 'btxrkhwyugzliswznkpx';
export const learningRepository = 'mahaddevelpoer/RayTechInstitute';
export function learningCli(args) {
  try {
    const options = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 45000, maxBuffer: 2000000 };
    if (process.platform === 'win32') {
      const entry = process.env.SUPABASE_CLI_ENTRY || path.join(process.env.APPDATA || '', 'npm/node_modules/supabase/dist/supabase.js');
      return execFileSync(process.execPath, [entry, ...args], options);
    }
    return execFileSync('supabase', args, options);
  } catch { throw new Error('Supabase CLI access failed. Sign in to the scoped project before exporting learning content. Raw credential responses were suppressed.'); }
}
export function readLearningServiceKey() {
  try {
    const keys = JSON.parse(learningCli(['projects', 'api-keys', '--project-ref', learningProject, '--output', 'json']));
    const key = Array.isArray(keys) ? keys.find(item => item.name === 'service_role')?.api_key : null;
    if (typeof key !== 'string' || key.length < 100) throw new Error();
    return key;
  } catch { throw new Error('The scoped build credential is unavailable. No secret values were logged.'); }
}
