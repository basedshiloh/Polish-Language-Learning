# PolishPal — Agent Mistakes to Avoid

Hard lessons from real publishing errors. Read this alongside
`blog-authoring.md` and `cms-api-publishing.md` before writing or posting anything.

---

## 1. NEVER use placeholder image paths

**Wrong:**
```md
![Some alt text](polish-consonant-clusters-chart.jpg)
![Another image](szcz-sound-breakdown.jpg)
```

These files do not exist. They render as broken images on the live site.
No placeholder. No `.jpg`. No `.png`. No filename-only paths.

**Right — option A (existing image already in `public/blog/`):**
```md
![Polish pronunciation guide open on a desk — Photo by Pixabay on Pexels](/blog/pronunciation.webp)
```

**Right — option B (new image, full pipeline):**
1. Source the image — don't default to one provider out of habit:
   - **Wikimedia Commons** for real people/places/named things (verify the *specific
     file's* license, never assume a whole category is free-use; avoid trademarked
     logos unless the file is tagged public-domain/textlogo)
   - **Pexels or Pixabay** (API keys in maintainer notes) for generic/thematic images
     with no specific real-world subject — mix providers across an article rather than
     pulling every image from the same source
2. Convert with Python Pillow — never `sips`, never `/api/cms/upload`
3. Validate RIFF: `f[8:12] == b"WEBP"` and `int.from_bytes(f[4:8],"little") + 8 == len(f)`
4. Save as `public/blog/<slug>-<purpose>.webp`
5. Reference as `/blog/<slug>-<purpose>.webp`
6. `git add` + `git push` to deploy before the post goes live

**If you don't have images ready: publish as `"status": "draft"` and note what images are needed.
Never publish `"published"` with broken image paths.**

---

## 2. NEVER add a manual Table of Contents

The site renders a `TableOfContents` component automatically in the right sidebar,
built from every `##` heading in the article. A manual TOC in the body creates a
duplicate and looks broken.

**Wrong:**
```md
## Table of Contents
- [Section One](#section-one)
- [Section Two](#section-two)
```

**Just don't add it. The sidebar handles it.**

---

## 3. NEVER use `{#anchor-id}` in headings

Pandoc-style heading anchors like `## My Section {#my-section}` are not stripped
by `MarkdownRenderer` — they render as visible literal text in the article.

**Wrong:**
```md
## Practice Exercises {#practice-exercises}
## Voicing Assimilation {#voicing-assimilation}
```

**Right:**
```md
## Practice Exercises
## Voicing Assimilation
```

If you need anchor links for a TOC, use plain heading text — the site's TOC
component derives IDs from heading text automatically.

---

## 4. NEVER open the markdown body with an `<h2>` or the article title

The page template renders `post.title` as the `<h1>`. Repeating it at the top of
the markdown creates a double title. Opening with `## …` skips the required 2–3
intro paragraphs.

**Wrong:**
```md
# Polish Consonant Clusters Explained
## Introduction
…
```

**Right:**
```md
Polish consonant clusters are one of the first things…

Here's the good news…

This guide covers…

## What Are Polish Consonant Clusters?
```

---

## 5. NEVER publish without checking all three files

A complete post = three changes, all in sync:

| File | Purpose |
|---|---|
| `src/content/blog/<slug>.md` | Body copy (reference / git history) |
| `src/data/blog.ts` | Metadata entry in `blogPosts` array |
| Supabase `posts` table | Live source — what the site actually renders |

Publishing to Supabase only (without updating `blog.ts` and the `.md`) leaves the
repository out of sync. Updating only the `.md` does nothing to the live site.

---

## 6. ALWAYS use relative paths for images and internal links

`MarkdownRenderer` only routes images through `next/image` (optimised, AVIF/WebP
negotiation) when `src` starts with `/`. An external `https://…` URL falls through
to a bare `<img>` and is not optimised.

**Wrong:**
```md
![alt](https://images.pexels.com/photos/123/photo.jpg)
![alt](https://gdtbogshuqmayallpgmk.supabase.co/storage/…/photo.webp)
```

**Right:**
```md
![alt](/blog/polish-consonant-clusters-featured.webp)
```

Same rule for internal links — always `/blog/…`, `/lessons/…`, `/grammar/…`,
never full `https://www.polishpal.pl/…` URLs.

---

## 7. Run the self-check script before every publish

From the repo root:

```bash
python3 - src/content/blog/<slug>.md "<focus keyword>" <<'PY'
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
# Extra checks
print("{# anchors?:", bool(re.search(r'\{#[^}]+\}',t)), "(should be False)")
print("broken images (.jpg/.png)?:", bool(re.search(r'!\[[^\]]*\]\([^)]*\.(jpg|png)\)',t,re.I)), "(should be False)")
print("manual TOC?:", '## Table of Contents' in t, "(should be False)")
PY
```

All items must look correct before pushing. Fix any failures first.

---

## 9. NEVER link to the same URL more than once in one article

Repeating the same destination URL multiple times in one article — even with different
anchor text — is internal link stuffing. Google treats it as manipulation and it dilutes
link equity rather than building it.

