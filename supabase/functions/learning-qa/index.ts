import { createLearningQAHandler, verifyQAServiceCredential } from '../_shared/learning-qa-handler.ts';
import { collectLearningHealth } from '../_shared/learning-health.ts';
import { studentReviewKey } from '../_shared/student-review-config.ts';
import { REVIEW_MODEL } from '../_shared/assignment-review.ts';
import { learningYouTubeKey } from '../_shared/learning-videos.ts';
import { generateLearningDots, LEARNING_DOTS_MODEL } from '../_shared/learning-dots.ts';

const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
// Absolute expiry: never becomes a permanent privileged bypass after a cold start.
Deno.serve(createLearningQAHandler(serviceKey, Date.parse('2026-10-21T00:00:00Z'), async request => {
  if (new URL(request.url).searchParams.get('check') === 'dots-stream') {
    const started = Date.now(); let chunks = 0; let firstChunkMs: number | null = null;
    try {
      const output = await generateLearningDots(studentReviewKey(name => Deno.env.get(name)), 'Return valid JSON only. No tools.', 'Synthetic connectivity test. Return exactly {"ok":true}.', 'topic', event => {
        if (event.type === 'delta') { chunks++; if (firstChunkMs === null) firstChunkMs = Date.now() - started; }
      });
      return { temporaryQA: true, model: LEARNING_DOTS_MODEL, validJson: JSON.parse(output)?.ok === true, chunks, firstChunkMs, elapsedMs: Date.now() - started, databaseWrites: 0 };
    } catch (error) { return { temporaryQA: true, model: LEARNING_DOTS_MODEL, error: error instanceof Error ? error.message : 'Provider check failed', chunks, firstChunkMs, databaseWrites: 0 }; }
  }
  if (new URL(request.url).searchParams.get('check') === 'admin-config') {
    const digest = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map(byte => byte.toString(16).padStart(2, '0')).join('');
    const emails = (Deno.env.get('ADMIN_EMAILS') || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean).sort();
    return { firebaseWebKeyFingerprint: await digest(Deno.env.get('FIREBASE_WEB_API_KEY') || ''), allowlistCount: emails.length, allowlistFingerprint: await digest(emails.join(',')) };
  }
  const openRouterKey = studentReviewKey(name => Deno.env.get(name));
  const report = await collectLearningHealth({
    databaseUrl: Deno.env.get('SUPABASE_URL') || '', serviceKey,
    geminiKey: Deno.env.get('GEMINI_API_KEY') || '', openRouterKey,
    youtubeKey: learningYouTubeKey(name => Deno.env.get(name)), githubToken: Deno.env.get('GITHUB_DISPATCH_TOKEN') || '',
    repository: 'mahaddevelpoer/RayTechInstitute', origin: 'https://raytechinstitute.web.app',
  });
  let generation: { status: string; model: string; httpStatus?: number } = { status: 'not-configured', model: REVIEW_MODEL };
  if (openRouterKey) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST', signal: AbortSignal.timeout(45000),
        headers: { Authorization: `Bearer ${openRouterKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: REVIEW_MODEL, messages: [{ role: 'user', content: 'Synthetic connectivity test. Reply with the single word OK. No tools or external actions.' }], max_tokens: 256, temperature: 0 }),
      });
      const text = await response.text();
      const data = text.length <= 128000 ? JSON.parse(text) : {};
      generation = { status: response.ok && data.choices?.[0]?.message?.content?.trim() === 'OK' ? 'verified-response' : response.ok ? 'accepted-without-expected-response' : 'provider-rejected', httpStatus: response.status, model: REVIEW_MODEL };
    } catch { generation = { status: 'unavailable-or-timeout', model: REVIEW_MODEL }; }
  }
  const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(value => value.trim()).filter(value => {
    try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && url.origin === value; } catch { return false; }
  });
  return { schema: 1, temporaryQA: true, checkedAt: new Date().toISOString(), firebaseWebKeyConfigured: !!Deno.env.get('FIREBASE_WEB_API_KEY'), allowedOrigins, checks: report.checks.filter(check => check.id !== 'admin-auth'), generation, limitations: ['Service-credential QA, not Firebase user sign-in proof.', 'No real assignment, student quota reservation, content mutation or deployment dispatch.'] };
}, verifyQAServiceCredential));
