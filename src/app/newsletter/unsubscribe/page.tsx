import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { readUnsubscribeToken } from '@/lib/newsletter/token';
import { newsletterConfigured } from '@/lib/newsletter/config';
import NewsletterShell from '../NewsletterShell';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Unsubscribe From the PolishPal Newsletter',
  description:
    'Stop receiving the PolishPal newsletter. One click removes your email address from our mailing list, and you can rejoin at any time.',
  path: '/newsletter/unsubscribe',
  robots: { index: false, follow: false },
});

interface Props {
  searchParams: Promise<{ token?: string | string[] }>;
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const raw = (await searchParams).token;
  const token = Array.isArray(raw) ? raw[0] : raw;
  const email = newsletterConfigured() ? readUnsubscribeToken(token) : null;

  if (!email) {
    return (
      <NewsletterShell title="This link doesn’t work">
        <p>
          The unsubscribe link is incomplete. Use the “Unsubscribe” link at the bottom of any PolishPal email, or email us and
          we’ll remove you by hand.
        </p>
      </NewsletterShell>
    );
  }

  return (
    <NewsletterShell title="Unsubscribe?">
      <p>
        Stop sending the PolishPal newsletter to <strong className="text-ink break-all">{email}</strong>.
      </p>
      <form method="post" action="/api/newsletter/unsubscribe">
        <input type="hidden" name="token" value={token} />
        <button type="submit" className="btn btn-secondary btn-lg">Unsubscribe</button>
      </form>
    </NewsletterShell>
  );
}
