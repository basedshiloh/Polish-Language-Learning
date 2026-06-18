'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface SidebarState {
  collapsed: boolean;
  toggle: () => void;
}

export const SidebarContext = createContext<SidebarState>({
  collapsed: false,
  toggle: () => {},
});

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);
  return { collapsed, toggle };
}

export function useSidebar() {
  return useContext(SidebarContext);
}
