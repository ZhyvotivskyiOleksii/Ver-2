'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTheme } from '@/hooks/use-theme';
import {
  Monitor,
  Building2,
  ShoppingCart,
  Smartphone,
  Palette,
  Headphones,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const services = [
  {
    icon: Monitor,
    titleKey: 'serviceLandingTitle',
    descKey: 'serviceLandingSubtitle',
    priceKey: 'serviceLandingPrice',
    color: 'from-[#f8b262] via-[#f97316] to-[#fb923c]',
    bgColor: 'bg-[#f97316]/15',
  },
  {
    icon: Building2,
    titleKey: 'serviceCorporateTitle',
    descKey: 'serviceCorporateSubtitle',
    priceKey: 'serviceCorporatePrice',
    color: 'from-[#0ea5e9] to-[#2563eb]',
    bgColor: 'bg-[#0ea5e9]/10',
  },
  {
    icon: ShoppingCart,
    titleKey: 'serviceECommerceTitle',
    descKey: 'serviceECommerceSubtitle',
    priceKey: 'serviceECommercePrice',
    color: 'from-[#14b8a6] to-[#0f766e]',
    bgColor: 'bg-[#14b8a6]/10',
  },
  {
    icon: Smartphone,
    titleKey: 'serviceWebAppTitle',
    descKey: 'serviceWebAppSubtitle',
    priceKey: 'serviceWebAppPrice',
    color: 'from-[#f43f5e] to-[#db2777]',
    bgColor: 'bg-[#f43f5e]/10',
  },
  {
    icon: Palette,
    titleKey: 'serviceRedesignTitle',
    descKey: 'serviceRedesignSubtitle',
    priceKey: 'serviceRedesignPrice',
    color: 'from-[#a855f7] to-[#ec4899]',
    bgColor: 'bg-[#a855f7]/15',
  },
  {
    icon: Headphones,
    titleKey: 'serviceSupportTitle',
    descKey: 'serviceSupportSubtitle',
    priceKey: 'serviceSupportPrice',
    color: 'from-[#6366f1] to-[#4338ca]',
    bgColor: 'bg-[#6366f1]/15',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function ServicesSection() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const sectionGradient = isDarkMode
    ? 'from-slate-950 via-slate-900/40 to-slate-950'
    : 'from-white via-primary/5 to-white';
  const surfaceBase = isDarkMode
    ? 'bg-card/90 border-border/60 shadow-[0_25px_45px_rgba(2,6,23,0.55)]'
    : 'bg-white border-slate-200 shadow-[0_30px_55px_rgba(15,23,42,0.08)]';
  const hoverRing = isDarkMode ? 'ring-primary/30' : 'ring-primary/20';
  const subtleText = isDarkMode ? 'text-muted-foreground' : 'text-slate-600';

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative section-spacing overflow-hidden">
      {/* Background */}
      <div className={cn('absolute inset-0 -z-10 bg-gradient-to-b', sectionGradient)} />
      <div className="absolute inset-0 -z-[5] bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.08),_transparent_55%)]" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-0.5 w-10 bg-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                {t.servicesSectionTitle}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              STUDIO WEB <span className="text-primary">IMPULS</span>
            </h2>
            <p className={cn('mt-4 text-lg', subtleText)}>
              {t.servicesSectionDescription}
            </p>
          </div>
          <Link href={`/${locale}/pricing`}>
            <Button variant="outline" size="lg" className="group">
              {t.viewAllServicesButton}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Desktop Grid */}
        <motion.div
          className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative"
              >
                <div
                  className={cn(
                    'relative h-full p-6 rounded-3xl border transition-all duration-500',
                    surfaceBase,
                    isHovered ? `-translate-y-2 ring-1 ${hoverRing}` : 'translate-y-0'
                  )}
                >
                  {/* Gradient Overlay on Hover */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500',
                      `bg-gradient-to-br ${service.color}`,
                      isHovered && 'opacity-[0.07]'
                    )}
                  />

                  {/* Icon */}
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300',
                      service.bgColor,
                      isHovered && 'scale-110'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-7 h-7 transition-colors',
                        isHovered ? 'text-primary' : subtleText
                      )}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {t[service.titleKey]}
                  </h3>
                  <p className={cn('mb-4', subtleText)}>{t[service.descKey]}</p>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/60">
                    <span
                      className={cn(
                        'text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent',
                        service.color
                      )}
                    >
                      {t[service.priceKey]}
                    </span>
                    <ArrowRight
                      className={cn(
                        'w-5 h-5 transition-all',
                        isHovered ? 'text-primary translate-x-1' : subtleText
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className={cn('p-6 rounded-3xl border transition-all duration-300', surfaceBase)}
              >
                {(() => {
                  const service = services[activeIndex];
                  const Icon = service.icon;
                  return (
                    <>
                      <div
                        className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center mb-5",
                          service.bgColor
                        )}
                      >
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {t[service.titleKey]}
                      </h3>
                      <p className={cn('mb-4', subtleText)}>{t[service.descKey]}</p>
                      <span
                        className={cn(
                          "text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent",
                          service.color
                        )}
                      >
                        {t[service.priceKey]}
                      </span>
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex gap-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    activeIndex === index
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
