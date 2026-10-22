// Editorial guidance, not an acceptance threshold or an expansion trigger.
export const GAZETTE_LENGTH_GUIDANCE = 'Aim for approximately 1,800 characters in content, not 1,800 words. This is a flexible target, not a minimum or maximum: shorter useful drafts and longer relevant drafts are acceptable. Do not pad or repeat text to reach a length target.';

export function validateGazetteDraft(item: any): any {
  if (!item || typeof item !== 'object' || Array.isArray(item))
    throw new Error('AI returned an invalid result gazette object.');
  const title = typeof item.title === 'string' ? item.title.trim() : '';
  const content = typeof item.content === 'string' ? item.content.trim() : '';
  if (!title || !content)
    throw new Error('AI returned an empty gazette title or description. Please regenerate.');
  return { ...item, title, content };
}
