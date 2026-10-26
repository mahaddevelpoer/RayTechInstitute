'use client';

import { initializeApp, getApps } from 'firebase/app';

// Public web configuration; authentication is initialized only by its own entry.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBKyaUYaCQcdyG1Pwt3P8BUmoES3O0lIDQ',
  authDomain: 'raytechinstitute.firebaseapp.com',
  projectId: 'raytechinstitute',
  storageBucket: 'raytechinstitute.firebasestorage.app',
  messagingSenderId: '569755120405',
  appId: '1:569755120405:web:4944f4e14cc29602e66f1c',
  measurementId: 'G-MF7C513JMZ',
};

export const app = getApps()[0] || initializeApp(firebaseConfig);
