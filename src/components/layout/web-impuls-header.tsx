
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Feather,
  Sun,
  Moon,
  X,
  Menu,
  Home,
  Users,
  Sparkles,
  Wallet,
  MessageCircle,
  PenLine,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { LanguageSwitcher } from '../shared/language-switcher';
import { ThemeSwitcher } from '../shared/theme-switcher';
import { useTheme, type Theme } from '@/hooks/use-theme';
import { translations } from '@/lib/translations';
import { useParams, usePathname } from 'next/navigation';
import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
);

const UkraineFlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 900 600">
        <rect width="900" height="600" fill="#0057b7"/>
        <rect width="900" height="300" y="300" fill="#ffd700"/>
    </svg>
);

const PolandFlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 1280 800">
        <rect width="1280" height="800" fill="#fff"/>
        <rect width="1280" height="400" y="400" fill="#dc143c"/>
    </svg>
);

const UKFlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 1200 600">
        <rect width="1200" height="600" fill="#012169"/>
        <path d="M0,0 L1200,600 M0,600 L1200,0" stroke="#fff" strokeWidth="120"/>
        <path d="M0,0 L1200,600 M0,600 L1200,0" stroke="#C8102E" strokeWidth="80"/>
        <path d="M600,0 V600 M0,300 H1200" stroke="#fff" strokeWidth="200"/>
        <path d="M600,0 V600 M0,300 H1200" stroke="#C8102E" strokeWidth="120"/>
    </svg>
);

const GermanFlagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 5 3">
        <rect width="5" height="3" y="0" fill="#000"/>
        <rect width="5" height="2" y="1" fill="#D00"/>
        <rect width="5" height="1" y="2" fill="#FFCE00"/>
    </svg>
);

const languages = [
  { code: 'ua', Flag: UkraineFlagIcon },
  { code: 'pl', Flag: PolandFlagIcon },
  { code: 'en', Flag: UKFlagIcon },
  { code: 'de', Flag: GermanFlagIcon },
];

