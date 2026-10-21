/** Set this at build time only after the custom domain serves this site over HTTPS. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://raytechinstitute.web.app"
).replace(/\/+$/, "");
export const siteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
