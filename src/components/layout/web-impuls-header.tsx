/**
 * =====================================================
 * WEB IMPULS - HEADER (Next.js version)
 * =====================================================
 * 
 * Цей файл призначений для копіювання у ваш Next.js проект.
 * Містить повний функціонал з інтегрованим LiquidGlass ефектом.
 * 
 * ВАЖЛИВО: Перед використанням переконайтесь що у вас є:
 * - @/components/ui/liquid-glass (скопіюйте liquid-glass.nextjs.tsx)
 * - @/lib/translations
 * - @/hooks/use-theme
 * - ../shared/language-switcher
 * - ../shared/theme-switcher
 * - framer-motion
 * 
 * =====================================================
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Feather,
  Sun,
  Moon,
  Home,
  Users,
  Sparkles,
  Wallet,
  MessageCircle,
  PenLine,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
// Sheet removed - using custom fullscreen menu
import { LanguageSwitcher } from '../shared/language-switcher';
import { ThemeSwitcher } from '../shared/theme-switcher';
import { useTheme, type Theme } from '@/hooks/use-theme';
import { translations } from '@/lib/translations';
import { useParams, usePathname } from 'next/navigation';
import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
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
    const { theme, resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';
    // Навігаційна оболонка завжди залишається темною (без змін)
    const navShellStyle: CSSProperties = {
        borderRadius: '9999px 0 0 9999px',
        background: 'linear-gradient(135deg, rgba(12,11,18,0.96), rgba(52,34,80,0.92))',
        border: 'none',
        borderLeft: '6px solid #8b5cf6',
        boxShadow: '0 22px 40px rgba(5,6,11,0.6)',
    };
    // Навігаційні посилання завжди білі (навігаційна оболонка завжди темна)
    const navLinkClass = cn(
        "relative animated-underline text-sm font-medium transition-colors",
        "text-white"
    );
    const blogLinkClass = cn(
        "relative animated-underline flex items-center gap-1.5 text-sm font-medium transition-colors",
        "text-white"
    );
    const dividerClass = isDarkMode ? 'bg-white/10' : 'bg-slate-300/50';
    const mobileMenuIconLineClass = isDarkMode
        ? "bg-gradient-to-r from-white/95 via-white/90 to-white/70"
        : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700";
    
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
        <ThemeSwitcher />
        <LanguageSwitcher />
    </TooltipProvider>
  );
  return (
    <>
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-transparent"
      )}
    >
      <div className="absolute inset-0 -z-10 pointer-events-none">
	        <LiquidGlass
	          className="w-full h-full header-glass"
	          rounded="none"
	          outlined={false}
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
	                    className={cn(
	                        "relative py-5 pl-8 transition-colors",
	                        "text-white"
	                    )}
	                    style={navShellStyle}
	                >
                    <nav className="flex items-center gap-4 pr-4 sm:pr-6 lg:pr-8">
                        {navContent}
                    </nav>
                </div>
	            </div>
	            {/* Mobile burger button - no background */}
	            <div className="block lg:hidden pr-4 sm:pr-6 z-[60]" suppressHydrationWarning>
	              <button
	                type="button"
	                onClick={() => setIsMenuOpen((v) => !v)}
	                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
	                className={cn(
	                  "relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 active:scale-95",
	                  isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-900/5",
	                  isMenuOpen && (isDarkMode ? "bg-white/10" : "bg-slate-900/5")
	                )}
	                suppressHydrationWarning
	              >
	                <div className="relative w-[22px] h-[18px]" aria-hidden="true">
	                  <span
	                    className={cn(
	                      "absolute left-0 top-0 h-[2px] rounded-full transition-all duration-300 origin-center",
	                      mobileMenuIconLineClass,
	                      isMenuOpen ? "top-[8px] w-[22px] rotate-45" : "w-[12px]"
	                    )}
	                  />
	                  <span
	                    className={cn(
	                      "absolute left-0 top-[8px] h-[2px] rounded-full transition-all duration-200 origin-center",
	                      mobileMenuIconLineClass,
	                      isMenuOpen ? "opacity-0 scale-x-0" : "w-[22px]"
	                    )}
	                  />
	                  <span
	                    className={cn(
	                      "absolute right-0 top-[16px] h-[2px] rounded-full transition-all duration-300 origin-center",
	                      mobileMenuIconLineClass,
	                      isMenuOpen ? "right-auto left-0 top-[8px] w-[22px] -rotate-45" : "w-[14px]"
	                    )}
	                  />
	                </div>
	              </button>
	            </div>
	        </div>
	      </div>
	    </header>

	    {/* Mobile Menu (Premium Drawer) */}
	    <AnimatePresence>
	      {isMenuOpen && (
	        <motion.div
	          key="mobile-menu"
	          initial={{ opacity: 0 }}
	          animate={{ opacity: 1 }}
	          exit={{ opacity: 0 }}
	          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
	          className="fixed inset-0 z-[55] lg:hidden"
	          role="dialog"
	          aria-modal="true"
	        >
	          <div
	            className={cn(
	              "absolute inset-0",
	              isDarkMode ? "bg-[#05040a]/70 backdrop-blur-md" : "bg-black/20 backdrop-blur-sm"
	            )}
	            onClick={() => setIsMenuOpen(false)}
	          />

	          <motion.aside
	            initial={{ x: 40, opacity: 0 }}
	            animate={{ x: 0, opacity: 1 }}
	            exit={{ x: 40, opacity: 0 }}
	            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
	            data-theme={theme}
	            className={cn(
	              "absolute right-0 top-0 h-full w-[min(420px,92vw)] overflow-hidden border-l",
	              isDarkMode
	                ? "border-white/10 bg-gradient-to-b from-[#0d0a16]/96 via-[#090712]/92 to-[#05040a]/94 shadow-[0_28px_120px_rgba(0,0,0,0.70)]"
	                : "border-slate-300 bg-white shadow-[0_28px_120px_rgba(0,0,0,0.15)] backdrop-blur-xl text-slate-800"
	            )}
	            style={{
	              paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
	              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)',
	            }}
	            onClick={(e) => e.stopPropagation()}
	          >
	            {/* Accent edge */}
	            <div
	              className="pointer-events-none absolute left-0 top-0 h-full w-px opacity-90"
	              style={{
	                background: isDarkMode
	                  ? 'linear-gradient(180deg, rgba(124,58,237,0.0) 0%, rgba(168,85,247,0.55) 30%, rgba(192,132,252,0.25) 70%, rgba(124,58,237,0.0) 100%)'
	                  : 'linear-gradient(180deg, rgba(37,99,235,0.0) 0%, rgba(37,99,235,0.35) 30%, rgba(6,182,212,0.25) 70%, rgba(37,99,235,0.0) 100%)',
	              }}
	            />

	            <div className="relative flex h-full flex-col px-5">
	              <div className="flex items-center justify-between">
	                <Link
	                  href={`/${locale}`}
	                  prefetch={false}
	                  onClick={() => setIsMenuOpen(false)}
	                  className="flex items-center"
	                  aria-label="Home"
	                >
	                  <Image
	                    src="/icons/logo-web.svg"
	                    alt="Web Impuls"
	                    width={150}
	                    height={50}
	                    className={cn(
	                      "h-8 w-auto",
	                      isDarkMode ? "opacity-95" : "opacity-100 brightness-0"
	                    )}
	                  />
	                </Link>

	                <button
	                  type="button"
	                  onClick={() => setIsMenuOpen(false)}
	                  aria-label="Close menu"
	                  className={cn(
	                    "relative flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors active:scale-95",
	                    isDarkMode 
	                      ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]" 
	                      : "border-slate-300 bg-slate-100 hover:bg-slate-200"
	                  )}
	                >
	                  <span className="relative h-5 w-5" aria-hidden="true">
	                    <span
	                      className={cn(
	                        "absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full",
	                        isDarkMode ? mobileMenuIconLineClass : "bg-slate-700",
	                        "rotate-45"
	                      )}
	                    />
	                    <span
	                      className={cn(
	                        "absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full",
	                        isDarkMode ? mobileMenuIconLineClass : "bg-slate-700",
	                        "-rotate-45"
	                      )}
	                    />
	                  </span>
	                </button>
	              </div>

	              <div className="mt-6 flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 scrollbar-hide">
	                {/* Navigation */}
	                <motion.div
	                  initial="closed"
	                  animate="open"
	                  exit="closed"
	                  variants={{
	                    open: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
	                    closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
	                  }}
	                  className={cn("divide-y", isDarkMode ? "divide-white/10" : "divide-slate-200/70")}
	                >
	                  {menuLinks.map((link) => {
	                    const Icon = link.icon;
	                    const href = link.href.startsWith('/') ? `/${locale}${link.href}` : link.href;
	                    const active = link.isBlog ? isBlogActive : isActive(link.href);
	                    const metaNumber = (link.meta || '').split('·')[0]?.trim();

	                    return (
	                      <motion.div
	                        key={link.label}
	                        variants={{
	                          open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 520, damping: 40 } },
	                          closed: { opacity: 0, x: 18, transition: { duration: 0.12 } },
	                        }}
	                      >
	                        <Link
	                          href={href}
	                          prefetch={false}
	                          onClick={() => setIsMenuOpen(false)}
	                          className={cn(
	                            "group flex items-center gap-3 py-3.5 px-1 transition-colors outline-none",
	                            "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
	                            isDarkMode ? "hover:text-white" : "hover:text-slate-950",
	                            active 
	                              ? "text-primary" 
	                              : isDarkMode 
	                                ? "text-white/90" 
                                : "text-slate-800 font-medium"
	                          )}
	                        >
	                          <Icon className={cn(
	                            "h-5 w-5", 
	                            active 
	                              ? "text-primary" 
	                              : isDarkMode 
	                                ? "text-white/55" 
	                                : "text-slate-700"
	                          )} />

	                          <div className="min-w-0 flex-1">
	                            <p className="truncate text-[17px] font-semibold tracking-[-0.01em]">{link.label}</p>
	                          </div>

	                          {metaNumber && (
	                            <span className={cn(
	                              "shrink-0 text-xs tabular-nums", 
	                              active 
	                                ? "text-primary/80" 
	                                : isDarkMode 
	                                  ? "text-white/30" 
	                                  : "text-slate-500"
	                            )}>
	                              {metaNumber}
	                            </span>
	                          )}

	                          <ChevronRight className={cn(
	                            "h-4 w-4", 
	                            active 
	                              ? "text-primary/80" 
	                              : isDarkMode 
	                                ? "text-white/25" 
	                                : "text-slate-500"
	                          )} />
	                        </Link>
	                      </motion.div>
	                    );
	                  })}
	                </motion.div>

	                {/* Controls */}
	                <div className={cn("mt-6 flex items-center justify-between border-t pt-4", isDarkMode ? "border-white/10" : "border-slate-200/70")}>
	                  <div className="flex gap-2">
	                    {languages.map(({ code, Flag }) => (
	                      <Link
	                        key={code}
	                        href={getLocalizedPath(code)}
	                        scroll={false}
	                        onClick={() => setIsMenuOpen(false)}
	                        aria-label={`Language ${code}`}
	                        className={cn(
	                          "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
	                          locale === code
	                            ? "border-primary bg-primary/20"
	                            : isDarkMode
	                              ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
	                              : "border-slate-300 bg-white hover:bg-slate-50 shadow-sm"
	                        )}
	                      >
	                        <Flag className="h-3.5 w-5" />
	                      </Link>
	                    ))}
	                  </div>

                  <ThemeSwitcher />
	                </div>
	              </div>
	            </div>
	          </motion.aside>
	        </motion.div>
	      )}
	    </AnimatePresence>

	    </>
	  );
	}
