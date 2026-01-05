'use client';

import { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Loader2, User, ChevronDown, Clock4 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { getSupabaseClient } from '@/lib/supabase';
import Image from 'next/image';

type LiveMessage = {
  id: string;
  sender_type: 'visitor' | 'operator';
  sender_name: string | null;
  content: string;
  created_at: string;
  read_at: string | null;
};

// Working hours check
function isWorkingHours(): boolean {
  const now = new Date();
  const europeTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }));
  const hours = europeTime.getHours();
  const day = europeTime.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const isWorkingTime = hours >= 9 && hours < 18;
  return isWeekday && isWorkingTime;
}

// Get or create visitor ID
function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('live_chat_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('live_chat_visitor_id', id);
  }
  return id;
}

const WebImpulsChatLogo = ({ className }: { className?: string }) => (
  <Image src="/icons/logo-web.svg" alt="Web Impuls" width={70} height={24} className={`h-5 w-auto ${className || ''}`} />
);

// Bot icon like in AI chat
const BotIcon = ({ className }: { className?: string }) => (
  <Image src="/icons/logo-web.svg" alt="Web Impuls" width={90} height={30} className={`h-full w-full ${className || ''}`} />
);

// Operator avatar with logo - same as AI chat
const OperatorAvatar = () => (
  <Avatar className="h-8 w-8 border bg-transparent flex items-center justify-center flex-shrink-0">
    <BotIcon />
  </Avatar>
);

// Visitor avatar - same as AI chat
const VisitorAvatar = () => (
  <Avatar className="h-8 w-8 border flex-shrink-0">
    <AvatarFallback>
      <User className="h-5 w-5" />
    </AvatarFallback>
  </Avatar>
);

// Typing indicator dots animation - same style as AI chat
const TypingIndicator = ({ operatorName }: { operatorName?: string }) => (
  <div className="flex items-start gap-3">
    <OperatorAvatar />
    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm p-3.5 shadow-sm flex flex-col">
      {operatorName && (
        <p className="text-xs text-primary mb-1 font-medium">{operatorName}</p>
      )}
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  </div>
);

const WidgetFooter = () => (
  <div className="w-full flex items-center justify-center text-sm text-muted-foreground/80 pt-2 gap-2">
    Powered by
    <a href="#" className="flex items-center gap-2 font-semibold text-foreground/80 hover:text-primary transition-colors">
      <WebImpulsChatLogo className="h-6 w-auto" />
    </a>
  </div>
);

interface LiveChatContentProps {
  onNavigate: (view: 'menu') => void;
  onClose: () => void;
  onOperatorMessage?: () => void;
}

