// RankMath-style on-page SEO analysis (client-safe, pure functions).

export interface SeoInput {
  title: string;
  metaDescription: string;
  slug: string;
  focusKeyword: string;
  content: string; // markdown body
}

export interface SeoCheck {
  id: string;
  label: string;
  passed: boolean;
  hint: string;
}

export interface SeoResult {
  score: number; // 0-100
  checks: SeoCheck[];
  wordCount: number;
  density: number; // %
}

export function analyzeSeo(input: SeoInput): SeoResult {
  const kw = input.focusKeyword.trim().toLowerCase();
  const title = input.title.toLowerCase();
  const meta = input.metaDescription.toLowerCase();
  const slug = input.slug.toLowerCase();
  const content = input.content;
  const contentLc = content.toLowerCase();

  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // keyword density
  let kwCount = 0;
  if (kw) {
    const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    kwCount = (contentLc.match(re) || []).length;
  }
  const density = wordCount > 0 && kw ? (kwCount / wordCount) * 100 : 0;

  // first paragraph (first non-empty line block)
  const firstPara = (content.split(/\n\s*\n/).find((b) => b.trim().length > 0) || '').toLowerCase();
  // subheadings
  const subheadings = (content.match(/^#{2,3}\s+.+$/gm) || []).map((h) => h.toLowerCase());
  const internalLinks = (content.match(/\]\(\/[^)]+\)/g) || []).length;
  const images = (content.match(/!\[[^\]]*\]\([^)]+\)/g) || []);
  const imagesWithAlt = images.filter((i) => /!\[[^\]]+\]/.test(i)).length;

  const checks: SeoCheck[] = [
    {
      id: 'kw-title',
      label: 'Focus keyword in the SEO title',
      passed: !!kw && title.includes(kw),
      hint: 'Add the focus keyword to the title.',
    },
    {
      id: 'kw-meta',
      label: 'Focus keyword in the meta description',
      passed: !!kw && meta.includes(kw),
      hint: 'Use the focus keyword in the meta description.',
    },
    {
      id: 'kw-slug',
      label: 'Focus keyword in the URL slug',
      passed: !!kw && slug.includes(kw.replace(/\s+/g, '-')),
      hint: 'Include the focus keyword in the slug.',
    },
    {
      id: 'kw-first',
      label: 'Focus keyword in the first paragraph',
      passed: !!kw && firstPara.includes(kw),
      hint: 'Mention the focus keyword early, in the intro.',
    },
    {
      id: 'kw-subheading',
      label: 'Focus keyword in a subheading (H2/H3)',
      passed: !!kw && subheadings.some((h) => h.includes(kw)),
      hint: 'Add the focus keyword to at least one subheading.',
    },
    {
      id: 'density',
      label: 'Keyword density 0.5%–2.5%',
      passed: density >= 0.5 && density <= 2.5,
      hint: `Current density ${density.toFixed(2)}%. Aim for 0.5–2.5%.`,
    },
    {
      id: 'length',
      label: 'Content is at least 600 words',
      passed: wordCount >= 600,
      hint: `Currently ${wordCount} words. Longer content ranks better.`,
    },
    {
      id: 'title-len',
      label: 'SEO title ≤ 60 characters',
      passed: input.title.length > 0 && input.title.length <= 60,
      hint: `Title is ${input.title.length} chars. Keep it ≤ 60.`,
    },
    {
      id: 'meta-len',
      label: 'Meta description 50–160 characters',
      passed: input.metaDescription.length >= 50 && input.metaDescription.length <= 160,
      hint: `Meta is ${input.metaDescription.length} chars. Aim for 50–160.`,
    },
    {
      id: 'internal-link',
      label: 'At least one internal link',
      passed: internalLinks >= 1,
      hint: 'Link to a related lesson or grammar page (Link Genius helps).',
    },
    {
      id: 'image-alt',
      label: 'At least one image with alt text',
      passed: imagesWithAlt >= 1,
      hint: 'Add an image with descriptive alt text.',
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return { score, checks, wordCount, density };
}
