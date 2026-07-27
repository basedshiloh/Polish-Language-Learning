'use client';

export default function CookieSettingsButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('openCookieSettings'))}
      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-left"
    >
      Cookie Settings
    </button>
  );
}
