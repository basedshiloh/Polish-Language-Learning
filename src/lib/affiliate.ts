// Amazon Associates (amazon.com, US store).
//
// Authors write plain Amazon links in post markdown, e.g.
//   [Solaris](https://www.amazon.com/dp/0156027607)
// and the renderer adds the tracking tag and rel="sponsored" on its own.
// The tag only earns on amazon.com, so other Amazon stores (.co.uk, .de, .pl…)
// are left untagged. amzn.to short links already carry a tag of their own.

export const AMAZON_TAG = 'polishpal-20';

export const AMAZON_DISCLOSURE =
  'As an Amazon Associate, PolishPal earns from qualifying purchases.';

const AMAZON_COM = /^(?:www\.|smile\.)?amazon\.com$/i;
const AMAZON_ANY = /^(?:[\w-]+\.)*amazon\.[a-z.]{2,6}$|^(?:www\.)?amzn\.(?:to|com)$|^a\.co$/i;

function parse(href: string | undefined): URL | null {
  if (!href || !/^https?:\/\//i.test(href)) return null;
  try {
    return new URL(href);
  } catch {
    return null;
  }
}

/** Any Amazon storefront or Amazon short link. */
export function isAmazonUrl(href: string | undefined): boolean {
  const url = parse(href);
  return !!url && AMAZON_ANY.test(url.hostname);
}

/** Adds (or replaces) the PolishPal tag on amazon.com links; returns other URLs unchanged. */
export function withAmazonTag(href: string): string {
  const url = parse(href);
  if (!url || !AMAZON_COM.test(url.hostname)) return href;
  url.searchParams.set('tag', AMAZON_TAG);
  return url.toString();
}

/** True when a markdown/HTML body links to Amazon (drives the in-article disclosure). */
export function hasAmazonLinks(content: string): boolean {
  const re = /https?:\/\/[^\s)"'<>\]]+/g;
  for (const m of content.matchAll(re)) {
    if (isAmazonUrl(m[0])) return true;
  }
  return false;
}
