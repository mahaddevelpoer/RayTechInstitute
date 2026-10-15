'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  getRateLimitStatus,
  recordFailedAttempt,
  resetRateLimit,
  setAdminSession,
} from '@/utils/security';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [remainingSec, setRemainingSec] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated via Firebase
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAdminSession(user.uid);
        router.push('/admin');
      }
    });

    const { isLocked: locked, remainingSec: sec } = getRateLimitStatus();
    setIsLocked(locked);
    setRemainingSec(sec);

    if (locked) {
      const timer = setInterval(() => {
        setRemainingSec((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        clearInterval(timer);
        unsubscribe();
      };
    }

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const status = getRateLimitStatus();
    if (status.isLocked) {
      setIsLocked(true);
      setRemainingSec(status.remainingSec);
      setErrorMsg(`Too many failed attempts. Locked for ${status.remainingSec}s.`);
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      resetRateLimit();
      setAdminSession(token || user.uid);
      router.push('/admin');
    } catch (err: unknown) {
      const attemptStatus = recordFailedAttempt();
      if (attemptStatus.isLocked) {
        setIsLocked(true);
        setRemainingSec(attemptStatus.remainingSec);
        setErrorMsg(`Account locked for ${attemptStatus.remainingSec} seconds due to repeated failed attempts.`);
      } else {
        const error = err as { code?: string; message?: string };
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          setErrorMsg('Invalid email or password. Please check your credentials in Firebase.');
        } else if (error.code === 'auth/too-many-requests') {
          setErrorMsg('Access temporarily blocked due to repeated attempts. Please try later.');
        } else {
          setErrorMsg(error.message || 'Login failed. Please verify credentials.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-card">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy-50 text-navy-700 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-navy-900">
            Administrator Login
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            RayTech Portal &bull; Authorized Staff Only
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLocked ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded text-center space-y-2">
            <Clock className="w-6 h-6 text-orange-600 mx-auto animate-pulse" />
            <p className="text-xs text-slate-600">
              Security lockout active. Please wait:
            </p>
            <div className="text-xl font-bold text-navy-900">
              {remainingSec}s
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Admin Email
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@raytechinstitute.com"
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-navy-600 transition-colors"
                  autoComplete="username"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-navy-600 transition-colors"
                  autoComplete="current-password"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center text-xs py-2.5 mt-2"
            >
              <span>{isLoading ? 'Verifying with Firebase...' : 'Log In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-between">
          <Link href="/" className="hover:text-navy-700 transition-colors">
            &larr; Back to Website
          </Link>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Firebase Auth</span>
          </span>
        </div>
      </div>
    </div>
  );
}
