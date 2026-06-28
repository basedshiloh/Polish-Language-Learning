# Publishing PolishPal posts via the CMS API (for agents)

This is the operational runbook for creating/updating a blog post through the CMS HTTP
API and getting its images to render. Read this **together with**
[`blog-authoring.md`](blog-authoring.md) — that file owns the writing/SEO rules; this
file owns the publishing mechanics and the image gotcha that has bitten us repeatedly.

> TL;DR of the hard-won lesson: **content lives in the database, images must be
> self-hosted in `public/blog/` and committed to git.** Do **not** rely on the
> `/api/cms/upload` endpoint's returned URLs for post images — see
> [Images](#images-the-important-part) below.

---

## How content is stored

The live blog renders from the Supabase **`posts` table**, not from
`src/content/blog/*.md`. Those legacy markdown files + the `src/data/blog.ts` array are
**not used for live rendering** anymore — editing them alone does nothing. `src/lib/posts.ts`
(`getPostBySlug` / `getPublishedPosts`) reads published rows from the DB.

So a post = a DB row. Images = files in `public/blog/` deployed via git. You always touch
**both** systems.

---

## Step 1 — Write the post

Follow [`blog-authoring.md`](blog-authoring.md): intro paragraphs first (no opening `<h2>`),
no "Conclusion" heading, Rank Math on-page rules, and run its self-check script. Keep the
markdown body in a local file while you iterate.

Pick **one** category from: `learning-tips`, `grammar-deep-dive`, `culture`,
`pronunciation`, `vocabulary`.

## Step 2 — Images (the important part)

### Do NOT trust `/api/cms/upload` output

There is an upload endpoint:

```
POST https://www.polishpal.pl/api/cms/upload
Authorization: Bearer <pp_… key>
(multipart form, field "file")
→ { "url": "https://<project>.supabase.co/storage/v1/object/public/blog-images/<name>.webp" }
```

It converts via `sharp` and stores to Supabase Storage. **In practice the resulting files
have been served corrupt** (observed June 2026): the WebP RIFF header size did not match
the file size, and some files had an invalid WebP signature/fourcc. Such files return
HTTP 200 and look fine to `curl`/`file`, but **browsers cannot decode them, so they render
as broken images.** This produced multiple rounds of "the image still isn't showing"
even though every server-side check passed.

Also, even when the bytes are valid, an external image URL only renders through a plain
`<img>` tag, not `next/image` — see the renderer note below.

### Do THIS instead: self-host valid WebP in `public/blog/`

1. **Get a source image.** Pexels works well (API key is provided to agents out of band).
   Download the JPG/PNG original.

2. **Convert to WebP locally and validate it.** `sips` on macOS can *read* WebP but
   **cannot write** it, and `cwebp`/Homebrew are not installed here. Use **Python Pillow**:

   ```python
   from PIL import Image
   im = Image.open("source.jpg").convert("RGB")
   w, h = im.size
   if w > 1200:                      # cap width; keeps files small
       im = im.resize((1200, round(h * 1200 / w)), Image.LANCZOS)
   im.save("public/blog/<slug>-<name>.webp", "WEBP", quality=82, method=6)
   ```

   Then **verify integrity** before trusting the file:

   ```python
   f = open(path, "rb").read()
   assert f[8:12] == b"WEBP", "bad signature"
   assert int.from_bytes(f[4:8], "little") + 8 == len(f), "RIFF size != filesize"
   ```

   If a file fails either assert, it is corrupt — regenerate it. (You can also `Read` the
   `.webp` in the agent harness to eyeball that it decodes; resize to ≤2000px first if the
   tool rejects large dimensions.)

3. **Name files** `<slug>-<purpose>.webp`, e.g. `polish-swear-words-featured.webp`,
   `polish-swear-words-conversation.webp`.

4. **Reference them as root-relative paths**: `/blog/<slug>-<name>.webp` — in both the
   markdown body image tags **and** the `featuredImage` field.

   This matters because of `src/components/blog/MarkdownRenderer.tsx`: it only routes an
   image through `next/image` (optimization, AVIF/WebP negotiation) when `src.startsWith('/')`.
   A full `https://…` URL falls through to a bare `<img>` and is **not** optimized. Local
   `/blog/…` paths are the convention all 16+ existing posts use and the only reliably
   rendering one.

   > Note: `next.config.ts` does allowlist the Supabase host in `images.remotePatterns`, so
   > the *featured* image can technically be an external URL and still optimize — but keep
   > everything self-hosted for consistency and to avoid the corruption problem above.

## Step 3 — Save the post (DB row) via the API

```bash
curl -X POST https://www.polishpal.pl/api/cms/posts \
  -H "Authorization: Bearer <pp_… key>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "save",
    "post": {
      "title": "…",
      "content": "## markdown body with /blog/… image paths",
      "excerpt": "…",
      "metaDescription": "…",
      "focusKeyword": "…",
      "category": "vocabulary",
      "tags": ["…"],
      "summary": ["TL;DR point 1", "point 2"],
      "featuredImage": "/blog/<slug>-featured.webp",
      "featuredImageAlt": "alt text with the focus keyword",
      "status": "draft"
    }
  }'
```

API behaviour notes:

- `action: "save"` **requires the full post** (title, content, …) every call, even when
  updating an existing row. A partial payload returns `400 "Title is required"`.
- Pass **`"id": "<uuid>"`** to update an existing row; omit it to create a new one.
- Pass **`"slug"`** to set a clean slug (e.g. `polish-swear-words`). If you omit it, the
  API auto-derives the slug from the title (e.g. `polish-swear-words-15-essential-…`).
- `status` is `"draft"` or `"published"`. Prefer **`draft`** first for anything sensitive
  or public-facing; flip to `published` once reviewed.
- Response: `{ "ok": true, "id": "<uuid>", "slug": "<slug>" }`.

## Step 4 — Deploy the images + bust the ISR cache

```bash
git add public/blog/<slug>-*.webp
git commit -m "Add images for <slug> post"
git push origin HEAD:main      # repo: basedshiloh/Polish-Language-Learning, deploys on push to main
```

The post page is **ISR** (`revalidate = 3600`, `dynamicParams = true`,
`generateStaticParams` in `src/app/blog/[slug]/layout.tsx`):

- **Pushing to `main` triggers a fresh Vercel deploy**, which both ships the new images and
  re-bakes the page (picking up the latest DB content). This is the cleanest way to publish.
- **ISR 404 trap:** if you load a slug's URL *before* its DB row exists, Next caches a 404
  for up to an hour. Always create the row first; if you hit a stale 404, push an
  (even empty) commit to `main` to force a rebuild.

## Step 5 — Verify like the browser does

HTTP 200 is **not** proof an image renders. Verify the bytes:

```bash
# wait for deploy, then for each image:
curl -s https://www.polishpal.pl/blog/<slug>-<name>.webp -o /tmp/x.webp
python3 -c "f=open('/tmp/x.webp','rb').read(); \
  print('OK' if (f[8:12]==b'WEBP' and int.from_bytes(f[4:8],'little')+8==len(f)) else 'CORRUPT')"
```

Also confirm the live HTML routes images through `next/image` and there are **no** raw
external `<img>` tags left:

```bash
curl -s https://www.polishpal.pl/blog/<slug> | grep -oE '_next/image\?url=%2Fblog%2F[^"&]*' | sort -u
curl -s https://www.polishpal.pl/blog/<slug> | grep -c 'gdtbogshuqmayallpgmk.supabase.co'   # want 0
```

A normal page load (hard-refresh once if you previously loaded a broken version — browsers
cache failed image loads) should then show every image.

---

## Checklist

- [ ] Post written per `blog-authoring.md`, self-check script passes
- [ ] One valid category chosen
- [ ] Images converted to WebP **locally** (Pillow), **RIFF-validated**, named `<slug>-*.webp`
- [ ] Images referenced as `/blog/<slug>-*.webp` in body **and** `featuredImage`
- [ ] DB row saved via `/api/cms/posts` (full payload; `id` to update; `slug` for clean slug)
- [ ] `public/blog/*.webp` committed and pushed to `main`
- [ ] Deployed image bytes RIFF-validated; live HTML uses `next/image`, zero external `<img>`
