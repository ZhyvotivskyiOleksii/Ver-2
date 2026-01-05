
import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import { fontBody, fontHeadline, fontCode, fontDisplay } from '@/app/fonts';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/hooks/use-theme';
import { ScrollRestorer } from '@/components/shared/scroll-restorer';
import { LazyCookieBanner } from '@/components/shared/lazy-cookie-banner';
import { LazyChatWidget } from '@/components/lazy-chat-widget';
import { LazyParallaxBackground } from '@/components/layout/lazy-parallax-background';

// Локалізовані заголовки та описи
const siteMetadata: Record<string, { title: string; description: string }> = {
  ua: {
    title: 'WebImpuls Studio | Створення сайтів та веб-додатків',
    description: 'Створюємо швидкі та ефективні веб-рішення для вашого бізнесу. Лендінги, корпоративні сайти, інтернет-магазини та SaaS на Next.js.',
  },
  pl: {
    title: 'WebImpuls Studio | Tworzenie stron i aplikacji webowych',
    description: 'Tworzymy szybkie i wydajne rozwiązania webowe dla Twojego biznesu. Landing page, strony korporacyjne, sklepy internetowe i SaaS na Next.js.',
  },
  en: {
    title: 'WebImpuls Studio | Website & Web App Development',
    description: 'We create fast and effective web solutions for your business. Landing pages, corporate websites, e-commerce stores and SaaS on Next.js.',
  },
  de: {
    title: 'WebImpuls Studio | Website- & Web-App-Entwicklung',
    description: 'Wir erstellen schnelle und effektive Weblösungen für Ihr Unternehmen. Landingpages, Unternehmenswebsites, E-Commerce und SaaS mit Next.js.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = siteMetadata[locale] || siteMetadata.ua;
  
  return {
    title: {
      template: '%s | WebImpuls Studio',
      default: meta.title,
    },
    description: meta.description,
  };
}

export async function generateStaticParams() {
  const locales = ['ua', 'pl', 'en', 'de'];
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/icons/logo-web.svg" type="image/svg+xml" />
        <link rel="icon" href="/icons/logo-web.png" type="image/png" sizes="200x74" />
        <link rel="apple-touch-icon" href="/icons/logo-web.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getInitialTheme() {
                  try {
                    const storedTheme = localStorage.getItem('theme');
                    if (storedTheme) {
                      return storedTheme;
                    }
                    return 'dark';
                  } catch (e) {
                    return 'dark';
                  }
                }
                
                function applyTheme(theme) {
                  const root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  
                  let effectiveTheme = theme;
                  if (theme === 'system') {
                    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  root.classList.add(effectiveTheme);
                  root.dataset.theme = effectiveTheme;
                }

                const initialTheme = getInitialTheme();
                applyTheme(initialTheme);
              })();
            `,
          }}
        />
      </head>
      <body className={cn(
          "font-body antialiased",
          fontBody.variable,
          fontHeadline.variable,
          fontDisplay.variable,
          fontCode.variable
      )}>
        <ThemeProvider>
          <LazyParallaxBackground />
          <div className="relative z-10">
            <ScrollRestorer />
            {children}
            <Toaster />
            <LazyCookieBanner />
            <LazyChatWidget />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
