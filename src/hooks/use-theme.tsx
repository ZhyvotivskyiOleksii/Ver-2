'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: 'dark' | 'light') => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
  root.dataset.theme = theme;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isThemeReady, setThemeReady] = useState(false);

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  }, [theme, isThemeReady]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let storedTheme: Theme | undefined;
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        storedTheme = stored;
      }
    } catch {
      // Ignore read errors in strict browsers/private mode
    }

    const initialTheme: Theme = storedTheme ?? 'system';

    setThemeState(initialTheme);
    const themeToApply = initialTheme === 'system' ? getSystemTheme() : initialTheme;
    applyTheme(themeToApply);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    // Apply theme when it changes
    if (!isThemeReady) return;
    const themeToApply = theme === 'system' ? getSystemTheme() : theme;
    applyTheme(themeToApply);
  }, [theme, isThemeReady]);

  useEffect(() => {
    // Listen for system theme changes
    if (!isThemeReady || theme !== 'system' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, isThemeReady]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('theme', newTheme);
      } catch {
        // Ignore write errors (private / safari)
      }
    }
    const themeToApply = newTheme === 'system' ? getSystemTheme() : newTheme;
    applyTheme(themeToApply);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
};
