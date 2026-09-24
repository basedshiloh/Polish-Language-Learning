---
name: PolishPal
description: A free Polish course and culture blog that feels like a friendly language app, coloured with Łowicz papercuts.
colors:
  crimson: "#d91f3b"
  crimson-ink: "#a3142b"
  crimson-edge: "#a3142b"
  crimson-soft: "#ffe8ec"
  crimson-deep: "#b5162d"
  emerald: "#15803d"
  emerald-ink: "#11703b"
  emerald-edge: "#0e6130"
  emerald-soft: "#e2f6ea"
  sun: "#ffc21a"
  sun-ink: "#7a5600"
  sun-edge: "#d99e00"
  sun-soft: "#fff4cc"
  cobalt: "#2f5bea"
  cobalt-ink: "#1b3aa8"
  cobalt-edge: "#1f43b8"
  cobalt-soft: "#e7edff"
  fuchsia: "#d6338a"
  fuchsia-ink: "#9b1b5f"
  fuchsia-edge: "#a8246a"
  fuchsia-soft: "#fce6f1"
  orange: "#f2711c"
  orange-ink: "#a6470a"
  orange-edge: "#c25610"
  orange-soft: "#ffede0"
  violet: "#7c4ddb"
  violet-ink: "#5227a8"
  violet-edge: "#5f35b5"
  violet-soft: "#efe8fd"
  teal: "#0e9e9a"
  teal-ink: "#0a6b68"
  teal-edge: "#0b7b78"
  teal-soft: "#ddf5f3"
  ink: "#1e2132"
  ink-2: "#3a3f52"
  muted: "#6b7084"
  faint: "#9ba0b2"
  line: "#e5e7ee"
  line-2: "#d3d7e2"
  canvas: "#f6f7fa"
  paper: "#ffffff"
typography:
  display:
    fontFamily: "Fredoka, Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "4.6rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fredoka, Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  article-title:
    fontFamily: "Fredoka, Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  article-heading:
    fontFamily: "Fredoka, Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "1.9rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Fredoka, Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.01em"
  title-compact:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1.375
  body-article:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.8
  body:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  polish-word:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, sans-serif"
    fontWeight: 700
  label-button:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.06em"
  label-nav:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, sans-serif"
    fontSize: "13px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.08em"
  label-chip:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.04em"
rounded:
  sm: "12px"
  badge: "14px"
  md: "16px"
  tile: "20px"
  lg: "24px"
  xl: "28px"
  full: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  xl: "32px"
  section: "80px"
  section-lg: "112px"
components:
  button-primary:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.paper}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: "0.8rem 1.4rem"
  button-primary-sm:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.paper}"
    rounded: "13px"
    padding: "0.55rem 1rem"
  button-primary-lg:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.paper}"
    rounded: "18px"
    padding: "1rem 1.8rem"
  button-green:
    backgroundColor: "{colors.emerald}"
    textColor: "{colors.paper}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: "0.8rem 1.4rem"
  button-cobalt:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.paper}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: "0.8rem 1.4rem"
  button-sun:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.ink}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: "0.8rem 1.4rem"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: "0.8rem 1.4rem"
  button-secondary-hover:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  button-white:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.crimson-ink}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: "0.8rem 1.4rem"
  tile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.tile}"
    padding: "20px"
  chip-category:
    backgroundColor: "{colors.orange-soft}"
    textColor: "{colors.orange-ink}"
    typography: "{typography.label-chip}"
    rounded: "{rounded.full}"
    padding: "0.3rem 0.75rem"
  chip-filter-all-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label-chip}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1rem"
  input-search:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "56px"
    padding: "0 48px"
  input-search-focus:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  nav-trigger:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label-nav}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  nav-trigger-active:
    backgroundColor: "{colors.crimson-soft}"
    textColor: "{colors.crimson-ink}"
  icon-badge:
    rounded: "{rounded.badge}"
    size: "44px"
  speak-button:
    backgroundColor: "{colors.cobalt-soft}"
    textColor: "{colors.cobalt-ink}"
    rounded: "{rounded.full}"
    size: "32px"
  speak-button-speaking:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.paper}"
  path-node:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    rounded: "{rounded.full}"
    size: "72px"
  quiz-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    height: "64px"
    padding: "14px 16px"
  quiz-option-selected:
    backgroundColor: "{colors.cobalt-soft}"
    textColor: "{colors.cobalt-ink}"
  quiz-option-correct:
    backgroundColor: "{colors.emerald-soft}"
    textColor: "{colors.emerald-ink}"
  quiz-option-wrong:
    backgroundColor: "{colors.crimson-soft}"
    textColor: "{colors.crimson-ink}"
  callout-summary:
    backgroundColor: "{colors.emerald-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  callout-quote:
    backgroundColor: "{colors.sun-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "20px 24px"
  cta-post-end:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "32px 24px"
  footer:
    backgroundColor: "{colors.crimson-deep}"
    textColor: "{colors.paper}"
