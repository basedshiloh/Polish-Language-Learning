import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How PolishPal collects, stores, and uses your data. We keep it minimal — no tracking, no ads, no personal data collection.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Last updated: June 26, 2026</p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Overview</h2>
            <p>
              PolishPal is a free, open-source Polish language learning website. We believe in minimal data collection. We do not run ads,
              we do not sell data, and we do not track you across the internet. This policy explains the small amount of data we do store
              and why.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">What we store locally (your browser)</h2>
            <p className="mb-3">
              We use your browser&apos;s <strong>localStorage</strong> to save your preferences and progress. This data never leaves your device
              and is not sent to any server.
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Learning progress</strong> — which lessons you&apos;ve completed, quiz scores, and streaks</li>
              <li><strong>Theme preference</strong> — light, dark, or system mode</li>
              <li><strong>Accessibility settings</strong> — font size, contrast, dyslexia font, etc.</li>
              <li><strong>Your ratings</strong> — which lessons/grammar topics you&apos;ve personally rated (to prevent duplicate votes)</li>
              <li><strong>Comment name</strong> — the name you last used when posting a comment (so you don&apos;t have to retype it)</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              You can clear this data at any time by clearing your browser&apos;s site data for polishpal.pl.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">What we store on our servers</h2>
            <p className="mb-3">
              We use <strong>Supabase</strong> (a hosted PostgreSQL database) to store two types of shared data:
            </p>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Star Ratings</h3>
              <p className="text-sm mb-2">When you rate a lesson or grammar topic (1–5 stars), we store:</p>
              <ul className="list-disc ml-6 text-sm space-y-1">
                <li>The item being rated (e.g. &quot;lesson-introductions&quot;)</li>
                <li>The aggregated total score and vote count</li>
              </ul>
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                We do <strong>not</strong> store who voted — ratings are anonymous and aggregated. Your individual vote is only tracked locally
                in your browser to prevent double-voting.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Comments</h3>
              <p className="text-sm mb-2">When you post a comment, we store:</p>
              <ul className="list-disc ml-6 text-sm space-y-1">
                <li>The <strong>display name</strong> you enter (not verified, not an account)</li>
                <li>The <strong>comment text</strong> (max 2,000 characters)</li>
                <li>The <strong>page</strong> where you posted it</li>
                <li>A <strong>timestamp</strong> of when it was posted</li>
              </ul>
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                We do <strong>not</strong> store your IP address, email, or any identifying information.
                Comments containing URLs are automatically blocked as spam prevention.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">What we do NOT collect</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>No email addresses or accounts</li>
              <li>No IP addresses</li>
              <li>No analytics or tracking pixels</li>
              <li>No advertising identifiers</li>
              <li>No third-party cookies</li>
              <li>No personal data of any kind beyond what you voluntarily submit in comments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Comment moderation</h2>
            <p>
              Comments are moderated to prevent spam and inappropriate content. We may hide or delete comments that contain hate speech,
              spam, advertisements, or links. A rate limit of one comment per 30 seconds per display name helps prevent abuse.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Third-party services</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Vercel</strong> — hosts the website. Subject to <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Vercel&apos;s Privacy Policy</a>.</li>
              <li><strong>Supabase</strong> — hosts the ratings and comments database. Subject to <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Supabase&apos;s Privacy Policy</a>.</li>
              <li><strong>Pexels</strong> — blog featured images are sourced from Pexels with proper attribution.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Your rights</h2>
            <p>
              Since we don&apos;t collect personal data or require accounts, there is no profile to delete. If you&apos;ve posted a comment
              and would like it removed, open an issue on our{' '}
              <a href="https://github.com/basedshiloh/Polish-Language-Learning" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub repository</a>{' '}
              or contact us, and we&apos;ll remove it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Changes to this policy</h2>
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
