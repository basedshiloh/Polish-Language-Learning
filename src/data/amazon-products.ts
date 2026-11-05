// Details for Amazon affiliate cards, keyed by ASIN (for books, the ISBN-10).
//
// A paragraph in post markdown that holds nothing but an amazon.com link renders
// as a product card (see AmazonCard). The card reads title/author/cover from here;
// an ASIN missing from this list still renders, using the link text as the title.
//
// Covers: self-hosted WebP in public/blog/amazon-<asin>.webp (Open Library covers,
// ~240px wide). Do not copy images from Amazon's pages: the Associates agreement
// only allows Amazon images served through its own tools.

export interface AmazonProduct {
  title: string;
  author: string;
  /** Short factual line, e.g. the translator. No prices or ratings (Amazon rules). */
  note?: string;
  image?: string;
}

export const amazonProducts: Record<string, AmazonProduct> = {
  '1939810000': {
    title: 'Pan Tadeusz: The Last Foray in Lithuania',
    author: 'Adam Mickiewicz',
    note: 'Translated by Bill Johnston (2018)',
    image: '/blog/amazon-1939810000.webp',
  },
  '0781805503': {
    title: 'Quo Vadis',
    author: 'Henryk Sienkiewicz',
    note: 'Translated by W. S. Kuniczak',
    image: '/blog/amazon-0781805503.webp',
  },
  '0679728562': {
    title: 'The Captive Mind',
    author: 'Czesław Miłosz',
    note: 'Nonfiction classic on writers under communism',
    image: '/blog/amazon-0679728562.webp',
  },
  '0544705157': {
    title: 'Map: Collected and Last Poems',
    author: 'Wisława Szymborska',
    note: 'Translated by Clare Cavanagh and Stanisław Barańczak',
    image: '/blog/amazon-0544705157.webp',
  },
  '0525541330': {
    title: 'Drive Your Plow Over the Bones of the Dead',
    author: 'Olga Tokarczuk',
    note: 'Translated by Antonia Lloyd-Jones',
    image: '/blog/amazon-0525541330.webp',
  },
  '0306810387': {
    title: 'Madame Curie: A Biography',
    author: 'Eve Curie',
    note: 'Translated by Vincent Sheean',
    image: '/blog/amazon-0306810387.webp',
  },
  '0156027607': {
    title: 'Solaris',
    author: 'Stanisław Lem',
    note: 'Translated by Joanna Kilmartin and Steve Cox',
    image: '/blog/amazon-0156027607.webp',
  },
  '0316029181': {
    title: 'The Last Wish: Introducing the Witcher',
    author: 'Andrzej Sapkowski',
    note: 'Translated by Danusia Stok',
    image: '/blog/amazon-0316029181.webp',
  },
  '1452110557': {
    title: 'From a Polish Country House Kitchen',
    author: 'Anne Applebaum & Danielle Crittenden',
    note: '90 recipes for Polish home cooking',
  },
};

export function amazonAsin(href: string): string | null {
  const m = href.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?#]|$)/i);
  return m ? m[1].toUpperCase() : null;
}
