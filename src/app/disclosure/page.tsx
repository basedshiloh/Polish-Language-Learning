import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'Advertising & Affiliate Disclosure',
  description:
    'How PolishPal is funded: consent-based Google AdSense ads and labelled banner slots on the blog. We currently use no affiliate links. Ads never shape lessons.',
  path: '/disclosure',
});

const UPDATED = 'November 4, 2026';

const h2 = 'text-2xl md:text-[1.75rem] font-bold leading-tight mb-4';
const link = 'font-bold text-cobalt-ink underline decoration-2 underline-offset-4 decoration-cobalt/30 hover:decoration-cobalt transition-colors';
const list = 'tile px-6 py-5 pl-10 md:pl-11 list-disc marker:text-crimson space-y-2.5';

export default function DisclosurePage() {
  return (
    <div>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'Advertising & Affiliate Disclosure', url: 'https://www.polishpal.pl/disclosure' },
      ])} />
      <div className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">Advertising &amp; Affiliate Disclosure</h1>
            <p className="text-muted text-lg mt-4">Last updated: {UPDATED}</p>
          </div>
        </div>
      </div>

      <div className="container-pp py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12 text-[17px] md:text-lg leading-relaxed text-ink-2">
          <section>
            <p>
              PolishPal is free to use and has no paywall. Running it still costs money for hosting and the database, so some pages
              carry advertising. This page explains what kinds of ads and paid links you may see, and what we promise about them.
            </p>
          </section>

          <section>
            <h2 className={h2}>Advertising on the blog</h2>
            <ul className={list}>
              <li>
                <strong className="text-ink">Google AdSense.</strong> If you accept advertising cookies in our cookie banner, blog
                pages load Google AdSense, which may show personalised ads. If you do not accept, the AdSense script is not loaded at
                all. You can change your choice at any time with the Cookie Settings link in the footer. Details are in our{' '}
                <Link href="/gdpr" className={link}>GDPR &amp; Cookie Policy</Link>.
              </li>
              <li>
                <strong className="text-ink">Banner slots.</strong> The blog has fixed ad spaces that we may sell directly to
                advertisers. Each one is marked &ldquo;Advertisement&rdquo;, and outbound banner links carry{' '}
                <code className="text-base">rel=&quot;sponsored&quot;</code> so search engines know they are paid.
              </li>
              <li>
                <strong className="text-ink">Sponsored content.</strong> We do not publish sponsored articles at the moment. If we
                ever do, the article will say clearly at the top that it is sponsored and who paid for it.
              </li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>Affiliate links</h2>
            <p>
              We do not currently use affiliate links. When an article links to a book, app, course or shop, we earn nothing from it.
              If we add affiliate links in the future, we will mark them in the article and update this page.
            </p>
          </section>

          <section>
            <h2 className={h2}>What ads never change</h2>
            <ul className={list}>
              <li>Lessons, grammar tables and quizzes are never paid placements, and advertisers cannot edit or review them.</li>
              <li>
                Our recommendations are our own. We follow the sourcing and correction rules in our{' '}
                <Link href="/editorial" className={link}>Editorial Policy</Link>.
              </li>
              <li>All learning content stays free, with or without ad consent.</li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>Advertise with us</h2>
            <p>
              Businesses that want to reach Polish learners can find our advertising contact on the{' '}
              <Link href="/contact#advertise" className={link}>contact page</Link>. We only accept ads that are relevant and safe for a
              general audience.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
