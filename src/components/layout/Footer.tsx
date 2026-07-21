import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const LEARN_LINKS = [
  { label: 'Lessons', href: '/lessons' },
  { label: 'Grammar Reference', href: '/grammar' },
  { label: 'Quizzes', href: '/quizzes' },
  { label: 'My Progress', href: '/progress' },
  { label: 'Blog', href: '/blog' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Editorial Policy', href: '/editorial' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.svg" alt="PolishPal" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-gray-900 dark:text-gray-100 text-base">PolishPal</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Free Polish language course from A0 to A1 — based on real university materials. No sign-up required.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Education is free and should be accessible to everyone.
            </p>
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0/deed.en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors mt-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 64 64" fill="currentColor" aria-label="CC0">
                <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
                <text x="32" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" dy=".3em" fill="currentColor">CC</text>
                <text x="32" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" dy=".3em" fill="currentColor">0</text>
              </svg>
              CC0 1.0 Universal — 2026
            </a>
          </div>

          {/* Learn */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Learn</p>
            <ul className="space-y-2.5">
              {LEARN_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Company</p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © 2026 PolishPal. All content released under CC0.
          </p>
          <a
            href="https://github.com/basedshiloh/Polish-Language-Learning"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Open source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
