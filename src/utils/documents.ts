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
  if (preview?.hostname === "drive.google.com") {
    const id =
      preview.pathname.match(/\/d\/([\w-]+)/)?.[1] ||
      preview.searchParams.get("id");
    if (id && /^[\w-]+$/.test(id))
      embed = `https://drive.google.com/file/d/${id}/preview`;
  }
  return {
    href: url?.href || "",
    embed,
    isPdf: !!url && (/\.pdf$/i.test(url.pathname) || !!embed),
  };
}
