'use client';

import { getAuth } from 'firebase/auth';
import { app } from './firebase-app';

export { app } from './firebase-app';
export { initAnalytics } from './analytics';
export const auth = getAuth(app);
