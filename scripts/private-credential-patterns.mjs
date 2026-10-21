// Report categories only. Never return or log matched credential values.
export function hasPrivateCredential(text) {
  if (/(?:sk-or-v1-[a-zA-Z0-9]{24,}|sk-proj-[a-zA-Z0-9_-]{24,}|oc_sk_[a-zA-Z0-9_-]{24,}|sb_secret_[a-zA-Z0-9_-]{20,}|github_pat_[a-zA-Z0-9_]{25,}|ghp_[a-zA-Z0-9]{25,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/.test(text)) return true;
  for (const token of text.matchAll(/eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g)) {
    try {
      const payload = JSON.parse(Buffer.from(token[0].split('.')[1], 'base64url').toString('utf8'));
      if (payload.role === 'service_role') return true;
    } catch { /* Malformed or public tokens are not private-key evidence. */ }
  }
  return false;
}
