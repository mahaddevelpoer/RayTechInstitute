/** Validate editor input before sending a save request. Never silently upgrade an HTTP source. */
export function normalizeDocumentInput(value: string, label: string, allowRelative = false): string {
  let input = value.trim();
  if (!input) return '';
  if (allowRelative && input.startsWith('/') && !input.startsWith('//')) return input;
  if (input.startsWith('//')) input = `https:${input}`;
  else if (!/^[a-z][a-z0-9+.-]*:/i.test(input)) input = `https://${input}`;
  try {
    const url = new URL(input);
    if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.')) throw new Error();
    return url.href;
  } catch { throw new Error(`${label} must be a valid HTTPS link, such as https://drive.google.com/file/d/FILE_ID/view. Remove any pasted HTML or extra text.`); }
}

/** Preview only supported providers. A board homepage is not a PDF. */
export function documentLinks(value?: string, previewValue?: string) {
  const safe = (input?: string) => {
    try {
      const url = new URL(input || "");
      return url.protocol === "https:" &&
        !url.username &&
        !url.password &&
        !/(^|\.)example\.com$/.test(url.hostname)
        ? url
        : null;
    } catch {
      return null;
    }
  };
  const url = safe(value);
  const preview = safe(previewValue) || url;
  let embed = "";
  const hosted = !!preview && ['raytechinstitute.web.app','raytechinstitute.firebaseapp.com','raytechinstitute.com','www.raytechinstitute.com'].includes(preview.hostname) && preview.pathname.startsWith('/documents/') && /\.pdf$/i.test(preview.pathname);
  if (hosted && preview) embed = preview.pathname + preview.search;
  if (preview?.hostname === "drive.google.com") {
    const id =
      preview.pathname.match(/\/d\/([\w-]+)/)?.[1] ||
      preview.searchParams.get("id");
    if (id && /^[\w-]+$/.test(id))
      embed = `https://drive.google.com/file/d/${id}/preview`;
  }
  if (!embed && preview && /\.pdf$/i.test(preview.pathname))
    embed = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(preview.href)}`;
  return {
    href: url?.href || "",
    embed,
    isPdf: !!url && (/\.pdf$/i.test(url.pathname) || !!embed),
    hosted,
  };
}
