export type LinkType = 'internal' | 'external';

export interface AuditedLink {
  anchor: string;
  url: string;
  type: LinkType;
}

export interface DuplicateLink {
  url: string;
  count: number;
  type: LinkType;
}

export interface LinkAudit {
  id: string;
  title: string;
  kind: 'Post' | 'Lesson' | 'Grammar';
  url: string; // the page's own URL
  internal: number;
  external: number;
  links: AuditedLink[];
  duplicates: DuplicateLink[];
}

const SITE = 'polishpal.pl';

function classify(url: string): LinkType | null {
  const u = url.trim();
  if (!u || u.startsWith('#') || u.startsWith('mailto:') || u.startsWith('tel:')) return null;
  if (u.startsWith('/')) return 'internal';
  if (/^https?:\/\//i.test(u)) return u.toLowerCase().includes(SITE) ? 'internal' : 'external';
  return null; // bare relative text — ignore
}

// Find markdown links + bare URLs in a block of text.
export function extractLinks(text: string): AuditedLink[] {
  const links: AuditedLink[] = [];

  const mdRe = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m: RegExpExecArray | null;
  while ((m = mdRe.exec(text)) !== null) {
    const type = classify(m[2]);
    if (type) links.push({ anchor: m[1].trim(), url: m[2].trim(), type });
  }

  // Strip markdown links, then catch any remaining bare URLs.
  const noMd = text.replace(mdRe, ' ');
  const urlRe = /(https?:\/\/[^\s)<>"'\\]+)/g;
  while ((m = urlRe.exec(noMd)) !== null) {
    const type = classify(m[1]);
    if (type) links.push({ anchor: m[1], url: m[1].replace(/[.,;]+$/, ''), type });
  }

  return links;
}

function findDuplicates(links: AuditedLink[]): DuplicateLink[] {
  const counts = new Map<string, { count: number; type: LinkType }>();
  for (const l of links) {
    const key = l.url.replace(/\/$/, '').toLowerCase();
    const rec = counts.get(key);
    if (rec) rec.count += 1;
    else counts.set(key, { count: 1, type: l.type });
  }
  return [...counts.entries()]
    .filter(([, v]) => v.count > 1)
    .map(([url, v]) => ({ url, count: v.count, type: v.type }));
}

export function auditFromText(
  text: string,
  meta: { id: string; title: string; kind: LinkAudit['kind']; url: string }
): LinkAudit {
  const links = extractLinks(text);
  return {
    ...meta,
    internal: links.filter((l) => l.type === 'internal').length,
    external: links.filter((l) => l.type === 'external').length,
    links,
    duplicates: findDuplicates(links),
  };
}
