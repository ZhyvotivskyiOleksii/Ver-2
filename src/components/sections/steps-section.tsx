'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  ClipboardList,
  MessageSquare,
  Layout,
  Palette,
  Code2,
  Settings,
  BarChart3,
  Rocket,
} from 'lucide-react';

const steps = [
  { icon: ClipboardList, number: '01' },
  { icon: MessageSquare, number: '02' },
  { icon: Layout, number: '03' },
  { icon: Palette, number: '04' },
  { icon: Code2, number: '05' },
  { icon: Settings, number: '06' },
  { icon: BarChart3, number: '07' },
  { icon: Rocket, number: '08' },
];

const stepPalettes = [
  {
    surface: 'linear-gradient(145deg, rgba(255,138,0,0.15), rgba(51,24,4,0.25))',
    border: 'rgba(255,138,0,0.4)',
    iconFrom: '#ff8a00',
    iconTo: '#ff4d00',
    badge: '0 0 25px rgba(255,138,0,0.45)',
  },
  {
    surface: 'linear-gradient(145deg, rgba(86,79,255,0.18), rgba(29,10,41,0.4))',
    border: 'rgba(135,82,255,0.45)',
    iconFrom: '#a855f7',
    iconTo: '#6d28d9',
    badge: '0 0 25px rgba(168,85,247,0.45)',
  },
  {
    surface: 'linear-gradient(145deg, rgba(34,197,94,0.18), rgba(6,41,24,0.5))',
    border: 'rgba(34,197,94,0.45)',
    iconFrom: '#22c55e',
    iconTo: '#16a34a',
    badge: '0 0 25px rgba(34,197,94,0.4)',
  },
  {
    surface: 'linear-gradient(145deg, rgba(59,130,246,0.18), rgba(11,26,45,0.45))',
    border: 'rgba(59,130,246,0.45)',
    iconFrom: '#3b82f6',
    iconTo: '#1d4ed8',
    badge: '0 0 25px rgba(59,130,246,0.4)',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function StepsSection() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

  return (
    <section
      ref={containerRef}
      className="relative section-spacing overflow-hidden"
    >
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
              {t.stepsSubtitle}
            </span>
            <span className="h-0.5 w-10 bg-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {t.stepsTitle}
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-[60px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ff8a00] via-[#a855f7] to-[#22c55e]"
              style={{ width: lineHeight }}
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const palette = stepPalettes[index % stepPalettes.length];
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                {/* Step Card */}
                <div
                  className="relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.45)] ring-1 backdrop-blur-md"
                  style={{
                    background: palette.surface,
                    borderColor: palette.border,
                    boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.04)`,
                  }}
                >
                  {/* Number Badge */}
                  <div
                    className="absolute -top-4 -right-2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm z-10"
                    style={{
                      background: `linear-gradient(135deg, ${palette.iconFrom}, ${palette.iconTo})`,
                      boxShadow: palette.badge,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${palette.iconFrom}, ${palette.iconTo})`,
                      boxShadow: palette.badge,
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t[`stepName${step.number}`]}
                  </h3>
                  <p className="text-base text-white/70 leading-relaxed">
                    {t[`stepDesc${step.number}`]}
                  </p>
                </div>

                {/* Connector Line - Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute left-1/2 -bottom-4 w-0.5 h-8 bg-gradient-to-b from-primary to-transparent -translate-x-1/2" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
