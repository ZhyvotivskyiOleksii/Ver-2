
'use client'

import { motion } from 'framer-motion';
import { ReactLogo } from '../shared/react-logo';

export function HeroAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 40,
          ease: 'linear',
        }}
        style={{
          width: 'clamp(250px, 80%, 500px)',
          height: 'clamp(250px, 80%, 500px)',
        }}
      >
        <ReactLogo className="w-full h-full text-primary/30" />
      </motion.div>
    </div>
  )
}
