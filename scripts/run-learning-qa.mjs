import { learningCli, learningProject, readLearningServiceKey } from './learning-cli-access.mjs';
const slug = 'learning-qa';
if (Date.now() >= Date.parse('2026-10-21T00:00:00Z')) throw new Error('The temporary QA window has expired. Review its expiry before another deployment.');
const listed = () => JSON.parse(learningCli(['functions', 'list', '--project-ref', learningProject, '--output', 'json']));
if (listed().some(fn => fn.slug === slug || fn.name === slug)) throw new Error('A QA function already exists; refusing to overwrite it.');
const key = readLearningServiceKey();
let created = false;
try {
  // Mark ownership before deployment: a partial CLI failure may still create it.
  created = true;
  // Only this temporary endpoint uses its tested exact service-key gate.
  // The legacy JWT gateway can reject keys under newer signing-key setups.
  learningCli(['functions', 'deploy', slug, '--project-ref', learningProject, '--use-api', '--no-verify-jwt']);
  console.log('[learning-qa] Temporary protected function deployed.');
  const url = `https://${learningProject}.supabase.co/functions/v1/${slug}`;
  const denied = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(15000) });
  if (![401, 403].includes(denied.status)) throw new Error('Public access was not denied. Stopping QA.');
  console.log(`[learning-qa] Anonymous request denied (${denied.status}).`);
  const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${key}`, apikey: key }, signal: AbortSignal.timeout(90000) });
  const text = await response.text();
  if (!response.ok) throw new Error(`Protected QA returned HTTP ${response.status}; raw diagnostics suppressed.`);
  const report = JSON.parse(text);
  if (report.schema !== 1 || report.temporaryQA !== true) throw new Error('Unexpected QA response.');
  console.log(JSON.stringify(report, null, 2));
} finally {
  if (created) {
    learningCli(['functions', 'delete', slug, '--project-ref', learningProject, '--yes']);
    if (listed().some(fn => fn.slug === slug || fn.name === slug)) throw new Error('QA cleanup is not confirmed.');
    console.log('[learning-qa] Temporary function removed; cleanup verified.');
  }
}
