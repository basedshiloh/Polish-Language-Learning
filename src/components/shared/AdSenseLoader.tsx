'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';

export default function AdSenseLoader() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    function check(e?: Event) {
      if (e instanceof CustomEvent) {
        setConsented(!!e.detail?.advertising);
        return;
      }
      try {
        const raw = localStorage.getItem('pp-cookie-consent');
        if (raw) setConsented(!!JSON.parse(raw).advertising);
      } catch {}
    }
    check();
    window.addEventListener('cookieConsentUpdate', check);
    return () => window.removeEventListener('cookieConsentUpdate', check);
  }, []);

  if (!consented) return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7316825064118043"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
