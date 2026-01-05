'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  CheckCircle, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  Loader2,
  Rocket,
  Globe,
  ShoppingCart,
  Smartphone,
  RefreshCw,
  Headphones,
  PartyPopper,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { translations } from '@/lib/translations';

// Service icons mapping
const serviceIcons: Record<string, any> = {
  landing: Rocket,
  corporate: Globe,
  ecommerce: ShoppingCart,
  webapp: Smartphone,
  redesign: RefreshCw,
  support: Headphones,
};

export interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  sourcePage?: string;
}

// Confetti particle component
const ConfettiParticle = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    initial={{ y: -10, x, opacity: 1, rotate: 0 }}
    animate={{ 
      y: 300, 
      x: x + (Math.random() - 0.5) * 80,
      opacity: 0,
      rotate: Math.random() * 720 - 360
    }}
    transition={{ duration: 1.5, delay, ease: 'easeOut' }}
    className="absolute top-0 w-2 h-2 rounded-sm"
    style={{
      background: ['#8b5cf6', '#ec4899', '#06b6d4', '#22c55e', '#f59e0b'][Math.floor(Math.random() * 5)],
    }}
  />
);

export function OrderModal({ 
  isOpen, 
  onClose, 
  defaultService,
  sourcePage = 'unknown'
}: OrderModalProps) {
  const params = useParams();
  const locale = (Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale) || 'ua';
  const t = (translations as any)[locale] || translations.ua;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: defaultService || '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (defaultService) {
      setFormState(prev => ({ ...prev, service: defaultService }));
    }
  }, [defaultService]);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setError('');
      setShowConfetti(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const services = [
    { id: 'landing', name: 'Landing' },
    { id: 'corporate', name: t.serviceCorporateTitle?.split(' ')[0] || 'Corporate' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'webapp', name: 'Web App' },
    { id: 'redesign', name: 'Redesign' },
    { id: 'support', name: t.serviceSupportTitle?.split(' ')[0] || 'Support' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.service) {
      setError(t.orderSelectService || 'Оберіть послугу');
      return;
    }
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          sourcePage,
          locale,
          timestamp: new Date().toISOString(),
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please try again.');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }
      
      setIsSubmitted(true);
      setShowConfetti(true);
      setFormState({ name: '', email: '', phone: '', service: '', message: '' });
      
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setShowConfetti(false);
      }, 3000);
    } catch (err: any) {
      console.error('Order submit error:', err);
      setError(err.message || 'Помилка відправки');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all";

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative w-full max-w-md"
          >
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/40 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              
              {/* Close button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </motion.button>

              <div className="relative p-5">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex flex-col items-center justify-center py-8 text-center relative overflow-hidden"
                    >
                      {/* Confetti */}
                      {showConfetti && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {[...Array(20)].map((_, i) => (
                            <ConfettiParticle key={i} delay={i * 0.03} x={(i % 8) * 50 - 150} />
                          ))}
                        </div>
                      )}
                      
                      {/* Success Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.1 }}
                        className="relative mb-4"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 w-16 h-16 rounded-full bg-green-500/20"
                        />
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                      
                      <div className="flex items-center gap-2 mb-1">
                        <PartyPopper className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-xl font-bold text-white">{t.orderSuccess || 'Заявку отримано!'}</h3>
                        <PartyPopper className="w-5 h-5 text-yellow-400 scale-x-[-1]" />
                      </div>
                      <p className="text-white/60 text-sm mb-3">{t.orderSuccessMessage || "Ми зв'яжемось з вами"}</p>
                      <div className="flex items-center gap-1 text-pink-400 text-sm">
                        <Heart className="w-3 h-3 fill-current" />
                        <span>{t.orderThanks || 'Дякуємо за довіру!'}</span>
                        <Heart className="w-3 h-3 fill-current" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Header */}
                      <div className="text-center mb-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 15 }}
                          className="inline-block mb-3"
                        >
                          <Image
                            src="/icons/logo-web.svg"
                            alt="Web Impuls Logo"
                            width={120}
                            height={45}
                            className="h-10 w-auto mx-auto"
                          />
                        </motion.div>
                        <h2 className="text-xl font-bold text-white mb-1">
                          {t.orderModalTitle || 'Замовити проєкт'}
                        </h2>
                        <p className="text-white/50 text-sm">
                          {t.orderModalSubtitle || "Заповніть форму і ми зв'яжемось з вами"}
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Name & Email row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5">
                              <User className="w-3 h-3" />
                              {t.orderName || "Ім'я"} *
                            </label>
                            <input
                              type="text"
                              required
                              value={formState.name}
                              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                              placeholder={t.orderNamePlaceholder || "Ваше ім'я"}
                              className={inputClasses}
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5">
                              <Mail className="w-3 h-3" />
                              Email *
                            </label>
                            <input
                              type="email"
                              required
                              value={formState.email}
                              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                              placeholder="email@example.com"
                              className={inputClasses}
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5">
                            <Phone className="w-3 h-3" />
                            {t.orderPhone || 'Телефон'}
                          </label>
                          <input
                            type="tel"
                            value={formState.phone}
                            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                            placeholder="+380 ..."
                            className={inputClasses}
                          />
                        </div>

                        {/* Service Selection - Only buttons */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-2">
                            <Sparkles className="w-3 h-3" />
                            {t.orderService || 'Послуга'} *
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {services.map((service) => {
                              const Icon = serviceIcons[service.id] || Sparkles;
                              const isSelected = formState.service === service.id;
                              return (
                                <motion.button
                                  key={service.id}
                                  type="button"
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => setFormState({ ...formState, service: service.id })}
                                  className={cn(
                                    "p-2.5 rounded-xl border transition-all duration-200 text-center",
                                    isSelected 
                                      ? "bg-purple-500/25 border-purple-500/60 shadow-lg shadow-purple-500/20" 
                                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                  )}
                                >
                                  <Icon className={cn(
                                    "w-5 h-5 mx-auto mb-1",
                                    isSelected ? "text-purple-400" : "text-white/50"
                                  )} />
                                  <span className={cn(
                                    "text-[10px] font-medium",
                                    isSelected ? "text-purple-300" : "text-white/60"
                                  )}>
                                    {service.name}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Message */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1.5">
                            <MessageSquare className="w-3 h-3" />
                            {t.orderMessage || 'Коментар'}
                          </label>
                          <textarea
                            rows={2}
                            value={formState.message}
                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                            placeholder={t.orderMessagePlaceholder || 'Коротко про проєкт...'}
                            className={cn(inputClasses, "resize-none")}
                          />
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                          {error && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2"
                            >
                              {error}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">{t.orderSending || 'Відправляємо...'}</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span className="text-sm">{t.orderSubmit || 'Відправити'}</span>
                            </>
                          )}
                        </motion.button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
