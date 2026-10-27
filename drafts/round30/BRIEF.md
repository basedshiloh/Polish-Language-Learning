# Round 30 writing brief (shared by all writer agents)

You are writing blog posts for **PolishPal** (https://www.polishpal.pl), a free A0→A1 Polish
course with a blog. Repo worktree (your working dir for all files):
`/Users/narwastunagoro/Polish Language Learning/Polish-Language-Learning/.claude/worktrees/round30-articles`
(below: `$WT`).

## Read first (mandatory)
1. `$WT/docs/agent-mistakes-to-avoid.md`
2. `$WT/docs/blog-authoring.md` (writing + Rank Math rules, self-check script in §4)
3. Your article's section in `/Users/narwastunagoro/Documents/PolishPal-Keyword-Research-Round30.md`
   (focus keyword, secondaries, angle, suggested internal links, slug, category).

IGNORE the parts of blog-authoring.md about editing `src/data/blog.ts` or
`src/content/blog/*.md` — those are legacy. Content goes to the CMS database later (by
the coordinator, not you). **Do not publish, do not call any CMS API, do not run git.**

## What you produce per article
1. `$WT/drafts/round30/<slug>.md` — markdown body only (no title H1, no leading H2,
   2–3 intro paragraphs, no "Conclusion" heading, no manual TOC, no `{#anchors}`).
2. `$WT/drafts/round30/<slug>.json` — metadata, exactly these keys:
   ```json
   {
     "slug": "<slug>",
     "title": "<= 60 chars, focus keyword front-loaded, no reflex listicle numbering",
     "excerpt": "120-160 chars, focus keyword in first ~60 chars",
     "metaDescription": "same as excerpt or a 150-160 char variant with the keyword",
     "focusKeyword": "<primary keyword, lowercase>",
     "category": "<one of: culture, vocabulary, grammar-deep-dive, learning-tips, pronunciation, music, arts, memes-pop-culture>",
     "tags": ["~6 lowercase tags, first = focus keyword"],
     "summary": ["3-4 one-sentence takeaways"],
     "featuredImage": "/blog/<slug>-<name>.webp",
     "featuredImageAlt": "descriptive alt containing the focus keyword",
     "authorName": "PolishPal Contributor",
     "authorBio": "PolishPal Contributor writes about Polish culture, history, and language for learners and the Polish diaspora.",
     "intent": "informational",
     "sources": ["every URL you relied on for facts (for the coordinator's audit, not published)"],
     "factNotes": "anything you could NOT verify and therefore left out or hedged"
   }
   ```
3. Images: **4 per article** (featured + 3 inline) at `$WT/public/blog/<slug>-<name>.webp`.

## Length / SEO
- **2,500+ words of body** (count body only), focus keyword density 1.0–1.5%, keyword in
  the first sentence, in at least one H2/H3, in the title/excerpt/slug. Each secondary
  keyword in the body and in at least one H2/H3. No paragraph over 120 words.
- Run the self-check script from blog-authoring.md §4 on your .md and fix issues.
- Include a "Frequently Asked Questions" H2 (H3 per question) — house style.
- A short "Scenario: …" section (a realistic mini-dialogue with Polish + English) fits
  vocabulary/culture posts well — house style, use where natural.

## Links
- Internal: 3–4 links, spread through the article (not stacked at the end). Lesson /
  grammar links render as cards: `/lessons/<id>` or `/grammar/<id>` (see list below).
  Blog links: `/blog/<slug>`. Never link the same URL twice. Relative paths only.
- **Only link to blog slugs that are LIVE NOW** (list: `/Users/narwastunagoro/.claude/jobs/0db7ac88/tmp/posts.json`,
  field `slug`) **or Round 30 slugs scheduled BEFORE your article's date** (table below).
  Linking to a later-scheduled post would be a 404 when your post goes live.
- Lessons: introductions, phonetics, pronouns-byc, nominative-gender, numbers-counting,
  conjugation-am-asz, instrumental-case, conjugation-e-isz, family-possessives,
  accusative-case, hobbies-free-time, conjugation-uje, food-drinks-ordering,
  daily-routine-time, genitive-case, shopping-clothing
- Grammar: noun-gender, cases-overview, accusative, instrumental, genitive, byc,
  three-conjugations, znac-wiedziec-umiec, telling-time, numbers-reference, polish-cities,
  pronouns, shopping-money, frequency-adverbs, questions-answers
- External: 1–2 authoritative links (official sites, UNESCO, gov.pl, museums, Wikipedia
  only if nothing better). Never repeat an external URL (including in image credits).

## Accuracy (most important)
- **Every Polish word, phrase, ending and diacritic must be correct.** Double-check case
  endings, verb forms, aspect pairs and stress. When unsure, verify (e.g. Wiktionary,
  sjp.pwn.pl, the site's own `$WT/src/data/grammar.ts` / `lessons.ts`) or leave it out.
  A recent PR (#3 "polish-content-accuracy") had to fix errors — don't add new ones.
- Facts (dates, names, numbers, prices, rules) must come from sources you actually opened
  (WebSearch/WebFetch). No invented statistics, quotes or anecdotes. If you can't verify
  something, cut it or hedge it and note it in `factNotes`.
- Legal/official topics (B1 exam, Karta Polaka): check the official sites
  (certyfikatpolski.pl, gov.pl) yourself; don't state fees/dates you can't source; tell
  readers to confirm current details with the official body.
- Song/poem lyrics: only public-domain traditional texts in Polish; English renderings
  must be your own (don't copy modern published translations).

## Images
- Sources: Pixabay (API key in the maintainer's notes, `https://pixabay.com/api/?key=…&q=…&image_type=photo`),
  Pexels (API key in the maintainer's notes, sent as the `Authorization` header),
  Wikimedia Commons (check each file's license; prefer CC0/PD/CC BY/CC BY-SA).
- Download originals into a scratch dir OUTSIDE the repo: `/Users/narwastunagoro/.claude/jobs/0db7ac88/tmp/img/<slug>/`.
  Convert with Pillow: `.convert('RGB')`, resize to ≤1200px wide, `.save(out,'WEBP',quality=82,method=6)`.
  Validate: `f[8:12]==b'WEBP'` and `int.from_bytes(f[4:8],'little')+8==len(f)`.
- **Open every image (Read tool) and confirm it really shows what the caption says.**
  If no accurate photo exists, use an honest caption ("a candlelit cemetery like those…")
  rather than claiming it's the specific thing. Never claim a stock photo is Polish if it
  isn't known to be.
- Reference in markdown as `![ALT caption](/blog/<slug>-<name>.webp)`. ALT is shown as a
  caption — make it human-readable, and include a credit, e.g.
  `— Photo by NAME on Pexels` / `— Image by NAME from Pixabay` /
  `— Photo: NAME, CC BY-SA 4.0, via Wikimedia Commons`. At least one ALT contains the
  focus keyword. No .jpg/.png anywhere.

## Round 30 publish schedule (for the internal-link rule)
| Date | Slug |
|---|---|
| 2026-10-29 | polish-independence-day |
| 2026-11-03 | merry-christmas-in-polish |
| 2026-11-06 | polish-christmas-carols |
| 2026-11-10 | mikolajki-st-nicholas-day |
| 2026-11-13 | hello-in-polish |
| 2026-11-17 | polish-past-tense |
| 2026-11-20 | grandma-in-polish |
| 2026-11-24 | polish-b1-exam |
| 2026-11-27 | goodbye-in-polish |
| 2026-12-01 | how-are-you-in-polish |
| 2026-12-04 | polish-lullabies |
| 2026-12-08 | all-saints-day-poland |
| 2026-12-11 | polish-future-tense |
| 2026-12-15 | polish-prepositions |
| 2026-12-18 | polish-locative-case |
| 2027-01-05 | karta-polaka-interview |
| 2027-01-08 | polish-superstitions |
| 2027-01-12 | polish-dative-case |
| 2027-01-15 | polish-plural |

## Final report to the coordinator (keep it short)
Per article: slug, title, body word count, density, self-check output summary, image
files + what each shows + source/license, internal + external links used, and any
unverified claims you removed or hedged.
