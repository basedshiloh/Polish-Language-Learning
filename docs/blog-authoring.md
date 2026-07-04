# PolishPal Blog Authoring Guide (for agents)

How to write and publish a blog article on PolishPal so it matches the existing
posts and scores well in Rank Math-style on-page SEO. Follow this exactly — it
encodes the format, the SEO rules, and the internal-link card system the site uses.

> **Reader first.** Never sacrifice clarity or honesty to hit an SEO target.
> Keyword stuffing, clickbait, and filler all backfire. A genuinely useful 95/100
> article beats a stuffed 100/100 one.

---

## 1. What you create for one article

Publishing a post = **three** changes (no other code needed):

1. **Markdown body** → `src/content/blog/<slug>.md` (body only — see format below)
2. **Metadata entry** → prepend a `BlogPost` object to the `blogPosts` array in `src/data/blog.ts`
3. **Featured image** (+ any inline images) → `public/blog/<name>.jpg`, referenced as `/blog/<name>.jpg`

The page renders the title (`post.title`) as the `<h1>`, then the category chip,
author box, featured image, a summary box, then your markdown. **Do not repeat the
title inside the markdown.**

### `BlogPost` fields (`src/lib/types.ts`)

```ts
{
  slug: string;              // matches the .md filename, lowercase-hyphenated, contains the focus keyword
  title: string;             // SEO title, <= 60 chars (see Title rules)
  excerpt: string;           // 120-160 chars, contains the focus keyword early — used as meta description
  category: BlogCategory;    // exactly ONE of the values below
  author: blogAuthors.polishpal;
  date: string;              // 'YYYY-MM-DD'
  updatedDate?: string;      // optional
  featuredImage: string;     // '/blog/<name>.jpg'
  featuredImageAlt: string;  // descriptive ALT; at least the featured image's ALT contains the focus keyword
  readingTime: number;       // whole minutes (~200 wpm)
  tags: string[];            // 3-ish lowercase tags
  summary: string[];         // 3 one-line takeaways for the summary box
  published: boolean;        // true to show it
}
```

### Valid `category` values (pick exactly one)

| value | label |
|---|---|
| `learning-tips` | Learning Tips |
| `grammar-deep-dive` | Grammar Deep Dive |
| `culture` | Culture |
| `pronunciation` | Pronunciation |
| `vocabulary` | Vocabulary |

---

## 2. Markdown body format (`src/content/blog/<slug>.md`)

- **Start with 2–3 intro paragraphs — NOT an `<h2>`.** The first sentence must contain
  the focus keyword. Do not put the title at the top (the page already renders it as `<h1>`).
- Use `##` (H2) for main sections; `###` (H3) for tips, sub-points, and step/idea elaborations.
- **End naturally — no "Conclusion" / "Final Thoughts" heading.** Let the closing
  paragraphs (and a call-to-action linking to a lesson) wrap it up.
- Keep **every paragraph under 120 words** (2–4 sentences). Vary sentence openings —
  avoid repetitive/boring patterns.
- A `## Frequently Asked Questions` section near the end works well (bold question, plain answer).
- Tables, `> blockquotes`, `**bold**`, and inline `` `code` `` all render with styling.

### Internal links — two kinds

**Card links (preferred for lessons & grammar).** Any link whose href starts with
`/lessons/` or `/grammar/` renders as a rich **InternalCard** (icon + label + arrow),
*if it is the only thing in its paragraph*. Put each on its own line:

```md
[Introductions & Basic Phrases](/lessons/introductions)

[Polish Cases Overview — Grammar Reference](/grammar/cases-overview)
```

**Normal links.** Links to other posts (`/blog/<slug>`) and any other internal path
render as normal inline blue links — weave these into sentences with descriptive anchor text:

```md
…see our guide on [how to master Polish pronunciation](/blog/master-polish-pronunciation).
```

Use **descriptive, keyword-relevant anchor text** — never "click here". Include at
least 2–3 internal links total; weave them in naturally, not as a dump at the bottom.

Valid IDs you can link to (must exist — check `src/data/lessons.ts` / `grammar.ts`):

- **Lessons** (`/lessons/<id>`): `introductions`, `phonetics`, `pronouns-byc`,
  `nominative-gender`, `numbers-counting`, `conjugation-am-asz`, `instrumental-case`,
  `conjugation-e-isz`, `family-possessives`, `accusative-case`, `hobbies-free-time`,
  `conjugation-uje`, `food-drinks-ordering`, `daily-routine-time`, `genitive-case`,
  `shopping-clothing`
- **Grammar** (`/grammar/<id>`): `noun-gender`, `cases-overview`, `accusative`,
  `instrumental`, `genitive`, `byc`, `three-conjugations`, `znac-wiedziec-umiec`,
  `telling-time`, `numbers-reference`, `polish-cities`, `pronouns`, `shopping-money`,
  `frequency-adverbs`, `questions-answers`

### External links

Include 1–2 outbound links to authoritative sources (studies, official docs, Wikipedia —
never direct competitors). **Caveat:** `MarkdownRenderer` currently forces
`rel="noopener noreferrer nofollow"` and `target="_blank"` on all `http(s)` links, so
external links are nofollow site-wide. Rank Math's external-link test still passes on
presence; honoring the "followed external link" best practice would require a code change
in `src/components/blog/MarkdownRenderer.tsx`.

