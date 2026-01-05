'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, BarChart3, Target, Settings, ChevronRight, Check } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';

type Tab = 'consent' | 'details' | 'about';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let visitorId = localStorage.getItem('visitor-id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor-id', visitorId);
  }
  return visitorId;
}

export function CookieBanner() {
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const t = (translations as any)[locale] || translations.ua;

  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('consent');
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('cookie-consent');
    if (consent) return;

    const showBanner = () => setIsVisible(true);
    let timeoutId: number | undefined;

    const cleanup = () => {
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      if (timeoutId) window.clearTimeout(timeoutId);
    };

    function handleFirstInteraction() {
      showBanner();
      cleanup();
    }

    const scheduleTimeout = () => {
      timeoutId = window.setTimeout(() => {
        showBanner();
        cleanup();
      }, 5000);
    };

    scheduleTimeout();
    window.addEventListener('scroll', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });

    return () => cleanup();
  }, []);

  const saveConsent = useCallback(async (prefs: CookiePreferences, consentGiven: boolean) => {
    setIsSaving(true);
    try {
      const supabase = getSupabaseClient();
      const visitorId = getVisitorId();

      await supabase.from('cookie_consents').upsert({
        visitor_id: visitorId,
        consent_given: consentGiven,
        necessary: prefs.necessary,
        analytics: prefs.analytics,
        marketing: prefs.marketing,
        preferences: prefs.preferences,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'visitor_id',
      });

      localStorage.setItem('cookie-consent', JSON.stringify({
        ...prefs,
        consentGiven,
        timestamp: Date.now(),
      }));

      setIsVisible(false);
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
      localStorage.setItem('cookie-consent', JSON.stringify({
        ...prefs,
        consentGiven,
        timestamp: Date.now(),
      }));
      setIsVisible(false);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleDeny = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false, preferences: false }, false);
  };

  const handleAllowAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true, preferences: true }, true);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences, true);
  };

  const cookieTypes = [
    { id: 'necessary', icon: Shield, title: t.cookieNecessaryTitle, description: t.cookieNecessaryDesc, required: true, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { id: 'analytics', icon: BarChart3, title: t.cookieAnalyticsTitle, description: t.cookieAnalyticsDesc, required: false, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'marketing', icon: Target, title: t.cookieMarketingTitle, description: t.cookieMarketingDesc, required: false, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { id: 'preferences', icon: Settings, title: t.cookiePreferencesTitle, description: t.cookiePreferencesDesc, required: false, color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
  ];

  const tabs = [
    { id: 'consent' as Tab, label: t.cookieTabConsent },
    { id: 'details' as Tab, label: t.cookieTabDetails },
    { id: 'about' as Tab, label: t.cookieTabAbout },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 pointer-events-auto"
            onClick={handleAllowAll}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="pointer-events-auto w-full max-w-[calc(100vw-1.5rem)] sm:max-w-lg rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
          >
            {/* Header - Logo only */}
            <div className="flex justify-end px-4 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="text-right">
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Web Impuls
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 -mt-0.5">
                  cookie manager
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 sm:gap-6 px-4 py-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'text-[11px] sm:text-xs font-medium transition-colors py-1.5 relative whitespace-nowrap',
                    activeTab === tab.id 
                      ? 'text-primary' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="cookie-tab"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="px-4 py-3 max-h-[45vh] sm:max-h-[50vh] overflow-y-auto">
              {activeTab === 'consent' && (
                <>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                    {t.cookieConsentDesc}
                  </p>
                  <div className="space-y-1.5">
                    {cookieTypes.map(cookie => (
                      <div
                        key={cookie.id}
                        className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2"
                      >
                        <div>
                          <p className="text-[11px] sm:text-xs font-medium text-slate-800 dark:text-white">{cookie.title}</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-400">{cookie.required ? t.cookieAlwaysOn : t.cookieToggle}</p>
                        </div>
                        <Switch
                          checked={cookie.required || preferences[cookie.id as keyof CookiePreferences]}
                          onCheckedChange={checked => {
                            if (!cookie.required) setPreferences(prev => ({ ...prev, [cookie.id]: checked }));
                          }}
                          disabled={cookie.required}
                          className="scale-[0.8] sm:scale-90 data-[state=checked]:bg-primary"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'details' && (
                <div className="space-y-2">
                  {cookieTypes.map(cookie => (
                    <div key={cookie.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 sm:p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${cookie.bgColor} flex items-center justify-center`}>
                            <cookie.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${cookie.color}`} />
                          </div>
                          <p className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-white">{cookie.title}</p>
                        </div>
                        {cookie.required ? (
                          <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400">{t.cookieRequired}</span>
                        ) : (
                          <Switch
                            checked={preferences[cookie.id as keyof CookiePreferences]}
                            onCheckedChange={checked => setPreferences(prev => ({ ...prev, [cookie.id]: checked }))}
                            className="scale-[0.8] sm:scale-90 data-[state=checked]:bg-primary"
                          />
                        )}
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">{cookie.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'about' && (
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
                  <p>{t.cookieAboutDesc}</p>
                  <p>{t.cookieAboutExtra}</p>
                </div>
              )}
            </div>

            {/* Footer - slight rounding, mobile stacked */}
            <div className="flex flex-col sm:flex-row gap-2 border-t border-slate-200 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-slate-800/50">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-md h-8 sm:h-9 text-[11px] sm:text-xs border-slate-300 dark:border-slate-600"
                onClick={handleDeny}
                disabled={isSaving}
              >
                {t.cookieDeny}
              </Button>
              {activeTab === 'details' ? (
                <Button
                  size="sm"
                  className="flex-1 rounded-md h-8 sm:h-9 text-[11px] sm:text-xs bg-primary hover:bg-primary/90"
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                >
                  <Check className="w-3 h-3 mr-1" />
                  {t.cookieSavePreferences}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-md h-8 sm:h-9 text-[11px] sm:text-xs border-slate-300 dark:border-slate-600"
                  onClick={() => setActiveTab('details')}
                >
                  {t.cookieCustomize}
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              )}
              <Button
                size="sm"
                className="flex-1 rounded-md h-8 sm:h-9 text-[11px] sm:text-xs bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600"
                onClick={handleAllowAll}
                disabled={isSaving}
              >
                {t.cookieAllowAll}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
