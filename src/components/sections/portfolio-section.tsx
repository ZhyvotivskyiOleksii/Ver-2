"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPortfolioProjects } from '@/data/portfolio-projects';
import { useTheme } from '@/hooks/use-theme';

export function PortfolioSection() {
  const params = useParams();
  const locale = Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale;
  const t = (translations as any)[locale] || translations.ua;
  const projects = useMemo(() => getPortfolioProjects(locale || 'ua'), [locale]);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeProject = projects[activeIndex];

  const nextProject = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevProject = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextProject, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextProject]);

  return (
    <section className="relative section-spacing overflow-hidden">

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            {t.portfolioSubtitle || 'Портфоліо'}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4"
          >
            {t.portfolioTitle || 'Наші роботи'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t.portfolioDescription || 'Проекти, якими ми пишаємося'}
          </motion.p>
        </div>

        {/* Main Showcase */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main showcase container - no border, centered */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-10">
            {/* Mockup image - left side */}
            <div className="relative flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative"
                >
                  {/* Mockup image */}
                  <div className="relative w-[260px] h-[340px] sm:w-[300px] sm:h-[400px] md:w-[380px] md:h-[500px]">
                    <Image
                      src={activeProject.mockup}
                      alt={activeProject.title}
                      fill
                      sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, 380px"
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Project Info - right side */}
            <div className="text-center lg:text-left lg:max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Project number */}
                  <div className="flex items-baseline justify-center lg:justify-start gap-1 mb-3">
                    <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                      {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      / {projects.length}
                    </span>
                  </div>

                  {/* Title - consistent with other sections */}
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    {activeProject.title}
                  </h3>

                  {/* Description - consistent size */}
                  <p className="text-muted-foreground text-sm md:text-base mb-5">
                    {activeProject.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                    {activeProject.tech?.map((tech) => (
                      <span
                        key={tech}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-full",
                          isDarkMode 
                            ? "bg-white/10 text-white/70" 
                            : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <button
                      onClick={prevProject}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        isDarkMode 
                          ? "bg-white/5 hover:bg-white/10 text-white" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      )}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={nextProject}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        isDarkMode 
                          ? "bg-white/5 hover:bg-white/10 text-white" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      )}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Thumbnail navigation */}
          <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap max-w-3xl mx-auto">
            {projects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative rounded-lg overflow-hidden transition-all duration-300",
                  "w-14 h-10 md:w-16 md:h-12",
                  index === activeIndex
                    ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                    : "opacity-40 hover:opacity-70"
                )}
              >
                <Image
                  src={project.mockup}
                  alt={project.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-14"
        >
          <Link 
            href={`/${locale}/about`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg transition-colors group"
          >
            {t.portfolioViewAll || 'Дивитись всі проекти'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
