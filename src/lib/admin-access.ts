export interface AdminAccess {
  ok: boolean;
  email?: string;
  reason?: 'unauthorized' | 'unavailable';
}

/** A network outage is not evidence that a signed-in user lacks privileges. */
export async function checkAdminAccess(invoke: () => Promise<{ data: any; error: any }>): Promise<AdminAccess> {
  try {
    const { data, error } = await invoke();
    if (!error && data?.success === true) return { ok: true, email: typeof data.email === 'string' ? data.email : undefined };
    const status = error?.context?.status;
    if (status === 401 || status === 403 || (!error && data?.success === false)) return { ok: false, reason: 'unauthorized' };
    return { ok: false, reason: 'unavailable' };
  } catch { return { ok: false, reason: 'unavailable' }; }
}
