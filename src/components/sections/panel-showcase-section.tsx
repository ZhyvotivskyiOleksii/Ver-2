"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  CreditCard, 
  Headphones,
  Bell,
  Plus,
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  Send,
  CheckCheck,
  Clock,
  ExternalLink,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Localized content for the panel mockup
const panelContent = {
  ua: {
    welcome: 'Вітаємо',
    userName: 'Олександр',
    subtitle: 'Ось огляд ваших проектів та задач',
    nav: {
      dashboard: 'Dashboard',
      projects: 'Проекти',
      tasks: 'Задачі',
      payments: 'Платежі',
      support: 'Підтримка',
      settings: 'Налаштування',
    },
    actions: ['Новий проект', 'Нова задача', 'Мої проекти', 'Підписка', 'Підтримка'],
    stats: ['Активних', 'Очікують', 'В роботі', 'Виконано'],
    statsValues: ['3', '1', '2', '8'],
    myProjects: 'Мої проекти',
    allProjects: 'Всі проекти',
    recentTasks: 'Останні задачі',
    allTasks: 'Всі задачі',
    projects: ['Інтернет-магазин TechStore', 'Корпоративний сайт'],
    tasks: [
      { id: '#a8f21', name: 'Інтеграція платежів', status: 'inProgress' },
      { id: '#b4c52', name: 'Адаптивний дизайн', status: 'done' },
      { id: '#d7e93', name: 'SEO оптимізація', status: 'new' },
    ],
    taskStatuses: { new: 'Нова', cancelled: 'Скасовано', inProgress: 'В роботі', done: 'Готово' },
    statuses: { active: 'Активний', inProgress: 'В роботі', done: 'Готово' },
    createTask: '+ Створити задачу',
    badges: ['Real-time чат', 'Безкоштовно'],
    cta: 'Спробувати панель',
    chat: {
      title: 'Чат підтримки',
      taskId: 'Stripe API #7820',
      today: 'Сьогодні',
      placeholder: 'Напишіть повідомлення...',
      typing: 'друкує...',
      messages: [
        { from: 'manager', text: 'Привіт! 👋 Чим можу допомогти?', time: '10:30' },
        { from: 'user', text: 'Вітаю! Є питання по інтеграції Stripe', time: '10:31' },
        { from: 'manager', text: 'Звичайно! Що саме потрібно?', time: '10:32' },
        { from: 'user', text: 'Як налаштувати webhook для платежів?', time: '10:33' },
        { from: 'manager', text: 'Зараз покажу. Відкрийте налаштування проекту → Інтеграції → Stripe', time: '10:34' },
        { from: 'user', text: 'Знайшов! А далі?', time: '10:35' },
        { from: 'manager', text: 'Скопіюйте Webhook URL і вставте в Stripe Dashboard 🎯', time: '10:36' },
        { from: 'user', text: 'Працює! Дякую за швидку допомогу! 🙏', time: '10:37' },
      ],
      managerName: 'Підтримка',
    },
  },
  pl: {
    welcome: 'Witaj',
    userName: 'Alexander',
    subtitle: 'Oto przegląd Twoich projektów i zadań',
    nav: {
      dashboard: 'Dashboard',
      projects: 'Projekty',
      tasks: 'Zadania',
      payments: 'Płatności',
      support: 'Wsparcie',
      settings: 'Ustawienia',
    },
    actions: ['Nowy projekt', 'Nowe zadanie', 'Moje projekty', 'Subskrypcja', 'Wsparcie'],
    stats: ['Aktywnych', 'Oczekujące', 'W trakcie', 'Ukończone'],
    statsValues: ['3', '1', '2', '8'],
    myProjects: 'Moje projekty',
    allProjects: 'Wszystkie',
    recentTasks: 'Ostatnie zadania',
    allTasks: 'Wszystkie',
    projects: ['Sklep TechStore', 'Strona korporacyjna'],
    tasks: [
      { id: '#a8f21', name: 'Integracja płatności', status: 'inProgress' },
      { id: '#b4c52', name: 'Responsywny design', status: 'done' },
      { id: '#d7e93', name: 'Optymalizacja SEO', status: 'new' },
    ],
    taskStatuses: { new: 'Nowa', cancelled: 'Anulowane', inProgress: 'W trakcie', done: 'Gotowe' },
    statuses: { active: 'Aktywny', inProgress: 'W trakcie', done: 'Gotowe' },
    createTask: '+ Utwórz zadanie',
    badges: ['Czat na żywo', 'Za darmo'],
    cta: 'Wypróbuj panel',
    chat: {
      title: 'Czat wsparcia',
      taskId: 'Stripe API #7820',
      today: 'Dzisiaj',
      placeholder: 'Napisz wiadomość...',
      typing: 'pisze...',
      messages: [
        { from: 'manager', text: 'Cześć! 👋 W czym mogę pomóc?', time: '10:30' },
        { from: 'user', text: 'Hej! Mam pytanie o integrację Stripe', time: '10:31' },
        { from: 'manager', text: 'Oczywiście! Co dokładnie potrzebujesz?', time: '10:32' },
        { from: 'user', text: 'Jak skonfigurować webhook dla płatności?', time: '10:33' },
        { from: 'manager', text: 'Pokażę Ci. Otwórz ustawienia → Integracje → Stripe', time: '10:34' },
        { from: 'user', text: 'Znalazłem! Co dalej?', time: '10:35' },
        { from: 'manager', text: 'Skopiuj Webhook URL i wklej w Stripe Dashboard 🎯', time: '10:36' },
        { from: 'user', text: 'Działa! Dziękuję za szybką pomoc! 🙏', time: '10:37' },
      ],
      managerName: 'Wsparcie',
    },
  },
  en: {
    welcome: 'Welcome',
    userName: 'Alexander',
    subtitle: 'Here\'s an overview of your projects and tasks',
    nav: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      tasks: 'Tasks',
      payments: 'Payments',
      support: 'Support',
      settings: 'Settings',
    },
    actions: ['New project', 'New task', 'My projects', 'Subscription', 'Support'],
    stats: ['Active', 'Pending', 'In Progress', 'Completed'],
    statsValues: ['3', '1', '2', '8'],
    myProjects: 'My Projects',
    allProjects: 'View all',
    recentTasks: 'Recent Tasks',
    allTasks: 'View all',
    projects: ['TechStore E-commerce', 'Corporate Website'],
    tasks: [
      { id: '#a8f21', name: 'Payment integration', status: 'inProgress' },
      { id: '#b4c52', name: 'Responsive design', status: 'done' },
      { id: '#d7e93', name: 'SEO optimization', status: 'new' },
    ],
    taskStatuses: { new: 'New', cancelled: 'Cancelled', inProgress: 'In Progress', done: 'Done' },
    statuses: { active: 'Active', inProgress: 'In Progress', done: 'Done' },
    createTask: '+ Create task',
    badges: ['Real-time chat', 'Free'],
    cta: 'Try the panel',
    chat: {
      title: 'Support Chat',
      taskId: 'Stripe API #7820',
      today: 'Today',
      placeholder: 'Write a message...',
      typing: 'typing...',
      messages: [
        { from: 'manager', text: 'Hello! 👋 How can I help you?', time: '10:30' },
        { from: 'user', text: 'Hi! I have a question about Stripe integration', time: '10:31' },
        { from: 'manager', text: 'Of course! What do you need?', time: '10:32' },
        { from: 'user', text: 'How do I set up webhooks for payments?', time: '10:33' },
        { from: 'manager', text: 'Let me show you. Go to Settings → Integrations → Stripe', time: '10:34' },
        { from: 'user', text: 'Found it! What\'s next?', time: '10:35' },
        { from: 'manager', text: 'Copy the Webhook URL and paste it in Stripe Dashboard 🎯', time: '10:36' },
        { from: 'user', text: 'It works! Thanks for the quick help! 🙏', time: '10:37' },
      ],
      managerName: 'Support',
    },
  },
};

