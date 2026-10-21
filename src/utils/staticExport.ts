// Next 15 static export rejects an empty generateStaticParams result.
// This build-only entry resolves to notFound(); finalize-export removes its files.
// It never enters the public catalog or sitemap.
export function staticExportParams<T extends Record<string, string>>(
  rows: T[],
  keys: (keyof T)[],
): T[] {
  if (rows.length) return rows;
  return [
    Object.fromEntries(keys.map((key) => [key, "__empty_catalog__"])) as T,
  ];
}
