'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebImpulsHeader } from '@/components/layout/web-impuls-header';
import { Footer } from '@/components/layout/footer';
import { 
  Sparkles,
  Target,
  Lightbulb,
  Eye,
  Handshake,
  Award,
  Users,
  Rocket,
  ArrowRight,
  Code2,
  Palette,
  Zap,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';
import { AboutIllustration } from '@/components/floating-illustrations';
import { cn } from '@/lib/utils';
import { getPortfolioProjects, type PortfolioProject } from '@/data/portfolio-projects';

// Tech stack for display with icons
const techStack = [
  { 
    name: 'Next.js 15', 
    icon: '/img/services/next.svg',
    textClass: 'text-black dark:text-white',
    bgColor: 'bg-black/10 dark:bg-white/10',
    glowColor: '#ffffff',
  },
  { 
    name: 'React 19', 
    icon: '/img/services/react.svg',
    textClass: 'text-[#61DAFB]',
    bgColor: 'bg-[#61DAFB]/10',
    glowColor: '#61DAFB',
  },
  { 
    name: 'Supabase', 
    icon: '/img/services/supabase.svg',
    textClass: 'text-[#3ECF8E]',
    bgColor: 'bg-[#3ECF8E]/10',
    glowColor: '#3ECF8E',
  },
  { 
    name: 'Tailwind CSS', 
    icon: '/img/services/tailwind.svg',
    textClass: 'text-[#06B6D4]',
    bgColor: 'bg-[#06B6D4]/10',
    glowColor: '#06B6D4',
  },
  { 
    name: 'Node.js', 
    icon: '/img/services/node_js.svg',
    textClass: 'text-[#339933] dark:text-[#8CC84B]',
    bgColor: 'bg-[#339933]/10',
    glowColor: '#339933',
  },
  { 
    name: 'PostgreSQL', 
    icon: '/img/services/postgres.svg',
    textClass: 'text-[#336791] dark:text-[#5A9BD4]',
    bgColor: 'bg-[#336791]/10',
    glowColor: '#336791',
  },
  { 
    name: 'Prisma', 
    icon: '/img/services/prisma.svg',
    textClass: 'text-[#2D3748] dark:text-white',
    bgColor: 'bg-[#2D3748]/10 dark:bg-white/10',
    glowColor: '#5A67D8',
  },
  { 
    name: 'Vite', 
    icon: '/img/services/vite.svg',
    textClass: 'text-[#646CFF] dark:text-[#A5AAFF]',
    bgColor: 'bg-[#646CFF]/10',
    glowColor: '#646CFF',
  },
  { 
    name: 'Figma', 
    icon: '/img/services/figma.svg',
    textClass: 'text-[#F24E1E]',
    bgColor: 'bg-[#F24E1E]/10',
    glowColor: '#F24E1E',
  },
  { 
    name: 'GitHub', 
    icon: '/img/services/github.svg',
    textClass: 'text-[#181717] dark:text-white',
    bgColor: 'bg-black/10 dark:bg-white/10',
    glowColor: '#ffffff',
  },
  { 
    name: 'Vercel', 
    icon: '/img/services/vercel.svg',
    textClass: 'text-black dark:text-white',
    bgColor: 'bg-black/10 dark:bg-white/10',
    glowColor: '#ffffff',
  },
  { 
    name: 'Stripe', 
    icon: '/img/services/stripe.svg',
    textClass: 'text-[#635BFF]',
    bgColor: 'bg-[#635BFF]/10',
    glowColor: '#635BFF',
  },
];

const DRAG_SENSITIVITY = 0.25;
const MOMENTUM_DURATION = 80;
const SWIPE_THRESHOLD = 30;

export default function AboutPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = (translations as any)[locale] || translations.ua;
  const projects = useMemo(() => getPortfolioProjects(locale), [locale]);
  
  // 3D Carousel state
  const [rotationAngle, setRotationAngle] = useState(0);
  const [targetAngle, setTargetAngle] = useState(0);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [radius, setRadius] = useState(600);
  const [isDragging, setIsDragging] = useState(false);
  const startPointerX = useRef(0);
  const lastPointerX = useRef(0);
  const velocityRef = useRef(0);
  const lastMoveTime = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const latestAngleRef = useRef(0);
  const pointerTypeRef = useRef<'mouse' | 'touch' | 'pen'>('mouse');
  const swipeStartAngle = useRef(0);
  
  useEffect(() => {
    setSelectedProject(null);
  }, [projects]);

  const totalItems = projects.length;
  const angleIncrement = 360 / totalItems;

  // Update radius based on screen size
  useEffect(() => {
    const updateRadius = () => {
      setRadius(window.innerWidth > 768 ? 420 : 260);
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  useEffect(() => {
    latestAngleRef.current = rotationAngle;
  }, [rotationAngle]);

  // Smooth animation loop
  useEffect(() => {
    if (!isDragging && rotationAngle !== targetAngle) {
      const animate = () => {
        setRotationAngle(prev => {
          const diff = targetAngle - prev;
          if (Math.abs(diff) < 0.1) return targetAngle;
          return prev + diff * 0.15; // Smooth easing
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [isDragging, targetAngle, rotationAngle]);

  const nextSlide = () => {
    const newAngle = Math.round(targetAngle / angleIncrement) * angleIncrement + angleIncrement;
    setTargetAngle(newAngle);
  };

  const prevSlide = () => {
    const newAngle = Math.round(targetAngle / angleIncrement) * angleIncrement - angleIncrement;
    setTargetAngle(newAngle);
  };

  const snapToNearest = (currentAngle: number, currentVelocity: number) => {
    const momentumFactor = pointerTypeRef.current === 'touch' ? 0 : MOMENTUM_DURATION;
    const momentum = Math.max(-90, Math.min(90, currentVelocity * momentumFactor));
    const projected = currentAngle + momentum;
    const nearest = Math.round(projected / angleIncrement) * angleIncrement;
    setTargetAngle(nearest);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    pointerTypeRef.current = (e.pointerType as 'mouse' | 'touch' | 'pen') || 'mouse';
    setIsDragging(true);
    lastPointerX.current = e.clientX;
    startPointerX.current = e.clientX;
    swipeStartAngle.current = latestAngleRef.current;
    velocityRef.current = 0;
    lastMoveTime.current = performance.now();
    
    if (e.pointerType === 'mouse') {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const currentTime = performance.now();
    const deltaX = e.clientX - lastPointerX.current;
    const totalDeltaX = e.clientX - startPointerX.current;
    const timeDiff = currentTime - lastMoveTime.current;
    
    if (e.pointerType === 'touch' && Math.abs(totalDeltaX) > 10) {
      e.preventDefault();
    } else if (e.pointerType === 'mouse') {
      e.preventDefault();
    }
    
    lastPointerX.current = e.clientX;
    if (deltaX === 0) {
      lastMoveTime.current = currentTime;
      return;
    }
    
    const rotationDelta = deltaX * DRAG_SENSITIVITY;
    if (timeDiff > 0) {
      velocityRef.current = rotationDelta / timeDiff;
    }
    setRotationAngle(prev => {
      const next = prev - rotationDelta;
      latestAngleRef.current = next;
      return next;
    });
    
    lastMoveTime.current = currentTime;
  };

  const handlePointerUp = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const totalSwipe = startPointerX.current - (e?.clientX ?? lastPointerX.current);
    
    if (e && e.pointerType === 'mouse') {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if capture was already released
      }
    }
    
    setIsDragging(false);
    
    // For touch: use simple swipe detection
    if (pointerTypeRef.current === 'touch') {
      if (Math.abs(totalSwipe) > SWIPE_THRESHOLD) {
        if (totalSwipe > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else {
        setTargetAngle(Math.round(swipeStartAngle.current / angleIncrement) * angleIncrement);
      }
    } else {
      snapToNearest(latestAngleRef.current, velocityRef.current);
    }
    
    velocityRef.current = 0;
    if (pointerTypeRef.current === 'touch') {
      pointerTypeRef.current = 'mouse';
    }
  };

  // Get active index
  let activeIndex = Math.round(rotationAngle / angleIncrement) % totalItems;
  if (activeIndex < 0) activeIndex += totalItems;

  const handleItemClick = (project: typeof projects[0]) => {
    if (isDragging) return;
    setSelectedProject(project);
  };

  const values = [
    {
      icon: Award,
      title: t.aboutValue1Title,
      desc: t.aboutValue1Desc,
      gradient: 'from-violet-500 to-purple-600',
      glow: 'rgba(139, 92, 246, 0.3)',
    },
    {
      icon: Lightbulb,
      title: t.aboutValue2Title,
      desc: t.aboutValue2Desc,
      gradient: 'from-amber-500 to-orange-600',
      glow: 'rgba(249, 115, 22, 0.3)',
    },
    {
      icon: Eye,
      title: t.aboutValue3Title,
      desc: t.aboutValue3Desc,
      gradient: 'from-cyan-500 to-blue-600',
      glow: 'rgba(6, 182, 212, 0.3)',
    },
    {
      icon: Handshake,
      title: t.aboutValue4Title,
      desc: t.aboutValue4Desc,
      gradient: 'from-emerald-500 to-green-600',
      glow: 'rgba(16, 185, 129, 0.3)',
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <WebImpulsHeader />
      
      <main className="flex-1 pt-[var(--header-height)]">
        {/* Hero Section - with mesh gradient and depth */}
        <section className="relative pt-4 pb-16 md:py-28 overflow-hidden">
          {/* Full-bleed mesh gradient background */}
          <div className="absolute inset-0 -z-10">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-background to-cyan-50 dark:from-violet-950/20 dark:via-background dark:to-cyan-950/20" />
            
            {/* Subtle grid pattern overlay */}
            <div 
              className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          </div>


          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-4 md:pt-0">
              {/* Left - Text content (first on mobile) */}
              <div className="text-center lg:text-left order-1">
                <div className="page-eyebrow mb-8 border border-primary/20 shadow-lg shadow-primary/5 bg-white/80 dark:bg-white/10 text-primary">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>{t.aboutHeroBadge}</span>
                </div>

                <h1 className="page-hero-title mb-6 uppercase">
                  <span className="text-foreground">{t.aboutHeroTitle1 || 'Ми створюємо'} </span>
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    {t.aboutHeroTitle2 || 'цифрове майбутнє'}
                  </span>
                </h1>

                <p className="page-hero-subtitle">
                  {t.aboutHeroDesc}
                </p>
              </div>

              {/* Right - Illustration (second on mobile, right on desktop) */}
              <div className="order-2 h-48 md:h-auto">
                <AboutIllustration />
              </div>
            </div>
          </div>

          {/* Bottom fade for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>

        {/* Mission & Vision - Compact */}
        <section className="py-10 md:py-16 relative overflow-hidden">
          {/* Seamless background - extends from hero */}
          <div className="absolute inset-0 -z-10">
            {/* Top fade from previous section */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />
            {/* Subtle orbs - much softer */}
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-500/5 dark:bg-violet-500/3 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-cyan-500/5 dark:bg-cyan-500/3 rounded-full blur-[100px]" />
            {/* Bottom fade to next section */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="container">
            <div className="text-center mb-10">
              <span className="page-eyebrow mb-3">
                {t.aboutWhoWeAre || 'Хто ми'}
              </span>
              <h2 className="page-section-heading text-center">
                {t.aboutMissionVisionTitle || 'Наша місія та бачення'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5 lg:gap-6 max-w-5xl mx-auto">
              {/* Mission Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative h-full p-5 md:p-6 rounded-2xl bg-white dark:bg-[#18191f] border border-slate-200/50 dark:border-white/[0.06] shadow-lg overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-500/15 to-transparent rounded-bl-[60px]" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/25">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs text-violet-500 font-semibold uppercase tracking-wider">Mission</span>
                        <h3 className="text-lg md:text-xl font-bold text-foreground">{t.aboutMissionTitle}</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {t.aboutMissionText}
                    </p>
                    
                    {/* Mission highlights */}
                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t.missionPoint1 || 'Якісний код'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t.missionPoint2 || 'Сучасний дизайн'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t.missionPoint3 || 'Швидка розробка'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t.missionPoint4 || 'Підтримка 24/7'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative h-full p-5 md:p-6 rounded-2xl bg-white dark:bg-[#18191f] border border-slate-200/50 dark:border-white/[0.06] shadow-lg overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/15 to-transparent rounded-bl-[60px]" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/25">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs text-cyan-500 font-semibold uppercase tracking-wider">Vision</span>
                        <h3 className="text-lg md:text-xl font-bold text-foreground">{t.aboutVisionTitle}</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {t.aboutVisionText}
                    </p>
                    
                    {/* Vision highlights */}
                    <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t.visionPoint1 || 'Лідерство'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t.visionPoint2 || 'Інновації'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t.visionPoint3 || 'Глобальність'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t.visionPoint4 || 'Розвиток'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3D Portfolio Carousel - Original Style */}
        <section className="py-10 md:py-16 pb-28 md:pb-36 relative overflow-hidden">
          {/* Seamless background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-wider">
                {t.portfolioTitle || 'Portfolio'}
              </h2>
            </motion.div>

            {/* 3D Carousel Container - 20% smaller on desktop */}
            <div 
              className="relative mx-auto h-[280px] md:h-[320px] overflow-visible"
              style={{ perspective: '1600px' }}
            >
              {/* Carousel Track */}
              <div
                ref={trackRef}
                className="absolute w-full h-full cursor-grab active:cursor-grabbing touch-none"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${-rotationAngle}deg)`,
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {projects.map((project, index) => {
                  const angle = index * angleIncrement;
                  const isActive = index === activeIndex;
                  
                  return (
                    <div
                      key={project.id}
                      className={cn(
                        'absolute left-1/2 top-1/2 cursor-pointer select-none',
                        'w-[160px] h-[220px] md:w-[200px] md:h-[280px]',
                        '-ml-[80px] -mt-[110px] md:-ml-[100px] md:-mt-[140px]',
                        'rounded-xl overflow-hidden border border-white/10',
                        'bg-gradient-to-b from-slate-900/90 to-slate-950/95',
                        'shadow-[0_20px_40px_rgba(0,0,0,0.5)]',
                        'transition-all duration-500',
                        isActive 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-60 scale-[0.88]'
                      )}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                        transformOrigin: 'center center',
                      }}
                      onClick={() => handleItemClick(project)}
                    >
                      {/* Project Image */}
                      <div className="relative w-full h-[80%]">
                        <Image
                          src={project.mockup}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 160px, 200px"
                          className="object-contain"
                          draggable={false}
                          priority={index < 3}
                        />
                      </div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-x-3 bottom-3 p-2.5 md:p-3 rounded-2xl text-center bg-[rgba(6,4,12,0.75)] border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                        <h3 className="text-base md:text-lg font-bold text-primary m-0 whitespace-nowrap overflow-hidden text-ellipsis">{project.title}</h3>
                        <p className="text-sm md:text-sm text-white/80 mt-1 line-clamp-2">{project.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="absolute -bottom-16 md:-bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full border-2 border-primary/30 bg-white dark:bg-[#18191f] hover:bg-primary hover:border-primary hover:text-white shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                {/* Dots indicator */}
                <div className="flex gap-2">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setTargetAngle(index * angleIncrement)}
                      className={cn(
                        'w-2.5 h-2.5 rounded-full transition-all duration-300',
                        index === activeIndex
                          ? 'bg-primary w-6'
                          : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                      )}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full border-2 border-primary/30 bg-white dark:bg-[#18191f] hover:bg-primary hover:border-primary hover:text-white shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Values - Compact */}
        <section className="py-12 md:py-16 relative overflow-hidden">
          {/* Seamless background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />
            <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-amber-500/5 dark:bg-amber-500/3 rounded-full blur-[80px]" />
            <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-emerald-500/5 dark:bg-emerald-500/3 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="page-eyebrow mb-3">
                {t.aboutValuesLabel || 'Що нас відрізняє'}
              </span>
              <h2 className="page-section-heading text-center mb-2">{t.aboutValuesTitle}</h2>
              <p className="page-section-subtitle">
                {t.aboutValuesDesc || 'Принципи, якими ми керуємося у кожному проекті'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group relative"
                  >
                    {/* Glow effect */}
                    <div 
                      className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-40 transition-all duration-500 blur-lg"
                      style={{ background: value.glow }}
                    />
                    
                    <div className="relative p-4 md:p-5 rounded-xl bg-white dark:bg-[#18191f] border border-slate-100 dark:border-white/[0.06] shadow-lg h-full transition-all duration-300 overflow-hidden">
                      {/* Number indicator */}
                      <div className="absolute top-2 right-3 text-4xl font-black opacity-5 group-hover:opacity-10 transition-opacity">
                        0{index + 1}
                      </div>
                      
                      <div className="relative">
                        <motion.div 
                          className={cn(
                            'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-md',
                            value.gradient
                          )}
                          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </motion.div>
                        
                        <h3 className="text-base md:text-lg font-bold text-foreground mb-2">{value.title}</h3>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{value.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEO About Text Block */}
        <section className="py-12 md:py-16 relative">
          {/* Seamless background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="page-section-heading text-center mb-6">
                  {t.aboutSeoTitle}
                </h2>
                <div className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-4">
                  <p>{t.aboutSeoText1}</p>
                  <p>{t.aboutSeoText2}</p>
                  <p>{t.aboutSeoText3}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-10 md:py-14 relative overflow-hidden">
          {/* Seamless background */}
          <div className="absolute inset-0 -z-10">
            {/* Top/bottom fades */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />
            {/* Very subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-violet-500/[0.02]" />
            {/* Soft orbs */}
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/3 dark:bg-primary/2 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-violet-500/3 dark:bg-violet-500/2 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="page-section-heading text-center mb-2">{t.aboutTechTitle}</h2>
              <p className="page-section-subtitle">{t.aboutTechDesc}</p>
            </motion.div>

            {/* Tech Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.08,
                    type: 'spring',
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="group"
                >
                  <div className={cn(
                    'relative p-4 md:p-6 rounded-2xl border border-slate-100 dark:border-white/[0.06] bg-white dark:bg-[#18191f] shadow-md',
                    'flex flex-col items-center justify-center gap-2 h-full min-h-[90px] md:min-h-[100px]',
                    'transition-all duration-300',
                    'hover:shadow-lg hover:border-primary/20'
                  )}>
                    {/* Icon container */}
                    <motion.div 
                      className={cn(
                        'w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center',
                        tech.bgColor
                      )}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image 
                        src={tech.icon} 
                        alt={tech.name}
                        width={28}
                        height={28}
                        className="w-6 h-6 md:w-7 md:h-7 object-contain"
                      />
                    </motion.div>
                    
                    {/* Tech name */}
                    <span className={cn(
                      'text-[10px] md:text-xs font-medium text-center',
                      tech.textClass
                    )}>
                      {tech.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section Commened out */}
      </main>

      {/* Project Modal - Our Design */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-4xl my-8 rounded-3xl bg-white dark:bg-[#18191f] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="max-h-[85vh] overflow-y-auto">
                {/* Header with gradient */}
                <div className="relative p-8 pb-6 bg-gradient-to-br from-primary/10 via-violet-500/10 to-cyan-500/10">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                      <span className="inline-block px-3 py-1.5 rounded-full text-sm font-semibold bg-primary/20 text-primary mb-4">
                        Portfolio
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{selectedProject.title}</h2>
                      <p className="text-lg text-muted-foreground mb-6">{selectedProject.fullDescription}</p>
                      
                      {/* Tech badges with icons */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {selectedProject.tech.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white dark:bg-white/10 text-slate-700 dark:text-white/90 shadow-sm"
                          >
                            {tech === 'HTML' && <Code2 className="w-4 h-4 text-orange-500" />}
                            {tech === 'CSS' && <Palette className="w-4 h-4 text-blue-500" />}
                            {tech === 'JavaScript' && <Zap className="w-4 h-4 text-yellow-500" />}
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Mockup */}
                    <div className="w-full md:w-2/5 relative">
                      <Image
                        src={selectedProject.mockup}
                        alt={selectedProject.title}
                        width={400}
                        height={320}
                        className="w-full h-auto drop-shadow-2xl"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Screenshot */}
                <div className="p-6">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg">
                    <Image
                      src={selectedProject.screenshot}
                      alt={`${selectedProject.title} screenshot`}
                      width={1440}
                      height={900}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
