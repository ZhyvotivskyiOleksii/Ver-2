import { Nunito, Quicksand, Source_Code_Pro, Poppins } from 'next/font/google';

export const fontBody = Quicksand({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'sans-serif'],
});

export const fontHeadline = Nunito({
  subsets: ['latin', 'cyrillic-ext'],
  variable: '--font-headline',
  display: 'swap',
  weight: ['800'],
  fallback: ['system-ui', 'sans-serif'],
});

export const fontDisplay = Poppins({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['800'],
  fallback: ['system-ui', 'sans-serif'],
});

export const fontCode = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-code',
  weight: '400',
  display: 'swap',
  fallback: ['monospace'],
});
