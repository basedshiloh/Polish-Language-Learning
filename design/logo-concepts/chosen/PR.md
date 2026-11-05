The old speech-bubble/Ł/heart logo lost definition at favicon size. This replaces it with the approved concept A, “Hello bloom”: a flat, two-path crimson papercut tulip inspired by wycinanki, with white and ink variants, circle-safe app icons and a tighter favicon crop.

The header and mobile drawer pair a 36px mark with the existing live Fredoka 600 “Polish**Pal**” wordmark at 22px. The crimson footer uses the white mark with an all-white 22px wordmark. Social sharing artwork now reads “Learn Polish free”. The manifest gains maskable icon entries, the viewport declares the crimson theme color, and the changelog records the change (4.0.1).

The branch was first built on a pre-redesign checkout, so `origin/main` (the “Wycinanki Pop” redesign plus later work) is merged in. Code conflicts were resolved in favour of main, with the logo changes re-applied on top. The approved artwork is byte-identical to the implementation commit, apart from fixing the SVG `aria-label` typo (“PolishPallogo” → “PolishPal logo”).

## Replaced assets

- `public/logo.svg`: new master mark, 512 viewBox, two paths
- `src/app/favicon.ico`: native 16/32/48px frames
- `public/icon-192.png`, `public/icon-512.png`: opaque, maskable-safe
- `public/apple-touch-icon.png`: opaque 180×180
- `public/og-image.png`: 1200×630, “Learn Polish free”

## Added assets

- `public/logo-white.svg`, `public/logo-ink.svg` (same geometry)
- `design/logo-concepts/`: three original concepts, comparison page `index.html`, `preview.png`, Chromium size proofs, `chosen/` notes, the asset proof and browser screenshots
- `scripts/generate-brand-assets.mjs`, `scripts/assemble-brand-assets.py`, `scripts/screenshot-brand.mjs`

## Code changes

- `Topbar.tsx`: header mark unclipped (`rounded-[10px]` removed); drawer mark 32px → 36px with the 22px wordmark and a “PolishPal home” label
- `Footer.tsx`: white mark at 36px on the crimson footer (replaces the white tile), 22px wordmark
- `layout.tsx`: `viewport.themeColor` `#D91F3B`; root OG alt “PolishPal — Learn Polish free”
- `manifest.ts`: maskable entries for both PNG icons
- `changelog/page.tsx`: 4.0.1 entry
- `PostEditor.tsx`: escape two JSX quotes in CMS helper text (visible text unchanged)

JSON-LD Organization/publisher logos and contributor avatars keep pointing to `/logo.svg`, so they pick up the new mark without changes. No blog images, `public/blog/*` edits, blog content or environment files are part of this change.

## Verification

- `npx tsc --noEmit`: passed.
- `npx eslint`: 0 errors, 18 warnings, all in untouched files or main's existing code.
- `npx next build`: passed (default Turbopack build, Google Fonts fetched normally, 161 static pages).
- `node design/logo-concepts/render.mjs`: passed. Fonts loaded, no overflow, 12 samples at all 5 sizes, `preview.png` saved.
- `npx next start --port 3000` + `node scripts/screenshot-brand.mjs`: passed.
  - Header, footer and drawer marks each render at exactly 36×36 and decode.
  - No horizontal overflow at 1280px or 390px.
  - The mobile menu button is hidden at 1280px.
  - The site is light-only since the redesign (no theme switcher), so there are no dark-mode captures.
- Served HTML includes `theme-color` `#D91F3B`, the favicon (`.ico` + SVG), the 180px Apple touch icon and the manifest. The manifest declares 192/512 PNGs as `any` and `maskable`.
- Pillow:
  - The 192, 512 and 180 icons and the OG image are opaque at their exact sizes and contain the exact `#D91F3B`.
  - The ICO holds exactly 16/32/48 frames, each with transparency and crimson.
- Vercel preview failure is expected because Supabase variables are Production-only; it is not a blocker.

## Screenshots

Header, 1280px
![Header 1280](https://raw.githubusercontent.com/basedshiloh/Polish-Language-Learning/brand/new-logo/design/logo-concepts/chosen/screenshots/header-1280-light.png)

Header, 390px · Mobile drawer, 390px
![Header 390](https://raw.githubusercontent.com/basedshiloh/Polish-Language-Learning/brand/new-logo/design/logo-concepts/chosen/screenshots/header-390-light.png)
![Mobile drawer 390](https://raw.githubusercontent.com/basedshiloh/Polish-Language-Learning/brand/new-logo/design/logo-concepts/chosen/screenshots/mobile-menu-390-light.png)

Footer, 1280px
![Footer 1280](https://raw.githubusercontent.com/basedshiloh/Polish-Language-Learning/brand/new-logo/design/logo-concepts/chosen/screenshots/footer-1280-light.png)

Footer, 390px
![Footer 390](https://raw.githubusercontent.com/basedshiloh/Polish-Language-Learning/brand/new-logo/design/logo-concepts/chosen/screenshots/footer-390-light.png)

## Artwork

![OG artwork](https://raw.githubusercontent.com/basedshiloh/Polish-Language-Learning/brand/new-logo/public/og-image.png)

![Final asset proof](https://raw.githubusercontent.com/basedshiloh/Polish-Language-Learning/brand/new-logo/design/logo-concepts/chosen/asset-proof.png)

![Concept comparison](https://raw.githubusercontent.com/basedshiloh/Polish-Language-Learning/brand/new-logo/design/logo-concepts/preview.png)
