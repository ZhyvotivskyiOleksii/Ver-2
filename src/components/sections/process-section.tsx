"use client";

import { motion } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Palette,
  Code2,
  CheckCircle2,
  Rocket
} from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

const steps = [
  {
    icon: MessageSquare,
    color: 'from-[#f8b262]/80 to-[#f97316]/70',
  },
  {
    icon: Palette,
    color: 'from-[#ec4899]/80 to-[#c084fc]/70',
  },
  {
    icon: Code2,
    color: 'from-[#60a5fa]/80 to-[#7c3aed]/70',
  },
  {
    icon: CheckCircle2,
    color: 'from-[#fb7185]/80 to-[#f97316]/70',
  },
  {
    icon: Rocket,
    color: 'from-[#a855f7]/80 to-[#7c3aed]/70',
  },
];

export function ProcessSection() {
  const params = useParams();
  const locale = Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale;
  const t = (translations as any)[locale] || translations.ua;

  const stepData = [
    { title: t.processStep1Title || 'Брифінг', desc: t.processStep1Desc || 'Обговорюємо ваші цілі та вимоги' },
    { title: t.processStep2Title || 'Дизайн', desc: t.processStep2Desc || 'Створюємо унікальний UI/UX' },
    { title: t.processStep3Title || 'Розробка', desc: t.processStep3Desc || 'Пишемо чистий код' },
    { title: t.processStep4Title || 'Тестування', desc: t.processStep4Desc || 'Перевіряємо якість' },
    { title: t.processStep5Title || 'Запуск', desc: t.processStep5Desc || 'Публікуємо та підтримуємо' },
  ];

const stepCardBase =
  'flex flex-col items-center text-center p-4 md:p-5 rounded-3xl h-full';
const descClass =
  'text-base text-muted-foreground max-w-[220px] md:max-w-[260px] leading-relaxed text-balance overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]';
const badgeBase =
  'bg-white/30 border border-white/40 text-foreground shadow-[0_6px_15px_rgba(255,255,255,0.25)]';

  return (
    <section className="relative section-spacing overflow-hidden">
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <div className="section-eyebrow px-4 py-2 max-sm:px-3 max-sm:py-1.5 max-sm:text-[11px] rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
            <CheckCircle2 className="w-4 h-4" />
            {t.processSubtitle || 'Як ми працюємо'}
          </div>
          <h2 className="section-title text-foreground text-center mb-2">
            {t.processTitle || '5 кроків до вашого сайту'}
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto text-center">
            {t.processDescription || 'Прозорий процес від ідеї до запуску'}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Steps grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-3 text-center justify-items-center max-w-2xl sm:max-w-none mx-auto">
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              return (
                <div
                  key={i}
                  className={cn('relative w-full', isLast ? 'col-span-2 sm:col-span-1' : '')}
                >
                  <LiquidGlass
                    className={`${stepCardBase} items-center text-center`}
                    rounded="3xl"
                    highlights
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, y: -4 }}
                      className={`relative w-12 h-12 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-[0_12px_20px_rgba(0,0,0,0.35)] mb-3`}
                    >
                      <step.icon className="w-5 h-5 md:w-8 md:h-8 text-white" />
                      <div
                        className={`absolute -top-1.5 -right-1.5 w-6 h-6 md:w-7 md:h-7 rounded-full text-white text-[11px] font-semibold flex items-center justify-center ${badgeBase}`}
                      >
                        {i + 1}
                      </div>
                    </motion.div>
                    <h3 className="text-base font-semibold text-foreground mb-1 text-center-mobile">
                      {stepData[i].title}
                    </h3>
                    <p className={`${descClass} text-center-mobile`}>
                      {stepData[i].desc}
                    </p>
                  </LiquidGlass>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            {t.processBottomText || 'Середній час розробки: 2-4 тижні'}
          </p>
        </div>
      </div>
    </section>
  );
}
