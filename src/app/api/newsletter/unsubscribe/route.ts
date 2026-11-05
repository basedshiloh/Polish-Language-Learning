import { NextResponse } from 'next/server';
import { newsletterConfigured, siteOrigin } from '@/lib/newsletter/config';
import { readUnsubscribeToken } from '@/lib/newsletter/token';
import { unsubscribeContact } from '@/lib/newsletter/resend';

export const dynamic = 'force-dynamic';

// Two callers:
// 1. The button on /newsletter/unsubscribe (form POST with `token`) -> redirect to a status page.
// 2. Mail apps using RFC 8058 one-click (POST ?token=… with body "List-Unsubscribe=One-Click")
//    -> plain 200, no redirect.
// Broadcasts sent from Resend use Resend's own unsubscribe link instead.

export async function POST(request: Request) {
  const url = new URL(request.url);
  const form = await request.formData().catch(() => null);
  const oneClick = form?.get('List-Unsubscribe') === 'One-Click';
  const token = url.searchParams.get('token') ?? form?.get('token');
  const email = newsletterConfigured() ? readUnsubscribeToken(token) : null;

  if (!email) {
    return oneClick
      ? new NextResponse('Invalid link', { status: 400 })
      : NextResponse.redirect(`${siteOrigin(request)}/newsletter/done?status=invalid`, 303);
  }

  try {
    await unsubscribeContact(email);
  } catch (err) {
    console.error('newsletter unsubscribe failed', err);
    return oneClick
      ? new NextResponse('Try again later', { status: 502 })
      : NextResponse.redirect(`${siteOrigin(request)}/newsletter/done?status=error`, 303);
  }

  return oneClick
    ? new NextResponse('Unsubscribed', { status: 200 })
    : NextResponse.redirect(`${siteOrigin(request)}/newsletter/done?status=unsubscribed`, 303);
}
