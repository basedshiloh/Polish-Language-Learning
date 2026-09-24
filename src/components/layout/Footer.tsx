import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import CookieSettingsButton from '@/components/shared/CookieSettingsButton';
import { blogCategoryStyles } from '@/data/blog';
import type { BlogCategory } from '@/lib/types';

const LEARN_LINKS = [
  { label: 'Lessons', href: '/lessons' },
  { label: 'Grammar Reference', href: '/grammar' },
  { label: 'Quizzes', href: '/quizzes' },
  { label: 'My Progress', href: '/progress' },
];

const BLOG_LINKS: BlogCategory[] = ['culture', 'learning-tips', 'grammar-deep-dive', 'vocabulary', 'music'];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Editorial Policy', href: '/editorial' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'GDPR & Cookie Policy', href: '/gdpr' },
];

const linkCls = 'text-[15px] font-semibold text-white/85 hover:text-white transition-colors';

export default function Footer() {
  return (
    <footer className="scallop-top bg-brand-700 text-white mt-16 pt-6">
      <div className="container-pp pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-x-8 gap-y-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <span className="w-11 h-11 rounded-[12px] bg-white p-1.5 shadow-[0_3px_0_rgba(0,0,0,0.18)]">
                <Image src="/logo.svg" alt="" width={32} height={32} className="rounded-[8px]" />
              </span>
              <span className="font-display font-semibold text-2xl text-white">PolishPal</span>
            </Link>
            <p className="text-[15px] text-white/85 leading-relaxed max-w-xs">
              Free Polish language course from A0 to A1, based on real university materials. No sign-up required.
            </p>
            <Link href="/lessons" className="btn btn-white btn-sm mt-6">
              Start lesson 1 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Learn */}
          <div>
            <h2 className="font-display text-lg font-semibold text-white mb-4">Learn</h2>
            <ul className="space-y-2.5">
              {LEARN_LINKS.map(({ label, href }) => (
                <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h2 className="font-display text-lg font-semibold text-white mb-4">Blog</h2>
            <ul className="space-y-2.5">
              {BLOG_LINKS.map((key) => (
                <li key={key}>
                  <Link href={`/blog?category=${key}`} className={linkCls}>{blogCategoryStyles[key].label}</Link>
                </li>
              ))}
              <li><Link href="/blog" className={linkCls}>All articles</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-2 sm:col-span-1">
            <h2 className="font-display text-lg font-semibold text-white mb-4">PolishPal</h2>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}><Link href={href} className={linkCls}>{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t-2 border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-white/85">
          <p className="font-semibold">
            © 2026 PolishPal. Education is free and should be accessible to everyone.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0/deed.en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="4" />
                <text x="32" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" dy=".3em" fill="currentColor">CC</text>
                <text x="32" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" dy=".3em" fill="currentColor">0</text>
              </svg>
              All content CC0 1.0
            </a>
            <CookieSettingsButton />
            <a
              href="https://github.com/basedshiloh/Polish-Language-Learning"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open source on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
