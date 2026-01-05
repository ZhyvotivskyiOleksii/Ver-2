"use client";

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { 
  HelpCircle, 
  ChevronRight, 
  Wallet, 
  Clock, 
  Handshake, 
  Shield, 
  Search, 
  PenTool,
  MessageCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { OrderModal } from '../order-modal';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
  gradient: string;
}

export function FAQSection() {
  const params = useParams();
  const locale = Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale;
  const t = (translations as any)[locale] || translations.ua;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  const faqs: FAQItem[] = [
    {
      question: t.faq1Question || 'Скільки коштує розробка сайту?',
      answer: t.faq1Answer || 'Вартість залежить від складності проекту. Лендінг від $600, корпоративний сайт від $2300, інтернет-магазин від $3800.',
      icon: Wallet,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      question: t.faq2Question || 'Скільки часу займає розробка?',
      answer: t.faq2Answer || 'Лендінг — 1-2 тижні, корпоративний сайт — 3-4 тижні, інтернет-магазин — 4-8 тижнів.',
      icon: Clock,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      question: t.faq3Question || 'Чи потрібна передоплата?',
      answer: t.faq3Answer || 'Ні, ми працюємо без передоплати. Оплата відбувається поетапно або після завершення проекту.',
      icon: Handshake,
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      question: t.faq4Question || 'Що входить у підтримку сайту?',
      answer: t.faq4Answer || 'Оновлення системи, резервне копіювання, моніторинг безпеки, виправлення помилок та консультації 24/7.',
      icon: Shield,
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      question: t.faq5Question || 'Чи буде сайт оптимізований для SEO?',
      answer: t.faq5Answer || 'Так, всі наші сайти оптимізовані: швидке завантаження, адаптивний дизайн, мета-теги та Schema.org.',
      icon: Search,
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      question: t.faq6Question || 'Чи можу я редагувати сайт самостійно?',
      answer: t.faq6Answer || 'Так, за бажанням ми розробляємо зручну адмін-панель за додаткову оплату.',
      icon: PenTool,
      gradient: 'from-cyan-500 to-sky-600',
    },
  ];

  return (
    <section ref={ref} className="relative section-spacing overflow-hidden">
      {/* Floating orbs */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[10%] w-72 h-72 bg-gradient-to-br from-primary/5 to-violet-500/5 rounded-full"
      />
      <motion.div
        animate={{ 
          y: [0, 30, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-full"
      />
      
      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left side - Header & CTA */}
          <div className="lg:col-span-2 lg:sticky lg:top-32">
            <div className="section-eyebrow px-4 py-2 max-sm:px-3 max-sm:py-1.5 max-sm:text-[11px] rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <HelpCircle className="w-4 h-4" />
              {t.faqSubtitle || 'FAQ'}
            </div>
            
            <h2 className="section-title text-foreground text-center mb-4">
              {t.faqTitle || 'Часті питання'}
            </h2>

            <p className="section-subtitle text-center mb-8 leading-relaxed">
              {t.faqDescription || 'Відповіді на популярні питання про нашу роботу'}
            </p>

            {/* CTA Card - hidden on mobile */}
            <div className="hidden md:block relative p-6 rounded-2xl bg-gradient-to-br from-card to-card/80 border border-border/50 overflow-hidden group">
              {/* Card glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.faqContactTitle || 'Не знайшли відповідь?'}</p>
                    <p className="text-sm text-muted-foreground">{t.faqContactDesc || 'Ми відповімо на будь-яке питання'}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full mt-4 py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {t.faqContactButton || 'Написати нам'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right side - FAQ Items */}
          <div className="lg:col-span-3 space-y-3">
            {faqs.map((faq, i) => {
              const Icon = faq.icon;
              const isOpen = openIndex === i;
              
              return (
                <div
                  key={i}
                  className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'bg-card border-primary/30 shadow-lg shadow-primary/5' 
                      : 'bg-card/50 border-border/50 hover:border-primary/20 hover:bg-card/80'
                  }`}
                >
                    {/* Gradient line on left */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: isOpen ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                      className={`absolute left-0 top-0 w-1 bg-gradient-to-b ${faq.gradient}`}
                    />
                    
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full p-4 md:p-5 flex items-center gap-4 text-left"
                    >
                      {/* Icon */}
                      <motion.div
                        animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${faq.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </motion.div>
                      
                      {/* Question */}
                      <span className={`flex-1 text-sm md:text-base font-semibold transition-colors leading-tight ${
                        isOpen ? 'text-foreground' : 'text-foreground/80'
                      }`}>
                        {faq.question}
                      </span>
                      
                      {/* Arrow */}
                      <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isOpen 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 md:px-5 pb-4 md:pb-5 pl-[72px] md:pl-[84px]">
                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        defaultService=""
      />
    </section>
  );
}
