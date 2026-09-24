'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  children?: React.ReactNode; // rendered under the list inside the sticky container (e.g. sidebar ad)
}

export default function TableOfContents({ items, children }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-90px 0px -60% 0px', threshold: 0.1 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav className="hidden xl:block w-60 shrink-0" aria-label="On this page">
      <div className="sticky top-24">
        <p className="font-display text-lg font-semibold text-ink mb-3">On this page</p>
        {/* Long TOCs scroll within this cap (scrollbar hidden) so the whole
            sidebar — including anything below the list — fits the viewport. */}
        <ul className={`no-scrollbar space-y-0.5 overflow-y-auto ${children ? 'max-h-[45vh]' : 'max-h-[calc(100vh-9rem)]'}`}>
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  aria-current={active ? 'location' : undefined}
                  className={`flex items-start gap-2.5 rounded-xl px-3 py-2 text-sm leading-snug transition-colors ${
                    active
                      ? 'bg-crimson-soft text-crimson-ink font-extrabold'
                      : 'text-muted font-semibold hover:text-ink hover:bg-canvas'
                  }`}
                >
                  <span className={`mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-crimson' : 'bg-line-2'}`} />
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
        {children}
      </div>
    </nav>
  );
}
