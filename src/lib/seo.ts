import type { Metadata } from 'next';

// One place that builds every public page's <title>, description, canonical,
// Open Graph and Twitter tags.
//
// Why: Next.js merges metadata shallowly. A segment that sets its own
// `openGraph` object replaces the parent's whole object, so the root og:image
// was silently dropped on every page that customised its OG title. Pages that
// set no OG at all inherited the HOME og:title and og:url instead. Building the
// full set here means no page can end up half-tagged again.

export const SITE_URL = 'https://www.polishpal.pl';
export const SITE_NAME = 'PolishPal';

export const DEFAULT_OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'PolishPal: learn Polish free, A0 to A1',
};

export const RSS_ALTERNATE = {
  'application/rss+xml': [{ url: '/blog/rss.xml', title: 'PolishPal Blog' }],
};

const BRAND_SUFFIX = ` | ${SITE_NAME}`;
export const TITLE_MAX = 65;
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 160;

/**
 * Page title with the brand appended last. The brand is skipped when the title
 * already names it (no "PolishPal ... | PolishPal") or when it would push the
 * title past TITLE_MAX.
 */
export function brandedTitle(title: string): string {
  const t = title.trim();
  if (t.toLowerCase().includes(SITE_NAME.toLowerCase())) return t;
  return (t + BRAND_SUFFIX).length <= TITLE_MAX ? t + BRAND_SUFFIX : t;
}

type Extra = string | false | null | undefined;

/**
 * Build a meta description from page data: start with the lead sentence, then
 * for each extra slot append the first alternative that keeps the total within
 * DESCRIPTION_MAX. Pass alternatives longest first. If the lead alone is too
 * long it is cut at a word boundary.
 */
export function composeDescription(lead: string, ...slots: (Extra | Extra[])[]): string {
  let out = clip(lead.trim(), DESCRIPTION_MAX);
  for (const slot of slots) {
    const options = (Array.isArray(slot) ? slot : [slot]).filter((o): o is string => !!o);
    for (const option of options) {
      const next = `${out} ${option.trim()}`;
      if (next.length <= DESCRIPTION_MAX) {
        out = next;
        break;
      }
    }
  }
  return out;
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > 80 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, '')}…`;
}

interface PageMetaInput {
  /** Title without the brand; the brand is appended when it fits. */
  title: string;
  description: string;
  /** Path starting with "/", e.g. "/lessons/phonetics". */
  path: string;
  type?: 'website' | 'article';
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  robots?: Metadata['robots'];
  article?: { publishedTime?: string; modifiedTime?: string; authors?: string[]; tags?: string[] };
}

export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  images,
  robots,
  article,
}: PageMetaInput): Metadata {
  const full = brandedTitle(title);
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE];
  return {
    // absolute: nested layouts with plain-string titles break the root
    // "%s | PolishPal" template, so every page states its final title.
    title: { absolute: full },
    description,
    // `alternates` is replaced wholesale too, so the RSS link rides along here.
    alternates: { canonical: path, types: RSS_ALTERNATE },
    ...(robots ? { robots } : {}),
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      locale: 'en_US',
      title: full,
      description,
      images: ogImages,
      ...(type === 'article' && article ? article : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: full,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}
