import crypto from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'cms_session';

// Constant-time string comparison (hash to fixed length first so differing
// lengths don't leak via timingSafeEqual throwing).
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// A bearer token derived from the username + password (neither is stored in
// the cookie). Forging it requires knowing both credentials.
export function expectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD || '';
  const user = process.env.ADMIN_USERNAME || '';
  return crypto.createHmac('sha256', secret).update(`polishpal-cms-v2:${user}`).digest('hex');
}

export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME || '';
  const p = process.env.ADMIN_PASSWORD || '';
  if (!u || !p) return false;
  return safeEqual(username, u) && safeEqual(password, p);
}

// For server components / layouts
export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  const v = c.get(SESSION_COOKIE)?.value;
  return !!v && safeEqual(v, expectedToken());
}

// For route handlers that receive a token value (from req.cookies)
export function isValidToken(value: string | undefined): boolean {
  return !!value && safeEqual(value, expectedToken());
}
