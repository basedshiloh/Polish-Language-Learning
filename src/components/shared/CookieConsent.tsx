'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Shield, BarChart2, Megaphone, X } from 'lucide-react';

export interface ConsentState {
  analytics: boolean;
  advertising: boolean;
  decided: boolean;
}

export function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('pp-cookie-consent');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveConsent(state: ConsentState) {
  localStorage.setItem('pp-cookie-consent', JSON.stringify(state));
  window.dispatchEvent(new CustomEvent('cookieConsentUpdate', { detail: state }));
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`relative shrink-0 w-12 h-7 rounded-full transition-colors duration-200 ${
        value ? 'bg-emerald' : 'bg-line-2'
      }`}
    >
      <span className={`absolute top-1 left-1 w-5 h-5 bg-paper rounded-full shadow-[0_2px_0_rgba(30,33,50,0.18)] transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored?.decided) setShow(true);

    function openSettings() {
      const s = getStoredConsent();
      setAnalytics(s?.analytics ?? false);
      setAdvertising(s?.advertising ?? false);
      setExpanded(true);
      setShow(true);
    }
    window.addEventListener('openCookieSettings', openSettings);
    return () => window.removeEventListener('openCookieSettings', openSettings);
  }, []);

  function acceptAll() {
    saveConsent({ analytics: true, advertising: true, decided: true });
    setShow(false);
  }

  function rejectAll() {
    saveConsent({ analytics: false, advertising: false, decided: true });
    setShow(false);
  }

  function savePreferences() {
    saveConsent({ analytics, advertising, decided: true });
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="no-print fixed z-[60] inset-x-0 bottom-0 sm:inset-x-auto sm:left-4 sm:bottom-4 md:left-6 md:bottom-6 sm:w-[420px] sm:max-w-[calc(100vw-2rem)]"
    >
      <div className="pp-pop bg-paper border-2 border-line border-b-0 sm:border-b-4 rounded-t-3xl sm:rounded-[20px] shadow-[0_-12px_40px_-16px_rgba(30,33,50,0.3)] sm:shadow-[0_18px_40px_-18px_rgba(30,33,50,0.35)] p-5 max-h-[85vh] overflow-y-auto">

        <div className="flex items-start gap-3 mb-3">
          <span className="icon-badge w-10 h-10 rounded-xl bg-sun-soft text-sun-ink">
            <Cookie className="w-5 h-5" strokeWidth={2.4} />
          </span>
          <div className="flex-1 min-w-0 pt-2">
            <h2 id="cookie-consent-title" className="text-lg font-semibold leading-tight">Cookie Preferences</h2>
          </div>
          <button onClick={rejectAll} aria-label="Dismiss" className="w-8 h-8 -mr-1 -mt-1 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-canvas transition-colors">
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <p className="text-sm text-ink-2 leading-relaxed mb-4">
          We use cookies to improve your experience and serve ads on blog pages.{' '}
          <Link href="/gdpr" className="font-bold text-cobalt-ink underline decoration-2 underline-offset-2 decoration-cobalt/30 hover:decoration-cobalt">Cookie & GDPR Policy</Link>
        </p>

        {expanded && (
          <div className="mb-4 divide-y-2 divide-line border-2 border-line rounded-2xl overflow-hidden">

            <div className="flex items-start justify-between gap-4 p-3.5">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald shrink-0" strokeWidth={2.5} /> Essential
                </p>
                <p className="text-xs text-muted mt-1 leading-relaxed">Required for the site to function (theme preference, CMS session). Cannot be disabled.</p>
              </div>
              <span className="chip shrink-0 bg-emerald-soft text-emerald-ink">Always on</span>
            </div>

            <div className="flex items-start justify-between gap-4 p-3.5">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-cobalt shrink-0" strokeWidth={2.5} /> Analytics — Umami
                </p>
                <p className="text-xs text-muted mt-1 leading-relaxed">Cookie-free, privacy-first page-view stats. No personal data stored or shared.</p>
              </div>
              <Toggle value={analytics} onChange={setAnalytics} label="Analytics — Umami" />
            </div>

            <div className="flex items-start justify-between gap-4 p-3.5">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink flex items-center gap-1.5">
                  <Megaphone className="w-4 h-4 text-orange shrink-0" strokeWidth={2.5} /> Advertising — Google AdSense
                </p>
                <p className="text-xs text-muted mt-1 leading-relaxed">Personalised ads on blog pages. Uses cookies to show relevant advertisements.</p>
              </div>
              <Toggle value={advertising} onChange={setAdvertising} label="Advertising — Google AdSense" />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {expanded ? (
            <button onClick={savePreferences} className="btn btn-primary btn-sm grow">
              Save Preferences
            </button>
          ) : (
            <button onClick={acceptAll} className="btn btn-primary btn-sm grow">
              Accept All
            </button>
          )}
          <button onClick={rejectAll} className="btn btn-secondary btn-sm grow">
            Reject Non-Essential
          </button>
          {!expanded && (
            <button onClick={() => setExpanded(true)} className="w-full sm:w-auto mt-1 px-1 py-1.5 text-sm font-bold text-muted hover:text-ink underline-offset-4 decoration-2 hover:underline transition-colors">
              Manage Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
