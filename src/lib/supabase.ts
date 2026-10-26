import { createClient } from '@supabase/supabase-js';
import { checkAdminAccess, type AdminAccess } from '@/lib/admin-access';
import { firebaseEdgeFetch } from '@/lib/firebase-edge-fetch';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://btxrkhwyugzliswznkpx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0eHJraHd5dWd6bGlzd3pua3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzUwMTAsImV4cCI6MjEwNzIxMTAxMH0.VQ0mmf_6a2swpSyyEMBUpWtgt9CZ3hkBCH_l2fISwD4';

// Supabase's functions getter creates a NEW client on each access. The supported
// global fetch transport persists across those clients; patching invoke does not.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: firebaseEdgeFetch(supabaseUrl, async () => {
    const { auth } = await import('@/lib/firebase');
    return await auth.currentUser?.getIdToken() || null;
  }) },
});

export async function verifyAdminAccess(): Promise<AdminAccess> {
  return checkAdminAccess(() => supabase.functions.invoke('secure-dispatch', {
      body: { action: 'verify_admin', payload: {} },
    }));
}
