import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'PolishPal does not use cookies for tracking or advertising. We only use localStorage for your preferences and progress.',
  alternates: { canonical: '/cookies' },
  robots: { index: true, follow: true },
};

const h2 = 'text-2xl md:text-[1.75rem] font-bold leading-tight mb-4';
const link = 'font-bold text-cobalt-ink underline decoration-2 underline-offset-4 decoration-cobalt/30 hover:decoration-cobalt transition-colors';
const th = 'px-4 py-3 text-left font-extrabold text-ink';
const td = 'px-4 py-3 align-top';

function NoChip() {
  return (
    <span className="chip bg-emerald-soft text-emerald-ink">
      <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden="true" /> No
    </span>
  );
}

export default function CookiePolicyPage() {
  return (
    <div>
      <div className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold">Cookie Policy</h1>
            <div className="mt-5">
              <span className="chip bg-paper border-2 border-line text-muted">Last updated: June 27, 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-pp py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12 text-[17px] md:text-lg leading-relaxed text-ink-2">
          <section>
            <h2 className={h2}>The short version</h2>
            <div className="flex flex-col sm:flex-row gap-4 rounded-3xl bg-emerald-soft p-5 md:p-6">
              <span className="icon-badge bg-emerald text-white">
                <ShieldCheck className="w-6 h-6" strokeWidth={2.4} />
              </span>
              <p className="text-emerald-ink font-semibold">
                PolishPal does not use cookies for tracking, advertising, or analytics, and we don&apos;t set any third-party cookies.
                The only cookie we use is a strictly-necessary login cookie for the site administrator — regular visitors never
                receive it. Because we set no tracking or marketing cookies, there&apos;s nothing for visitors to consent to.
              </p>
            </div>
          </section>

          <section>
            <h2 className={h2}>What we use instead of cookies</h2>
            <p className="mb-5">
              Instead of cookies, we use <strong className="text-ink">localStorage</strong> — a browser storage mechanism that keeps data only on your device.
              Unlike cookies, localStorage data is never sent to our servers with each request.
            </p>

            <div className="overflow-x-auto rounded-2xl border-2 border-line">
              <table className="w-full text-[15px] border-collapse">
                <thead>
                  <tr className="bg-canvas">
                    <th className={th}>Data</th>
                    <th className={th}>Purpose</th>
                    <th className={th}>Sent to server?</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-line">
                  <tr>
                    <td className={`${td} font-bold text-ink`}>Learning progress</td>
                    <td className={td}>Track completed lessons, quiz scores, streaks</td>
                    <td className={td}><NoChip /></td>
                  </tr>
                  <tr>
                    <td className={`${td} font-bold text-ink`}>Accessibility settings</td>
                    <td className={td}>Font size, contrast, dyslexia mode</td>
                    <td className={td}><NoChip /></td>
                  </tr>
                  <tr>
                    <td className={`${td} font-bold text-ink`}>Your star ratings</td>
                    <td className={td}>Prevent duplicate votes</td>
                    <td className={td}><NoChip /></td>
                  </tr>
                  <tr>
                    <td className={`${td} font-bold text-ink`}>Comment display name</td>
                    <td className={td}>Pre-fill your name when commenting</td>
                    <td className={td}><NoChip /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className={h2}>The one cookie we do use</h2>
            <p className="mb-5">
              PolishPal has a private content-management area used only by the site administrator. When the administrator logs in,
              we set a single <strong className="text-ink">strictly-necessary</strong> cookie to keep them signed in:
            </p>
            <div className="overflow-x-auto rounded-2xl border-2 border-line">
              <table className="w-full text-[15px] border-collapse">
                <thead>
                  <tr className="bg-canvas">
                    <th className={th}>Cookie</th>
                    <th className={th}>Purpose</th>
                    <th className={th}>Who gets it</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={td}>
                      <code className="font-mono text-sm font-bold text-ink bg-canvas rounded-lg px-2 py-1">cms_session</code>
                    </td>
                    <td className={td}>Keeps the administrator logged into the content-management area</td>
                    <td className={td}><span className="chip bg-sun-soft text-sun-ink">Admin only</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-base text-muted">
              This cookie is <strong className="text-ink-2">httpOnly</strong> (not readable by JavaScript), <strong className="text-ink-2">secure</strong> (HTTPS only), and
              <strong className="text-ink-2"> SameSite=Lax</strong>. It contains no personal data and is never set for regular visitors browsing lessons,
              grammar, quizzes, or the blog. It expires after 30 days or when the admin logs out.
            </p>
          </section>

          <section>
            <h2 className={h2}>Third-party cookies</h2>
            <p>
              We do not embed any third-party services that set cookies. There are no analytics scripts (Google Analytics, etc.),
              no advertising networks, no social media widgets, and no tracking pixels on PolishPal.
            </p>
          </section>

          <section>
            <h2 className={h2}>Hosting infrastructure</h2>
            <p>
              Our website is hosted on <strong className="text-ink">Vercel</strong>, which may set essential, strictly-necessary cookies for load balancing
              and security purposes. These are infrastructure-level cookies that do not track users and are not used for advertising.
              See{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className={link}>
                Vercel&apos;s Privacy Policy
              </a>{' '}
              for details.
            </p>
          </section>

          <section>
            <h2 className={h2}>How to clear stored data</h2>
            <p>
              To clear all PolishPal data from your browser, go to your browser&apos;s settings and clear site data for <strong className="text-ink">polishpal.pl</strong>.
              This will reset your learning progress, accessibility settings, and saved comment name.
            </p>
          </section>

          <section className="tile p-6 md:p-8">
            <h2 className={h2}>Questions?</h2>
            <p>
              If you have questions about our cookie or data practices, feel free to open an issue on our{' '}
              <a href="https://github.com/basedshiloh/Polish-Language-Learning" target="_blank" rel="noopener noreferrer" className={link}>
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
