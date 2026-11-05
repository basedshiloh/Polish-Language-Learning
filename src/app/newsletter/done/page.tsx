import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import NewsletterShell from '../NewsletterShell';

export const metadata: Metadata = pageMetadata({
  title: 'PolishPal Newsletter',
  description:
    'Your PolishPal newsletter subscription status: confirmed, unsubscribed, or what to do next if a link did not work as expected.',
  path: '/newsletter/done',
  robots: { index: false, follow: false },
});

const STATES: Record<string, { title: string; text: string; cta?: { href: string; label: string } }> = {
  confirmed: {
    title: 'Witaj! You’re subscribed',
    text: 'Thanks for confirming. A welcome email is on its way, and we’ll write when there are new lessons, articles and tips.',
    cta: { href: '/lessons', label: 'Start lesson 1' },
  },
  unsubscribed: {
    title: 'You’re unsubscribed',
    text: 'We won’t send you the newsletter any more. Changed your mind? You can sign up again at any time.',
    cta: { href: '/newsletter', label: 'Sign up again' },
  },
  expired: {
    title: 'This link has expired',
    text: 'Confirmation links work for 7 days. Please sign up again and we’ll send you a fresh one.',
    cta: { href: '/newsletter', label: 'Sign up again' },
  },
  invalid: {
    title: 'This link doesn’t work',
    text: 'The link is incomplete or damaged. Try copying the whole link from the email.',
    cta: { href: '/newsletter', label: 'Go to the newsletter page' },
  },
  error: {
    title: 'Something went wrong',
    text: 'We couldn’t finish that just now. Please try the link again in a few minutes.',
  },
};

interface Props {
  searchParams: Promise<{ status?: string | string[] }>;
}

export default async function NewsletterDonePage({ searchParams }: Props) {
  const raw = (await searchParams).status;
  const state = STATES[Array.isArray(raw) ? raw[0] : (raw ?? '')] ?? STATES.invalid;
  return (
    <NewsletterShell title={state.title}>
      <p>{state.text}</p>
      {state.cta && (
        <p>
          <Link href={state.cta.href} className="btn btn-primary">{state.cta.label}</Link>
        </p>
      )}
    </NewsletterShell>
  );
}
