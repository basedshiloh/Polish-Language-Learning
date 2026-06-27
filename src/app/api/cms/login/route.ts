import { NextRequest, NextResponse } from 'next/server';
import { checkCredentials, expectedToken, SESSION_COOKIE } from '@/lib/cms-auth';

// Simple in-memory rate limiter (per-IP). Resets per serverless instance —
// enough friction to stop brute-forcing alongside a strong password.
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const { username, password } = await req.json().catch(() => ({ username: '', password: '' }));
  if (!checkCredentials(String(username || ''), String(password || ''))) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  // success — clear the counter
  attempts.delete(ip);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, expectedToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
