export const TECH_ICONS: Record<string, JSX.Element> = {
  'next.js': (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="none">
      <path fill="currentColor" d="M16 6.4a9.6 9.6 0 1 0 9.6 9.6A9.61 9.61 0 0 0 16 6.4Zm0-3.2a12.8 12.8 0 1 1-12.8 12.8A12.8 12.8 0 0 1 16 3.2Z" />
      <path fill="currentColor" d="m21.76 22.4-9.36-13.02h-1.74v13.02h2.18V12.7l7.74 10.9h1.96V9.38h-2.18Z" />
    </svg>
  ),
  react: (
    <svg viewBox="-11 -10 22 20" className="h-3.5 w-3.5" fill="none">
      <circle cx="0" cy="0" r="2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1">
        <ellipse rx="10" ry="4" />
        <ellipse rx="10" ry="4" transform="rotate(60)" />
        <ellipse rx="10" ry="4" transform="rotate(120)" />
      </g>
    </svg>
  ),
  tailwind: (
    <svg viewBox="0 0 54 33" className="h-3.5 w-3.5" fill="none">
      <path fill="currentColor" d="M27 0C19.8 0 15.3 3.3 13.5 9.9c2.7-3.3 5.85-4.5 9.45-3.6 2.054.513 3.522 2.004 5.153 3.62C30.651 12.43 34.05 16 40.5 16c7.2 0 11.7-3.3 13.5-9.9-2.7 3.3-5.85 4.5-9.45 3.6-2.054-.513-3.522-2.004-5.153-3.62C36.849 3.57 33.45 0 27 0Zm-13.5 16C6.3 16 1.8 19.3 0 25.9c2.7-3.3 5.85-4.5 9.45-3.6 2.054.513 3.522 2.004 5.153 3.62C15.651 28.43 19.05 32 25.5 32c7.2 0 11.7-3.3 13.5-9.9-2.7 3.3-5.85 4.5-9.45 3.6-2.054-.513-3.522-2.004-5.153-3.62C21.849 19.57 18.45 16 13.5 16Z" />
    </svg>
  ),
  stripe: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M25.6 10.4c0-3.76-3.111-5.116-6.828-5.116-3.092 0-5.564.72-6.808 1.365l-.262 4.846 2.82-.6v-2.42c.532-.28 1.922-.588 3.146-.588 1.768 0 2.57.716 2.57 1.878v.44c-.946-.24-2.189-.48-3.724-.48-3.635 0-6.742 1.502-6.742 5.1 0 3.266 2.318 5.18 5.498 5.18 1.838 0 3.17-.388 4.074-.86v.608c0 .988.848 1.778 1.94 1.778h2.408l.008-11.231ZM20.14 18.7c-.645.324-1.614.54-2.622.54-1.36 0-2.204-.6-2.204-1.63 0-1.08.844-1.7 2.204-1.7 1.084 0 1.977.22 2.622.456v2.334Z" />
    </svg>
  ),
  supabase: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="none">
      <path d="M5 6.5h13.8c.6 0 1.1.4 1.2.9l3 17.9c.1.5-.4.9-.9.6l-6.4-4.1a1.2 1.2 0 0 0-1.8.6L11 28.9c-.2.5-1 .4-1.1-.2L4 7.7C3.9 7.1 4.4 6.5 5 6.5Z" fill="#3ECF8E" />
      <path d="M26.9 25.5H12.6c-.6 0-1.1-.4-1.2-.9L8.3 6.8c-.1-.5.4-.9.9-.6l6.6 4.3c.5.3 1.1.1 1.3-.4l2.3-5.5c.2-.5 1-.4 1.1.2l4.4 19.3c.1.6-.3 1.2-1 1.2Z" fill="#249361" />
    </svg>
  ),
  vercel: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="none">
      <path d="M16 6 27 24H5L16 6Z" fill="currentColor" />
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M2 16v14h28V2H2v14Zm22.3-1.1v1.9h-3.6v10.4h-2.3V16.8h-3.6v-1.9h9.5Zm-11.2 1.6v.7h-2v9.7H8.9v-9.7H5.1v-2.3h10l-.1 1.6Z" />
    </svg>
  ),
  figma: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="none">
      <path d="M11.5 28a4.5 4.5 0 0 0 4.5-4.5v-4.5h-4.5a4.5 4.5 0 0 0 0 9Z" fill="#0ACF83" />
      <path d="M7 14.5A4.5 4.5 0 0 1 11.5 10H16v9h-4.5A4.5 4.5 0 0 1 7 14.5Z" fill="#A259FF" />
      <path d="M7 5.5A4.5 4.5 0 0 1 11.5 1H16v9h-4.5A4.5 4.5 0 0 1 7 5.5Z" fill="#F24E1E" />
      <path d="M16 1h4.5a4.5 4.5 0 0 1 0 9H16V1Z" fill="#FF7262" />
      <path d="M25 14.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" fill="#1ABCFE" />
    </svg>
  ),
  framer: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M6 2h20v10H16L6 2Zm0 10h10l10 10H16v10L6 22V12Z" />
    </svg>
  ),
  prisma: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M26.9 24.5 16.3 2.7c-.4-.8-1.5-.9-2-.2L3.5 18.3c-.4.5-.3 1.2.2 1.6l11.4 9.5c.4.3 1 .3 1.4 0l10.2-3.5c.4-.2.6-.6.5-1l-.3-.4ZM15.3 26.8l-8.7-7.3 8.7-3.1v10.4Zm1.5 0V16.4l6.5 2.3-6.5 8.1Z" />
    </svg>
  ),
  postgresql: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M25.6 10.3c-.5-2-1.8-3.6-3.5-4.6-1.8-1-4-1.2-5.9-.6a7.3 7.3 0 0 0-8 2.3c-1.8 2.2-2.2 5.3-1.1 7.9.3.8.8 1.5 1.2 2.3l.1.1c.4.6.7 1.3.9 2 .1.5.1 1.1.1 1.6v2.4c0 1.3 1.1 2.4 2.4 2.4h.4c.3 0 .6 0 .9-.1.6-.2 1.1-.6 1.4-1.2.3.6.8 1 1.4 1.2.3.1.6.1.9.1h.4c1.3 0 2.4-1.1 2.4-2.4v-2.4c0-.6 0-1.1.1-1.6.2-.7.5-1.4.9-2l.1-.1c.5-.7.9-1.5 1.2-2.3.8-2.1.7-4.5-.3-6.5l-.1-.5Z" />
    </svg>
  ),
  redis: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M30.3 19.5c-1.9 1-11.8 5.1-13.9 6.2-2.1 1.1-3.3 1.1-4.9.3-1.7-.8-12.4-5.1-14.3-6-.9-.5-1.4-.9-1.4-1.3v-4c0 0 13.5-2.9 15.8-3.7 2.3-.8 3.1-.8 5.1 0 2 .7 13.3 2.8 15.3 3.4v4c0 .5-.6.9-1.7 1.1Z" />
      <path d="M30.3 15.1c-1.9 1-11.8 5.1-13.9 6.2-2.1 1.1-3.3 1.1-4.9.3-1.7-.8-12.4-5.1-14.3-6-1.9-.9-2-1.5-.1-2.2 1.9-.8 12.5-5 14.8-5.8 2.3-.8 3.1-.8 5.1 0 2 .7 11.7 4.6 13.6 5.4 2 .8 1.6 1.4-.3 2.1Z" />
    </svg>
  ),
  trpc: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M16 4 4 10v12l12 6 12-6V10L16 4Zm0 3.5 8 4v8l-8 4-8-4v-8l8-4Z" />
    </svg>
  ),
  sentry: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M18.3 4.3a2.5 2.5 0 0 0-4.3 0L2.3 24.8a2.5 2.5 0 0 0 2.2 3.7h7.4a9 9 0 0 1-1.5-5H6.8L16 7.3l4.6 8c.8-.3 1.7-.5 2.6-.5.4 0 .8 0 1.2.1l-6.1-10.6Zm8.2 16.8a4 4 0 0 0-5.6-5.6L27.5 28h-3.3l-3.6-6.3a1.5 1.5 0 1 1 2.6 0L26 27.1l.5-.8c.3-.5.3-1.1 0-1.6l-2.5-4.3c.2-.1.4-.2.5-.3Z" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M4 20h4v-8H4v8Zm6 0h4V4h-4v16Zm6 0h4v-12h-4v12Z" />
    </svg>
  ),
  monitoring: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M3 13h2v8H3v-8Zm4-6h2v14H7V7Zm4-4h2v18h-2V3Zm4 8h2v10h-2V11Zm4 4h2v6h-2v-6Z" />
    </svg>
  ),
  zustand: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <circle cx="16" cy="16" r="12" />
    </svg>
  ),
  lighthouse: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Zm1 17.9v-5.4l3.9 3.9c-1.1.9-2.4 1.4-3.9 1.5Zm-2-5.4v5.4c-1.5-.1-2.8-.6-3.9-1.5l3.9-3.9Zm-5.4-3.5h5.4v5.4l-3.9-3.9c-.9-1.1-1.4-2.4-1.5-3.9v2.4Zm12.3 1.5-3.9-3.9h5.4c-.1 1.5-.6 2.8-1.5 3.9ZM11 4.1v5.4L7.1 5.6C8.2 4.7 9.5 4.2 11 4.1Zm2 5.4V4.1c1.5.1 2.8.6 3.9 1.5L13 9.5Zm5.4 1.5h-5.4L16.9 7.1c.9 1.1 1.4 2.4 1.5 3.9Z" />
    </svg>
  ),
  clerk: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M16 4a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z" />
    </svg>
  ),
  shadcn: (
    <svg viewBox="0 0 32 32" className="h-3.5 w-3.5" fill="currentColor">
      <rect x="4" y="4" width="10" height="10" rx="2" />
      <rect x="18" y="4" width="10" height="10" rx="2" />
      <rect x="4" y="18" width="10" height="10" rx="2" />
      <rect x="18" y="18" width="10" height="10" rx="2" />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
    </svg>
  ),
};

