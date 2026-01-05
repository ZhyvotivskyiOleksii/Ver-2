'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Zap } from 'lucide-react';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';
import { useState } from 'react';
import { OrderModal } from '../order-modal';

export function CTASection() {
  const params = useParams();
  const locale = (Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale) || 'ua';
  const t = (translations as any)[locale] || translations.ua;
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <>
      <section className="section-spacing relative overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="section-eyebrow px-4 py-2 max-sm:px-3 max-sm:py-1.5 max-sm:text-[11px] rounded-full bg-primary/20 border border-primary/30 text-primary mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span>{t.ctaBadge || 'Безкоштовна консультація'}</span>
            </div>

            {/* Title */}
            <h2 className="section-title text-center mb-6">
              <span className="text-foreground">{t.ctaTitle1 || 'Готові почати'} </span>
              <span className="bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#c084fc] bg-clip-text text-transparent">
                {t.ctaTitle2 || 'свій проєкт?'}
              </span>
            </h2>

            {/* Description */}
            <p className="section-subtitle text-center mb-8 max-w-xl mx-auto">
              {t.ctaDescription || 'Залиште заявку і отримайте безкоштовну консультацію. Ми зв\'яжемося з вами протягом 2 годин!'}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => setIsOrderModalOpen(true)}
                className="w-auto max-w-full group relative overflow-hidden rounded-full px-6 py-3 md:px-8 md:py-5 text-base md:text-lg font-semibold bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] shadow-lg shadow-[#7c3aed]/30 transition-all hover:shadow-xl hover:shadow-[#7c3aed]/40 hover:scale-105 whitespace-nowrap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t.ctaButton || 'Замовити сайт'}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-auto max-w-full rounded-full px-6 py-3 md:px-8 md:py-5 text-base md:text-lg font-semibold border-2 whitespace-nowrap"
                onClick={() => {
                  // Open chat widget
                  const chatButton = document.querySelector('[data-chat-trigger]') as HTMLButtonElement;
                  if (chatButton) chatButton.click();
                }}
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t.ctaChat || 'Написати в чат'}
              </Button>
            </div>

            {/* Trust text */}
            <p className="mt-8 text-sm text-muted-foreground">
              {t.ctaTrust || '✓ Без передоплати ✓ Гарантія якості ✓ Підтримка 24/7'}
            </p>
          </div>
        </div>
      </section>

      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
      />
    </>
  );
}
