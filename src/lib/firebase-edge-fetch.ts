/** Attach Firebase identity only to this project's Edge endpoints, never REST or foreign hosts. */
export function firebaseEdgeFetch(projectUrl: string, getToken: () => Promise<string | null>, fetcher: typeof fetch = (...args) => fetch(...args)): typeof fetch {
  const endpoint = new URL('/functions/v1/', projectUrl);
  return async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    if (url.origin !== endpoint.origin || !url.pathname.startsWith(endpoint.pathname)) return fetcher(input, init);
    const token = await getToken();
    if (!token) return fetcher(input, init);
    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(init?.headers).forEach((value, name) => headers.set(name, value));
    headers.set('Authorization', `Bearer ${token}`);
    return fetcher(input, { ...init, headers });
  };
}