export function WebImpulsHeader() {
    const params = useParams();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const scrollLockRef = useRef(0);
    const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale || 'ua';
    const t = (translations as any)[locale] || translations.ua;
    const { theme, setTheme: setThemePreference } = useTheme();
    const isDarkMode = theme === 'dark';
    const handleThemeChange = (newTheme: Theme) => setThemePreference(newTheme);
    const navShellStyle: CSSProperties = {
        borderRadius: '9999px 0 0 9999px',
        background: 'linear-gradient(135deg, rgba(12,11,18,0.96), rgba(52,34,80,0.92))',
        border: 'none',
        borderLeft: '6px solid #8b5cf6',
        boxShadow: '0 22px 40px rgba(5,6,11,0.6)',
    };
    const navLinkClass = cn(
        "relative animated-underline text-sm font-medium transition-colors text-white"
    );
    const blogLinkClass = cn(
        "relative animated-underline flex items-center gap-1.5 text-sm font-medium transition-colors text-white"
    );
    const dividerClass = 'bg-white/10';
    
    useEffect(() => {
        const { body } = document;
        if (isMenuOpen) {
            scrollLockRef.current = window.scrollY;
            body.classList.add('sheet-open');
            body.style.top = `-${scrollLockRef.current}px`;
        } else {
            const top = body.style.top;
            body.classList.remove('sheet-open');
            body.style.top = '';
            const y = top ? Math.abs(parseInt(top, 10)) : scrollLockRef.current;
            window.scrollTo(0, y);
        }
    }, [isMenuOpen]);

    useEffect(() => {
        let frame: number | null = null;
        const updateScrolled = () => {
            const shouldBeScrolled = window.scrollY > 24;
            setScrolled((prev) => (prev === shouldBeScrolled ? prev : shouldBeScrolled));
        };
        const handleScroll = () => {
            if (frame !== null) return;
            frame = window.requestAnimationFrame(() => {
                frame = null;
                updateScrolled();
            });
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (frame !== null) {
                window.cancelAnimationFrame(frame);
            }
        };
    }, []);

    const getLocalizedPath = (langCode: string) => {
        if (!pathname) return `/${langCode}`;
        const segments = pathname.split('/');
        segments[1] = langCode;
        return segments.join('/');
    };
    
    type MenuLink = {
        href: string;
        label: string;
        icon: typeof Home;
        meta: string;
        isBlog?: boolean;
    };

    const navLinks: MenuLink[] = [
        { href: "/", label: t.home, icon: Home, meta: "01 · Overview" },
        { href: "/about", label: t.about, icon: Users, meta: "02 · Team" },
        { href: "/services", label: t.services, icon: Sparkles, meta: "03 · Services" },
        { href: "/pricing", label: t.prices, icon: Wallet, meta: "04 · Pricing" },
        { href: "/contact", label: t.contact, icon: MessageCircle, meta: "05 · Contact" },
    ];
    const blogLink: MenuLink = { href: "/blog", label: "Blog", icon: PenLine, meta: "06 · Journal", isBlog: true };
    const menuLinks: MenuLink[] = [...navLinks, blogLink];

    // Check if link is active
    const isActive = (href: string) => {
        const fullPath = href === "/" ? `/${locale}` : `/${locale}${href}`;
        if (href === "/") {
            return pathname === `/${locale}` || pathname === `/${locale}/`;
        }
        return pathname.startsWith(fullPath);
    };

    const isBlogActive = pathname.startsWith(`/${locale}/blog`);

const navContent = (
    <TooltipProvider>
        {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
                <Link 
                    href={link.href.startsWith('/') ? `/${locale}${link.href}`: link.href} 
                    key={link.label} 
                    className={navLinkClass}
                    prefetch={false}
                >
                    {link.label}
                    {active && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#c084fc] rounded-full" />
                    )}
                </Link>
            );
        })}
        <Link 
            href={`/${locale}${blogLink.href}`} 
            className={blogLinkClass}
            prefetch={false}
        >
            <Feather className="h-4 w-4 text-accent" />
            {blogLink.label}
            {isBlogActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#c084fc] rounded-full" />
            )}
        </Link>
        <div className={cn("h-5 w-px", dividerClass)} />
        <div className="flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="https://www.facebook.com/profile.php?id=61559794323482&locale=ru_RU" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-1 transition-colors group" prefetch={false}>
                        <FacebookIcon className="h-5 w-5 text-blue-400/70 group-hover:text-blue-400 transition-colors" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Facebook</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="https://www.linkedin.com/in/oleksii-zhyvotivskyi-9b9085303/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-1 transition-colors group" prefetch={false}>
                        <LinkedinIcon className="h-5 w-5 text-blue-400/70 group-hover:text-blue-400 transition-colors" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>LinkedIn</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="https://github.com/ZhyvotivskyiOleksii" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-1 transition-colors group" prefetch={false}>
                        <GithubIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>GitHub</p>
                </TooltipContent>
            </Tooltip>
        </div>
        <ThemeSwitcher theme={theme} toggleTheme={handleThemeChange} />
        <LanguageSwitcher />
    </TooltipProvider>
  );
  return (
    <>
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        !scrolled && "bg-transparent"
      )}
    >
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <LiquidGlass
          className="w-full h-full header-glass"
          blurRadius={38}
          highlights={false}
          grain={false}
          rounded="none"
          outlined={false}
          static
        >
          <div className="w-full h-full" />
        </LiquidGlass>
      </div>
      <div className="flex h-[var(--header-height)] items-center justify-between">
        <div className="pl-4 sm:pl-6 lg:pl-8">
            <Link href={`/${locale}`} className="flex items-center" prefetch={false}>
                {/* Logo with Santa hat for holidays */}
                <div className="relative">
                    <Image
                        src="/icons/logo-web.svg"
                        alt="Web Impuls Logo"
                        width={160}
                        height={60}
                        className="h-10 w-auto sm:h-12"
                    />
                    {/* Santa hat overlay - positioned on right side of yellow "WEB" box */}
                    <Image
                        src="/video/santa.png"
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        className="absolute -top-5 left-[32px] sm:left-[40px] w-8 h-8 sm:w-10 sm:h-10 rotate-12 pointer-events-none drop-shadow-lg"
                        style={{ zIndex: 10 }}
                    />
                </div>
            </Link>
        </div>
        <div className="flex items-center">
            <div className="relative hidden lg:flex items-center">
                <div
                    className="relative py-5 pl-8 text-white"
                    style={navShellStyle}
                >
                    <nav className="flex items-center gap-4 pr-4 sm:pr-6 lg:pr-8">
                        {navContent}
                    </nav>
                </div>
            </div>
            <div className="block lg:hidden pr-4 sm:pr-6" suppressHydrationWarning>
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className="group relative flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500/20 via-purple-500/15 to-fuchsia-500/20 backdrop-blur-sm text-white hover:from-violet-500/30 hover:via-purple-500/25 hover:to-fuchsia-500/30 transition-all duration-300 active:scale-95 shadow-lg shadow-purple-500/10"
                    suppressHydrationWarning
                  >
                    {/* Animated burger lines */}
                    <div className="flex flex-col items-center justify-center gap-[5px] w-5">
                      <span className={cn(
                        "block h-[2px] rounded-full bg-white transition-all duration-300",
                        isMenuOpen ? "w-5 rotate-45 translate-y-[7px]" : "w-5 group-hover:w-4"
                      )} />
                      <span className={cn(
                        "block h-[2px] rounded-full bg-white transition-all duration-300",
                        isMenuOpen ? "opacity-0 w-0" : "w-4 group-hover:w-5"
                      )} />
                      <span className={cn(
                        "block h-[2px] rounded-full bg-white transition-all duration-300",
                        isMenuOpen ? "w-5 -rotate-45 -translate-y-[7px]" : "w-3 group-hover:w-4"
                      )} />
                    </div>
                    <span className="sr-only">Open menu</span>
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="neon-menu w-full max-w-xs p-0 flex flex-col overflow-hidden rounded-tl-2xl rounded-bl-2xl"
                  forceMount
                >
                  <div className="neon-menu__bg" aria-hidden />
                  <div className="neon-menu__orb neon-menu__orb--lg" aria-hidden />
                  <div className="neon-menu__orb neon-menu__orb--sm" aria-hidden />
                  <div className="neon-menu__header">
                    <SheetTitle className="text-lg font-semibold text-white">{t.menuTitle || 'Меню'}</SheetTitle>
                    <SheetClose className="neon-menu__close">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 pb-4">
                    <div className="neon-menu__panel">
                      <div className="neon-menu__timeline">
                        {menuLinks.map((link, index) => {
                          const Icon = link.icon;
                          const href = link.href.startsWith('/')
                            ? `/${locale}${link.href}`
                            : link.href;
                          const active = link.isBlog ? isBlogActive : isActive(link.href);
                          return (
                            <Link
                              key={link.label}
                              href={href}
                              prefetch={false}
                              onClick={() => setIsMenuOpen(false)}
                              className="neon-menu-link"
                              data-active={active}
                              style={{ '--order': index } as CSSProperties}
                            >
                              <span className="neon-menu-link__dot" aria-hidden />
                              <span className="neon-menu-link__pulse" aria-hidden />
                              <div className="neon-menu-link__content">
                                <span className="neon-menu-link__icon">
                                  <Icon className="h-5 w-5" />
                                </span>
                                <div className="flex-1">
                                  <p className="neon-menu-link__label">{link.label}</p>
                                  <span className="neon-menu-link__meta">{link.meta}</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 opacity-70" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="neon-menu__footer">
                    <div className="neon-menu__socials">
                      <Link
                        href="https://www.facebook.com/profile.php?id=61559794323482&locale=ru_RU"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="neon-menu__social"
                        prefetch={false}
                      >
                        <FacebookIcon />
                      </Link>
                      <Link
                        href="https://www.linkedin.com/in/oleksii-zhyvotivskyi-9b9085303/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="neon-menu__social"
                        prefetch={false}
                      >
                        <LinkedinIcon />
                      </Link>
                      <Link
                        href="https://github.com/ZhyvotivskyiOleksii"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="neon-menu__social"
                        prefetch={false}
                      >
                        <GithubIcon />
                      </Link>
                    </div>
                    <div className="neon-menu__footer-grid">
                      <div className="neon-menu__languages">
                        {languages.map(({ code, Flag }) => (
                          <Link
                            key={code}
                            href={getLocalizedPath(code)}
                            scroll={false}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                              'neon-menu__flag',
                              locale === code && 'neon-menu__flag--active'
                            )}
                          >
                            <Flag className="h-4 w-6" />
                          </Link>
                        ))}
                      </div>
                      <div className="neon-menu__theme">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleThemeChange('light')}
                          className={cn(
                            'neon-menu__theme-btn',
                            theme === 'light' && 'neon-menu__theme-btn--active'
                          )}
                        >
                          <Sun className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleThemeChange('dark')}
                          className={cn(
                            'neon-menu__theme-btn',
                            theme === 'dark' && 'neon-menu__theme-btn--active'
                          )}
                        >
                          <Moon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
        </div>
      </div>
    </header>

    </>
  );
}
