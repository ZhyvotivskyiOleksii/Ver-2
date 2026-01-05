/**
 * Knowledge base for AI - reads directly from translations.ts
 * No need for separate JSON files or scanning scripts!
 */

import { translations } from '@/lib/translations';
import { getSupabaseClient } from '@/lib/supabase';

type TranslationSet = Record<string, string>;

/**
 * Builds knowledge base for AI from translations
 * Automatically synced with website content
 */
export function buildSiteKnowledge(locale?: string): string {
  const loc = (locale && translations[locale]) ? locale : 'ua';
  const t = translations[loc] as TranslationSet;
  
  const lines: string[] = [];
  
  // Studio info
  lines.push('=== WebImpuls Studio ===');
  lines.push(`Description: ${t.heroTitle || 'WebImpuls - Web Development Studio'}`);
  lines.push(`Tagline: ${t.heroSubtitle || ''}`);
  lines.push('');
  
  // All 6 services with full details
  lines.push('=== SERVICES (6 total) ===');
  lines.push('');
  
  // 1. Landing
  lines.push(`1. ${t.serviceLandingTitle || 'Landing Page'}`);
  lines.push(`   Price: ${t.serviceLandingPrice || '$600 - $1,300'}`);
  lines.push(`   Timeline: ${t.serviceLandingTimeline || '5-7 days'}`);
  lines.push(`   Description: ${t.serviceLandingDesc || ''}`);
  if (t.serviceLandingFeature1) {
    lines.push(`   Features: ${t.serviceLandingFeature1}, ${t.serviceLandingFeature2 || ''}, ${t.serviceLandingFeature3 || ''}, ${t.serviceLandingFeature4 || ''}, ${t.serviceLandingFeature5 || ''}, ${t.serviceLandingFeature6 || ''}`);
  }
  lines.push(`   Technologies: Next.js 15, React 19, Tailwind CSS, Framer Motion, TypeScript, Vercel`);
  lines.push('');
  
  // 2. Corporate
  lines.push(`2. ${t.serviceCorporateTitle || 'Corporate Website'}`);
  lines.push(`   Price: ${t.serviceCorporatePrice || '$2,300 - $4,800'}`);
  lines.push(`   Timeline: ${t.serviceCorporateTimeline || '14-21 days'}`);
  lines.push(`   Description: ${t.serviceCorporateDesc || ''}`);
  if (t.serviceCorporateFeature1) {
    lines.push(`   Features: ${t.serviceCorporateFeature1}, ${t.serviceCorporateFeature2 || ''}, ${t.serviceCorporateFeature3 || ''}, ${t.serviceCorporateFeature4 || ''}, ${t.serviceCorporateFeature5 || ''}, ${t.serviceCorporateFeature6 || ''}`);
  }
  lines.push(`   Technologies: Next.js 15, React 19, Prisma ORM, PostgreSQL, Shadcn/ui, Clerk Auth`);
  lines.push('');
  
  // 3. E-commerce
  lines.push(`3. ${t.serviceECommerceTitle || 'E-commerce Store'}`);
  lines.push(`   Price: ${t.serviceECommercePrice || '$3,800 - $7,800'}`);
  lines.push(`   Timeline: ${t.serviceECommerceTimeline || '21-35 days'}`);
  lines.push(`   Description: ${t.serviceECommerceDesc || ''}`);
  if (t.serviceECommerceFeature1) {
    lines.push(`   Features: ${t.serviceECommerceFeature1}, ${t.serviceECommerceFeature2 || ''}, ${t.serviceECommerceFeature3 || ''}, ${t.serviceECommerceFeature4 || ''}, ${t.serviceECommerceFeature5 || ''}, ${t.serviceECommerceFeature6 || ''}`);
  }
  lines.push(`   Technologies: Next.js Commerce, Stripe, Supabase, Zustand, React Query`);
  lines.push('');
  
  // 4. Web App
  lines.push(`4. ${t.serviceWebAppTitle || 'Web Application (SaaS/PWA)'}`);
  lines.push(`   Price: ${t.serviceWebAppPrice || '$7,800 - $14,800'}`);
  lines.push(`   Timeline: ${t.serviceWebAppTimeline || '45-60 days'}`);
  lines.push(`   Description: ${t.serviceWebAppDesc || ''}`);
  if (t.serviceWebAppFeature1) {
    lines.push(`   Features: ${t.serviceWebAppFeature1}, ${t.serviceWebAppFeature2 || ''}, ${t.serviceWebAppFeature3 || ''}, ${t.serviceWebAppFeature4 || ''}, ${t.serviceWebAppFeature5 || ''}, ${t.serviceWebAppFeature6 || ''}`);
  }
  lines.push(`   Technologies: Next.js 15, React 19, tRPC, Prisma, PostgreSQL, Redis, WebSockets`);
  lines.push('');
  
  // 5. Redesign
  lines.push(`5. ${t.serviceRedesignTitle || 'Website Redesign'}`);
  lines.push(`   Price: ${t.serviceRedesignPrice || '$1,300 - $3,800'}`);
  lines.push(`   Timeline: ${t.serviceRedesignTimeline || '10-21 days'}`);
  lines.push(`   Description: ${t.serviceRedesignDesc || ''}`);
  if (t.serviceRedesignFeature1) {
    lines.push(`   Features: ${t.serviceRedesignFeature1}, ${t.serviceRedesignFeature2 || ''}, ${t.serviceRedesignFeature3 || ''}, ${t.serviceRedesignFeature4 || ''}, ${t.serviceRedesignFeature5 || ''}`);
  }
  lines.push(`   Technologies: Figma, Tailwind CSS, Framer Motion, Next.js, Lighthouse`);
  lines.push('');
  
  // 6. Support
  lines.push(`6. ${t.serviceSupportTitle || 'Website Support'}`);
  lines.push(`   Price: ${t.serviceSupportPrice || '$300 - $800/month'}`);
  lines.push(`   Timeline: ${t.serviceSupportTimeline || 'Response within 24 hours'}`);
  lines.push(`   Description: ${t.serviceSupportDesc || ''}`);
  if (t.serviceSupportFeature1) {
    lines.push(`   Features: ${t.serviceSupportFeature1}, ${t.serviceSupportFeature2 || ''}, ${t.serviceSupportFeature3 || ''}, ${t.serviceSupportFeature4 || ''}, ${t.serviceSupportFeature5 || ''}, ${t.serviceSupportFeature6 || ''}`);
  }
  lines.push(`   Technologies: Vercel Analytics, Sentry, Uptime Robot, Google Analytics`);
  lines.push('');
  
  // Contacts
  lines.push('=== CONTACTS ===');
  lines.push('Telegram: https://t.me/oleksiy_zhyvotivskyi');
  lines.push('Viber: viber://chat?number=%2B48512686628');
  lines.push('Messenger: https://m.me/61559794323482');
  lines.push('');
  
  // Additional info
  lines.push('=== ADDITIONAL INFO ===');
  lines.push('- Working hours: Mon-Fri, 9:00-18:00 (CET), but we usually reply on weekends too');
  lines.push('- Warranty: 3 months on all projects');
  lines.push('- Payment: 50% upfront, 50% after completion');
  lines.push('- Countries: Ukraine, Poland, Germany, and other EU countries');
  lines.push('- All projects include free consultation and technical specification');
  
  return lines.join('\n');
}

// For backwards compatibility
export function loadKnowledgeJSON() {
  return {};
}

/**
 * Fetches additional docs from Supabase (optional)
 */
export async function fetchRelevantDocs(query: string, locale?: string) {
  try {
    const supabase = getSupabaseClient();
    const loc = locale || 'ua';
    const { data, error } = await supabase
      .from('knowledge_documents')
      .select('id, locale, title, content, updated_at')
      .eq('locale', loc)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('updated_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('fetchRelevantDocs error:', error);
      return [] as Array<{ title: string; content: string }>;
    }
    return (data || []).map((d: any) => ({ title: d.title, content: d.content }));
  } catch (e) {
    console.error('fetchRelevantDocs exception:', e);
    return [] as Array<{ title: string; content: string }>;
  }
}
