import dynamic from 'next/dynamic';
import { WebImpulsHeader } from '@/components/layout/web-impuls-header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';

// Lazy load ALL components below the fold for better LCP
const BentoSection = dynamic(() => import('@/components/sections/bento-section').then(mod => ({ default: mod.BentoSection })), { ssr: true });
const ProcessSection = dynamic(() => import('@/components/sections/process-section').then(mod => ({ default: mod.ProcessSection })), { ssr: true });
const PanelShowcaseSection = dynamic(() => import('@/components/sections/panel-showcase-section').then(mod => ({ default: mod.PanelShowcaseSection })), { ssr: true });
const ReviewsSection = dynamic(() => import('@/components/sections/reviews-section').then(mod => ({ default: mod.ReviewsSection })), { ssr: true });
const FAQSection = dynamic(() => import('@/components/sections/faq-section').then(mod => ({ default: mod.FAQSection })), { ssr: true });
const CTASection = dynamic(() => import('@/components/sections/cta-section').then(mod => ({ default: mod.CTASection })), { ssr: true });

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <WebImpulsHeader />
      <main className="flex-1 flex flex-col gap-8 md:gap-12 lg:gap-16 text-foreground">
        <HeroSection />
        <BentoSection />
        <ProcessSection />
        <PanelShowcaseSection />
        <ReviewsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
