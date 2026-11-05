import { getPostListing } from '@/lib/posts';
import { blogCategoryStyles } from '@/data/blog';
import { SITE_URL } from '@/lib/seo';

// RSS 2.0 feed of the 30 newest posts. Advertised from the root layout via
// <link rel="alternate" type="application/rss+xml">.
export const revalidate = 3600;

const FEED_SIZE = 30;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function abs(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

function imageType(path: string): string {
  if (path.endsWith('.avif')) return 'image/avif';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/webp';
}

export async function GET() {
  const posts = (await getPostListing()).slice(0, FEED_SIZE);
  const lastBuild = posts[0] ? new Date(posts[0].updatedDate || posts[0].date) : new Date();

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const cats = p.categories.map((c) => `      <category>${esc(blogCategoryStyles[c]?.label ?? c)}</category>`).join('\n');
      const image = p.featuredImage
        ? `\n      <enclosure url="${esc(abs(p.featuredImage))}" type="${imageType(p.featuredImage)}" length="0" />`
        : '';
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <dc:creator>${esc(p.author.name)}</dc:creator>
      <description>${esc(p.metaDescription || p.excerpt)}</description>
${cats}${image}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>PolishPal Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Polish culture, words and grammar, explained by people who love the language.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/icon-192.png</url>
      <title>PolishPal Blog</title>
      <link>${SITE_URL}/blog</link>
    </image>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