---

# Design System: PolishPal

## Overview

**Creative North Star: "The Papercut Lesson Book"**

PolishPal is a language app, not a SaaS landing page. Everything you can touch is a physical object: tiles sit on a thick bottom edge, buttons are chunky uppercase slabs that visibly press into the page, and the course is drawn as a path of round coloured stepping stones. The colour comes from Łowicz wycinanki (folk papercuts): a Polish-crimson brand on a white ground, with emerald, sun, cobalt, fuchsia, orange, violet and teal as the papercut accents. A symmetrical papercut flower, drawn in those exact colours, is the one decorative motif, and a scalloped paper edge separates major bands.

Density is relaxed and friendly, never dashboard-tight. Headings are round and warm (Fredoka), body copy is soft and very readable (Nunito), and the blog article is a calm 680px reading column where the only loud things are Polish words in crimson and the end-of-post invitation into lesson 1. Colour codes meaning (blog categories, course levels, quiz states); it is never sprinkled for decoration outside the papercut flower.

The system rejects the generic indigo hero-plus-card-grid layout and its electric-indigo palette; that indigo scale survives only inside the Polaris CMS.

**Key Characteristics:**
- White paper ground, near-black blue ink (never pure black text).
- Tactile depth from solid, unblurred bottom edges; pressing removes the edge.
- 2px-bordered tiles with a 4px bottom edge, 20px corners.
- Every category and level owns one papercut hue, used as a soft tint + ink text pair.
- Polish words always bold and crimson-ink.
- Light mode only. There is no dark theme and no `dark:` utility anywhere.

## Colors

A white-paper palette with one crimson brand voice and seven folk-papercut accents, each shipped as a four-part family: solid, soft tint, ink (text on the tint) and edge (the darker 3D bottom).

### Primary
- **Polish Crimson** (crimson): the brand. Primary buttons, the "Pal" in the wordmark, the hero headline accent, the end-of-post CTA panel, list markers, and the current-lesson node. White text on it passes AA (4.99:1).
- **Crimson Ink** (crimson-ink): every Polish word, link text in articles, hover colour for card titles, active nav text. Also the press edge under crimson buttons.
- **Blush Tint** (crimson-soft): active nav trigger ground, "Lesson 1" and "Up next" chips, the lessons icon badge, the wrong-answer quiz state.
- **Deep Crimson** (crimson-deep): the footer ground only, under a scalloped top edge.

