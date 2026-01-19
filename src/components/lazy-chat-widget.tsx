'use client';

import type { ComponentType } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';
import type { ChatWidgetView } from '@/components/chat-widget';

type LoadedChatWidget = ComponentType<{ initialView?: ChatWidgetView }>;

export function LazyChatWidget() {
  const [ChatWidget, setChatWidget] = useState<LoadedChatWidget | null>(null);
  const [shouldRenderWidget, setShouldRenderWidget] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hidePlaceholder, setHidePlaceholder] = useState(false);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  const preloadStartedRef = useRef(false);

  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : (params.locale as string | undefined);
  const t = (translations as any)[locale || 'ua'] || translations.ua;

  const loadWidget = useCallback(async () => {
    if (preloadStartedRef.current) return;
    preloadStartedRef.current = true;
    setIsLoading(true);
    try {
      const mod = await import('@/components/chat-widget');
      setChatWidget(() => mod.ChatWidget);
    } catch {
      preloadStartedRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Preload widget code after first paint to make opening feel instant (but keep UI responsive)
    const w = window as any;
    if (typeof w.requestIdleCallback === 'function') {
      const idleId = w.requestIdleCallback(() => void loadWidget(), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(() => void loadWidget(), 900);
    return () => window.clearTimeout(timeoutId);
  }, [loadWidget]);

  // Portal the launcher to <body> to avoid parent transforms affecting fixed positioning.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    setPortalNode(document.body);
  }, []);

  // Once the real widget has created its portal container, we can hide the placeholder launcher.
  useEffect(() => {
    if (!shouldRenderWidget || hidePlaceholder) return;
    let raf = 0;
    const tick = () => {
      const portal = document.getElementById('chat-widget-portal');
      if (portal) {
        setHidePlaceholder(true);
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };
    tick();
    return () => window.cancelAnimationFrame(raf);
  }, [shouldRenderWidget, hidePlaceholder]);

  const handleOpen = () => {
    setPendingOpen(true);
    setShouldRenderWidget(true);
    if (!ChatWidget) {
      void loadWidget();
    }
  };

  const placeholder = (
    <button
      type="button"
      onClick={handleOpen}
      data-chat-trigger
      aria-busy={isLoading ? 'true' : undefined}
      className={[
        'chat-launcher-btn chat-fab h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center will-change-transform relative',
        isLoading ? 'opacity-90' : '',
        pendingOpen && isLoading ? 'animate-pulse' : '',
      ].join(' ')}
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      aria-label={t.chatMenuTitle || 'Open chat'}
    >
      <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-white" />
    </button>
  );

  return (
    <>
      {ChatWidget && shouldRenderWidget ? <ChatWidget initialView={pendingOpen ? 'menu' : 'closed'} /> : null}

      {!hidePlaceholder && (
        portalNode ? createPortal(placeholder, portalNode) : placeholder
      )}
    </>
  );
}
