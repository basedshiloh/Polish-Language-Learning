'use client';

// Default look inherits the surrounding text colour (it sits in the dark
// crimson footer bar). Pass `className` to replace the default look, e.g.
// `btn btn-secondary btn-sm` on the GDPR page.
const DEFAULT_LOOK =
  'text-sm text-current opacity-90 hover:opacity-100 hover:underline underline-offset-4 decoration-2 transition-opacity';

export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('openCookieSettings'))}
      className={`text-left ${className ?? DEFAULT_LOOK}`}
    >
      Cookie Settings
    </button>
  );
}
