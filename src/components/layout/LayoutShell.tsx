'use client';

import { SidebarContext, useSidebarState } from '@/hooks/useSidebar';
import { ThemeContext, useThemeState } from '@/hooks/useTheme';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import SearchBox from './SearchBox';
import Footer from './Footer';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const sidebarState = useSidebarState();
  const themeState = useThemeState();

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
            <SearchBox />
          </div>
          {children}
          <Footer />
        </main>
      </SidebarContext.Provider>
    </ThemeContext.Provider>
  );
}