export const LiveChatContent = forwardRef<HTMLDivElement, LiveChatContentProps>(
  ({ onNavigate, onClose, onOperatorMessage }, ref) => {
    const params = useParams();
    const locale = (Array.isArray(params.locale) ? params.locale[0] : params.locale) || 'ua';
    const t = (translations as any)[locale] || translations.ua;

    const [messages, setMessages] = useState<LiveMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);
    const [visitorName, setVisitorName] = useState('');
    const [visitorContact, setVisitorContact] = useState('');
    const [isOnline, setIsOnline] = useState(true);
    const [showContactForm, setShowContactForm] = useState(true);
    const [operatorTyping, setOperatorTyping] = useState(false);
    const [operatorTypingName, setOperatorTypingName] = useState<string | null>(null);

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isSendingRef = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const supabase = getSupabaseClient();
    const visitorId = getVisitorId();

    // Check working hours on client only
    useEffect(() => {
      setIsOnline(isWorkingHours());
    }, []);

    // Scroll to bottom
    useEffect(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (viewport) {
          setTimeout(() => {
            viewport.scrollTop = viewport.scrollHeight;
          }, 50);
        }
      }
    }, [messages, operatorTyping]);

    // Load existing chat OR prefill from AI chat lead data
    useEffect(() => {
      if (!supabase || !visitorId) return;

      (async () => {
        // First check for existing live chat
        const { data: existingChat } = await supabase
          .from('live_chats')
          .select('*')
          .eq('visitor_id', visitorId)
          .neq('status', 'closed')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingChat) {
          setChatId(existingChat.id);
          setShowContactForm(false);

          const { data: msgs } = await supabase
            .from('live_messages')
            .select('*')
            .eq('chat_id', existingChat.id)
            .order('created_at', { ascending: true });

          if (msgs) setMessages(msgs as LiveMessage[]);
          return;
        }

        // No existing live chat - check if we have lead data from AI chat
        try {
          const { getLeadStatus } = await import('@/app/actions');
          const leadResult = await getLeadStatus();
          
          if (leadResult.success && leadResult.data?.hasLead) {
            const { name, email, phone } = leadResult.data;
            // If we have name and contact, prefill and auto-start chat
            if (name && (email || phone)) {
              setVisitorName(name);
              setVisitorContact(email || phone || '');
              // Auto-start the chat with prefilled data
              setShowContactForm(false);
              
              // Create the live chat
              const { data: newChat } = await supabase
                .from('live_chats')
                .insert({
                  visitor_id: visitorId,
                  visitor_name: name,
                  visitor_contact: email || phone,
                  status: 'waiting',
                  visitor_locale: locale,
                })
                .select()
                .single();

              if (newChat) {
                setChatId(newChat.id);
              }
            } else if (name) {
              // Just prefill name
              setVisitorName(name);
            } else if (email || phone) {
              // Just prefill contact
              setVisitorContact(email || phone || '');
            }
          }
        } catch (e) {
          console.error('Error checking lead status:', e);
        }
      })();
    }, [supabase, visitorId, locale]);

    // Realtime subscription for messages
    useEffect(() => {
      if (!supabase || !chatId) return;

      const channel = supabase
        .channel(`live-chat-${chatId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'live_messages',
            filter: `chat_id=eq.${chatId}`,
          },
          (payload) => {
            const newMsg = payload.new as LiveMessage;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              if (newMsg.sender_type === 'operator') {
                onOperatorMessage?.();
                // When operator sends a message, hide typing indicator
                setOperatorTyping(false);
              }
              return [...prev, newMsg];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, [supabase, chatId, onOperatorMessage]);

    // Realtime subscription for typing indicators
    useEffect(() => {
      if (!supabase || !chatId) return;

      const channel = supabase
        .channel(`live-typing-${chatId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'live_typing',
            filter: `chat_id=eq.${chatId}`,
          },
          (payload: any) => {
            const data = payload.new as { typer_type: string; typer_name: string | null; is_typing: boolean };
            if (data.typer_type === 'operator') {
              setOperatorTyping(true);
              setOperatorTypingName(data.typer_name || null);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'live_typing',
            filter: `chat_id=eq.${chatId}`,
          },
          (payload: any) => {
            const data = payload.new as { typer_type: string; typer_name: string | null; is_typing: boolean };
            if (data.typer_type === 'operator') {
              setOperatorTyping(data.is_typing);
              setOperatorTypingName(data.typer_name || null);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'live_typing',
            filter: `chat_id=eq.${chatId}`,
          },
          (payload: any) => {
            const data = payload.old as { typer_type: string } | null;
            if (data?.typer_type === 'operator') {
              setOperatorTyping(false);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, [supabase, chatId]);

    // Broadcast visitor typing
    const broadcastTyping = useCallback(async (isTyping: boolean) => {
      if (!supabase || !chatId) return;

      try {
        if (isTyping) {
          await supabase.from('live_typing').upsert({
            chat_id: chatId,
            typer_type: 'visitor',
            typer_name: visitorName || null,
            is_typing: true,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'chat_id,typer_type' });
        } else {
          // Delete the typing record instead of updating
          await supabase
            .from('live_typing')
            .delete()
            .eq('chat_id', chatId)
            .eq('typer_type', 'visitor');
        }
      } catch (e) {
        // Ignore errors
      }
    }, [supabase, chatId, visitorName]);

    // Handle input change with typing indicator
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);

      // Broadcast typing
      if (e.target.value.trim()) {
        broadcastTyping(true);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          broadcastTyping(false);
        }, 2000);
      } else {
        broadcastTyping(false);
      }
    }, [broadcastTyping]);

    // Start chat with contact info
    const handleStartChat = async () => {
      if (!supabase || !visitorId || (!visitorName.trim() && !visitorContact.trim())) return;

      setIsLoading(true);

      const { data, error } = await supabase
        .from('live_chats')
        .insert({
          visitor_id: visitorId,
          visitor_name: visitorName.trim() || null,
          visitor_contact: visitorContact.trim() || null,
          visitor_locale: locale,
          status: 'waiting',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating live chat:', error);
      }
      
      if (data) {
        setChatId(data.id);
        setShowContactForm(false);
      }

      setIsLoading(false);
    };

    // Send message
    const handleSendMessage = useCallback(async () => {
      if (!supabase || !chatId || !input.trim() || isLoading || isSendingRef.current) return;
      
      isSendingRef.current = true;
      setIsLoading(true);
      const content = input.trim();
      setInput('');

      // Stop typing broadcast
      broadcastTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      try {
        const { error } = await supabase.from('live_messages').insert({
          chat_id: chatId,
          sender_type: 'visitor',
          sender_name: visitorName || null,
          content,
        });

        if (error) {
          console.error('Error sending message:', error);
        }

        // Increment unread count by 1, not set to total messages
        // First get current count, then increment
        const { data: chatData } = await supabase
          .from('live_chats')
          .select('unread_count')
          .eq('id', chatId)
          .single();
        
        const currentCount = chatData?.unread_count || 0;
        
        await supabase
          .from('live_chats')
          .update({ 
            unread_count: currentCount + 1, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', chatId);
      } finally {
        setIsLoading(false);
        isSendingRef.current = false;
        inputRef.current?.focus();
      }
    }, [supabase, chatId, input, isLoading, visitorName, messages, broadcastTyping]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (showContactForm) {
          handleStartChat();
        } else {
          handleSendMessage();
        }
      }
    };

    const formatTime = (dateStr: string) => {
      return new Date(dateStr).toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
      });
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
        <Card className="w-full h-full flex flex-col shadow-lg bg-card overflow-hidden sm:bg-card/80 sm:rounded-xl border-none">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('menu')}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  <Image src="/icons/logo-web.svg" alt="Web Impuls" width={28} height={28} className="h-5 w-5 object-contain" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <h3 className="text-sm font-semibold">
                    {t.chatLiveSupport || 'Онлайн підтримка'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    {isOnline ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span>
                        </span>
                        Online
                      </>
                    ) : (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
                        </span>
                        Offline
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </CardHeader>

          {/* Content */}
          <CardContent className="flex-1 p-0 overflow-hidden bg-background/50 flex flex-col">
            {showContactForm ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 flex items-center justify-center">
                  <Image src="/icons/logo-web.svg" alt="Web Impuls" width={48} height={48} className="h-8 w-auto" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-1">
                    {t.chatLiveStartTitle || 'Зв\'яжіться з нами'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isOnline
                      ? (t.chatLiveStartDescOnline || 'Наш оператор відповість протягом кількох хвилин')
                      : (t.chatLiveStartDescOffline || 'Ми offline, але відповімо завтра з 9:00')}
                  </p>
                </div>
                <div className="w-full max-w-xs space-y-3">
                  <Input
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder={t.chatNamePlaceholder || "Ваше ім'я"}
                    className="h-11"
                  />
                  <Input
                    value={visitorContact}
                    onChange={(e) => setVisitorContact(e.target.value)}
                    placeholder={t.chatContactPlaceholder || 'Email або телефон'}
                    className="h-11"
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    onClick={handleStartChat}
                    disabled={isLoading || (!visitorName.trim() && !visitorContact.trim())}
                    className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t.chatLiveStartButton || 'Почати чат'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <ScrollArea ref={scrollAreaRef} className="h-full flex-1">
                <div className="space-y-3 p-4">
                  {messages.length === 0 && !operatorTyping && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      <Clock4 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>{t.chatLiveWaiting || 'Очікуємо оператора...'}</p>
                    </div>
                  )}
                  {messages.map((message) => {
                    const isOwn = message.sender_type === 'visitor';
                    return (
                      <div
                        key={message.id}
                        className={cn('flex flex-col gap-1', isOwn ? 'items-end' : 'items-start')}
                      >
                        <div className={cn('flex items-start gap-3 w-full', isOwn && 'justify-end')}>
                          {/* Operator avatar on left */}
                          {!isOwn && <OperatorAvatar />}
                          
                          <div
                            className={cn(
                              'max-w-[85%] rounded-2xl text-sm leading-relaxed shadow-sm',
                              isOwn
                                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-md px-3.5 py-2.5'
                                : 'bg-slate-100 dark:bg-slate-800 text-foreground rounded-tl-sm p-3.5'
                            )}
                          >
                            {!isOwn && message.sender_name && (
                              <p className="text-xs text-primary mb-1 font-medium">
                                {message.sender_name}
                              </p>
                            )}
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          </div>

                          {/* Visitor avatar on right */}
                          {isOwn && <VisitorAvatar />}
                        </div>
                        <div className={cn('text-xs text-muted-foreground', isOwn ? 'pr-12' : 'pl-12')}>
                          {formatTime(message.created_at)}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Operator typing indicator */}
                  {operatorTyping && (
                    <TypingIndicator operatorName={operatorTypingName || undefined} />
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>

          {/* Input */}
          {!showContactForm && (
            <CardFooter className="p-4 border-t flex flex-col gap-2">
              <div className="flex w-full items-center gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={t.chatPlaceholder || 'Напишіть повідомлення...'}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-full"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <WidgetFooter />
            </CardFooter>
          )}
        </Card>
      </motion.div>
    );
  }
);

LiveChatContent.displayName = 'LiveChatContent';
