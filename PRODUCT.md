# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: blog readers arriving from Google.** Mostly English speakers curious about Polish language and culture (phrases, surnames, food, traditions, Polish memes and music). They land on a single post, read it, and leave unless something pulls them further in. Confirmed by the owner (2026-09-25) as the audience the design serves first.
- **Secondary: self-study learners** working through the free A0 → A1 course: lessons, grammar tables, quizzes, progress.

## Product Purpose

PolishPal (polishpal.pl) is a free, no-sign-up Polish learning site. It pairs a structured A0 → A1 course (16 lessons built on university materials, grammar reference tables, quizzes, pronunciation via text-to-speech) with a culture/language blog that brings in search traffic. Success = blog readers become learners: they open a lesson, a grammar table, or a quiz after reading.

## Positioning

Free and open: no account, progress saved locally in the browser. Culture-rich blog content (Polish traditions, cities, food, pop culture) tied directly into course material via internal-link cards to `/lessons/…` and `/grammar/…`.

## Operating Context

- Blog content lives in the Supabase `posts` table, authored through the Polaris CMS (`/polaris`); markdown rendered by `src/components/blog/MarkdownRenderer.tsx`, including internal-link cards, summary boxes, tables, blockquotes.
- Course content lives in `src/data/lessons.ts`, `grammar.ts`, `quizzes.ts`.
- Google AdSense ads on blog pages (`AdSlot`), cookie consent (GDPR), comments, share box, author box.
- Deployed on Vercel from `main`.

## Capabilities and Constraints

- Next.js 16 App Router + Tailwind 4, lucide-react icons.
- **Light mode only** (owner decision 2026-09-25): no dark mode, no theme switcher.
- Redesign scope: public site. Polaris CMS keeps its current look (dark classes removed only).
- SEO is load-bearing: preserve headings, JSON-LD, URLs, metadata, ISR behaviour, ad slots.
- Accessibility panel (dyslexia font, contrast, reading guide, etc.) is an existing feature to preserve.

## Brand Commitments

- Name **PolishPal** and the existing logo mark (`public/logo.svg`) stay.
- Colours and typography are open for replacement (the old electric-indigo `#242EF7` is not binding).
- Reference feel chosen by the owner: **clean, friendly, rounded, colourful language-app, like Duolingo / Busuu**.

## Evidence on Hand

- Real course content (16 lessons, grammar tables, quizzes), 100+ blog posts with self-hosted WebP images in `public/blog/`.
- No testimonials, user counts, or ratings exist; do not fabricate them.

## Product Principles

1. Reading comes first: a Google visitor must get a fast, comfortable article.
2. Every page offers one obvious next step into the course.
3. Free and friction-free: never imply sign-up, payment, or accounts.
4. Polish words are the hero content: always visually distinct and pronounceable.

## Accessibility & Inclusion

Keep WCAG AA contrast, keyboard navigation, reduced-motion respect, and the existing accessibility panel.
