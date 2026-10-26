'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isReady: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isReady: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('raytech_theme') as Theme | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
        applyTheme(savedTheme);
      } else {
        const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setThemeState(preferred);
        applyTheme(preferred);
      }
    } catch {
      const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(preferred);
      applyTheme(preferred);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const restore = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem('raytech_theme'); } catch { /* Use the system choice. */ }
      const next = saved === 'dark' || saved === 'light' ? saved : media.matches ? 'dark' : 'light';
      setThemeState(next); applyTheme(next);
    };
    const storage = (event: StorageEvent) => { if (event.key === 'raytech_theme' || event.key === null) restore(); };
    media.addEventListener('change', restore);
    window.addEventListener('storage', storage);
    return () => { media.removeEventListener('change', restore); window.removeEventListener('storage', storage); };
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try {
      localStorage.setItem('raytech_theme', newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isReady }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme, isReady } = useTheme();

  return (
    <button
      type="button"
      disabled={!isReady}
      onClick={toggleTheme}
      className={`inline-flex min-h-12 min-w-12 items-center justify-center p-2 rounded-md border border-slate-300 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 text-slate-700 transition-colors ${className}`}
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
    </button>
  );
};
