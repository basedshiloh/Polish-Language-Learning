import { lessons } from '@/data/lessons';
import { grammarTopics } from '@/data/grammar';
import { quizzes } from '@/data/quizzes';

export interface LinkTarget {
  title: string;
  url: string;
  type: 'Lesson' | 'Grammar' | 'Quiz' | 'Blog';
  keywords: string[];
  isPillar?: boolean;
}

function keywordsFromTitle(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

// Build the index of internal pages that posts can link to.
// `extraPosts` lets the editor include other published blog posts.
export function buildInternalLinkIndex(
  extraPosts: { title: string; slug: string; tags?: string[]; isPillar?: boolean }[] = []
): LinkTarget[] {
  const targets: LinkTarget[] = [];

  for (const l of lessons) {
    targets.push({ title: l.title, url: `/lessons/${l.id}`, type: 'Lesson', keywords: keywordsFromTitle(l.title) });
  }
  for (const g of grammarTopics) {
    const kw = keywordsFromTitle(g.title);
    if (g.polishTitle) kw.push(...keywordsFromTitle(g.polishTitle));
    targets.push({ title: g.title, url: `/grammar/${g.id}`, type: 'Grammar', keywords: kw });
  }
  for (const q of quizzes) {
    targets.push({ title: q.title, url: `/quizzes/${q.id}`, type: 'Quiz', keywords: keywordsFromTitle(q.title) });
  }
  for (const p of extraPosts) {
    const kw = keywordsFromTitle(p.title);
    if (p.tags) kw.push(...p.tags.map((t) => t.toLowerCase()));
    targets.push({ title: p.title, url: `/blog/${p.slug}`, type: 'Blog', keywords: kw, isPillar: p.isPillar });
  }

  return targets;
}

export interface LinkSuggestion {
  phrase: string;
  url: string;
  title: string;
  type: LinkTarget['type'];
  isPillar?: boolean;
}

// Suggest internal links: a target matches if its full title (or a strong
// multi-word keyword) appears in the content and isn't already a link.
export function suggestLinks(content: string, index: LinkTarget[]): LinkSuggestion[] {
  const lower = content.toLowerCase();
  const out: LinkSuggestion[] = [];
  const seen = new Set<string>();

  // Strip existing markdown links so we don't double-suggest
  const existingLinks = new Set<string>();
  const linkRe = /\]\((\/[^)]+)\)/g;
  let m;
  while ((m = linkRe.exec(content)) !== null) existingLinks.add(m[1]);

  for (const t of index) {
    if (existingLinks.has(t.url)) continue;
    const titleLc = t.title.toLowerCase();
    let phrase: string | null = null;

    if (titleLc.length >= 6 && lower.includes(titleLc)) {
      // find original-cased phrase
      const idx = lower.indexOf(titleLc);
      phrase = content.slice(idx, idx + t.title.length);
    } else {
      // try a strong 2-word keyword combo from the title
      const strong = t.keywords.filter((k) => k.length > 4);
      for (const k of strong) {
        if (lower.includes(k)) {
          const idx = lower.indexOf(k);
          phrase = content.slice(idx, idx + k.length);
          break;
        }
      }
    }

    if (phrase && !seen.has(t.url)) {
      seen.add(t.url);
      out.push({ phrase, url: t.url, title: t.title, type: t.type, isPillar: t.isPillar });
    }
  }

  // Prioritize pillar posts — agents/authors should link to them first.
  out.sort((a, b) => Number(b.isPillar) - Number(a.isPillar));
  return out.slice(0, 12);
}
