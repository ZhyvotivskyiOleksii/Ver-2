'use client';

import { motion } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

const markers = [
  { top: '25%', left: '20%' },
  { top: '35%', left: '48%' },
  { top: '30%', left: '52%' },
  { top: '40%', left: '75%' },
  { top: '55%', left: '25%' },
  { top: '60%', left: '85%' },
  { top: '45%', left: '60%' },
  { top: '50%', left: '35%' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const markerVariants = {
  hidden: { opacity: 0, scale: 0, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    },
  },
};

export function MapSection() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;

  return (
    <section className="relative section-spacing overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg text-muted-foreground mb-6">
            {t.mapDescription}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            {t.mapTitle}
          </h2>
        </motion.div>

        {/* Map Container */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          {/* Map Image */}
          <div className="relative aspect-[2/1] rounded-3xl overflow-hidden border border-border bg-card shadow-xl">
            <Image
              src="/img/mapa.webp"
              alt="World Map"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-contain opacity-80 dark:opacity-60"
              loading="lazy"
            />

            {/* Markers */}
            <motion.div
              className="absolute inset-0"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {markers.map((marker, index) => (
                <motion.div
                  key={index}
                  variants={markerVariants}
                  className="absolute group cursor-pointer"
                  style={{ top: marker.top, left: marker.left }}
                >
                  {/* Pulse Animation */}
                  <div className="absolute inset-0 -m-2">
                    <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                  </div>
                  
                  {/* Pin */}
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="px-3 py-1.5 bg-card border border-border rounded-lg shadow-lg whitespace-nowrap">
                        <span className="text-xs font-medium text-foreground">web-impuls</span>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-card border-r border-b border-border rotate-45" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full" />
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/10 rounded-full" />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          {[
            { value: '50+', label: t.mapStatProjects || 'Проектів' },
            { value: '20+', label: t.mapStatCountries || 'Країн' },
            { value: '1000+', label: t.mapStatClients || 'Клієнтів' },
            { value: '24/7', label: t.mapStatSupport || 'Підтримка' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-2xl bg-card border border-border"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
