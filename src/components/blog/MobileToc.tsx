'use client';

import { useState } from 'react';
import { ListOrdered, ChevronDown } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
}

// Inline, collapsible table of contents for viewports below xl,
// where the sticky sidebar TOC is hidden.
export default function MobileToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);

  if (items.length < 2) return null;

  return (
    <nav className="xl:hidden no-print my-8 tile overflow-hidden" aria-label="In this article">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="icon-badge w-9 h-9 rounded-xl bg-cobalt-soft text-cobalt-ink">
            <ListOrdered className="w-[18px] h-[18px]" strokeWidth={2.4} />
          </span>
          <span className="font-extrabold text-ink">In this article</span>
          <span className="chip bg-canvas text-muted">{items.length} sections</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-muted transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={2.5} />
      </button>
      {open && (
        <ol className="px-5 pb-5 pt-1 space-y-1 border-t-2 border-canvas">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-baseline gap-3 py-1.5 text-[15px] font-semibold text-ink-2 hover:text-crimson-ink transition-colors"
              >
                <span className="text-xs font-extrabold text-muted tabular-nums w-4 shrink-0">{i + 1}</span>
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
