const pending = new Set<string>();

/** Keep failed saves editable and catch rejected click/submit promises. */
export function adminOperation<Args extends unknown[]>(key: string, task: (...args: Args) => Promise<unknown>) {
  return async (...args: Args): Promise<void> => {
    const event = args[0] as { preventDefault?: () => void } | null | undefined;
    if (typeof event?.preventDefault === 'function') event.preventDefault();
    if (pending.has(key)) return;
    pending.add(key);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('raytech-admin-operation-start'));
    try { await task(...args); }
    catch (error) {
      const detail = error instanceof Error ? error.message.slice(0, 500) : 'The operation failed. Your form has not been cleared. Please retry.';
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('raytech-admin-error', { detail }));
    } finally { pending.delete(key); }
  };
}
