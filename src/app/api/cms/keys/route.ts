import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, isValidToken } from '@/lib/cms-auth';
import { createApiKey, listApiKeys, revokeApiKey } from '@/lib/api-keys';

// Cookie-only: only the logged-in admin may manage keys (an API key cannot
// mint or revoke other API keys — prevents privilege escalation).
function cookieAuthed(req: NextRequest): boolean {
  return isValidToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export async function POST(req: NextRequest) {
  if (!cookieAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { action } = body;

  if (action === 'list') {
    return NextResponse.json({ keys: await listApiKeys() });
  }

  if (action === 'create') {
    const result = await createApiKey(String(body.name || 'Untitled'));
    if (!result) return NextResponse.json({ error: 'Could not create key' }, { status: 500 });
    return NextResponse.json({ key: result.raw, record: result.record });
  }

  if (action === 'revoke') {
    const ok = await revokeApiKey(String(body.id));
    if (!ok) return NextResponse.json({ error: 'Could not revoke key' }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
