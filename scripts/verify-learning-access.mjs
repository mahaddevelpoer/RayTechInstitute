import nextEnv from '@next/env';
import { learningProject, readLearningServiceKey } from './learning-cli-access.mjs';
nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const base = `https://${learningProject}.supabase.co/rest/v1/`;
async function read(table, key, select = 'id') {
  return fetch(`${base}${table}?select=${select}&limit=20`, { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000) });
}
let stage = 'CLI build credential lookup';
try {
  const privateKey = readLearningServiceKey();
  stage = 'public key configuration';
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!publicKey) throw new Error();
  stage = 'public table control request';
  const control = await read('classes', publicKey);
  console.log(`[learning-access] Public-key control: HTTP ${control.status}.`);
  if (!control.ok) throw new Error('Public-key control check failed.');
  for (const table of ['learning_languages', 'learning_courses', 'learning_topics']) {
    stage = `${table} access checks`;
    const authorized = await read(table, privateKey, table === 'learning_topics' ? 'id,state,pending_draft' : 'id,state');
    const anonymous = await read(table, publicKey);
    console.log(`[learning-access] ${table}: service HTTP ${authorized.status}; anonymous HTTP ${anonymous.status}.`);
    // PostgREST uses 401 for permission denial while running as its anonymous
    // role. The successful public-table control above verifies the API key.
    if (!authorized.ok || ![401, 403].includes(anonymous.status)) throw new Error('Private access verification failed.');
    const rows = await authorized.json();
    if (!Array.isArray(rows)) throw new Error();
    console.log(`[learning-access] ${table}: service read succeeded; anonymous read denied; sample contains ${rows.length} rows (${rows.filter(row => row.state === 'published').length} published).`);
  }
} catch {
  console.error(`[learning-access] Verification failed during ${stage}. Check project access, public-key control and private-table permissions. No credential values were logged.`);
  process.exitCode = 1;
}
