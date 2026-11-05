import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { readConfirmToken } from '@/lib/newsletter/token';
import { newsletterConfigured } from '@/lib/newsletter/config';
import NewsletterShell from '../NewsletterShell';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Confirm Your PolishPal Newsletter Subscription',
  description:
    'Confirm your email address to start receiving the PolishPal newsletter with new Polish lessons, articles and learning tips.',
  path: '/newsletter/confirm',
  robots: { index: false, follow: false },
});

interface Props {
  searchParams: Promise<{ token?: string | string[] }>;
}

export default async function ConfirmPage({ searchParams }: Props) {
  const raw = (await searchParams).token;
  const token = Array.isArray(raw) ? raw[0] : raw;
  const result = newsletterConfigured() ? readConfirmToken(token) : ({ ok: false, reason: 'invalid' } as const);

  if (!result.ok) {
    return (
      <NewsletterShell title={result.reason === 'expired' ? 'This link has expired' : 'This link doesn’t work'}>
        <p>
          {result.reason === 'expired'
            ? 'Confirmation links work for 7 days. Please sign up again and we’ll send you a fresh one.'
            : 'The confirmation link is incomplete or damaged. Try copying the whole link from the email, or sign up again.'}
        </p>
        <p>
          <Link href="/newsletter" className="btn btn-primary">Sign up again</Link>
        </p>
      </NewsletterShell>
    );
  }

  // A button, not an automatic confirm: email scanners open links, but don't press buttons.
  return (
    <NewsletterShell title="One last step">
      <p>
        Confirm that you want the PolishPal newsletter at <strong className="text-ink break-all">{result.email}</strong>.
      </p>
      <form method="post" action="/api/newsletter/confirm">
        <input type="hidden" name="token" value={token} />
        <button type="submit" className="btn btn-primary btn-lg">Confirm subscription</button>
      </form>
      <p className="text-sm text-muted font-semibold">Changed your mind? Just close this page and you won’t be subscribed.</p>
    </NewsletterShell>
  );
}
