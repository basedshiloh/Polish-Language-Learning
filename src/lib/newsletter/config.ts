// PolishPal newsletter (Resend). Server-only settings.
//
// Mail goes out from the news.polishpal.pl subdomain (verified in Resend, EU region),
// so newsletter reputation stays separate from support@polishpal.pl (Purelymail).
// Replies go to the support mailbox.

export const NEWSLETTER_FROM = 'PolishPal <hello@news.polishpal.pl>';
export const NEWSLETTER_REPLY_TO = 'support@polishpal.pl';

/** Resend segment ("General") that confirmed subscribers join. */
export const NEWSLETTER_SEGMENT_ID =
  process.env.RESEND_SEGMENT_ID || '081f3b3d-0df8-4f62-9f78-f7134daea17c';

/** Where people can sign up; stored on the contact as `signup_source`. */
export const SIGNUP_SOURCES = ['footer', 'blog', 'newsletter-page', 'lesson'] as const;
export type SignupSource = (typeof SIGNUP_SOURCES)[number] | 'unknown';

export function signupSource(value: unknown): SignupSource {
  return SIGNUP_SOURCES.includes(value as (typeof SIGNUP_SOURCES)[number])
    ? (value as SignupSource)
    : 'unknown';
}

export { CONSENT_TEXT, CONSENT_VERSION } from './consent';

/** Confirmation links expire after 7 days. */
export const CONFIRM_TTL_SECONDS = 7 * 24 * 60 * 60;

export function newsletterConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.NEWSLETTER_SECRET);
}

/**
 * Absolute site origin for links in emails and redirects. NEWSLETTER_SITE_URL overrides
 * (e.g. local tests); otherwise the host the visitor actually used (request.url can say
 * "localhost" behind a proxy).
 */
export function siteOrigin(request: Request): string {
  if (process.env.NEWSLETTER_SITE_URL) return process.env.NEWSLETTER_SITE_URL.replace(/\/$/, '');
  const url = new URL(request.url);
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host;
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  return `${proto}://${host}`;
}

export function normaliseEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  // Pragmatic check: one @, a dot in the domain, no spaces or angle brackets.
  if (!/^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i.test(email)) return null;
  return email;
}
