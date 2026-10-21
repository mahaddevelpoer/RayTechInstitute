import { createStudentReviewHandler } from '../_shared/student-review-handler.ts';
import type { LearningTopic } from '../_shared/learning-types.ts';
import { topicFromRow } from '../_shared/learning-records.ts';
import { studentReviewKey } from '../_shared/student-review-config.ts';

const databaseUrl = Deno.env.get('SUPABASE_URL') || '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
async function database(path: string, body?: unknown) {
  if (!databaseUrl || !serviceKey) throw new Error('Database unavailable');
  const response = await fetch(`${databaseUrl}/rest/v1/${path}`, {
    method: body === undefined ? 'GET' : 'POST', signal: AbortSignal.timeout(8000),
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new Error('Database request failed');
  return response.json();
}

Deno.serve(createStudentReviewHandler({
  origins: (Deno.env.get('ALLOWED_ORIGINS') || 'https://raytechinstitute.web.app,https://raytechinstitute.firebaseapp.com,http://localhost:3000,http://127.0.0.1:3000').split(',').map(s => s.trim()).filter(Boolean),
  firebase: { projectId: 'raytechinstitute', webApiKey: Deno.env.get('FIREBASE_WEB_API_KEY') || '' },
  openRouterKey: studentReviewKey(name => Deno.env.get(name)),
  async reserveQuota(uid) {
    return await database('rpc/reserve_learning_review', { p_uid: uid }) === true;
  },
  async getPublishedTopic(id): Promise<LearningTopic | null> {
    const query = new URLSearchParams({ id: `eq.${id}`, state: 'eq.published', 'learning_languages.state': 'eq.published', select: '*,learning_languages!inner(state)', limit: '1' });
    const rows = await database(`learning_topics?${query}`);
    const r = rows?.[0];
    if (!r) return null;
    return topicFromRow(r);
  },
}));
