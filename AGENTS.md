<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Writing blog articles

Before writing or editing any blog post, read **[`docs/agent-mistakes-to-avoid.md`](docs/agent-mistakes-to-avoid.md)** first — it lists the exact errors that have caused broken posts in production. Then read **[`docs/blog-authoring.md`](docs/blog-authoring.md)**.
It is the required format and SEO ruleset for PolishPal posts: the three files to touch
(`src/content/blog/<slug>.md`, `src/data/blog.ts`, `public/blog/`), the markdown conventions
(start with intro paragraphs not an `<h2>`, end with no "Conclusion" heading), the internal-link
**card** system (`/lessons/…` and `/grammar/…` render as cards), and the Rank Math on-page rules.
Run the self-check script in that guide before publishing.

# Publishing via the CMS API + images

To publish/update a post through the CMS HTTP API (the `posts` table is the live source,
not the legacy markdown files) and to get images to actually render, read
**[`docs/cms-api-publishing.md`](docs/cms-api-publishing.md)**. Critical gotcha: **do not
rely on `/api/cms/upload` for post images** — its output has rendered as corrupt/broken in
browsers. Convert images to WebP locally (Pillow), validate RIFF integrity, self-host them
in `public/blog/` referenced as `/blog/<slug>-*.webp`, and `git push` to `main` to deploy.