**Wrong (two links, same URL, same article):**
```md
…our guide to [learn polish](/blog/learn-polish-for-beginners) covers the basics.
…see our [learn polish for beginners](/blog/learn-polish-for-beginners) guide.
```

**Right — one link per destination URL per article:**
```md
…our guide to [learn polish](/blog/learn-polish-for-beginners) covers the basics.
```

### Anchor texts across articles

When a keyword research plan gives you multiple anchor texts for one URL (e.g.
"learn polish", "how to learn polish", "polish for beginners"), those anchors are
meant to be distributed across **separate future articles** — one anchor per article.
This builds a natural, varied anchor profile pointing to that URL over time.

**Mapping example for `/blog/learn-polish-for-beginners`:**

| Article | Anchor text to use | Why |
|---|---|---|
| Pronunciation / consonant clusters article | `learn polish` | Pronunciation is a first step; "learn polish" is broad |
| Self-study method / how-to article | `how to learn polish` | Matches the method angle |
| Grammar / vocabulary article | `polish for beginners` | Matches the beginner framing |

Never assign two anchors from the same target URL to the same article.

---

## 10. External links: dofollow by default — only add "nofollow" for Tier 3

**External links are dofollow by default. Do NOT add `title="dofollow"` — it is redundant and renders as a visible tooltip on the link.**

**Wrong — title="dofollow" is unnecessary and leaks into the HTML as a tooltip:**
```md
[Polish phonology](https://en.wikipedia.org/wiki/Polish_phonology "dofollow")
[Culture.pl profile](https://culture.pl/en/artist/zdzislaw-beksinski "dofollow")
```

**Right — plain markdown link, dofollow automatically:**
```md
[Polish phonology](https://en.wikipedia.org/wiki/Polish_phonology)
[Culture.pl profile](https://culture.pl/en/artist/zdzislaw-beksinski)
```

### The rule by tier

| Tier | Examples | What to write |
|---|---|---|
| **Tier 1** — Always safe | Wikipedia, MDN, .gov, .edu, .ac.uk, Cambridge Dictionary, Oxford Learner's, Merriam-Webster | Plain link — `[text](url)` |
| **Tier 2** — Usually good | British Council, Duolingo Research, Ethnologue, BBC, Guardian, Culture.pl | Plain link — `[text](url)` |
| **Tier 3** — Verify carefully | University news/blog pages, smaller niche blogs, forums | Add `"nofollow"` title |

Linking out to authoritative Tier 1/Tier 2 sources with dofollow **builds topical trust** —
search engines expect it. Slapping nofollow on Wikipedia looks unnatural and signals low confidence.

### How to mark nofollow (Tier 3 only)

```md
[some forum post](https://randomforum.com/thread/123 "nofollow")
```

The `MarkdownRenderer` reads the `"nofollow"` title, adds `rel="nofollow"` to the rendered `<a>`,
and strips the word from the visible tooltip so it never appears to readers.

**Before publishing:** scan every external link. Tier 1 and Tier 2 sources — plain markdown, no title needed. Only Tier 3 sources get `"nofollow"` title.

---

## 11. Titles: no forced numbering — but keep the focus keyword front-loaded

**There is no rule requiring a number in the title.** An earlier version of this guide said
every title needed a number + power word (`7 Proven Steps…`). That's gone — it made every
post read like the same listicle template, and the user explicitly called it out as a bad
default. Only use a number when the article genuinely is a numbered list of things.

**If the slug is `what-is-<subject>`, the title MUST start with `What Is <Subject>?`.**
This isn't just a stylistic default — the slug, the focus keyword, and the title's opening
words all need to match for the on-page SEO to work, and the site's own precedent (Żabka,
Biedronka) already does this. Don't drop the "What Is X" opening for the sake of variety —
that was tried on `what-is-paczkomat` and `what-is-bar-mleczny` (retitled to `"Meet the
Paczkomat…"` and `"Bar Mleczny: …"`) and had to be reverted once the user caught it, since it
broke the keyword-front-loading the slug was chosen for.

**Get variety from the second half of the title instead**, after the `What Is X?` opener —
that's where a colon-descriptor, a distinctive fact, or a tone shift belongs:

- `What Is Bar Mleczny? Poland's Cheap Communist-Era Cafeterias, Explained`
- `What Is Paczkomat? Poland's Orange Parcel-Locker Obsession`

