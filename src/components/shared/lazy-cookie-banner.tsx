'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CookieBanner = dynamic(
  () => import('./cookie-banner').then(mod => ({ default: mod.CookieBanner })),
  { ssr: false, loading: () => null }
);

const requestIdle =
  typeof window === 'undefined' ? null : (window as any).requestIdleCallback?.bind(window);

export function LazyCookieBanner() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const show = () => {
      if (!cancelled) setEnabled(true);
    };

    if (requestIdle) {
      const id = requestIdle(show, { timeout: 4500 });
      return () => {
        cancelled = true;
        if ((window as any).cancelIdleCallback) {
          (window as any).cancelIdleCallback(id);
        }
      };
    }

    const timeout = window.setTimeout(show, 4500);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  if (!enabled) return null;
  return <CookieBanner />;
}
