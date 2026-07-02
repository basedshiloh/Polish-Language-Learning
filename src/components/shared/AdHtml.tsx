'use client';

import { useEffect, useRef } from 'react';

// Renders ad-network embed code (e.g. AdSense). Scripts injected via
// innerHTML don't execute, so we re-create them manually.
export default function AdHtml({ html, maxWidth }: { html: string; maxWidth: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = html;
    el.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      for (const attr of old.attributes) s.setAttribute(attr.name, attr.value);
      s.text = old.text;
      old.replaceWith(s);
    });
  }, [html]);

  return <div ref={ref} style={{ maxWidth }} className="w-full overflow-hidden" />;
}
