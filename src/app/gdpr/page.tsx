import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CookieSettingsButton from '@/components/shared/CookieSettingsButton';

export const metadata: Metadata = {
  title: 'GDPR & Cookie Policy',
  description: 'How PolishPal handles your data and which cookies we use — and how to manage your preferences.',
  alternates: { canonical: '/gdpr' },
};

export default function GdprPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">GDPR & Cookie Policy</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Last updated: July 17, 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-10 text-gray-700 dark:text-gray-300">

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Who we are</h2>
            <p>
              PolishPal (<strong>polishpal.pl</strong>) is a free Polish language learning website. We are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR) and the ePrivacy Directive.
            </p>
            <p className="mt-2">
              For any data-related requests, contact us via the <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">What data we collect</h2>
            <p>We collect minimal data to operate the site:</p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside">
              <li><strong>Progress data</strong> — your lesson completion and quiz scores are stored locally in your browser (localStorage). We never transmit this to our servers.</li>
              <li><strong>Comments</strong> — if you post a comment, your display name is stored in our database (Supabase). No email or login is required.</li>
              <li><strong>Page views</strong> — anonymised visit counts via Umami Analytics (see below).</li>
              <li><strong>Advertising data</strong> — if you consent, Google AdSense may set cookies to show personalised ads on blog pages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Cookies we use</h2>

            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Essential Cookies</h3>
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">Always active</span>
                </div>
                <p className="text-sm">Required for the website to function. These include your dark/light theme preference (localStorage) and the CMS admin session cookie (<code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">cms_session</code>). These cannot be disabled.</p>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Analytics — Umami</h3>
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">Optional</span>
                </div>
                <p className="text-sm">We use <strong>Umami Analytics</strong> (<a href="https://umami.is" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">umami.is</a>) to count page views and understand which pages are popular. Umami is <strong>cookie-free</strong> — it does not set any cookies, does not collect personal data, and does not share data with third parties. It is GDPR compliant without consent under most interpretations, but we give you the choice anyway.</p>
              </div>

              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Advertising — Google AdSense</h3>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">Requires consent</span>
                </div>
                <p className="text-sm">If you consent, we load <strong>Google AdSense</strong> on blog pages. AdSense sets cookies to show personalised advertisements based on your browsing behaviour. Google&apos;s privacy policy applies: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">policies.google.com/privacy</a>. Without consent, no AdSense script or cookies are loaded.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Your rights under GDPR</h2>
            <p>If you are in the EU/EEA, you have the following rights:</p>
            <ul className="mt-2 space-y-1.5 list-disc list-inside">
              <li><strong>Right of access</strong> — request a copy of any data we hold about you.</li>
              <li><strong>Right to erasure</strong> — request deletion of your data (e.g. comments).</li>
              <li><strong>Right to rectification</strong> — request correction of inaccurate data.</li>
              <li><strong>Right to object</strong> — object to processing based on legitimate interests.</li>
              <li><strong>Right to withdraw consent</strong> — change your cookie preferences at any time below.</li>
            </ul>
            <p className="mt-3">To exercise any right, <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact us</Link>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Data retention</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Comments are kept indefinitely unless you request deletion.</li>
              <li>Umami page-view data is retained for 12 months and is fully anonymised.</li>
              <li>Cookie consent preferences are stored in your browser&apos;s localStorage and are not transmitted to us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Third-party processors</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><strong>Supabase</strong> — database and storage (EU region). <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy policy</a></li>
              <li><strong>Vercel</strong> — web hosting. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy policy</a></li>
              <li><strong>Umami Cloud</strong> — analytics (if consented). <a href="https://umami.is/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy policy</a></li>
              <li><strong>Google AdSense</strong> — advertising (if consented). <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy policy</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Manage your cookie preferences</h2>
            <p className="mb-4">You can change your choices at any time. Your preference is stored locally in your browser.</p>
            <CookieSettingsButton />
          </section>

        </div>
      </div>
    </div>
  );
}
