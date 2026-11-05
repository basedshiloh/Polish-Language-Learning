# PolishPal mascot concepts — Phase 1

The starting commit was verified as `36dbe23 New PolishPal logo: Hello bloom papercut tulip (#6)`, on branch `brand/mascot`. `AGENTS.md` and `DESIGN.md` were read before drawing. These are three original, manually constructed SVG studies for character selection. Production assets, site code, styles, and mascot data have not been changed.

Open [index.html](index.html) directly in a browser. It uses the existing self-hosted Fredoka and Nunito files in `design/logo-concepts/fonts`, and the existing production logo. No server, package installation, or network is needed to view it.

## A. Bociek — BOH-chek — recommended

A white stork with a long beak, ink wing tips, crimson stepping legs, and a small crimson-and-sun striped scarf. Its natural palette fits PolishPal, while its silhouette stays distinct from the tulip logo.
Separate upper/lower beak shapes provide a useful speaking mechanism; shoulder pivots let the wings wave, and the neck and legs can tilt and hop. The head/beak/wing silhouette remains recognisable in the 48px-high proof.
This is the strongest direction for a kind pronunciation buddy: an expressive bird with a clear reason to talk, without the round green shape of an owl mascot.

## B. Żubek — ZHOO-bek

A sun-yellow bison calf with hooked white horns, a papercut mane, broad ink hooves, and a diamond clasp. Żubek is a proposed brand nickname inspired by żubr, rather than a claim about an established Polish pet name.
The head and mane tilt together, the hoof-ended arms rotate at the shoulders, and a separate mouth opens inside the broad muzzle. The horn span and sturdy stance survive at 48px, although the nostrils and smile become small details.
A patient, grounded alternative with a much stockier silhouette than Bociek. The compact muzzle gives it less range for pronunciation animation than the stork’s hinged beak.

## C. Iskra — EES-krah

An eight-lobed wycinanka with a sunny face, a small ink body, and folded-paper arms and legs. It walks as a folk cutout: there is no plant stem, leaf, pot, or tulip crown.
The whole rosette can tilt at the neck, while its central eyes/mouth and paper arms move independently. Broad lobes and angular limbs keep a readable 48px silhouette; the fuchsia cuts become texture at that size.
The most graphic connection to the decorative papercut world, with a more abstract cultural identity than the two animals. A viable wildcard, but less directly connected to pronunciation than Bociek.

Names are proposals; pronunciations are friendly English approximations, not phonetic transcriptions.

## What is included

Each `concept-*.svg` is a standalone waving character, so it can be viewed at small sizes without shrinking an entire contact sheet. Its companion `concept-*-expressions.svg` contains three cropped head studies in this order: happy, talking, and encouraging “oops.” The comparison page labels the expressions in HTML; the SVG art contains no text.

All main studies use `viewBox="0 0 400 480"`, with the standing foot on the y=448 ground reference. The face/parts are grouped, IDs are prefixed by concept and expression, and provisional shoulder/hip/neck/beak pivots are included. These groups are a concept-stage starting point, not the completed Phase 2 rig contract: hidden blink/lip-sync variants, twelve production poses, the manifest, model sheet, and animation demo will be built only after selection.

Every contour uses the same 8-unit ink outline, rounded caps and joins. Interior color cuts and pupil shapes may be unoutlined. Artwork uses only ink `#1E2132`, white `#FFFFFF`, crimson `#D91F3B`, sun `#FFC21A`, and, for Iskra’s paper cuts, fuchsia `#D6338A`. Background samples use the specified white, canvas `#F6F7FA`, and crimson. No gradients, filters, raster embeddings, SVG text, or external references are present in the character SVGs.

## Verification

- All six SVGs parsed as XML, with required accessible root attributes, unique IDs, palette compliance, and a single contour stroke width.
- Rendered each character at 48/96/160/320px wide against white/canvas/crimson: 36 size/background raster checks. The comparison uses those same native widths.
- Also inspected each character at 48px **high**, in full color and as a solid silhouette, to check the stricter small-size reading.
- All three expression sheets rendered successfully; no main character touches its canvas edges. All standing feet meet the same ground reference.
- [artwork-proof.png](artwork-proof.png) is a Sharp-rendered SVG proof sheet, composed and opened with Pillow at 1500×1440. It is **not** a screenshot of the HTML comparison or of the application.
- Playwright/Chromium was attempted. macOS denied its MachPortRendezvousServer registration, so browser layout, font loading, and mobile overflow could not be verified here. No browser screenshots are claimed. The page only references local resources; networking is not required for viewing it.
- No npm packages were installed. No application files, blog files, environment files, or production mascot assets were changed. No app build is needed for this isolated art comparison.

To regenerate the hand-drawn SVG studies and static page:

```sh
python3 design/mascot/concepts/build-concepts.py
```

Where the existing Playwright/Chromium installation can launch, capture and check the HTML at desktop and phone widths:

```sh
node design/mascot/concepts/render.mjs
```

## Added file inventory

All files are in `design/mascot/concepts/`:

- `concept-a.svg`
- `concept-a-expressions.svg`
- `concept-b.svg`
- `concept-b-expressions.svg`
- `concept-c.svg`
- `concept-c-expressions.svg`
- `index.html`
- `artwork-proof.png`
- `build-concepts.py`
- `render.mjs`
- `README.md`

Phase 1 stops here for the character choice. Recommendation: **A — Bociek**.
