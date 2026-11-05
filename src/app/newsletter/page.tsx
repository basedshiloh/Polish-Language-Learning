import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Lightbulb, Newspaper } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import NewsletterSignup from '@/components/shared/NewsletterSignup';

export const metadata: Metadata = pageMetadata({
  title: 'PolishPal Newsletter: Free Polish Lessons by Email',
  description:
    'Get new PolishPal lessons, articles and practical Polish learning tips by email. Free, no spam, double opt-in, and you can unsubscribe in one click.',
  path: '/newsletter',
});

const perks = [
  { icon: BookOpen, title: 'New lessons', text: 'Hear about new lessons and grammar guides as soon as they’re published.', badge: 'bg-crimson-soft text-crimson-ink' },
  { icon: Newspaper, title: 'New articles', text: 'Culture, slang, music and everyday Polish from the blog.', badge: 'bg-cobalt-soft text-cobalt-ink' },
  { icon: Lightbulb, title: 'Learning tips', text: 'Short, practical tips that make Polish easier to learn.', badge: 'bg-sun-soft text-sun-ink' },
];

export default function NewsletterPage() {
  return (
    <div>
      <div className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">The PolishPal newsletter</h1>
            <p className="text-muted text-lg mt-4">
              Free Polish lessons, articles and tips, straight to your inbox. We only send what helps you learn, and every email
              has a one-click unsubscribe link.
            </p>
          </div>
        </div>
      </div>

      <div className="container-pp py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          <ul className="grid sm:grid-cols-3 gap-4">
            {perks.map(({ icon: Icon, title, text, badge }) => (
              <li key={title} className="tile p-5">
                <span className={`icon-badge ${badge}`} aria-hidden="true">
                  <Icon className="w-5 h-5" strokeWidth={2.4} />
                </span>
                <h2 className="mt-3 text-lg font-semibold leading-tight">{title}</h2>
                <p className="mt-1 text-[15px] text-muted font-semibold leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>

          <NewsletterSignup source="newsletter-page" variant="page" />

          <section className="rounded-3xl bg-canvas p-6 md:p-8 text-[16px] text-ink-2 leading-relaxed space-y-3">
            <h2 className="text-xl font-bold text-ink">How it works</h2>
            <p>
              After you subscribe, we email you a confirmation link. You&apos;re only added to the list once you click it
              (double opt-in), so nobody can sign you up without your permission.
            </p>
            <p>
              We store your email address, where you signed up and when you agreed, using Resend to send the emails. Read the
              details in our <Link href="/privacy#newsletter" className="font-bold text-crimson-ink underline underline-offset-4">Privacy Policy</Link>,
              or email <a href="mailto:support@polishpal.pl" className="font-bold text-crimson-ink underline underline-offset-4">support@polishpal.pl</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
