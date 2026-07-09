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
    date: 'July 10, 2026',
    version: '2.1.1',
    changes: [
      { type: 'changed', text: 'Blog list page container widened to max-w-5xl for a more spacious editorial feel' },
      { type: 'changed', text: 'Blog list page and filtered/paginated view now have sticky left and right ad sidebars (w-[160px], visible at 2xl breakpoint) — fully managed via /polaris/ads using slot keys blog-sidebar-left and blog-sidebar-right' },
      { type: 'changed', text: 'Blog sidebar ads positioned at 25vh offset and sticky at 30vh so they appear in the mid-screen zone rather than pinned to the top edge' },
      { type: 'changed', text: 'Single post layout changed to 3-column: left sticky ad sidebar (post-sidebar slot) | centered max-w-2xl article | right TOC' },
      { type: 'fixed', text: 'Single post TOC and left ad sidebar were not sticky — caused by items-start on the flex container collapsing aside height; removed items-start so asides stretch to article height' },
      { type: 'fixed', text: 'Single post left and right sidebars were pushed to page edges because center column used flex-1 (consumed all space); changed to w-full max-w-2xl with justify-center so sidebars hug the article' },
      { type: 'changed', text: 'Section dividers and borders throughout the blog page softened — dark mode uses gray-700/800 instead of near-white; light mode uses gray-100/200 instead of bold gray-900 lines' },
      { type: 'changed', text: 'Category sections now show 6 posts per section (1 lead feature + 5 stacked mini-cards) for better left/right column balance' },
    ],
  },
  {
    date: 'July 10, 2026',
    version: '2.1.0',
    changes: [
      { type: 'added', text: 'IndexNow CMS page (/polaris/indexnow) — bulk-submit any combination of blog posts, lessons, grammar pages, quizzes, and static pages to Bing/Yandex/other search engines with one click' },
      { type: 'added', text: 'IndexNow auto-submit on publish — when a post is saved as published or toggled to published, its URL is automatically submitted to IndexNow in the background' },
      { type: 'added', text: 'IndexNow key file hosted at /c1c02929ad4d4c7ba63a4561cc5e83b5.txt for domain ownership verification' },
      { type: 'changed', text: 'Blog page redesigned with Atlantic/every.to-inspired editorial layout — compact max-width container (max-w-4xl), left/right breathing margins, bold masthead, 2-column hero with numbered "More Stories" list, Atlantic-style thick-rule section headers per category, and lead feature + stacked mini-card layout for each category section' },
      { type: 'changed', text: 'Category filter pills updated to minimal black border / filled style matching editorial aesthetic' },
      { type: 'changed', text: 'Culture Picks slider now contained within the max-width grid with rounded corners rather than full-width bleeding' },
    ],
  },
  {
    date: 'July 6, 2026',
    version: '2.0.1',
    changes: [
      { type: 'fixed', text: 'Blog category sections now always show all posts — previously, if the newest post in a category became the hero or a side story, the entire section appeared empty' },
      { type: 'fixed', text: 'Multi-category posts (e.g. tagged as both Culture and Arts) now appear in every category section they belong to, not just the Culture slider' },
      { type: 'changed', text: 'Content Visualizer now auto-clusters posts under pillars — posts in the same category as a pillar group automatically without needing a manual assignment; tag and keyword overlap breaks ties between multiple pillars in the same category' },
    ],
  },
  {
    date: 'July 5, 2026',
    version: '2.0.0',
    changes: [
      { type: 'added', text: 'Automatic content backup system — every save and edit creates a snapshot before overwriting; deletion always saves a pre-delete copy that is kept forever' },
      { type: 'added', text: 'Daily full-site backup at 02:00 UTC via Vercel Cron — all posts saved as a single JSON snapshot' },
      { type: 'added', text: 'Backups CMS page (/polaris/backups) — browse all backups by type, filter by slug, preview JSON, and restore any post to any past state in one click' },
      { type: 'added', text: '"Backup All Now" button for on-demand full-site manual snapshots' },
      { type: 'added', text: 'Multi-category support for blog posts — assign more than one category per post; first selected is the primary' },
      { type: 'added', text: 'New blog categories: Polish Music, Memes & Pop Culture, Arts' },
      { type: 'added', text: 'Culture Picks slider on the blog front page — auto-populated from the culture category with prev/next arrows and brand-blue background' },
      { type: 'added', text: 'Blog posts included in the global header search with grouped results (Blog / Lessons / Grammar / Quizzes)' },
      { type: 'added', text: 'Per-quiz SEO metadata — each quiz gets its own title, description, and Open Graph tags' },
      { type: 'added', text: 'Ad slot in the blog hero right column (300×250)' },
      { type: 'added', text: 'Live word/character/reading-time/paragraph/sentence/H2/H3 counters in the post editor' },
      { type: 'added', text: 'Search box in Link Manager with live result count' },
      { type: 'added', text: 'Google AdSense verification meta tag' },
      { type: 'fixed', text: 'Author avatar now shows the PolishPal logo on all posts, including older ones, without any database change' },
      { type: 'fixed', text: 'External outbound links are dofollow by default; nofollow is opt-in only via title="nofollow"' },
      { type: 'fixed', text: 'Dark mode border lines changed from white to gray-700/800; light mode lines softened to gray-200' },
      { type: 'changed', text: 'Blog front page redesigned as a newspaper layout — 3-column masthead grid, category sections, and "Coming soon" placeholder for empty categories' },
      { type: 'added', text: 'Referrer spam blocking — 403 returned for known spam domains (rankchief.shop, skyrocketlink.shop)' },
    ],
  },
  {
    date: 'June 29, 2026',
    version: '1.9.0',
    changes: [
      { type: 'changed', text: 'New brand color (#242EF7) across the whole site — softer periwinkle canvas, rounder cards, and pill-style active navigation' },
      { type: 'changed', text: 'Logo and favicon recolored to match the new brand' },
      { type: 'added', text: 'Advertisement slots managed from the CMS — image banners, ad-network embeds, or a default "Advertise here" placeholder linking to the contact page' },
      { type: 'added', text: 'Magazine-style blog front page: lead story, Latest column, and a Culture Picks section' },
      { type: 'added', text: 'Collapsible in-article table of contents on mobile (desktop keeps the sidebar TOC)' },
      { type: 'removed', text: 'Legacy markdown blog files and dead code removed — the Supabase CMS is the single source of truth' },
    ],
  },
  {
    date: 'June 28, 2026',
    version: '1.8.0',
    changes: [
      { type: 'added', text: 'Content Visualizer — a pillar → cluster "pyramid" showing how posts relate, with green/orange flags for whether cluster posts actually link to their pillar' },
      { type: 'added', text: 'Search-intent tagging on posts (informational / commercial / transactional / navigational)' },
      { type: 'added', text: 'Mark a post as a "pillar" — Link Genius and agents now prioritize internal links to pillar posts' },
      { type: 'added', text: 'Visible SEO score on every post in the list (color-coded) with a "worst-first" sort to spot pages to improve' },
      { type: 'added', text: 'Link Manager now shows inbound anchor text + source URL — see exactly which keywords point to each page' },
    ],
  },
  {
    date: 'June 28, 2026',
    version: '1.7.0',
    changes: [
      { type: 'added', text: 'Application Passwords — REST API keys so agents/apps can publish posts without logging into the CMS' },
      { type: 'added', text: 'Sorting & search in Posts, Comments, and Link Manager' },
      { type: 'added', text: 'Link Manager dofollow/nofollow badges (green/orange) for external links' },
      { type: 'added', text: '"Latest from the Blog" section on the homepage' },
      { type: 'added', text: 'Custom 404 page (returns a proper 404 status, not a soft 200)' },
      { type: 'added', text: 'llms.txt — a curated index that helps AI assistants understand and cite the site' },
      { type: 'changed', text: 'Cookie Policy updated to document the admin login cookie (cms_session)' },
    ],
  },
  {
    date: 'June 27, 2026',
    version: '1.6.0',
    changes: [
      { type: 'added', text: 'Custom CMS at /polaris — write, edit, and publish blog posts from the browser' },
      { type: 'added', text: 'Markdown editor with live preview, formatting toolbar, and word/reading-time counter' },
      { type: 'added', text: 'RankMath-style SEO panel — focus keyword, density, title/meta length, and live score' },
      { type: 'added', text: 'Link Genius — keyword-based internal link suggestions across lessons, grammar, quizzes, and posts' },
      { type: 'added', text: 'Image uploads auto-converted to WebP and stored in Supabase Storage' },
      { type: 'added', text: 'Secure cookie-based CMS login; comment moderation folded into the CMS' },
      { type: 'changed', text: 'Blog content migrated from repo files to the Supabase database (instant publishing)' },
    ],
  },
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
