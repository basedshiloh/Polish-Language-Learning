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

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative shrink-0 w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
        value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 no-print">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-5 md:p-6">

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Cookie Preferences</h2>
          </div>
          <button onClick={rejectAll} aria-label="Dismiss" className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          We use cookies to improve your experience and serve ads on blog pages.{' '}
          <Link href="/gdpr" className="text-blue-600 dark:text-blue-400 hover:underline">Cookie & GDPR Policy</Link>
        </p>

        {expanded && (
          <div className="mb-5 divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">

            <div className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-green-500" /> Essential
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 max-w-sm">Required for the site to function (theme preference, CMS session). Cannot be disabled.</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">Always on</span>
            </div>

            <div className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-blue-500" /> Analytics — Umami
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 max-w-sm">Cookie-free, privacy-first page-view stats. No personal data stored or shared.</p>
              </div>
              <Toggle value={analytics} onChange={setAnalytics} />
            </div>

            <div className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-amber-500" /> Advertising — Google AdSense
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 max-w-sm">Personalised ads on blog pages. Uses cookies to show relevant advertisements.</p>
              </div>
              <Toggle value={advertising} onChange={setAdvertising} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {expanded ? (
            <button onClick={savePreferences} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Save Preferences
            </button>
          ) : (
            <button onClick={acceptAll} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Accept All
            </button>
          )}
          <button onClick={rejectAll} className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-semibold rounded-xl transition-colors">
            Reject Non-Essential
          </button>
          {!expanded && (
            <button onClick={() => setExpanded(true)} className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Manage Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
