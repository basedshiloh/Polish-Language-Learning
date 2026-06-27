import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'A history of content updates, corrections, and new features on PolishPal.',
  alternates: { canonical: '/changelog' },
};

interface ChangelogEntry {
  date: string;
  version: string;
  changes: { type: 'added' | 'fixed' | 'changed' | 'removed'; text: string }[];
}

const typeStyles = {
  added: { label: 'Added', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  fixed: { label: 'Fixed', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  changed: { label: 'Changed', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  removed: { label: 'Removed', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
};

const changelog: ChangelogEntry[] = [
  {
    date: 'June 27, 2026',
    version: '1.5.0',
    changes: [
      { type: 'added', text: 'Share box on every lesson and grammar page — Facebook, X, Bluesky, Reddit, Instagram, and copy link' },
      { type: 'added', text: '"Download PDF" button on lessons and grammar topics (clean, content-only export)' },
      { type: 'added', text: 'New PolishPal logo — a speech bubble with the Polish "Ł", in calm blue-indigo' },
      { type: 'changed', text: 'Favicon regenerated to match the new logo' },
      { type: 'changed', text: 'Logo color switched from red to blue-indigo to suit the language-learning niche and match the site brand' },
    ],
  },
  {
    date: 'June 26, 2026',
    version: '1.4.0',
    changes: [
      { type: 'added', text: 'Blog section with 11 articles covering grammar, pronunciation, culture, and learning tips' },
      { type: 'added', text: 'About page with project background story' },
      { type: 'added', text: 'Contact page with GitHub issue templates' },
      { type: 'added', text: 'Editorial policy explaining content review process' },
      { type: 'added', text: 'Privacy policy and cookie policy pages' },
      { type: 'added', text: 'Changelog page (you\'re reading it!)' },
      { type: 'added', text: 'Mobile hamburger menu for Blog and About navigation' },
      { type: 'changed', text: 'All blog images converted from JPG to WebP for faster loading' },
      { type: 'changed', text: 'Canonical URLs updated to www.polishpal.pl' },
      { type: 'fixed', text: 'Sidebar "PolishPal" changed from h1 to span to avoid duplicate h1 tags' },
    ],
  },
  {
    date: 'June 25, 2026',
    version: '1.3.0',
    changes: [
      { type: 'added', text: 'Supabase integration for shared star ratings and comments' },
      { type: 'added', text: 'Comment moderation dashboard with hide/delete/stats' },
      { type: 'added', text: 'Threaded comment replies (2 levels deep)' },
      { type: 'added', text: 'URL spam detection — comments with links are blocked automatically' },
      { type: 'added', text: '30-second rate limiting on comments per author' },
      { type: 'changed', text: 'Dark mode toggle moved from bottom nav to top bar on mobile' },
    ],
  },
  {
    date: 'June 24, 2026',
    version: '1.2.0',
    changes: [
      { type: 'added', text: 'Accessibility panel: dyslexia font, high contrast, monochrome, big cursor, reading guide' },
      { type: 'added', text: 'Collapsible sidebar on desktop' },
      { type: 'added', text: 'Right-side contextual sidebars with progress and study tips' },
      { type: 'added', text: 'Text-to-speech (TTS) for Polish vocabulary, dialogues, and grammar examples' },
      { type: 'added', text: 'SEO: JSON-LD schemas (WebSite, Course, Article, FAQ, Breadcrumb), OG tags, Twitter cards' },
      { type: 'added', text: 'Sitemap.xml and robots.txt for search engines' },
    ],
  },
  {
    date: 'June 23, 2026',
    version: '1.1.0',
    changes: [
      { type: 'added', text: '15 grammar reference topics with color-coded tables' },
      { type: 'added', text: 'Frequency adverb visual bar chart (zawsze → nigdy)' },
      { type: 'added', text: 'Znać vs wiedzieć vs umieć comparison guide' },
      { type: 'added', text: 'Instrumental, Accusative, and Genitive case reference pages' },
      { type: 'added', text: 'Full-text search across all lessons, grammar, and quizzes (⌘K shortcut)' },
      { type: 'added', text: 'Dark mode with three-way toggle (light/dark/system) and flash prevention' },
      { type: 'fixed', text: 'Matching quiz bug where duplicate values caused wrong selections' },
      { type: 'fixed', text: 'Nested button hydration error in PhraseList component' },
    ],
  },
  {
    date: 'June 22, 2026',
    version: '1.0.0',
    changes: [
      { type: 'added', text: '16 structured lessons from 37 real university lectures (A0–A1)' },
      { type: 'added', text: '16 interactive quizzes with multiple choice, fill-in-blank, and matching' },
      { type: 'added', text: 'Progress tracking with lesson completion, quiz scores, and streaks' },
      { type: 'added', text: 'Responsive design with mobile bottom nav and desktop sidebar' },
      { type: 'added', text: 'CC0 1.0 Universal public domain dedication' },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Changelog</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          A history of updates, fixes, and new features. For the full commit history, see our{' '}
          <a href="https://github.com/basedshiloh/Polish-Language-Learning/commits/main" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
            GitHub commits
          </a>.
        </p>

        <div className="space-y-10">
          {changelog.map((entry) => (
            <section key={entry.version}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg">
                  v{entry.version}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500">{entry.date}</span>
              </div>
              <div className="space-y-2 ml-1">
                {entry.changes.map((change, i) => {
                  const style = typeStyles[change.type];
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{change.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
