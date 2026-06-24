'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Monitor } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { useTheme, type Theme } from '@/hooks/useTheme';

const themeIcons: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };
const themeOrder: Theme[] = ['light', 'dark', 'system'];

export default function MobileNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const ThemeIcon = themeIcons[theme];
  const nextTheme = themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setTheme(nextTheme)}
          title={`Theme: ${theme}`}
          className="relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <ThemeIcon className="w-5 h-5" />
          <span className="capitalize">{theme}</span>
        </button>
      </div>
    </nav>
  );
}
