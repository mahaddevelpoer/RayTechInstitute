export async function fetchCatalogRows(baseUrl, key, table, fetcher = fetch) {
  const rows = [];
  const pageSize = 500;
  for (let offset = 0; ; offset += pageSize) {
    const response = await fetcher(
      `${baseUrl}/rest/v1/${table}?select=*&order=id.asc&offset=${offset}&limit=${pageSize}`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(20000),
      },
    );
    if (!response.ok)
      throw new Error(
        `${table}: snapshot fetch failed (${response.status}); live deployment must keep its last good version.`,
      );
    const page = await response.json();
    if (!Array.isArray(page))
      throw new Error(`${table}: invalid snapshot response`);
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}
