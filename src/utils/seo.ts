/**
 * Serialize structured data for an inline JSON-LD script safely.
 * JSON.stringify alone does not escape a user-controlled `</script>` sequence.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/** Keep search titles readable and within the project's 50-60 character target. */
export function buildSeoTitle(primary: string): string {
  const suffix = ' | RayTech Institute';
  const maxPrimaryLength = 60 - suffix.length;
  const minPrimaryLength = 50 - suffix.length;
  let value = primary.replace(/\s+/g, ' ').trim();

  for (const addition of [' Resources', ' Guide', ' Online']) {
    if (value.length >= minPrimaryLength) break;
    value += addition;
  }

  if (value.length > maxPrimaryLength) {
    value = `${value.slice(0, maxPrimaryLength - 1).trimEnd()}…`;
  }
  return `${value}${suffix}`;
}
