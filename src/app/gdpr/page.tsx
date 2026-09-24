import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';
import CookieSettingsButton from '@/components/shared/CookieSettingsButton';

export const metadata: Metadata = {
  title: 'GDPR & Cookie Policy',
  description: 'How PolishPal handles your data and which cookies we use — and how to manage your preferences.',
  alternates: { canonical: '/gdpr' },
};

const h2 = 'text-2xl md:text-[1.75rem] font-bold leading-tight mb-4';
const link = 'font-bold text-cobalt-ink underline decoration-2 underline-offset-4 decoration-cobalt/30 hover:decoration-cobalt transition-colors';
const list = 'tile px-6 py-5 pl-10 md:pl-11 list-disc marker:text-crimson space-y-2.5';

export default function GdprPage() {
  return (
    <div>
      <div className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold">GDPR & Cookie Policy</h1>
            <div className="mt-5">
              <span className="chip bg-paper border-2 border-line text-muted">Last updated: July 17, 2026</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-pp py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12 text-[17px] md:text-lg leading-relaxed text-ink-2">

          <section>
            <h2 className={h2}>Who we are</h2>
            <p>
              PolishPal (<strong className="text-ink">polishpal.pl</strong>) is a free Polish language learning website. We are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR) and the ePrivacy Directive.
            </p>
            <p className="mt-4">
              For any data-related requests, contact us via the <Link href="/contact" className={link}>contact page</Link>.
            </p>
          </section>

          <section>
            <h2 className={h2}>What data we collect</h2>
            <p className="mb-5">We collect minimal data to operate the site:</p>
            <ul className={list}>
              <li><strong className="text-ink">Progress data</strong> — your lesson completion and quiz scores are stored locally in your browser (localStorage). We never transmit this to our servers.</li>
              <li><strong className="text-ink">Comments</strong> — if you post a comment, your display name is stored in our database (Supabase). No email or login is required.</li>
              <li><strong className="text-ink">Page views</strong> — anonymised visit counts via Umami Analytics (see below).</li>
              <li><strong className="text-ink">Advertising data</strong> — if you consent, Google AdSense may set cookies to show personalised ads on blog pages.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>Cookies we use</h2>

            <div className="tile divide-y-2 divide-line">
              <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold">Essential Cookies</h3>
                  <span className="chip bg-emerald-soft text-emerald-ink">Always active</span>
                </div>
                <p className="text-base">Required for the website to function. These include the CMS admin session cookie (<code className="font-mono text-sm font-bold text-ink bg-canvas rounded-md px-1.5 py-0.5">cms_session</code>). These cannot be disabled.</p>
              </div>

              <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold">Analytics — Umami</h3>
                  <span className="chip bg-cobalt-soft text-cobalt-ink">Optional</span>
                </div>
                <p className="text-base">We use <strong className="text-ink">Umami Analytics</strong> (<a href="https://umami.is" target="_blank" rel="noopener noreferrer" className={link}>umami.is</a>) to count page views and understand which pages are popular. Umami is <strong className="text-ink">cookie-free</strong> — it does not set any cookies, does not collect personal data, and does not share data with third parties. It is GDPR compliant without consent under most interpretations, but we give you the choice anyway.</p>
              </div>

              <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold">Advertising — Google AdSense</h3>
                  <span className="chip bg-sun-soft text-sun-ink">Requires consent</span>
                </div>
                <p className="text-base">If you consent, we load <strong className="text-ink">Google AdSense</strong> on blog pages. AdSense sets cookies to show personalised advertisements based on your browsing behaviour. Google&apos;s privacy policy applies: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={link}>policies.google.com/privacy</a>. Without consent, no AdSense script or cookies are loaded.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className={h2}>Your rights under GDPR</h2>
            <p className="mb-5">If you are in the EU/EEA, you have the following rights:</p>
            <ul className={list}>
              <li><strong className="text-ink">Right of access</strong> — request a copy of any data we hold about you.</li>
              <li><strong className="text-ink">Right to erasure</strong> — request deletion of your data (e.g. comments).</li>
              <li><strong className="text-ink">Right to rectification</strong> — request correction of inaccurate data.</li>
              <li><strong className="text-ink">Right to object</strong> — object to processing based on legitimate interests.</li>
              <li><strong className="text-ink">Right to withdraw consent</strong> — change your cookie preferences at any time below.</li>
            </ul>
            <p className="mt-5">To exercise any right, <Link href="/contact" className={link}>contact us</Link>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className={h2}>Data retention</h2>
            <ul className={list}>
              <li>Comments are kept indefinitely unless you request deletion.</li>
              <li>Umami page-view data is retained for 12 months and is fully anonymised.</li>
              <li>Cookie consent preferences are stored in your browser&apos;s localStorage and are not transmitted to us.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>Third-party processors</h2>
            <ul className={list}>
              <li><strong className="text-ink">Supabase</strong> — database and storage (EU region). <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className={link}>Privacy policy</a></li>
              <li><strong className="text-ink">Vercel</strong> — web hosting. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className={link}>Privacy policy</a></li>
              <li><strong className="text-ink">Umami Cloud</strong> — analytics (if consented). <a href="https://umami.is/privacy" target="_blank" rel="noopener noreferrer" className={link}>Privacy policy</a></li>
              <li><strong className="text-ink">Google AdSense</strong> — advertising (if consented). <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={link}>Privacy policy</a></li>
            </ul>
          </section>

          <section className="rounded-3xl bg-sun-soft p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <span className="icon-badge bg-sun text-ink">
                <Cookie className="w-6 h-6" strokeWidth={2.4} />
              </span>
              <div>
                <h2 className={h2}>Manage your cookie preferences</h2>
                <p className="mb-5 text-sun-ink font-semibold">You can change your choices at any time. Your preference is stored locally in your browser.</p>
                <CookieSettingsButton className="btn btn-primary" />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
