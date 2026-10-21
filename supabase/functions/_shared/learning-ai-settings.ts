export interface LearningAiSettings { enabled: boolean; updatedAt: string }

export function createLearningAiSettings(baseUrl: string, key: string, fetcher: typeof fetch = fetch) {
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
  async function request(method: string, query: URLSearchParams, body?: unknown): Promise<LearningAiSettings> {
    if (!baseUrl || !key) throw new Error('AI settings storage is not configured.');
    const result = await fetcher(`${baseUrl}/rest/v1/learning_ai_settings?${query}`, { method, headers, signal: AbortSignal.timeout(15000), ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    if (!result.ok) throw new Error('AI settings could not be checked. Generation stays disabled.');
    const rows = await result.json();
    if (!Array.isArray(rows) || rows.length !== 1 || typeof rows[0]?.enabled !== 'boolean' || typeof rows[0]?.updated_at !== 'string' || !Number.isFinite(Date.parse(rows[0].updated_at))) throw new Error('AI settings changed or are unavailable. Reload before continuing.');
    return { enabled: rows[0].enabled, updatedAt: rows[0].updated_at };
  }
  const read = () => request('GET', new URLSearchParams({ id: 'eq.global', select: 'enabled,updated_at' }));
  return {
    read,
    async requireEnabled() { if (!(await read()).enabled) throw new Error('AI topic generation is switched off. Manual lessons and existing courses are still available.'); },
    async set(enabled: unknown, expectedUpdatedAt: unknown) {
      if (typeof enabled !== 'boolean' || typeof expectedUpdatedAt !== 'string' || !Number.isFinite(Date.parse(expectedUpdatedAt))) throw new Error('Choose a valid AI setting and reload its latest version.');
      const updatedAt = new Date(Math.max(Date.now(), Date.parse(expectedUpdatedAt) + 1)).toISOString();
      return request('PATCH', new URLSearchParams({ id: 'eq.global', updated_at: `eq.${expectedUpdatedAt}`, select: 'enabled,updated_at' }), { enabled, updated_at: updatedAt });
    },
  };
}
