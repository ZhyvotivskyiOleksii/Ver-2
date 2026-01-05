'use client';

import Link from 'next/link';
import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { WebImpulsHeader } from '@/components/layout/web-impuls-header';
import { Footer } from '@/components/layout/footer';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Sparkles,
  MessageSquare,
  Globe,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { ContactIllustration } from '@/components/floating-illustrations';

// Social icons
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

type SectionProps = {
  children: ReactNode;
  className?: string;
};

// Seamless section wrapper - no harsh background transitions
const Section = ({ children, className }: SectionProps) => (
  <section className={cn('relative overflow-hidden', className)}>
    <div className="relative z-10">{children}</div>
  </section>
);

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const params = useParams();
  const locale = params.locale as string;
  const t = (translations as any)[locale] || translations.ua;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          sourcePage: 'contact',
          locale,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }
      
      setIsSubmitted(true);
      setFormState({ name: '', email: '', phone: '', service: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Помилка відправки. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t.contactPhone || 'Телефон',
      value: '+48 123 456 789',
      subtitle: t.contactPhoneSubtitle || 'Пн-Пт: 9:00 - 18:00',
      color: 'from-green-500 to-emerald-600',
      href: 'tel:+48123456789',
    },
    {
      icon: Mail,
      title: t.contactEmail || 'Email',
      value: 'hello@webimpuls.eu',
      subtitle: t.contactEmailSubtitle || 'Відповідаємо протягом 24 годин',
      color: 'from-blue-500 to-cyan-600',
      href: 'mailto:hello@webimpuls.eu',
    },
    {
      icon: MapPin,
      title: t.contactLocation || 'Локація',
      value: t.contactLocationValue || 'Польща, Європа',
      subtitle: t.contactLocationSubtitle || 'Працюємо віддалено по всьому світу',
      color: 'from-violet-500 to-purple-600',
      href: '#',
    },
    {
      icon: Clock,
      title: t.contactHours || 'Години роботи',
      value: t.contactHoursValue || 'Пн-Пт: 9:00 - 18:00',
      subtitle: t.contactHoursSubtitle || 'Часовий пояс: CET (Європа)',
      color: 'from-orange-500 to-amber-600',
      href: '#',
    },
  ];

const services = [
    { value: 'landing', label: t.serviceLanding || 'Landing Page' },
    { value: 'corporate', label: t.serviceCorporate || 'Корпоративний сайт' },
    { value: 'ecommerce', label: t.serviceEcommerce || 'Інтернет-магазин' },
    { value: 'redesign', label: t.serviceRedesign || 'Редизайн сайту' },
    { value: 'support', label: t.serviceSupport || 'Підтримка сайту' },
    { value: 'other', label: t.serviceOther || 'Інше' },
  ];

const followersLabel = t.contactFollowers || 'followers';

const socialStats = [
  { label: 'Telegram', handle: '@WebImpuls', followers: '3K+', href: 'https://t.me/WebImpuls', icon: TelegramIcon },
  { label: 'LinkedIn', handle: 'WebImpuls Studio', followers: '1.4K+', href: 'https://www.linkedin.com/in/oleksii-zhyvotivskyi-9b9085303/', icon: LinkedinIcon },
  { label: 'Facebook', handle: 'Web Impuls', followers: '2.1K+', href: 'https://www.facebook.com/profile.php?id=61559794323482&locale=ru_RU', icon: FacebookIcon },
  { label: 'Instagram', handle: '@webimpuls', followers: '4.5K+', href: 'https://instagram.com/webimpuls', icon: InstagramIcon },
];

const infoCardClass =
  "group relative overflow-hidden rounded-[28px] border border-white/40 bg-white text-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 dark:bg-[#12131c] dark:border-white/10 dark:text-white dark:shadow-none";
const panelClass =
  "rounded-[32px] border border-white/40 bg-white/95 shadow-[0_40px_90px_rgba(15,23,42,0.12)] dark:bg-[#0d0f17] dark:border-white/10 dark:shadow-none";
