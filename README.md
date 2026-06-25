# 🇵🇱 PolishPal — Learn Polish from Zero

**A free, open-source Polish language learning app for absolute beginners (A0 → A1).**

Built with real university lecture materials, interactive quizzes, grammar visualizations, and text-to-speech pronunciation — all in your browser.

🌐 **Live:** [polish-language-learning.vercel.app](https://polish-language-learning.vercel.app)

---

## ✨ Features

### 📚 16 Structured Lessons
Content extracted from 37 real university lectures, organized into thematic units:
- Greetings, introductions & polite phrases
- Polish phonetics & pronunciation guide
- Pronouns, verb conjugation & cases (Nominative, Accusative, Instrumental, Genitive)
- Numbers, time, shopping, daily routine & more
- Dialogues, cultural notes & survival phrases

### 🧠 Interactive Quizzes
- Multiple choice, fill-in-the-blank & matching question types
- Case-insensitive validation with alternative answer support
- Score tracking, streaks & personal best history

### 📖 Grammar Reference
15 visual grammar topics with:
- 🎨 Color-coded declension & conjugation tables
- 📊 Frequency adverb bar charts (zawsze → nigdy)
- 🔄 Side-by-side comparison cards (znać vs wiedzieć vs umieć)
- 💡 Tips, examples & cultural context

### 🔍 Instant Search
- Full-text search across all lessons, grammar & quizzes
- ⌘K keyboard shortcut
- Highlighted matches with context snippets

### 🗣️ Text-to-Speech
- Native Polish pronunciation (pl-PL) via Web Speech API
- Available on vocabulary, dialogues, phrases & grammar examples

### 💬 Community Comments
- Threaded replies (2 levels deep)
- Anti-spam: URL blocking, rate limiting (30s cooldown)
- Moderation dashboard for content management

### ⭐ Ratings
- Star rating system powered by Supabase
- Shared across all users — see what's most helpful

### ♿ Accessibility
- Dyslexia-friendly font toggle
- High contrast & monochrome modes
- Adjustable font size, line height & letter spacing
- Reading guide, big cursor & link highlighting

### 🌙 Dark Mode
- Three-way toggle: Light / Dark / System
- Flash-prevention on page load
- Full dark mode coverage across all components

### 📱 Fully Responsive
- Mobile-first design with bottom tab navigation
- Collapsible sidebar on desktop
- Right-side table of contents & contextual sidebars on large screens

### 🔎 SEO Optimized
- JSON-LD structured data (WebSite, Course, Article, FAQ, Breadcrumb)
- Open Graph & Twitter Card meta tags
- Semantic HTML & proper heading hierarchy

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | [Lucide React](https://lucide.dev) |
| Database | [Supabase](https://supabase.com) (ratings & comments) |
| TTS | Web Speech API |
| Hosting | [Vercel](https://vercel.com) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/basedshiloh/Polish-Language-Learning.git
cd Polish-Language-Learning

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials (optional — app works without them,
# but ratings and comments will be disabled)

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start learning! 🎉

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase service role key (server-side only) |
| `ADMIN_PASSWORD` | Optional | Password for comment moderation |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── lessons/            # 📚 Lesson list & detail pages
│   ├── grammar/            # 📖 Grammar reference pages
│   ├── quizzes/            # 🧠 Quiz pages
│   ├── progress/           # 📊 Progress tracking
│   ├── search/             # 🔍 Full search results
│   └── api/                # Server-side API routes
├── components/
│   ├── layout/             # Sidebar, MobileNav, SearchBox, Footer, etc.
│   ├── lessons/            # VocabularyTable, GrammarBlock, DialogueBlock
│   ├── grammar/            # GrammarTableView, FrequencyScale
│   ├── quiz/               # MultipleChoice, FillInBlank, Matching
│   ├── shared/             # StarRating, CommentSection, SpeakButton
│   └── seo/                # JSON-LD schema generators
├── data/
│   ├── lessons.ts          # 📚 16 lessons (~1500 lines of content)
│   ├── quizzes.ts          # 🧠 16 matching quizzes
│   └── grammar.ts          # 📖 15 grammar reference topics
├── hooks/                  # useProgress, useTheme, useSearch, etc.
└── lib/                    # Types, constants, Supabase client
```

---

## 🤝 Contributing

Contributions are welcome! Whether it's fixing a typo in Polish, adding new lessons, improving accessibility, or squashing bugs — every bit helps.

1. Fork the repository
2. Create your branch (`git checkout -b feature/new-lesson`)
3. Commit your changes
4. Push and open a Pull Request

### Adding Content

All content is data-driven — no code changes needed:
- **New lesson** → Add an object to `src/data/lessons.ts`
- **New quiz** → Add an object to `src/data/quizzes.ts`
- **New grammar topic** → Add an object to `src/data/grammar.ts`

---

## 📄 License

This project is dedicated to the public domain under the [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) license.

> 🎓 *Education is free and should be accessible for everyone.*

---

## 💜 Acknowledgments

- Content based on real Polish A0–A1 university lecture materials
- Built with love for the Polish language learning community
- Powered by open-source tools and the generous free tiers of Supabase & Vercel

---

<p align="center">
  <strong>Powodzenia! 🍀 Good luck with your Polish!</strong>
</p>
