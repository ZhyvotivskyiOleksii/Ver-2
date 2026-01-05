'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCALE_SCROLL_STORAGE_KEY } from './scroll-restorer';

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
  { code: 'ua', label: 'Українська', short: 'UA', Flag: UkraineFlagIcon },
  { code: 'pl', label: 'Polski', short: 'PL', Flag: PolandFlagIcon },
  { code: 'en', label: 'English', short: 'EN', Flag: UKFlagIcon },
  { code: 'de', label: 'Deutsch', short: 'DE', Flag: GermanFlagIcon },
];

export function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const currentLocale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const currentLanguage = languages.find(l => l.code === currentLocale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const getLocalizedPath = (langCode: string) => {
    if (!pathname) return `/${langCode}`;
    const segments = pathname.split('/');
    segments[1] = langCode;
    return segments.join('/');
  };
  
  if (!currentLanguage) {
    return null;
  }

  const { Flag, short } = currentLanguage;

  const handleLanguageChange = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(LOCALE_SCROLL_STORAGE_KEY, String(window.scrollY));
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        className="flex items-center gap-2 text-sm font-medium text-white px-3 py-2 hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Flag className="h-4 w-6 rounded-sm shadow-sm"/>
        <span>{short}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 overflow-hidden z-50"
          >
            <div 
              className="rounded-xl shadow-2xl border border-white/10 overflow-hidden"
              style={{ background: 'rgb(38, 40, 54)' }}
            >
              {languages.map(({ code, label, short, Flag }, index) => {
                const isActive = code === currentLocale;
                return (
                  <Link
                    key={code}
                    href={getLocalizedPath(code)}
                    scroll={false}
                    onClick={handleLanguageChange}
                    className={`
                      flex items-center gap-3 px-4 py-3 min-w-[180px] transition-all duration-200
                      ${isActive 
                        ? 'bg-primary/20 text-white' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }
                      ${index !== languages.length - 1 ? 'border-b border-white/5' : ''}
                    `}
                  >
                    <Flag className="h-5 w-7 rounded shadow-sm flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{label}</span>
                      <span className="text-xs text-gray-500">{short}</span>
                    </div>
                    {isActive && (
                      <Check className="h-4 w-4 text-primary ml-auto" />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
