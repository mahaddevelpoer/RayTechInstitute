export function articleSections(content: string) {
  const counts: Record<string, number> = {};
  let fence = "";
  return content.split("\n").flatMap((line, index) => {
    const marker = line.trim().match(/^(`{3,}|~{3,})/)?.[1];
    if (marker) {
      if (!fence) fence = marker[0];
      else if (marker[0] === fence) fence = "";
      return [];
    }
    if (fence) return [];
    const match = line.match(/^#{1,3}\s+(.+?)\s*#*$/);
    if (!match) return [];
    const title = match[1]
      .replace(/[*_`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    const base =
      title
        .toLowerCase()
        .replace(new RegExp("[^\\p{L}\\p{N}]+", "gu"), "-")
        .replace(/^-|-$/g, "") || "section";
    counts[base] = (counts[base] || 0) + 1;
    return [
      {
        title,
        id: counts[base] === 1 ? base : `${base}-${counts[base]}`,
        line: index + 1,
      },
    ];
  });
}

export const readingMinutes = (content: string) =>
  Math.max(
    1,
    Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 220),
  );

/** Known unsafe legacy claims need human source review, not an automatic verified badge. */
export function needsSourceReview(content = "") {
  return /as (?:the |an? )?examination controller|I certify|185,?450|67\.8%|10:05\s*AM|officially expected/i.test(
    content,
  );
}
