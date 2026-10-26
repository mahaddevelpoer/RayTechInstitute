'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { initAnalytics } from '@/lib/analytics';

/**
 * FirebaseAnalytics: boots Firebase Analytics only when cookie consent allows it.
 * Respects user GDPR/ePrivacy choices stored in js-cookie.
 */
export const FirebaseAnalytics: React.FC = () => {
  useEffect(() => {
    try {
      const consent = Cookies.get('raytech_cookie_consent_v1');
      if (consent !== 'accepted' && consent !== 'custom') return;
      const prefs = JSON.parse(Cookies.get('raytech_cookie_preferences') || '{}');
      if (prefs.analytics === true) initAnalytics().catch(() => {});
    } catch {
      // safe fallback
    }
  }, []);

  return null;
};
