import type { LearningRepository } from './learning-admin.ts';

export function createLearningRepository(baseUrl: string, serviceKey: string, rebuild: () => Promise<unknown>, fetcher: typeof fetch = fetch, validateVideos: (ids: string[]) => Promise<void> = async ids => { if (ids.length) throw new Error('Video verification is not configured.'); }): LearningRepository {
  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
  async function request(path: string, method = 'GET', body?: unknown) {
    if (!baseUrl || !serviceKey) throw new Error('Learning storage is not configured.');
    const response = await fetcher(`${baseUrl}/rest/v1/${path}`, { method, headers, signal: AbortSignal.timeout(15000), ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    if (!response.ok) {
      if (response.status === 409) throw new Error('This topic conflicts with another record. Reload and check its slug or position.');
      throw new Error('Learning storage request failed. No publication was confirmed.');
    }
    const result = await response.json();
    if (!Array.isArray(result)) throw new Error('Learning storage returned an invalid response.');
    return result;
  }
  return {
    rebuild,
    validateVideos,
    async updateRegistry(table, id, record, expectedUpdatedAt) {
      if (!['learning_languages', 'learning_courses'].includes(table)) throw new Error('Unsupported registry.');
      const filter = new URLSearchParams({ id: `eq.${id}`, updated_at: `eq.${expectedUpdatedAt}` });
      const rows = await request(`${table}?${filter}`, 'PATCH', record);
      if (rows.length !== 1) throw new Error('Registry changed. Reload before saving.');
    },
    async list(table) {
      if (!['learning_topics', 'learning_languages', 'learning_courses'].includes(table)) throw new Error('Unsupported learning table.');
      const rows: Record<string, any>[] = [];
      for (let offset = 0; ; offset += 500) {
        const page = await request(`${table}?select=*&order=id.asc&offset=${offset}&limit=500`);
        rows.push(...page);
        if (page.length < 500) return rows;
      }
    },
    async write(record, expectedUpdatedAt) {
      const filter = new URLSearchParams({ id: `eq.${record.id}`, updated_at: `eq.${expectedUpdatedAt}` });
      const rows = await request(expectedUpdatedAt ? `learning_topics?${filter}` : 'learning_topics', expectedUpdatedAt ? 'PATCH' : 'POST', record);
      if (rows.length !== 1) throw new Error('This topic changed in another session. Reload before saving.');
    },
    async remove(id, expectedUpdatedAt) {
      const filter = new URLSearchParams({ id: `eq.${id}`, updated_at: `eq.${expectedUpdatedAt}` });
      const rows = await request(`learning_topics?${filter}`, 'DELETE');
      if (rows.length !== 1) throw new Error('This topic changed in another session. Reload before deleting.');
    },
  };
}
