import { NextResponse } from 'next/server';
import {
  NEWSLETTER_FROM,
  NEWSLETTER_REPLY_TO,
  newsletterConfigured,
  normaliseEmail,
  signupSource,
  siteOrigin,
} from '@/lib/newsletter/config';
import { confirmToken } from '@/lib/newsletter/token';
import { confirmationEmail } from '@/lib/newsletter/emails';
import { isSubscribed, sendEmail } from '@/lib/newsletter/resend';

export const dynamic = 'force-dynamic';

// Best-effort throttles (per server instance). They stop casual abuse such as
// mail-bombing one address; the double opt-in means nobody is ever subscribed
// without clicking the link themselves.
const perIp = new Map<string, number[]>();
const perEmail = new Map<string, number>();
const IP_LIMIT = 5;
const IP_WINDOW_MS = 10 * 60 * 1000;
const EMAIL_GAP_MS = 2 * 60 * 1000;

function throttled(ip: string, email: string): boolean {
  const now = Date.now();
  const hits = (perIp.get(ip) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  if (hits.length >= IP_LIMIT) return true;
  const last = perEmail.get(email);
  if (last && now - last < EMAIL_GAP_MS) return true;
  hits.push(now);
  perIp.set(ip, hits);
  perEmail.set(email, now);
  if (perIp.size > 5000) perIp.clear();
  if (perEmail.size > 5000) perEmail.clear();
  return false;
}

function sameSite(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // non-browser clients; the token flow still protects people
  try {
    const from = new URL(origin);
    // Compare with the Host the browser actually used (request.url can say "localhost").
    const hosts = [request.headers.get('x-forwarded-host'), request.headers.get('host')].filter(Boolean);
    if (hosts.includes(from.host)) return true;
    return from.hostname === 'polishpal.pl' || from.hostname.endsWith('.polishpal.pl');
  } catch {
    return false;
  }
}

// The same reply for "sent", "already subscribed" and bot traps, so the endpoint
// never reveals who is on the list.
const accepted = () => NextResponse.json({ ok: true });

export async function POST(request: Request) {
  if (!newsletterConfigured()) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }
  if (!sameSite(request)) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  // Bot traps: a hidden field humans never fill, and a form submitted too fast.
  if (typeof body.company === 'string' && body.company.trim() !== '') return accepted();
  if (typeof body.elapsed === 'number' && body.elapsed < 1500) return accepted();

  const email = normaliseEmail(body.email);
  if (!email) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: 'consent_required' }, { status: 400 });
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (throttled(ip, email)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  try {
    if (await isSubscribed(email)) return accepted();

    const origin = siteOrigin(request);
    const token = confirmToken(email, signupSource(body.source));
    const confirmUrl = `${origin}/newsletter/confirm?token=${encodeURIComponent(token)}`;
    const message = confirmationEmail(origin, email, confirmUrl);
    await sendEmail({
      from: NEWSLETTER_FROM,
      to: email,
      replyTo: NEWSLETTER_REPLY_TO,
      ...message,
      tags: [{ name: 'type', value: 'confirm' }],
    });
    return accepted();
  } catch (err) {
    console.error('newsletter subscribe failed', err);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }
}