const fieldClass =
  "rounded-2xl bg-white/95 border border-black/[0.04] shadow-[0_15px_60px_rgba(15,23,42,0.07)] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-transparent text-slate-900 placeholder:text-slate-400 dark:bg-white/10 dark:border-white/5 dark:text-white dark:placeholder:text-white/50 transition-all";

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <WebImpulsHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center pt-[var(--header-height)]">
          {/* Full-page seamless background - fixed position */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Soft gradient orbs that extend through the page */}
            <motion.div 
              className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full opacity-40 dark:opacity-15 blur-[100px]"
              style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 60%)' }}
              animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div 
              className="absolute top-1/4 -right-1/4 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full opacity-35 dark:opacity-12 blur-[100px]"
              style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, transparent 60%)' }}
              animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            <motion.div 
              className="absolute bottom-1/4 left-1/3 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full opacity-30 dark:opacity-8 blur-[80px]"
              style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 60%)' }}
              animate={{ x: [0, 20, 0], y: [0, -25, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
          </div>


          <div className="container relative z-10 pt-4 pb-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left - Text content (first on mobile) */}
              <div className="text-center lg:text-left order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="page-eyebrow mb-6"
                >
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>{t.contactBadge || "Зв'яжіться з нами"}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="page-hero-title mb-6 uppercase"
                >
                  <span className="text-foreground">{t.contactHeroTitle1 || "Давайте створимо"} </span>
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    {t.contactHeroTitle2 || "щось неймовірне"}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="page-hero-subtitle mb-8"
                >
                  {t.contactHeroDesc || "Маєте ідею? Розкажіть нам про неї! Ми перетворимо ваше бачення на сучасний, ефективний веб-сайт."}
                </motion.p>
              </div>

              {/* Right - Illustration (second on mobile) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="order-2 h-48 md:h-auto"
              >
                <ContactIllustration />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <Section className="py-12 md:py-16">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.title}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className={`${infoCardClass} p-6 min-h-[210px]`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-[0.12] blur-3xl transition-opacity duration-300 group-hover:opacity-30`} />
                  <div className="relative z-10 space-y-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-[0_15px_35px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-slate-500 dark:text-white/60">{item.title}</h3>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{item.value}</p>
                      <p className="text-sm text-slate-500 dark:text-white/60">{item.subtitle}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </Section>

        {/* Main Contact Section */}
        <Section className="py-16 md:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left - Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className={`${panelClass} p-6 md:p-8 space-y-5`}
              >
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                    {t.contactFormTitle || "Напишіть нам"}
                  </h2>
                  <p className="text-slate-500 dark:text-white/60">
                    {t.contactFormDesc || "Заповніть форму і ми зв'яжемося з вами протягом 24 годин"}
                  </p>
                </div>

                <div className="rounded-[32px] border border-white/40 bg-white/95 shadow-[0_40px_90px_rgba(15,23,42,0.12)] dark:bg-[#0d0f17] dark:border-white/10 dark:shadow-none p-8 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t.contactSEOTitle || 'Чим ми допоможемо вашому бізнесу'}</h3>
                  <p className="text-slate-600 dark:text-white/70">
                    {t.contactSEOIntro || 'Web Impuls створює сучасні digital-рішення: лендінги, корпоративні сайт, e-commerce та веб-додатки. Працюємо на ринок Європи та США, поєднуючи креатив, швидкість і результат.'}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[t.contactSEOList1 || 'UX/UI дизайн на основі аналітики', t.contactSEOList2 || 'Performance оптимізація Core Web Vitals', t.contactSEOList3 || 'Створення multilingual контенту та адаптація локалей', t.contactSEOList4 || 'Комплексні digital-стратегії для B2B та e-commerce'].map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                        <p className="text-slate-600 dark:text-white/70 text-sm">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                      {t.contactSuccessTitle || "Дякуємо за повідомлення!"}
                    </h3>
                    <p className="text-green-600 dark:text-green-500">
                      {t.contactSuccessDesc || "Ми отримали ваш запит і зв'яжемося з вами найближчим часом."}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.contactLabelName || "Ім'я"} *</label>
                        <Input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder={t.contactPlaceholderName || "Ваше ім'я"}
                          className={cn(fieldClass, 'h-12')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <Input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder={t.contactPlaceholderEmail || "your@email.com"}
                          className={cn(fieldClass, 'h-12')}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.contactLabelPhone || "Телефон"}</label>
                        <Input
                          type="tel"
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          placeholder="+48 123 456 789"
                          className={cn(fieldClass, 'h-12')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.contactLabelService || "Послуга"}</label>
                        <div className="relative">
                          <select
                            value={formState.service}
                            onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                            className={cn(
                              fieldClass,
                              'w-full h-12 px-4 pr-12 appearance-none cursor-pointer bg-white/95 dark:bg-white/10'
                            )}
                          >
                            <option value="">{t.contactSelectService || "Оберіть послугу"}</option>
                            {services.map(service => (
                              <option key={service.value} value={service.value}>{service.label}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400 dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.contactLabelMessage || "Повідомлення"} *</label>
                      <textarea
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder={t.contactPlaceholderMessage || "Розкажіть про ваш проект..."}
                        className={cn(
                          fieldClass,
                          'w-full px-4 py-3 min-h-[140px] bg-white/95 dark:bg-white/10 resize-none'
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 mt-2"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {t.contactSubmit || "Надіслати повідомлення"}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </motion.div>

              {/* Right - Info & Social */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="space-y-8"
              >
                {/* Why Choose Us */}
                <div className="rounded-[32px] border border-white/40 bg-gradient-to-br from-[#151828] via-[#1b1f33] to-[#12131c] text-white p-8 shadow-[0_40px_110px_rgba(8,9,14,0.6)] space-y-4">
                  <h3 className="text-2xl font-bold mb-6">{t.contactWhyUs || "Чому обирають нас?"}</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Zap, text: t.contactWhyUs1 || "Швидка розробка — від 7 днів" },
                      { icon: Globe, text: t.contactWhyUs2 || "Працюємо з клієнтами по всій Європі" },
                      { icon: Sparkles, text: t.contactWhyUs3 || "Сучасний дизайн та технології" },
                      { icon: CheckCircle, text: t.contactWhyUs4 || "Гарантія якості та підтримка" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: 0.15 + index * 0.05 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-white/85">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className={`${panelClass} p-8 space-y-6`}>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{t.contactSocial || "Ми в соцмережах"}</h3>
                  <p className="text-slate-500 dark:text-white/70">
                    {t.contactSocialDesc || "Слідкуйте за нами та будьте в курсі новин"}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {socialStats.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-left shadow-[0_20px_45px_rgba(15,23,42,0.12)] dark:bg-white/5 dark:border-white/10 dark:shadow-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-slate-700 dark:text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{item.label}</p>
                            <p className="text-xs text-slate-500 dark:text-white/60">{item.handle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.followers}</span>
                          <p className="text-xs text-slate-400">{followersLabel}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-white/60">
                    {t.contactSocialCTA || 'Cпілкуємося у Telegram, LinkedIn, Instagram та Facebook — посилання вище.'}
                  </p>
                </div>

                {/* Quick Response */}
                <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-[0_35px_80px_rgba(249,115,22,0.35)]">
                  <h3 className="text-xl font-bold mb-2">{t.contactQuickResponse || "Швидка відповідь"}</h3>
                  <p className="text-white/80 mb-4">
                    {t.contactQuickResponseDesc || "Потрібна термінова консультація? Напишіть нам в месенджер!"}
                  </p>
                  <a
                    href="https://t.me/webimpuls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-orange-600 font-semibold hover:bg-white/90 transition-colors"
                  >
                    <TelegramIcon className="w-5 h-5" />
                    {t.contactTelegram || "Написати в Telegram"}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section className="py-20">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t.contactCTATitle || "Готові почати проект?"}
              </h2>
              <p className="text-white/70 dark:text-muted-foreground mb-8 max-w-xl mx-auto">
                {t.contactCTADesc || "Замовте безкоштовну консультацію та отримайте оцінку вашого проекту протягом 24 годин"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-gradient-to-r from-primary to-violet-600">
                  <Phone className="w-5 h-5 mr-2" />
                  {t.contactCTACall || "Замовити дзвінок"}
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg">
                  <Mail className="w-5 h-5 mr-2" />
                  hello@webimpuls.eu
                </Button>
              </div>
            </motion.div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
