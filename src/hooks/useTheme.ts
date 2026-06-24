'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (t: Theme) => void;
}

export const ThemeContext = createContext<ThemeState>({
  theme: 'system',
  resolved: 'light',
  setTheme: () => {},
});

const STORAGE_KEY = 'polish-pal-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function useThemeState() {
  const [theme, setThemeRaw] = useState<Theme>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored || 'system';
    setThemeRaw(initial);
    const r = initial === 'system' ? getSystemTheme() : initial;
    setResolved(r);
    applyTheme(r);
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function handler(e: MediaQueryListEvent) {
      setResolved(e.matches ? 'dark' : 'light');
      applyTheme(e.matches ? 'dark' : 'light');
    }
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeRaw(t);
    localStorage.setItem(STORAGE_KEY, t);
    const r = t === 'system' ? getSystemTheme() : t;
    setResolved(r);
    applyTheme(r);
  }, []);

  return { theme, resolved, setTheme };
}

export function useTheme() {
  return useContext(ThemeContext);
}
