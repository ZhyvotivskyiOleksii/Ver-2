'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ParallaxBackground = dynamic(
  () => import('./parallax-background').then(mod => ({ default: mod.ParallaxBackground })),
  { ssr: false, loading: () => null }
);

export function LazyParallaxBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Disable on mobile and tablet for better performance (LCP, TBT)
    // Only enable on desktop (1024px+)
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;
    
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    const activate = () => {
      if (!cancelled) setEnabled(true);
    };

    // Delay loading to after LCP - 3 seconds
    const timeout = window.setTimeout(activate, 3000);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  if (!enabled) return null;
  return <ParallaxBackground />;
}
