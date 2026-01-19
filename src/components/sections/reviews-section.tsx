'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';
import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { LiquidGlass } from '@/components/ui/liquid-glass';

const reviews = [
  {
    name: 'Олександр',
    color: 'bg-primary/20 dark:bg-primary/30',
    textColor: 'text-foreground',
    quoteColor: 'text-primary',
    avatarBg: 'bg-primary',
    date: '12.01.2024',
    text: {
      ua: 'Швидка і якісна робота! Сайт запустили за 7 днів. Конверсія зросла на 40%. Рекомендую всім!',
      pl: 'Szybka i jakościowa praca! Strona uruchomiona w 7 dni. Konwersja wzrosła o 40%. Polecam!',
      en: 'Fast and quality work! Site launched in 7 days. Conversion increased by 40%. Highly recommend!',
      de: 'Schnelle und qualitative Arbeit! Seite in 7 Tagen gestartet. Konversion um 40% gestiegen!',
    },
  },
  {
    name: 'Dmitrij',
    color: 'bg-slate-800 dark:bg-slate-700',
    textColor: 'text-white',
    quoteColor: 'text-primary',
    avatarBg: 'bg-primary',
    date: '08.02.2024',
    text: {
      ua: 'Гнучкі ціни та відмінний сервіс. Рекомендую всім, хто шукає професійну розробку сайтів!',
      pl: 'Elastyczne ceny i świetny serwis. Polecam wszystkim szukającym profesjonalnej strony!',
      en: 'Flexible prices and excellent service. Recommend to everyone looking for professional web development!',
      de: 'Flexible Preise und ausgezeichneter Service. Empfehle allen für professionelle Webentwicklung!',
    },
  },
  {
    name: 'Anna',
    color: 'bg-primary/10 dark:bg-primary/20',
    textColor: 'text-foreground',
    quoteColor: 'text-primary/60',
    avatarBg: 'bg-primary',
    date: '21.03.2024',
    text: {
      ua: 'Неймовірний досвід! Розробники адаптуються до потреб клієнтів, завжди цікаві рішення.',
      pl: 'Niesamowite doświadczenie! Deweloperzy dostosowują się do potrzeb klientów.',
      en: 'Incredible experience! Developers adapt to client needs, always interesting solutions.',
      de: 'Unglaubliche Erfahrung! Entwickler passen sich an Kundenbedürfnisse an.',
    },
  },
  {
    name: 'Марія',
    color: 'bg-violet-500/20 dark:bg-violet-500/30',
    textColor: 'text-foreground',
    quoteColor: 'text-violet-500',
    avatarBg: 'bg-violet-500',
    date: '05.04.2024',
    text: {
      ua: 'Дуже задоволена співпрацею! Команда завжди на звязку, швидко реагують на всі побажання.',
      pl: 'Bardzo zadowolona ze współpracy! Zespół zawsze w kontakcie, szybko reagują na życzenia.',
      en: 'Very satisfied with the cooperation! Team always in touch, quickly respond to all requests.',
      de: 'Sehr zufrieden mit der Zusammenarbeit! Team immer erreichbar, reagiert schnell auf Wünsche.',
    },
  },
  {
    name: 'Piotr',
    color: 'bg-slate-800 dark:bg-slate-700',
    textColor: 'text-white',
    quoteColor: 'text-primary',
    avatarBg: 'bg-primary',
    date: '27.04.2024',
    text: {
      ua: 'Професіонали своєї справи! Зробили інтернет-магазин, який приносить прибуток з першого дня.',
      pl: 'Profesjonaliści! Stworzyli sklep internetowy, który przynosi zysk od pierwszego dnia.',
      en: 'True professionals! Created an online store that generates profit from day one.',
      de: 'Echte Profis! Haben einen Online-Shop erstellt, der vom ersten Tag an Gewinn bringt.',
    },
  },
  {
    name: 'Катерина',
    color: 'bg-primary/15 dark:bg-primary/25',
    textColor: 'text-foreground',
    quoteColor: 'text-primary',
    avatarBg: 'bg-primary',
    date: '11.05.2024',
    text: {
      ua: 'Найкраща команда! Створили сайт мрії для мого бізнесу. Клієнти в захваті від дизайну!',
      pl: 'Najlepszy zespół! Stworzyli wymarzony sklep dla mojego biznesu. Klienci zachwyceni designem!',
      en: 'Best team ever! Created my dream website for my business. Clients love the design!',
      de: 'Bestes Team! Haben meine Traumwebsite für mein Geschäft erstellt. Kunden lieben das Design!',
    },
  },
];

