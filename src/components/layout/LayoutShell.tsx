'use client';

import { ThemeContext, useThemeState } from '@/hooks/useTheme';
import Topbar from './Topbar';
import Footer from './Footer';
import AccessibilityPanel from './AccessibilityPanel';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const themeState = useThemeState();

  return (
    <ThemeContext.Provider value={themeState}>
      <Topbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <AccessibilityPanel />
    </ThemeContext.Provider>
  );
}
