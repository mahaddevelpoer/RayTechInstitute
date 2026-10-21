import fs from 'node:fs/promises';
import path from 'node:path';
import nextEnv from '@next/env';
import { readLearningServiceKey } from './learning-cli-access.mjs';
import { hasPrivateCredential } from './private-credential-patterns.mjs';
nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const credential = process.env.SUPABASE_SERVICE_ROLE_KEY || (!process.env.CI && !process.env.GITHUB_ACTIONS ? readLearningServiceKey() : '');
if (!credential) throw new Error('Private build credential is unavailable for the export check.');
const values = [credential, ...['SERVICE_ROLE_KEY', 'OPENROUTER_API_KEY', 'GEMINI_API_KEY', 'GITHUB_DISPATCH_TOKEN', 'YOUTUBE_API_KEY', 'NEXT_PUBLIC_YOUTUBE_API_KEY'].map(name => process.env[name])].filter(value => typeof value === 'string' && value.length >= 16);
const secrets = [...new Set(values)].map(value => Buffer.from(value));
let count = 0;
async function scan(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (/^\.env(?:\.|$)|\.(?:pem|key|p12|pfx)$/i.test(entry.name) || entry.name === '.git') throw new Error('A private configuration path was found in the public export. Publication must stop.');
    if (entry.isDirectory()) await scan(file);
    else if (entry.isFile()) {
      const data = await fs.readFile(file); count++;
      if (hasPrivateCredential(data.toString('utf8'))) throw new Error('A private credential pattern was found in the public export. Values were suppressed; publication must stop.');
      if (secrets.some(secret => data.includes(secret))) throw new Error('A configured private credential was found in the public export. Publication must stop. Credential values were suppressed.');
    }
  }
}
await scan(path.resolve('out'));
console.log(`[export-secrets] Checked ${count} public files against configured private credentials; no matches.`);
