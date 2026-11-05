# Żubek — PolishPal's study buddy

**Selected concept: B, the bison calf.** Name: **Żubek**, friendly English pronunciation **ZHOO-bek**. The name is a proposed brand nickname inspired by żubr, not a claim that it is an established Polish pet name.

Żubek is patient, curious, quietly confident, and pleased to practise alongside the learner. The sun-yellow body, white hooked horns, ink muzzle and hooves, and crimson diamond clasp preserve the selected concept. The mane has broad papercut cuts, rather than realistic fur. The character accompanies the crimson tulip logo without taking its shape or replacing it.

This is an art and animation-rig handoff. There is no React component, GSAP dependency, audio integration, placement code, or site styling change. The only new site data is `src/data/mascot.json`.

## Review the art

- [All twelve poses](poses.html): 48/96/160/320px widths on white, canvas `#F6F7FA`, and crimson.
- [Offline rig demo](rig-demo.html): all twelve inline puppets, pose picker, background buttons, blink/talk/wave/tilt/hop/happy-eyes/reset controls.
- [Model sheet](model-sheet.svg): front view, proportions, ground line and named parts. Annotation lettering is vector paths, not SVG text.
- [Expression sheet](expressions.svg): neutral, happy, small/large talking, kind “oops,” and dozing.
- [Pose artwork proof](pose-proof.png), [model proof](model-sheet-proof.png), [expression proof](expressions-proof.png): SVG raster renders, **not browser screenshots**.

Open the HTML files directly. They embed the demo SVGs or load local assets and existing self-hosted fonts; they do not fetch data or need a server/network. The readable JS source is `rig-demo.js`; the generator embeds it in `rig-demo.html` so the demo also works with `file://`.

## Personality and voice

Żubek speaks in short, friendly **first-person English**. One or two sentences are enough. The character shares the work, gives the learner time, and treats mistakes as ordinary parts of practice.

Examples:

- Greeting: “I’m Żubek. Let’s try one small step.”
- Correct answer: “I’m cheering for you. Nicely done!”
- Try again: “I’m with you. We can give it another try.”
- Polish word: “I’ll start with tak (tahk): yes.”

Teach at most one Polish word at a time, with a short English pronunciation approximation and a verified meaning. Do not invent grammar, cultural facts, translations, pronunciation rules, progress, streaks, accounts, saved work, payments, reminders, or features. Use only information supplied by the actual lesson or product. Żubek does not claim to be a real teacher, a native speaker, or a person who has personally visited a place.

Do:

- Keep the broad horn/mane/hoof silhouette and the selected proportions.
- Use one Żubek per view region and choose the pose that matches the actual moment.
- Keep encouragement calm and specific to what the learner actually did.
- Let open palms/hooves, raised brows and a small smile carry the “oops” expression.
- Keep the eight-unit ink contour and exact palette. Use white/canvas/crimson backgrounds as shown.

Don't:

- Add tears, angry brows, crossed eyes, a disappointed frown, guilt, ridicule, or pressure to maintain a streak.
- Turn the character into a realistic brown bison, a round green bird, a tulip, a national eagle, or a flag costume.
- Add gradients, filters, raster embeddings, SVG text, extra outfit detail, or a new outline weight.
- Place a speech balloon inside the artwork. Product copy and speech bubbles belong in accessible HTML.
- Promise a feature or celebrate progress the application has not confirmed.

## Shared rig contract

Every production pose uses `viewBox="0 0 400 480"`, ground **y=448**, landing anchor **(200,448)**, and the same 8-unit ink contour with round caps/joins. The neutral figure is 378 units from the horn tips to the ground, before stroke; its face and body contours are shared between poses. The celebration pose bends its legs clear of the ground instead of changing the canvas, head/body position, core pivots or landing anchor. There is no hidden per-pose translation to compensate for.

Sides `l` and `r` mean the **viewer's** left and right.

Each named part is a `<g>` with:

```xml
<g id="zubek-hello-arm-l" data-part="arm-l" data-pivot="139 263">…</g>
```

IDs are prefixed by pose (`zubek-hello-*`, `zubek-read-*`, etc.), so different poses can be inlined together. If the **same** pose is inlined twice, the consuming component must add an instance prefix; HTML IDs must still be unique. Select parts relative to that SVG root, rather than querying the whole document.

All pivot coordinates are in the root SVG's user units, not CSS pixels, percentages, or bounding-box fractions. Every part has a pivot, including stable reference points for non-rotating groups. Core pivots are identical in all twelve files; the prop grip/anchor varies by pose and is recorded in the manifest.

