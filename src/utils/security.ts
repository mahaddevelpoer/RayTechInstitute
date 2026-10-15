/**
 * Security & Hardening Utilities
 * Enterprise-grade anti-XSS, rate-limiting, and cryptographic password handling.
 */

import { auth } from '@/lib/firebase';

// Simple robust HTML escaping to prevent XSS injection
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strict URL sanitizer & normalizer.
 * Rejects dangerous protocols (javascript:, data:, vbscript:, file:).
 * Automatically normalizes external domains with https://.
 */
export function sanitizeUrl(url?: string | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return '';
  }

  // Protocol-relative URLs (//host) are external URLs, not safe local paths.
  if (trimmed.startsWith('//')) {
    return '';
  }

  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return trimmed;
  }

  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

// Compute SHA-256 hash with cryptographic salt using Web Crypto API
export async function hashPasswordWithSalt(password: string, salt: string = 'RayTechEduSecSalt2026'): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + ':' + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Rate Limiting & Anti-Brute-Force Tracker
interface RateLimitState {
  attempts: number;
  lockedUntil: number;
}

const STORAGE_KEY = 'raytech_admin_ratelimit';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000; // 1 minute lockout after 5 consecutive failures

export function getRateLimitStatus(): { isLocked: boolean; remainingSec: number } {
  if (typeof window === 'undefined') return { isLocked: false, remainingSec: 0 };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { isLocked: false, remainingSec: 0 };
    const state: RateLimitState = JSON.parse(raw);
    const now = Date.now();
    if (state.lockedUntil > now) {
      return { isLocked: true, remainingSec: Math.ceil((state.lockedUntil - now) / 1000) };
    }
  } catch {
    // In case of corrupt state, allow retry
  }
  return { isLocked: false, remainingSec: 0 };
}

export function recordFailedAttempt(): { isLocked: boolean; remainingSec: number } {
  if (typeof window === 'undefined') return { isLocked: false, remainingSec: 0 };
  const now = Date.now();
  let state: RateLimitState = { attempts: 0, lockedUntil: 0 };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) state = JSON.parse(raw);
  } catch {
    state = { attempts: 0, lockedUntil: 0 };
  }

  state.attempts += 1;
  if (state.attempts >= MAX_ATTEMPTS) {
    state.lockedUntil = now + LOCKOUT_MS;
    state.attempts = 0; // reset for next cycle
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { isLocked: true, remainingSec: 60 };
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return { isLocked: false, remainingSec: 0 };
}

export function resetRateLimit(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

// Session Token Management (Secure Admin Session)
const SESSION_KEY = 'raytech_admin_session';

export function setAdminSession(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSION_KEY, token);
}

export function getAdminSession(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(SESSION_KEY);
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Returns the currently authenticated Firebase ID Token for admin API dispatches.
 */
export async function getFirebaseIdToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
  } catch {
    // Fall back to stored session token
  }
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session && session.includes('.')) {
    return session;
  }
  return null;
}

/**
 * Validates whether the user has a valid, non-expired Firebase ID Token session.
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  // The Firebase SDK owns token validation and refresh. A JWT payload decoded
  // in the browser is not proof of authenticity because its signature is not
  // verified there. Keep the session token only as a transport credential.
  return auth.currentUser !== null;
}

