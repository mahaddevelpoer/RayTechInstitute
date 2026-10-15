'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { ShieldCheck, Cookie as CookieIcon, Check, X } from 'lucide-react';
import { initAnalytics } from '@/lib/firebase';

const COOKIE_CONSENT_KEY = 'raytech_cookie_consent_v1';
const COOKIE_PREFS_KEY = 'raytech_cookie_preferences';

export interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  functional: boolean;
}

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [functionalAllowed, setFunctionalAllowed] = useState(true);

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = Cookies.get(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      // Small timeout so it doesn't block initial page paint (INP/LCP friendly)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (savedConsent === 'accepted' || savedConsent === 'custom') {
      try {
        const prefs: CookiePreferences = JSON.parse(Cookies.get(COOKIE_PREFS_KEY) || '{}');
        if (prefs.analytics) {
          // Initialize real analytics only if permitted
          initAnalytics();
        }
      } catch {
        initAnalytics();
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      functional: true,
    };
    // Save cookies with 365 days expiry
    Cookies.set(COOKIE_CONSENT_KEY, 'accepted', { expires: 365, sameSite: 'lax' });
    Cookies.set(COOKIE_PREFS_KEY, JSON.stringify(prefs), { expires: 365, sameSite: 'lax' });

    // Initialize real analytics
    initAnalytics();

    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: analyticsAllowed,
      functional: functionalAllowed,
    };
    Cookies.set(COOKIE_CONSENT_KEY, 'custom', { expires: 365, sameSite: 'lax' });
    Cookies.set(COOKIE_PREFS_KEY, JSON.stringify(prefs), { expires: 365, sameSite: 'lax' });

    if (analyticsAllowed) {
      initAnalytics();
    } else {
      // Remove any tracking cookies if user rejected
      Cookies.remove('_ga');
      Cookies.remove('_ga_MF7C513JMZ');
      Cookies.remove('_gid');
    }

    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: false,
      functional: false,
    };
    Cookies.set(COOKIE_CONSENT_KEY, 'rejected', { expires: 180, sameSite: 'lax' });
    Cookies.set(COOKIE_PREFS_KEY, JSON.stringify(prefs), { expires: 180, sameSite: 'lax' });

    // Clean tracking cookies
    Cookies.remove('_ga');
    Cookies.remove('_ga_MF7C513JMZ');
    Cookies.remove('_gid');

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-white border border-slate-300 rounded-lg shadow-xl p-4 sm:p-5 text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-md bg-navy-50 text-navy-700 flex items-center justify-center shrink-0 mt-0.5 border border-navy-100">
          <CookieIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-sm text-navy-900 flex items-center gap-1.5">
              <span>Privacy &amp; Cookie Consent</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Dismiss banner temporarily"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-slate-600 leading-relaxed">
            We use functional cookies to remember your theme &amp; educational bookmarks, and optional analytics to measure speed and study material usage in Pakistan. No ads or 3rd party profiling.
          </p>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Essential &amp; Security</div>
                  <div className="text-slate-500">Required for login sessions &amp; anti-brute force security.</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Always Active
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Performance &amp; Analytics</div>
                  <div className="text-slate-500">Google / Firebase Analytics to verify page loading speeds.</div>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="w-4 h-4 text-navy-600 rounded border-slate-300 focus:ring-navy-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Preferences &amp; Compiler State</div>
                  <div className="text-slate-500">Stores saved code snippets &amp; dark/light mode choice.</div>
                </div>
                <input
                  type="checkbox"
                  checked={functionalAllowed}
                  onChange={(e) => setFunctionalAllowed(e.target.checked)}
                  className="w-4 h-4 text-navy-600 rounded border-slate-300 focus:ring-navy-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <Link
              href="/privacy-policy"
              className="underline hover:text-navy-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-navy-700 font-semibold hover:underline"
            >
              {showDetails ? 'Hide Options' : 'Customize Preferences'}
            </button>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-2">
            {showDetails ? (
              <button
                onClick={handleSavePreferences}
                className="btn-primary text-xs py-1.5 px-3 flex-1 justify-center"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Preferences</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="btn-primary text-xs py-1.5 px-3 flex-1 justify-center"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
                <button
                  onClick={handleRejectNonEssential}
                  className="btn-secondary text-xs py-1.5 px-3 justify-center"
                >
                  <span>Decline Optional</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
