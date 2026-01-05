'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { 
  Megaphone, 
  TrendingUp, 
  Globe, 
  Clock, 
  Users, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const whyFeatures = [
  { icon: Megaphone, key: 'whyIcon1' },
  { icon: TrendingUp, key: 'whyIcon2' },
  { icon: Globe, key: 'whyIcon3' },
  { icon: Clock, key: 'whyIcon4' },
  { icon: Users, key: 'whyIcon5' },
  { icon: Sparkles, key: 'whyIcon6' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function WhySection() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;
  
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? whyFeatures.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === whyFeatures.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative section-spacing overflow-hidden">

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="max-w-3xl mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 mb-4">
            <span className="h-0.5 w-10 bg-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {t.whySectionTitle}
            </span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight"
          >
            {t.whySectionMainTitle}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
            {t.whySectionDescription}
          </motion.p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Image */}
          <motion.div
            className="hidden lg:block lg:col-span-5"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl scale-105" />
              <Image
                src="/img/Image-1.png"
                alt="Business illustration"
                width={500}
                height={600}
                className="relative rounded-2xl shadow-xl"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Blue Box + Features */}
          <div className="lg:col-span-7 space-y-6">
            {/* Blue Info Box */}
            <motion.div
              className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-3xl p-8 lg:p-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-4">
                    {t[`whyIcon${activeIndex + 1}Title`]}
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    {t[`whyIcon${activeIndex + 1}Content`]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Features Grid - Desktop */}
            <motion.div
              className="hidden md:grid grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {whyFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left",
                      activeIndex === index
                        ? "bg-primary/10 border-primary shadow-lg shadow-primary/10 -translate-y-1"
                        : "bg-card border-border hover:border-primary/50 hover:shadow-md"
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                        activeIndex === index
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={cn(
                        "font-medium transition-colors",
                        activeIndex === index ? "text-primary" : "text-foreground"
                      )}
                    >
                      {t[`whyIcon${index + 1}`]}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex-1 flex justify-center">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 bg-card rounded-xl border border-primary shadow-lg"
                  >
                    {(() => {
                      const Icon = whyFeatures[activeIndex].icon;
                      return (
                        <>
                          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="font-medium text-foreground">
                            {t[`whyIcon${activeIndex + 1}`]}
                          </span>
                        </>
                      );
                    })()}
                  </motion.div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {whyFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all",
                      activeIndex === index
                        ? "bg-primary w-6"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
