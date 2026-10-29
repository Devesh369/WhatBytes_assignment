import { useState, useEffect, useCallback } from 'react';

export interface NextRouter {
  pathname: string;
  searchParams: URLSearchParams;
  push: (href: string) => void;
  replace: (href: string) => void;
  back: () => void;
  prefetch: (href: string) => void;
}

function parseLocation(): { pathname: string; searchParams: URLSearchParams } {
  // We use hash-based sub-routing so it works without server rewrite issues in sandboxes
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash || hash === '/') {
    return { pathname: '/login', searchParams: new URLSearchParams() };
  }

  const [path, query] = hash.split('?');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return {
    pathname: normalizedPath,
    searchParams: new URLSearchParams(query || ''),
  };
}

export function useRouter(): NextRouter {
  const [route, setRoute] = useState(parseLocation);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseLocation());
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const push = useCallback((href: string) => {
    const cleanHref = href.startsWith('#') ? href : `#${href}`;
    window.location.hash = cleanHref;
  }, []);

  const replace = useCallback((href: string) => {
    const cleanHref = href.startsWith('#') ? href : `#${href}`;
    const url = new URL(window.location.href);
    url.hash = cleanHref;
    window.location.replace(url.toString());
  }, []);

  const back = useCallback(() => {
    window.history.back();
  }, []);

  const prefetch = useCallback((_href: string) => {
    // Next.js client prefetch stub
  }, []);

  return {
    pathname: route.pathname,
    searchParams: route.searchParams,
    push,
    replace,
    back,
    prefetch,
  };
}