Both open identically (correctly — that's the point), but end differently. **Before
publishing, check the last 2–3 post titles** (`select title from posts order by published_at
desc limit 3`) and vary the back half of the title, never the front-loaded keyword opener.

---

## 12. NEVER duplicate an external URL in one article — including image-credit/license links

Rule 9 already covers internal `/blog/`, `/lessons/`, `/grammar/` links. The same
principle applies to **external** links, and it's easy to miss because it usually
sneaks in through image captions rather than body citations: two images in the same
article sharing a license or a source page each get their own credit line, and it's
tempting to hyperlink the license/source URL every time.

**Wrong (same license URL linked twice in one article):**
```md
*Photo: Jane Doe, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), via Wikimedia Commons.*

...

*Photo: John Smith, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), via Wikimedia Commons.*
```

**Wrong (same source page linked twice for two different images from that source):**
```md
*Album artwork courtesy of [Requiem Records](https://requiem-records.com/pl/sklep/jesienne_odcienie_melancholii).*

...

*Photo courtesy of [Requiem Records](https://requiem-records.com/pl/sklep/jesienne_odcienie_melancholii).*
```

**Right — hyperlink the URL once, on its first appearance; every later mention is plain text:**
```md
*Photo: Jane Doe, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), via Wikimedia Commons.*

...

*Photo: John Smith, CC BY-SA 3.0, via Wikimedia Commons.*
```
```md
*Album artwork courtesy of [Requiem Records](https://requiem-records.com/pl/sklep/jesienne_odcienie_melancholii).*

...

*Photo courtesy of Requiem Records.*
```

**How to apply:** Before publishing, grep the draft for every `http` URL. If any URL
appears more than once, keep the markdown link on the first occurrence and strip the
link markup (keep the plain text) from every later one. This applies per-article —
it's fine (expected, even) for the same Wikipedia article or the same generic CC
license page to be cited across *different* articles; the problem is only repeating
it *within* one post.

**Why:** User caught this live (2026-07-06) after noticing the same
`creativecommons.org/licenses/...` URL repeated across image captions in a single
post. A duplicated outbound link adds no reader value the second time and looks
sloppy even where it isn't a real SEO penalty risk the way duplicate internal anchors are.

---

## 13. Internal links: spread them across the article, don't stack them near the end

It's tempting to write the whole article first and bolt on internal links afterward —
which naturally makes them all land in the same place: the closing paragraph, right
before (or instead of) a natural ending. That reads as a link dump, not natural
cross-referencing, even when each individual link is genuinely relevant.

**Wrong (both links saved for the closing paragraph):**
```md
...body with no internal links anywhere...

Reading Mickiewicz isn't really an academic exercise — it's a shortcut into
understanding why Poles talk about their language and literature the way they do.

If you want the fuller picture, our guide to [famous Polish people](/blog/famous-polish-people)
is a good next stop — and if the visual side of Polish Romanticism interests you,
[Polish folk motifs hiding in famous paintings](/blog/folk-motifs-in-polish-art)
covers the same era from the canvas instead of the page.
```

**Right — each link placed where its topic is actually being discussed:**
```md
...## Pan Tadeusz: Poland's National Epic, Explained

...a lavishly detailed portrait of Polish-Lithuanian gentry life just before it
vanished for good. That same attention to rural custom and folk detail shows up
constantly in [the folk motifs Polish painters later wove into their canvases]
(/blog/folk-motifs-in-polish-art) — Mickiewicz was doing in verse what visual
artists would spend the rest of the century doing in paint.

...## How Mickiewicz Shaped Modern Polish Identity

Streets named "Mickiewicza" exist in nearly every Polish city, and his name sits
alongside the other names covered in our guide to [famous Polish people]
(/blog/famous-polish-people) as one every visitor eventually learns to pronounce.

...closing paragraph ends naturally, no forced link.
```

This also makes Rule 9 (never duplicate a URL in one article) easier to follow —
when you place a link the moment its topic comes up, you naturally stop reaching
for the same destination twice out of habit at the end.

**How to apply:** While drafting, as soon as a sentence touches a topic that
another PolishPal post covers, link it right there. Don't keep a mental list of
"links to add" and dump them all into the wrap-up paragraph. If you're revising a
draft and notice every link is in the last 1-2 paragraphs, that's the signal to
move them.

**Why:** User caught this live (2026-07-12) after two back-to-back articles
(`adam-mickiewicz-pan-tadeusz`, `polish-nobel-prize-winners-in-literature`) both
had every internal link clustered in the closing paragraph — and the Nobel article
had even linked the same `/blog/adam-mickiewicz-pan-tadeusz` URL twice (once
mid-article where it was genuinely relevant, once again in the closing out of
habit), compounding this mistake with Rule 9's duplicate-link mistake.

---

## 8. Existing images available in `public/blog/`

These files are already deployed and safe to use as inline images:

| File | Best used for |
|---|---|
| `/blog/pronunciation.webp` | Pronunciation, sounds, audio |
| `/blog/polish-pronunciation.webp` | Pronunciation guide sections |
| `/blog/polish-alphabet.webp` | Alphabet, letters, writing |
| `/blog/mistakes.webp` | Common mistakes, errors to avoid |
| `/blog/learn-polish-app.webp` | Apps, practice, study tools |
| `/blog/routine.webp` | Study routine, daily practice |
| `/blog/cases.webp` | Grammar, cases, rules |
| `/blog/verbs.webp` | Verb conjugation, grammar |
| `/blog/gender.webp` | Noun gender, grammar |
| `/blog/travel.webp` | Travel phrases, Kraków |
| `/blog/food.webp` | Food, culture, vocabulary |
| `/blog/holidays.webp` | Holidays, traditions, culture |
| `/blog/know.webp` | Vocabulary, word choice |

Always write descriptive ALT text; at least one ALT must contain the focus keyword.
Format: `descriptive caption — Photo by NAME on Pexels`
