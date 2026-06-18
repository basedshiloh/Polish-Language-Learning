'use client';

import { SidebarContext, useSidebarState } from '@/hooks/useSidebar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

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
        {children}
      </main>
    </SidebarContext.Provider>
  );
}
