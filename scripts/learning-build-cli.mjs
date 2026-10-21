// Scoped CLI bridge: credentials stay in memory and enter GitHub through stdin.
// Never print CLI key responses or child stderr, and never write a secret file.
import { execFileSync } from 'node:child_process';
import nextEnv from '@next/env';
import { learningProject as project, learningRepository as repository, learningCli as cli, readLearningServiceKey } from './learning-cli-access.mjs';
nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const mode = process.argv[2];
if (!['--inspect', '--configure-github', '--export'].includes(mode)) throw new Error('Use --inspect, --configure-github or --export. This command never deploys.');
try {
  const serviceKey = readLearningServiceKey();
  if (mode === '--inspect') {
    const secrets = JSON.parse(cli(['secrets', 'list', '--project-ref', project, '--output', 'json']));
    console.log(JSON.stringify({ project, serviceCredentialAvailable: true, serverSecretNames: Array.isArray(secrets) ? secrets.map(item => item.name).filter(name => typeof name === 'string') : [] }));
    for (const table of ['learning_languages', 'learning_courses', 'learning_topics']) {
      const response = await fetch(`https://${project}.supabase.co/rest/v1/${table}?select=id&limit=1`, { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }, signal: AbortSignal.timeout(12000) });
      console.log(`[learning-build] ${table}: HTTP ${response.status}`);
    }
  } else if (mode === '--configure-github') {
    execFileSync('gh', ['secret', 'set', 'SUPABASE_SERVICE_ROLE_KEY', '--repo', repository], { input: serviceKey, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 30000 });
    console.log('[learning-build] Configured the encrypted Actions build credential for the scoped repository. No workflow or deployment was started.');
  } else {
    execFileSync(process.execPath, ['scripts/generate-learning-catalog.mjs'], { env: { ...process.env, SUPABASE_SERVICE_ROLE_KEY: serviceKey, NEXT_PUBLIC_SUPABASE_URL: `https://${project}.supabase.co` }, stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000 });
    console.log('[learning-build] Exported the validated public learning snapshot. No build or deployment was started.');
  }
} catch {
  console.error('[learning-build] The scoped operation failed. Check CLI sign-in, project access, private table migrations and repository permissions. Secret values and raw diagnostics were suppressed.');
  process.exitCode = 1;
}
