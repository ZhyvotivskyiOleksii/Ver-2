'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Building2,
  ShoppingCart,
  Code2,
  RefreshCw,
  Headphones,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { WebImpulsHeader } from '@/components/layout/web-impuls-header';
import { Footer } from '@/components/layout/footer';
import { OrderModal } from '@/components/order-modal';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { PricingIllustration } from '@/components/floating-illustrations';

// Tech badge with colored icons
const techConfig: Record<string, { icon: JSX.Element; color: string; bg: string }> = {
  'Next.js': {
    icon: <svg viewBox="0 0 180 180" className="w-4 h-4"><mask id="a" height="180" maskUnits="userSpaceOnUse" width="180" x="0" y="0"><circle cx="90" cy="90" fill="#fff" r="90"/></mask><g mask="url(#a)"><circle cx="90" cy="90" fill="#000" r="90"/><path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#b)"/><path d="M115 54h12v72h-12z" fill="url(#c)"/></g><defs><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="109" x2="144.5" y1="116.5" y2="160.5"><stop stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient><linearGradient id="c" gradientUnits="userSpaceOnUse" x1="121" x2="120.799" y1="54" y2="106.875"><stop stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient></defs></svg>,
    color: '',
    bg: 'bg-black/5 dark:bg-white/10',
  },
  'React': {
    icon: <svg viewBox="-11 -10 22 20" className="w-4 h-4" fill="currentColor"><circle r="2"/><g stroke="currentColor" strokeWidth="1" fill="none"><ellipse rx="10" ry="4"/><ellipse rx="10" ry="4" transform="rotate(60)"/><ellipse rx="10" ry="4" transform="rotate(120)"/></g></svg>,
    color: 'text-[#61DAFB]',
    bg: 'bg-[#61DAFB]/10',
  },
  'Tailwind': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z"/></svg>,
    color: 'text-[#06B6D4]',
    bg: 'bg-[#06B6D4]/10',
  },
  'Prisma': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M21.8 18.2L13 2.5c-.4-.7-1.5-.6-1.8.1L3.2 17.6c-.3.6.1 1.4.8 1.5l16.3 2.8c.7.1 1.3-.5 1.1-1.2l-.6-2.5zm-8.6 1L7.7 18l5.5-12.5 4.8 12.3-4.8 1.4z"/></svg>,
    color: 'text-[#2D3748] dark:text-white',
    bg: 'bg-[#2D3748]/10 dark:bg-white/10',
  },
  'PostgreSQL': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 1.63-.79 3.07-2 3.97V15h-6v-2.03c-1.21-.9-2-2.34-2-3.97 0-2.76 2.24-5 5-5z"/></svg>,
    color: 'text-[#336791]',
    bg: 'bg-[#336791]/10',
  },
  'Stripe': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>,
    color: 'text-[#635BFF]',
    bg: 'bg-[#635BFF]/10',
  },
  'Supabase': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642l-.113-7.51z" fill="url(#paint0_linear)"/><defs><linearGradient id="paint0_linear" x1="12" y1="1" x2="12" y2="23" gradientUnits="userSpaceOnUse"><stop stopColor="#3ECF8E"/><stop offset="1" stopColor="#3ECF8E" stopOpacity=".7"/></linearGradient></defs></svg>,
    color: 'text-[#3ECF8E]',
    bg: 'bg-[#3ECF8E]/10',
  },
  'tRPC': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    color: 'text-[#2596BE]',
    bg: 'bg-[#2596BE]/10',
  },
  'Redis': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M10.5 2.5L2.5 6.5v11l8 4 8-4v-11l-8-4zm0 2.12l5.5 2.75-5.5 2.75L5 7.37l5.5-2.75z"/></svg>,
    color: 'text-[#DC382D]',
    bg: 'bg-[#DC382D]/10',
  },
  'Figma': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" fill="#0ACF83"/><path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="#A259FF"/><path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" fill="#F24E1E"/><path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" fill="#FF7262"/><path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" fill="#1ABCFE"/></svg>,
    color: '',
    bg: 'bg-[#F24E1E]/10',
  },
  'Framer': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/></svg>,
    color: 'text-[#0055FF]',
    bg: 'bg-[#0055FF]/10',
  },
  'Analytics': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M3 13h4v8H3v-8zm7-10h4v18h-4V3zm7 5h4v13h-4V8z"/></svg>,
    color: 'text-[#F9AB00]',
    bg: 'bg-[#F9AB00]/10',
  },
  'Sentry': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M13.91 2.53c-.57-.97-1.99-.97-2.56 0L7.43 9.8a5.98 5.98 0 0 1 3.1.86l2.37-4.1 5.16 8.93h-2.75a5.97 5.97 0 0 1 .01 1.77h4.51c.83 0 1.34-.9.92-1.62l-6.84-11.84z"/></svg>,
    color: 'text-[#362D59]',
    bg: 'bg-[#362D59]/10',
  },
  'Monitoring': {
    icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M3 17h2v4H3v-4zm4-6h2v10H7V11zm4-4h2v14h-2V7zm4 2h2v12h-2V9zm4 4h2v8h-2v-8z"/></svg>,
    color: 'text-[#10B981]',
    bg: 'bg-[#10B981]/10',
  },
};

