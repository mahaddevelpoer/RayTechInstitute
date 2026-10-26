'use client';

let analyticsLoading: Promise<import('firebase/analytics').Analytics | null> | undefined;

// Call only after analytics consent. Neither Auth nor Analytics loads on import.
export async function initAnalytics() {
  if (typeof window === 'undefined') return null;
  if (!analyticsLoading) {
    analyticsLoading = (async () => {
      try {
        const { getAnalytics, isSupported } = await import('firebase/analytics');
        if (!await isSupported()) return null;
        const { app } = await import('./firebase-app');
        return getAnalytics(app);
      } catch {
        analyticsLoading = undefined;
        return null;
      }
    })();
  }
  return analyticsLoading;
}