### Secondary (the papercut accents)
Each accent codes one thing. The soft tint is the ground, the ink shade is the text on it (all pairs pass AA at 5.2:1 or better), the solid is for dots, nodes and filled buttons, and the edge is the 3D bottom under that solid.
- **Meadow Emerald** (emerald family): success and progress. Correct answers, "Completed", the green "Continue lesson" / "Check answer" button, the TL;DR summary box, progress fills. Category: Vocabulary.
- **Sunflower** (sun family): attention and play. Blockquotes, highlighted grammar endings, the "Cześć!" sticker, the final home CTA band, text selection. Text on solid sun is always ink, never white. Category: Memes & Pop Culture.
- **Cobalt** (cobalt family): listening and focus. Speak buttons, the selected quiz option, the focus ring, A0 level. Category: Learning Tips.
- **Papercut Violet** (violet family): grammar. Grammar reference cards and internal grammar link cards. Category: Grammar Deep Dive.
- **Folk Orange** (orange family): Culture category, path node colour.
- **Łowicz Fuchsia** (fuchsia family): Polish Music category, flower petals.
- **Vistula Teal** (teal family): Pronunciation category, A1 level.

### Neutral
- **Ink** (ink): headings, strong text, the "All articles" active filter chip, code block ground.
- **Ink 2** (ink-2): body copy and article paragraphs (10.4:1 on white).
- **Muted Slate** (muted): secondary text, excerpts, meta lines, placeholders (4.9:1 on white; 4.6:1 on canvas).
- **Faint Slate** (faint): icons and decoration only. It fails contrast as text (2.6:1).
- **Line** (line): tile borders, table rules, hairlines between rows.
- **Line 2** (line-2): hover border on tiles, secondary-button border and edge.
- **Canvas** (canvas): alternating section bands, table header rows, hover grounds, the search input at rest.
- **Paper** (paper): the page ground and every tile surface.

### Named Rules
**The Crimson Means Polish Rule.** Bold crimson-ink text is reserved for Polish words (and article links). If a Polish word appears anywhere, in a table, a phrase card or a paragraph, it gets weight 700 and crimson-ink; nothing else in running text gets that treatment.

**The Soft-and-Ink Pair Rule.** Text on an accent tint is always that same hue's ink shade (violet-ink on violet-soft, sun-ink on sun-soft). Never white on a tint, never grey on a tint.

**The One Hue, One Meaning Rule.** A category or level keeps its hue everywhere it appears (chip, dot, diamond, node). Don't borrow a category's colour to decorate an unrelated element. The papercut flower is the one place all hues appear together.

