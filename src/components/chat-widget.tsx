
"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Loader2, User, ArrowRight, Smile, Upload, Clock4, ChevronDown, ArrowLeft, Paperclip, FileText, Download, MoreVertical, Lock, ShieldCheck, Link2, PlusCircle, Trash2, Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// Removed Popover for emojis to keep panel inside chat bounds
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';
import { generateSuggestion, getChatHistory, getLeadStatus, adoptChatSession, resetChatSession, getExistingChatSession } from '@/app/actions';
import { getSupabaseClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { FormattedMessage } from './shared/formatted-message';
import { format } from 'date-fns';
import { LiveChatContent } from './live-chat-widget';
import { LiquidGlass } from '@/components/ui/liquid-glass';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'contact_form' | 'idle_prompt' | 'rating_prompt' | 'secure_confirm' | 'more_help_prompt';
  lang?: 'ua' | 'ru' | 'pl' | 'de' | 'en';
};

export type ChatWidgetView = 'closed' | 'menu' | 'chat' | 'live';

interface ChatWidgetProps {
  initialView?: ChatWidgetView;
}

const WebImpulsChatLogo = ({ className }: { className?: string }) => (
  <Image src="/icons/logo-web.svg" alt="Web Impuls" width={70} height={24} className={`h-5 w-auto ${className || ''}`} />
);

const BotIcon = ({ className }: { className?: string }) => (
  <Image src="/icons/logo-web.svg" alt="Web Impuls Bot" width={90} height={30} className={`h-8 w-auto ${className || ''}`} />
);

const GlassBubble = ({
  children,
  align = 'left',
  className,
  depth = 'soft',
  highlights = false,
  padding = 'px-4 py-3',
}: {
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
  depth?: 'soft' | 'deep';
  highlights?: boolean;
  padding?: string;
}) => (
  <LiquidGlass
    className={cn(
      'max-w-[85%] rounded-[26px] border border-white/10 shadow-[0_24px_60px_rgba(5,6,20,0.55)]',
      align === 'right' && 'ml-auto',
      className
    )}
    rounded="3xl"
    blurRadius={30}
    depth={depth}
    highlights={highlights}
  >
    <div className={cn('relative z-[5]', padding)}>{children}</div>
  </LiquidGlass>
);



const WidgetFooter = () => (
  <div className="chat-widget-footer pt-2">
    <span>Powered by</span>
    <a href="#" className="transition-colors hover:text-white text-white/80 inline-flex items-center gap-1">
      <WebImpulsChatLogo className="h-5 w-auto opacity-90" />
    </a>
  </div>
);

// Функція перевірки робочих годин (Європейський час CET/CEST)
function isWorkingHours(): boolean {
  const now = new Date();
  // Конвертуємо в європейський час (Warsaw/Berlin timezone)
  const europeTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }));
  const hours = europeTime.getHours();
  const day = europeTime.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Робочі години: Пн-Пт, 9:00-18:00
  const isWeekday = day >= 1 && day <= 5;
  const isWorkingTime = hours >= 9 && hours < 18;
  
  return isWeekday && isWorkingTime;
}

// Меню віджета: показуємо бейдж з непрочитаними
const MenuContent = forwardRef<HTMLDivElement, { onNavigate: (view: ChatWidgetView, source?: 'ai_button' | 'menu') => void, onClose: () => void, unread?: number }>(({ onNavigate, onClose, unread = 0 }, ref) => {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(isWorkingHours());
  }, []);

  const contactItems = [
    { icon: '/img-chat/telegram.svg', title: 'Telegram', href: "https://t.me/oleksiy_zhyvotivskyi" },
    { icon: '/img-chat/viber.svg', title: 'Viber', href: "viber://chat?number=%2B48512686628" },
    { icon: '/img-chat/massanger.svg', title: 'Messenger', href: "https://m.me/61559794323482" },
  ];
  const workingHours = (process.env.NEXT_PUBLIC_WORKING_HOURS as string) || t.chatWorkingHours;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="chat-widget-card-menu"
      onClick={(e) => e.stopPropagation()}
      style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', willChange: 'transform, opacity' }}
    >
      <LiquidGlass
        className="w-full h-full flex flex-col shadow-[0_35px_90px_rgba(5,6,20,0.65)] overflow-hidden sm:rounded-[32px] border border-white/15 bg-gradient-to-br from-[#0d0a16]/92 to-[#1a102e]/88"
        rounded="none"
        highlights
        blurRadius={38}
      >
        <div
          className="menu-header p-5"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.25rem)' }}
        >
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-lg md:text-xl text-white">{t.chatMenuTitle}</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
              <ChevronDown className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs">
            {isOnline ? (
              <>
                <div className="flex items-center gap-1.5 text-white/90">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {t.chatOnline || 'Online'}
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-1 text-white/90">
                  <Clock4 className="h-3 w-3" />
                  {workingHours}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-white/90">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                  {t.chatOffline || 'Offline'}
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <Clock4 className="h-3.5 w-3.5" />
                  {t.chatBackTomorrow || 'Back tomorrow at 9:00'}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3 mt-[-10px]">
          <p className="text-sm font-semibold text-foreground px-1">{t.chatMessengerTitle}</p>
          <div className="grid grid-cols-3 gap-3">
            {contactItems.map((item, index) => (
              <LiquidGlass key={index} className="rounded-2xl" rounded="2xl" highlights>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center p-3 flex flex-col items-center gap-2"
                >
                  <Image src={item.icon} alt={item.title} width={32} height={32} className="h-8 w-8" />
                  <p className="font-semibold text-sm">{item.title}</p>
                </a>
              </LiquidGlass>
            ))}
          </div>

          <LiquidGlass
            className="w-full rounded-2xl cursor-pointer relative"
            rounded="2xl"
            highlights
            onClick={() => onNavigate('chat')}
          >
            <div className="w-full text-left p-3 flex items-center gap-3">
              <div className="p-2 rounded-2xl">
                <BotIcon className="h-7 w-auto text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{t.chatMenuAiTitle}</p>
                <p className="text-xs text-muted-foreground">{t.chatMenuAiDesc}</p>
              </div>
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center shadow">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </LiquidGlass>

          {/* Live support button */}
          <LiquidGlass
            className="w-full rounded-2xl cursor-pointer border border-purple-500/20 group"
            rounded="2xl"
            highlights
            onClick={() => onNavigate('live')}
          >
            <div className="w-full text-left p-3 flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-purple-500/25">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{t.chatLiveSupport || 'Онлайн підтримка'}</p>
                <p className="text-xs text-muted-foreground">
                  {isOnline 
                    ? (t.chatLiveOnline || 'Відповідаємо миттєво') 
                    : (t.chatLiveOffline || 'Залиште повідомлення')}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {isOnline ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500"></span>
                  </span>
                ) : (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                  </span>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </LiquidGlass>

          <Button variant="link" asChild className="text-sm">
            <Link href={`/${locale}/pricing`}>{t.chatMenuPricingTitle}</Link>
          </Button>
        </div>
        <div className="px-4 pb-4 pt-0 mt-auto w-full">
          <WidgetFooter />
        </div>
      </LiquidGlass>
    </motion.div>
  );
});
MenuContent.displayName = 'MenuContent';

