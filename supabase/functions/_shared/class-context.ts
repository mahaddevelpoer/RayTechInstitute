/** Resolve the selected class without assuming that every other class is grade 12. */
export async function resolveClassTitle(slug: string, base: string, key: string, fetcher: typeof fetch = fetch): Promise<string> {
  if (!slug) return 'Selected class';
  const fallback = slug.split('-').filter(Boolean).map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
  if (!base || !key) return fallback;
  try {
    const response = await fetcher(`${base}/rest/v1/classes?${new URLSearchParams({select:'title',slug:`eq.${slug}`,limit:'1'})}`, {headers:{apikey:key,Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(8000)});
    if (!response.ok) return fallback;
    const rows = await response.json();
    return typeof rows?.[0]?.title === 'string' && rows[0].title.trim() ? rows[0].title.trim() : fallback;
  } catch { return fallback; }
}
