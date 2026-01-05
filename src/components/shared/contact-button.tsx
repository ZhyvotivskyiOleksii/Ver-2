'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const contactOptions = [
  {
    name: 'Telegram',
    href: 'https://t.me/WebImpuls',
    icon: '/img/footer/telegram.svg',
    color: 'bg-[#0088cc]',
  },
  {
    name: 'Viber',
    href: 'viber://chat?number=%2B48572245574',
    icon: '/img/footer/viber.svg',
    color: 'bg-[#7360f2]',
  },
  {
    name: 'Messenger',
    href: 'https://www.facebook.com/people/Web-impuls/61559794323482/',
    icon: '/img/footer/messenger.svg',
    color: 'bg-gradient-to-br from-[#00B2FF] to-[#006AFF]',
  },
  {
    name: 'Phone',
    href: 'tel:+48572245574',
    icon: '/img/footer/phone.svg',
    color: 'bg-green-500',
  },
];

export function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Contact Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 flex flex-col gap-3 items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={option.href}
                  target={option.href.startsWith('http') ? '_blank' : undefined}
                  rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-full shadow-lg",
                    "hover:scale-105 transition-transform",
                    option.color
                  )}
                >
                  <span className="text-white text-sm font-medium">{option.name}</span>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Image
                      src={option.icon}
                      alt={option.name}
                      width={20}
                      height={20}
                      className="brightness-0 invert"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center",
          "bg-gradient-to-br from-primary to-accent",
          "hover:shadow-xl hover:shadow-primary/25 transition-shadow"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulse Animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        )}

        {/* Badge */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
            <span className="text-[10px] font-bold text-white">24</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}




