import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Use for This Free Polish Course',
  description:
    'The terms for using PolishPal: free access with no account, how you may reuse our CC0 content, rules for comments, and the limits of our learning material.',
  path: '/terms',
});

const UPDATED = 'November 4, 2026';

const h2 = 'text-2xl md:text-[1.75rem] font-bold leading-tight mb-4';
const link = 'font-bold text-cobalt-ink underline decoration-2 underline-offset-4 decoration-cobalt/30 hover:decoration-cobalt transition-colors';
const list = 'tile px-6 py-5 pl-10 md:pl-11 list-disc marker:text-crimson space-y-2.5';

export default function TermsPage() {
  return (
    <div>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'Terms of Use', url: 'https://www.polishpal.pl/terms' },
      ])} />
      <div className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">Terms of Use</h1>
            <p className="text-muted text-lg mt-4">Last updated: {UPDATED}</p>
          </div>
        </div>
      </div>

      <div className="container-pp py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12 text-[17px] md:text-lg leading-relaxed text-ink-2">
          <section>
            <p>
              These terms apply to www.polishpal.pl (&ldquo;PolishPal&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). PolishPal is a free,
              open-source website for learning Polish from beginner (A0) to elementary (A1) level. By using the site you agree to
              these terms. If you do not agree, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className={h2}>Using PolishPal</h2>
            <ul className={list}>
              <li>The lessons, grammar tables, quizzes and blog are free. You do not need an account to use them.</li>
              <li>
                Your lesson progress and quiz scores are stored in your own browser, not on our servers. Clearing your browser data
                removes them, and we cannot restore them.
              </li>
              <li>
                Please do not try to disrupt the site, overload it with automated requests, or get into the admin area. We may block
                access that harms the site or other visitors.
              </li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>Reusing our content</h2>
            <p className="mb-4">
              The text of our lessons, grammar references, quizzes and articles is dedicated to the public domain under{' '}
              <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.en" target="_blank" rel="noopener noreferrer" className={link}>
                CC0 1.0 Universal
              </a>
              . You may copy, adapt and share it, including for commercial use, without asking. A link back is appreciated but not
              required. The site&apos;s source code is on{' '}
              <a href="https://github.com/basedshiloh/Polish-Language-Learning" target="_blank" rel="noopener noreferrer" className={link}>
                GitHub
              </a>{' '}
              under the same dedication.
            </p>
            <p>
              Photos and other media from third parties (for example Pexels, Pixabay or Wikimedia Commons) keep their own licences,
              which are credited next to each image. CC0 does not cover them, and neither does it cover the PolishPal name and logo.
            </p>
          </section>

          <section>
            <h2 className={h2}>Accuracy of the learning material</h2>
            <p className="mb-4">
              We work hard to get the Polish right, and our{' '}
              <Link href="/editorial" className={link}>Editorial Policy</Link> explains how content is written and reviewed. Even so,
              PolishPal is a free self-study resource, not an accredited course, and it may contain mistakes. It does not lead to an
              official certificate, and it is not a substitute for a qualified teacher when you prepare for an exam or a job that
              requires certified Polish.
            </p>
            <p>
              If you find an error, please tell us through the <Link href="/contact" className={link}>contact page</Link> so we can
              fix it for everyone.
            </p>
          </section>

          <section>
            <h2 className={h2}>Comments</h2>
            <p>
              You are responsible for what you post. Comments must be respectful and on topic. We may hide or delete comments that
              contain hate speech, harassment, spam, advertisements or links, or that break the law. Posting is rate limited to
              prevent abuse. Our <Link href="/privacy" className={link}>Privacy Policy</Link> explains what is stored when you comment.
            </p>
          </section>

          <section>
            <h2 className={h2}>Advertising and external links</h2>
            <p>
              Some pages show advertisements, and articles link to other websites as sources or further reading. We do not control
              those sites and are not responsible for their content or practices. See our{' '}
              <Link href="/disclosure" className={link}>Advertising &amp; Affiliate Disclosure</Link> for how ads work on PolishPal.
            </p>
          </section>

          <section>
            <h2 className={h2}>No warranty</h2>
            <p>
              PolishPal is provided &ldquo;as is&rdquo;, free of charge, without warranties of any kind. To the extent the law allows,
              we are not liable for any loss arising from your use of the site or reliance on its content. Nothing in these terms limits
              rights you have under the consumer laws of your country.
            </p>
          </section>

          <section>
            <h2 className={h2}>Changes to these terms</h2>
            <p>
              We may update these terms as the site changes. The date at the top of this page shows the latest version. Questions about
              these terms are welcome through the <Link href="/contact" className={link}>contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