| Part | Pivot | Responsibility |
| --- | --- | --- |
| `shadow` | 200 454 | Flat translucent ink ellipse; sibling of the character motion wrapper |
| `body` | 200 330 | Shared sun-yellow torso |
| `head` | 201 270 | Head, horns, eyes, lids, muzzle and mouth; rotate the whole face here |
| `eye-l` | 160 170 | Open pupil and happy-eye variants |
| `eye-r` | 240 170 | Open pupil and happy-eye variants |
| `lid-l` | 160 170 | Closed left-eye curve |
| `lid-r` | 240 170 | Closed right-eye curve |
| `mouth` | 200 246 | Three exclusive lip-sync states |
| `arm-l` | 139 263 | Left shoulder; hoof belongs to this arm |
| `arm-r` | 269 276 | Right shoulder; hoof belongs to this arm |
| `leg-l` | 160 359 | Left hip; hoof belongs to this leg |
| `leg-r` | 248 357 | Right hip; hoof belongs to this leg |
| `accessory` | 203 308 | Crimson collar and diamond clasp, attached to the torso |
| `prop` | Per pose | Board, book, arcs, confetti, question mark, moon, cards, trophy or suitcase; empty slot where no prop applies |

Hierarchy:

```text
svg [fixed viewBox; role=img; short aria-label]
├─ g [data-part=shadow]
└─ g [data-rig=character; data-pivot="200 448"]
   └─ g [data-rig=stance; no default transform]
      ├─ leg-l, leg-r
      ├─ body
      ├─ head
      │  ├─ eye-l, eye-r [open/happy variants]
      │  ├─ lid-l, lid-r
      │  └─ mouth [closed/open-s/open-l variants]
      ├─ accessory
      ├─ prop
      └─ arm-l, arm-r
```

Hop the `[data-rig="character"]` wrapper to move everything together while leaving the shadow on the ground. The demo uses translations only for its hop. It uses explicit SVG-space origins for rotations and never scales anything to zero; blink's optional eye compression stops at 0.12 before swapping to the lids. The actual stylesheet/WAAPI behavior still needs browser validation, especially in Safari.

Props are intentionally a shared scene slot, painted in front of the torso and behind the hooves. For a holding gesture, coordinate prop motion with the relevant arm(s); there is no automatic inverse kinematics. A wave in the demo exercises the shoulder pivot even on a holding pose; product waves should normally use `hello`.

### Eye and mouth states

The neutral/default rig has open eyes and hidden lids. Every eye part contains `data-state="open"` and `data-state="happy"` groups. Set **each variant's** `visibility` explicitly and reveal the lid groups for a blink. Hiding only a parent with `visibility` is insufficient when a child explicitly declares `visibility="visible"`.

Pose defaults are deliberate:

- `celebrate` starts with the happy-eye variant visible.
- `sleep` starts with both lid groups visible and pupil/happy-eye groups hidden.
- Every other pose starts with open pupils and hidden lids.
- Every pose includes every variant, so any pose can blink or use happy eyes.

Every mouth starts **closed**, including `speak`. Its three direct child groups are:

```xml
<g data-state="closed" visibility="visible">…</g>
<g data-state="open-s" visibility="hidden">…</g>
<g data-state="open-l" visibility="hidden">…</g>
```

Keep exactly one mouth state visible. The `speak` prop's sound arcs communicate the pose's purpose while the static mouth remains closed. The demo cycles the three states with illustrative timing, then returns to closed; it does not synthesize speech or claim phoneme/audio alignment.

`data-default-eyes` and `data-default-mouth` on each root, plus `defaultEyes/defaultMouth` in the manifest, define Reset behavior. The demo preserves the current happy-eye expression across a blink and restores the selected pose on Reset.

### Manifest and poses

`src/data/mascot.json` contains the name, pronunciation approximation, canvas, ground, outline, palette, side convention and motion selector. Each of the twelve entries supplies the production file, short alt text, all parts, actual pivots, defaults, stance offset and suggested placements. It is data only.

