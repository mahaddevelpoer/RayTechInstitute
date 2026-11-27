export function StudySummary({summary, lastUpdated, version}: {summary: string; lastUpdated?: string; version?: number}) {
  const validDate = lastUpdated && /^\d{4}-\d{2}-\d{2}$/.test(lastUpdated) ? lastUpdated : undefined;
  return <section data-study-summary className="my-5 rounded-lg border border-teal-200 bg-teal-50 p-4 text-slate-800 dark:border-teal-800 dark:bg-slate-900 dark:text-slate-100" aria-label="Quick summary">
    <h2 className="mb-2 text-base font-bold">Quick summary</h2>
    <p className="text-sm leading-7">{summary}</p>
    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">Published by RayTech Institute{validDate && <> · Last updated: <time dateTime={validDate}>{new Intl.DateTimeFormat('en-GB', {day:'numeric', month:'long', year:'numeric', timeZone:'UTC'}).format(new Date(validDate))}</time></>}{version !== undefined && <> · Lesson version {version}</>}</p>
  </section>;
}