### Images

- **Always use `.webp` or `.avif` — never `.jpg` or `.png`.** Convert immediately after
  downloading. Quick CLI conversion: `cwebp input.jpg -o public/blog/name.webp -q 82`
  or `convert input.jpg -quality 82 public/blog/name.webp` (ImageMagick).
- Reference as `![ALT text](/blog/<name>.webp)` (or `.avif`). They render inside a `<figure>`
  with the ALT shown as a caption — so write human-readable ALT text.
- Aim for **at least 4 images** in/with the article (featured + 3 inline) for the media score.
- **At least one image's ALT must contain the focus keyword.** Make every ALT genuinely
  describe the photo (don't keyword-stuff ALTs).
- Fetch real photos from Pexels (API key is in the maintainer's notes). **Open the image
  and confirm it actually matches the section** before using it — a "Polish alphabet" photo
  must show letters, not a random stock shot.
- Existing posts credit photographers in the ALT, e.g. `… — Photo by NAME on Pexels`.

---

## 3. Rank Math SEO rules (the score)

**Keyword placement**
- Focus keyword in the **SEO title** (first ~50%), **excerpt/meta** (first 120 chars),
  **slug**, and the **first sentence** of the body.
- Every focus keyword (primary + each secondary) appears in the body, woven in naturally.

**Length & density**
- Target **2500+ words** for the full length score (below that the score drops fast).
- Primary keyword **density 1.0–1.5%** (never above 2.5%). For 2500 words that's roughly
  25–37 mentions of a short keyword — fewer for long phrases. Keep it natural.

**Structure**
- Primary **and** each secondary keyword appears in **at least one H2/H3 subheading**.
- 2–3 internal links + 1–2 external links (see above).

**Title (< 60 chars)**
- Focus keyword near the front. No dishonest clickbait.
- **Do not default to a numbered-listicle title** (`7 Facts About…`, `9 Reasons…`). Numbers
  are allowed when the article is genuinely a list, but they should not be a reflex — vary
  the structure article to article. See [`docs/agent-mistakes-to-avoid.md`](docs/agent-mistakes-to-avoid.md)
  for the "don't reuse the same title template back-to-back" rule and examples of different
  shapes to reach for.

**Readability**
- No paragraph over 120 words; clear H2/H3 hierarchy; 4+ images; the site auto-generates a
  Table of Contents from your H2s (`TableOfContents` component) — you don't add one manually.

The canonical, fuller rule set is the **`seo-content-rankmath`** skill (kept in the
maintainer's skills, e.g. `~/Downloads/SKILL-rankmath.md`). Apply it when writing; this
guide is the PolishPal-specific adaptation.

---

## 4. Self-check before publishing

Run this from the repo root against your draft and fix anything off (word count, density,
keyword-in-first-sentence, no leading H2, no conclusion heading, keywords in headings):

```bash
python3 - src/content/blog/<slug>.md "learn polish" <<'PY'
import sys,re
t=open(sys.argv[1],encoding='utf-8').read(); low=t.lower(); kw=sys.argv[2].lower()
lines=t.splitlines(); words=re.findall(r"[A-Za-ząćęłńóśźż0-9']+",t); wc=len(words)
n=len(re.findall(r'(?<![a-z])'+re.escape(kw)+r'(?![a-z])',low))
first_h2=next((i for i,l in enumerate(lines) if l.startswith('## ')), len(lines))
intro=[l for l in lines[:first_h2] if l.strip() and not l.startswith('#')]
heads=re.findall(r'^#{2,3}\s+(.+)$',t,re.M)
print("words:",wc," | density: %.2f%%"%(100*n/wc),"(target 1.0-1.5%)")
print("starts with H2?:", lines[0].startswith('#'), "(should be False)")
print("intro paragraphs before first H2:",len(intro),"(want 2-3)")
print("'Conclusion' heading?:", bool(re.search(r'^#+.*conclusion',low,re.M)),"(should be False)")
print("keyword in first sentence?:", kw in low[:low.find('.')+1])
print("keyword in a heading?:", any(kw in h.lower() for h in heads))
print("images:",len(re.findall(r'!\[',t))," | internal cards:",len(re.findall(r'\]\(/(lessons|grammar)/',t)),
      " | blog links:",len(re.findall(r'\]\(/blog/',t))," | external:",len(re.findall(r'\]\(http',t)))
PY
```

Then verify it builds: `npx tsc --noEmit` (and ensure every `/lessons/…`, `/grammar/…`,
and `/blog/…` link target actually exists).

---

## 5. Checklist

- [ ] `src/content/blog/<slug>.md` created — opens with intro paragraphs, no leading H2, no conclusion heading
- [ ] `BlogPost` entry prepended to `blogPosts` in `src/data/blog.ts`, one valid `category`
- [ ] Featured + 3 inline images in `public/blog/` as **`.webp` or `.avif`** (never jpg/png), verified visually, 1+ ALT has the focus keyword
- [ ] Focus keyword in title / excerpt / slug / first sentence; secondaries in body + headings
- [ ] 2500+ words, density 1.0–1.5%, no paragraph >120 words
- [ ] 2–3 internal links (lesson/grammar as cards, posts as inline links) + 1–2 external links
- [ ] Self-check script clean; `npx tsc --noEmit` passes; all link targets exist
