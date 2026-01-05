
'use client';

import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { useReducedMotion } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';

export function TypingAnimation() {
  const el = useRef<HTMLSpanElement>(null);
  const typed = useRef<Typed | null>(null);
  const reduceMotion = useReducedMotion();
  const params = useParams();
  const locale = Array.isArray((params as any).locale) ? (params as any).locale[0] : (params as any).locale;
  const t = (translations as any)[locale] || translations.ua;

  useEffect(() => {
    if (reduceMotion) {
      if(el.current) el.current.textContent = t.heroTitleImpuls;
      return;
    }

    const options = {
      strings: [t.heroAnimatedDeveloper, t.heroAnimatedCreative, t.heroAnimatedDesign, t.heroTitleImpuls],
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 1500,
      startDelay: 500,
      loop: false,
      showCursor: false,
      onComplete: (self: Typed) => {
        // After the last string, keep it static
        if (self.arrayPos === self.strings.length - 1) {
            self.stop();
            if(el.current) {
              el.current.textContent = t.heroTitleImpuls;
            }
        }
      },
    };

    if (el.current) {
      typed.current = new Typed(el.current, options);
    }

    return () => {
      typed.current?.destroy();
    };
  }, [reduceMotion, t]);

  return (
      <span ref={el} className="text-foreground" />
  );
}
