/** The existing user-managed vault entry is supported without forwarding an
 * unrelated provider's credential to OpenRouter. Dedicated configuration wins.
 */
export function studentReviewKey(read: (name: string) => string | undefined): string {
  const candidate = (read('OPENROUTER_API_KEY') || read('Assignment-ai-api') || '').trim();
  return /^sk-or-v1-[a-zA-Z0-9_-]{20,200}$/.test(candidate) ? candidate : '';
}