**The Indigo Quarantine Rule.** The legacy `blue-*` indigo scale (#242EF7 family) is reserved for the Polaris CMS. It never appears on a public page.

## Typography

**Display Font:** Fredoka (weights 500/600/700, with Nunito, ui-rounded, system-ui fallback)
**Body Font:** Nunito (400 to 900, italic available, with ui-rounded, system-ui fallback)

**Character:** Fredoka's round terminals give headings a warm, toy-like friendliness; Nunito keeps the same rounded DNA at text sizes and stays comfortable for long articles. Together they read as a learning app, not a publication.

### Hierarchy
- **Display** (Fredoka 600, 2.9rem mobile, 3.75rem from 640px, 4.6rem from 1024px; line-height 1.02; -0.02em): the home hero and the blog index h1 only.
- **Headline** (Fredoka 600, 1.875rem mobile to 2.6rem from 768px; line-height 1.25; tight tracking): section headings on landing pages ("Fresh from the blog", "Questions, answered").
- **Article Title** (Fredoka 600, 2.1rem, 2.6rem from 640px, 3rem from 768px; line-height 1.1; -0.015em; balanced wrap): the post h1.
- **Article Heading** (Fredoka 600, 1.65rem to 1.9rem; line-height 1.25): in-article h2, 56px space above. In-article h3 is 1.3 to 1.4rem.
- **Title** (Fredoka 600, 1.2rem up to 1.9rem for featured cards; line-height 1.375): card and tile titles, quiz prompts (1.5 to 1.875rem).
- **Title Compact** (Nunito 800, 15px): titles inside compact list rows and menus, where Fredoka would be too loud.
- **Body Article** (Nunito 400, 1.0625rem mobile, 1.15rem from 768px; line-height 1.8; ink-2): article paragraphs and lists inside a 680px column (about 65 to 70 characters).
- **Body** (Nunito 400 to 600, 15 to 16px; line-height 1.625): excerpts, descriptions, FAQ answers. Lead paragraphs step up to 1.125 to 1.25rem in muted.
- **Label Button** (Nunito 800, 0.9rem; 0.06em; UPPERCASE): all buttons. 0.78rem on small, 1rem on large.
- **Label Nav** (Nunito 800, 13px; 0.08em; UPPERCASE): top-nav menu triggers and mobile drawer section toggles; also stat-tile captions.
- **Label Chip** (Nunito 800, 0.72rem; 0.04em; sentence case): chips and pills.

### Named Rules
**The Two Voices Rule.** Fredoka is for headings and big numerals only; Nunito carries everything else, including buttons and labels. Base h1 to h4 inherit Fredoka, ink colour and -0.01em from the base layer.

**The Shouting Is For Pressing Rule.** Uppercase with wide tracking belongs to things you press or open (buttons, nav triggers) and tiny stat captions. Headings, chips and body are never uppercase.

**The Heading Weight Rule.** Headings sit at Fredoka 600. Weight 700 is for numerals in round nodes.

## Layout

The page container is 76rem (1216px) wide with 16px side gutters, 24px from 640px and 32px from 1024px. Articles narrow to a single 680px reading column, centred in a 1152px frame that adds a 224px sticky table of contents on the left from 1280px; the blog index uses a 72rem column with 160px ad rails from 1536px. FAQ and similar prose blocks use a 48rem column.

Rhythm is generous and vertical. Landing sections pad 64px (mobile) to 80px or 112px (desktop); section headings sit 40px above their content; grids gap 20 to 24px; tiles pad 20 to 32px. Sections alternate paper and canvas bands, and a canvas band entering after paper gets a 14px scalloped papercut top edge.

Grids are asymmetric where there is a lead item: the home hero is 1.05fr / 1fr, the blog feature is 1.35fr / 1fr, the tools bento runs on 6 columns (4+2, 3+3). Everything collapses to one column below 1024px (768px for the bento), and the lesson path's zig-zag halves its horizontal offset on phones. Breakpoints are Tailwind's defaults: 640, 768, 1024, 1280, 1536px.

**The Reading Column Rule.** Article text never runs wider than 680px, and nothing (sidebars, ads) sits inside that column's width.

## Elevation & Depth

Depth is physical, not atmospheric. Interactive and raised objects stand on a solid, unblurred bottom edge in a darker shade of their own colour; pressing moves the object down by exactly that edge and the edge disappears, so it reads as pushed into the paper. Tiles get the same idea from a 4px bottom border instead of a shadow. Blurred shadows exist only for things that genuinely float above the page: dropdown panels, search results, the modal and drawer, and the hero phrase card.

### Shadow Vocabulary
- **Press edge** (`box-shadow: 0 4px 0 var(--edge)`; 3px on small buttons, speak buttons and link-card arrows; 6px on 72px path nodes): the 3D bottom of every button, node and sticker. `--edge` is the colour's `-edge` token, `line-2` for secondary, `rgba(0,0,0,0.18)` for white-on-colour.
- **Pressed** (`transform: translateY(4px); box-shadow: 0 0 0 var(--edge)`): the active state of the press edge, 90ms ease.
- **Float panel** (`box-shadow: 0 18px 40px -18px rgba(30,33,50,0.25)`, 0.3 to 0.35 alpha variants): dropdown menus and search results.
- **Float card** (`box-shadow: 0 24px 50px -24px rgba(30,33,50,0.35)`): the hero phrase card over the papercut flower.

### Named Rules
**The Edge Rule.** If it presses, it has a solid bottom edge in its own darker shade, and pressing consumes the edge. No blurred shadow ever stands in for a press edge.

**The Blur Is For Floating Rule.** Diffuse shadows mark overlays and the one hero card that hovers over the flower. Tiles at rest are flat with a border.

## Shapes

Everything is soft-cornered and nothing interactive is sharp. The radius ladder: 12px for nav items, menu rows and small thumbnails; 14px for icon badges; 16px for buttons, inputs, tables and quiz letter keys; 20px for tiles; 24px for callouts and article images; 28px for bento cards and the end-of-post CTA panel; fully round for chips, dots, speak buttons and path nodes. Small buttons tighten to 13px, large ones open to 18px.

Borders are 2px and neutral (line), with the tile's bottom edge at 4px. Category markers are round dots in menus and lists and rotated rounded squares (diamonds) beside category headings. The papercut flower (12 alternating fuchsia/violet outer petals with sun tips, 8 orange inner petals, a cobalt centre ringed with white dots, sun and crimson core, optional emerald stem with leaves) is drawn only as decorative SVG, is aria-hidden, and survives the "hide images" accessibility mode. The scalloped edge (14px half-circles) is the one clipped silhouette.

## Components

### Buttons
Chunky, uppercase, and satisfying to press.
- **Shape:** gently rounded slabs (16px; 13px small, 18px large) with a transparent 2px border reserved for outline variants.
- **Primary:** crimson with white label, crimson-ink press edge, 0.8rem x 1.4rem padding. One primary per view region; it almost always leads into the course ("Start learning free", "Start lesson 1").
- **Green:** emerald with emerald-edge; used for in-lesson progress ("Continue lesson", "Check answer"). Emerald was darkened to #15803d so the white label clears AA (5.0:1).
- **Cobalt / Sun:** cobalt with white label; sun with ink label. Available, used sparingly.
- **Secondary:** paper with ink label, 2px line-2 border and line-2 edge; hover fills canvas (no brightness shift).
- **White:** paper with crimson-ink label and a translucent black edge; the button of choice on crimson grounds (footer, end-of-post CTA).
- **Hover / Active / Disabled:** hover brightens 5%; active drops 4px (3px small) and consumes the edge in 90ms; disabled is 50% opacity with no motion. Focus is the global 3px cobalt ring, 2px offset.

### Chips
- **Style:** fully round pills, 12px/800 label, soft tint + ink text from the category or state they name. Icons inside chips are 14px.
- **Filters:** blog topic filters are larger (13px, 8px x 16px) with a 2px border; inactive is paper with line border, active takes the category's tint, ink and solid border, and "All" goes solid ink with white text.

### Cards / Containers
- **Corner Style:** 20px (tiles); 28px for full-bleed tinted bento cards.
- **Background:** paper tiles; tinted bento cards use one accent's soft tint with ink headings in that hue.
- **Shadow Strategy:** flat; depth from the 4px bottom border (see Elevation).
- **Border:** 2px line, bottom 4px. Linked tiles lift 2px and darken the border to line-2 on hover, sink 1px on press; images inside zoom 3 to 4% over 500ms.
- **Internal Padding:** 20px standard, 24 to 32px for featured cards.

### Inputs / Fields
- **Style:** 56px tall, canvas fill, 2px line border, 16px corners, 16px semibold ink text, muted semibold placeholder, leading 20px icon.
- **Focus:** border turns cobalt and the fill turns paper.
- **Quiz answer fields** use the same shape at 18px bold, tinted emerald or crimson after checking.

### Navigation
- **Top bar:** sticky, 68px, paper at 95% with a light blur and a 2px line bottom border. Wordmark "Polish" in ink + "Pal" in crimson, Fredoka 600 22px beside the logo mark.
- **Triggers:** uppercase 13px/800 labels, muted at rest, ink on canvas on hover, crimson-ink on blush when open or when the section is current.
- **Dropdowns:** tiles with the float-panel shadow, popping in over 320ms. Learn shows four icon-badge rows plus a primary "Start lesson 1" button; Blog shows category dots and the latest three posts. Column group labels inside panels are small (12px/800, 0.1em, uppercase, muted) and live only inside menu panels.
- **Mobile:** a 340px right drawer with a full-width primary button at the top, collapsible uppercase sections, learn items as a 2-column grid of mini tiles, and categories as tinted chips.
- **Footer:** deep crimson ground under a scalloped edge, white Fredoka column headings, links in white at 85%, a white "Start lesson 1" button.

### Tables
Rounded (16px) with a 2px line frame, canvas header row in ink 800, 1px line row rules, 15px text. Polish cells use the Polish-word style; grammar endings are highlighted with a sun-soft fill, sun-ink text and a 2px sun underline.

### Callouts
- **TL;DR summary:** emerald-soft, 24px corners, Fredoka "TL;DR" title in emerald-ink, each point led by a round emerald check.
- **Blockquote:** sun-soft fill, 24px corners, ink text. No side stripe.
- **Divider (hr):** three dots, crimson, sun, emerald, centred.

### Speak Button (signature)
A round cobalt-soft button (32px, 40px medium) with a cobalt-ink speaker icon and a 3px cobalt edge; while speaking it turns solid cobalt and pulses. It sits before every Polish phrase that can be heard and presses like any other button.

### Lesson Path (signature)
Lessons render as round 72px nodes (48 to 56px in lists) with a 6px (4px) press edge, zig-zagging down the page in the papercut colour sequence crimson, orange, sun, emerald, teal, cobalt, violet, fuchsia. The first node carries a star and a floating "Start here" sticker; completed nodes are emerald with a check, the current node is crimson with a 6px blush ring, and a rounded 6px line rail connects list nodes.

### Internal Lesson Card (signature)
In articles, a paragraph containing only a link to `/lessons/…` or `/grammar/…` becomes a linked tile: a 48px icon badge (blush for lessons, violet tint for grammar), the link text in 16px/800 ink, and a round solid arrow button with its own press edge.

### End-of-Post CTA (signature)
Every article closes with a crimson panel (28px corners) holding a Fredoka invitation, a white "Start lesson 1" button and an outlined white grammar button, with the papercut flower growing out of the bottom-right corner.

## Do's and Don'ts

### Do:
- **Do** mark every Polish word bold (700) in crimson-ink, and pair heard phrases with a speak button.
- **Do** give anything pressable a solid bottom edge in its own `-edge` shade, and let :active consume it (translateY by the edge height, 90ms).
- **Do** build containers as tiles: paper, 2px line border, 4px bottom border, 20px corners.
- **Do** colour text on a tint with the same hue's `-ink` shade.
- **Do** end every blog post with an obvious way into lesson 1.
- **Do** keep article text in the 680px column at 1.8 line-height.
- **Do** keep base element styles (html, body, headings, selection, focus) inside `@layer base` so utilities can override them.
- **Do** respect reduced motion: the global rule collapses animations and transitions, and the accessibility panel can pause them.

### Don't:
- **Don't** add dark mode or any `dark:` utility; PolishPal is light mode only.
- **Don't** use the legacy `blue-*` indigo scale outside the Polaris CMS.
- **Don't** use faint for text; it is for icons and decoration only (2.6:1 on white).
- **Don't** put eyebrow or kicker labels above headings.
- **Don't** put coloured side borders thicker than 1px on callouts; callouts are tinted fills with rounded corners.
- **Don't** set white text below 24px (or 18.66px bold) on teal, orange or sun; they fail AA with white (3.29, 2.94 and under 2:1). Emerald (#15803d) passes at 5.0:1. Orange and sun path nodes use ink numerals.
- **Don't** replace a press edge with a blurred drop shadow, or put blurred shadows on tiles at rest.
- **Don't** make headings, chips or body text uppercase; uppercase is for buttons and nav triggers.
- **Don't** use a category's hue to decorate something outside that category.
- **Don't** imply sign-up, accounts or payment anywhere in the UI.