| Pose | Art cue | Intended placements |
| --- | --- | --- |
| `hello` | Raised hoof wave | Home hero, about, first visit |
| `speak` | Open gesture and sound arcs | Pronunciation, speak buttons |
| `teach` | Hoof points to a diagram board | Lessons, grammar tables, tips |
| `read` | Open book | Blog, grammar reference |
| `think` | Hoof by chin, curious brows | Quiz question, did you know |
| `celebrate` | Raised hooves, bent legs, confetti, happy eyes | Correct answer, lesson complete |
| `oops` | Encouraging shrug and raised brows | Wrong answer, try again |
| `confused` | Shrug and path-drawn question mark | 404, no search results |
| `sleep` | Closed lids, folded arms, moon | Empty state, no progress yet |
| `cards` | Two geometric flashcards | Vocabulary, flashcards |
| `trophy` | Star cup | Progress, streaks |
| `travel` | Small suitcase | Travel phrases, culture posts |

## Regeneration and verification

No packages were installed. The art and manifest generator uses Python's standard library:

```sh
python3 design/mascot/build-zubek.py
python3 design/mascot/validate-rig.py
node --check design/mascot/rig-demo.js
node --check design/mascot/render.mjs
```

With the existing project Sharp dependency and Python Pillow available:

```sh
node design/mascot/raster-proof.mjs
```

This checks all 12 poses at 4 widths on 3 backgrounds (144 raster checks), then independently changes XML expression states and SVG-space transforms for 132 default/state/motion-bound fixtures. It rejects empty output and artwork touching the viewBox edges, including the demo's wave/head/hop limits. It also renders both sheets, composes the three labelled PNG proofs, and opens those PNGs with Pillow. The actual machine-readable result is in `verification.json`.

In this worktree, dependencies were read from the existing main checkout using `NODE_PATH`; nothing was installed or added to the app's dependency files. The 12 production SVGs are approximately 4.4–5 KB each, below the 15 KB limit. Static validation checks all 14 parts, hierarchy, core pivots, per-pose prop anchors, unique IDs across poses and sheets, default visibility, exact fills and ink contours, accessible labels, and local resource references. Character SVGs contain no text, gradients, filters, raster images, external references, scripts or CSS.

To verify the native browser demo and capture the requested HTML screenshots with an existing permitted Playwright/Chromium installation:

```sh
node design/mascot/render.mjs
```

The script checks the pose matrix, font/image loading and phone overflow; exercises 84 pose/action combinations and reduced-motion behavior; and saves `poses-preview.png`, `rig-demo-preview.png`, and `rig-demo-mobile.png`.

**Environment limitation:** Chromium was attempted but macOS denied its MachPortRendezvousServer registration. Consequently those browser screenshots were not produced. WAAPI/CSS pivot behavior, real desktop/mobile HTML layout, and Safari behavior remain unverified. The raster motion-bound checks verify SVG geometry, not browser animation. The demo is implemented, but its native runtime check must be run by Claude in a browser-enabled environment.

The demo has no idle loops or autoplay. It checks `prefers-reduced-motion`: transform gestures stay still when reduced motion is enabled, while expression changes remain usable. Product integration must additionally connect the site's “Pause animations” control, off-screen pausing, audio timing and accessibility behavior; none of that product code is part of this art task. No application build or site screenshots were claimed.

## Added Phase 2 file inventory

Production artwork:

- `public/mascot/zubek-hello.svg`
- `public/mascot/zubek-speak.svg`
- `public/mascot/zubek-teach.svg`
- `public/mascot/zubek-read.svg`
- `public/mascot/zubek-think.svg`
- `public/mascot/zubek-celebrate.svg`
- `public/mascot/zubek-oops.svg`
- `public/mascot/zubek-confused.svg`
- `public/mascot/zubek-sleep.svg`
- `public/mascot/zubek-cards.svg`
- `public/mascot/zubek-trophy.svg`
- `public/mascot/zubek-travel.svg`

Data:

- `src/data/mascot.json`

Design, demo, source, validation and proof files:

- `design/mascot/README.md`
- `design/mascot/model-sheet.svg`
- `design/mascot/expressions.svg`
- `design/mascot/poses.html`
- `design/mascot/rig-demo.html`
- `design/mascot/rig-demo.js`
- `design/mascot/build-zubek.py`
- `design/mascot/validate-rig.py`
- `design/mascot/render.mjs`
- `design/mascot/raster-proof.mjs`
- `design/mascot/compose-proof.py`
- `design/mascot/pose-proof.png`
- `design/mascot/model-sheet-proof.png`
- `design/mascot/expressions-proof.png`
- `design/mascot/verification.json`

No `src/app`, `src/components`, site styles, blog files, dependency manifests, environment files or original logo assets were edited. Phase 1's concept files remain historical proposals; this handoff implements the user's selection of Żubek.