export function getTechIcon(name: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes('next')) return TECH_ICONS['next.js'];
  if (normalized.includes('react') && !normalized.includes('query')) return TECH_ICONS.react;
  if (normalized.includes('tailwind')) return TECH_ICONS.tailwind;
  if (normalized.includes('stripe')) return TECH_ICONS.stripe;
  if (normalized.includes('supabase')) return TECH_ICONS.supabase;
  if (normalized.includes('vercel')) return TECH_ICONS.vercel;
  if (normalized.includes('typescript')) return TECH_ICONS.typescript;
  if (normalized.includes('figma')) return TECH_ICONS.figma;
  if (normalized.includes('framer')) return TECH_ICONS.framer;
  if (normalized.includes('prisma')) return TECH_ICONS.prisma;
  if (normalized.includes('postgres')) return TECH_ICONS.postgresql;
  if (normalized.includes('redis')) return TECH_ICONS.redis;
  if (normalized.includes('trpc')) return TECH_ICONS.trpc;
  if (normalized.includes('sentry')) return TECH_ICONS.sentry;
  if (normalized.includes('analytics')) return TECH_ICONS.analytics;
  if (normalized.includes('monitoring') || normalized.includes('uptime')) return TECH_ICONS.monitoring;
  if (normalized.includes('zustand')) return TECH_ICONS.zustand;
  if (normalized.includes('lighthouse')) return TECH_ICONS.lighthouse;
  if (normalized.includes('clerk')) return TECH_ICONS.clerk;
  if (normalized.includes('shadcn')) return TECH_ICONS.shadcn;
  if (normalized.includes('query')) return TECH_ICONS.react;
  if (normalized.includes('google')) return TECH_ICONS.google;

  return null;
}
