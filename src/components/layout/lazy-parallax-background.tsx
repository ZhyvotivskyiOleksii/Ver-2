'use client';

import { useTheme } from '@/hooks/use-theme';
import dynamic from 'next/dynamic';

const ParallaxBackground = dynamic(
  () => import('./parallax-background').then(mod => ({ default: mod.ParallaxBackground })),
  { ssr: false }
);

export function LazyParallaxBackground() {
  // Вимкнути паралакс повністю - просто картинка на фоні
  return null;
}
