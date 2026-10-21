import { listLearningVideos } from './learning-videos.ts';

import type { HealthState, HealthCheck, HealthConfiguration } from './learning-health-types.ts';
export async function collectLearningHealth(config: HealthConfiguration, fetcher: typeof fetch = fetch) {
  async function json(url: string, headers: Record<string, string> = {}) {
    const response = await fetcher(url, { headers, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('Service request failed.');
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Missing service response.');
    const decoder = new TextDecoder(); let text = ''; let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.byteLength;
        if (size > 256000) { await reader.cancel(); throw new Error('Service response too large.'); }
        text += decoder.decode(value, { stream: true });
      }
      return JSON.parse(text + decoder.decode());
    } finally { reader.releaseLock(); }
  }
  async function probe(id: string, label: string, ready: boolean, run: () => Promise<{ status: HealthState; detail: string }>): Promise<HealthCheck> {
    const start = Date.now();
    let result: { status: HealthState; detail: string };
    if (!ready) result = { status: 'attention', detail: 'Required server configuration is missing. No request was sent.' };
    else {
      try { result = await run(); }
      catch { result = { status: 'error', detail: 'The service request failed or returned an unexpected response. Check configuration, access and service availability.' }; }
    }
    return { id, label, ...result, checkedAt: new Date().toISOString(), durationMs: Date.now() - start };
  }
  const tables = ['classes', 'subjects', 'chapters', 'notes', 'mcqs', 'past_papers', 'gazettes', 'blogs', 'video_mcqs', 'learning_languages', 'learning_courses', 'learning_topics'];
  const databaseReady = !!config.serviceKey && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(config.databaseUrl);
  const checks = await Promise.all([
    ...tables.map(table => probe(`table:${table}`, `${table}: read access`, databaseReady, async () => {
      const result = await json(`${config.databaseUrl.replace(/\/$/, '')}/rest/v1/${table}?select=id&limit=1`, { apikey: config.serviceKey, Authorization: `Bearer ${config.serviceKey}` });
      if (!Array.isArray(result)) throw new Error('Invalid table response.');
      return { status: 'ok', detail: 'Read access confirmed. This check does not create, edit or delete content.' };
    })),
    probe('gemini', 'Admin Gemini model access', !!config.geminiKey, async () => {
      const result = await json(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(config.geminiKey)}`);
      if (!Array.isArray(result.models)) throw new Error('Invalid model catalog.');
      const available = result.models.some((model: any) => typeof model.name === 'string' && /flash/i.test(model.name) && model.supportedGenerationMethods?.includes('generateContent'));
      return available ? { status: 'ok', detail: 'A Flash generation model is listed for this key. Draft quality and generation quota were not tested.' } : { status: 'attention', detail: 'No supported Flash generation model was listed. Check model access before generating a draft.' };
    }),
    probe('openrouter', 'Student reviewer key access', !!config.openRouterKey, async () => {
      const result = await json('https://openrouter.ai/api/v1/key', { Authorization: `Bearer ${config.openRouterKey}` });
      if (!result.data || typeof result.data !== 'object') throw new Error('Invalid key response.');
      return { status: 'ok', detail: 'OpenRouter accepted the key. No assignment or generation request was sent; free-model availability is not proven by this check.' };
    }),
    probe('youtube', 'RayTech YouTube upload selection', !!config.youtubeKey, async () => {
      const result = await listLearningVideos(config.youtubeKey, '', fetcher);
      return { status: 'ok', detail: `Channel upload lookup succeeded (${result.videos.length} selectable videos on the first page). Playback and attachment publishing need a separate check.` };
    }),
    probe('github', 'GitHub repository access', !!config.githubToken && /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(config.repository), async () => {
      const result = await json(`https://api.github.com/repos/${config.repository}`, { Authorization: `Bearer ${config.githubToken}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'RayTech-health-check' });
      if (String(result.full_name).toLowerCase() !== config.repository.toLowerCase()) throw new Error('Unexpected repository.');
      return { status: 'ok', detail: 'Repository metadata is accessible. Dispatch permissions, Actions secrets and successful deployment were not tested.' };
    }),
    probe('student-endpoint', 'Student endpoint and CORS', databaseReady && !!config.origin, async () => {
      const result = await fetcher(`${config.databaseUrl.replace(/\/$/, '')}/functions/v1/student-review`, { method: 'OPTIONS', headers: { Origin: config.origin }, signal: AbortSignal.timeout(12000) });
      if (result.status !== 204 || result.headers.get('access-control-allow-origin') !== config.origin) throw new Error('Endpoint or CORS unavailable.');
      return { status: 'ok', detail: 'The endpoint answered the preflight for this origin. Authentication, quotas and assignment grading still require an actual signed-in submission.' };
    }),
  ]);
  checks.unshift({ id: 'admin-auth', label: 'Current administrator access', status: 'ok', detail: 'This request passed Firebase administrator verification before health checks ran.', checkedAt: new Date().toISOString(), durationMs: 0 });
  for (const [id, label, detail] of [
    ['assessment', 'Authenticated assignment review and quota', 'Use a signed-in learner and a published topic. Read-only health checks do not reserve quota or send student code.'],
    ['progress', 'Private Firestore progress and access rules', 'Verify account save/reload, account isolation and offline/retry in a browser after deploying the reviewed rules.'],
    ['publishing', 'Content edit/delete and static deployment', 'Verify an approved content update through GitHub Actions, the deployed page, listing and sitemap. A queued rebuild is not proof of publication.'],
  ]) checks.push({ id, label, status: 'not-tested', detail, checkedAt: new Date().toISOString(), durationMs: 0 });
  return { success: true, checkedAt: new Date().toISOString(), checks };
}
