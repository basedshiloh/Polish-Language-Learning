'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '@/hooks/useTheme';

const options: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export default function ThemeSwitcher({ collapsed }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme();

  if (collapsed) {
    const current = options.find((o) => o.value === theme) || options[2];
    const next = options[(options.indexOf(current) + 1) % options.length];
    const Icon = current.icon;
    return (
      <button
        onClick={() => setTheme(next.value)}
        title={`Theme: ${current.label}. Click for ${next.label}.`}
        className="flex items-center justify-center p-2.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors w-full"
      >
        <Icon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            title={opt.label}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              active
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
