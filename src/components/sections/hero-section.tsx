/**
 * =====================================================
 * WEB IMPULS - HERO SECTION (Next.js version)
 * =====================================================
 * 
 * Цей файл призначений для копіювання у ваш Next.js проект.
 * Містить повний функціонал з інтегрованим LiquidGlass ефектом.
 * 
 * ВАЖЛИВО: Перед використанням переконайтесь що у вас є:
 * - @/components/ui/liquid-glass (скопіюйте liquid-glass.nextjs.tsx)
 * - @/lib/translations
 * - @/hooks/use-theme
 * - ../order-modal
 * - framer-motion
 * 
 * =====================================================
 */

"use client";

import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Zap, Shield, Clock, ArrowRight, Rocket, Code2, ShoppingCart, Star, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { OrderModal } from '../order-modal';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export function HeroSection() {
  const params = useParams();
  const locale = Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale;
  const t = (translations as any)[locale] || translations.ua;
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  const shouldAnimate = !prefersReducedMotion && !isMobile;

  const statsDecor = [
    { text: 'from-[#f8b262] to-[#f97316]' },
    { text: 'from-[#f472b6] to-[#c084fc]' },
    { text: 'from-[#7dd3fc] to-[#60a5fa]' },
    { text: 'from-[#a0f0d0] to-[#34d399]' },
  ];

  const treeImageStyles = isDarkMode
    ? 'opacity-100 brightness-110 drop-shadow-[0_38px_70px_rgba(58,34,138,0.6)] mix-blend-screen'
    : 'opacity-100 brightness-105 drop-shadow-[0_28px_45px_rgba(67,56,202,0.28)]';

  const openOrderModal = (serviceId: string = '') => {
    setSelectedService(serviceId);
    setIsOrderModalOpen(true);
  };

  const services = [
    {
      id: 'landing',
      icon: Rocket,
      title: t.serviceLandingTitle || 'Landing Page',
      price: '$600+',
      color: 'from-[#f8b262] via-[#f97316] to-[#fb923c]',
    },
    {
      id: 'corporate',
      icon: Code2,
      title: t.serviceCorporateTitle || 'Корпоративний сайт',
      price: '$2300+',
      color: 'from-[#7c3aed] to-[#a855f7]',
    },
    {
      id: 'ecommerce',
      icon: ShoppingCart,
      title: t.serviceECommerceTitle || 'Інтернет-магазин',
      price: '$3800+',
      color: 'from-[#a855f7] to-[#ec4899]',
    },
  ];

  const stats = [
    { value: '150+', label: t.heroProjects || 'Проєктів' },
    { value: '50+', label: t.heroClients || 'Клієнтів' },
    { value: '5+', label: t.heroYears || 'Років досвіду' },
    { value: '24/7', label: t.heroSupport || 'Підтримка' },
  ];

  const features = [
    { icon: Zap, text: t.heroFeature1 || 'Швидка розробка' },
    { icon: Shield, text: t.heroFeature2 || 'Безпечний код' },
    { icon: Clock, text: t.heroFeature3 || 'Точні дедлайни' },
  ];

  return (
    <>
      <HeroGlassFilterDefs />
      <section className={cn(
        "relative w-full min-h-screen overflow-hidden pt-[var(--header-height)]",
        "bg-transparent" // Фон body буде видно через прозору секцію
      )}>
        {/* Розмиті кольорові круги для світлої теми (як в Tree Removal) */}
        {!isDarkMode && (
          <>
            <div 
              className="absolute rounded-full filter blur-[120px] opacity-40 z-0"
              style={{
                width: '500px',
                height: '500px',
                top: '-10%',
                right: '-10%',
                background: 'rgba(37, 99, 235, 0.25)',
              }}
              aria-hidden="true"
            />
            <div 
              className="absolute rounded-full filter blur-[120px] opacity-40 z-0"
              style={{
                width: '420px',
                height: '420px',
                bottom: '-10%',
                left: '-5%',
                background: 'rgba(6, 182, 212, 0.2)',
              }}
              aria-hidden="true"
            />
          </>
        )}
        {/* Ялинка на фоні */}
        {isDarkMode && (
          <div
            className="hidden md:flex fixed pointer-events-none z-[2] items-end justify-end"
            style={{
              top: 'var(--header-height)',
              right: 'calc(-1 * (100vw - 100%))',
              bottom: 0,
              left: 'min(60vw, 520px)',
              paddingRight: 'env(safe-area-inset-right, 0px)',
            }}
          >
            <Image
              src="/video/back-new.webp"
              alt="Holiday tree"
              width={900}
              height={900}
              priority
              sizes="(max-width: 1024px) 45vw, 720px"
              quality={80}
              className={cn(
                'h-full w-auto max-w-[660px] object-contain object-right opacity-90 drop-shadow-[0_40px_80px_rgba(58,34,138,0.55)]',
                treeImageStyles
              )}
            />
          </div>
        )}

        {/* Контейнер контенту */}
        <div className="container relative z-10 flex flex-col min-h-[calc(100vh-var(--header-height))] py-4 md:py-12">
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-10 xl:gap-14">
            {/* Текстова частина */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full order-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-5">
                <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--highlight))]" />
                <span className="text-[0.65rem] sm:text-xs font-semibold tracking-[0.15em] text-[hsl(var(--highlight))]">
                  Web Development Studio
                </span>
              </div>

              <h1 className="font-display font-black tracking-tight mb-4 md:mb-6">
                <span className={cn(
                  'block text-[3.5rem] sm:text-5xl md:text-7xl lg:text-7xl xl:text-[8rem] leading-[0.92] text-foreground',
                  isDarkMode ? 'drop-shadow-lg' : ''
                )}>
                  STUDIO
                </span>
                <span className="flex flex-wrap items-baseline gap-x-2 sm:gap-x-3 md:gap-x-4 text-[3rem] sm:text-4xl md:text-6xl lg:text-6xl xl:text-[6.8rem] leading-[0.95]">
                <span className={cn(
                  'bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#c084fc] bg-clip-text text-transparent',
                  isDarkMode ? 'drop-shadow-lg' : ''
                )}>
                  WEB
                </span>
                <span className={cn('text-foreground', isDarkMode ? 'drop-shadow-lg' : '')}>IMPULS</span>
                </span>
              </h1>

              <p className={cn(
                'text-base md:text-lg mt-2 mb-8 max-w-xl',
                isDarkMode 
                  ? 'text-white/90 drop-shadow-md [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]' 
                  : 'text-slate-700'
              )}>
                {t.heroDescription1 || 'Розробляємо швидкі, сучасні веб-сайти на React/Next.js, які конвертують відвідувачів у клієнтів'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                {features.map((feature, i) => (
                  <div key={i} className={cn(
                    'flex items-center gap-2 text-sm',
                    isDarkMode ? 'text-white/80' : 'text-slate-600'
                  )}>
                    <feature.icon className="w-4 h-4 text-[hsl(var(--highlight))]" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 w-full max-w-xl flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4">
                <Button size="lg" onClick={() => openOrderModal()} className="hero-cta-primary">
                  <span className="flex items-center gap-2">
                    {t.heroButton || 'Замовити сайт'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
                <Button asChild size="lg" variant="ghost" className="hero-cta-secondary">
                  <Link href={`/${locale}/services`}>{t.heroViewServices || 'Наші послуги'}</Link>
                </Button>
              </div>

              <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),rgba(248,147,70,0.15))] border border-white/10" />
                    ))}
                  </div>
                  <span className="ml-2">50+ {t.heroClients || 'клієнтів'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>4.9/5</span>
                </div>
              </div>
            </div>

            {/* Картки послуг */}
            <div className="hero-services-col flex-1 w-full mx-auto lg:mx-0 order-2">
              <div className="relative flex flex-col gap-4 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  {services.map((service, i) => (
                    <motion.div
                      key={service.id}
                      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.12 + i * 0.05 }}
                      onClick={() => openOrderModal(service.id)}
                    >
                      <LiquidGlass rounded="xl" className="group cursor-pointer">
                        <div className="flex items-center gap-4 p-4">
                          <div className={`w-11 h-11 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <service.icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors truncate">
                              {service.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {t.heroFrom || 'від'} <span className="font-bold text-foreground">{service.price}</span>
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                      </LiquidGlass>
                    </motion.div>
                  ))}
                </div>

                {/* Плаваючі бейджі */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden md:flex absolute -top-4 -right-4 w-16 h-16 items-center justify-center bg-gradient-to-br from-[#7c3aed] to-[#c084fc] shadow-lg shadow-purple-500/30 rounded-2xl"
                >
                  <span className="text-white font-bold text-xl">{'</>'}</span>
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="hidden md:block absolute -bottom-2 -left-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#fb923c] shadow-lg shadow-[#f59e0b]/35"
                >
                  <span className="text-white text-sm font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.heroGuarantee || 'Гарантія якості'}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="mt-auto pt-8 md:pt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, i) => {
                const decor = statsDecor[i % statsDecor.length];
                return (
                  <motion.div
                    key={i}
                    initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.22 + i * 0.05 }}
                  >
                    <LiquidGlass rounded="xl" className="text-center">
                      <div className="py-4 px-2">
                        <div className={cn('text-2xl md:text-3xl font-black bg-clip-text text-transparent', `bg-gradient-to-r ${decor.text}`)}>
                          {stat.value}
                        </div>
                        <div className="text-xs md:text-sm text-foreground/70 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    </LiquidGlass>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        defaultService={selectedService}
      />
    </>
  );
}

function HeroGlassFilterDefs() {
  return (
    <svg className="absolute h-0 w-0 opacity-0 pointer-events-none" aria-hidden focusable="false">
      <filter id="hero-glass-dist" x="-40%" y="-40%" width="180%" height="180%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="5" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="0.8" result="blurred-noise" />
        <feDisplacementMap in="SourceGraphic" in2="blurred-noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
