'use client';

import { SidebarContext, useSidebarState } from '@/hooks/useSidebar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import SearchBox from './SearchBox';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const sidebarState = useSidebarState();

  return (
    <SidebarContext.Provider value={sidebarState}>
      <Sidebar />
      <MobileNav />
      <main
        className={`pb-20 md:pb-0 min-h-screen transition-all duration-300 ${
          sidebarState.collapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3">
          <SearchBox />
        </div>
        {children}
      </main>
    </SidebarContext.Provider>
  );
}
