import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Star, MessageSquare, Ban } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How PolishPal collects, stores, and uses your data. We keep it minimal — no tracking, no ads, no personal data collection.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

const h2 = 'text-2xl md:text-[1.75rem] font-bold leading-tight mb-4';
const link = 'font-bold text-cobalt-ink underline decoration-2 underline-offset-4 decoration-cobalt/30 hover:decoration-cobalt transition-colors';
const list = 'tile px-6 py-5 pl-10 md:pl-11 list-disc marker:text-crimson space-y-2.5';
const smallList = 'list-disc pl-5 marker:text-faint space-y-1.5 text-base';

const notCollected = [
  'No email addresses or accounts',
  'No IP addresses',
  'No analytics or tracking pixels',
  'No advertising identifiers',
  'No third-party cookies',
  'No personal data of any kind beyond what you voluntarily submit in comments',
];

export default function PrivacyPage() {
  return (
    <div>
      <div className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
            <div className="mt-5">
              <span className="chip bg-paper border-2 border-line text-muted">Last updated: June 26, 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-pp py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12 text-[17px] md:text-lg leading-relaxed text-ink-2">
          <section>
            <h2 className={h2}>Overview</h2>
            <p>
              PolishPal is a free, open-source Polish language learning website. We believe in minimal data collection. We do not run ads,
              we do not sell data, and we do not track you across the internet. This policy explains the small amount of data we do store
              and why.
            </p>
          </section>

          <section>
            <h2 className={h2}>What we store locally (your browser)</h2>
            <p className="mb-5">
              We use your browser&apos;s <strong className="text-ink">localStorage</strong> to save your preferences and progress. This data never leaves your device
              and is not sent to any server.
            </p>
            <ul className={list}>
              <li><strong className="text-ink">Learning progress</strong> — which lessons you&apos;ve completed, quiz scores, and streaks</li>
              <li><strong className="text-ink">Accessibility settings</strong> — font size, contrast, dyslexia font, etc.</li>
              <li><strong className="text-ink">Your ratings</strong> — which lessons/grammar topics you&apos;ve personally rated (to prevent duplicate votes)</li>
              <li><strong className="text-ink">Comment name</strong> — the name you last used when posting a comment (so you don&apos;t have to retype it)</li>
            </ul>
            <p className="mt-5 text-base text-muted">
              You can clear this data at any time by clearing your browser&apos;s site data for polishpal.pl.
            </p>
          </section>

          <section>
            <h2 className={h2}>What we store on our servers</h2>
            <p className="mb-5">
              We use <strong className="text-ink">Supabase</strong> (a hosted PostgreSQL database) to store two types of shared data:
            </p>

            <div className="grid gap-4">
              <div className="tile p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="icon-badge w-10 h-10 rounded-xl bg-sun-soft text-sun-ink">
                    <Star className="w-5 h-5" strokeWidth={2.4} />
                  </span>
                  <h3 className="text-xl font-semibold">Star Ratings</h3>
                </div>
                <p className="text-base mb-2">When you rate a lesson or grammar topic (1–5 stars), we store:</p>
                <ul className={smallList}>
                  <li>The item being rated (e.g. &quot;lesson-introductions&quot;)</li>
                  <li>The aggregated total score and vote count</li>
                </ul>
                <p className="text-[15px] mt-3 text-muted">
                  We do <strong className="text-ink-2">not</strong> store who voted — ratings are anonymous and aggregated. Your individual vote is only tracked locally
                  in your browser to prevent double-voting.
                </p>
              </div>

              <div className="tile p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="icon-badge w-10 h-10 rounded-xl bg-cobalt-soft text-cobalt-ink">
                    <MessageSquare className="w-5 h-5" strokeWidth={2.4} />
                  </span>
                  <h3 className="text-xl font-semibold">Comments</h3>
                </div>
                <p className="text-base mb-2">When you post a comment, we store:</p>
                <ul className={smallList}>
                  <li>The <strong className="text-ink">display name</strong> you enter (not verified, not an account)</li>
                  <li>The <strong className="text-ink">comment text</strong> (max 2,000 characters)</li>
                  <li>The <strong className="text-ink">page</strong> where you posted it</li>
                  <li>A <strong className="text-ink">timestamp</strong> of when it was posted</li>
                </ul>
                <p className="text-[15px] mt-3 text-muted">
                  We do <strong className="text-ink-2">not</strong> store your IP address, email, or any identifying information.
                  Comments containing URLs are automatically blocked as spam prevention.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className={h2}>What we do NOT collect</h2>
            <ul className="rounded-3xl bg-canvas p-5 md:p-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {notCollected.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base font-semibold text-ink">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-crimson-soft text-crimson-ink flex items-center justify-center shrink-0">
                    <Ban className="w-3.5 h-3.5" strokeWidth={2.8} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className={h2}>Comment moderation</h2>
            <p>
              Comments are moderated to prevent spam and inappropriate content. We may hide or delete comments that contain hate speech,
              spam, advertisements, or links. A rate limit of one comment per 30 seconds per display name helps prevent abuse.
            </p>
          </section>

          <section>
            <h2 className={h2}>Third-party services</h2>
            <ul className={list}>
              <li><strong className="text-ink">Vercel</strong> — hosts the website. Subject to <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className={link}>Vercel&apos;s Privacy Policy</a>.</li>
              <li><strong className="text-ink">Supabase</strong> — hosts the ratings and comments database. Subject to <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className={link}>Supabase&apos;s Privacy Policy</a>.</li>
              <li><strong className="text-ink">Pexels</strong> — blog featured images are sourced from Pexels with proper attribution.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>Your rights</h2>
            <p>
              Since we don&apos;t collect personal data or require accounts, there is no profile to delete. If you&apos;ve posted a comment
              and would like it removed, open an issue on our{' '}
              <a href="https://github.com/basedshiloh/Polish-Language-Learning" target="_blank" rel="noopener noreferrer" className={link}>GitHub repository</a>{' '}
              or contact us, and we&apos;ll remove it.
            </p>
          </section>

          <section>
            <h2 className={h2}>Changes to this policy</h2>
            <p>
              If we make changes to this policy, we&apos;ll update the &quot;Last updated&quot; date at the top of this page. Since PolishPal
              is open-source, you can always review the full source code on GitHub to see exactly what data is collected and how it&apos;s used.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
