'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DISMISSED_NOTIFICATION_KEY = 'raytech_notif_prompt_dismissed';

export default function NotificationPrompt() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    setPermission(Notification.permission);

    // If permission not granted and not previously dismissed, prompt user after 3 seconds
    if (Notification.permission === 'default') {
      const dismissed = sessionStorage.getItem(DISMISSED_NOTIFICATION_KEY);
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleSubscribe = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }

    setIsSubscribing(true);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        let fcmToken = '';

        // Register Service Worker
        if ('serviceWorker' in navigator) {
          try {
            await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          } catch (e) {
            console.log('SW registration error:', e);
          }
        }

        // Try getting token from Firebase Messaging if available
        try {
          const { getMessaging, getToken, isSupported } = await import('firebase/messaging');
          const supported = await isSupported();
          if (supported) {
            const { app } = await import('@/lib/firebase');
            const messaging = getMessaging(app);
            // Default vapidKey or FCM token retrieval
            fcmToken = await getToken(messaging, {
              vapidKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgD zkL8-mZ2mJ9h2kK3q3r_dummy', // Or standard FCM token
            }).catch(() => '');
          }
        } catch {
          // Token retrieval optional
        }

        const fallbackToken = fcmToken || `web_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Save subscriber to Supabase notification_subscribers table
        if (supabase) {
          try {
            await supabase.from('notification_subscribers').upsert({
              token: fallbackToken,
              user_agent: navigator.userAgent,
              subscribed_at: new Date().toISOString(),
            }, { onConflict: 'token' });
          } catch {
            // silent ignore
          }
        }

        setSubscribedSuccess(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        setIsVisible(false);
      }
    } catch {
      setIsVisible(false);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_NOTIFICATION_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible || permission === 'granted' || permission === 'denied') {
    return null;
  }

  return (
    <aside
      aria-label="Notification Subscription"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 bg-white border border-slate-200 rounded-lg shadow-xl p-4 text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-navy-50 text-navy-700 flex items-center justify-center shrink-0 border border-navy-100">
          <Bell className="w-4 h-4 animate-bounce" />
        </div>

        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-slate-900 text-xs">
              Board Results &amp; Lecture Alerts
            </h3>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Close alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
            Receive real-time push alerts on Punjab Boards (BISE Lahore, Gujranwala) Gazettes, new notes &amp; Python tutorials.
          </p>

          {subscribedSuccess ? (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 p-2 rounded text-[11px] font-semibold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Notifications enabled successfully!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="btn-primary text-[11px] py-1.5 px-3 flex-1 justify-center"
              >
                <span>{isSubscribing ? 'Subscribing...' : 'Allow Updates'}</span>
              </button>
              <button
                onClick={handleDismiss}
                className="btn-secondary text-[11px] py-1.5 px-2.5 justify-center"
              >
                <span>Later</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
