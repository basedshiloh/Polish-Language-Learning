The old speech-bubble/Ł/heart logo lost definition at favicon size. Replace it with the selected “Hello bloom” papercut tulip: a flat, two-path crimson mark with white and ink variants, circle-safe app icons, and a tighter favicon crop.

Header, footer, and mobile drawer pair a 36px mark with the live Fredoka 600 wordmark at 22px. Dark mode reverses the mark to white. Refresh social sharing artwork with “Learn Polish free,” add the manifest, update Apple icon metadata and theme color, and record the change in the changelog.

## Replaced assets

- `public/logo.svg`
- `src/app/favicon.ico` — native 16/32/48px frames
- `public/og-image.png` — 1200×630

## Added assets

- `public/logo-white.svg`, `public/logo-ink.svg`
- `public/icon-192.png`, `public/icon-512.png` — opaque, maskable-safe
- `public/apple-touch-icon.png` — opaque 180×180
- `public/fonts/fredoka-latin.woff2` and license
- Three original concepts, comparison HTML, raster proofs, and reproducible generation/screenshot scripts

The base checkout did not have a manifest or app-icon PNGs, so those are added. Existing JSON-LD and contributor-avatar URLs continue to resolve through `/logo.svg`. Blog images are untouched. Two pre-existing JSX quote errors in CMS helper text were escaped to allow the full lint check to pass.

## Validation

- TypeScript: passed.
- ESLint: passed, 20 existing warnings.
- Pillow: every final PNG and each ICO frame opened at its expected size; app/Apple icons are fully opaque.
- 60 size/color raster checks passed; geometry fits the central 80% safe circle.
- Supplemental Webpack production build passed using exact cached Inter font files. Generated HTML includes the new marks, wordmark, Apple icon, manifest, and crimson theme color.
- Default `next build` remains pending in an unrestricted environment: Google Fonts DNS is blocked here. Turbopack’s internal port binding is also restricted.
- Runtime browser screenshots remain pending: the environment denies both the production server’s port binding and Chromium’s macOS process registration. The images below are asset proofs, not application screenshots. Capture the header/footer at 1280px/390px and mobile drawer with `node scripts/screenshot-brand.mjs` before review.
- Vercel preview failure is expected because Supabase variables are Production-only; do not use that check as a blocker.

## Artwork

![Final asset proof](https://raw.githubusercontent.com/basedshiloh/Polish-Language-Learning/brand/new-logo/design/logo-concepts/chosen/asset-proof.png)

![OG artwork](https://raw.githubusercontent.com/basedshiloh/Polish-Language-Learning/brand/new-logo/public/og-image.png)

Do not merge. The requested unrestricted default build and browser screenshots are still outstanding.
