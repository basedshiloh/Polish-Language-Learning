import crypto from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'cms_session';

// A bearer token derived from ADMIN_PASSWORD (the password itself is never
// stored in the cookie). Forging it requires knowing ADMIN_PASSWORD.
export function expectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD || '';
  return crypto.createHmac('sha256', secret).update('polishpal-cms-v1').digest('hex');
}

export function checkPassword(password: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && password === pw;
}

// For server components / layouts
export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  return c.get(SESSION_COOKIE)?.value === expectedToken();
}

// For route handlers that receive a token value (from req.cookies)
export function isValidToken(value: string | undefined): boolean {
  return !!value && value === expectedToken();
}
