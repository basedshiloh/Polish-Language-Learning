'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, PanelLeftClose, PanelLeft } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { useSidebar } from '@/hooks/useSidebar';
import ThemeSwitcher from './ThemeSwitcher';

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 ${
        collapsed ? 'md:w-16' : 'md:w-64'
      }`}
    >
      <div className={`flex items-center border-b border-gray-100 dark:border-gray-800 ${collapsed ? 'justify-center py-5 px-2' : 'gap-3 px-6 py-5'}`}>
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">PolishPal</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">A0 → A1</p>
          </div>
        )}
      </div>

      <nav className={`flex-1 py-4 space-y-1 ${collapsed ? 'px-1.5' : 'px-3'}`}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
                collapsed
                  ? 'justify-center p-2.5'
                  : 'gap-3 px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-gray-100 dark:border-gray-800 space-y-1 ${collapsed ? 'px-1.5 py-3' : 'px-3 py-3'}`}>
        <ThemeSwitcher collapsed={collapsed} />
        <button
          onClick={toggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`flex items-center rounded-lg text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full ${
            collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
          }`}
        >
          {collapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <>
              <PanelLeftClose className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
