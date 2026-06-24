'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AccessibilitySettings {
  fontSize: number; // 0 = default, -2 to +4 steps
  lineHeight: number; // 0 = default, -1 to +3 steps
  letterSpacing: number; // 0 = default, 0 to +3 steps
  dyslexiaFont: boolean;
  highContrast: boolean;
  monochrome: boolean;
  bigCursor: boolean;
  readingLine: boolean;
  highlightLinks: boolean;
  hideImages: boolean;
  pauseAnimations: boolean;
}

const DEFAULT: AccessibilitySettings = {
  fontSize: 0,
  lineHeight: 0,
  letterSpacing: 0,
  dyslexiaFont: false,
  highContrast: false,
  monochrome: false,
  bigCursor: false,
  readingLine: false,
  highlightLinks: false,
  hideImages: false,
  pauseAnimations: false,
};

const STORAGE_KEY = 'polish-pal-a11y';

function applySettings(s: AccessibilitySettings) {
  const root = document.documentElement;

  // Font size
  const basePx = 16 + s.fontSize * 2;
  root.style.fontSize = s.fontSize !== 0 ? `${basePx}px` : '';

  // Line height
  root.style.lineHeight = s.lineHeight !== 0 ? `${1.5 + s.lineHeight * 0.25}` : '';

  // Letter spacing
  root.style.letterSpacing = s.letterSpacing !== 0 ? `${s.letterSpacing * 0.5}px` : '';

  // Dyslexia font
  root.classList.toggle('a11y-dyslexia', s.dyslexiaFont);

  // High contrast
  root.classList.toggle('a11y-high-contrast', s.highContrast);

  // Monochrome
  root.classList.toggle('a11y-monochrome', s.monochrome);

  // Big cursor
  root.classList.toggle('a11y-big-cursor', s.bigCursor);

  // Reading line
  root.classList.toggle('a11y-reading-line', s.readingLine);

  // Highlight links
  root.classList.toggle('a11y-highlight-links', s.highlightLinks);

  // Hide images
  root.classList.toggle('a11y-hide-images', s.hideImages);

  // Pause animations
  root.classList.toggle('a11y-pause-animations', s.pauseAnimations);
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = { ...DEFAULT, ...JSON.parse(stored) };
        setSettings(parsed);
        applySettings(parsed);
      }
    } catch {}
    setMounted(true);
  }, []);

  const update = useCallback((partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      applySettings(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    applySettings(DEFAULT);
    setSettings(DEFAULT);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isModified = mounted && JSON.stringify(settings) !== JSON.stringify(DEFAULT);

  return { settings, update, reset, mounted, isModified };
}
