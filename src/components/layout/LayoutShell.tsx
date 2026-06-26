'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { SidebarContext, useSidebarState } from '@/hooks/useSidebar';
import { ThemeContext, useThemeState, type Theme } from '@/hooks/useTheme';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import MobileMenu from './MobileMenu';
import SearchBox from './SearchBox';
import Footer from './Footer';
import AccessibilityPanel from './AccessibilityPanel';

const themeIcons: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };
const themeOrder: Theme[] = ['light', 'dark', 'system'];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const sidebarState = useSidebarState();
  const themeState = useThemeState();

  const ThemeIcon = themeIcons[themeState.theme];
  const nextTheme = themeOrder[(themeOrder.indexOf(themeState.theme) + 1) % themeOrder.length];

  return (
    <ThemeContext.Provider value={themeState}>
      <SidebarContext.Provider value={sidebarState}>
        <Sidebar />
        <MobileNav />
        <main
          className={`pb-20 md:pb-0 min-h-screen transition-all duration-300 ${
            sidebarState.collapsed ? 'md:ml-16' : 'md:ml-64'
          }`}
        >
          <div className="sticky top-0 z-30 bg-slate-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 px-6 py-3">
            <div className="flex items-center gap-2">
              <SearchBox />
              <button
                onClick={() => themeState.setTheme(nextTheme)}
                title={`Theme: ${themeState.theme}`}
                className="md:hidden shrink-0 p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ThemeIcon className="w-5 h-5" />
              </button>
              <MobileMenu />
            </div>
          </div>
          {children}
          <Footer />
        </main>
        <AccessibilityPanel />
      </SidebarContext.Provider>
    </ThemeContext.Provider>
  );
}
