import { NextResponse } from 'next/server';
import {
  CONSENT_VERSION,
  NEWSLETTER_FROM,
  NEWSLETTER_REPLY_TO,
  newsletterConfigured,
  siteOrigin,
} from '@/lib/newsletter/config';
import { readConfirmToken, unsubscribeToken } from '@/lib/newsletter/token';
import { welcomeEmail } from '@/lib/newsletter/emails';
import { isSubscribed, sendEmail, subscribeContact } from '@/lib/newsletter/resend';

export const dynamic = 'force-dynamic';

// Confirmation is a POST from the button on /newsletter/confirm, never a GET, so link
// scanners and email previews that open the link can't subscribe anyone.

function done(request: Request, status: string) {
  return NextResponse.redirect(`${siteOrigin(request)}/newsletter/done?status=${status}`, 303);
}

export async function POST(request: Request) {
  if (!newsletterConfigured()) return done(request, 'error');

  const form = await request.formData().catch(() => null);
  const result = readConfirmToken(form?.get('token'));
  if (!result.ok) return done(request, result.reason);

  try {
    // A second click on the same link should not send a second welcome email.
    if (await isSubscribed(result.email)) return done(request, 'confirmed');

    await subscribeContact(result.email, {
      signup_source: result.source,
      consent_at: new Date().toISOString(),
      consent_version: CONSENT_VERSION,
    });

    const origin = siteOrigin(request);
    const unsubscribeUrl = `${origin}/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken(result.email))}`;
    const oneClickUrl = `${origin}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken(result.email))}`;
    const message = welcomeEmail(origin, unsubscribeUrl);
    await sendEmail({
      from: NEWSLETTER_FROM,
      to: result.email,
      replyTo: NEWSLETTER_REPLY_TO,
      ...message,
      headers: {
        'List-Unsubscribe': `<${oneClickUrl}>, <mailto:${NEWSLETTER_REPLY_TO}?subject=unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      tags: [{ name: 'type', value: 'welcome' }],
    }).catch((err) => console.error('newsletter welcome email failed', err)); // subscribed either way

    return done(request, 'confirmed');
  } catch (err) {
    console.error('newsletter confirm failed', err);
    return done(request, 'error');
  }
}
