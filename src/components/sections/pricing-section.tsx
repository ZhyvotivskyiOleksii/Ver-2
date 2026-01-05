'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OrderForm } from '@/components/shared/order-form';
import Image from 'next/image';
import { Check, Info, Sparkles } from 'lucide-react';

const pricingPlans = [
  {
    titleKey: 'pricingCardTitle1',
    priceKey: 'pricingCardPrice1',
    descKey: 'pricingCardDesc1',
    image: '/img/pricing-1.png',
    features: ['3-5 сторінок', 'SEO оптимізація', 'Базовий дизайн', 'Аналітика'],
    popular: false,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    titleKey: 'pricingCardTitle2',
    priceKey: 'pricingCardPrice2',
    descKey: 'pricingCardDesc2',
    image: '/img/pricing-2.png',
    features: ['1 сторінка', 'Адаптивний дизайн', 'SEO', 'Форма заявки'],
    popular: true,
    color: 'from-violet-500 to-purple-500',
  },
  {
    titleKey: 'pricingCardTitle3',
    priceKey: 'pricingCardPrice3',
    descKey: 'pricingCardDesc3',
    image: '/img/pricing-3.png',
    features: ['10+ сторінок', 'CRM інтеграція', 'Чат підтримки', 'Повний SEO'],
    popular: false,
    color: 'from-orange-500 to-amber-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function PricingSection() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative section-spacing overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-0.5 w-10 bg-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {t.pricingSubtitle}
            </span>
            <span className="h-0.5 w-10 bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {t.pricingTitle}
          </h2>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto justify-items-center md:justify-items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "relative group w-full max-w-[320px] sm:max-w-[360px] md:max-w-full mx-auto md:mx-0",
                plan.popular && "lg:-mt-4 lg:mb-4"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full text-white text-sm font-medium shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    {t.mostPopular}
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "relative h-full flex flex-col rounded-3xl border transition-all duration-500 overflow-hidden w-full",
                  plan.popular
                    ? "border-primary/50 shadow-xl shadow-primary/20"
                    : "border-border",
                  hoveredIndex === index && !plan.popular && "border-primary/30 shadow-xl shadow-primary/10 -translate-y-2"
                )}
              >
                {/* Card Header with Image */}
                <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-0 opacity-20 bg-gradient-to-br",
                      plan.color
                    )}
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="relative w-full h-full">
                      <Image
                        src={plan.image}
                        alt={t[plan.titleKey]}
                        fill
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                  </div>
                  
                  {/* Info Icon */}
                  <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Info className="w-4 h-4 text-foreground/70" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="flex-1 flex flex-col p-6 bg-card">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {t[plan.titleKey]}
                  </h3>
                  
                  <p
                    className={cn(
                      "text-2xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent",
                      plan.color
                    )}
                  >
                    {t[plan.priceKey]}
                  </p>
                  
                  <p className="text-muted-foreground mb-6 flex-grow">
                    {t[plan.descKey]}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className={cn(
                          "w-full rounded-full",
                          plan.popular
                            ? "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                            : ""
                        )}
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                      >
                        {t.pricingOrderButton}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                      <DialogHeader>
                        <DialogTitle>{t.heroOrderTitle}</DialogTitle>
                        <DialogDescription>{t.heroOrderDesc}</DialogDescription>
                      </DialogHeader>
                      <OrderForm />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
