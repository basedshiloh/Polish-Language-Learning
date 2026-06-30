import type { Post } from '@/lib/types';
import { extractLinks } from '@/lib/link-audit';

export interface ClusterNode {
  id: string;
  title: string;
  slug: string;
  category: string;
  seoScore: number;
  intent: string;
  linksToPillar: boolean; // does this cluster post actually link to its pillar?
}

export interface PillarNode {
  id: string;
  title: string;
  slug: string;
  category: string;
  seoScore: number;
  intent: string;
  clusters: ClusterNode[];
}

export interface ContentGraph {
  pillars: PillarNode[];
  unclustered: ClusterNode[]; // posts with no pillar assignment and not a pillar
}

// Does `post` contain an internal link to /blog/<targetSlug> in its markdown?
function postLinksTo(post: Post, targetSlug: string): boolean {
  const target = `/blog/${targetSlug}`.toLowerCase().replace(/\/$/, '');
  return extractLinks(post.content).some(
    (l) => l.type === 'internal' && l.url.toLowerCase().replace(/\/$/, '') === target
  );
}

function toNode(p: Post, linksToPillar = false): ClusterNode {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    seoScore: p.seoScore,
    intent: p.intent,
    linksToPillar,
  };
}

export function buildContentGraph(posts: Post[]): ContentGraph {
  const byId = new Map(posts.map((p) => [p.id, p]));
  const pillars: PillarNode[] = posts
    .filter((p) => p.isPillar)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      seoScore: p.seoScore,
      intent: p.intent,
      clusters: [],
    }));
  const pillarById = new Map(pillars.map((p) => [p.id, p]));

  const unclustered: ClusterNode[] = [];

  for (const p of posts) {
    if (p.isPillar) continue;
    if (p.pillarId && pillarById.has(p.pillarId)) {
      const pillarPost = byId.get(p.pillarId)!;
      pillarById.get(p.pillarId)!.clusters.push(toNode(p, postLinksTo(p, pillarPost.slug)));
    } else {
      unclustered.push(toNode(p));
    }
  }

  // sort clusters: unlinked first (need attention), then by score
  for (const pillar of pillars) {
    pillar.clusters.sort((a, b) => Number(a.linksToPillar) - Number(b.linksToPillar) || a.seoScore - b.seoScore);
  }

  return { pillars, unclustered };
}
