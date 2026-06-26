import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-12 py-8 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Education is free and should be accessible to everyone.
        </p>

        <a
          href="https://creativecommons.org/publicdomain/zero/1.0/deed.en"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64" fill="currentColor" aria-label="CC0 logo">
            <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
            <text x="32" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" dy=".3em" fill="currentColor">CC</text>
            <text x="32" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" dy=".3em" fill="currentColor">0</text>
          </svg>
          <span>CC0 1.0 Universal — 2026</span>
        </a>

        <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-xs">
          <Link href="/about" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">About</Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <Link href="/contact" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Contact</Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <Link href="/editorial" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Editorial Policy</Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <Link href="/changelog" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Changelog</Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <Link href="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</Link>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <Link href="/cookies" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Cookies</Link>
        </div>

        <a
          href="https://github.com/basedshiloh/Polish-Language-Learning"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Contribute on GitHub
        </a>
      </div>
    </footer>
  );
}
