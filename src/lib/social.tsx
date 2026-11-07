// PolishPal's social profiles. One place, used by the footer, the contact page
// and the Organization JSON-LD (sameAs). "polishpal" was taken on Facebook, so
// the handle is learnpolishpal (use the same one on other networks).
export const FACEBOOK_URL = 'https://www.facebook.com/learnpolishpal';

export const SOCIAL_PROFILES = [FACEBOOK_URL];

/** Facebook "f" mark (lucide has no brand icons). Same props shape as a lucide icon. */
export function FacebookIcon({ className = '' }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 21.9v-7.6h2.6l.4-3h-3V9.4c0-.9.3-1.5 1.5-1.5h1.6V5.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6v7.6a10 10 0 1 1 3.1 0Z" />
    </svg>
  );
}
