/**
 * =====================================================
 * LIQUID GLASS COMPONENT (Next.js version)
 * =====================================================
 * 
 * Цей файл призначений для копіювання у ваш Next.js проект.
 * Шлях: @/components/ui/liquid-glass.tsx
 * 
 * Ефект реалістичного скла з преломленням світла.
 * 
 * =====================================================
 */

'use client';

import { useEffect, ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  /** Blur radius in px (for header compatibility) */
  blurRadius?: number;
  /** Show specular highlights */
  highlights?: boolean;
  /** Show grain texture */
  grain?: boolean;
  /** Show outline border */
  outlined?: boolean;
  /** Static mode - no animations */
  static?: boolean;
}

export function LiquidGlass({
  children,
  className,
  rounded = '3xl',
  blurRadius,
  highlights = true,
  grain = false,
  outlined = true,
  ...rest
}: LiquidGlassProps) {
  useEffect(() => {
    // Remove old filters and create new one with enhanced refraction
    const existingFilter = document.getElementById('liquid-glass-filter-svg-v3');
    if (existingFilter) return;
    
    // Remove old versions
    document.getElementById('liquid-glass-filter-svg')?.remove();
    document.getElementById('liquid-glass-filter-svg-v2')?.remove();
    
    const svg = `
      <svg id="liquid-glass-filter-svg-v3" style="position:absolute;width:0;height:0;pointer-events:none;">
        <defs>
          <filter id="liquid-glass-distortion" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="3" seed="7" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="1.2" result="blurredNoise" />
            <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="45" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    `;
    document.body.insertAdjacentHTML('afterbegin', svg);
  }, []);

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  const blur = blurRadius !== undefined ? `blur(${blurRadius}px)` : 'blur(0.5px) saturate(1.1)';

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        roundedClasses[rounded],
        className
      )}
      style={{
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
      {...rest}
    >
      {/* Distortion layer - clear refraction without heavy blur */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backdropFilter: blur,
          WebkitBackdropFilter: blur,
          filter: 'url(#liquid-glass-distortion)',
        }}
      />

      {/* Very subtle glass tint */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
        }}
      />

      {/* Specular highlight - thin edge */}
      {highlights && (
        <div
          className={cn(
            'absolute inset-0 z-[2] pointer-events-none',
            roundedClasses[rounded]
          )}
          style={{
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2), inset -1px -1px 0 rgba(255,255,255,0.05)',
            ...(outlined ? {
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              borderLeft: 'none',
              borderBottom: 'none',
            } : {
              border: 'none',
            }),
          }}
        />
      )}

      {/* Optional grain texture */}
      {grain && (
        <div
          className="absolute inset-0 z-[2] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-[3]">
        {children}
      </div>
    </div>
  );
}