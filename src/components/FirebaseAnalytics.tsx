'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { initAnalytics } from '@/lib/firebase';

/**
 * FirebaseAnalytics — boots Firebase Analytics only when cookie consent allows it.
 * Respects user GDPR/ePrivacy choices stored in js-cookie.
 */
export const FirebaseAnalytics: React.FC = () => {
  useEffect(() => {
    try {
      const consent = Cookies.get('raytech_cookie_consent_v1');
      if (consent === 'rejected') {
        // User explicitly opted out
        return;
      }
      if (consent === 'custom') {
        const prefs = JSON.parse(Cookies.get('raytech_cookie_preferences') || '{}');
        if (!prefs.analytics) return;
      }

      // If accepted or first-party default allowed
      if (consent === 'accepted') {
        initAnalytics().catch(() => {});
      }
    } catch {
      // safe fallback
    }
  }, []);

  return null;
};
