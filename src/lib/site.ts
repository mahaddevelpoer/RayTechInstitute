/** Set this at build time only after the custom domain serves this site over HTTPS. */
export function normalizeSiteOrigin(value: string): string {
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash)
    throw new Error('NEXT_PUBLIC_SITE_URL must be the HTTPS site origin without a path, credentials, query or fragment.');
  return url.origin;
}
export const SITE_URL = normalizeSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://raytechinstitute.web.app");
export const siteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
