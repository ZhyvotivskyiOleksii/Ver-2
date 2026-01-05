'use client';

import { motion } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Rocket, Award, HeadphonesIcon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const advantages = [
  { icon: Rocket, key: 'benefit1Title' },
  { icon: Award, key: 'benefit2Title' },
  { icon: HeadphonesIcon, key: 'benefit3Title' },
];

export function AdvantagesSection() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;

  return (
    <section className="relative section-spacing overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Text Content */}
          <motion.div className="flex-1 text-center lg:text-left" variants={itemVariants}>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-0.5 w-10 bg-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                {t.benefitsTitle}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t.benefitsHeadline}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t.benefitsDescription}
            </p>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="flex-1 hidden lg:flex justify-center"
            variants={itemVariants}
          >
            <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl" />
              <Image
                src="/img/Left-Tilt.webp"
                alt="Web Design Example"
                width={500}
                height={400}
                className="relative rounded-2xl shadow-2xl"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Advantage Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <div className="relative bg-card border border-border rounded-2xl p-8 pt-14 text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1">
                  {/* Icon Circle */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/10 rounded-full scale-150 group-hover:scale-175 transition-transform" />
                      <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t[advantage.key]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
