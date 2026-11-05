'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Mail, MailCheck } from 'lucide-react';
import { CONSENT_TEXT } from '@/lib/newsletter/consent';

type Variant = 'card' | 'footer' | 'page';
type Source = 'footer' | 'blog' | 'newsletter-page' | 'lesson';
type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; email: string } | { kind: 'error'; message: string };

const ERRORS: Record<string, string> = {
  invalid_email: 'That email address doesn’t look right. Please check it.',
  consent_required: 'Please tick the box so we know you want the newsletter.',
  rate_limited: 'Too many tries. Please wait a couple of minutes and try again.',
  not_configured: 'The newsletter isn’t available right now. Please try again later.',
};

export default function NewsletterSignup({ source, variant = 'card' }: { source: Source; variant?: Variant }) {
  const id = useId();
  const [state, setState] = useState<State>({ kind: 'idle' });
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const onDark = variant === 'footer';

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    setState({ kind: 'sending' });
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent: form.get('consent') === 'on',
          source,
          company: form.get('company') ?? '',
          elapsed: Date.now() - mountedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) setState({ kind: 'sent', email });
      else setState({ kind: 'error', message: ERRORS[data.error ?? ''] ?? 'Something went wrong. Please try again.' });
    } catch {
      setState({ kind: 'error', message: 'We couldn’t reach the server. Check your connection and try again.' });
    }
  }

  const heading =
    variant === 'footer' ? 'Polish tips in your inbox' : variant === 'page' ? 'Subscribe for free' : 'Learn Polish by email';
  const lede =
    variant === 'footer'
      ? 'New lessons, articles and learning tips. No spam.'
      : 'Get new lessons, articles and practical Polish tips in your inbox. Free, no spam, unsubscribe in one click.';

  const wrap =
    variant === 'footer'
      ? 'mt-12 pt-10 border-t-2 border-white/15 grid gap-6 md:grid-cols-[1fr_1.3fr] md:items-start'
      : variant === 'page'
        ? 'tile p-6 md:p-8'
        : 'no-print tile mt-12 p-6 md:p-7';

  return (
    <section className={wrap} aria-labelledby={`${id}-title`}>
      <div>
        <h2
          id={`${id}-title`}
          className={`font-display font-semibold leading-tight flex items-center gap-2.5 ${onDark ? 'text-xl text-white' : 'text-2xl text-ink'}`}
        >
          {!onDark && (
            <span className="icon-badge w-10 h-10 bg-crimson-soft text-crimson-ink" aria-hidden="true">
              <Mail className="w-5 h-5" strokeWidth={2.4} />
            </span>
          )}
          {heading}
        </h2>
        <p className={`mt-2 text-[15px] leading-relaxed ${onDark ? 'text-white/85' : 'text-muted font-semibold'}`}>{lede}</p>
      </div>

      {state.kind === 'sent' ? (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-2xl px-4 py-4 ${onDark ? 'bg-white/10 text-white' : 'bg-emerald-soft text-emerald-ink mt-5'}`}
        >
          <MailCheck className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
          <p className="text-[15px] font-bold leading-relaxed">
            Almost done! We sent a confirmation link to <span className="break-all">{state.email}</span>. Click it to finish
            subscribing (check your spam folder if it isn’t there in a few minutes).
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className={onDark ? '' : 'mt-5'} noValidate={false}>
          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor={`${id}-email`} className="sr-only">
              Email address
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              placeholder="you@example.com"
              className={`flex-1 min-w-0 h-12 rounded-2xl border-2 px-4 text-[15px] font-semibold outline-none transition-colors ${
                onDark
                  ? 'border-white/30 bg-white text-ink placeholder:text-muted focus:border-sun'
                  : 'border-line bg-canvas text-ink placeholder:text-muted focus:border-cobalt focus:bg-paper'
              }`}
            />
            <button
              type="submit"
              disabled={state.kind === 'sending'}
              className={`btn ${onDark ? 'btn-white' : 'btn-primary'} shrink-0`}
            >
              {state.kind === 'sending' ? 'Sending…' : 'Subscribe'}
            </button>
          </div>

          {/* Honeypot: hidden from people and screen readers, bots tend to fill it. */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label htmlFor={`${id}-company`}>Company</label>
            <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <label className={`mt-3 flex items-start gap-2.5 text-[13px] leading-relaxed ${onDark ? 'text-white/85' : 'text-muted font-semibold'}`}>
            <input
              name="consent"
              type="checkbox"
              required
              className={`mt-0.5 w-4 h-4 shrink-0 rounded ${onDark ? 'accent-white' : 'accent-crimson'}`}
            />
            <span>
              {CONSENT_TEXT}{' '}
              <Link href="/privacy#newsletter" className={`underline underline-offset-2 ${onDark ? 'text-white' : 'text-ink'}`}>
                Privacy Policy
              </Link>
            </span>
          </label>

          {state.kind === 'error' && (
            <p
              role="alert"
              className={`mt-3 flex items-start gap-2 text-sm font-bold rounded-xl px-3 py-2 ${onDark ? 'bg-white text-crimson-ink' : 'bg-crimson-soft text-crimson-ink'}`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
              {state.message}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
