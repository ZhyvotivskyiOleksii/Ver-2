'use client';

import { motion } from 'framer-motion';

// Contact Page - Chat bubbles and messages
export function ContactIllustration() {
  return (
    <div className="relative w-full h-full min-h-[120px] md:min-h-[300px]">
      {/* Main chat bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-28 h-20 md:w-64 md:h-48 rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#6d28d9] via-[#a855f7] to-[#f472b6] shadow-xl md:shadow-2xl shadow-[#7c3aed]/25 p-2 md:p-6"
        >
          <div className="space-y-1 md:space-y-3">
            <div className="h-2 md:h-4 w-3/4 bg-white/30 rounded-full" />
            <div className="h-2 md:h-4 w-1/2 bg-white/30 rounded-full" />
            <div className="h-2 md:h-4 w-2/3 bg-white/30 rounded-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Small chat bubble - top right */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-2 right-2 md:top-4 md:right-4"
      >
        <motion.div
          animate={{ y: [0, -5, 0], x: [0, 3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="w-16 h-12 md:w-36 md:h-24 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg md:shadow-xl shadow-cyan-500/20 p-2 md:p-4"
        >
          <div className="space-y-1 md:space-y-2">
            <div className="h-1.5 md:h-3 w-full bg-white/30 rounded-full" />
            <div className="h-1.5 md:h-3 w-2/3 bg-white/30 rounded-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Email icon - bottom left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-4 left-2 md:bottom-8 md:left-8"
      >
        <motion.div
          animate={{ y: [0, 5, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="w-10 h-8 md:w-24 md:h-20 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg md:shadow-xl shadow-pink-500/20 flex items-center justify-center"
        >
          <svg className="w-4 h-4 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Phone icon - top left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute top-6 left-2 md:top-12 md:left-12"
      >
        <motion.div
          animate={{ y: [0, -4, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="w-8 h-8 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-md md:shadow-lg shadow-emerald-500/20 flex items-center justify-center"
        >
          <svg className="w-4 h-4 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Pricing Page - Price tags and coins
export function PricingIllustration() {
  return (
    <div className="relative w-full h-full min-h-[120px] md:min-h-[300px]">
      {/* Main price card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-32 md:w-56 md:h-72 rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shadow-xl md:shadow-2xl shadow-[#2563eb]/30 p-2 md:p-6 flex flex-col"
        >
          <div className="text-white/60 text-[8px] md:text-sm font-medium">PRO</div>
          <div className="text-white text-lg md:text-4xl font-bold">$2,300</div>
          <div className="flex-1 mt-2 md:mt-4 space-y-1 md:space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="h-1 md:h-2 flex-1 bg-white/20 rounded-full" />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Secondary card - behind */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-[75%] -translate-y-[45%] -z-10"
      >
        <motion.div
          animate={{ y: [0, -4, 0], rotate: [-6, -4, -6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="w-20 h-28 md:w-48 md:h-64 rounded-xl md:rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg md:shadow-xl shadow-cyan-500/20 opacity-80"
        />
      </motion.div>

      {/* Floating coin */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute top-4 right-4 md:top-8 md:right-8"
      >
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 360] }}
          transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 8, repeat: Infinity, ease: 'linear' } }}
          className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-md md:shadow-lg shadow-yellow-500/30 flex items-center justify-center text-white font-bold text-sm md:text-xl"
        >
          $
        </motion.div>
      </motion.div>

      {/* Small tag */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-4 left-2 md:bottom-12 md:left-8"
      >
        <motion.div
          animate={{ y: [0, 5, 0], x: [0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="px-2 py-1 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-md md:shadow-lg shadow-emerald-500/20 text-white font-semibold text-[10px] md:text-sm"
        >
          -20%
        </motion.div>
      </motion.div>
    </div>
  );
}

// Services Page - Code and devices
export function ServicesIllustration() {
  return (
    <div className="relative w-full h-full min-h-[120px] md:min-h-[300px]">
      {/* Main browser window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ y: [0, -5, 0], rotate: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-32 h-24 md:w-72 md:h-52 rounded-xl md:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl md:shadow-2xl shadow-slate-900/50 overflow-hidden"
        >
          {/* Browser header */}
          <div className="h-4 md:h-8 bg-slate-700/50 flex items-center px-2 md:px-3 gap-1">
            <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-red-400" />
            <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-yellow-400" />
            <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-green-400" />
          </div>
          {/* Code lines */}
          <div className="p-2 md:p-4 space-y-1 md:space-y-2">
            <div className="flex gap-1 md:gap-2">
              <span className="text-purple-400 text-[8px] md:text-sm font-mono">const</span>
              <span className="text-cyan-400 text-[8px] md:text-sm font-mono">app</span>
            </div>
            <div className="h-1.5 md:h-3 w-3/4 bg-violet-500/30 rounded" />
            <div className="h-1.5 md:h-3 w-1/2 bg-cyan-500/30 rounded" />
            <div className="h-1.5 md:h-3 w-2/3 bg-pink-500/30 rounded" />
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile device */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-1/4 right-0 md:right-0"
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [5, 8, 5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="w-10 h-16 md:w-24 md:h-44 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] shadow-lg md:shadow-xl shadow-[#14b8a6]/30 p-1 md:p-2"
        >
          <div className="w-full h-full rounded-md md:rounded-xl bg-white/10 p-1 md:p-2">
            <div className="h-1 md:h-2 w-1/2 mx-auto bg-white/30 rounded-full mb-1" />
            <div className="space-y-0.5 md:space-y-1.5">
              <div className="h-1 md:h-1.5 w-full bg-white/20 rounded" />
              <div className="h-1 md:h-1.5 w-3/4 bg-white/20 rounded" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating code bracket */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-4 left-2 md:bottom-8 md:left-8"
      >
        <motion.div
          animate={{ y: [0, 6, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="w-8 h-8 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md md:shadow-lg shadow-cyan-500/30 flex items-center justify-center"
        >
          <span className="text-white font-mono text-sm md:text-2xl font-bold">{'</>'}</span>
        </motion.div>
      </motion.div>

      {/* React icon */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute top-2 left-4 md:top-4 md:left-16"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 md:w-14 md:h-14 rounded-full bg-[#61DAFB]/20 flex items-center justify-center"
        >
          <svg viewBox="-11 -10.5 22 21" className="w-5 h-5 md:w-10 md:h-10 text-[#61DAFB]">
            <circle r="2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1" fill="none">
              <ellipse rx="10" ry="4" />
              <ellipse rx="10" ry="4" transform="rotate(60)" />
              <ellipse rx="10" ry="4" transform="rotate(120)" />
            </g>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

// About Page - Team and achievements
export function AboutIllustration() {
  return (
    <div className="relative w-full h-full min-h-[120px] md:min-h-[300px]">
      {/* Main team card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-28 h-24 md:w-64 md:h-52 rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#6d28d9] via-[#a855f7] to-[#38bdf8] shadow-xl md:shadow-2xl shadow-[#7c3aed]/25 p-2 md:p-6"
        >
          {/* Avatar row */}
          <div className="flex -space-x-1.5 md:-space-x-3 mb-2 md:mb-4">
            {[
              'from-pink-400 to-rose-500',
              'from-cyan-400 to-blue-500',
              'from-emerald-400 to-green-500',
              'from-[#a855f7] to-[#c084fc]',
            ].map((gradient, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`w-5 h-5 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${gradient} border border-white/30 md:border-2 shadow-sm md:shadow-lg`}
              />
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
              className="w-5 h-5 md:w-12 md:h-12 rounded-full bg-white/20 border border-white/30 md:border-2 flex items-center justify-center text-white text-[8px] md:text-xs font-bold"
            >
              +5
            </motion.div>
          </div>
          <div className="text-white font-bold text-[10px] md:text-xl mb-0.5 md:mb-1">Web Impuls</div>
          <div className="text-white/60 text-[8px] md:text-sm">5+ років</div>
        </motion.div>
      </motion.div>

      {/* Achievement badge - top right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute top-2 right-2 md:top-4 md:right-4"
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="w-10 h-10 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg md:shadow-xl shadow-yellow-500/30 flex flex-col items-center justify-center"
        >
          <span className="text-base md:text-3xl">🏆</span>
          <span className="text-white text-[8px] md:text-xs font-bold">TOP</span>
        </motion.div>
      </motion.div>

      {/* Stats card - bottom left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-4 left-2 md:bottom-8 md:left-4"
      >
        <motion.div
          animate={{ y: [0, 5, 0], x: [0, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="px-2 py-1.5 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md md:shadow-lg shadow-cyan-500/30"
        >
          <div className="text-white/70 text-[8px] md:text-xs">Клієнтів</div>
          <div className="text-white font-bold text-sm md:text-2xl">50+</div>
        </motion.div>
      </motion.div>

      {/* Heart - floating */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute top-8 left-2 md:top-16 md:left-12"
      >
        <motion.div
          animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-6 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 shadow-md md:shadow-lg shadow-pink-500/30 flex items-center justify-center"
        >
          <span className="text-xs md:text-xl">❤️</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
