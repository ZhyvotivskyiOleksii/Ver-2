"use client";

import { motion } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { 
  Rocket, 
  Shield, 
  Palette, 
  Code2, 
  Smartphone, 
  Globe, 
  Zap,
  HeartHandshake,
  TrendingUp,
  Clock,
  CheckCircle2,
  MessageCircle,
  Mail,
  Phone,
  Video
} from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export function BentoSection() {
  const params = useParams();
  const locale = Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale;
  const t = (translations as any)[locale] || translations.ua;
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const subtleText = isDarkMode ? 'text-muted-foreground' : 'text-slate-500';
  const titleText = isDarkMode ? 'text-foreground' : 'text-slate-900';

  return (
    <section className="relative section-spacing overflow-hidden">
      <div className="container relative mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="section-eyebrow px-4 py-2 max-sm:px-3 max-sm:py-1.5 max-sm:text-[11px] rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
            {t.bentoSubtitle || 'Чому обирають нас'}
          </div>
          <h2 className="section-title text-foreground text-center mb-3">
            {t.bentoTitle || 'Все для вашого успіху'}
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto text-center">
            {t.bentoDescription || 'Комплексний підхід до розробки веб-рішень'}
          </p>
        </div>
        
        {/* Bento Grid - better tablet adaptation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-auto lg:auto-rows-[140px]">
          
          {/* Card 1 - Large: Speed/Performance */}
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            transition={{ duration: 0.2 }}
            className="col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-2 group min-h-[280px] lg:min-h-0"
          >
            <LiquidGlass
              className="relative h-full p-6 md:p-8 rounded-3xl overflow-hidden transition-all duration-500 border border-white/15"
              rounded="3xl"
              highlights
              blurRadius={34}
            >
              {/* Floating decoration */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
                  <span className="text-2xl md:text-4xl font-black text-white">100</span>
                </div>
              </motion.div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">PageSpeed</span>
                </div>
                {/* Stats row - Glass effect */}
                <div className="grid grid-cols-3 gap-2 my-3 text-center justify-items-center">
                  {[
                    { value: '0.5s', label: 'Load Time', className: 'bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent' },
                    { value: 'A+', label: 'Core Vitals', className: 'text-emerald-500' },
                    { value: '100%', label: 'Optimized', className: 'text-amber-500' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={cn(
                        'w-full p-2 sm:p-3 rounded-xl transition-all flex flex-col items-center',
                        isDarkMode
                          ? 'bg-white/5 border border-white/10'
                          : 'bg-slate-50 border border-slate-100 shadow-sm'
                      )}
                    >
                      <div className={cn('text-base sm:text-xl font-black', stat.className)}>{stat.value}</div>
                      <div className={cn('text-[11px] sm:text-sm mt-1', subtleText)}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center md:text-left">
                  <h3 className={cn('text-lg md:text-xl font-bold mb-1', titleText, 'md:text-left text-center')}>
                    {t.bentoSpeed || 'Блискавична швидкість'}
                  </h3>
                  <p className={cn('text-xs md:text-sm', subtleText, 'md:text-left text-center')}>
                    {t.bentoSpeedDesc || 'Сайти завантажуються за 0.5 секунди'}
                  </p>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>

          {/* Card 2 - Medium: Technologies */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-1 group"
          >
            <LiquidGlass
              className="relative h-full p-5 rounded-2xl overflow-hidden transition-all duration-300"
              rounded="2xl"
              highlights
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex items-center justify-between h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={cn('font-semibold', titleText)}>{t.bentoCode || 'Сучасні технології'}</h3>
                    <p className={cn('text-xs', subtleText)}>React • Next.js • TypeScript</p>
                  </div>
                </div>
                <div className="hidden md:flex gap-2">
                  {['⚛️', '▲', '📘'].map((emoji, i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="text-xl"
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            </LiquidGlass>
          </motion.div>

          {/* Small cards row - Mobile, SEO, Security */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 auto-rows-fr">
            {/* Card 3 - Small: Mobile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="group h-full"
            >
              <LiquidGlass
                className="relative h-full p-3 md:p-4 rounded-2xl min-h-[120px] transition-all duration-300 hover:-translate-y-1"
                rounded="2xl"
                highlights
              >
                <div className="flex flex-col h-full justify-between items-center text-center md:items-start md:text-left gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="space-y-1 text-center-mobile">
                    <p className={cn('text-sm font-medium leading-tight', titleText)}>
                      {t.bentoMobile || 'Mobile First'}
                    </p>
                    <p className={cn('text-sm', subtleText, 'text-center-mobile')}>100%</p>
                  </div>
                </div>
              </LiquidGlass>
            </motion.div>

            {/* Card 4 - Small: SEO */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="group h-full"
            >
              <LiquidGlass
                className="relative h-full p-3 md:p-4 rounded-2xl min-h-[120px] transition-all duration-300 hover:-translate-y-1"
                rounded="2xl"
                highlights
              >
                <div className="flex flex-col h-full justify-between items-center text-center md:items-start md:text-left gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <Globe className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="space-y-1 text-center-mobile">
                    <p className={cn('text-sm font-medium leading-tight', titleText)}>
                      {t.bentoSEO || 'Оптимізація SEO'}
                    </p>
                    <p className={cn('text-sm', subtleText, 'text-center-mobile')}>TOP Google</p>
                  </div>
                </div>
              </LiquidGlass>
            </motion.div>

            {/* Card 5 - Small: Security */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="group h-full"
            >
              <LiquidGlass
                className="relative h-full p-3 md:p-4 rounded-2xl min-h-[120px] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                rounded="2xl"
                highlights
              >
                <div className="flex flex-col h-full justify-between items-center text-center md:items-start md:text-left gap-3 min-w-0 w-full">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="space-y-1 text-center-mobile w-full min-w-0">
                    <p className={cn('text-sm font-medium leading-tight break-words overflow-wrap-anywhere', titleText)}>
                      {t.bentoSecurity || 'Безпека'}
                    </p>
                    <p className={cn('text-sm break-words overflow-wrap-anywhere', subtleText, 'text-center-mobile')}>SSL + DDoS</p>
                  </div>
                </div>
              </LiquidGlass>
            </motion.div>
          </div>

          {/* Card 6 - Large: Support 24/7 */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.2 }}
            className="col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-2 group min-h-[280px] lg:min-h-0"
          >
            <LiquidGlass
              className="relative h-full p-6 rounded-3xl transition-all duration-500 overflow-hidden"
              rounded="3xl"
              highlights
            >
              
              <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                      <HeartHandshake className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={cn('text-base font-bold', titleText)}>
                        {t.bentoSupport || 'Підтримка'}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm text-emerald-500">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                      24/7
                    </div>
                  </div>
                </div>
                
                {/* Support channels */}
                <div className="grid grid-cols-4 gap-2 flex-1">
                  {[
                    { icon: MessageCircle, label: 'Chat', color: 'from-blue-500 to-cyan-500' },
                    { icon: Mail, label: 'Email', color: 'from-violet-500 to-purple-500' },
                    { icon: Phone, label: 'Phone', color: 'from-emerald-500 to-green-500' },
                    { icon: Video, label: 'Video', color: 'from-orange-500 to-amber-500' },
                  ].map((channel, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.05, y: -3 }}
                    >
                      <LiquidGlass
                        className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer group/card"
                        rounded="2xl"
                        highlights
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center mb-2 shadow-lg group-hover/card:shadow-xl transition-shadow`}>
                          <channel.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-foreground">{channel.label}</span>
                      </LiquidGlass>
                    </motion.div>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className={cn('text-xs text-center', subtleText)}>
                    {t.bentoResponseTime || 'Відповідь за 15 хв'} • {t.bentoSupportDesc || 'Завжди на зв\'язку'}
                  </p>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>

          {/* Card 7 - Medium: Design */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="col-span-1 sm:col-span-1 lg:col-span-2 lg:row-span-1 group"
          >
            <LiquidGlass
              className="relative h-full p-5 rounded-2xl overflow-hidden transition-all duration-300"
              rounded="2xl"
              highlights
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Color dots */}
              <div className="absolute top-3 right-4 flex gap-1">
                {['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'].map((color, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className={`w-3 h-3 rounded-full ${color}`}
                  />
                ))}
              </div>
              
              <div className="relative z-10 flex items-center gap-3 h-full max-sm:flex-col max-sm:items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div className="text-center-mobile">
                  <h3 className={cn('font-semibold', titleText)}>{t.bentoDesign || 'Унікальний дизайн'}</h3>
                  <p className={cn('text-xs', subtleText)}>{t.bentoDesignDesc || 'UI/UX на замовлення'}</p>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>

          {/* Card 8 - Small: Performance */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="col-span-1 sm:col-span-1 lg:col-span-1 lg:row-span-1 group"
          >
            <LiquidGlass
              className="relative h-full p-3 md:p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              rounded="2xl"
              highlights
            >
              <div className="flex items-center gap-3 md:flex-col md:h-full md:justify-between md:items-start">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="text-center-mobile">
                  <p className={cn('text-xs md:text-sm font-medium', titleText)}>{t.bentoPerformance || 'Швидкодія'}</p>
                  <p className={cn('text-sm', subtleText)}>99.9%</p>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>

          {/* SEO Text Block */}
          <motion.div
            className="col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-1"
          >
            <LiquidGlass
              className="h-full p-5 rounded-2xl text-center-mobile"
              rounded="2xl"
              highlights
            >
              <p className={cn('text-sm leading-relaxed text-center-mobile', subtleText)}>
                {t.bentoSeoText || 'Ми створюємо сучасні веб-сайти на React та Next.js з повною оптимізацією для пошукових систем. Кожен проект проходить тестування на швидкість, безпеку та адаптивність. Наша команда забезпечує технічну підтримку та супровід після запуску.'}
              </p>
            </LiquidGlass>
          </motion.div>

        </div>

        {/* Bottom highlights */}
        <motion.div
          className="mt-6 md:mt-10 flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-10"
        >
          {[
            { icon: CheckCircle2, text: t.bentoHighlight1 || 'Без передоплати' },
            { icon: TrendingUp, text: t.bentoHighlight2 || 'Гарантія якості' },
            { icon: Clock, text: t.bentoHighlight3 || 'Фіксована ціна' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={cn('flex items-center gap-1.5 text-sm md:text-base transition-colors', subtleText, 'hover:text-primary')}
            >
              <item.icon className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
              <span className="font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