export function ReviewsSection() {
  const params = useParams();
  const locale = (Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale) || 'ua';
  const t = (translations as any)[locale] || translations.ua;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const visibleCards = 4;
  const maxIndex = Math.max(0, reviews.length - visibleCards + 1);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const cardWidth = 250;

  const arrowButtonClass = cn(
    'w-12 h-12 rounded-full border transition-all shadow-lg flex items-center justify-center',
    isDarkMode
      ? 'border-white/10 bg-card/70 text-white hover:bg-primary/25 hover:border-primary/40'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-primary/10 hover:text-primary'
  );
  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="text-center">
            <h2 className="section-title text-center">
              <span className="text-foreground">{t.reviewsTitle1 || 'Що кажуть'} </span>
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                {t.reviewsTitle2 || 'наші клієнти'}
              </span>
            </h2>
          </div>

          <div className="hidden md:flex gap-3">
            <button onClick={prevSlide} className={arrowButtonClass} aria-label="Previous reviews">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextSlide} className={arrowButtonClass} aria-label="Next reviews">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="hidden md:block">
            <div className="flex items-end justify-center">
              <div className="hidden lg:flex flex-col items-center gap-3 h-[260px] mr-5 flex-shrink-0">
                <div className="w-1 flex-1 bg-gradient-to-b from-primary via-violet-500 to-primary rounded-full" />
                <div className="flex flex-col gap-1 text-primary/40">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>

              <div className="overflow-hidden pt-[100px]" style={{ maxWidth: '1210px' }}>
                <motion.div
                  ref={scrollContainerRef}
                  className="flex items-end gap-5 cursor-grab active:cursor-grabbing touch-pan-y"
                  animate={{ x: -currentIndex * cardWidth }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50) {
                      nextSlide();
                    } else if (info.offset.x > 50) {
                      prevSlide();
                    }
                  }}
                >
                  {reviews.map((review, i) => (
                    <div key={i} className="flex items-end gap-5 flex-shrink-0">
                      <motion.div className="w-[230px] h-[260px] flex flex-col flex-shrink-0">
                        <LiquidGlass
                          className="relative w-full h-full p-5 rounded-3xl overflow-hidden flex flex-col shadow-lg"
                          rounded="3xl"
                          highlights
                        >
                          <p className={`relative z-10 ${review.textColor} text-sm leading-relaxed flex-1 italic`}>
                            {(review.text as any)[locale] || review.text.ua}
                          </p>
                          <span
                            className="pointer-events-none select-none absolute bottom-14 right-5 text-6xl font-serif text-white/40 dark:text-white/20 drop-shadow-lg"
                            aria-hidden="true"
                          >
                            ❝
                          </span>
                          <div className="relative z-10 flex items-center gap-3 mt-6 pt-1">
                            <div className={`w-9 h-9 rounded-full ${review.avatarBg} flex items-center justify-center text-white font-bold text-sm`}>
                              {review.name.charAt(0)}
                            </div>
                            <div className="flex flex-col leading-tight">
                              <div className={`font-semibold text-sm ${review.textColor}`}>{review.name}</div>
                              <span className={`text-xs font-semibold ${review.textColor} opacity-70`}>
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </LiquidGlass>
                      </motion.div>

                      {i === 0 && (
                        <div className="relative w-[200px] lg:w-[210px] h-[260px] flex-shrink-0">
                          <div className="absolute bottom-0 left-0 right-0 h-[360px] rounded-2xl overflow-hidden shadow-2xl bg-[linear-gradient(140deg,#f8b262,#f472b6,#7c3aed)]">
                            <div className="absolute bottom-0 left-0 right-0 h-[95%]">
                              <Image
                                src="/review/rew-img.png"
                                alt="Our work"
                                fill
                                sizes="(max-width: 1024px) 200px, 210px"
                                className="object-contain object-bottom scale-110"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <div className="flex items-end justify-center gap-4 mb-6 px-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-1 h-24 rounded-full bg-gradient-to-b from-primary via-violet-500 to-primary" />
                <div className="w-3 h-3 rounded-full bg-primary/70" />
              </div>
              <div className="relative w-[220px] h-[300px] rounded-2xl overflow-hidden shadow-2xl bg-[linear-gradient(140deg,#f8b262,#f472b6,#7c3aed)]">
                <Image
                  src="/review/rew-img.png"
                  alt="Our client"
                  fill
                  sizes="(max-width: 768px) 220px, 220px"
                  className="object-contain object-bottom scale-110"
                />
              </div>
            </div>

            <div className="overflow-hidden px-2">
              <motion.div
                className="flex cursor-grab active:cursor-grabbing touch-pan-y"
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) {
                    setCurrentIndex((prev) => Math.min(prev + 1, reviews.length - 1));
                  } else if (info.offset.x > 50) {
                    setCurrentIndex((prev) => Math.max(prev - 1, 0));
                  }
                }}
              >
                {reviews.map((review, i) => (
                  <motion.div key={i} className="w-full flex-shrink-0 px-2">
                    <LiquidGlass
                      className="relative overflow-hidden p-5 rounded-3xl shadow-lg min-h-[220px] flex flex-col"
                      rounded="3xl"
                      highlights
                    >
                      <p className={`relative z-10 ${review.textColor} text-base leading-relaxed flex-1 italic`}>
                        {(review.text as any)[locale] || review.text.ua}
                      </p>
                      <span
                        className="pointer-events-none select-none absolute bottom-16 right-6 text-6xl font-serif text-white/40 dark:text-white/20 drop-shadow-lg"
                        aria-hidden="true"
                      >
                        ❝
                      </span>
                      <div className="relative z-10 flex items-center gap-3 mt-6">
                        <div className={`w-10 h-10 rounded-full ${review.avatarBg} flex items-center justify-center text-white font-bold text-sm`}>
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <div className={`font-semibold ${review.textColor}`}>{review.name}</div>
                          <span className={`text-xs font-semibold ${review.textColor} opacity-70`}>
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </LiquidGlass>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                className={arrowButtonClass}
                aria-label="Previous reviews"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, reviews.length - 1))}
                className={arrowButtonClass}
                aria-label="Next reviews"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === currentIndex ? 'bg-primary w-8' : 'bg-primary/30 w-2.5 hover:bg-primary/50'
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