// Typing indicator component
function TypingIndicator({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="flex justify-start">
      <div className={cn(
        "rounded-2xl rounded-bl-md px-4 py-3",
        isDarkMode ? "bg-white/10" : "bg-white shadow-sm"
      )}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                isDarkMode ? "bg-white/60" : "bg-slate-400"
              )}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PanelShowcaseSection() {
  const params = useParams();
  const locale = Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale;
  const t = (translations as any)[locale] || translations.ua;
  const p = (panelContent as any)[locale] || panelContent.ua;
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Animated chat state
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  // Start chat animation when component is in view
  useEffect(() => {
    if (!chatStarted) return;

    const messages = p.chat.messages;
    if (visibleMessages >= messages.length) {
      // Reset and loop
      const resetTimeout = setTimeout(() => {
        setVisibleMessages(0);
      }, 5000);
      return () => clearTimeout(resetTimeout);
    }

    // Show typing indicator before each message
    setIsTyping(true);
    const typingDuration = messages[visibleMessages]?.from === 'manager' ? 1200 : 800;
    
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
      setVisibleMessages(prev => prev + 1);
    }, typingDuration);

    return () => clearTimeout(typingTimeout);
  }, [visibleMessages, chatStarted, p.chat.messages]);

  // Start animation after delay
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setChatStarted(true);
    }, 1500);
    return () => clearTimeout(startTimeout);
  }, []);

  return (
    <section className="relative section-spacing overflow-hidden">
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow px-4 py-2 max-sm:px-3 max-sm:py-1.5 max-sm:text-[11px] rounded-full bg-primary/10 border border-primary/20 text-primary mb-4"
          >
            <Sparkles className="w-4 h-4" />
            {t.panelBadge || 'Клієнтська панель'}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title text-foreground text-center mb-3"
          >
            {t.panelTitle || 'Керуйте проектами легко'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-2xl mx-auto text-center"
          >
            {t.panelDescription || 'Персональний кабінет для відстеження прогресу, задач та комунікації з командою'}
          </motion.p>
        </div>

        {/* Main showcase area */}
        <div className="relative max-w-4xl mx-auto">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-violet-500/10 to-transparent rounded-3xl blur-3xl" />
          
          {/* Main dashboard with floating chat */}
          <div className="relative">
            
            {/* Floating Chat Widget - positioned on the right edge */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -right-2 lg:-right-16 xl:-right-32 top-12 hidden lg:block w-[320px] z-20"
            >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Chat glow */}
              <div className="absolute -inset-3 bg-gradient-to-br from-violet-500/20 via-primary/20 to-pink-500/20 rounded-3xl blur-2xl" />
              
              <div className={cn(
                "relative rounded-2xl overflow-hidden shadow-2xl",
                isDarkMode 
                  ? "bg-[#12121a] border border-white/10" 
                  : "bg-white border border-slate-200"
              )}>
                {/* Chat header */}
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 border-b",
                  isDarkMode ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"
                )}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white dark:border-[#12121a]" />
                  </div>
                  <div className="flex-1">
                    <div className={cn(
                      "text-sm font-semibold",
                      isDarkMode ? "text-white" : "text-slate-900"
                    )}>
                      {p.chat.title}
                    </div>
                    <div className={cn(
                      "text-xs",
                      isDarkMode ? "text-white/50" : "text-slate-500"
                    )}>
                      {p.chat.taskId}
                    </div>
                  </div>
                </div>

                {/* Chat messages area */}
                <div className={cn(
                  "p-4 h-[380px] overflow-hidden relative",
                  isDarkMode ? "bg-[#0a0a12]" : "bg-slate-50"
                )}>
                  {/* Today divider */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("flex-1 h-px", isDarkMode ? "bg-white/10" : "bg-slate-200")} />
                    <span className={cn("text-xs px-2", isDarkMode ? "text-white/40" : "text-slate-400")}>
                      {p.chat.today}
                    </span>
                    <div className={cn("flex-1 h-px", isDarkMode ? "bg-white/10" : "bg-slate-200")} />
                  </div>

                  {/* Messages */}
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {p.chat.messages.slice(0, visibleMessages).map((msg: { from: string; text: string; time: string }, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "flex",
                            msg.from === 'user' ? "justify-end" : "justify-start"
                          )}
                        >
                          <div className={cn(
                            "max-w-[80%] rounded-2xl px-3.5 py-2.5",
                            msg.from === 'user'
                              ? "bg-primary text-white rounded-br-md"
                              : isDarkMode
                                ? "bg-white/10 text-white rounded-bl-md"
                                : "bg-white text-slate-900 rounded-bl-md shadow-sm"
                          )}>
                            {msg.from === 'manager' && (
                              <div className={cn(
                                "text-[10px] font-semibold mb-1",
                                isDarkMode ? "text-violet-400" : "text-violet-600"
                              )}>
                                {p.chat.managerName}
                              </div>
                            )}
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <div className={cn(
                              "flex items-center justify-end gap-1 mt-1",
                              msg.from === 'user' ? "text-white/70" : isDarkMode ? "text-white/40" : "text-slate-400"
                            )}>
                              <span className="text-[10px]">{msg.time}</span>
                              {msg.from === 'user' && <CheckCheck className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    <AnimatePresence>
                      {isTyping && visibleMessages < p.chat.messages.length && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <TypingIndicator isDarkMode={isDarkMode} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom fade */}
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-16 pointer-events-none",
                    isDarkMode 
                      ? "bg-gradient-to-t from-[#0a0a12] to-transparent" 
                      : "bg-gradient-to-t from-slate-50 to-transparent"
                  )} />
                </div>

                {/* Chat input */}
                <div className={cn(
                  "flex items-center gap-2 px-4 py-3 border-t",
                  isDarkMode ? "border-white/10 bg-[#12121a]" : "border-slate-100 bg-white"
                )}>
                  <div className={cn(
                    "flex-1 px-4 py-2.5 rounded-full text-sm",
                    isDarkMode ? "bg-white/5 text-white/50" : "bg-slate-100 text-slate-400"
                  )}>
                    {p.chat.placeholder}
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg shadow-primary/30"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-medium shadow-lg shadow-green-500/30"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {p.badges[0]}
              </motion.div>
            </motion.div>
            </motion.div>

            {/* Main Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative"
            >
              {/* Dashboard glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-violet-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50" />
              
              {/* Browser window mockup */}
              <div className={cn(
                "relative rounded-2xl overflow-hidden shadow-2xl",
                isDarkMode 
                  ? "bg-[#0d0d12] border border-white/10" 
                  : "bg-white border border-slate-200"
              )}>
                {/* Browser header */}
                <div className={cn(
                  "flex items-center gap-2 px-4 py-3 border-b",
                  isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                )}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  
                  <div className={cn(
                    "flex-1 mx-4 px-4 py-1.5 rounded-lg text-sm",
                    isDarkMode ? "bg-white/5 text-white/60" : "bg-slate-100 text-slate-500"
                  )}>
                    <span className="text-green-500">🔒</span> app.web-impuls.com
                  </div>
                  
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {p.userName.charAt(0)}
                  </div>
                </div>

                {/* Dashboard content */}
                <div className={cn(
                  "p-4 md:p-6",
                  isDarkMode ? "bg-[#0a0a0f]" : "bg-slate-50"
                )}>
                  {/* Top navigation - compact */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {/* Logo */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="px-1.5 py-0.5 bg-yellow-400 rounded text-black font-black text-xs">WEB</span>
                        <span className="font-semibold text-xs text-primary">Impuls</span>
                        <span className="text-primary text-sm">▸</span>
                      </div>
                      
                      {/* Nav items - compact */}
                      <div className="hidden md:flex items-center">
                        {[
                          { icon: LayoutDashboard, label: p.nav.dashboard, active: true },
                          { icon: FolderKanban, label: p.nav.projects },
                          { icon: CheckSquare, label: p.nav.tasks },
                          { icon: CreditCard, label: p.nav.payments },
                          { icon: Headphones, label: p.nav.support },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 text-xs whitespace-nowrap",
                              item.active 
                                ? "text-primary" 
                                : isDarkMode 
                                  ? "text-white/60" 
                                  : "text-slate-600"
                            )}
                          >
                            <item.icon className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Notification bell with badge */}
                      <div className="relative">
                        <Bell className={cn("w-4 h-4", isDarkMode ? "text-white/60" : "text-slate-500")} />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">1</span>
                      </div>
                      {/* User avatar */}
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                        {p.userName.charAt(0)}
                      </div>
                    </div>
                  </div>

                  {/* Welcome message */}
                  <div className="mb-5">
                    <h3 className={cn(
                      "text-lg font-bold italic mb-0.5",
                      isDarkMode ? "text-white" : "text-slate-900"
                    )}>
                      {p.welcome}, {p.userName}! 👋
                    </h3>
                    <p className={cn(
                      "text-xs",
                      isDarkMode ? "text-white/50" : "text-slate-500"
                    )}>
                      {p.subtitle}
                    </p>
                  </div>

                  {/* Quick actions - with dashed borders */}
                  <div className="flex flex-wrap justify-center md:grid md:grid-cols-5 gap-2 mb-4">
                    {[
                      { icon: FolderKanban, label: p.actions[0], color: 'bg-primary' },
                      { icon: Plus, label: p.actions[1], color: 'bg-yellow-500' },
                      { icon: FolderKanban, label: p.actions[2], color: 'bg-cyan-500' },
                      { icon: CreditCard, label: p.actions[3], color: 'bg-green-500' },
                      { icon: Clock, label: p.actions[4], color: 'bg-amber-500' },
                    ].map((action, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-2xl border border-dashed w-[calc(33.333%-0.5rem)] md:w-auto",
                          isDarkMode 
                            ? "border-white/20" 
                            : "border-slate-300"
                        )}
                      >
                        <div className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center",
                          action.color
                        )}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className={cn(
                          "text-[10px] font-medium text-center leading-tight",
                          isDarkMode ? "text-white/70" : "text-slate-600"
                        )}>
                          {action.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {[
                      { icon: FolderKanban, darkColor: 'text-primary', lightColor: 'text-violet-600', darkBg: 'bg-primary/10', lightBg: 'bg-violet-100' },
                      { icon: CheckSquare, darkColor: 'text-cyan-400', lightColor: 'text-cyan-600', darkBg: 'bg-cyan-400/10', lightBg: 'bg-cyan-100' },
                      { icon: Clock, darkColor: 'text-amber-400', lightColor: 'text-amber-600', darkBg: 'bg-amber-400/10', lightBg: 'bg-amber-100' },
                      { icon: CheckSquare, darkColor: 'text-green-400', lightColor: 'text-green-600', darkBg: 'bg-green-400/10', lightBg: 'bg-green-100' },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-2xl border",
                          isDarkMode 
                            ? "bg-white/[0.02] border-white/10" 
                            : "bg-white border-slate-200"
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", isDarkMode ? stat.darkBg : stat.lightBg)}>
                          <stat.icon className={cn("w-4 h-4", isDarkMode ? stat.darkColor : stat.lightColor)} />
                        </div>
                        <div className="min-w-0">
                          <span className={cn(
                            "text-lg font-bold block",
                            isDarkMode ? "text-white" : "text-slate-900"
                          )}>
                            {p.statsValues[i]}
                          </span>
                          <span className={cn(
                            "text-[9px] block truncate",
                            isDarkMode ? "text-white/50" : "text-slate-500"
                          )}>
                            {p.stats[i]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Projects and Tasks - two columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Projects */}
                    <div className={cn(
                      "p-4 rounded-2xl border",
                      isDarkMode 
                        ? "bg-white/[0.02] border-white/10" 
                        : "bg-white border-slate-200"
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <FolderKanban className={cn("w-4 h-4", isDarkMode ? "text-white/60" : "text-slate-500")} />
                          <span className={cn(
                            "text-sm font-semibold",
                            isDarkMode ? "text-white" : "text-slate-900"
                          )}>
                            {p.myProjects}
                          </span>
                        </div>
                        <span className="text-xs text-primary">{p.allProjects}</span>
                      </div>
                      
                      {p.projects.map((project: string, i: number) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl mb-2 last:mb-0",
                            isDarkMode ? "bg-white/5" : "bg-slate-50"
                          )}
                        >
                          <div className="min-w-0">
                            <div className={cn(
                              "text-sm font-medium truncate",
                              isDarkMode ? "text-white" : "text-slate-900"
                            )}>
                              {project}
                            </div>
                            <div className={cn(
                              "text-xs",
                              isDarkMode ? "text-white/50" : "text-slate-500"
                            )}>
                              Webapp
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={cn(
                              "px-2 py-1 text-[10px] font-medium rounded-lg",
                              isDarkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
                            )}>
                              {p.statuses.active}
                            </span>
                            <ExternalLink className={cn("w-4 h-4", isDarkMode ? "text-white/40" : "text-slate-400")} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tasks */}
                    <div className={cn(
                      "p-4 rounded-2xl border",
                      isDarkMode 
                        ? "bg-white/[0.02] border-white/10" 
                        : "bg-white border-slate-200"
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <CheckSquare className={cn("w-4 h-4", isDarkMode ? "text-white/60" : "text-slate-500")} />
                          <span className={cn(
                            "text-sm font-semibold",
                            isDarkMode ? "text-white" : "text-slate-900"
                          )}>
                            {p.recentTasks}
                          </span>
                        </div>
                        <span className="text-xs text-primary">{p.allTasks}</span>
                      </div>
                      
                      {p.tasks.map((task: { id: string; name: string; status: string }, i: number) => (
                        <div
                          key={i}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl mb-2",
                            isDarkMode ? "bg-white/5" : "bg-slate-50"
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={cn(
                              "text-xs flex-shrink-0",
                              isDarkMode ? "text-white/40" : "text-slate-400"
                            )}>
                              {task.id}
                            </span>
                            <span className={cn(
                              "text-sm truncate",
                              isDarkMode ? "text-white" : "text-slate-900"
                            )}>
                              {task.name}
                            </span>
                          </div>
                          <span className={cn(
                            "px-2 py-1 text-[10px] font-medium rounded-lg whitespace-nowrap flex-shrink-0",
                            task.status === 'new' 
                              ? isDarkMode 
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50" 
                                : "bg-cyan-100 text-cyan-700 border border-cyan-300"
                              : task.status === 'inProgress'
                                ? isDarkMode 
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-amber-100 text-amber-700"
                                : task.status === 'done'
                                  ? isDarkMode 
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-green-100 text-green-700"
                                  : isDarkMode 
                                    ? "bg-white/10 text-white/60"
                                    : "bg-slate-100 text-slate-600"
                          )}>
                            {p.taskStatuses[task.status as keyof typeof p.taskStatuses]}
                          </span>
                        </div>
                      ))}

                      {/* Create task button */}
                      <div className={cn(
                        "mt-2 p-3 rounded-xl border border-dashed text-center",
                        isDarkMode 
                          ? "border-white/20 text-white/50" 
                          : "border-slate-300 text-slate-400"
                      )}>
                        <span className="text-xs">{p.createTask}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fade out at bottom - sinking effect like Firebase */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-40 pointer-events-none",
                  isDarkMode 
                    ? "bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/90 to-transparent" 
                    : "bg-gradient-to-t from-slate-100 via-slate-100/90 to-transparent"
                )} />
              </div>

              {/* Floating badge - bottom left */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-20 -left-4 lg:-left-8 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-violet-500 text-white text-xs font-medium shadow-lg shadow-primary/30"
              >
                <CheckSquare className="w-3 h-3" />
                {p.badges[1]}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 text-base font-semibold bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/25"
          >
            <Link href="https://app.web-impuls.com" target="_blank">
              {p.cta}
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}


