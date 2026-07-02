'use client';

import { useState } from 'react';
import { List, ChevronDown } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
}

// Inline, collapsible table of contents for viewports below xl,
// where the sticky sidebar TOC is hidden.
export default function MobileToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);

  if (items.length < 2) return null;

  return (
    <nav className="xl:hidden no-print my-6 bg-blue-50/60 dark:bg-gray-900 border border-blue-100 dark:border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <List className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          In this article
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ol className="px-4 pb-4 space-y-1.5">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-baseline gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className="text-xs font-semibold text-blue-400 dark:text-blue-500 tabular-nums">{i + 1}.</span>
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
