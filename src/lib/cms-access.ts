import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, isValidToken } from '@/lib/cms-auth';
import { verifyApiKey } from '@/lib/api-keys';

// Authorize a request via EITHER the CMS session cookie (admin in browser)
// OR an application-password API key (agents / external apps).
export async function isAuthorizedRequest(req: NextRequest): Promise<boolean> {
  if (isValidToken(req.cookies.get(SESSION_COOKIE)?.value)) return true;

  const auth = req.headers.get('authorization') || '';
  const key = auth.toLowerCase().startsWith('bearer ')
    ? auth.slice(7).trim()
    : (req.headers.get('x-api-key') || '').trim();

  if (key) return verifyApiKey(key);
  return false;
}
