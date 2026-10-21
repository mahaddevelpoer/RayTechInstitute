export const MANUAL_REVIEW_ITEMS = [
  { id: 'layout', title: 'Responsive layout and themes', detail: 'Check desktop, tablet and phone widths, separate panel scrolling, keyboard focus, navigation and both themes.' },
  { id: 'existing', title: 'Existing education pages', detail: 'Open classes, notes, MCQs, past papers, gazettes and articles. Check their details, links and PDF previews.' },
  { id: 'authoring', title: 'Admin authoring', detail: 'Generate drafts, verify topic order and duplicates, edit the lesson/bank/rubric, preview, and publish only reviewed content.' },
  { id: 'publishing', title: 'Static publishing, edit and delete', detail: 'Verify approved create/edit/delete changes through Actions, the actual page, listing and sitemap. Confirm deletion does not revive sample data.' },
  { id: 'videos', title: 'RayTech teaching videos', detail: 'Select an owned public video, publish it, play it on the lesson and check controls, captions and mobile behavior.' },
  { id: 'compilers', title: 'Five browser compilers', detail: 'Run each language. Check output, input, syntax errors, reset, stop, time/output limits and blocked network/storage access.' },
  { id: 'quiz', title: 'Topic tests', detail: 'Check question/option rotation, previous/next, answer editing, final-only explanations and exact 80% assignment unlock.' },
  { id: 'assignment', title: 'Assignment feedback', detail: 'Check required topic concepts, a failing solution, a passing solution, revised code and unavailable/quota states.' },
  { id: 'progress', title: 'Accounts and saved progress', detail: 'Check guest access, signed-in save/reload, another device, a stale save, offline retry, sign-out and switching accounts.' },
  { id: 'access', title: 'Authorization and secrets', detail: 'Verify guests/students cannot perform admin actions, one learner cannot access another, and no private key is in exported assets.' },
  { id: 'seo', title: 'Public pages and indexing', detail: 'Check unique titles, descriptions, canonical URLs and sitemap entries. Keep drafts, admin pages and private state out of indexing.' },
  { id: 'budget', title: 'Free service limits', detail: 'Check runtime downloads, Hosting bandwidth, database requests, free-review quota and behavior during provider outages. Confirm there is no paid model fallback.' },
] as const;
export function parseManualReviews(raw: string): Record<string, string> {
  if (raw.length > 10000) return {};
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(MANUAL_REVIEW_ITEMS.filter(item => typeof value[item.id] === 'string' && value[item.id].length < 40 && Number.isFinite(Date.parse(value[item.id]))).map(item => [item.id, value[item.id]]));
  } catch { return {}; }
}
