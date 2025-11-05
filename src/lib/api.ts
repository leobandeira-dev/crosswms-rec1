export function setupApiBaseFetch(): void {
  try {
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    const base = (apiBase || '').trim();

    if (!base) {
      // No base configured; keep default relative calls for dev/proxy
      return;
    }

    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const originalFetch = window.fetch.bind(window);

    // Patch global fetch to prefix API base for relative /api calls
    window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      let urlStr: string;
      if (typeof input === 'string') {
        urlStr = input;
      } else if (input instanceof URL) {
        urlStr = input.toString();
      } else {
        urlStr = (input as Request).url;
      }

      // Only rewrite relative /api paths
      if (urlStr.startsWith('/api')) {
        const prefixed = `${normalizedBase}${urlStr}`;
        return originalFetch(prefixed, init);
      }

      return originalFetch(input as any, init);
    };

    // Optional: expose for debugging
    (window as any).__API_BASE_URL__ = normalizedBase;
    console.log('[API] Using base URL:', normalizedBase);
  } catch (err) {
    console.warn('[API] Failed to setup API base fetch:', err);
  }
}

export function apiUrl(path: string): string {
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  const base = (apiBase || '').trim();
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedBase ? `${normalizedBase}${normalizedPath}` : normalizedPath;
}