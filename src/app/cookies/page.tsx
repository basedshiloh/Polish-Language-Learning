import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'PolishPal does not use cookies for tracking or advertising. We only use localStorage for your preferences and progress.',
  alternates: { canonical: '/cookies' },
  robots: { index: true, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Cookie Policy</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Last updated: June 26, 2026</p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">The short version</h2>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-xl p-5">
              <p className="text-green-800 dark:text-green-300 font-medium">
                PolishPal does not use cookies for tracking, advertising, or analytics. We don&apos;t set any third-party cookies.
                We don&apos;t use cookie banners because there&apos;s nothing to consent to.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">What we use instead of cookies</h2>
            <p className="mb-3">
              Instead of cookies, we use <strong>localStorage</strong> — a browser storage mechanism that keeps data only on your device.
              Unlike cookies, localStorage data is never sent to our servers with each request.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">Data</th>
                    <th className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">Purpose</th>
                    <th className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">Sent to server?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">Learning progress</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">Track completed lessons, quiz scores, streaks</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 font-medium">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">Theme preference</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">Remember light/dark/system mode</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 font-medium">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">Accessibility settings</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">Font size, contrast, dyslexia mode</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 font-medium">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">Your star ratings</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">Prevent duplicate votes</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 font-medium">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">Comment display name</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700">Pre-fill your name when commenting</td>
                    <td className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 font-medium">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Third-party cookies</h2>
            <p>
              We do not embed any third-party services that set cookies. There are no analytics scripts (Google Analytics, etc.),
              no advertising networks, no social media widgets, and no tracking pixels on PolishPal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Hosting infrastructure</h2>
            <p>
              Our website is hosted on <strong>Vercel</strong>, which may set essential, strictly-necessary cookies for load balancing
              and security purposes. These are infrastructure-level cookies that do not track users and are not used for advertising.
              See{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                Vercel&apos;s Privacy Policy
              </a>{' '}
              for details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">How to clear stored data</h2>
            <p>
              To clear all PolishPal data from your browser, go to your browser&apos;s settings and clear site data for <strong>polishpal.pl</strong>.
              This will reset your learning progress, theme preference, accessibility settings, and saved comment name.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Questions?</h2>
            <p>
              If you have questions about our cookie or data practices, feel free to open an issue on our{' '}
              <a href="https://github.com/basedshiloh/Polish-Language-Learning" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                GitHub repository
              </a>.
              Since PolishPal is open-source, you can inspect exactly what data is stored by reviewing the source code.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
