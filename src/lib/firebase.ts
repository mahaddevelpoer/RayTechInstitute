'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBKyaUYaCQcdyG1Pwt3P8BUmoES3O0lIDQ',
  authDomain: 'raytechinstitute.firebaseapp.com',
  projectId: 'raytechinstitute',
  storageBucket: 'raytechinstitute.firebasestorage.app',
  messagingSenderId: '569755120405',
  appId: '1:569755120405:web:4944f4e14cc29602e66f1c',
  measurementId: 'G-MF7C513JMZ',
};

// Initialize Firebase only once
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);

export { app, auth };

// Analytics browser loader
export async function initAnalytics() {
  if (typeof window === 'undefined') return null;
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    const supported = await isSupported();
    if (!supported) return null;
    return getAnalytics(app);
  } catch {
    return null;
  }
}
