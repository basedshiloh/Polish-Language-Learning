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
  added: { label: 'Added', bg: 'bg-emerald-soft', text: 'text-emerald-ink' },
  fixed: { label: 'Fixed', bg: 'bg-cobalt-soft', text: 'text-cobalt-ink' },
  changed: { label: 'Changed', bg: 'bg-sun-soft', text: 'text-sun-ink' },
  removed: { label: 'Removed', bg: 'bg-crimson-soft', text: 'text-crimson-ink' },
};

// Timeline dot colour cycles through the papercut palette, newest first.
const DOT_TONES = [
  'bg-crimson shadow-[0_0_0_4px_var(--color-crimson-soft)]',
  'bg-cobalt shadow-[0_0_0_4px_var(--color-cobalt-soft)]',
  'bg-emerald shadow-[0_0_0_4px_var(--color-emerald-soft)]',
  'bg-sun shadow-[0_0_0_4px_var(--color-sun-soft)]',
  'bg-violet shadow-[0_0_0_4px_var(--color-violet-soft)]',
  'bg-orange shadow-[0_0_0_4px_var(--color-orange-soft)]',
];

const changelog: ChangelogEntry[] = [
  {
    date: 'September 25, 2026',
    version: '4.0.0',
    changes: [
      { type: 'changed', text: 'Full visual redesign: a friendlier, app-like look with rounded Fredoka headings, Nunito body text, tactile buttons and bordered tiles' },
      { type: 'changed', text: 'New colour palette inspired by Łowicz papercuts (wycinanki): Polish crimson as the brand colour, with each blog topic and grammar category getting its own colour' },
      { type: 'added', text: 'Homepage lesson path showing the course in order, plus live pronunciation buttons on the hero phrase card' },
      { type: 'added', text: 'Blog posts now end with a short "start lesson 1" card and show the article summary under the title' },
      { type: 'added', text: 'Quiz feedback bar that pops in after each answer with the correct answer and explanation' },
      { type: 'fixed', text: 'Blog images inside paragraphs no longer cause a hydration error' },
      { type: 'removed', text: 'Dark mode and the theme switcher: the site is now light mode only' },
    ],
  },
  {
    date: 'July 17, 2026',
    version: '3.0.0',
    changes: [
      { type: 'changed', text: 'Complete site redesign — moved from a dashboard-oriented sidebar layout to a content-first design with a horizontal top navigation bar' },
      { type: 'added', text: 'Mintlify-style mega menu: "Learn" dropdown (2×2 grid: Lessons, Grammar, Quizzes, Progress), "Blog" dropdown (categories + lazy-loaded latest posts), "About" simple dropdown' },
      { type: 'added', text: 'Responsive mobile drawer menu with accordion-style expandable sections for Learn, Blog, and About' },
      { type: 'changed', text: 'Homepage completely rewritten as a proper landing page (hero, stats strip, 3-column features, how-it-works steps, latest blog posts, FAQ, final CTA) — no longer a personal dashboard' },
      { type: 'added', text: 'FAQPage schema on the homepage for Google rich result eligibility' },
      { type: 'changed', text: 'Footer redesigned as a 3-column layout: brand + CC0 license, Learn links, Company links' },
      { type: 'removed', text: 'Left sidebar and bottom mobile nav replaced by the new top navigation bar' },
      { type: 'added', text: 'Editor\'s Picks / highlighted posts system — tick the "Highlight this post" checkbox in the CMS to feature a post in a dedicated section on the blog page and below the TOC on every single post' },
      { type: 'added', text: 'Google AdSense auto ads scoped to blog pages only (/blog and /blog/*) — homepage, lessons, grammar, and quizzes are ad-free' },
      { type: 'added', text: 'ads.txt file at /ads.txt for Google AdSense publisher verification' },
    ],
  },
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
    <div>
      <div className="bg-canvas border-b-2 border-line">
        <div className="container-pp py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold">Changelog</h1>
            <p className="text-muted text-lg mt-4">
              A history of updates, fixes, and new features. For the full commit history, see our{' '}
              <a href="https://github.com/basedshiloh/Polish-Language-Learning/commits/main" target="_blank" rel="noopener noreferrer" className="font-bold text-cobalt-ink underline decoration-2 underline-offset-4 decoration-cobalt/30 hover:decoration-cobalt transition-colors">
                GitHub commits
              </a>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(Object.keys(typeStyles) as (keyof typeof typeStyles)[]).map((t) => (
                <span key={t} className={`chip ${typeStyles[t].bg} ${typeStyles[t].text}`}>{typeStyles[t].label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-pp py-12 md:py-16">
        <div className="max-w-3xl mx-auto relative">
          {/* Timeline rail */}
          <span className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-line rounded-full" aria-hidden="true" />

          <div className="space-y-12">
            {changelog.map((entry, idx) => (
              <section key={entry.version} className="relative pl-10 md:pl-12">
                <span
                  className={`absolute left-[5px] top-2.5 w-3.5 h-3.5 rounded-full ${DOT_TONES[idx % DOT_TONES.length]}`}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="font-display font-semibold inline-flex items-center rounded-xl bg-ink text-white px-3 py-1.5 text-lg leading-none">
                    v{entry.version}
                  </span>
                  <span className="text-sm font-bold text-muted">{entry.date}</span>
                </div>
                <ul className="tile divide-y-2 divide-line overflow-hidden">
                  {entry.changes.map((change, i) => {
                    const style = typeStyles[change.type];
                    return (
                      <li key={i} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 px-4 py-3.5 md:px-5">
                        <span className={`chip self-start sm:w-[5.5rem] sm:justify-center shrink-0 uppercase ${style.bg} ${style.text}`}>
                          {style.label}
                        </span>
                        <p className="text-[15px] md:text-base leading-relaxed text-ink-2 min-w-0 break-words">{change.text}</p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
