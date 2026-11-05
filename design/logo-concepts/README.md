# PolishPal logo concepts — Phase 1

**Selected: A — Hello bloom.** See [the implementation and verification notes](chosen/README.md) for Phase 2. The comparison below preserves the three original proposals.

Open `index.html` directly in a browser. Fonts are local subsets copied from the existing redesign build cache, so the comparison works offline. Fredoka and Nunito are distributed under the SIL Open Font License; see `fonts/OFL-Fredoka.txt` and `fonts/OFL-Nunito.txt`.

## A — Hello bloom (recommended)
A folded-paper tulip with three crown cuts, two leaves, and a central stem connects the symbol to Polish wycinanki and the site’s flower motif.
Wide shapes and open cuts keep the crown and leaf pair readable at 16px; this is the strongest fit with the existing brand language.

## B — The friendly Ł
A custom path-drawn Ł combines a sturdy upright with a broad rising diagonal: Polish orthography as a complete symbol.
The diagonal remains visible at 16px. It is the simplest silhouette, although its Polish association depends on recognising the letter.

## C — A little back-and-forth
Two opposing quotation cuts suggest equal partners taking turns, without a speech bubble or character mascot.
At 16px the two halves remain separate and their counters stay open; the idea is more abstract and less specifically Polish than A or B.

## Color and cropping

Each master has a transparent background and a crimson fill. Use the identical geometry in white on crimson/ink backgrounds, or ink for monochrome reproduction. The comparison includes all five requested sizes in all four treatments. The app mockups use a crimson background and white mark, with the full drawing inside the central 80%-diameter safe circle.

The concepts are original hand-drawn vector studies. Phase 1 left production assets unchanged; Phase 2 implements the selected concept A.

## Verification and screenshot status

- All three masters have exactly two paths, a 512 viewBox, the required accessible attributes, and no text, raster images, or gradients.
- Sharp successfully rasterized all three concepts at 16, 32, 48, 180, and 512px in all four color treatments (60 checks). `size-proof.png` shows native-size examples; it is a raster contact sheet, not a browser screenshot. Pillow opened it at 1000 × 860.
- Every visible pixel fits inside the central 80%-diameter maskable safe circle.
- Chromium could not launch in the current sandbox: macOS denied its MachPortRendezvousServer registration. Therefore `preview.png` has not been generated, and browser layout/font rendering remains unverified.
- To produce the requested full-page screenshot and individual 16/512px Chromium proofs, run `node design/logo-concepts/render.mjs` from the repository root where Playwright and Chromium are available and permitted to launch. This script also checks fonts, sample sizes, resource failures, and horizontal overflow.
- Production build and application checks are deferred to Phase 2, after a concept is selected; no application code has changed.
