import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/firebase';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://btxrkhwyugzliswznkpx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0eHJraHd5dWd6bGlzd3pua3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzUwMTAsImV4cCI6MjEwNzIxMTAxMH0.VQ0mmf_6a2swpSyyEMBUpWtgt9CZ3hkBCH_l2fISwD4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Firebase is the application's admin identity provider. Ensure every Edge
// Function invocation carries the current Firebase ID token, even if an old
// caller still passes the public Supabase key as its Authorization header.
const originalInvoke = supabase.functions.invoke.bind(supabase.functions);
(supabase.functions as typeof supabase.functions & { invoke: typeof originalInvoke }).invoke = async (name, options: any = {}) => {
  const token = await auth.currentUser?.getIdToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  return originalInvoke(name, { ...options, headers });
};

export async function verifyAdminAccess(): Promise<{ ok: boolean; email?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('secure-dispatch', {
      body: { action: 'verify_admin', payload: {} },
    });
    return { ok: !error && data?.success === true, email: data?.email };
  } catch {
    return { ok: false };
  }
}
