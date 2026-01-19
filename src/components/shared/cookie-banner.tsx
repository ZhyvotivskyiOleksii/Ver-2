'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, BarChart3, Target, Settings, ChevronRight, Check, Cookie } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';

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
  const locale = Array.isArray(params.locale) ? params.locale[0] : (params.locale || 'ua');
  const t = (translations as any)[locale] || translations.ua;
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

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
    { id: 'necessary', icon: Shield, title: t.cookieNecessaryTitle, description: t.cookieNecessaryDesc, required: true, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
    { id: 'analytics', icon: BarChart3, title: t.cookieAnalyticsTitle, description: t.cookieAnalyticsDesc, required: false, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { id: 'marketing', icon: Target, title: t.cookieMarketingTitle, description: t.cookieMarketingDesc, required: false, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    { id: 'preferences', icon: Settings, title: t.cookiePreferencesTitle, description: t.cookiePreferencesDesc, required: false, color: 'text-violet-400', bgColor: 'bg-violet-500/20' },
  ];

  const tabs = [
    { id: 'consent' as Tab, label: t.cookieTabConsent },
    { id: 'details' as Tab, label: t.cookieTabDetails },
    { id: 'about' as Tab, label: t.cookieTabAbout },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
          {/* Backdrop - transparent, just for click handling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-auto"
            onClick={handleAllowAll}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="pointer-events-auto w-full sm:max-w-lg"
          >
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                background: isDarkMode 
                  ? 'rgba(30, 30, 40, 0.65)' 
                  : 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(50px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(50px) saturate(1.8)',
                border: isDarkMode 
                  ? '1px solid rgba(255, 255, 255, 0.12)' 
                  : '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: isDarkMode
                  ? '0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              }}
            >
            {/* Header with gradient accent */}
            <div className={cn(
              "relative px-4 sm:px-5 py-3 sm:py-4 border-b",
              isDarkMode ? "border-white/[0.08]" : "border-black/[0.06]"
            )}>
              {/* Gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-primary to-pink-500 rounded-t-3xl" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center",
                    "bg-gradient-to-br from-violet-500 to-primary shadow-lg shadow-primary/25"
                  )}>
                    <Cookie className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm sm:text-base font-bold tracking-tight",
                      isDarkMode ? "text-white" : "text-slate-900"
                    )}>
                      {t.cookieTitle || 'Cookie Settings'}
                    </p>
                    <p className={cn(
                      "text-[10px] sm:text-xs",
                      isDarkMode ? "text-white/50" : "text-slate-500"
                    )}>
                      Web Impuls
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={cn(
              "flex gap-1 px-3 sm:px-4 py-2 border-b overflow-x-auto scrollbar-hide",
              isDarkMode ? "border-white/[0.08]" : "border-black/[0.06]"
            )}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-4 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap active:scale-[0.97]"
                  style={activeTab === tab.id ? {
                    background: isDarkMode 
                      ? 'linear-gradient(180deg, rgba(55,55,65,0.95) 0%, rgba(35,35,45,0.95) 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,245,250,0.98) 100%)',
                    boxShadow: isDarkMode
                      ? 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.25)'
                      : 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.08)',
                    border: isDarkMode 
                      ? '1px solid rgba(75,75,85,0.5)' 
                      : '1px solid rgba(0,0,0,0.06)',
                    color: isDarkMode ? '#fff' : 'rgb(109,40,217)',
                  } : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="px-3 sm:px-4 py-3 sm:py-4 max-h-[40vh] sm:max-h-[45vh] overflow-y-auto">
              {activeTab === 'consent' && (
                <>
                  <p className={cn(
                    "text-[11px] sm:text-xs mb-3 leading-relaxed",
                    isDarkMode ? "text-white/60" : "text-slate-600"
                  )}>
                    {t.cookieConsentDesc}
                  </p>
                  <div className="space-y-2">
                    {cookieTypes.map(cookie => (
                      <div
                        key={cookie.id}
                        className="flex items-center justify-between rounded-2xl px-3.5 py-3.5 transition-all"
                        style={{
                          background: isDarkMode 
                            ? 'linear-gradient(180deg, rgba(50,50,60,0.9) 0%, rgba(30,30,40,0.9) 100%)'
                            : 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(245,245,250,0.95) 100%)',
                          boxShadow: isDarkMode
                            ? 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2)'
                            : 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.06)',
                          border: isDarkMode 
                            ? '1px solid rgba(70,70,80,0.5)' 
                            : '1px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", cookie.bgColor)}>
                            <cookie.icon className={cn("w-3.5 h-3.5", cookie.color)} />
                          </div>
                          <div>
                            <p className={cn(
                              "text-[11px] sm:text-xs font-medium",
                              isDarkMode ? "text-white" : "text-slate-800"
                            )}>{cookie.title}</p>
                            <p className={cn(
                              "text-[9px] sm:text-[10px]",
                              isDarkMode ? "text-white/40" : "text-slate-400"
                            )}>{cookie.required ? t.cookieAlwaysOn : t.cookieToggle}</p>
                          </div>
                        </div>
                        <Switch
                          checked={cookie.required || preferences[cookie.id as keyof CookiePreferences]}
                          onCheckedChange={checked => {
                            if (!cookie.required) setPreferences(prev => ({ ...prev, [cookie.id]: checked }));
                          }}
                          disabled={cookie.required}
                          className="scale-[0.85] data-[state=checked]:bg-primary"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'details' && (
                <div className="space-y-2.5">
                  {cookieTypes.map(cookie => (
                    <div 
                      key={cookie.id} 
                      className="rounded-2xl p-3.5 transition-all"
                      style={{
                        background: isDarkMode 
                          ? 'linear-gradient(180deg, rgba(50,50,60,0.9) 0%, rgba(30,30,40,0.9) 100%)'
                          : 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(245,245,250,0.95) 100%)',
                        boxShadow: isDarkMode
                          ? 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2)'
                          : 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.06)',
                        border: isDarkMode 
                          ? '1px solid rgba(70,70,80,0.5)' 
                          : '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", cookie.bgColor)}>
                            <cookie.icon className={cn("w-3.5 h-3.5", cookie.color)} />
                          </div>
                          <p className={cn(
                            "text-[11px] sm:text-xs font-semibold",
                            isDarkMode ? "text-white" : "text-slate-800"
                          )}>{cookie.title}</p>
                        </div>
                        {cookie.required ? (
                          <span className={cn(
                            "text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full",
                            isDarkMode ? "bg-white/10 text-white/50" : "bg-slate-200 text-slate-500"
                          )}>{t.cookieRequired}</span>
                        ) : (
                          <Switch
                            checked={preferences[cookie.id as keyof CookiePreferences]}
                            onCheckedChange={checked => setPreferences(prev => ({ ...prev, [cookie.id]: checked }))}
                            className="scale-[0.85] data-[state=checked]:bg-primary"
                          />
                        )}
                      </div>
                      <p className={cn(
                        "text-[10px] sm:text-[11px] leading-relaxed",
                        isDarkMode ? "text-white/50" : "text-slate-500"
                      )}>{cookie.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'about' && (
                <div className={cn(
                  "text-[11px] sm:text-xs space-y-3 leading-relaxed",
                  isDarkMode ? "text-white/60" : "text-slate-600"
                )}>
                  <p>{t.cookieAboutDesc}</p>
                  <p>{t.cookieAboutExtra}</p>
                </div>
              )}
            </div>

            {/* Footer - iOS style buttons - always horizontal */}
            <div className={cn(
              "flex flex-row gap-2 border-t px-3 sm:px-4 py-3 sm:py-4",
              isDarkMode ? "border-white/[0.06]" : "border-black/[0.05]"
            )}>
              {/* Deny button */}
              <button
                onClick={handleDeny}
                disabled={isSaving}
                className="flex-1 h-11 sm:h-12 rounded-2xl text-[11px] sm:text-[13px] font-medium transition-all active:scale-[0.97]"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(180deg, rgba(60,60,70,0.95) 0%, rgba(35,35,45,0.95) 100%)'
                    : 'linear-gradient(180deg, rgba(250,250,252,0.98) 0%, rgba(235,235,240,0.98) 100%)',
                  boxShadow: isDarkMode
                    ? 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.25)'
                    : 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.08)',
                  border: isDarkMode 
                    ? '1px solid rgba(80,80,90,0.5)' 
                    : '1px solid rgba(0,0,0,0.08)',
                  color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                }}
              >
                {t.cookieDeny}
              </button>

              {activeTab === 'details' ? (
                /* Save button */
                <button
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="flex-[1.2] h-11 sm:h-12 rounded-2xl text-[11px] sm:text-[13px] font-semibold transition-all active:scale-[0.97] flex items-center justify-center gap-1"
                  style={{
                    background: 'linear-gradient(180deg, rgba(155,105,255,1) 0%, rgba(120,70,220,1) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15), 0 2px 6px rgba(139,92,246,0.4)',
                    border: '1px solid rgba(180,140,255,0.4)',
                    color: '#fff',
                  }}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="truncate">{t.cookieSavePreferences}</span>
                </button>
              ) : (
                /* Customize button */
                <button
                  onClick={() => setActiveTab('details')}
                  className="flex-1 h-11 sm:h-12 rounded-2xl text-[11px] sm:text-[13px] font-medium transition-all active:scale-[0.97] flex items-center justify-center gap-0.5"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(180deg, rgba(60,60,70,0.95) 0%, rgba(35,35,45,0.95) 100%)'
                      : 'linear-gradient(180deg, rgba(250,250,252,0.98) 0%, rgba(235,235,240,0.98) 100%)',
                    boxShadow: isDarkMode
                      ? 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.25)'
                      : 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.08)',
                    border: isDarkMode 
                      ? '1px solid rgba(80,80,90,0.5)' 
                      : '1px solid rgba(0,0,0,0.08)',
                    color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                  }}
                >
                  <span className="truncate">{t.cookieCustomize}</span>
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
              )}

              {/* Accept all button */}
              <button
                onClick={handleAllowAll}
                disabled={isSaving}
                className="flex-[1.3] h-11 sm:h-12 rounded-2xl text-[11px] sm:text-[13px] font-semibold transition-all active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(180deg, rgba(155,105,255,1) 0%, rgba(120,70,220,1) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15), 0 2px 6px rgba(139,92,246,0.4)',
                  border: '1px solid rgba(180,140,255,0.4)',
                  color: '#fff',
                }}
              >
                <span className="truncate">{t.cookieAllowAll}</span>
              </button>
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
