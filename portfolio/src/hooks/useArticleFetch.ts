import { useEffect, useState } from 'react';

type RequestStatus = 'loading' | 'success' | 'error' | 'not-found';

interface ArticleFetchState<T> {
  url: string;
  status: RequestStatus;
  data: T | null;
}

export function useArticleFetch<T>(url: string, timeoutMs = 7000) {
  const [state, setState] = useState<ArticleFetchState<T>>({ url, status: 'loading', data: null });

  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    async function loadArticle() {
      try {
        const response = await fetch(url, { signal: controller.signal });

        if (response.status === 404) {
          setState({ url, status: 'not-found', data: null });
          return;
        }

        if (!response.ok) {
          throw new Error(`Request failed ${response.status}`);
        }

        const data = (await response.json()) as T;
        setState({ url, status: 'success', data });
      } catch {
        if (!controller.signal.aborted || timedOut) {
          setState({ url, status: 'error', data: null });
        }
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    loadArticle();

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [timeoutMs, url]);

  const currentState = state.url === url ? state : { status: 'loading' as const, data: null };

  return {
    data: currentState.data,
    isLoading: currentState.status === 'loading',
    hasError: currentState.status === 'error',
    notFound: currentState.status === 'not-found',
  };
}