function TechBadge({ name }: { name: string }) {
  const config = techConfig[name] || { 
    icon: null, 
    color: 'text-slate-600 dark:text-white/70', 
    bg: 'bg-slate-100 dark:bg-white/10' 
  };
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium',
      'border border-slate-200/50 dark:border-white/5',
      config.bg
    )}>
      {config.icon && <span className={config.color}>{config.icon}</span>}
      <span className="text-slate-700 dark:text-white/90">{name}</span>
    </span>
  );
}

export default function PricingPageClient() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const openOrderModal = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsOrderModalOpen(true);
  };

  const services = [
    {
      id: 'landing',
      icon: Rocket,
      title: t.serviceLandingTitle,
      price: t.serviceLandingPrice,
      timeline: t.serviceLandingTimeline,
      tech: ['Next.js', 'React', 'Tailwind'],
      gradient: 'from-violet-500 to-purple-600',
      glow: 'rgba(139, 92, 246, 0.3)',
    },
    {
      id: 'corporate',
      icon: Building2,
      title: t.serviceCorporateTitle,
      price: t.serviceCorporatePrice,
      timeline: t.serviceCorporateTimeline,
      tech: ['Next.js', 'Prisma', 'PostgreSQL'],
      gradient: 'from-blue-500 to-cyan-600',
      glow: 'rgba(6, 182, 212, 0.3)',
      popular: true,
    },
    {
      id: 'ecommerce',
      icon: ShoppingCart,
      title: t.serviceECommerceTitle,
      price: t.serviceECommercePrice,
      timeline: t.serviceECommerceTimeline,
      tech: ['Next.js', 'Stripe', 'Supabase'],
      gradient: 'from-orange-500 to-amber-600',
      glow: 'rgba(249, 115, 22, 0.3)',
    },
    {
      id: 'webapp',
      icon: Code2,
      title: t.serviceWebAppTitle,
      price: t.serviceWebAppPrice,
      timeline: t.serviceWebAppTimeline,
      tech: ['Next.js', 'tRPC', 'Redis'],
      gradient: 'from-cyan-500 to-blue-600',
      glow: 'rgba(14, 165, 233, 0.3)',
    },
    {
      id: 'redesign',
      icon: RefreshCw,
      title: t.serviceRedesignTitle,
      price: t.serviceRedesignPrice,
      timeline: t.serviceRedesignTimeline,
      tech: ['Figma', 'Tailwind', 'Framer'],
      gradient: 'from-rose-500 to-pink-600',
      glow: 'rgba(244, 63, 94, 0.3)',
    },
    {
      id: 'support',
      icon: Headphones,
      title: t.serviceSupportTitle,
      price: t.serviceSupportPrice,
      timeline: t.serviceSupportTimeline,
      tech: ['Analytics', 'Sentry', 'Monitoring'],
      gradient: 'from-emerald-500 to-green-600',
      glow: 'rgba(16, 185, 129, 0.3)',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <WebImpulsHeader />
      
      <main className="flex-1 pt-[var(--header-height)]">
        {/* Hero Section */}
        <section className="relative pt-4 pb-16 md:py-24">
          {/* Subtle gradient orbs - background only */}
          <div className="absolute inset-x-0 top-0 h-[200%] overflow-hidden pointer-events-none">
            <div 
              className="absolute top-[5%] left-[10%] w-[800px] h-[800px] rounded-full opacity-50 dark:opacity-15 blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute top-[30%] right-[5%] w-[700px] h-[700px] rounded-full opacity-50 dark:opacity-15 blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 70%)' }}
            />
            <div 
              className="absolute top-[60%] left-[20%] w-[600px] h-[600px] rounded-full opacity-40 dark:opacity-10 blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)' }}
            />
          </div>

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left - Text content (first on mobile) */}
              <div className="text-center lg:text-left order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="page-eyebrow mb-6"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>{t.pricingHeroBadge}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="page-hero-title mb-6 uppercase"
                >
                  <span className="text-foreground">{t.pricingHeroTitle1 || 'Прозорі'} </span>
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    {t.pricingHeroTitle2 || 'ціни на розробку'}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="page-hero-subtitle mb-8"
                >
                  {t.pricingHeroSubtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.12 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Button asChild size="lg" className="h-14 px-8 rounded-full text-base">
                    <Link href={`/${locale}/contact`}>
                      {t.pricingHeroCTA}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full text-base">
                    <Link href={`/${locale}/services`}>{t.pricingViewServices}</Link>
                  </Button>
                </motion.div>
              </div>

              {/* Right - Illustration (second on mobile) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="order-2 h-48 md:h-auto"
              >
                <PricingIllustration />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Cards - Compact Design */}
        <section className="py-8 md:py-16">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="group relative"
                  >
                    {/* Card */}
                    <div className={cn(
                      'relative h-full rounded-xl overflow-hidden transition-all duration-300',
                      'bg-gradient-to-b from-slate-50 to-white dark:from-[#1a1b23] dark:to-[#14151a]',
                      'border border-slate-200 dark:border-white/[0.08]',
                      'hover:border-slate-300 dark:hover:border-white/[0.15]',
                      'hover:shadow-lg hover:-translate-y-1',
                      service.popular && 'border-primary/50 dark:border-primary/30'
                    )}>
                      {/* Popular badge */}
                      {service.popular && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-violet-500 text-white text-[10px] font-bold shadow-sm">
                            ⭐ {t.mostPopular}
                          </span>
                        </div>
                      )}
                      
                      {/* Header with gradient bg */}
                      <div className={cn('relative p-4 pb-3', service.popular && 'pt-10')}>
                        {/* Subtle gradient overlay */}
                        <div className={cn(
                          'absolute inset-0 opacity-[0.06] bg-gradient-to-br',
                          service.gradient
                        )} />
                        
                        {/* Icon */}
                        <div className="relative mb-3">
                          <div className={cn(
                            'w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center',
                            'bg-gradient-to-br shadow-md',
                            service.gradient
                          )}
                            style={{ boxShadow: `0 4px 16px ${service.glow}` }}
                          >
                            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                          {service.title}
                        </h3>
                        
                        {/* Price */}
                        <div className="flex items-baseline gap-1 mb-1.5">
                          <span className={cn(
                            'text-xl md:text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent',
                            service.gradient
                          )}>
                            {service.price}
                          </span>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <Clock className="w-3 h-3" />
                          <span className="text-sm font-medium">
                            {service.timeline}
                          </span>
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
                      
                      {/* Tech stack */}
                      <div className="p-4 pt-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                          {t.technologies}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {service.tech.map((tech) => (
                            <TechBadge key={tech} name={tech} />
                          ))}
                        </div>

                        {/* Button */}
                        <Button
                          onClick={() => openOrderModal(service.id)}
                          className={cn(
                            'w-full h-9 rounded-full text-sm font-semibold transition-all duration-300',
                            service.popular 
                              ? `bg-gradient-to-r ${service.gradient} text-white hover:opacity-90 shadow-md` 
                              : 'border border-slate-200 dark:border-white/10 bg-transparent hover:bg-primary hover:border-primary hover:text-white text-foreground'
                          )}
                          style={service.popular ? { boxShadow: `0 4px 16px ${service.glow}` } : {}}
                          variant={service.popular ? 'default' : 'outline'}
                        >
                          {t.orderButton || t.orderNow}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
              );
            })}
            </div>
          </div>
        </section>

        {/* Pricing Explanation - SEO Text Block */}
        <section className="py-16 md:py-24">
          <div className="container">
            <article className="max-w-6xl mx-auto">
              <h2 className="page-section-heading text-center mb-10">
                {t.pricingExplanationTitle}
              </h2>
              
              {/* Two column layout */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-base md:text-lg leading-relaxed text-muted-foreground">
                {/* Left column */}
                <div className="space-y-6">
                  <p>{t.pricingSeoText1}</p>
                  <p>{t.pricingSeoText2}</p>
                  
                  <div className="pt-4">
                    <h3 className="text-xl font-bold text-foreground mb-3">{t.pricingSeoHeading1}</h3>
                    <p>{t.pricingSeoText3}</p>
                  </div>
            </div>
                
                {/* Right column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{t.pricingSeoHeading2}</h3>
                    <p>{t.pricingSeoText4}</p>
          </div>
                  
                  <div className="pt-4">
                    <h3 className="text-xl font-bold text-foreground mb-3">{t.pricingSeoHeading3}</h3>
                    <p>{t.pricingSeoText5}</p>
                  </div>
                </div>
              </div>
              
              {/* CTA block - full width */}
              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 text-center">
                <p className="text-foreground font-medium">
                  💡 {t.pricingSeoConclusion}
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="relative p-10 md:p-16 rounded-3xl overflow-hidden text-center
                bg-gradient-to-br from-primary/10 via-violet-500/10 to-cyan-500/10
                border border-primary/20"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t.pricingCTATitle}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t.pricingCTADesc}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="h-14 px-8 rounded-full text-lg bg-gradient-to-r from-primary to-violet-600">
                    <Link href={`/${locale}/contact`}>
                      {t.pricingCTAButton}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg">
                    <Link href={`/${locale}/services`}>
                      {t.pricingViewDetails}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        defaultService={selectedService}
        sourcePage="pricing"
      />
    </div>
  );
}
