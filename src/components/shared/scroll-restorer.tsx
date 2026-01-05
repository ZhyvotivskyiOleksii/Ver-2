'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const LOCALE_SCROLL_STORAGE_KEY = 'locale-scroll-position';

export function ScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const saved = sessionStorage.getItem(LOCALE_SCROLL_STORAGE_KEY);
    if (!saved) {
      return;
    }

    const y = Number(saved);
    sessionStorage.removeItem(LOCALE_SCROLL_STORAGE_KEY);

    requestAnimationFrame(() => {
      window.scrollTo(0, Number.isFinite(y) ? y : 0);
    });
  }, [pathname]);

  return null;
}
