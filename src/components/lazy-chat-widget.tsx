'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';

const ChatWidgetLazy = dynamic(() =>
  import('@/components/chat-widget').then(mod => ({ default: mod.ChatWidget }))
, { ssr: false, loading: () => null });

export function LazyChatWidget() {
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : (params.locale as string | undefined);
  const t = (translations as any)[locale || 'ua'] || translations.ua;

  useEffect(() => {
    // Delay showing launcher to prioritize LCP
    const showTimeout = setTimeout(() => {
      let frame: number | null = null;

      const updateVisibility = () => {
        const isMobile = window.innerWidth < 768;
        const shouldShow = isMobile ? window.scrollY > 500 : true;
        setShowLauncher((prev) => (prev === shouldShow ? prev : shouldShow));
      };

      const handleScroll = () => {
        if (frame !== null) return;
        frame = window.requestAnimationFrame(() => {
          frame = null;
          updateVisibility();
        });
      };

      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll);
    }, 2000); // Delay 2 seconds after page load

    return () => {
      clearTimeout(showTimeout);
    };
  }, []);

  if (isWidgetVisible) {
    return <ChatWidgetLazy initialView="menu" />;
  }

  if (!showLauncher) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setIsWidgetVisible(true)}
      className="fixed bottom-5 right-5 z-50 h-14 w-14 md:h-16 md:w-16 rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary will-change-transform"
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      aria-label={t.chatMenuTitle || 'Open chat'}
    >
      <MessageSquare className="h-7 w-7 md:h-8 md:w-8 mx-auto" />
    </button>
  );
}







