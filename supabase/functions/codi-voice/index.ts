import { createCodiCloudHandler } from '../_shared/codi-cloud.ts';
const url = Deno.env.get('SUPABASE_URL') || '';
const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
Deno.serve(createCodiCloudHandler({
  key: Deno.env.get('GEMINI_API_KEY') || '', enabled: Deno.env.get('CODI_CLOUD_ENABLED') === 'true',
  origins: [...new Set([...(Deno.env.get('ALLOWED_ORIGINS') || 'https://raytechinstitute.web.app,https://raytechinstitute.firebaseapp.com').split(',').map(s => s.trim()).filter(Boolean), 'http://127.0.0.1:4178', 'http://localhost:4178', 'http://localhost:3000', 'http://127.0.0.1:3000'])],
  async reserve(uid, kind) {
    const response = await fetch(`${url}/rest/v1/rpc/reserve_codi_voice`, { method: 'POST', signal: AbortSignal.timeout(8000), headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_uid: uid, p_kind: kind }) });
    if (!response.ok) throw new Error('Voice allowance unavailable');
    return await response.json() === true;
  },
}));
