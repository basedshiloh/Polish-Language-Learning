import { createHmac, timingSafeEqual } from 'node:crypto';
import { CONFIRM_TTL_SECONDS, type SignupSource } from './config';

// Stateless signed links: confirmation ("c") and unsubscribe ("u").
// Format: base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload, NEWSLETTER_SECRET)).
// No database row is needed for pending sign-ups; the link itself carries the email.

type Purpose = 'c' | 'u';

interface Payload {
  v: 1;
  p: Purpose;
  e: string;
  s?: SignupSource;
  t: number; // issued at, unix seconds
}

function secret(): string {
  const value = process.env.NEWSLETTER_SECRET;
  if (!value || value.length < 32) throw new Error('NEWSLETTER_SECRET is missing or too short');
  return value;
}

function sign(data: string): string {
  return createHmac('sha256', secret()).update(data).digest('base64url');
}

function issue(payload: Payload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${data}.${sign(data)}`;
}

function read(token: unknown, purpose: Purpose): Payload | null {
  if (typeof token !== 'string' || token.length > 2048) return null;
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as Payload;
    if (payload.v !== 1 || payload.p !== purpose || typeof payload.e !== 'string') return null;
    return payload;
  } catch {
    return null;
  }
}

export function confirmToken(email: string, source: SignupSource): string {
  return issue({ v: 1, p: 'c', e: email, s: source, t: Math.floor(Date.now() / 1000) });
}

export function unsubscribeToken(email: string): string {
  return issue({ v: 1, p: 'u', e: email, t: Math.floor(Date.now() / 1000) });
}

export type ConfirmResult =
  | { ok: true; email: string; source: SignupSource; issuedAt: number }
  | { ok: false; reason: 'invalid' | 'expired' };

export function readConfirmToken(token: unknown): ConfirmResult {
  const payload = read(token, 'c');
  if (!payload) return { ok: false, reason: 'invalid' };
  if (Date.now() / 1000 - payload.t > CONFIRM_TTL_SECONDS) return { ok: false, reason: 'expired' };
  return { ok: true, email: payload.e, source: payload.s ?? 'unknown', issuedAt: payload.t };
}

/** Unsubscribe links never expire: an old email must always be able to opt out. */
export function readUnsubscribeToken(token: unknown): string | null {
  return read(token, 'u')?.e ?? null;
}
