'use client';

import Link from 'next/link';
import Image from 'next/image';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

const socialLinks = [
  {
    name: 'Telegram',
    href: 'https://t.me/WebImpuls',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/Web-impuls/61559794323482/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/webimpuls',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/webimpuls',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
];

export function Footer() {
  const params = useParams();
  const locale = (Array.isArray(params.locale) ? params.locale[0] : params.locale) || 'ua';
  const t = (translations as any)[locale] || translations.ua;

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: `/${locale}`, label: t.home },
    { href: `/${locale}/about`, label: t.about },
    { href: `/${locale}/services`, label: t.services },
    { href: `/${locale}/pricing`, label: t.prices },
    { href: `/${locale}/blog`, label: 'Blog' },
  ];

  const serviceLinks = [
    { href: `/${locale}/services/landing`, label: t.serviceLandingTitle || 'Landing Page' },
    { href: `/${locale}/services/corporate`, label: t.serviceCorporateTitle || 'Corporate Website' },
    { href: `/${locale}/services/ecommerce`, label: t.serviceECommerceTitle || 'E-commerce' },
    { href: `/${locale}/services/webapp`, label: t.serviceWebAppTitle || 'Web Application' },
    { href: `/${locale}/services/redesign`, label: t.serviceRedesignTitle || 'Redesign' },
    { href: `/${locale}/services/support`, label: t.serviceSupportTitle || 'Support' },
  ];

  return (
    <footer className="relative bg-[#0f1018] text-white pt-16 pb-8 rounded-t-[2.5rem] md:rounded-t-[3rem]">
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />

      <div className="container space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 text-center lg:text-left space-y-6">
            <Link href={`/${locale}`} className="inline-flex items-center mb-6 group">
              {/* Logo with Santa hat for holidays */}
              <div className="relative">
                <Image
                  src="/icons/logo-web.svg"
                  alt="Web Impuls Logo"
                  width={200}
                  height={74}
                  className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                {/* Santa hat overlay - positioned on right side of yellow "WEB" box */}
                <Image
                  src="/video/santa.png"
                  alt=""
                  width={48}
                  height={48}
                  loading="lazy"
                  className="absolute -top-6 left-[45px] w-12 h-12 rotate-12 pointer-events-none drop-shadow-lg"
                  style={{ zIndex: 10 }}
                />
              </div>
            </Link>

            <p className="text-white/70 max-w-sm mx-auto lg:mx-0">
              {t.footerDescription || 'Створюємо сучасні веб-рішення, які допомагають вашому бізнесу рости та досягати нових висот.'}
            </p>

            <div className="flex gap-3 justify-center lg:justify-start">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 transition-all duration-300 hover:bg-primary/30 hover:text-white"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Navigation */}
            <div className="text-center lg:text-left">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-3">
                {t.footerNavTitle || 'Навігація'}
              </h3>
              <ul className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="text-center lg:text-left">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-3">
                {t.services || 'Послуги'}
              </h3>
              <ul className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2">
                {serviceLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 text-center lg:text-left space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
              {t.footerContactTitle || 'Контакти'}
            </h3>
            <ul className="space-y-4 inline-block text-left">
              <li>
                <Link
                  href="https://g.co/kgs/8emyUUz"
                  target="_blank"
                  className="flex items-center gap-4 text-white/70 hover:text-white transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Warszawa, Poland</p>
                    <p className="text-xs text-white/60">Edwarda Habicha 18</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:contact@web-impuls.com"
                  className="flex items-center gap-4 text-white/70 hover:text-white transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">contact@web-impuls.com</p>
                    <p className="text-xs text-white/60">{t.contactEmailSubtitle || 'Відповідаємо протягом 24 годин'}</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="tel:+48572245574"
                  className="flex items-center gap-4 text-white/70 hover:text-white transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">+48 572 245 574</p>
                    <p className="text-xs text-white/60">{t.contactPhoneSubtitle || 'Пн-Пт: 9:00 - 18:00'}</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center lg:text-left space-y-3">
          <p className="text-xs uppercase tracking-wider text-white/60">
            {t.footerPaymentMethods || 'Приймаємо оплату'}
          </p>
          <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
            <div className="h-8 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10">
              <svg className="h-4" viewBox="0 0 48 16" fill="none">
                <path d="M17.545 0.479L11.409 15.542H7.396L4.396 3.479C4.217 2.763 4.063 2.501 3.496 2.187C2.567 1.688 1.083 1.217 0 0.918L0.095 0.479H6.471C7.296 0.479 8.032 1.034 8.209 1.982L9.796 10.449L13.706 0.479H17.545ZM33.983 10.689C33.998 6.638 28.411 6.414 28.448 4.595C28.459 4.018 29.016 3.404 30.233 3.246C30.837 3.167 32.422 3.105 34.21 3.932L34.911 0.848C33.953 0.497 32.724 0.16 31.188 0.16C27.581 0.16 25.023 2.072 25.003 4.818C24.983 6.867 26.829 8.011 28.209 8.692C29.628 9.388 30.104 9.836 30.099 10.462C30.09 11.418 28.943 11.841 27.87 11.856C25.878 11.887 24.721 11.318 23.796 10.894L23.073 14.081C24.003 14.501 25.746 14.867 27.552 14.883C31.385 14.883 33.969 13.011 33.983 10.689ZM43.927 15.542H47.333L44.333 0.479H41.044C40.318 0.479 39.703 0.918 39.436 1.594L33.909 15.542H37.74L38.505 13.382H43.174L43.927 15.542ZM39.57 10.585L41.545 5.077L42.68 10.585H39.57ZM23.576 0.479L20.576 15.542H16.909L19.909 0.479H23.576Z" fill="#6B8EFF"/>
              </svg>
            </div>
            <div className="h-8 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10">
              <svg className="h-5" viewBox="0 0 42 26" fill="none">
                <circle cx="14" cy="13" r="12" fill="#EB001B"/>
                <circle cx="28" cy="13" r="12" fill="#F79E1B"/>
                <path d="M21 3.5C23.9 5.6 25.8 9.1 25.8 13C25.8 16.9 23.9 20.4 21 22.5C18.1 20.4 16.2 16.9 16.2 13C16.2 9.1 18.1 5.6 21 3.5Z" fill="#FF5F00"/>
              </svg>
            </div>
            <div className="h-8 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-1 transition-all duration-300 hover:bg-white/10">
              <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
              <span className="text-xs font-medium text-white">Pay</span>
            </div>
            <div className="h-8 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-1 transition-all duration-300 hover:bg-white/10">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-xs font-medium text-white">GPay</span>
            </div>
            <div className="h-8 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-1.5 transition-all duration-300 hover:bg-white/10">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#F7931A"/>
                <path d="M16.4 10.1C16.6 8.4 15.3 7.5 13.5 6.9L14.1 4.7L12.8 4.4L12.2 6.5C11.9 6.4 11.5 6.3 11.2 6.3L11.8 4.1L10.5 3.8L9.9 6C9.6 5.9 9.3 5.9 9.1 5.8L6.9 5.3L6.5 6.7C6.5 6.7 7.5 6.9 7.5 6.9C8.1 7 8.2 7.4 8.2 7.7L7.5 10.4C7.5 10.4 7.6 10.4 7.6 10.5C7.5 10.5 7.5 10.4 7.4 10.4L6.4 14.3C6.4 14.5 6.2 14.8 5.8 14.7C5.8 14.7 4.9 14.5 4.9 14.5L4.4 16L6.4 16.5C6.7 16.6 7 16.6 7.3 16.7L6.7 19L8 19.3L8.6 17.1C8.9 17.2 9.2 17.3 9.6 17.3L9 19.5L10.3 19.8L10.9 17.5C13.2 17.9 14.9 17.7 15.7 15.7C16.3 14.1 15.7 13.1 14.5 12.5C15.4 12.3 16.2 11.4 16.4 10.1ZM13.1 14.8C12.6 16.4 10 15.6 9.1 15.4L9.9 12.5C10.8 12.7 13.6 13.1 13.1 14.8ZM13.6 10C13.1 11.5 10.9 10.8 10.2 10.6L10.9 8C11.6 8.2 14.1 8.5 13.6 10Z" fill="white"/>
              </svg>
              <span className="text-xs font-medium text-white">Crypto</span>
            </div>
            <div className="h-8 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-1.5 transition-all duration-300 hover:bg-white/10">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#26A17B"/>
                <path d="M13.5 10.4V8.6H17.2V6H6.8V8.6H10.5V10.4C7.5 10.6 5.3 11.3 5.3 12.2C5.3 13.1 7.5 13.8 10.5 14V19H13.5V14C16.5 13.8 18.7 13.1 18.7 12.2C18.7 11.3 16.5 10.6 13.5 10.4ZM13.5 13.4V13.4C13.4 13.4 13.4 13.4 13.5 13.4C13.4 13.4 11.4 13.6 10.5 13.6C9.6 13.6 7.6 13.4 7.6 13.2C7.6 13 9.4 12.8 10.5 12.8C11.6 12.8 13.4 13 13.5 13.2C13.6 13.3 16.4 13 16.4 12.6C16.4 12.2 13.6 12 13.5 12C13.5 12 13.5 12 13.5 12V10.9C15.9 11.1 17.5 11.5 17.5 12.1C17.5 12.8 15.5 13.3 13.5 13.4ZM13.5 13.4C13.5 13.4 13.5 13.4 13.5 13.4V13.4Z" fill="white"/>
              </svg>
              <span className="text-xs font-medium text-white">USDT</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
            <p className="text-sm text-white/60">
              © {currentYear} <span className="text-white font-medium">Web Impuls</span>. {t.footerRights || 'Всі права захищені.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-center lg:text-right">
              <Link href={`/${locale}/privacy`} className="text-white/60 hover:text-white transition-colors duration-300">
                {t.footerPrivacy || 'Privacy Policy'}
              </Link>
              <Link href={`/${locale}/terms`} className="text-white/60 hover:text-white transition-colors duration-300">
                {t.footerTerms || 'Terms'}
              </Link>
              <span className="text-white/40">NIP: 5223251351</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