// Heuristic per-message language detection for ua/ru/pl/de/en
const detectMessageLocale = (
  text: string,
  fallback: 'ua' | 'ru' | 'pl' | 'de' | 'en' = 'ua'
): 'ua' | 'ru' | 'pl' | 'de' | 'en' => {
  const s = (text || '').toLowerCase();
  if (!s.trim()) return fallback;

  const hasCyr = /[\u0400-\u04FF]/.test(s);
  const scores: Record<'ua' | 'ru' | 'pl' | 'de' | 'en', number> = {
    ua: 0,
    ru: 0,
    pl: 0,
    de: 0,
    en: 0,
  };

  if (hasCyr) {
    if (/[їєіґ]/.test(s)) scores.ua += 3;
    if (/[ыэёъ]/.test(s)) scores.ru += 3;
    if (/(привіт|будь\s+ласка|скільки|ціна|вартіст|доброго\s+дня)/.test(s)) scores.ua += 2;
    if (/(привет|какие|цена|стоимость|у\s+вас|можно|здравствуйте)/.test(s)) scores.ru += 2;
    if (/[і]/.test(s) && !/[ыэёъ]/.test(s)) scores.ua += 1;
  } else {
    if (/[ąćęłńóśżź]/.test(s)) scores.pl += 3;
    if (/(czy|jest|moż|zniżk|cena|stron|witam|proszę|dzięk)/.test(s)) scores.pl += 2;
    if (/[äöüß]/.test(s)) scores.de += 3;
    if (/(und|ich|wie|sie|möchte|möchten|weiter|danke|hallo|preis|seite|unternehmen|zeitrahmen)/.test(s)) scores.de += 2;
    if (/(what|how|price|budget|timeline|site|website|landing|discount|possible|thanks|hello|hi)/.test(s)) scores.en += 2;
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return (best && best[1] > 0 ? (best[0] as any) : fallback) as any;
};

const isEmojiOnly = (s: string) => {
  const trimmed = s.trim();
  if (!trimmed) return false;
  const cleaned = trimmed.replace(/(\uFE0F|\u200D|\u{1F3FB}|\u{1F3FC}|\u{1F3FD}|\u{1F3FE}|\u{1F3FF})+/gu, '');
  if (/[0-9A-Za-z\u0400-\u04FF]/u.test(cleaned)) return false;
  return Array.from(cleaned).length <= 5;
};

const ChatContent = forwardRef<HTMLDivElement, { onNavigate: (view: ChatWidgetView, source?: 'ai_button' | 'menu') => void, onClose: () => void, onAssistantMessage?: (p: { content: string }) => void, onUserSend?: () => void, isMuted: boolean, onMuteToggle: () => void }>(({ onNavigate, onClose, onAssistantMessage, onUserSend, isMuted, onMuteToggle }, ref) => {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale as string;
  const t = (translations as any)[locale] || translations.ua;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [contactValue, setContactValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [hasLead, setHasLead] = useState(false);
  const [leadEmail, setLeadEmail] = useState<string | null>(null);
  const [leadPhone, setLeadPhone] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  
  // Check if there's a pending contact form that needs to be filled
  const hasPendingContactForm = !hasLead && messages.some(m => m.type === 'contact_form' || m.content === '::contact_form::');
  const [emojiOpen, setEmojiOpen] = useState(false);
  const idleTimerRef = useRef<number | null>(null);
  const idlePromptShownRef = useRef(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollViewportRef = useRef<HTMLElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const scrollFrameRef = useRef<number | null>(null);

  const getScrollViewport = useCallback(() => {
    if (scrollViewportRef.current) return scrollViewportRef.current;
    const root = scrollAreaRef.current;
    if (!root) return null;
    const viewport = root.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
    if (viewport) scrollViewportRef.current = viewport;
    return viewport;
  }, []);

  const updateShouldAutoScroll = useCallback((viewport: HTMLElement) => {
    const distanceFromBottom = viewport.scrollHeight - (viewport.scrollTop + viewport.clientHeight);
    shouldAutoScrollRef.current = distanceFromBottom < 80;
  }, []);

  const scrollToBottom = useCallback((opts?: { force?: boolean }) => {
    const viewport = getScrollViewport();
    if (!viewport) return;
    if (!opts?.force && !shouldAutoScrollRef.current) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [getScrollViewport]);

  const scheduleScrollToBottom = useCallback((opts?: { force?: boolean }) => {
    if (typeof window === 'undefined') return;
    if (scrollFrameRef.current != null) return;
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      scrollToBottom(opts);
    });
  }, [scrollToBottom]);

  // Track whether user is pinned to the bottom (so we don't "fight" their scroll)
  useEffect(() => {
    const viewport = getScrollViewport();
    if (!viewport) return;
    const onScroll = () => updateShouldAutoScroll(viewport);
    onScroll();
    viewport.addEventListener('scroll', onScroll, { passive: true });
    return () => viewport.removeEventListener('scroll', onScroll);
  }, [getScrollViewport, updateShouldAutoScroll]);

  // Keep bottom pinned through iOS keyboard / visual viewport resizes (only if already at bottom)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => scheduleScrollToBottom();
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [scheduleScrollToBottom]);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      if (scrollFrameRef.current != null) window.cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);
  
  // Cross-device adoption: if URL contains ?chat=<id> (or ?c=<id>), adopt that session
  useEffect(() => {
    (async () => {
      try {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        const urlChat = url.searchParams.get('chat') || url.searchParams.get('c');
        if (urlChat && /^[0-9a-fA-F-]{10,}$/.test(urlChat)) {
          try {
            const res = await adoptChatSession(urlChat);
            if (res?.success) {
              try { localStorage.setItem('web_impuls_chat_id', urlChat); } catch {}
              setChatId(urlChat);
              // Clean URL (remove chat param) to avoid re-adoption on refresh
              url.searchParams.delete('chat');
              url.searchParams.delete('c');
              const clean = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '') + url.hash;
              window.history.replaceState({}, '', clean);

              // Refresh lead status and history immediately for adopted chat
              try {
                const s = await getLeadStatus();
                if (s?.success && s.data) {
                  setHasLead(s.data.hasLead);
                  setLeadEmail(s.data.email || null);
                  setLeadPhone(s.data.phone || null);
                }
              } catch {}
              try {
                const resH = await getChatHistory(locale as any);
                if (resH?.success && resH.data) {
                  // If chat was cleared from DB, reset local state
                  if ((resH.data as any).needsReset) {
                    setMessages([]);
                    setChatId(null);
                    try { localStorage.removeItem('web_impuls_chat_id'); } catch {}
                    setHistoryLoaded(true);
                    return;
                  }
                  const rows: any[] = resH.data.messages || [];
                  const history: ChatMessage[] = [];
                  for (const row of rows) {
                    // Skip feedback markers from DB
                    if (row.role === 'assistant' && (row.content === '::feedback_up::' || row.content === '::feedback_down::')) {
                      continue;
                    }
                    if (row.role === 'assistant' && row.content === '::contact_form::') {
                      const lastUser = [...history].reverse().find((x) => x.role === 'user');
                      const inferred = lastUser ? detectMessageLocale(lastUser.content, (locale as any) || 'ua') : (locale as any);
                      for (let i = history.length - 1; i >= 0; i--) {
                        const h = history[i] as any;
                        if (h.type === 'contact_form' || (h.role === 'assistant' && h.content === '::contact_form::')) history.splice(i, 1);
                      }
                      history.push({ role: 'assistant', content: '', type: 'contact_form', lang: inferred as any, timestamp: new Date(row.created_at).toISOString() });
                      continue;
                    }
                    history.push({ role: row.role as 'user' | 'assistant', content: row.content, timestamp: new Date(row.created_at).toISOString() });
                  }
                  if (history.length > 0) setMessages(history);
                  setHistoryLoaded(true);
                }
              } catch {}
            }
          } catch {}
        }
      } catch {}
    })();
  }, []);
  const sendQuick = (text: string) => {
    try { onUserSend?.(); } catch {}
    setInput(text);
    // Дочекаємось оновлення стану і відправимо
    setTimeout(() => handleFormSubmit(), 0);
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useLayoutEffect(() => {
    scheduleScrollToBottom();
  }, [emojiOpen, scheduleScrollToBottom]);

  // Removed additional scrollIntoView on focus to avoid extra jumps on iOS

  // Load persisted history on mount (fast path with cache, avoid creating chat needlessly)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getExistingChatSession } = await import('@/app/actions');
        // 1) Fast path: if localStorage already has chat id (e.g., after proactive greet),
        //    render from cache or optimistically immediately, and refresh in background.
        const fastId = typeof window !== 'undefined' ? localStorage.getItem('web_impuls_chat_id') : null;
        if (fastId) {
          setChatId(fastId);
          let painted = false;
          // Try session cache
          try {
            const raw = sessionStorage.getItem(`chat_cache_${fastId}`);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed?.messages) && parsed.messages.length > 0) {
                setMessages(parsed.messages as ChatMessage[]);
                setHistoryLoaded(true);
                painted = true;
              }
            }
          } catch {}
          if (!painted) {
            // Optimistic paint: only greeting, no form until user writes first message
            const optimistic: ChatMessage[] = [
              { role: 'assistant', content: t.chatWelcome ?? 'Привіт! 👋 Я ваш AI‑помічник Web Impuls. Чим можу допомогти?', timestamp: new Date().toISOString() },
            ];
            setMessages(optimistic);
            setHistoryLoaded(true);
          }
          // adopt and refresh in background (do not block UI)
          try { await adoptChatSession(fastId); } catch {}
          const res = await getChatHistory(locale);
          if (!cancelled && res.success && res.data) {
            // If chat was cleared from DB, reset local state
            if ((res.data as any).needsReset) {
              setMessages([]);
              setChatId(null);
              try { localStorage.removeItem('web_impuls_chat_id'); } catch {}
              try { sessionStorage.removeItem(`chat_cache_${fastId}`); } catch {}
              return;
            }
            const rows: any[] = res.data.messages || [];
            const history: ChatMessage[] = [];
            for (const row of rows) {
              // Skip feedback markers from DB
              if (row.role === 'assistant' && (row.content === '::feedback_up::' || row.content === '::feedback_down::')) {
                continue;
              }
              if (row.role === 'assistant' && row.content === '::contact_form::') {
                const lastUser = [...history].reverse().find((x) => x.role === 'user');
                const inferred = lastUser ? detectMessageLocale(lastUser.content, (locale as any) || 'ua') : (locale as any);
                for (let i = history.length - 1; i >= 0; i--) {
                  const h = history[i] as any;
                  if (h.type === 'contact_form' || (h.role === 'assistant' && h.content === '::contact_form::')) history.splice(i, 1);
                }
                history.push({ role: 'assistant', content: '', type: 'contact_form', lang: inferred as any, timestamp: new Date(row.created_at).toISOString() });
                continue;
              }
              history.push({ role: row.role as 'user' | 'assistant', content: row.content, timestamp: new Date(row.created_at).toISOString() });
            }
            if (history.length > 0) setMessages(history);
          }
          return;
        }

        // 2) No local chat id: check existing cookie-based session (non-blocking fast exit if none)
        const existingRes = await getExistingChatSession();
        if (cancelled) return;
        const existingId = existingRes.success ? existingRes.data?.chatId : null;
        if (!existingId) {
          setHistoryLoaded(true);
          return;
        }

        // 3) With existing id (cookie), still go via cache/optimistic
        setChatId(existingId);
        try { localStorage.setItem('web_impuls_chat_id', existingId); } catch {}
        let hydratedFromCache = false;
        try {
          const raw = sessionStorage.getItem(`chat_cache_${existingId}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed?.messages) && parsed.messages.length > 0) {
              setMessages(parsed.messages as ChatMessage[]);
              setHistoryLoaded(true);
              hydratedFromCache = true;
            }
          }
        } catch {}
        if (!hydratedFromCache) {
          // Only greeting, no form until user writes first message
          const optimistic: ChatMessage[] = [
            { role: 'assistant', content: t.chatWelcome ?? 'Привіт! 👋 Я ваш AI‑помічник Web Impuls. Чим можу допомогти?', timestamp: new Date().toISOString() },
          ];
          setMessages(optimistic);
          setHistoryLoaded(true);
        }

        // 4) Refresh from server in background
        const res = await getChatHistory(locale);
        if (cancelled) return;
        if (res.success && res.data) {
          const rows: any[] = res.data.messages || [];
          const history: ChatMessage[] = [];
          for (const row of rows) {
            // Skip feedback markers from DB - they should not be persisted
            if (row.role === 'assistant' && (row.content === '::feedback_up::' || row.content === '::feedback_down::')) {
              continue;
            }
            if (row.role === 'assistant' && row.content === '::contact_form::') {
              const lastUser = [...history].reverse().find((x) => x.role === 'user');
              const inferred = lastUser ? detectMessageLocale(lastUser.content, (locale as any) || 'ua') : (locale as any);
              for (let i = history.length - 1; i >= 0; i--) {
                const h = history[i] as any;
                if (h.type === 'contact_form' || (h.role === 'assistant' && h.content === '::contact_form::')) history.splice(i, 1);
              }
              history.push({ role: 'assistant', content: '', type: 'contact_form', lang: inferred as any, timestamp: new Date(row.created_at).toISOString() });
              continue;
            }
            history.push({ role: row.role as 'user' | 'assistant', content: row.content, timestamp: new Date(row.created_at).toISOString() });
          }
          const cid = (res.data as any).chatId || existingId;
          setChatId(cid);
          try { if (cid) localStorage.setItem('web_impuls_chat_id', cid); } catch {}
          if (history.length > 0) {
            setMessages(history);
          }
        }
        setHistoryLoaded(true);
      } catch (e) {
        console.error('Failed to load chat history', e);
        setHistoryLoaded(true);
      }
    })();
    (async () => {
      try {
        const s = await getLeadStatus();
        if (!cancelled && s.success && s.data) {
          setHasLead(s.data.hasLead);
          setLeadEmail(s.data.email || null);
          setLeadPhone(s.data.phone || null);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Якщо немає ліда — показуємо оверлей та локальне привітання (без записів у стрічку)
  useEffect(() => {
    // no-op: оверлей керується станом hasLead
  }, [hasLead, locale]);

  // Helper to add unique messages by role+content to avoid RT duplicates
  const addUniqueMessage = (list: ChatMessage[], msg: ChatMessage) => {
    const exists = list.some((m) => m.role === msg.role && m.content === msg.content);
    return exists ? list : [...list, msg];
  };

  // Cache messages per chat id for instant reopen
  useEffect(() => {
    try {
      if (!chatId) return;
      const payload = { messages: messages.slice(-100) };
      sessionStorage.setItem(`chat_cache_${chatId}`, JSON.stringify(payload));
    } catch {}
  }, [messages, chatId]);

  // Realtime sync for this chat
  useEffect(() => {
    if (!chatId) return;
    const supabase = getSupabaseClient();
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        const m: any = payload.new;
        let newMsg: ChatMessage;
        if (m.role === 'assistant' && m.content === '::contact_form::') {
          // Derive language from the last user message in current state
          let inferred: any = (locale as any);
          try {
            const lastUser = [...messages].reverse().find((x) => x.role === 'user');
            if (lastUser) inferred = detectMessageLocale(lastUser.content, (locale as any) || 'ua');
          } catch {}
          newMsg = { role: 'assistant', content: '', type: 'contact_form', lang: inferred, timestamp: new Date(m.created_at).toISOString() };
        } else {
          newMsg = { role: m.role, content: m.content, timestamp: new Date(m.created_at).toISOString() } as ChatMessage;
        }
        setMessages((prev) => {
          // If contact_form incoming, drop any existing form artifacts, then add once
          const next = (newMsg.type === 'contact_form') ? prev.filter((x: any) => x.type !== 'contact_form' && !(x.role === 'assistant' && x.content === '::contact_form::')) : [...prev];
          const dup = next.some((x) => x.role === newMsg.role && x.content === newMsg.content && (x.type || undefined) === (newMsg.type || undefined));
          if (!dup) {
            if (newMsg.role === 'assistant') {
              try { onAssistantMessage?.({ content: newMsg.content || (newMsg.type || 'assistant') }); } catch {}
            }
            return [...next, newMsg];
          }
          return next;
        });
      })
      .subscribe();

    return () => {
      try { supabase.removeChannel(channel); } catch {}
    };
  }, [chatId]);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const maxHeight = 96;
    if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
    } else {
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
    }
    scheduleScrollToBottom();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    resizeTextarea();
    resetIdleTimer();
  };

  const handleFormSubmit = async () => {
    if (!input.trim() || isLoading) return;

    // User explicitly sent a message: always pin back to bottom.
    shouldAutoScrollRef.current = true;

    // Notify parent to play send sound (audio lives in parent)
    try { onUserSend?.(); } catch {}

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    scheduleScrollToBottom({ force: true });
    resetIdleTimer(); // no-op (idle disabled)

    // Якщо контакту ще немає — показуємо тільки інлайн-форму (ім'я + email/телефон)
    if (!hasLead && !messages.some(m => m.type === 'contact_form' || m.content === '::contact_form::')) {
      try {
        // Збережемо повідомлення користувача в БД, щоб друга вкладка одразу його побачила
        const { appendUserMessage } = await import('@/app/actions');
        await appendUserMessage(input);
      } catch (e) { /* не критично для UI */ }
      // Показуємо форму на мові останнього повідомлення (fallback — поточна локаль)
      const formLang = detectMessageLocale ? detectMessageLocale(input, (locale as any) ?? 'ua') : (locale as any);
      const formMsg: ChatMessage = { role: 'assistant', content: '', timestamp: new Date().toISOString(), type: 'contact_form', lang: formLang };
      setMessages(prev => [...prev, formMsg]);
      // Також збережемо маркер форми в БД, щоб після перезавантаження вона відобразилась
      try {
        const { insertAssistantMessage } = await import('@/app/actions');
        await insertAssistantMessage('::contact_form::');
      } catch {}
      return;
    }

    // Встановимо флаг, що вітання вже було — щоб уникнути повторної розсилки після активності користувача
    try {
      const keyPrefix = chatId ? `chat_${chatId}` : null;
      if (keyPrefix) localStorage.setItem(`${keyPrefix}_greet_sent`, '1');
    } catch {}

    setIsLoading(true);

    try {
      const result = await generateSuggestion({
        query: input,
        chatHistory: messages.map(m => ({ role: m.role, content: m.content })),
        locale: detectMessageLocale(input, (locale as any) ?? 'ua'),
      });

      setIsLoading(false);

      if (result.success && result.data?.response) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: result.data.response,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => {
          const next = addUniqueMessage(prev, assistantMessage);
          // If assistant provided contact links OR said goodbye, append follow-up prompt
          try {
            const txt = assistantMessage.content || '';
            const hasLinks = /t\.me\/|viber:\/\/chat\?number=|m\.me\//i.test(txt);
            // Detect goodbye phrases in AI response
            const isGoodbye = /до побачення|до зустрічі|радий допомогти|auf wiedersehen|goodbye|bye|do widzenia|dziękuję za rozmowę|дякую за розмову/i.test(txt);
            const already = next.some((m) => (m as any).type === 'more_help_prompt' || (m as any).type === 'rating_prompt' || m.content === '::feedback_up::' || m.content === '::feedback_down::');
            
            if ((hasLinks || isGoodbye) && !already && !ratingAfterContactShownRef.current && !feedbackGiven) {
              ratingAfterContactShownRef.current = true;
              return [...next, { role: 'assistant', content: '', type: 'more_help_prompt', timestamp: new Date().toISOString() } as ChatMessage];
            }
          } catch {}
          return next;
        });
        try { onAssistantMessage?.({ content: assistantMessage.content }); } catch {}
        // Більше не додаємо форму автоматично тут
      } else {
        const errorMessage = result.error || "AI returned an empty or invalid response.";
         toast({
          variant: "destructive",
          title: t.errorTitle,
          description: errorMessage,
        });
        const errorAssistantMessage: ChatMessage = {
          role: 'assistant',
          content: `${t.errorTitle}: ${errorMessage}`,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => addUniqueMessage(prev, errorAssistantMessage));
      }
    } catch (error) {
       setIsLoading(false);
       console.error("Error submitting message:", error);
       const errorMessage = error instanceof Error ? error.message : t.errorTitle;
       
       toast({
         variant: "destructive",
         title: t.errorTitle,
         description: errorMessage,
       });
       const errorAssistantMessage: ChatMessage = {
         role: 'assistant',
         content: `${t.errorTitle}: ${errorMessage}`,
         timestamp: new Date().toISOString(),
       };
       setMessages(prev => addUniqueMessage(prev, errorAssistantMessage));
    }
  };

  // Idle prompt after 5 minutes without user activity inside chat
  const resetIdleTimer = () => {
    // Idle prompts disabled per new logic
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;
  };

  useEffect(() => {
    resetIdleTimer();
    return () => { if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = async (format: 'txt' | 'json' | 'md' | 'html') => {
    try {
      const url = `/api/chat/export?format=${format}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) {
        console.error('Export failed', await res.text());
        return;
      }
      const disp = res.headers.get('content-disposition') || '';
      const match = /filename="?([^";]+)"?/i.exec(disp || '');
      const filename = match ? match[1] : `chat-export.${format === 'md' ? 'md' : format}`;
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const handleSaveContact = async (preferredLang?: 'ua' | 'ru' | 'pl' | 'de' | 'en') => {
    if (!contactValue.trim()) return;
    try {
      const { saveLeadDetails } = await import('@/app/actions');
      const res = await saveLeadDetails({ name: nameValue, contact: contactValue, locale: preferredLang || (locale as any) });
      if (res.success) {
        // Якщо сесію прийнято за збігом e‑mail/телефону — оновимо локальні стани та підтягнемо історію
        if ((res as any).data?.adopted && (res as any).data?.chatId) {
          try {
            const adoptedId = (res as any).data.chatId as string;
            setChatId(adoptedId);
            try { localStorage.setItem('web_impuls_chat_id', adoptedId); } catch {}
            const { getChatHistory } = await import('@/app/actions');
            const h = await getChatHistory(locale);
            if (h.success && h.data) {
              const rows: any[] = h.data.messages || [];
              const history: ChatMessage[] = [];
              for (const row of rows) {
                // Skip feedback markers from DB
                if (row.role === 'assistant' && (row.content === '::feedback_up::' || row.content === '::feedback_down::')) {
                  continue;
                }
                if (row.role === 'assistant' && row.content === '::contact_form::') {
                  const lastUser = [...history].reverse().find((x) => x.role === 'user');
                  const inferred = lastUser ? detectMessageLocale(lastUser.content, (locale as any) || 'ua') : (locale as any);
                  for (let i = history.length - 1; i >= 0; i--) {
                    const h = history[i] as any;
                    if (h.type === 'contact_form' || (h.role === 'assistant' && h.content === '::contact_form::')) history.splice(i, 1);
                  }
                  history.push({ role: 'assistant', content: '', type: 'contact_form', lang: inferred as any, timestamp: new Date(row.created_at).toISOString() });
                  continue;
                }
                history.push({ role: row.role as 'user' | 'assistant', content: row.content, timestamp: new Date(row.created_at).toISOString() });
              }
              if (history.length > 0) setMessages(history);
              setHistoryLoaded(true);
            }
          } catch (e) {
            console.error('adopt history load failed', e);
          }
        }
        setContactValue('');
        setNameValue('');
        toast({
          title: t.chatConfirmThanks,
          description: t.chatConfirmSaved
        });
        setHasLead(true);
        // Оновлюємо локальні поля email/phone, щоб не просити зайве
        const v = contactValue.trim();
        if (v.includes('@')) setLeadEmail(v);
        if (!v.includes('@')) setLeadPhone(v);
        // Прибираємо форму і додаємо підтвердження у стрічку (картка з щитом)
        setMessages(prev => prev.filter(m => m.type !== 'contact_form'));
        // Якщо НЕ було adoption — додамо локальне підтвердження+вітання; при adoption історію вже підтягуємо
        if (!((res as any).data?.adopted)) {
          const confirmMsg: ChatMessage = { role: 'assistant', content: '', type: 'secure_confirm', timestamp: new Date().toISOString(), lang: preferredLang || (locale as any) };
          const firstName = (nameValue || '').trim().split(/\s+/)[0] || '';
          const langForHello = preferredLang || (locale as any);
          const helloText = firstName
            ? t.chatHelloName.replace('{name}', firstName)
            : t.chatHello;
          const helloMsg: ChatMessage = { role: 'assistant', content: helloText, timestamp: new Date().toISOString() };
          setMessages(prev => addUniqueMessage(addUniqueMessage(prev, confirmMsg), helloMsg));
          try { onAssistantMessage?.({ content: 'secure_confirm' }); } catch {}
          try { onAssistantMessage?.({ content: helloText }); } catch {}
        }
      } else {
        toast({
          variant: 'destructive',
          title: t.errorTitle,
          description: res.error || t.chatErrorInvalidContact,
        });
      }
    } catch (e) {
      console.error('save contact failed', e);
      toast({
        variant: 'destructive',
        title: t.errorTitle,
        description: t.formErrorGeneral,
      });
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  const topEmojis = ["👍","❤️","😂","🙏","😊","🎉","🤔","😢","😍","👏","🔥","🚀","💯","✅","😭","✨","🤷‍♂️","🤯","😴","👋","😎","💪","🥳","💔","😏"];

  const onEmojiClick = (emoji: string) => {
    setInput(prev => (prev ?? '') + emoji);
    setEmojiOpen(false);
    requestAnimationFrame(() => {
      resizeTextarea();
      textareaRef.current?.focus();
    });
  };

  // Detect contact links inside assistant text to render social buttons
  const hasContactLinks = (text: string) => {
    const t = text.toLowerCase();
    return (
      t.includes('t.me/oleksiy_zhyvotivskyi') ||
      t.includes('viber://chat?number') ||
      t.includes('m.me/61559794323482')
    );
  };

  // Inject follow-up prompt after assistant shares contact links OR says goodbye
  const ratingAfterContactShownRef = useRef(false);
  useEffect(() => {
    try {
      if (ratingAfterContactShownRef.current) return;
      const lastAssistIdx = [...messages].map((m, i) => ({ m, i })).reverse().find(x => x.m.role === 'assistant');
      if (!lastAssistIdx) return;
      const { m, i } = lastAssistIdx;
      if (!m || !m.content) return;
      
      const hasLinks = hasContactLinks(m.content);
      const isGoodbye = /до побачення|до зустрічі|радий допомогти|auf wiedersehen|goodbye|bye|do widzenia|dziękuję za rozmowę|дякую за розмову/i.test(m.content);
      
      if (!hasLinks && !isGoodbye) return;
      
      const hasFollowUp = messages.slice(i + 1).some((mm:any) => mm.type === 'more_help_prompt' || mm.type === 'rating_prompt' || mm.content === '::feedback_up::' || mm.content === '::feedback_down::');
      if (hasFollowUp || feedbackGiven) return;
      ratingAfterContactShownRef.current = true;
      setMessages(prev => [...prev, { role: 'assistant', content: '', type: 'more_help_prompt', timestamp: new Date().toISOString() }]);
    } catch {}
  }, [messages, feedbackGiven]);

  // Remove raw links and any label-only lines when we show pretty buttons
  const stripContactLinks = (text: string) => {
    let s = text;
    const patterns = [
      /(telegram\s*:\s*)?https?:\/\/t\.me\/[^\s|]+/gi,
      /(viber\s*:\s*)?viber:\/\/chat\?number=[^\s|]+/gi,
      /(messenger\s*:\s*)?https?:\/\/m\.me\/[^\s|]+/gi,
    ];
    for (const p of patterns) s = s.replace(p, '');
    // Normalize separators
    s = s.replace(/\s*\|\s*/g, ' ').replace(/\s{2,}/g, ' ');
    const isLabelOnly = (line: string) => /^(?:[*•\-]\s*)?(telegram|viber|messenger|contacts|контакти|контакты)\s*:?\s*$/i.test(line.trim());
    const lines = s
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !hasContactLinks(line) && !isLabelOnly(line) && line !== '*' && line !== '—');
    // Collapse extra empty lines that may appear after stripping
    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  };

  // Check if AI message is offering to connect to operator (not just any mention)
  // Must contain specific phrases that indicate the AI is OFFERING the connection
  const mentionsOperator = (text: string) => {
    const t = (text || '').toLowerCase();
    // Only trigger when AI explicitly offers connection - look for key phrases
    const offerPhrases = [
      'кнопку нижче',           // UA: button below
      'натисніть кнопку',       // UA: press button  
      'з\'єднатися з оператором', // UA: connect with operator
      'підключити оператора',   // UA: connect operator
      'click the button below', // EN
      'connect with.*operator', // EN
      'kliknij przycisk',       // PL
      'połączyć.*operator',     // PL
      'klicken.*schaltfläche',  // DE
      'verbinden.*operator',    // DE
    ];
    return offerPhrases.some(phrase => new RegExp(phrase, 'i').test(t));
  };

  // Check if it's working hours
  const checkWorkingHours = () => {
    const now = new Date();
    const europeTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }));
    const hours = europeTime.getHours();
    const day = europeTime.getDay();
    const isWeekday = day >= 1 && day <= 5;
    const isWorkingTime = hours >= 9 && hours < 18;
    return isWeekday && isWorkingTime;
  };

  const ContactButtons = ({ showLiveChat = false }: { showLiveChat?: boolean }) => {
    const isOnline = checkWorkingHours();
    
    return (
      <div className="mt-4 flex flex-col gap-3">
        {/* Live Chat Button - prominent when operator is mentioned */}
        {showLiveChat && (
          <>
            <button
              onClick={() => onNavigate('live', 'ai_button')}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-semibold hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 transition-all shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{isOnline ? 'Підключити оператора' : 'Написати оператору'}</span>
            </button>
            {!isOnline && (
              <p className="text-xs text-center text-muted-foreground/80 px-4 leading-relaxed">
                Пн-Пт, 9:00-18:00 · Напишіть зараз — відповімо завтра!
              </p>
            )}
          </>
        )}
        
        {/* Messenger buttons - clean, no borders */}
        <div className="flex flex-wrap justify-center gap-2">
          <a 
            href="https://t.me/oleksiy_zhyvotivskyi" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 transition-all hover:scale-105"
          >
            <Image src="/img-chat/telegram.svg" alt="Telegram" width={18} height={18} />
            <span className="text-sm font-medium text-white/90">Telegram</span>
          </a>
          <a 
            href="viber://chat?number=%2B48512686628" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 transition-all hover:scale-105"
          >
            <Image src="/img-chat/viber.svg" alt="Viber" width={18} height={18} />
            <span className="text-sm font-medium text-white/90">Viber</span>
          </a>
          <a 
            href="https://m.me/61559794323482" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 transition-all hover:scale-105"
          >
            <Image src="/img-chat/massanger.svg" alt="Messenger" width={18} height={18} />
            <span className="text-sm font-medium text-white/90">Messenger</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="chat-widget-card relative"
      onClick={(e) => e.stopPropagation()}
      style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden', willChange: 'transform, opacity' }}
    >
      <LiquidGlass className="w-full h-full flex flex-col bg-transparent shadow-none border-none rounded-none sm:rounded-[32px]" rounded="none" highlights blurRadius={36}>
        <div
          className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#c084fc] text-white rounded-t-none sm:rounded-t-[28px]"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('menu')}
              className="h-8 w-8 text-primary-foreground hover:bg-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded-full flex items-center justify-center">
                <BotIcon className="h-5 w-auto" />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <h3 className="text-sm md:text-lg font-semibold leading-tight whitespace-nowrap">
                  AI Web Impuls
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {t.chatAiOnline247 || 'Online 24/7'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Export menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                  title="Download history"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[10001] rounded-lg border bg-card text-card-foreground p-1 shadow-xl">
                <DropdownMenuItem className="rounded-md px-3 py-2 focus:bg-muted" onClick={() => handleDownload('html')}>HTML</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md px-3 py-2 focus:bg-muted" onClick={() => handleDownload('md')}>Markdown</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md px-3 py-2 focus:bg-muted" onClick={() => handleDownload('txt')}>TXT</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md px-3 py-2 focus:bg-muted" onClick={() => handleDownload('json')}>JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                  title="Chat settings"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[10001] rounded-lg border bg-card text-card-foreground p-1 shadow-xl min-w-[220px]">
                <DropdownMenuItem className="rounded-md px-3 py-2 focus:bg-muted" onClick={async () => {
                  try {
                    let id = chatId;
                    if (!id) {
                      const { getChatSession } = await import('@/app/actions');
                      const s = await getChatSession();
                      if (s.success && s.data?.chatId) {
                        id = s.data.chatId;
                        setChatId(id);
                        try { localStorage.setItem('web_impuls_chat_id', id); } catch {}
                      }
                    }
                    if (!id) {
                      toast({ variant: 'destructive', title: t.errorTitle, description: (locale === 'de') ? 'Konnte Chat-ID nicht abrufen' : (locale === 'en') ? 'Failed to obtain chat ID' : (locale === 'pl') ? 'Nie udało się uzyskać identyfikatora czatu' : (locale === 'ru') ? 'Не удалось получить chat id' : 'Не вдалося отримати chat id' });
                      return;
                    }
                    const u = new URL(window.location.href);
                    u.searchParams.set('chat', id);
                    await navigator.clipboard.writeText(u.toString());
                    toast({ title: (locale === 'de') ? 'Link kopiert' : (locale === 'en') ? 'Link copied' : (locale === 'pl') ? 'Link skopiowany' : (locale === 'ru') ? 'Ссылка скопирована' : 'Посилання скопійовано' });
                  } catch (e) {
                    console.error(e);
                    toast({ variant: 'destructive', title: t.errorTitle, description: (locale === 'de') ? 'Fehler beim Kopieren des Links' : (locale === 'en') ? 'Error copying link' : (locale === 'pl') ? 'Błąd kopiowania linku' : (locale === 'ru') ? 'Ошибка копирования ссылки' : 'Помилка копіювання посилання' });
                  }
                }}>
                  <Link2 className="mr-2 h-4 w-4" />
                  {t.chatCopyLink}
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-md px-3 py-2 focus:bg-muted" onClick={async () => {
                  try {
                    const { resetChatSession, getChatHistory } = await import('@/app/actions');
                    const res = await resetChatSession();
                    if (res.success) {
                      // Завантажимо стартове вітання після ресету
                      const h = await getChatHistory(locale);
                      if (h.success && h.data) {
                        const history = h.data.messages.map((m:any) => ({ role: m.role, content: m.content, timestamp: new Date(m.created_at).toISOString() }));
                        setMessages(history.length > 0 ? history : [{ role: 'assistant', content: t.chatWelcome ?? 'Привіт! 👋 Я ваш AI‑помічник. Чим можу допомогти сьогодні?', timestamp: new Date().toISOString() }]);
                        setHasLead(false); setLeadEmail(null); setLeadPhone(null);
                        toast({ title: t.chatNewChatStarted });
                      }
                    } else {
                      toast({ variant: 'destructive', title: t.errorTitle, description: res.error || t.chatErrorNewChat });
                    }
                  } catch (e) {
                    console.error(e);
                    toast({ variant: 'destructive', title: t.errorTitle, description: t.chatErrorNewChat });
                  }
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t.chatStartNew}
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-md px-3 py-2 focus:bg-muted" onClick={() => {
                  setMessages([{ role: 'assistant', content: t.chatWelcome ?? 'Привіт! 👋 Я ваш AI‑помічник. Чим можу допомогти сьогодні?', timestamp: new Date().toISOString() }]);
                  toast({ title: t.chatCleared });
                }}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t.chatClear}
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-md px-3 py-2 focus:bg-muted" onClick={onMuteToggle}>
                  {isMuted ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
                  {isMuted ? t.chatUnmuteSound : t.chatMuteSound}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-primary-foreground hover:bg-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 p-0 overflow-hidden bg-transparent flex flex-col">
          <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0">
            <div className="space-y-4 p-4">
              {!historyLoaded && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3"
                >
                  <Avatar className="h-8 w-8 border bg-transparent flex items-center justify-center">
                    <BotIcon className="h-full w-full" />
                  </Avatar>
                  <GlassBubble padding="px-3.5 py-2.5" className="text-sm text-white/85 border-white/5 shadow-[0_18px_45px_rgba(5,6,20,0.45)]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t.chatLoadingHistory}</span>
                    </div>
                  </GlassBubble>
                </motion.div>
              )}
              {historyLoaded && messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn('flex flex-col gap-1', 'items-start')}
                >
                  <div className={cn('flex items-start gap-3 w-full')}>
                    <Avatar className="h-8 w-8 border bg-transparent flex items-center justify-center">
                      <BotIcon className="h-full w-full" />
                    </Avatar>
                    <GlassBubble className="text-sm leading-relaxed text-white/90 border-white/5 shadow-[0_18px_45px_rgba(5,6,20,0.45)]">
                      {t.chatWelcome}
                    </GlassBubble>
                  </div>
                </motion.div>
              )}
              {(() => {
                // If the first assistant message in DB is one of known greetings, render it in current locale
                const knownGreetings = new Set([
                  (translations as any).ua?.chatWelcome,
                  (translations as any).pl?.chatWelcome,
                  (translations as any).en?.chatWelcome,
                  (translations as any).ru?.chatWelcome,
                ].filter(Boolean));
                // Remove legacy CTA text if followed by contact_form to avoid duplicate prompt
                const ctaRegexes = [
                  /представьтесь\s+и\s+оставьте\s+контакт/i,
                  /представтесь\s+і\s+залиште\s+контакт/i,
                  /please\s+tell\s+your\s+name\s+and\s+leave\s+a\s+contact/i,
                  /podaj\s+proszę\s+imię\s+i\s+kontakt/i,
                ];
                const filtered = [] as ChatMessage[];
                for (let i = 0; i < messages.length; i++) {
                  const m = messages[i];
                  const next = messages[i + 1];
                  const isLegacyCta = m.role === 'assistant' && ctaRegexes.some((r) => r.test(m.content));
                  if (isLegacyCta && next && (next as any).type === 'contact_form') {
                    // skip legacy CTA
                    continue;
                  }
                  filtered.push(m);
                }
                const displayMessages = filtered.map((m, i) => {
                  if (i === 0 && m.role === 'assistant' && knownGreetings.has(m.content)) {
                    return { ...m, content: t.chatWelcome };
                  }
                  return m;
                });
                return displayMessages.map((message, index) => {
                const emojiOnly = isEmojiOnly(message.content);
                const prevMsg = (displayMessages as any)[index - 1] as ChatMessage | undefined;
                let msgLocale = ((message as any).lang as any) || (locale as any);
                const isContactFormMarker = message.role === 'assistant' && message.content === '::contact_form::';
                const isContactForm = (message.type === 'contact_form' || isContactFormMarker) && !hasLead;
                const isFeedbackMarker = (message.role === 'assistant' && (message.content === '::feedback_up::' || message.content === '::feedback_down::'));
                
                // Skip ::contact_form:: marker if user already has a lead (form not needed)
                if (isContactFormMarker && hasLead) {
                  return null;
                }
                // If contact form came from DB marker, infer language from previous user message
                if (!((message as any).lang) && message.role === 'assistant' && message.content === '::contact_form::' && prevMsg && prevMsg.role === 'user') {
                  try { msgLocale = detectMessageLocale(prevMsg.content, (locale as any) || 'ua'); } catch {}
                }
                const isSecureConfirm = message.type === 'secure_confirm';
                // Treat DB-inserted idle prompts (plain text) as interactive prompt
                const isIdlePrompt = false; // idle prompts disabled
                const isRatingPrompt = message.type === 'rating_prompt';
                const isMoreHelpPrompt = message.type === 'more_help_prompt';
                return (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn('flex flex-col gap-1', message.role === 'user' ? 'items-end' : 'items-start')}
                  >
                    <div className={cn('flex items-start gap-3 w-full', message.role === 'user' && 'justify-end')}>
                        {message.role === 'assistant' && (
                          <Avatar className="h-8 w-8 border bg-transparent flex items-center justify-center">
                              <BotIcon className="h-full w-full" />
                          </Avatar>
                        )}
                        {isContactForm ? (
                          <GlassBubble className="w-full max-w-[80%]" padding="p-3 sm:p-4">
                            <div className="mb-1.5 flex items-center gap-2 text-base font-semibold text-white">
                              <span>👋</span>
                              <span>{t.overlayLeadTitle}</span>
                            </div>
                            <div className="mb-3 flex items-center gap-2 text-xs sm:text-[13px] text-white/70">
                              <Lock className="h-4 w-4 text-primary" />
                              <span>{t.overlayLeadSubtitle}</span>
                            </div>
                            <div className="flex flex-col gap-2 mb-2">
                              <Input
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                                placeholder={t.chatNamePlaceholder}
                                className="h-9 bg-black/20 border-white/10 focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                              <Input
                                value={contactValue}
                                onChange={(e) => setContactValue(e.target.value)}
                                placeholder={t.chatContactPlaceholder}
                                className="h-9 bg-black/20 border-white/10 focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <Button type="button" size="sm" onClick={() => handleSaveContact(msgLocale as any)} className="rounded-full px-5 shadow-sm">
                                {t.chatSendButton}
                              </Button>
                            </div>
                          </GlassBubble>
                        ) : isSecureConfirm ? (
                          <GlassBubble className="w-full max-w-[80%]" padding="p-3 sm:p-4">
                            <div className="mb-1.5 flex items-center gap-2 text-base font-semibold text-white">
                              <ShieldCheck className="h-4 w-4 text-primary" />
                              <span>{t.chatConfirmThanks}</span>
                            </div>
                            <div className="text-xs sm:text-[13px] text-white/70">
                              {t.overlayLeadSubtitle}
                            </div>
                          </GlassBubble>
                        ) : isFeedbackMarker ? (
                          <GlassBubble className="max-w-[85%]" padding="p-3.5">
                            <span className="text-sm text-white/80">{t.chatFeedbackSaved}</span>
                          </GlassBubble>
                        ) : isMoreHelpPrompt ? (
                          <GlassBubble className="max-w-[85%]" padding="p-3.5">
                            <div className="mb-3 font-medium text-white">{t.chatMoreHelp}</div>
                            <div className="flex gap-2">
                              <Button size="sm" className="rounded-full px-5 shadow-sm" onClick={() => {
                                // Remove this prompt and add "I'm listening" response
                                setMessages((prev) => {
                                  const filtered = prev.filter((m) => (m as any).type !== 'more_help_prompt');
                                  return [...filtered, { role: 'assistant', content: t.chatListening || 'Слухаю! Пишіть ваше питання 👇', timestamp: new Date().toISOString() } as ChatMessage];
                                });
                                setTimeout(() => { try { textareaRef.current?.focus(); } catch {} }, 100);
                              }}>{t.chatYes}</Button>
                              <Button size="sm" variant="secondary" className="rounded-full px-5 shadow-sm" onClick={() => {
                                // Remove this prompt and show rating
                                setMessages((prev) => {
                                  const filtered = prev.filter((m) => (m as any).type !== 'more_help_prompt');
                                  return [...filtered, { role: 'assistant', content: '', type: 'rating_prompt', timestamp: new Date().toISOString() } as ChatMessage];
                                });
                              }}>{t.chatNo}</Button>
                            </div>
                          </GlassBubble>
                        ) : isRatingPrompt ? (
                          <GlassBubble className="max-w-[85%]" padding="p-3.5">
                            <div className="mb-3 font-medium text-white">{t.chatRate}</div>
                            <div className="flex gap-2">
                              <Button size="sm" className="rounded-full px-5 shadow-sm text-lg" onClick={async () => {
                                try {
                                  const { submitChatFeedback } = await import('@/app/actions');
                                  const r = await submitChatFeedback('up');
                                  if (!r?.success) {
                                    toast({ variant: 'destructive', title: t.errorTitle, description: r?.error || t.chatErrorFeedback });
                                  }
                                  // НЕ зберігаємо маркер в БД - тільки локально для цієї сесії
                                  setFeedbackGiven(true);
                                  setMessages((prev) => addUniqueMessage(prev, { role: 'assistant', content: '::feedback_up::', timestamp: new Date().toISOString() }));
                                } catch (e) {
                                  console.error(e);
                                }
                              }}>👍🏻</Button>
                              <Button size="sm" variant="secondary" className="rounded-full px-5 shadow-sm text-lg" onClick={async () => {
                                try {
                                  const { submitChatFeedback } = await import('@/app/actions');
                                  const r = await submitChatFeedback('down');
                                  if (!r?.success) {
                                    toast({ variant: 'destructive', title: t.errorTitle, description: r?.error || t.chatErrorFeedback });
                                  }
                                  // НЕ зберігаємо маркер в БД - тільки локально для цієї сесії
                                  setFeedbackGiven(true);
                                  setMessages((prev) => addUniqueMessage(prev, { role: 'assistant', content: '::feedback_down::', timestamp: new Date().toISOString() }));
                                } catch (e) {
                                  console.error(e);
                                }
                              }}>👎🏻</Button>
                            </div>
                          </GlassBubble>
                        ) : (
                          <GlassBubble
                            align={message.role === 'user' ? 'right' : 'left'}
                            className={cn(
                              'text-sm leading-relaxed text-white/90',
                              emojiOnly && 'text-4xl leading-none text-white/95'
                            )}
                            padding={emojiOnly ? 'px-2 py-1' : 'px-4 py-3.5'}
                            highlights={message.role === 'user'}
                          >
                            {message.role === 'assistant' ? (
                              <>
                                <FormattedMessage text={hasContactLinks(message.content) ? stripContactLinks(message.content) : message.content} />
                                {(hasContactLinks(message.content) || mentionsOperator(message.content)) && (
                                  <ContactButtons showLiveChat={mentionsOperator(message.content)} />
                                )}
                              </>
                            ) : (
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            )}
                          </GlassBubble>
                        )}
                        {message.role === 'user' && (
                          <Avatar className="h-8 w-8 border">
                            <AvatarFallback>
                              <User className="h-5 w-5"/>
                            </AvatarFallback>
                          </Avatar>
                        )}
                    </div>
                     <div className={cn("text-xs text-muted-foreground", message.role === 'user' ? 'pr-12' : 'pl-12')}>
                        {format(new Date(message.timestamp), 'HH:mm')}
                     </div>
                  </motion.div>
                );
                }).filter(Boolean);
              })()}
              {isLoading && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3">
                   <Avatar className="h-8 w-8 border bg-transparent flex items-center justify-center">
                       <BotIcon className="h-full w-full" />
                  </Avatar>
                  <GlassBubble padding="p-3.5" className="flex items-center gap-1.5 text-white/80">
                    <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </GlassBubble>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div
          className="p-4 flex flex-col gap-2 border-t border-white/5 bg-transparent flex-shrink-0"
          style={{ paddingBottom: `max(env(safe-area-inset-bottom, 0px), 1rem)` }}
        >
          <div className="relative w-full">
            {emojiOpen && (
              <div className="absolute left-0 right-0 bottom-full mb-2 z-20">
                <div className="w-full bg-popover border rounded-xl shadow-xl p-3">
                  <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                    {topEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => onEmojiClick(emoji)}
                        className="text-2xl rounded-md hover:bg-muted transition-colors h-9 w-9 flex items-center justify-center"
                        aria-label={`emoji ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }} className="flex w-full items-start gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={hasPendingContactForm ? (t.chatFillFormFirst || "Спочатку заповніть форму вище") : (t.chatPlaceholder || "Напишіть ваше питання...")}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-y-hidden max-h-24 pr-12"
                rows={1}
                disabled={isLoading || hasPendingContactForm}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim() || hasPendingContactForm} className='bg-primary hover:bg-primary/90 text-white rounded-full shrink-0 self-end shadow-md'>
                <Send className="h-5 w-5 text-white" />
              </Button>
            </form>
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isLoading}
                onClick={() => setEmojiOpen((o) => !o)}
                className={cn("rounded-full hover:bg-muted/80 focus-visible:ring-0 focus-visible:ring-offset-0", emojiOpen && "bg-muted")}
                aria-expanded={emojiOpen}
                aria-label="Toggle emoji picker"
              >
                <Smile className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button type="button" variant="ghost" size="icon" disabled={true} className="rounded-full hover:bg-muted/80 cursor-not-allowed">
                 <Upload className="h-5 w-5 text-muted-foreground/50" />
              </Button>
            </div>
            <div />
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 w-full mt-auto">
          <WidgetFooter />
        </div>
      </LiquidGlass>
    </motion.div>
  );
});
ChatContent.displayName = 'ChatContent';

export function ChatWidget({ initialView = 'closed' }: ChatWidgetProps) {
  const [view, setView] = useState<ChatWidgetView>(initialView);
  const [unread, setUnread] = useState(0);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  const [sessionChatId, setSessionChatId] = useState<string | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const shouldRenderContent = view !== 'closed';

  const params = useParams();
  const locale = Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale;
  const t = (translations as any)[locale] || translations.ua;
  const notifyAudioRef = useRef<HTMLAudioElement | null>(null);
  const sendAudioRef = useRef<HTMLAudioElement | null>(null);
  const unreadCountRef = useRef(0);
  const processedMessages = useRef(new Set<string>());

  useEffect(() => {
    const a = new Audio('/sounds/chat-notify.mp3');
    a.preload = 'auto';
    a.volume = 0.8;
    notifyAudioRef.current = a;
    const s = new Audio('/sounds/chat-send.mp3');
    s.preload = 'auto';
    s.volume = 0.6;
    sendAudioRef.current = s;

    // Load muted state from localStorage, default to NOT muted
    try {
      const muted = localStorage.getItem('chat_is_muted');
      setIsMuted(muted === 'true');
    } catch (e) {
      setIsMuted(false); 
    }
  }, []);

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    try {
      localStorage.setItem('chat_is_muted', String(newMutedState));
    } catch (e) {
      // ignore
    }
  };

  // Cooldown to prevent sound spam (min 2 seconds between sounds)
  const lastSoundTime = useRef<number>(0);
  const SOUND_COOLDOWN_MS = 2000;

  const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (isMuted) return;
    
    const now = Date.now();
    if (now - lastSoundTime.current < SOUND_COOLDOWN_MS) {
      return; // Skip if played recently
    }
    lastSoundTime.current = now;
    
    try {
      const el = audioRef.current;
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => {}); // catch autoplay policy errors
      }
    } catch {}
  };

  // Try to unlock audio on first user gesture (autoplay policies)
  useEffect(() => {
    const unlock = async () => {
      try {
        const tryUnlock = async (el: HTMLAudioElement | null) => {
          if (!el) return;
          el.muted = true; await el.play(); el.pause(); el.currentTime = 0; el.muted = false;
        };
        await tryUnlock(notifyAudioRef.current);
        await tryUnlock(sendAudioRef.current);
        setAudioUnlocked(true);
      } catch {}
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock as any);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock);
    window.addEventListener('click', unlock);
    window.addEventListener('keydown', unlock as any);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock as any);
    };
  }, []);

  // Якщо звук був заблокований політикою автоплею, зіграємо сповіщення
  // одразу після першого розблокування, якщо вже є непрочитані і чат закритий
  useEffect(() => {
    if (!audioUnlocked) return;
    if (view === 'closed' && unread > 0) {
      playSound(notifyAudioRef);
    }
  }, [audioUnlocked, unread, view, isMuted]);

  // Mount a portal container at the end of <body> to avoid parent transforms affecting fixed positioning
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.id = 'chat-widget-portal';
    document.body.appendChild(el);
    setPortalNode(el);
    return () => {
      try { document.body.removeChild(el); } catch {}
    };
  }, []);

  // Strong body scroll-lock while widget is open (iOS-safe)
  useEffect(() => {
    if (!shouldRenderContent) return;
    if (typeof document === 'undefined') return;

    const body = document.body;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    const scrollBarGap = window.innerWidth - html.clientWidth;
    const isIOS =
      /iP(ad|hone|od)/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
    };

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollBarGap > 0) {
      body.style.paddingRight = `${scrollBarGap}px`;
    }

    if (isIOS) {
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    }

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      body.style.width = prev.bodyWidth;
      body.style.paddingRight = prev.bodyPaddingRight;
      if (isIOS) {
        window.scrollTo(0, scrollY);
      }
    };
  }, [shouldRenderContent]);

  // Keep the overlay pinned to the visual viewport (keyboard-safe on mobile Safari)
  useEffect(() => {
    if (!shouldRenderContent) return;
    const el = overlayRef.current;
    if (!el) return;

    let frame: number | null = null;
    const update = () => {
      const vv = window.visualViewport;
      const width = vv?.width ?? window.innerWidth;
      const height = vv?.height ?? window.innerHeight;
      const offsetLeft = vv?.offsetLeft ?? 0;
      const offsetTop = vv?.offsetTop ?? 0;

      el.style.width = `${Math.round(width)}px`;
      el.style.height = `${Math.round(height)}px`;
      el.style.transform = `translate3d(${Math.round(offsetLeft)}px, ${Math.round(offsetTop)}px, 0)`;
    };

    const schedule = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        update();
      });
    };

    update();
    const vv = window.visualViewport;
    vv?.addEventListener('resize', schedule);
    vv?.addEventListener('scroll', schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      vv?.removeEventListener('resize', schedule);
      vv?.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
    };
  }, [shouldRenderContent]);

  // Prevent iOS "rubber band" scrolling behind the widget, but keep chat scrollable
  useEffect(() => {
    if (!shouldRenderContent) return;
    const el = overlayRef.current;
    if (!el) return;

    const onTouchMove = (e: TouchEvent) => {
      if (isInsideScrollable(e.target)) return;
      e.preventDefault();
    };

    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove as any);
  }, [shouldRenderContent]);
  // Відкриваємо віджет у режимі меню (лічильник не обнуляємо)
  const openWidget = () => {
    setView('menu');
  };

  const closeWidget = () => {
    setView('closed');
  };
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && window.innerWidth >= 640) {
      closeWidget();
    }
  };

  // Коли користувач відкриває саме чат, обнуляємо лічильник
  useEffect(() => {
    if (view === 'chat') {
      setUnread(0);
      unreadCountRef.current = 0;
    }
  }, [view]);

  // Track existing chat id if it already exists (avoid creating sessions/network calls on page load).
  useEffect(() => {
    try {
      const existing = localStorage.getItem('web_impuls_chat_id');
      if (existing) setSessionChatId(existing);
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'web_impuls_chat_id') {
        setSessionChatId(e.newValue);
      }
      if (e.key === 'chat_unread_reset' && e.newValue) {
        setUnread(0);
        unreadCountRef.current = 0;
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Same-tab writes don't trigger storage events; re-check when opening.
  useEffect(() => {
    if (!shouldRenderContent) return;
    if (sessionChatId) return;
    try {
      const existing = localStorage.getItem('web_impuls_chat_id');
      if (existing) setSessionChatId(existing);
    } catch {}
  }, [shouldRenderContent, sessionChatId]);

  // Фонові підписки: збільшуємо лічильник, якщо чат не відкритий
  useEffect(() => {
    if (!sessionChatId) return;
    if (view !== 'closed') return;
    const supabase = getSupabaseClient();
    
    const ch = supabase
      .channel(`chat-badge-${sessionChatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${sessionChatId}` }, (payload) => {
        const m: any = payload.new;
        const messageId = `${m.id}-${m.created_at}`;

        if (m.role === 'assistant' && !processedMessages.current.has(messageId)) {
          processedMessages.current.add(messageId);
          
          unreadCountRef.current = unreadCountRef.current + 1;
          setUnread(unreadCountRef.current);
          playSound(notifyAudioRef);
        }
      })
      .subscribe();

    return () => { try { supabase.removeChannel(ch); } catch {} };
  }, [sessionChatId, view, isMuted]);


  // Колбек від дочірнього чату: нове асистентське повідомлення
  const handleAssistantMessage = (p: { content: string }) => {
    if (view !== 'chat' && p.content) {
       const messageId = p.content.slice(0,20) + Date.now();
       if (!processedMessages.current.has(messageId)) {
         processedMessages.current.add(messageId);
         unreadCountRef.current = unreadCountRef.current + 1;
         setUnread(unreadCountRef.current);
       }
    }
    playSound(notifyAudioRef);
  };

  const handleUserSend = async () => {
    playSound(sendAudioRef);
  };

  const handleNavigate = async (v: ChatWidgetView, source?: 'ai_button' | 'menu') => {
      setView(v);
      if (v === 'chat') {
        setUnread(0);
        unreadCountRef.current = 0;
        try {
          // Notify other tabs to reset their unread counter
          localStorage.setItem('chat_unread_reset', Date.now().toString());
          localStorage.removeItem('chat_unread_reset');
        } catch {}
      }
      
      // Notify Telegram when navigating to live chat
      if (v === 'live') {
        try {
          const { notifyLiveChatTransfer } = await import('@/app/actions');
          await notifyLiveChatTransfer(source || 'menu');
        } catch (e) {
          console.error('Failed to notify live chat transfer:', e);
        }
      }
  }


  // Use portal if available; render nothing until mount to avoid shifting
  if (!portalNode) return null;

  function isInsideScrollable(el: EventTarget | null) {
    try {
      return !!(el as Element | null)?.closest('[data-radix-scroll-area-viewport]');
    } catch {
      return false;
    }
  }
  return (
    <>
      {createPortal(
        shouldRenderContent ? (
        <div
          ref={overlayRef}
          className="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-stretch justify-center overscroll-contain bg-black/40 px-3 sm:items-end sm:justify-end sm:px-0 sm:py-0 sm:pb-6 sm:pr-6"
          onClick={handleContainerClick}
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'transform, width, height',
            paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
          }}
          >
            <AnimatePresence>
              {view === 'menu' && (
                <MenuContent
                  unread={unread}
                  onNavigate={handleNavigate}
                  onClose={closeWidget}
                />
              )}
              {view === 'chat' && (
                <ChatContent
                  onNavigate={handleNavigate}
                  onClose={closeWidget}
                  onAssistantMessage={handleAssistantMessage}
                  onUserSend={handleUserSend}
                  isMuted={isMuted}
                  onMuteToggle={handleMuteToggle}
                />
              )}
              {view === 'live' && (
                <LiveChatContent
                  onNavigate={handleNavigate}
                  onClose={closeWidget}
                  onOperatorMessage={() => playSound(notifyAudioRef)}
                />
              )}
            </AnimatePresence>
          </div>
        ) : null,
        portalNode
      )}

	      {createPortal(
	        (
	          <AnimatePresence>
	            {view === 'closed' && (
	              <motion.button
	                onClick={openWidget}
	                data-chat-trigger
	                className="chat-launcher-btn chat-fab h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center will-change-transform relative"
	                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open Chat"
              >
                <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-white" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center shadow">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        ),
        portalNode
      )}
    </>
  );
}
